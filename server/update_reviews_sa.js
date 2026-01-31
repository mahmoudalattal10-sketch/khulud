
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Target only Saudi Arabia
const TARGET_COUNTRIES = ['SA'];

const ARABIC_NAMES = [
    "عبدالله المنصوري", "خالد العتيبي", "محمد الشمري", "فهد الدوسري",
    "سارة الجابر", "نورة العلي", "فاطمة محمد", "عبدالرحمن الزهراني",
    "ناصر القحطاني", "مريم الصالح", "يوسف الكواري", "علي المهندي",
    "حسن الأنصاري", "منيرة السبيعي", "سلطان المطيري", "ريم الخالدي",
    "عمر فاروق", "زيد العابدين", "لجين الهذلول", "ماجد عبد الله",
    "سعود الكبير", "فيصل بن عبدالعزيز", "هيفاء المنصور", "أحمد الشقيري"
];

const ENGLISH_NAMES = [
    "James Wilson", "Sarah Thompson", "Robert Miller", "David Anderson",
    "Emily Davis", "Michael Brown", "Jessica Taylor"
];

// --- STANDARD LUXURY REVIEWS (Riyadh, Jeddah, etc.) ---
const STANDARD_REVIEWS_AR = [
    "إقامة استثنائية بكل المقاييس. طاقم العمل كان متعاوناً جداً. الغرف واسعة ونظيفة، والديكورات عصرية.",
    "الموقع ممتاز جداً وقريب من الخدمات والمولات. الفندق هادئ ومناسب لرجال الأعمال والعائلات.",
    "تجربة فاخرة وخدمة راقية. النادي الصحي والمسبح كانوا في قمة النظافة. بوفيه الإفطار متنوع ولذيذ.",
    "الفندق يتميز بالفخامة والهدوء. شكراً لكم على حسن الضيافة والاهتمام بأدق التفاصيل.",
    "سرعة في تسجيل الدخول والخروج، واهتمام كبير من الموظفين. الغرفة كانت مجهزة بكل ما نحتاجه."
];

const STANDARD_REVIEWS_EN = [
    "An exceptional stay. The staff were incredibly helpful and professional. The room was spacious and modern.",
    "Perfect location, close to malls and business districts. Quiet and suitable for both business and leisure.",
    "True luxury and outstanding service. The facilities were pristine. Breakfast buffet was delicious."
];

// --- RELIGIOUS / HOLY CITY REVIEWS (Makkah, Madinah) ---
const SPIRITUAL_REVIEWS_AR = [
    "ما شاء الله، الموقع لا يعلى عليه، خطوات من الحرم. الإطلالة على الكعبة المشرفة كانت تأسر القلوب.",
    "خدمة ممتازة وروحانية عالية في المكان. تعاون الموظفين ساعدنا كثيراً في أوقات الذروة. جزاكم الله خيراً.",
    "نظافة فائقة واهتمام بضيوف الرحمن. المصاعد سريعة ومتوفرة دائماً رغم الزحام. أنصح به بشدة.",
    "بوفيه الإفطار والسحور كان رائعاً ومتنوعاً. الغرف هادئة جداً وتسمح بالراحة والعبادة.",
    "أفضل خيار لمن يبحث عن القرب من الحرم والسكينة. صوت الأذان في الغرفة يمنحك شعوراً لا يوصف."
];

const SPIRITUAL_REVIEWS_EN = [
    "Masha'Allah, unbeatable location, just steps from the Haram. The Kaaba view was breathtaking.",
    "Excellent service and a very spiritual atmosphere. Staff cooperation helped a lot during peak times."
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: Get random date within a range
function getRandomDate(startYear, endYear) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

async function main() {
    console.log('🔄 Updating Reviews for SA (Arabic First Priority)...');

    const hotels = await prisma.hotel.findMany({
        where: {
            country: { in: TARGET_COUNTRIES }
        },
        include: { guestReviews: true }
    });

    console.log(`Found ${hotels.length} hotels in KSA to update.`);

    for (const hotel of hotels) {
        // 1. Delete existing reviews
        await prisma.review.deleteMany({
            where: { hotelId: hotel.id }
        });

        const cityLower = hotel.city.toLowerCase();
        const isHolyCity = cityLower === 'makkah' || cityLower === 'madinah';

        // 2. Generate Reviews (Mostly Arabic + Newer Dates)
        const reviewCount = Math.floor(Math.random() * 5) + 6; // 6 to 10 reviews
        const newReviewsData = [];

        for (let i = 0; i < reviewCount; i++) {
            // 90% chance for Arabic review
            const isArabic = Math.random() > 0.1;
            const isPositive = Math.random() > 0.1; // 90% positive

            let userName, text, rating, date;

            if (isArabic) {
                userName = getRandomItem(ARABIC_NAMES);
                text = isHolyCity ? getRandomItem(SPIRITUAL_REVIEWS_AR) : getRandomItem(STANDARD_REVIEWS_AR);
                // Arabic reviews get NEWER dates (2025-2026) so they appear first
                date = getRandomDate(2025, 2026);
            } else {
                userName = getRandomItem(ENGLISH_NAMES);
                text = isHolyCity ? getRandomItem(SPIRITUAL_REVIEWS_EN) : getRandomItem(STANDARD_REVIEWS_EN);
                // English reviews get OLDER dates (2023-2024)
                date = getRandomDate(2023, 2024);
            }

            // Variation
            if (Math.random() > 0.7 && isArabic) {
                text += " تجربة مميزة وسأكرر الزيارة.";
            }

            rating = isPositive ? 5 : 4;

            newReviewsData.push({
                userName,
                text,
                rating,
                date,
                hotelId: hotel.id
            });
        }

        // Bulk Insert
        for (const rev of newReviewsData) {
            await prisma.review.create({ data: rev });
        }
    }

    console.log('✅ KSA Reviews Updated: Mostly Arabic & Prioritized!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
