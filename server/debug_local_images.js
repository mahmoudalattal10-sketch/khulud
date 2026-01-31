const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 DIAGNOSTIC: Finding LOCAL uploads...");
    const hotels = await prisma.hotel.findMany({
        where: {
            NOT: {
                image: {
                    contains: 'unsplash'
                }
            }
        },
        select: { id: true, name: true, image: true }
    });

    console.log(`Found ${hotels.length} hotels with local images.`);

    hotels.forEach(h => {
        console.log(`\n🏨 Hotel: ${h.name}`);
        console.log(`   Image: '${h.image}'`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
