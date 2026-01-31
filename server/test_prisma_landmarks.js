
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const hotel = await prisma.hotel.findFirst({
            where: { nearbyPlaces: { some: {} } },
            include: { nearbyPlaces: true }
        });

        if (hotel) {
            console.log(`✅ Success! Found hotel "${hotel.name}" with ${hotel.nearbyPlaces.length} landmarks.`);
            console.log(JSON.stringify(hotel.nearbyPlaces, null, 2));
        } else {
            console.log("ℹ️ No hotels found with landmarks.");
        }
    } catch (e) {
        console.error("❌ Prisma Error:", e.message);
    }
}

main().finally(() => prisma.$disconnect());
