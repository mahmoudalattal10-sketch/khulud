
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const OUTPUT_FILE = String.raw`c:\Users\el3attal\.gemini\antigravity\brain\edb9ca06-6930-46e0-8256-74a16cc6a2a8\hotels_list.md`;

const COUNTRY_NAMES = {
    'SA': 'المملكة العربية السعودية 🇸🇦',
    'AE': 'الإمارات العربية المتحدة 🇦🇪',
    'QA': 'دولة قطر 🇶🇦',
    'KW': 'دولة الكويت 🇰🇼',
    'BH': 'مملكة البحرين 🇧🇭',
    'OM': 'سلطنة عمان 🇴🇲',
    'EG': 'جمهورية مصر العربية 🇪🇬'
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
    'manama': 'المنامة', 'muharraq': 'المحرق', 'riffa': 'الرفاع',
    // OM
    'muscat': 'مسقط', 'salalah': 'صلالة', 'sohar': 'صحار',
    // EG
    'cairo': 'القاهرة', 'alexandria': 'الإسكندرية', 'sharm_el_sheikh': 'شرم الشيخ',
    'hurghada': 'الغردقة', 'north_coast': 'الساحل الشمالي', 'el_gouna': 'الجونة'
};

async function main() {
    const hotels = await prisma.hotel.findMany({
        orderBy: [
            { country: 'asc' },
            { city: 'asc' },
            { name: 'asc' }
        ],
        select: {
            name: true,
            city: true,
            country: true
        }
    });

    const grouped = {};

    hotels.forEach(h => {
        if (!grouped[h.country]) grouped[h.country] = {};
        if (!grouped[h.country][h.city]) grouped[h.country][h.city] = [];
        grouped[h.country][h.city].push(h.name);
    });

    let content = '# 🏨 دليل الفنادق الشامل\n\n';
    content += `> **إجمالي الفنادق:** ${hotels.length}\n\n`;
    content += '---\n\n';

    for (const [countryCode, cities] of Object.entries(grouped)) {
        content += `## ${COUNTRY_NAMES[countryCode] || countryCode}\n\n`;

        for (const [cityKey, hotelList] of Object.entries(cities)) {
            const cityName = CITY_NAMES[cityKey] || cityKey;
            content += `### 📍 ${cityName}\n`;
            hotelList.forEach((h, index) => {
                content += `${index + 1}. ${h}\n`;
            });
            content += '\n';
        }
        content += '---\n\n';
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    console.log(`✅ Report generated at: ${OUTPUT_FILE}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
