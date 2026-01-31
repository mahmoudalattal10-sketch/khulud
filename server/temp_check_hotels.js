
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking hotels in MySQL...");
    const hotels = await prisma.hotel.findMany({
        select: { name: true, id: true, slug: true }
    });
    console.log(`📦 Found ${hotels.length} hotels.`);

    const khuludHotels = hotels.filter(h => h.name.includes('خلود'));
    console.log("✨ Khulud Hotels:", JSON.stringify(khuludHotels, null, 2));

    const swiss = hotels.filter(h => h.name.toLowerCase().includes('سويس'));
    console.log("✨ Swiss Hotels:", JSON.stringify(swiss, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
