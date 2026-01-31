
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('--- 🔍 DATABASE INSPECTOR: HOTEL COORDINATES ---');
    try {
        const hotels = await prisma.hotel.findMany({
            select: {
                id: true,
                name: true,
                coords: true,
                updatedAt: true
            }
        });

        if (hotels.length === 0) {
            console.log('❌ No hotels found in database.');
        } else {
            hotels.forEach(hotel => {
                console.log(`🏨 Hotel: ${hotel.name}`);
                console.log(`   ID: ${hotel.id}`);
                console.log(`   Coords: "${hotel.coords}"`);
                console.log(`   Last Updated: ${hotel.updatedAt}`);
                console.log('-----------------------------------');
            });
        }
    } catch (error) {
        console.error('❌ Error reading database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
