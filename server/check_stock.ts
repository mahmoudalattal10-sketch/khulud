
import { PrismaClient } from '@prisma/client';

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

    // Check city names too
    const cities = await prisma.hotel.findMany({ select: { city: true, location: true } });
    console.log("Hotel Cities:", cities.map(c => c.city));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
