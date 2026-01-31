
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Delete PENDING bookings older than 30 minutes
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

    const deleted = await prisma.booking.deleteMany({
        where: {
            status: 'PENDING',
            createdAt: { lt: thirtyMinsAgo }
        }
    });

    console.log(`Successfully cleaned up ${deleted.count} stale PENDING bookings.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
