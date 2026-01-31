const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 FINAL CHECK: Finding remaining Unsplash images...");
    const hotels = await prisma.hotel.findMany({
        where: {
            image: {
                contains: 'unsplash'
            }
        },
        select: { id: true, name: true }
    });

    console.log(`Found ${hotels.length} hotels still using Unsplash.`);

    if (hotels.length > 0) {
        console.log("--- SAMPLES ---");
        hotels.slice(0, 10).forEach(h => console.log(`[${h.name}]`));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
