
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const serverDb = new Database('./prisma/dev.db');
const rootDb = new Database('../prisma/dev.db');

async function finalMigration() {
    console.log("🚀 Starting FINAL hybrid migration...");

    // 1. Sync Hotels from Server DB (The 256 hotels source)
    console.log("🏨 Syncing Hotels from Server DB...");
    const serverHotels = serverDb.prepare("SELECT * FROM Hotel").all();

    for (const h of serverHotels) {
        try {
            const mysqlHotel = await prisma.hotel.findFirst({
                where: { OR: [{ name: h.name }, { slug: h.slug }] }
            });

            if (mysqlHotel) {
                // Update basic fields
                await prisma.hotel.update({
                    where: { id: mysqlHotel.id },
                    data: {
                        coords: h.coords || mysqlHotel.coords,
                        distanceFromHaram: h.distanceFromHaram || mysqlHotel.distanceFromHaram,
                        view: h.view || mysqlHotel.view,
                        hasFreeBreakfast: h.hasFreeBreakfast === 1,
                        hasFreeTransport: h.hasFreeTransport === 1,
                        rating: h.rating || mysqlHotel.rating,
                        reviews: h.reviews || mysqlHotel.reviews
                    }
                });

                // Sync Amenities from JSON string
                if (h.amenities) {
                    try {
                        const amKeys = JSON.parse(h.amenities);
                        for (const key of amKeys) {
                            // Find or create amenity by key/name
                            const am = await prisma.amenity.upsert({
                                where: { name: key },
                                update: {},
                                create: { name: key, nameEn: key.charAt(0).toUpperCase() + key.slice(1) }
                            });

                            await prisma.hotelAmenity.upsert({
                                where: { hotelId_amenityId: { hotelId: mysqlHotel.id, amenityId: am.id } },
                                update: {},
                                create: { hotelId: mysqlHotel.id, amenityId: am.id }
                            });
                        }
                    } catch (e) { console.warn(`   ⚠️ Failed to parse amenities for ${h.name}`); }
                }
                console.log(`   ✅ Updated Hotel: ${h.name}`);
            }
        } catch (e) { console.error(`   ❌ Error updating ${h.name}: ${e.message}`); }
    }

    // 2. Sync Rooms/Landmarks from Root DB (The rich data source)
    console.log("\n🛏️ Syncing Rooms & Landmarks from Root DB...");
    const rootRooms = rootDb.prepare("SELECT * FROM Room").all();
    const rootLandmarks = rootDb.prepare("SELECT * FROM NearbyPlace").all();
    const rootHotels = rootDb.prepare("SELECT id, name FROM Hotel").all();
    const rootHotelMap = new Map();
    rootHotels.forEach(rh => rootHotelMap.set(rh.id, rh.name));

    // Sync Rooms
    for (const rr of rootRooms) {
        try {
            const mysqlHotel = await prisma.hotel.findFirst({
                where: { name: rootHotelMap.get(rr.hotelId) }
            });
            if (!mysqlHotel) continue;

            const mysqlRoom = await prisma.room.findFirst({
                where: { hotelId: mysqlHotel.id, name: rr.name }
            });

            if (mysqlRoom) {
                await prisma.room.update({
                    where: { id: mysqlRoom.id },
                    data: {
                        area: rr.area || mysqlRoom.area,
                        beds: rr.beds || mysqlRoom.beds,
                        view: rr.view || mysqlRoom.view,
                        mealPlan: rr.mealPlan || mysqlRoom.mealPlan
                    }
                });
                console.log(`   ✅ Updated Room: ${rr.name} in ${mysqlHotel.name}`);
            }
        } catch (e) { console.error(`   ❌ Error updating room ${rr.name}: ${e.message}`); }
    }

    // Sync Landmarks
    for (const rl of rootLandmarks) {
        try {
            const hotelName = rootHotelMap.get(rl.hotelId);
            const mysqlHotel = await prisma.hotel.findFirst({
                where: { name: hotelName }
            });
            if (!mysqlHotel) continue;

            await prisma.nearbyPlace.upsert({
                where: { id: `legacy-${rl.id}` },
                update: {
                    name: rl.name,
                    distance: rl.distance,
                    distanceMeters: rl.distanceMeters,
                    type: rl.type,
                    icon: rl.icon
                },
                create: {
                    id: `legacy-${rl.id}`,
                    name: rl.name,
                    distance: rl.distance,
                    distanceMeters: rl.distanceMeters,
                    type: rl.type,
                    icon: rl.icon,
                    hotelId: mysqlHotel.id
                }
            });
            console.log(`   ✅ Synced Landmark: ${rl.name} for ${mysqlHotel.name}`);
        } catch (e) { console.error(`   ❌ Error syncing landmark ${rl.name}: ${e.message}`); }
    }

    console.log("\n🎉 FINAL MIGRATION COMPLETE!");
}

finalMigration()
    .catch(console.error)
    .finally(async () => {
        serverDb.close();
        rootDb.close();
        await prisma.$disconnect();
    });
