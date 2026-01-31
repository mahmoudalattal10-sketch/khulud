
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ARABIC_CITIES = ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة'];

async function main() {
    console.log('Cleaning up duplicate UAE hotels (Arabic city keys)...');

    const { count } = await prisma.hotel.deleteMany({
        where: {
            city: { in: ARABIC_CITIES }
        }
    });

    console.log(`✅ Deleted ${count} duplicate hotels.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
