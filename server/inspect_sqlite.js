
const Database = require('better-sqlite3');
const db = new Database('../prisma/dev.db');

try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log("Tables in database:", tables.map(t => t.name).join(', '));

    for (const table of tables) {
        if (table.name === 'sqlite_sequence') continue;
        console.log(`\nSchema for table: ${table.name}`);
        const info = db.prepare(`PRAGMA table_info(${table.name})`).all();
        console.table(info);
    }
} catch (e) {
    console.error(e);
} finally {
    db.close();
}
