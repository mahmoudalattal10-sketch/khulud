
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COUNTRY_NAMES = {
    'SA': 'السعودية 🇸🇦',
    'AE': 'الإمارات 🇦🇪',
    'QA': 'قطر 🇶🇦',
    'KW': 'الكويت 🇰🇼',
    'BH': 'البحرين 🇧🇭'
};

const CITY_NAMES = {
    // SA
    'makkah': 'مكة المكرمة', 'madinah': 'المدينة المنورة', 'riyadh': 'الرياض', 'jeddah': 'جدة',
    // AE
    'dubai': 'دبي', 'abu_dhabi': 'أبوظبي', 'sharjah': 'الشارقة', 'ajman': 'عجمان', 'ras_al_khaimah': 'رأس الخيمة',
    // QA
    'doha': 'الدوحة', 'al_wakrah': 'الوكرة', 'al_khor': 'الخور',
    // KW
    'kuwait_city': 'مدينة الكويت', 'hawally': 'حولي', 'al_ahmadi': 'الأحمدي',
    // BH
    'manama': 'المنامة', 'muharraq': 'المحرق', 'riffa': 'الرفاع'
};

async function main() {
    console.log('📊 Analyzing Hotel Locations...\n');

    const hotels = await prisma.hotel.findMany({
        select: { country: true, city: true, location: true }
    });

    const uniqueCountries = [...new Set(hotels.map(h => h.country))];

    console.log(`🌍 إجمالي الدول: ${uniqueCountries.length}`);
    console.log(`🏙️ إجمالي المدن: ${new Set(hotels.map(h => h.city)).size}`);

    // Count areas (locations)
    const areas = new Set(hotels.map(h => h.location.trim()));
    console.log(`📍 إجمالي الأحياء/المناطق: ${areas.size}`);
    console.log(`🏨 إجمالي الفنادق: ${hotels.length}\n`);

    console.log('--- التفاصيل ---');

    for (const countryCode of uniqueCountries) {
        const countryHotels = hotels.filter(h => h.country === countryCode);
        const countryCities = [...new Set(countryHotels.map(h => h.city))];

        console.log(`\n${COUNTRY_NAMES[countryCode] || countryCode} (${countryHotels.length} فندق):`);

        for (const city of countryCities) {
            const cityHotels = countryHotels.filter(h => h.city === city);
            const cityAreas = [...new Set(cityHotels.map(h => h.location.trim()))];

            console.log(`   🔸 ${CITY_NAMES[city] || city}: ${cityHotels.length} فندق`);
            console.log(`      (الأحياء: ${cityAreas.join('، ')})`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
