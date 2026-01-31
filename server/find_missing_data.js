
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMissing() {
    try {
        const allHotels = await prisma.hotel.findMany({
            select: {
                id: true,
                name: true,
                distanceFromHaram: true,
                coords: true,
                view: true
            }
        });

        const missingDistance = allHotels.filter(h => !h.distanceFromHaram || h.distanceFromHaram.trim() === '');
        const missingCoords = allHotels.filter(h => !h.coords || h.coords === '21.4225,39.8262' || h.coords === '');

        console.log(`Summary:`);
        console.log(`- Total Hotels: ${allHotels.length}`);
        console.log(`- Missing Distance: ${missingDistance.length}`);
        console.log(`- Missing Coords (or default): ${missingCoords.length}`);

        if (missingDistance.length > 0) {
            console.log("\nSample Missing Distance:");
            console.table(missingDistance.slice(0, 10).map(h => ({ name: h.name })));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkMissing();
