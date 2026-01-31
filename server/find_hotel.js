const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const hotel = await prisma.hotel.findFirst({
        where: {
            name: { contains: 'Dar Al Tawhid' }
        }
    });

    if (hotel) {
        console.log("Found Hotel:");
        console.log(JSON.stringify(hotel, null, 2));
    } else {
        console.log("Hotel 'Dar Al Tawhid' NOT FOUND in database.");

        // List all hotels to see what we have
        const all = await prisma.hotel.findMany({ select: { name: true } });
        console.log("Available Hotels:", all.map(h => h.name));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
