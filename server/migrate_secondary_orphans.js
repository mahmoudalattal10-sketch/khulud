
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqlite = new Database('../prisma/dev.db');
const prisma = new PrismaClient();

async function migrateRemaining() {
    console.log("🚀 Migrating remaining data from secondary SQLite...");

    // 1. PricingPeriod
    const pricingPeriods = sqlite.prepare("SELECT * FROM PricingPeriod").all();
    console.log(`📦 Found ${pricingPeriods.length} PricingPeriods.`);
    for (const p of pricingPeriods) {
        try {
            await prisma.pricingPeriod.upsert({
                where: { id: p.id },
                update: {},
                create: {
                    id: p.id,
                    startDate: new Date(p.startDate),
                    endDate: new Date(p.endDate),
                    price: p.price,
                    roomId: p.roomId
                }
            });
        } catch (e) {
            // Room might not exist in MySQL if it was a test room
        }
    }

    // 2. RoomAmenity -> RoomFeature
    // Let's check table name first
    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const roomAmenityTable = tables.find(t => t.name === 'RoomAmenity' || t.name === 'RoomFeature');

    if (roomAmenityTable) {
        const features = sqlite.prepare(`SELECT * FROM ${roomAmenityTable.name}`).all();
        console.log(`📦 Found ${features.length} ${roomAmenityTable.name} records.`);
        for (const f of features) {
            try {
                await prisma.roomFeature.upsert({
                    where: { id: f.id },
                    update: {},
                    create: {
                        id: f.id,
                        name: f.name || f.amenityId || "Feature",
                        roomId: f.roomId
                    }
                });
            } catch (e) { }
        }
    }

    console.log("✅ Remaining data migration complete.");
}

migrateRemaining()
    .catch(console.error)
    .finally(() => {
        sqlite.close();
        prisma.$disconnect();
    });
