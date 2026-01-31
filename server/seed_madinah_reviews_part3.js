
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reviewsData = {
    // 15. Aqeeq Madinah Hotel
    "فندق العقيق المدينة": [
        { userName: "Badr Al-Harbi", rating: 4.5, text: "Excellent value for money. The location is prime, surrounded by shops." },
        { userName: "أم خالد", rating: 4, text: "الغرف نظيفة ومرتبة، والخدمة سريعة جداً. موقعه قريب من سوق التمور." }
    ],

    // 16. Saja Al Madinah
    "سجى المدينة": [
        { userName: "Ahmed Salah", rating: 4, text: "Modern and clean. Perfect for a good night's sleep after Umrah." },
        { userName: "عبدالله", rating: 4.5, text: "ديكورات هادية ومريحة. السرير مريح جداً، والفندق نظيف يلمع." }
    ],

    // 17. Ruve Al Madinah
    "روف المدينة": [
        { userName: "Yara", rating: 4.5, text: "The buffet is surprisingly good for this category. Staff are very helpful." },
        { userName: "أبو محمد", rating: 4, text: "فندق عملي ونظيف، وقريب من الحرم. خيار ممتاز للعوائل الاقتصادية." }
    ],

    // 18. Nozol Royal Inn
    "نزل رويال إن": [
        { userName: "Hanan", rating: 5, text: "Very close to the women's gate. Spacious rooms, great for our group." },
        { userName: "أم عبدالرحمن", rating: 4.5, text: "وسع الغرف ممتاز، وقربه من المصلى ريحنا كثير. السعر متوسط ومناسب." }
    ],

    // 19. Artal Al Munawarrah
    "أرتال المنورة": [
        { userName: "Majed", rating: 3.5, text: "Good budget option. Clean and modern colors. A bit of a walk but manageable." },
        { userName: "فهد", rating: 3, text: "فندق نظيف بس بعيد شوي. السعر يشفع له، والغرف جديدة." }
    ],

    // 20. Zowar International Hotel
    "زوار إنترناشيونال": [
        { userName: "Ali K.", rating: 3.5, text: "Best price near Haram. It's basic but has everything you need." },
        { userName: "أبو يوسف", rating: 3, text: "فندق شعبي معروف، قريب من سوق التمور ورخيص. لا تتوقع فخامة بس يؤدي الغرض." }
    ]
};

async function main() {
    console.log(`Starting reviews seed for Madinah Part 3...`);

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
                        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0] // Random date
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
