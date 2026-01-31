
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const VIEW_OPTIONS = {
    MAKKAH_FULL: 'مطلة كاملة على الكعبة',
    MAKKAH_PARTIAL: 'مطلة جزئية على الكعبة',
    MADINAH_FULL: 'مطلة كاملة على المسجد النبوي',
    MADINAH_PARTIAL: 'مطلة جزئية على المسجد النبوي',
    CITY_FULL: 'مطلة كاملة على المدينة',
    CITY_PARTIAL: 'مطلة جزئية على المدينة',
};

// Luxury hotels that definitely have full views
const LUXURY_MAKKAH = [
    'Fairmont', 'Raffles', 'Dar Al Tawhid', 'Swissôtel', 'Pullman', 'Mövenpick', 'Conrad', 'Hilton'
];
const LUXURY_MADINAH = [
    'Oberoi', 'Dar Al Iman', 'Dar Al Taqwa', 'Hilton', 'Mövenpick', 'Pullman'
];

async function main() {
    console.log('Standardizing Hotel Views...');

    const hotels = await prisma.hotel.findMany();

    for (const h of hotels) {
        let newView = VIEW_OPTIONS.CITY_FULL; // Default
        const nameKeywords = h.nameEn ? h.nameEn : h.name;

        if (h.city === 'makkah') {
            // Determine if Full or Partial based on Luxury list/keywords
            const isLuxury = LUXURY_MAKKAH.some(l => nameKeywords.includes(l));
            const currentView = (h.view || '').toLowerCase();

            if (isLuxury || currentView.includes('kaaba') || currentView.includes('haram') || currentView.includes('الكعبة')) {
                if (currentView.includes('partial') || currentView.includes('جزئية')) {
                    newView = VIEW_OPTIONS.MAKKAH_PARTIAL;
                } else {
                    newView = VIEW_OPTIONS.MAKKAH_FULL;
                }
            } else {
                // Determine City View type
                if (currentView.includes('partial') || currentView.includes('جزئية')) {
                    newView = VIEW_OPTIONS.CITY_PARTIAL;
                } else {
                    newView = VIEW_OPTIONS.CITY_FULL;
                }
            }

        } else if (h.city === 'madinah') {
            const isLuxury = LUXURY_MADINAH.some(l => nameKeywords.includes(l));
            const currentView = (h.view || '').toLowerCase();

            if (isLuxury || currentView.includes('prophet') || currentView.includes('mosque') || currentView.includes('haram') || currentView.includes('الحرم') || currentView.includes('المسجد')) {
                if (currentView.includes('partial') || currentView.includes('جزئية')) {
                    newView = VIEW_OPTIONS.MADINAH_PARTIAL;
                } else {
                    newView = VIEW_OPTIONS.MADINAH_FULL;
                }
            } else {
                if (currentView.includes('partial') || currentView.includes('جزئية')) {
                    newView = VIEW_OPTIONS.CITY_PARTIAL;
                } else {
                    newView = VIEW_OPTIONS.CITY_FULL;
                }
            }
        }

        console.log(`[${h.city}] ${h.name.substring(0, 30)}... \n   OLD: ${h.view} \n   NEW: ${newView}`);

        await prisma.hotel.update({
            where: { id: h.id },
            data: { view: newView }
        });
    }

    console.log('✅ Views Standardized.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
