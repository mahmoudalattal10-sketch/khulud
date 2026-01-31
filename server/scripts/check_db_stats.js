
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const bookings = await prisma.booking.count();
    const confirmed = await prisma.booking.count({ where: { paymentStatus: 'PAID' } });
    const users = await prisma.user.count({ where: { role: 'USER' } });
    const sales = await prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { paymentStatus: 'PAID' }
    });

    console.log('--- Current DB Stats ---');
    console.log('Total Bookings:', bookings);
    console.log('Confirmed Bookings (PAID):', confirmed);
    console.log('Total Users (USER role):', users);
    console.log('Total Sales:', sales._sum.totalPrice || 0);
}

check().catch(console.error).finally(() => prisma.$disconnect());
