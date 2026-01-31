
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Hotel Coordinates Debug ---');
    const hotels = await prisma.hotel.findMany({
        select: {
            id: true,
            name: true,
            coords: true
        }
    });

    hotels.forEach(hotel => {
        console.log(`Hotel: ${hotel.name} (ID: ${hotel.id})`);
        console.log(`Coords: "${hotel.coords}"`);
        console.log('-----------------------------------');
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
