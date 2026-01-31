
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reviewsData = {
    // --- REQUESTED HOTELS (MIXED NEW & EXISTING) ---

    // 1. Anjum Hotel (Existing - Adding more)
    "فندق أنجم مكة": [
        { userName: "Omar Farooq", rating: 5, text: "The variety at breakfast is amazing. The tunnel access to the Haram is a game changer for elderly pilgrims." },
        { userName: "أم سارة", rating: 4, text: "الفندق تبارك الله فخم، بس اللفتات وقت الصلاة يبغى لها صبر شوية." }
    ],

    // 2. Al Kiswah Towers (Existing - Adding more)
    "أبراج الكسوة": [
        { userName: "Hassan Ali", rating: 4, text: "Best budget option. Rooms are tight but clean. Shuttle helps a lot." },
        { userName: "أبو كريم", rating: 3.5, text: "سعر ولا أروع، الغرف ضيقة شوي بس للنوم فقط. الباصات متوفرة." }
    ],

    // 3. voco Makkah (Existing - Adding more)
    "فوكو مكة": [
        { userName: "Layla M.", rating: 5, text: "Aesthetics are beautiful. Smells great everywhere. Very comfortable stay." },
        { userName: "سعيد الشهراني", rating: 5, text: "فندق يفتح النفس، الألوان والديكور مريح جداً. خدمة الباصات ممتازة." }
    ],

    // 4. Makarem Ajyad (Existing - Adding more)
    "مكارم أجياد": [
        { userName: "Dr. Ahmed", rating: 4.5, text: "Classic Makkah hospitality. Location is superb near the tunnel." },
        { userName: "أم عبدالله", rating: 5, text: "أجواء ايمانية جميلة، واللوبي وسيع. قريب جداً من الحرم." }
    ],

    // 5. Elaf Kinda (Existing - Adding more)
    "إيلاف كندا": [
        { userName: "Sameer K.", rating: 5, text: "Right next to the Clock Tower but quieter. Excellent service." },
        { userName: "أبو متعب", rating: 4, text: "موقع استراتيجي، تخرج من الفندق انت في الساحة. الأثاث كلاسيكي بس نظيف." }
    ],

    // 6. Le Méridien Makkah (Existing - Adding more)
    "لو ميريديان مكة": [
        { userName: "Fatima Al-Zahrani", rating: 5, text: "Direct access to King Abdulaziz Gate via tunnel is unmatched. Royal service." },
        { userName: "عبدالرحمن", rating: 4.5, text: "فخامة وهدوء، الأكل عندهم عالمي. المشي للحرم سهل جداً." }
    ],

    // 7. Park Inn by Radisson Al Naseem (NEW)
    "بارك إن راديسون مكة النسيم": [
        { userName: "Karim Mostafa", rating: 4.5, text: "Modern, colorful, and clean. The shuttle takes about 10-15 mins to Haram." },
        { userName: "أم يوسف", rating: 5, text: "فندق جديد ونظيف يلق، الألوان مبهجة. الباصات توصل لمواقف كدي ومنها للحرم." },
        { userName: "Fahad S.", rating: 4, text: "Good standard for the price. Breakfast has many international options." }
    ],

    // 8. Millennium Makkah Al Naseem (Existing - Adding more)
    "ملينيوم مكة النسيم": [
        { userName: "Sultan", rating: 5, text: "Huge complex, feels like a city. Very organized shuttle service." },
        { userName: "نوال", rating: 4.5, text: "منتجع متكامل، راحة واستجمام بعيد عن الزحمة. المواقف متوفرة بكثرة." }
    ],

    // 9. Al Shohada Hotel (Existing - Adding more)
    "فندق الشهداء": [
        { userName: "Tariq", rating: 4.5, text: "Old is gold. The room sizes are massive compared to new hotels." },
        { userName: "أم فيصل", rating: 5, text: "ما نغيره من سنين، أكلهم لذيذ والغرف واسعة تشرح الخاطر." }
    ],

    // 10. Novotel Makkah Thakher City (NEW)
    "نوفوتيل مكة ذاخر سيتي": [
        { userName: "Mahmoud Gamal", rating: 4, text: "Brand new area. Hotel is spotless. Great value for money." },
        { userName: "أبو العز", rating: 4.5, text: "فندق جديد، نظافة اهتمام. المنطقة لسه فيها شغل بس الفندق نفسه ممتاز." },
        { userName: "Sarah J.", rating: 4, text: "Nice modern rooms. Shuttle schedule is reliable." }
    ],

    // 11. Four Points by Sheraton Al Naseem (NEW)
    "فور بوينتس باي شيراتون النسيم": [
        { userName: "Kamal", rating: 4.5, text: "Sheraton standards in Al Naseem. Very comfortable beds." },
        { userName: "أم نواف", rating: 4, text: "مكان هادي ونظيف، وسعره معقول جداً مقارنة بالخدمة." },
        { userName: "Ali R.", rating: 4.5, text: "Great for groups. Food is tasty and staff are welcoming." }
    ]
};

async function main() {
    console.log(`Starting extra reviews seed...`);

    for (const [hotelName, reviews] of Object.entries(reviewsData)) {
        // Find valid hotel by name (partial match)
        const hotel = await prisma.hotel.findFirst({
            where: {
                OR: [
                    { name: { contains: hotelName } },
                    { nameEn: { contains: hotelName } } // Backup check
                ]
            }
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
                        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0] // Random date
                    }
                });
            }

            // Recalculate and update hotel rating
            const agg = await prisma.review.aggregate({
                where: { hotelId: hotel.id },
                _avg: { rating: true },
                _count: { rating: true }
            });

            await prisma.hotel.update({
                where: { id: hotel.id },
                data: {
                    rating: agg._avg.rating || 5,
                    reviews: agg._count.rating
                }
            });

            console.log(`✅ Updated ${hotel.name} - New Average: ${agg._avg.rating?.toFixed(2)} (${agg._count.rating} reviews)`);
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
