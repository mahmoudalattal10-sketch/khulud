
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspect() {
    const count = await prisma.hotel.count();
    console.log(`Total Hotels: ${count}`);

    const cities = ['makkah', 'madinah', 'jeddah', 'riyadh'];

    for (const city of cities) {
        const hotel = await prisma.hotel.findFirst({
            where: { city: { contains: city } },
            include: { images: true, amenities: { include: { amenity: true } } }
        });

        if (hotel) {
            console.log(`\n--- ${city.toUpperCase()} SAMPLE ---`);
            console.log(`Name: ${hotel.name}`);
            console.log(`Main Image (String): ${hotel.image}`);
            console.log(`Images Relation Count: ${hotel.images.length}`);
            console.log(`Images URLs: ${JSON.stringify(hotel.images.map(i => i.url))}`);
            console.log(`Amenities Count: ${hotel.amenities.length}`);
        } else {
            console.log(`\n--- ${city.toUpperCase()} (No hotels found) ---`);
        }
    }
}

inspect()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
