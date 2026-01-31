
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqlite = new Database('../prisma/dev.db');
const prisma = new PrismaClient();

async function audit() {
    console.log("🔍 COMPREHENSIVE DATA AUDIT");
    console.log("===========================");

    // 1. Get all SQLite Tables
    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'").all();

    console.log(`\nFound ${tables.length} tables in SQLite:`);

    for (const t of tables) {
        const tableName = t.name;
        const sqliteCount = sqlite.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get().count;

        let mysqlCount = 0;
        try {
            // Map table names to Prisma models
            const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
            if (prisma[modelName]) {
                mysqlCount = await prisma[modelName].count();
            } else if (modelName === 'contactMessage') {
                mysqlCount = await prisma.contactMessage.count();
            } else {
                // Fallback for names that don't match exactly
                console.log(`⚠️  Could not find Prisma model for SQLite table: ${tableName}`);
                continue;
            }
        } catch (e) {
            console.log(`❌ Error counting MySQL table for ${tableName}: ${e.message}`);
        }

        const status = mysqlCount >= sqliteCount ? "✅ MIGRATED" : "❌ MISSING DATA";
        console.log(`- ${tableName.padEnd(15)} | SQLite: ${String(sqliteCount).padEnd(5)} | MySQL: ${String(mysqlCount).padEnd(5)} | ${status}`);
    }

    console.log("\n===========================");
}

audit()
    .catch(console.error)
    .finally(() => {
        sqlite.close();
        prisma.$disconnect();
    });
