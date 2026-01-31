
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqlite = new Database('../prisma/dev.db');
const prisma = new PrismaClient();

async function migrateExtendedData() {
    console.log("🚀 Starting extended data migration from SQLite...");

    // 1. Fetch all SQLite data
    const sqliteHotels = sqlite.prepare("SELECT * FROM Hotel").all();
    const sqliteRooms = sqlite.prepare("SELECT * FROM Room").all();
    const sqliteAmenities = sqlite.prepare("SELECT * FROM Amenity").all();
    const sqliteHotelAmenities = sqlite.prepare("SELECT * FROM HotelAmenity").all();
    const sqliteRoomAmenities = sqlite.prepare("SELECT * FROM RoomAmenity").all();

    console.log(`📦 Loaded ${sqliteHotels.length} hotels, ${sqliteRooms.length} rooms, and ${sqliteAmenities.length} amenities.`);

    // 2. Map Amenities (Ensure all SQLite amenities exist in MySQL)
    console.log("🛠️ Syncing Amenities...");
    const amenityMap = new Map(); // SQLite ID -> MySQL ID
    for (const am of sqliteAmenities) {
        const mysqlAm = await prisma.amenity.upsert({
            where: { name: am.nameAr },
            update: {
                nameEn: am.nameEn || am.nameAr,
                icon: am.icon || null
            },
            create: {
                name: am.nameAr,
                nameEn: am.nameEn || am.nameAr,
                icon: am.icon || null
            }
        });
        amenityMap.set(am.id, mysqlAm.id);
    }

    // 3. Process Hotels
    console.log("🏨 Updating Hotels...");
    const hotelIdMap = new Map(); // SQLite ID -> MySQL ID
    for (const h of sqliteHotels) {
        try {
            const mysqlHotel = await prisma.hotel.findFirst({
                where: { name: h.name }
            });

            if (mysqlHotel) {
                hotelIdMap.set(h.id, mysqlHotel.id);

                const coords = (h.latitude && h.longitude) ? `${h.latitude},${h.longitude}` : mysqlHotel.coords;

                await prisma.hotel.update({
                    where: { id: mysqlHotel.id },
                    data: {
                        coords: coords,
                        distanceFromHaram: h.distanceFromHaram || mysqlHotel.distanceFromHaram,
                        hasFreeBreakfast: h.hasFreeBreakfast === 1,
                        hasFreeTransport: h.hasFreeTransport === 1,
                        rating: h.rating || mysqlHotel.rating,
                        reviews: h.reviewsCount || mysqlHotel.reviews,
                        // If MySQL is missing a view but SQLite has it (rare at hotel level but possible)
                        // view: mysqlHotel.view || "" // The schema has 'view' but SQLite Hotel usually doesn't focus on it.
                    }
                });

                // Link Hotel Amenities
                const hotelAmLinks = sqliteHotelAmenities.filter(la => la.hotelId === h.id);
                for (const link of hotelAmLinks) {
                    const mysqlAmId = amenityMap.get(link.amenityId);
                    if (mysqlAmId) {
                        await prisma.hotelAmenity.upsert({
                            where: {
                                hotelId_amenityId: {
                                    hotelId: mysqlHotel.id,
                                    amenityId: mysqlAmId
                                }
                            },
                            update: {},
                            create: {
                                hotelId: mysqlHotel.id,
                                amenityId: mysqlAmId
                            }
                        });
                    }
                }
                console.log(`✅ Updated hotel: ${h.name}`);
            } else {
                console.warn(`⚠️ Hotel not found in MySQL: ${h.name}`);
            }
        } catch (e) {
            console.error(`❌ Error updating hotel ${h.name}: ${e.message}`);
        }
    }

    // 4. Process Rooms
    console.log("🛏️ Updating Rooms...");
    for (const r of sqliteRooms) {
        try {
            const mysqlHotelId = hotelIdMap.get(r.hotelId);
            if (!mysqlHotelId) continue;

            const mysqlRoom = await prisma.room.findFirst({
                where: {
                    hotelId: mysqlHotelId,
                    name: r.name
                }
            });

            if (mysqlRoom) {
                await prisma.room.update({
                    where: { id: mysqlRoom.id },
                    data: {
                        area: r.area || mysqlRoom.area,
                        beds: r.beds || mysqlRoom.beds,
                        view: r.view || mysqlRoom.view,
                        mealPlan: r.mealPlan || mysqlRoom.mealPlan,
                        availableStock: r.availableRooms || mysqlRoom.availableStock
                    }
                });

                // Link Room Features (from RoomAmenity)
                const roomAmLinks = sqliteRoomAmenities.filter(ra => ra.roomId === r.id);
                for (const link of roomAmLinks) {
                    const am = sqliteAmenities.find(a => a.id === link.amenityId);
                    if (am) {
                        // Check if feature already exists
                        const exists = await prisma.roomFeature.findFirst({
                            where: { roomId: mysqlRoom.id, name: am.nameAr }
                        });
                        if (!exists) {
                            await prisma.roomFeature.create({
                                data: {
                                    roomId: mysqlRoom.id,
                                    name: am.nameAr
                                }
                            });
                        }
                    }
                }
                console.log(`✅ Updated room: ${r.name} in hotel ${r.hotelId}`);
            } else {
                // If room doesn't exist, we might want to create it, but for now let's just update
                console.warn(`⚠️ Room not found in MySQL: ${r.name} for hotel ${r.hotelId}`);
            }
        } catch (e) {
            console.error(`❌ Error updating room ${r.name}: ${e.message}`);
        }
    }

    console.log("🎉 Extended migration finished successfully!");
}

migrateExtendedData()
    .catch(console.error)
    .finally(async () => {
        sqlite.close();
        await prisma.$disconnect();
    });
