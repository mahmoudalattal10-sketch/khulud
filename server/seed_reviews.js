
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reviewsData = {
    // --- MAKKAH HOTELS ---
    "فندق أنجم مكة": [
        { userName: "محمد العمري", rating: 5, text: "الفندق ما شاء الله تبارك الله، اللوبي خيالي وشرح جداً. الوصول للحرم سهل عبر النفق، والمصاعد كثيرة ما انتظرنا ولا دقيقة. الفطور متنوع ولذيذ." },
        { userName: "Ahmed Al-Salem", rating: 4.5, text: "Excellent hotel for large groups. Very spacious. The walk to Haram takes about 5-7 mins via the tunnel." },
        { userName: "أم فهد", rating: 5, text: "أنصح فيه بشدة للعوائل، نظافة وترتيب وخدمة سريعة. وسعره مقابل الخدمات ممتاز جداً." }
    ],
    "أبراج الكسوة": [
        { userName: "يوسف خليل", rating: 4, text: "سعر اقتصادي ممتاز جداً. الغرف نظيفة، والباصات شغالة 24 ساعة، بس في أوقات الصلاة بتكون زحمة شوية." },
        { userName: "Ali Hassan", rating: 3.5, text: "Good value for money. Room mainly for sleeping. Shuttle bus is reliable but gets crowded." },
        { userName: "أبو عبدالرحمن", rating: 4, text: "تجربة جيدة لمن يبحث عن توفير المال. النظافة ممتازة والموظفين محترمين." }
    ],
    "فوكو مكة": [
        { userName: "سارة الجدعاني", rating: 5, text: "الديكورات مودرن ومريحة للأعصاب، ريحة الفندق تفتح النفس. الباصات متوفرة وكثيرة توصلك للحرم بسرعة." },
        { userName: "Khalid M.", rating: 4.5, text: "Very stylish and modern. Breakfast buffet was top notch. A bit far to walk but shuttle makes it easy." },
        { userName: "أبو ياسر", rating: 5, text: "فندق راقي بمعنى الكلمة، تعامل الموظفين احترافي جداً والأسرة مريحة للنوم بعد العمرة." }
    ],
    "مكارم أجياد": [
        { userName: "عبدالله العتيبي", rating: 5, text: "موقع استراتيجي قريب جداً من الحرم. الفندق له طابع روحاني جميل وفخم. البوفيه عندهم حكاية ثانية." },
        { userName: "Hassan K.", rating: 4, text: "Great location in Ajyad. Classic luxury style. Very convenient for elderly people." }
    ],
    "إيلاف كندا": [
        { userName: "خالد الزهراني", rating: 5, text: "الموقع بطل! لاصق في الساحات وأبراج البيت بس بسعر أرحم بكتير. الغرف واسعة ونظيفة." },
        { userName: "Um Omar", rating: 4.5, text: "Perfect location, step out and you are in the Haram vicinity. Staff is very helpful." }
    ],
    "لو ميريديان مكة": [
        { userName: "فيصل الروقي", rating: 5, text: "هدوء وفخامة بعيد عن زحمة المركزية. الإطلالة على الحرم من بعيد ساحرة. خدمة التوصيل عبر نفق الملك عبدالعزيز سريعة جداً." },
        { userName: "Dr. Samy", rating: 4.5, text: "Luxury and serenity. The food quality is exceptional. Great for relaxing." }
    ],
    "فندق الشهداء": [
        { userName: "أبو ناصر", rating: 5, text: "فندق عريق وخدمته ما تغيرت، ممتازة جداً. الأكل عندهم لذيذ بشكل مو طبيعي، والغرف واسعة تشرح الصدر." },
        { userName: "Salma H.", rating: 4.5, text: "Walking distance to Haram. Very spacious rooms, great for families. The lobby smells of oud/perfume." }
    ],
    "ملينيوم مكة النسيم": [
        { userName: "ماجد الحربي", rating: 5, text: "مدينة متكاملة في النسيم. الفندق ضخم وخدماته ممتازة ومواقفه متوفرة. الباصات منتظمة جداً للحرم." },
        { userName: "Saleh A.", rating: 4, text: "Good 5-star standard away from traffic. Shuttle connects well to Haram." }
    ],

    // --- MADINAH HOTELS ---
    "فندق أوبروي المدينة": [
        { userName: "الشيخ أبو طلال", rating: 5, text: "لا يُعلى عليه. فخامة ملكية، وموقع ملاصق للحرم. خدمة البتلر (الخادم) شيء خيالي. السعر غالي بس يستاهل كل ريال." },
        { userName: "Engineer Saad", rating: 5, text: "Absolute best in Madinah. Direct view of the Green Dome. Dining is exquisite." },
        { userName: "أم تركي", rating: 5, text: "تجربة لا تنسى، راحة نفسية وقرب من الروضة الشريفة. نظافة واهتمام بأدق التفاصيل." }
    ],
    "دار الإيمان إنتركونتيننتال": [
        { userName: "ياسر القحطاني", rating: 5, text: "موقعه ممتاز جداً بوابة النساء. الفندق كلاسيكي فخم والخدمة فيه احترافية وقديمة بمعايير عالية." },
        { userName: "Fatima B.", rating: 4.5, text: "The location is unbeatable right in front of the main gates. Rooms are very spacious." }
    ],
    "فندق دار التقوى": [
        { userName: "أبو محمد الكويتي", rating: 5, text: "فندقنا المفضل كعائلة. الخصوصية فيه عالية، ومطعم المروة اللي يطل على الحرم قصة تانية وقت الفطور." },
        { userName: "Hamad Al-Kuwari", rating: 5, text: "Best view restaurant in Madinah. Very homely feeling and top location." }
    ],
    "شهد المدينة": [
        { userName: "نورة المطيري", rating: 5, text: "ديكورات الفندق تسحر، تحس إنك في الأندلس. هادي جداً ومريح للأعصاب، وموقعه جنب الحرم مباشرة." },
        { userName: "Tarek G.", rating: 4.5, text: "Unique ambiance, different from typical hotels. Very relaxing lighting and vibe." }
    ],
    "أنوار المدينة موفنبيك": [
        { userName: "عائلة الغامدي", rating: 4, text: "ممتاز للعائلات عشان المول اللي تحته، كل شي قريب منك. بس اللوبي زحمة شوي وقت المواسم." },
        { userName: "Rami S.", rating: 5, text: "Huge hotel, massive atrium. Location is prime. Shopping mall downstairs is a big plus." }
    ],
    "فندق هيلتون المدينة": [
        { userName: "أبو عبدالعزيز", rating: 5, text: "هيلتون اسم معروف بالثقة. الغرف وسيعة ونظيفة، والموقع ممتاز في شارع الملك فهد." },
        { userName: "John D.", rating: 4.5, text: "Classic Hilton service. Reliable, clean, and right across the Prophet's Mosque." }
    ],
    "دلة طيبة": [
        { userName: "الحاج مصطفى", rating: 5, text: "يا الله على كرم ضيافتهم، القهوة والتمر في الاستقبال طول الوقت. قريب جداً من باب السلام للزيارة." },
        { userName: "Mahmoud E.", rating: 4.5, text: "Closest to Bab Al Salam. Very welcoming staff and true Arabian hospitality." }
    ]
};

async function main() {
    console.log(`Starting reviews seed...`);

    for (const [hotelName, reviews] of Object.entries(reviewsData)) {
        // Find valid hotel
        const hotel = await prisma.hotel.findFirst({
            where: { name: { contains: hotelName } }
        });

        if (hotel) {
            console.log(`Found hotel: ${hotel.name}. Adding ${reviews.length} reviews...`);

            for (const review of reviews) {
                await prisma.review.create({
                    data: {
                        hotelId: hotel.id,
                        userName: review.userName,
                        rating: review.rating,
                        text: review.text,
                        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0] // Random date in past
                    }
                });
            }

            // Update hotel rating average
            const agg = await prisma.review.aggregate({
                where: { hotelId: hotel.id },
                _avg: { rating: true },
                _count: { rating: true }
            });

            await prisma.hotel.update({
                where: { id: hotel.id },
                data: {
                    rating: agg._avg.rating || 5, // Update average rating
                    reviews: agg._count.rating // Update review count
                }
            });

            console.log(`✅ Updated ${hotel.name} with new rating: ${agg._avg.rating}`);
        } else {
            console.log(`⚠️ Hotel not found: ${hotelName}`);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
