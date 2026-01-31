
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixStock() {
    try {
        // Update all rooms to have at least 50 stock for testing
        const update = await prisma.room.updateMany({
            data: {
                availableStock: 50
            }
        });

        console.log(`Updated ${update.count} rooms to have 50 stock.`);

        // Check again
        const rooms = await prisma.room.findMany({ select: { name: true, availableStock: true } });
        console.log('New Stock Levels:', rooms);

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

fixStock();
