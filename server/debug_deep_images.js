const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 DEEP INDICATOR: Checking Hotels and Rooms...");

    // 1. Check Hotels again, but just list the last 5 modified
    const recentHotels = await prisma.hotel.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { id: true, name: true, image: true, images: true }
    });

    console.log("--- RECENT HOTELS ---");
    recentHotels.forEach(h => {
        console.log(`[${h.name}] Main: ${h.image?.substring(0, 50)}...`);
        // Check if images is array or string
        const imgs = Array.isArray(h.images) ? h.images : [String(h.images)];
        console.log(`           Gallery: ${JSON.stringify(imgs).substring(0, 100)}...`);
    });

    // 2. Check Rooms
    const rooms = await prisma.room.findMany({
        where: {
            images: {
                // Check if images array is not empty
                isEmpty: false
            }
        },
        take: 10,
        select: { id: true, name: true, images: true }
    });

    console.log("\n--- ROOM VISUAL CHECK ---");
    rooms.forEach(r => {
        // Filter for suspect images (not unsplash)
        const imgs = Array.isArray(r.images) ? r.images : [];
        const suspect = imgs.filter(i => !i.includes('unsplash'));
        if (suspect.length > 0) {
            console.log(`[Room: ${r.name}] Local/Suspect Images:`, suspect);
        }
    });

    // 3. Specific check for localhost strings
    const localhostHotels = await prisma.hotel.findMany({
        where: {
            OR: [
                { image: { contains: 'localhost' } },
                { image: { contains: '/uploads/' } }
            ]
        }
    });
    console.log(`\n--- EXPLICIT LOCALHOST/UPLOADS CHECK ---`);
    console.log(`Found ${localhostHotels.length} hotels with 'localhost' or '/uploads/' in main image.`);
    if (localhostHotels.length > 0) {
        console.log(localhostHotels[0].image);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
