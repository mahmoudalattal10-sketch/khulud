const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Scanning for absolute URLs in 'image' and 'images' fields...");

    // 1. Get all hotels
    const hotels = await prisma.hotel.findMany();
    let updatedCount = 0;

    for (const h of hotels) {
        let needsUpdate = false;
        let newImage = h.image;
        let newImages = h.images;

        // Clean main image
        if (h.image && (h.image.includes('localhost:') || h.image.startsWith('http://localhost'))) {
            try {
                // If it's a localhost URL, extract path
                if (h.image.includes('/uploads/')) {
                    const parts = h.image.split('/uploads/');
                    if (parts.length > 1) {
                        // Keep /uploads/ prefix for relative path
                        newImage = `/uploads/${parts[1]}`;
                        needsUpdate = true;
                    }
                }
            } catch (e) { console.error(e); }
        }

        // Clean images array
        if (h.images && Array.isArray(h.images)) {
            const cleaned = h.images.map(img => {
                if (typeof img === 'string' && (img.includes('localhost:') || img.startsWith('http://localhost'))) {
                    if (img.includes('/uploads/')) {
                        const parts = img.split('/uploads/');
                        if (parts.length > 1) {
                            needsUpdate = true;
                            return `/uploads/${parts[1]}`;
                        }
                    }
                }
                return img;
            });
            if (needsUpdate) newImages = cleaned;
        } else if (typeof h.images === 'string' && (h.images.includes('localhost:') || h.images.includes('/uploads/'))) {
            // Handle if stored as stringified JSON or weird string
            // Try to parse?
            // If simple string
            if (h.images.includes('localhost:')) {
                // Attempt basic fix if single string
            }
        }

        if (needsUpdate) {
            console.log(`🛠️ Fixing Hotel: ${h.name} (${h.id})`);
            console.log(`   Old Image: ${h.image}`);
            console.log(`   New Image: ${newImage}`);

            await prisma.hotel.update({
                where: { id: h.id },
                data: {
                    image: newImage,
                    images: newImages
                }
            });
            updatedCount++;
        }
    }

    console.log(`✅ Fixed ${updatedCount} hotels.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
