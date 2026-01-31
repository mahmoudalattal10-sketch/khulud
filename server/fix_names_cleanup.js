
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up Hotel Names...');

    const hotels = await prisma.hotel.findMany();

    for (const h of hotels) {
        let newName = h.name;
        let newNameEn = h.nameEn;
        let needsUpdate = false;

        // 1. Fix "New Hotel" for Al Safwah
        if (h.name.includes('الصفوة') && h.nameEn === 'New Hotel') {
            console.log(`Fixing English name for ${h.name}`);
            newNameEn = 'Al Safwah Royale Orchid';
            needsUpdate = true;
        }

        // 2. Remove English text from Arabic name "Arabic (English)"
        // Regex to find (English chars) at the end, INCLUDING ACCENTS
        // \u00C0-\u00FF covers standard Latin-1 accents (À-ÿ)
        if (h.name.match(/\([A-Za-z0-9\s&\u00C0-\u00FF\-\.]+\)$/)) {
            console.log(`Cleaning Arabic name for ${h.name} -> Removing English part`);
            newName = h.name.replace(/\s*\([A-Za-z0-9\s&\u00C0-\u00FF\-\.]+\)$/, '').trim();
            needsUpdate = true;
        }

        if (needsUpdate) {
            await prisma.hotel.update({
                where: { id: h.id },
                data: {
                    name: newName,
                    nameEn: newNameEn
                }
            });
            console.log(`✅ Updated: ${newName} | ${newNameEn}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
