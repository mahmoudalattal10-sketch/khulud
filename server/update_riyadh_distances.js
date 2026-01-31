
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DISTANCES = {
    "The Ritz-Carlton, Riyadh": "8 كم",
    "Four Seasons Hotel Riyadh": "0.5 كم",
    "Mandarin Oriental Al Faisaliah": "3 كم",
    "The St. Regis Riyadh": "7 كم",
    "Mansard Riyadh, A Radisson Collection Hotel": "13 كم",
    "Fairmont Riyadh": "18 كم",
    "JW Marriott Hotel Riyadh": "10 كم",
    "Narcissus Hotel & SPA Riyadh": "3.5 كم",
    "Hilton Riyadh Hotel & Residences": "16 كم",
    "Jareed Hotel": "9 كم"
};

async function main() {
    console.log('Updating Riyadh Hotel Distances...');

    const hotels = await prisma.hotel.findMany({
        where: { city: 'riyadh' }
    });

    for (const h of hotels) {
        // Find matching distance key by partially matching nameEn
        const key = Object.keys(DISTANCES).find(k => h.nameEn.includes(k) || k.includes(h.nameEn));

        if (key) {
            const distance = DISTANCES[key] + " من المركز"; // Adding suffix directly here for simplicity
            await prisma.hotel.update({
                where: { id: h.id },
                data: { distanceFromHaram: distance }
            });
            console.log(`✅ Updated ${h.nameEn}: ${distance}`);
        } else {
            console.log(`⚠️ No distance found for ${h.nameEn}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
