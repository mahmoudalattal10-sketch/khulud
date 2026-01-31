
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔓 Unhiding all Makkah and Madinah hotels...');

    const result = await prisma.hotel.updateMany({
        where: {
            city: { in: ['makkah', 'madinah'] }
        },
        data: {
            isVisible: true
        }
    });

    console.log(`✅ Successfully updated ${result.count} hotels to be visible.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
