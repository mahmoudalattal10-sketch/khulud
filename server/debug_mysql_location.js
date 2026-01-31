
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugData() {
    try {
        const hotels = await prisma.hotel.findMany({
            select: {
                name: true,
                coords: true,
                distanceFromHaram: true,
                view: true
            },
            take: 20
        });

        console.log("--- MySQL Data Debug (Sample 20) ---");
        console.table(hotels);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

debugData();
