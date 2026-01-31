
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const totalHotels = await prisma.hotel.count();
    const totalRooms = await prisma.room.count();
    const roomsWithStock = await prisma.room.count({
        where: { availableStock: { gt: 0 } }
    });

    console.log(`Total Hotels: ${totalHotels}`);
    console.log(`Total Rooms: ${totalRooms}`);
    console.log(`Rooms with Stock > 0: ${roomsWithStock}`);

    if (totalRooms > 0 && roomsWithStock === 0) {
        console.log("⚠️ ALL ROOMS HAVE 0 STOCK. This explains why search is empty.");
    }

    const sampleRooms = await prisma.room.findMany({
        take: 5,
        select: { name: true, availableStock: true, hotel: { select: { name: true } } }
    });
    console.log("Sample Rooms:", JSON.stringify(sampleRooms, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
