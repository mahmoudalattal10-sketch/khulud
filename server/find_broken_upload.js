const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Look for the hotel that has the file we found on disk
    // 1769749712225-80984859.png
    const filename = '1769749712225-80984859.png';
    const hotels = await prisma.hotel.findMany({
        where: {
            image: { contains: filename }
        }
    });

    console.log(`Found ${hotels.length} hotels with this image.`);
    hotels.forEach(h => {
        console.log(`[${h.name}] Image URL: '${h.image}'`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
