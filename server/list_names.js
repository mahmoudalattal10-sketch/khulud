
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Listing Hotel Names (Ar | En)...');

    const hotels = await prisma.hotel.findMany({
        select: { name: true, nameEn: true }
    });

    console.table(hotels);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
