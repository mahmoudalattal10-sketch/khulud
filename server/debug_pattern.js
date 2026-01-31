const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 TIMESTAMP SEARCH: Looking for '1769'...");
    const pattern = "1769";

    // 1. Hotels
    const hotels = await prisma.hotel.findMany({
        where: {
            OR: [
                { image: { contains: pattern } },
                { images: { contains: pattern } }
            ]
        },
        select: { id: true, name: true, image: true, images: true }
    });

    console.log(`Found ${hotels.length} hotels with pattern.`);
    hotels.forEach(h => {
        console.log(`\n🏨 Hotel: ${h.name}`);
        console.log(`   Image: ${h.image}`);
        console.log(`   Gallery: ${JSON.stringify(h.images)}`);
    });

    // 2. Rooms (Manual scan because Prisma arrays)
    const rooms = await prisma.room.findMany({
        select: { id: true, name: true, images: true }
    });

    const relevantRooms = rooms.filter(r => JSON.stringify(r.images).includes(pattern));
    console.log(`\nFound ${relevantRooms.length} rooms with pattern.`);
    relevantRooms.forEach(r => {
        console.log(`\n🛏️ Room: ${r.name}`);
        console.log(`   Images: ${JSON.stringify(r.images)}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
