
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function auditData() {
    try {
        const hotels = await prisma.hotel.findMany({
            take: 10,
            include: {
                amenities: { include: { amenity: true } },
                rooms: { take: 1 },
                nearbyPlaces: { take: 3 }
            }
        });

        console.log("--- MySQL Data Audit (Sampling 10 Hotels) ---");
        hotels.forEach(h => {
            console.log(`\nHotel: ${h.name}`);
            console.log(`- Coords: ${h.coords}`);
            console.log(`- Distance: ${h.distanceFromHaram}`);
            console.log(`- View: ${h.view}`);
            console.log(`- Amenities Count: ${h.amenities.length}`);
            console.log(`- Landmarks Count: ${h.nearbyPlaces.length}`);
            if (h.rooms.length > 0) {
                console.log(`- Sample Room: ${h.rooms[0].name} | View: ${h.rooms[0].view} | Area: ${h.rooms[0].area}`);
            }
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

auditData();
