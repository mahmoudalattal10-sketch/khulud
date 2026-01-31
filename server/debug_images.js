const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 DIAGNOSTIC: Inspecting Hotel Image URLs...");
    const hotels = await prisma.hotel.findMany({
        select: { id: true, name: true, image: true, images: true }
    });

    console.log(`Found ${hotels.length} hotels.`);

    hotels.forEach(h => {
        console.log(`\n🏨 Hotel: ${h.name} (${h.id})`);
        console.log(`   Main Image: '${h.image}'`);
        // Safe logging for images array
        if (Array.isArray(h.images)) {
            console.log(`   Gallery: [${h.images.length} items]`, h.images.slice(0, 3));
        } else {
            console.log(`   Gallery Raw: '${h.images}'`);
        }
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
