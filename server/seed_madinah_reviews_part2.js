
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reviewsData = {
    // 8. Pullman Zamzam Madinah
    "فندق بولمان زمزم المدينة": [
        { userName: "Hisham", rating: 5, text: "Excellent Accor standards. The Horizon restaurant (Al-Afaq) has a brilliant buffet." },
        { userName: "أم خالد", rating: 4.5, text: "الفندق هادئ وبعيد عن الزحمة. بوفيه الإفطار في مطعم الآفاق لذيذ جداً ومتنوع." }
    ],

    // 9. Crowne Plaza Madinah
    "كراون بلازا المدينة": [
        { userName: "Sami Al-Faisal", rating: 5, text: "Perfect location for Rawdah access. The beds are incredibly comfortable." },
        { userName: "أبو عبدالرحيم", rating: 4.5, text: "الممرات واسعة والخدمة راقية جداً. أفضل خيار للراحة بعد الصلاة." }
    ],

    // 10. InterContinental Dar Al Hijra
    "إنتركونتيننتال دار الهجرة": [
        { userName: "Dr. Yasser", rating: 4.5, text: "Spacious rooms, one of the biggest I've seen. Al Safa restaurant is top tier." },
        { userName: "أم زياد", rating: 5, text: "صحيح إنه صف ثاني بس خدمته خدمة 5 نجوم حقيقية. مطعم الصفا أكلة ممتاز." }
    ],

    // 11. Taiba Front Hotel
    "طيبة فرونت": [
        { userName: "Malik", rating: 4, text: "Renovated and fresh. The direct view of the Haram is spiritually uplifting." },
        { userName: "أبو حمد", rating: 5, text: "التجديدات الأخيرة نقلت الفندق نقلة نوعية. الغرف ذكية ومريحة جداً للمجموعات." }
    ],

    // 12. Rua Al Madinah
    "رؤى المدينة": [
        { userName: "Fares J.", rating: 4.5, text: "Elegant and calm. Very close to the markets. Great value for families." },
        { userName: "أم عمار", rating: 4, text: "فندق راقي وهادي، وأسعاره ممتازة مقارنة بالخدمة. بوفيه الإفطار متنوع." }
    ],

    // 13. Emaar Royal Hotel
    "إعمار رويال": [
        { userName: "Layla", rating: 5, text: "The royal floors offer an amazing view. Very convenient for women near the prayer area." },
        { userName: "أبو سلطان", rating: 5, text: "فخامة اللوبي، وقربه من مصلى النساء ريح الأهل جداً. ممتاز." }
    ],

    // 14. Frontel Al Harithia
    "فرونتيل الحارثية": [
        { userName: "Zaid", rating: 5, text: "Luxury without the crowds. Very close to Bab Al Salam. Room service is fast." },
        { userName: "غسان", rating: 4.5, text: "المنطقة الغربية هادية ومريحة. الفندق وسيع وشرح والخدمة ممتازة." }
    ]
};

async function main() {
    console.log(`Starting reviews seed for Madinah Part 2...`);

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
