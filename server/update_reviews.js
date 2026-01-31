
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TARGET_COUNTRIES = ['KW', 'BH', 'AE', 'QA'];

const ARABIC_NAMES = [
    "عبدالله المنصوري", "خالد العتيبي", "محمد الشمري", "فهد الدوسري",
    "سارة الجابر", "نورة العلي", "فاطمة محمد", "عبدالرحمن الزهراني",
    "ناصر القحطاني", "مريم الصالح", "يوسف الكواري", "علي المهندي",
    "حسن الأنصاري", "منيرة السبيعي", "سلطان المطيري", "ريم الخالدي"
];

const ENGLISH_NAMES = [
    "James Wilson", "Sarah Thompson", "Robert Miller", "David Anderson",
    "Emily Davis", "Michael Brown", "Jessica Taylor", "William Thomas",
    "Sophia White", "Daniel Martin"
];

const POSITIVE_REVIEWS_AR = [
    "إقامة استثنائية بكل المقاييس. طاقم العمل كان متعاوناً جداً، خصوصاً موظفي الاستقبال. الغرف واسعة ونظيفة، والإطلالة كانت رائعة.",
    "الموقع ممتاز جداً وقريب من الخدمات والمولات. الفندق هادئ ومناسب للعائلات. بوفيه الإفطار كان متنوعاً ولذيذاً.",
    "تجربة فاخرة وخدمة راقية. النادي الصحي والمسبح كانوا في قمة النظافة. بالتأكيد سأعود مرة أخرى.",
    "الفندق يتميز بالفخامة والهدوء. الديكورات جميلة جداً وتعكس الطابع المحلي بلمسة عصرية. شكراً لكم على حسن الضيافة.",
    "كل شيء كان مثالياً. سرعة في تسجيل الدخول والخروج، واهتمام بأدق التفاصيل. الغرفة كانت مجهزة بكل ما نحتاجه."
];

const POSITIVE_REVIEWS_EN = [
    "An exceptional stay. The staff were improved incredibly helpful and professional. The room was spacious with a stunning view.",
    "Perfect location, close to all major attractions and malls. The atmosphere is very family-friendly and calm. Breakfast buffet was delicious.",
    "True luxury and outstanding service. The spa and pool facilities were pristine. Will definitely be coming back.",
    "The hotel combines luxury with comfort perfectly. Beautiful interiors and very clean rooms. Thanks for the great hospitality.",
    "Everything was perfect from check-in to check-out. Attention to detail is amazing here. Highly recommended."
];

const MIXED_REVIEWS_AR = [
    "الفندق جميل وموقعه استراتيجي، ولكن السعر مرتفع قليلاً مقارنة بالخدمات. الغرف نظيفة لكن الأثاث يحتاج بعض التجديد.",
    "الإقامة كانت جيدة بشكل عام. الموظفين ودودين، لكن خدمة الغرف كانت بطيئة بعض الشيء في وقت الذروة.",
    "الموقع هو الميزة الأكبر لهذا الفندق. المرافق جيدة لكن تمنيت لو كان المسبح أكبر قليلاً. الإفطار كان جيداً.",
    "تجربة مقبولة. اللوبي فخمة جداً ولكن الغرف عادية. مناسب لرحلات العمل القصيرة."
];

const MIXED_REVIEWS_EN = [
    "Great hotel with a strategic location, but a bit pricey for the amenities offered. Rooms are clean but could use some updates.",
    "Overall a good stay. Staff is friendly, though room service was a bit slow during peak hours.",
    "Location is the best part of this hotel. Facilities are good, but I wish the pool was larger. Breakfast was decent.",
    "Decent experience. The lobby is luxurious but the rooms are standard. Good for short business trips."
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
    console.log('🔄 Updating Reviews for KW, BH, AE, QA...');

    // 1. Get Target Hotels
    const hotels = await prisma.hotel.findMany({
        where: {
            country: { in: TARGET_COUNTRIES } // Select hotels in target countries
        },
        include: { guestReviews: true }
    });

    console.log(`Found ${hotels.length} hotels to update.`);

    for (const hotel of hotels) {
        // 2. Delete existing reviews
        await prisma.review.deleteMany({
            where: { hotelId: hotel.id }
        });

        // 3. Create New Reviews
        // Decide number of reviews (3 to 6)
        const reviewCount = Math.floor(Math.random() * 4) + 3;
        const newReviewsData = [];

        for (let i = 0; i < reviewCount; i++) {
            const isArabic = Math.random() > 0.3; // 70% Arabic
            const isPositive = Math.random() > 0.2; // 80% Positive

            let userName, text, rating;

            if (isArabic) {
                userName = getRandomItem(ARABIC_NAMES);
                text = isPositive ? getRandomItem(POSITIVE_REVIEWS_AR) : getRandomItem(MIXED_REVIEWS_AR);
            } else {
                userName = getRandomItem(ENGLISH_NAMES);
                text = isPositive ? getRandomItem(POSITIVE_REVIEWS_EN) : getRandomItem(MIXED_REVIEWS_EN);
            }

            rating = isPositive ? 5 : (Math.random() > 0.5 ? 4 : 3.5);

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

    console.log('✅ Reviews Updated Successfully!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
