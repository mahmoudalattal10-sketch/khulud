const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteRegionalReviews() {
    console.log("🚀 Starting deletion of reviews for Makkah and Madinah...");

    const targetCities = ['makkah', 'madinah', 'مكة المكرمة', 'المدينة المنورة'];

    // 1. Find all hotels in these cities
    const hotels = await prisma.hotel.findMany({
        where: {
            city: { in: targetCities }
        },
        select: { id: true, name: true, city: true }
    });

    console.log(`🏨 Found ${hotels.length} hotels in target cities.`);

    const hotelIds = hotels.map(h => h.id);

    if (hotelIds.length === 0) {
        console.log("ℹ️ No hotels found in target cities. Exiting.");
        return;
    }

    // 2. Delete Guest Reviews for these hotels
    const deleteResult = await prisma.review.deleteMany({
        where: {
            hotelId: { in: hotelIds }
        }
    });

    console.log(`✅ Deleted ${deleteResult.count} reviews.`);

    // 3. Reset review counts on the Hotel records
    const updateResult = await prisma.hotel.updateMany({
        where: {
            id: { in: hotelIds }
        },
        data: {
            reviews: 0
        }
    });

    console.log(`✅ Reset review counts for ${updateResult.count} hotels.`);
    console.log("🎉 Deletion process complete!");
}

deleteRegionalReviews()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
