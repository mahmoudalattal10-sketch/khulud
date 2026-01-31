const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const UPLOADS_DIR = path.join(__dirname, 'public/uploads/hotels');

// Helper to sanitize/normalize names for comparison
function normalize(str) {
    return str.replace(/[^\w\u0600-\u06FF]/g, '').toLowerCase();
}

async function main() {
    console.log("🚑 AUTO-RECOVERY: Scanning for lost images...");

    if (!fs.existsSync(UPLOADS_DIR)) {
        console.error("❌ Uploads directory not found!");
        return;
    }

    const hotelFolders = fs.readdirSync(UPLOADS_DIR);
    console.log(`📂 Found ${hotelFolders.length} hotel folders.`);

    let restoredCount = 0;

    for (const folderName of hotelFolders) {
        const hotelPath = path.join(UPLOADS_DIR, folderName, 'hotel');

        if (!fs.existsSync(hotelPath)) continue;

        const files = fs.readdirSync(hotelPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

        if (files.length === 0) continue;

        // Sort files by name (timestamp) desc to get latest
        files.sort().reverse();
        const latestImage = files[0];
        const allImages = files.map(f => `/uploads/hotels/${folderName}/hotel/${f}`);

        const mainImageUrl = `/uploads/hotels/${folderName}/hotel/${latestImage}`;

        // 🔍 Find the matching hotel in DB
        // precise mapping might be hard, so we attempt fuzzy match
        // The folder name usually contains the Arabic Name.
        // e.g. "فندق-X-(Hotel-X)"

        // Extract potential arabic name part (before first dash or paren if possible)
        // Actually, let's fetch ALL hotels and find the best match.
        // Doing this per folder is slow but safe.

        const allHotels = await prisma.hotel.findMany();

        let bestMatch = null;
        let maxScore = 0;

        for (const h of allHotels) {
            // Check if folder name contains hotel name (normalized)
            const nFolder = normalize(folderName);
            const nHotelName = normalize(h.name);

            // Bidirectional check + length check to avoid "Hotel" matching "Hotel X" incorrectly if too short
            // But strict includes is better than nothing.
            if ((nFolder.includes(nHotelName) && nHotelName.length > 3) || (nHotelName.includes(nFolder) && nFolder.length > 5)) {
                // Determine score by length of match
                const score = nHotelName.length;
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = h;
                }
            }
        }

        if (bestMatch) {
            console.log(`✅ MATCH: '${folderName}' -> '${bestMatch.name}'`);

            // Update DB
            // We verify if we should overwrite. 
            // If current DB image is Unsplash, definitely overwrite.
            // If current DB image is local, maybe skip? 
            // User said "All are gone", so assume overwrite is needed if Unsplash.

            const currentImage = bestMatch.image || '';
            if (currentImage.includes('unsplash') || currentImage.length < 5) {
                console.log(`   🔄 Restoring Main Image...`);
                await prisma.hotel.update({
                    where: { id: bestMatch.id },
                    data: {
                        image: mainImageUrl,
                        images: JSON.stringify(allImages) // Restore gallery too!
                    }
                });
                restoredCount++;
            } else {
                console.log(`   Running check: DB already has local image? ${currentImage}`);
                if (!currentImage.includes(folderName)) {
                    // Different local image? restore partial?
                    // Let's force update if it looks generated
                    // But safemode: only if unsplash
                }
            }
        } else {
            console.log(`⚠️ NO MATCH for folder: '${folderName}'`);
        }
    }

    console.log(`🎉 Restored images for ${restoredCount} hotels!`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
