
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqlite = new Database('./prisma/dev.db');
const prisma = new PrismaClient();

async function syncGaps() {
    console.log("🚀 Syncing gaps from primary SQLite...");

    // 1. Hotels
    const sqliteHotels = sqlite.prepare("SELECT * FROM Hotel").all();
    const mysqlHotels = await prisma.hotel.findMany({ select: { id: true, slug: true } });
    const mysqlIds = new Set(mysqlHotels.map(h => h.id));
    const mysqlSlugs = new Set(mysqlHotels.map(h => h.slug));

    const missingHotels = sqliteHotels.filter(h => !mysqlIds.has(h.id) && !mysqlSlugs.has(h.slug));
    console.log(`📦 Found ${missingHotels.length} truly missing hotels.`);

    for (const h of missingHotels) {
        try {
            await prisma.hotel.create({
                data: {
                    id: h.id,
                    slug: h.slug,
                    name: h.name,
                    nameEn: h.nameEn || h.name,
                    location: h.location,
                    locationEn: h.locationEn || h.location,
                    city: h.city,
                    basePrice: h.basePrice,
                    image: h.image,
                    description: h.description,
                    coords: h.coords || ""
                }
            });
            console.log(`✅ Migrated hotel: ${h.name}`);
        } catch (e) {
            console.error(`❌ Failed to migrate hotel ${h.name}: ${e.message}`);
        }
    }

    // 2. Reviews
    const sqliteReviews = sqlite.prepare("SELECT * FROM Review").all();
    const mysqlReviewsCount = await prisma.review.count();

    // Since comparing 1300+ reviews by ID might be slow, let's just try to create any that don't exist
    let reviewsAdded = 0;
    for (const r of sqliteReviews) {
        try {
            const exists = await prisma.review.findUnique({ where: { id: r.id } });
            if (!exists) {
                await prisma.review.create({
                    data: {
                        id: r.id,
                        userName: r.userName,
                        rating: r.rating,
                        text: r.text,
                        date: r.date,
                        createdAt: new Date(r.createdAt),
                        hotelId: r.hotelId
                    }
                });
                reviewsAdded++;
            }
        } catch (e) { }
    }
    console.log(`✅ Added ${reviewsAdded} missing reviews.`);
}

syncGaps()
    .catch(console.error)
    .finally(() => {
        sqlite.close();
        prisma.$disconnect();
    });
