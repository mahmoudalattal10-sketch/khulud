
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqlite = new Database('../prisma/dev.db');
const prisma = new PrismaClient();

async function migrateKhuludHotels() {
    console.log("🚀 Migrating Khulud hotels from secondary SQLite...");

    const sqliteHotels = sqlite.prepare("SELECT * FROM Hotel").all();
    console.log(`📦 Found ${sqliteHotels.length} hotels in secondary SQLite.`);

    for (const h of sqliteHotels) {
        try {
            // Check if exists by name to avoid duplicates if ID differs
            const exists = await prisma.hotel.findFirst({
                where: { name: h.name }
            });

            if (!exists) {
                // Generate a slug if missing
                const slug = h.slug || `${h.nameEn || h.name}-${Date.now()}`.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

                await prisma.hotel.create({
                    data: {
                        id: h.uuid || undefined, // Use UUID if available, else let Prisma generate
                        slug: slug,
                        name: h.name,
                        nameEn: h.nameEn || h.name,
                        location: h.location,
                        locationEn: h.locationEn || h.location,
                        city: h.city,
                        country: h.country || "SA",
                        rating: h.rating || 4,
                        basePrice: h.basePrice || 0,
                        image: h.image || "",
                        description: h.description || "",
                        coords: h.coords || "21.4225,39.8262",
                        isVisible: true,
                        isFeatured: h.isFeatured ? true : false,
                        isOffer: h.isOffer ? true : false,
                        distanceFromHaram: h.distanceFromHaram || h.distance || ""
                    }
                });
                console.log(`✅ Migrated Khulud hotel: ${h.name}`);
            } else {
                console.log(`ℹ️ Hotel already exists: ${h.name}`);
            }
        } catch (e) {
            console.error(`❌ Failed to migrate hotel ${h.name}: ${e.message}`);
        }
    }

    console.log("✅ Khulud hotels migration complete.");
}

migrateKhuludHotels()
    .catch(console.error)
    .finally(() => {
        sqlite.close();
        prisma.$disconnect();
    });
