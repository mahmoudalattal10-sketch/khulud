
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStock() {
    try {
        const rooms = await prisma.room.findMany({
            include: {
                hotel: { select: { name: true } },
                _count: {
                    select: { bookings: true }
                }
            }
        });

        console.log('--- ROOM STOCK CHECK ---');
        for (const room of rooms) {
            const activeBookings = await prisma.booking.count({
                where: {
                    roomId: room.id,
                    status: { in: ['CONFIRMED', 'PENDING'] }
                }
            });

            console.log(`Hotel: ${room.hotel.name} | Room: ${room.name}`);
            console.log(`  Stock: ${room.availableStock} | Active Bookings: ${activeBookings}`);
            console.log(`  Remaining: ${room.availableStock - activeBookings}`);
            console.log('------------------------');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkStock();
