const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // A set of high-quality, reliable Unsplash hotel images
    const images = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
        "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000"
    ];

    const hotels = await prisma.hotel.findMany();

    console.log(`Updating ${hotels.length} hotels with valid images...`);

    for (let i = 0; i < hotels.length; i++) {
        const image = images[i % images.length];
        await prisma.hotel.update({
            where: { id: hotels[i].id },
            data: {
                image: image,
                images: JSON.stringify([image])
            }
        });
    }

    console.log("✅ All hotel images updated to valid working URLs.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
