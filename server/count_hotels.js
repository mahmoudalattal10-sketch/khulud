const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const makkahCount = await prisma.hotel.count({
        where: { city: 'makkah' }
    });
    const madinahCount = await prisma.hotel.count({
        where: { city: 'madinah' }
    });
    const allCount = await prisma.hotel.count();

    const makkahHotels = await prisma.hotel.findMany({
        where: { city: 'makkah' },
        select: { name: true }
    });

    console.log({
        makkahCount,
        madinahCount,
        allCount,
        makkahHotelNames: makkahHotels.map(h => h.name)
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
