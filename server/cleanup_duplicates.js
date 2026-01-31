
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqlite = new Database('./prisma/dev.db');
const prisma = new PrismaClient();

async function cleanup() {
    console.log("🚀 Starting Deduplication (Keeping ONLY SQLite Data)...");

    // 1. Get Valid Slugs/IDs from SQLite
    const legacyHotels = sqlite.prepare("SELECT slug FROM Hotel").all();
    const validSlugs = legacyHotels.map(h => h.slug);

    console.log(`📦 SQLite contains ${validSlugs.length} valid hotels.`);

    // 2. Count current MySQL hotels
    const currentCount = await prisma.hotel.count();
    console.log(`📊 Current MySQL count: ${currentCount}`);

    // 3. Delete hotels NOT in SQLite
    const { count } = await prisma.hotel.deleteMany({
        where: {
            slug: {
                notIn: validSlugs
            }
        }
    });

    console.log(`🗑️ Deleted ${count} duplicate/generated hotels.`);

    // 4. Verify Final Count
    const finalCount = await prisma.hotel.count();
    console.log(`✅ Final Database Count: ${finalCount}`);

    if (finalCount === validSlugs.length) {
        console.log("🎉 Database is now perfectly synced with SQLite.");
    } else {
        console.warn("⚠️ Mismatch detected. Check for duplicate slugs within SQLite itself?");
    }
}

cleanup()
    .catch(e => console.error(e))
    .finally(async () => {
        sqlite.close();
        await prisma.$disconnect();
    });
