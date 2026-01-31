const Database = require('better-sqlite3');
const path = require('path');
const db = new Database('../prisma/dev.db');

const tables = ['Hotel', 'Room', 'HotelImage', 'HotelAmenity', 'NearbyPlace', 'Review', 'User', 'Booking'];

console.log('--- SQLite Data Counts ---');
for (const table of tables) {
    try {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
        console.log(`${table}: ${count.count}`);
    } catch (e) {
        console.log(`${table}: Table not found or error`);
    }
}
db.close();
