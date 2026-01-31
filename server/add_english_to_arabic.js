
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Formatting Hotel Names: ARABIC (ENGLISH)...');

    const hotels = await prisma.hotel.findMany();

    for (const h of hotels) {
        // Only process if both names exist and English name contains characters
        if (h.name && h.nameEn && h.nameEn.trim().length > 0) {

            // Check if already formatted (contains English name in parens)
            // We use a loose check for the English name content
            if (!h.name.includes(`(${h.nameEn})`)) {

                // Clean any existing incorrect English suffix if present (from previous partial attempts)
                let cleanArabic = h.name.replace(/\s*\([A-Za-z0-9\s&\u00C0-\u00FF\-\.]+\)$/, '').trim();

                const newName = `${cleanArabic} (${h.nameEn})`;

                console.log(`Updating: ${cleanArabic} -> ${newName}`);

                await prisma.hotel.update({
                    where: { id: h.id },
                    data: { name: newName }
                });
            }
        }
    }

    console.log('✅ Formatting Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
