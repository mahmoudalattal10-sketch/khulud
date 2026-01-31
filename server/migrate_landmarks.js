
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqlite = new Database('../prisma/dev.db');
const prisma = new PrismaClient();

async function migrateLandmarks() {
    console.log("🚀 Migrating landmarks from SQLite...");

    const sqliteLandmarks = sqlite.prepare("SELECT * FROM NearbyPlace").all();
    console.log(`📦 Found ${sqliteLandmarks.length} landmarks in SQLite.`);

    // Map SQLite hotel IDs to SQLite hotel Names
    const sqliteHotels = sqlite.prepare("SELECT id, name FROM Hotel").all();
    const idToName = {};
    sqliteHotels.forEach(h => idToName[h.id] = h.name);

    let successCount = 0;
    for (const l of sqliteLandmarks) {
        try {
            const hotelName = idToName[l.hotelId];
            if (!hotelName) continue;

            const hotel = await prisma.hotel.findFirst({
                where: {
                    OR: [
                        { name: hotelName },
                        { name: { contains: hotelName } }
                    ]
                }
            });

            if (!hotel) {
                console.log(`⚠️  Hotel "${hotelName}" not found in MySQL for landmark "${l.name}"`);
                continue;
            }

            await prisma.nearbyPlace.upsert({
                where: { id: `sqlite-np-${l.id}` },
                update: {},
                create: {
                    name: l.name,
                    distance: l.distance,
                    distanceMeters: l.distanceMeters,
                    type: l.type,
                    icon: l.icon,
                    sortOrder: l.sortOrder,
                    hotelId: hotel.id
                }
            });
            successCount++;
        } catch (e) {
            console.error(`❌ Failed to migrate landmark ${l.name}: ${e.message}`);
        }
    }

    console.log(`✅ Landmark migration complete. Success: ${successCount}`);
}

migrateLandmarks()
    .catch(console.error)
    .finally(() => {
        sqlite.close();
        prisma.$disconnect();
    });
