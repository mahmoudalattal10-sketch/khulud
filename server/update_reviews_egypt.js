
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Target Egypt
const TARGET_COUNTRIES = ['EG'];

const ARABIC_NAMES = [
    "أحمد المصري", "محمود علي", "خالد يوسف", "عمرو دياب",
    "سارة حسن", "منى زكي", "فاطمة أحمد", "عبدالرحمن مصطفى",
    "محمد صلاح", "عادل إمام", "ياسمين صبري", "تامر حسني"
];

const ENGLISH_NAMES = [
    "James Wilson", "Sarah Thompson", "Robert Miller", "David Anderson",
    "Emily Davis", "Michael Brown", "Jessica Taylor"
];

// --- CAIRO REVIEWS ---
const CAIRO_REVIEWS_AR = [
    "إقامة تاريخية بجوار الأهرامات. المنظر لا يصدق والخدمة ممتازة.",
    "فندق فخم جداً في قلب القاهرة. قريب من المتحف والنيل. أنصح به بشدة.",
    "المطاعم في الفندق رائعة، والخدمة عالمية. قضيت أجمل إجازة هنا.",
    "زحمة القاهرة تختفي بمجرد دخولك الفندق. هدوء ورفاهية."
];

const CAIRO_REVIEWS_EN = [
    "Historic stay right next to the Pyramids. The view is unbelievable.",
    "Very luxurious hotel in the heart of Cairo. Close to Museum and Nile.",
    "Restaurants are amazing, world-class service. Had the best vacation.",
    "Cairo traffic disappears once you enter. Pure tranquility and luxury."
];

// --- SHARM / HURGHADA / NORTH COAST REVIEWS ---
const RESORT_REVIEWS_AR = [
    "الشاطئ رملي ونظيف جداً. المياه صافية والشعاب المرجانية ساحرة.",
    "منتجع متكامل للعائلات. الأكل متنوع ولذيذ، وفريق الترفيه ممتاز.",
    "الجو رائع والاستقبال حافل. الغرف واسعة ومطلة على البحر.",
    "تجربة استجمام لا تنسى. السبا والمساج عندهم ممتاز."
];

const RESORT_REVIEWS_EN = [
    "Sandy and very clean beach. Crystal clear water and magical coral reefs.",
    "Complete family resort. Food is varied and delicious, animation team is great.",
    "Great atmosphere and warm welcome. Rooms are spacious with sea view.",
    "Unforgettable relaxation experience. Spa and massage are excellent."
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
    console.log('🔄 Updating Reviews for Egypt...');

    const hotels = await prisma.hotel.findMany({
        where: {
            country: { in: TARGET_COUNTRIES }
        },
        include: { guestReviews: true }
    });

    console.log(`Found ${hotels.length} hotels in Egypt to update.`);

    for (const hotel of hotels) {
        // 1. Delete existing reviews
        await prisma.review.deleteMany({
            where: { hotelId: hotel.id }
        });

        const cityLower = hotel.city.toLowerCase();
        const isCairo = cityLower.includes('cairo') || cityLower.includes('القاهرة');

        // 2. Generate Reviews
        const reviewCount = Math.floor(Math.random() * 5) + 3;
        const newReviewsData = [];

        for (let i = 0; i < reviewCount; i++) {
            const isArabic = Math.random() > 0.7; // 70% Arabic
            const isPositive = Math.random() > 0.15; // 85% Positive

            let userName, text, rating;

            if (isArabic) {
                userName = getRandomItem(ARABIC_NAMES);
                text = isCairo ? getRandomItem(CAIRO_REVIEWS_AR) : getRandomItem(RESORT_REVIEWS_AR);
            } else {
                userName = getRandomItem(ENGLISH_NAMES);
                text = isCairo ? getRandomItem(CAIRO_REVIEWS_EN) : getRandomItem(RESORT_REVIEWS_EN);
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

    console.log('✅ Egypt Reviews Updated Successfully!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
