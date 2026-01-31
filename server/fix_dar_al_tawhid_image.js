const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Valid Unsplash Image for Makkah/Hotel
    const validImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000";

    const update = await prisma.hotel.updateMany({
        where: {
            name: { contains: 'Dar Al Tawhid' }
        },
        data: {
            image: validImage,
            images: JSON.stringify([validImage])
        }
    });

    console.log(`Updated ${update.count} hotels (Dar Al Tawhid) with valid image.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
