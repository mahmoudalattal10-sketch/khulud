
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const VIEWS = {
    KAABA: 'إطلالة على الكعبة',
    PROPHET: 'إطلالة على المسجد النبوي',
    NONE: ''
};

// Explicit definition of hotels with views based on luxury status and name
const KAABA_VIEW_HOTELS = [
    'Fairmont', 'Raffles', 'Dar Al Tawhid', 'Swissôtel', 'Pullman', 'Mövenpick',
    'Conrad', 'Hilton', 'Al Safwah', 'Al Marwa', 'DoubleTree'
];

const PROPHET_VIEW_HOTELS = [
    'Oberoi', 'Dar Al Iman', 'Dar Al Taqwa', 'Hilton', 'Mövenpick', 'Pullman',
    'Crowne Plaza', 'Emaar Royal'
];

async function main() {
    console.log('Enforcing Strict Spiritual Views...');

    const hotels = await prisma.hotel.findMany();

    for (const h of hotels) {
        let newView = VIEWS.NONE; // Default to empty
        const nameKeywords = h.nameEn ? h.nameEn : h.name;

        if (h.city === 'makkah') {
            const hasKeyword = KAABA_VIEW_HOTELS.some(k => nameKeywords.includes(k));
            const currentView = (h.view || '').toLowerCase();

            // If it was already marked as Kaaba view OR matches luxury list
            if (hasKeyword || currentView.includes('kaaba') || currentView.includes('haram') || currentView.includes('الكعبة')) {
                newView = VIEWS.KAABA;
            }

        } else if (h.city === 'madinah') {
            const hasKeyword = PROPHET_VIEW_HOTELS.some(k => nameKeywords.includes(k));
            const currentView = (h.view || '').toLowerCase();

            // If it was already marked as Prophet view OR matches luxury list
            if (hasKeyword || currentView.includes('prophet') || currentView.includes('mosque') || currentView.includes('haram') || currentView.includes('المسجد') || currentView.includes('الحرم')) {
                newView = VIEWS.PROPHET;
            }
        }

        if (h.view !== newView) {
            console.log(`[${h.city}] ${h.name.substring(0, 30)}...`);
            console.log(`   OLD: "${h.view || ''}"`);
            console.log(`   NEW: "${newView}"`);

            await prisma.hotel.update({
                where: { id: h.id },
                data: { view: newView }
            });
        }
    }

    console.log('✅ Strict Views Enforced.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
