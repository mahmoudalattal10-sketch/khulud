
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Target Oman
const TARGET_COUNTRIES = ['OM'];

const ARABIC_NAMES = [
    "سعيد البلوشي", "محمد المعولي", "خالد الهنائي", "فهد الحسني",
    "سارة الزدجالي", "نورة الحارثي", "فاطمة اللواتي", "عبدالله الرواحي",
    "ناصر المخيني", "مريم العامري", "يوسف الكندي", "علي الحبسي"
];

const ENGLISH_NAMES = [
    "James Wilson", "Sarah Thompson", "Robert Miller", "David Anderson",
    "Emily Davis", "Michael Brown", "Jessica Taylor"
];

// --- MUSCAT / SOHAR REVIEWS ---
const CITY_REVIEWS_AR = [
    "إقامة رائعة في قلب مسقط. الفندق نظيف جداً والموظفين متعاونين. الإطلالة على البحر كانت جميلة.",
    "موقع ممتاز قريب من الأوبرا والشاطئ. الخدمات ممتازة والإفطار متنوع. أنصح به للعائلات.",
    "تجربة استجمام حقيقية. الهدوء في المكان لا يوصف والمرافق نظيفة جداً. شكراً لطاقم الاستقبال.",
    "فندق فخم وراقي. الغرف واسعة والديكورات تعكس التراث العماني. خدمة صف السيارات كانت سريعة."
];

const CITY_REVIEWS_EN = [
    "Wonderful stay in the heart of Muscat. Very clean hotel and helpful staff. Ocean view was beautiful.",
    "Excellent location near the Opera and beach. Service is top notch and breakfast is varied. Recommended for families.",
    "A true relaxation experience. The tranquility here is indescribable. Thanks to the reception team.",
    "Luxurious and classy hotel. Spacious rooms reflecting Omani heritage. Valet service was fast."
];

// --- SALALAH REVIEWS (Khareef/Resort Focus) ---
const SALALAH_REVIEWS_AR = [
    "أجواء الخريف هنا لا تصدق! المنتجع يوفر كل ما تحتاجه العائلة. الشاطئ نظيف جداً والمسابح رائعة.",
    "مكان مثالي للاسترخاء وسط الطبيعة. الفلل واسعة وخصوصيتها عالية. تعامل الموظفين قمة في الاحترام.",
    "استمتعنا جداً بالإقامة. الجو كان خيالياً والخدمة ممتازة. البوفيه فيه خيارات بحرية طازجة.",
    "أنصح بزيارته في فصل الخريف. المناظر الطبيعية المحيطة بالفندق ساحرة. تجربة تستحق التكرار."
];

const SALALAH_REVIEWS_EN = [
    "The Khareef atmosphere here is unbelievable! The resort has everything a family needs. Beach is very clean.",
    "Perfect place to relax in nature. Villas are spacious with high privacy. Staff are extremely respectful.",
    "We really enjoyed our stay. The weather was dreamy and service excellent. Seafood buffet was fresh.",
    "Highly recommend visiting during Khareef season. Surrounding landscapes are magical. Worth repeating."
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate() {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

async function main() {
    console.log('🔄 Updating Reviews for Oman (Muscat, Salalah, Sohar)...');

    const hotels = await prisma.hotel.findMany({
        where: {
            country: { in: TARGET_COUNTRIES }
        },
        include: { guestReviews: true }
    });

    console.log(`Found ${hotels.length} hotels in Oman to update.`);

    for (const hotel of hotels) {
        // 1. Delete existing reviews
        await prisma.review.deleteMany({
            where: { hotelId: hotel.id }
        });

        const cityLower = hotel.city.toLowerCase();
        const isSalalah = cityLower === 'salalah';

        // 2. Generate Reviews
        const reviewCount = Math.floor(Math.random() * 4) + 3;
        const newReviewsData = [];

        for (let i = 0; i < reviewCount; i++) {
            const isArabic = Math.random() > 0.6; // 60% Arabic
            const isPositive = Math.random() > 0.15; // 85% Positive

            let userName, text, rating;

            if (isArabic) {
                userName = getRandomItem(ARABIC_NAMES);
                text = isSalalah ? getRandomItem(SALALAH_REVIEWS_AR) : getRandomItem(CITY_REVIEWS_AR);
            } else {
                userName = getRandomItem(ENGLISH_NAMES);
                text = isSalalah ? getRandomItem(SALALAH_REVIEWS_EN) : getRandomItem(CITY_REVIEWS_EN);
            }

            rating = isPositive ? 5 : 4;

            newReviewsData.push({
                userName,
                text,
                rating,
                date: getRandomDate(),
                hotelId: hotel.id
            });
        }

        // Bulk Insert
        for (const rev of newReviewsData) {
            await prisma.review.create({ data: rev });
        }
    }

    console.log('✅ Oman Reviews Updated Successfully!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
