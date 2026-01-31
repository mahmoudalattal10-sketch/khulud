
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
    try {
        const hotelCount = await prisma.hotel.count();
        const roomCount = await prisma.room.count();
        const amenityCount = await prisma.amenity.count();
        console.log(`MySQL Status:
- Hotels: ${hotelCount}
- Rooms: ${roomCount}
- Amenities: ${amenityCount}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkCounts();
