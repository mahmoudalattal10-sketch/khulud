const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 TARGETED SEARCH: Looking for known filename...");
    const filename = "1769096714881-204340428.png";

    // 1. Search in Hotels (image or images)
    const hotel = await prisma.hotel.findFirst({
        where: {
            OR: [
                { image: { contains: filename } },
                { images: { contains: filename } }
            ]
        }
    });

    if (hotel) {
        console.log(`✅ FOUND in Hotel: ${hotel.name} (${hotel.id})`);
        console.log(`   Main Image: '${hotel.image}'`);
        console.log(`   Gallery: '${JSON.stringify(hotel.images)}'`);
    } else {
        console.log(`❌ NOT FOUND in Hotels.`);
    }

    // 2. Search in Rooms
    // We have to scan all because images is JSON/String and contains is limited
    /*
    const rooms = await prisma.room.findMany({
      select: { id: true, name: true, images: true }
    });
    const foundRoom = rooms.find(r => JSON.stringify(r.images).includes(filename));
  
    if (foundRoom) {
       console.log(`✅ FOUND in Room: ${foundRoom.name} (${foundRoom.id})`);
       console.log(`   Images: '${JSON.stringify(foundRoom.images)}'`);
    } else {
       console.log(`❌ NOT FOUND in Rooms.`);
    }
    */
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
