
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Diverse Room Seeding for Makkah & Madinah...');

    // 1. Fetch relevant hotels
    const hotels = await prisma.hotel.findMany({
        where: {
            city: { in: ['makkah', 'madinah'] }
        },
        include: { rooms: true }
    });

    console.log(`Found ${hotels.length} hotels in Makkah/Madinah.`);

    for (const hotel of hotels) {
        console.log(`\nProcessing hotel: ${hotel.nameEn}`);

        // 2. Clear existing rooms
        if (hotel.rooms.length > 0) {
            await prisma.room.deleteMany({
                where: { hotelId: hotel.id }
            });
            console.log(`   - Deleted ${hotel.rooms.length} old rooms.`);
        }

        // Base price reference
        const base = hotel.basePrice || 400;

        // 3. Define the 4 room types
        const roomsData = [
            {
                name: "غرفة كلاسيك ثنائية",
                nameEn: "Classic Twin Room",
                type: "CLASSIC",
                capacity: 2,
                price: base,
                availableStock: 15,
                mealPlan: "بدون وجبات",
                view: "إطلالة مدينة",
                beds: "2 سرير فردي",
                allowExtraBed: true,
                extraBedPrice: 150,
                maxExtraBeds: 1,
                sofa: false,
                features: ["wifi", "ac", "tv", "minibar"]
            },
            {
                name: "غرفة ديلوكس ثلاثية",
                nameEn: "Deluxe Triple Room",
                type: "DELUXE",
                capacity: 3,
                price: base * 1.35,
                availableStock: 10,
                mealPlan: "إفطار مجاني",
                view: "إطلالة جزئية",
                beds: "3 سرير فردي",
                allowExtraBed: false, // Explicitly no extra bed
                extraBedPrice: 0,
                maxExtraBeds: 0,
                sofa: true,
                features: ["wifi", "ac", "safe", "coffee"]
            },
            {
                name: "جناح عائلي رباعي",
                nameEn: "Family Quad Suite",
                type: "FAMILY",
                capacity: 4,
                price: base * 1.6,
                availableStock: 8,
                mealPlan: "إفطار وعشاء",
                view: "إطلالة كاملة",
                beds: "4 سرير فردي",
                allowExtraBed: false,
                extraBedPrice: 0,
                maxExtraBeds: 0,
                sofa: true,
                features: ["wifi", "kitchen", "living_area", "two_bathrooms"]
            },
            {
                name: "الجناح الملكي",
                nameEn: "Royal Suite",
                type: "ROYAL",
                capacity: 2, // Luxury for 2
                price: base * 2.5,
                availableStock: 3,
                mealPlan: "شامل كلياً",
                view: "إطلالة مباشرة على الحرم",
                beds: "1 سرير كينج كبير",
                allowExtraBed: true,
                extraBedPrice: 250,
                maxExtraBeds: 2, // Allows 2 extra beds
                sofa: true,
                features: ["butler", "jacuzzi", "panoramic_view", "vip_access"]
            }
        ];

        // 4. Create new rooms
        for (const room of roomsData) {
            const features = room.features;
            delete room.nameEn; // If schema allows nameEn add it, otherwise mapped to desc or ignored. 
            // My schema has 'name' and 'type'. Let's keep 'name' Arabic.
            // Features are a relation.
            delete room.features;

            await prisma.room.create({
                data: {
                    ...room,
                    hotelId: hotel.id,
                    features: {
                        create: features.map(f => ({ name: f }))
                    },
                    // Add dummy images
                    images: {
                        create: [
                            { url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000" },
                            { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000" }
                        ]
                    },
                    pricingPeriods: {
                        create: {
                            startDate: new Date(),
                            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                            price: room.price
                        }
                    }
                }
            });
        }
        console.log(`   + Created 4 varied rooms.`);
    }

    console.log('\n✅ Rooms seeding completed successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
