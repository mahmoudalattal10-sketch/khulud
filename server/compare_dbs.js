
const Database = require('better-sqlite3');
const dbs = [
    { name: 'Root Prisma', path: '../prisma/dev.db' },
    { name: 'Server Prisma', path: './prisma/dev.db' }
];

dbs.forEach(dbInfo => {
    console.log(`\n--- Inspecting: ${dbInfo.name} (${dbInfo.path}) ---`);
    try {
        const db = new Database(dbInfo.path);
        const hotels = db.prepare("SELECT count(*) as c FROM Hotel").get().c;
        const rooms = db.prepare("SELECT count(*) as c FROM Room").get().c;
        console.log(`Hotels: ${hotels}, Rooms: ${rooms}`);

        const sampleHotel = db.prepare("SELECT * FROM Hotel LIMIT 1").get();
        if (sampleHotel) {
            console.log("Sample Hotel columns (subset):");
            const keys = Object.keys(sampleHotel);
            console.log(keys.filter(k => ['latitude', 'longitude', 'latitude', 'longitude', 'distanceFromHaram', 'coords', 'stars', 'location'].includes(k)));
            console.log("Sample Hotel Data:", {
                name: sampleHotel.name,
                lat: sampleHotel.latitude || sampleHotel.coords?.split(',')[0],
                lng: sampleHotel.longitude || sampleHotel.coords?.split(',')[1],
                dist: sampleHotel.distanceFromHaram
            });
        }

        const sampleRoom = db.prepare("SELECT * FROM Room LIMIT 1").get();
        if (sampleRoom) {
            console.log("Sample Room columns (subset):");
            const keys = Object.keys(sampleRoom);
            console.log(keys.filter(k => ['view', 'area', 'beds', 'mealPlan'].includes(k)));
            console.log("Sample Room Data:", {
                name: sampleRoom.name,
                view: sampleRoom.view,
                area: sampleRoom.area
            });
        }

        db.close();
    } catch (e) {
        console.error(`Error reading ${dbInfo.name}: ${e.message}`);
    }
});
