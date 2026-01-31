
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pendingBookings = await prisma.booking.findMany({
        where: { status: 'PENDING' },
        include: { user: { select: { email: true } }, room: { select: { name: true, availableStock: true } } }
    });

    console.log(`Total Pending Bookings: ${pendingBookings.length}`);
    console.log("Pending Bookings Detail:", JSON.stringify(pendingBookings, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
