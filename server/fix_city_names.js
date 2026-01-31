
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CITY_NORMALIZATION = {
    'مكة المكرمة': 'makkah',
    'المدينة المنورة': 'madinah',
    'Makkah': 'makkah',
    'Madinah': 'madinah'
};

async function main() {
    console.log('Normalizing City Names...');

    const hotels = await prisma.hotel.findMany();
    let updates = 0;

    for (const hotel of hotels) {
        const currentCity = hotel.city;
        const normalized = CITY_NORMALIZATION[currentCity];

        if (normalized) {
            console.log(`Updating ${hotel.name}: "${currentCity}" -> "${normalized}"`);
            await prisma.hotel.update({
                where: { id: hotel.id },
                data: { city: normalized }
            });
            updates++;
        }
    }

    console.log(`\n✅ Completed. Updated ${updates} hotels.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
