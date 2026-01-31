
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Allowed amenities: 'wifi', 'parking', 'pool', 'gym', 'food', 'shuttle', 'spa', 'room_service', 'kids_club', 'business', 'laundry', 'concierge', 'cafe', 'valet'

const madinahHotels3 = [
    {
        name: "فندق العقيق المدينة", // 15. Aqeeq Madinah Hotel
        nameEn: "Aqeeq Madinah Hotel",
        description: "فندق يتميز بموقعه القريب جداً من الحرم وتصميمه الكلاسيكي الجميل. يعتبر من الفنادق التي تقدم 'قيمة ممتازة مقابل المال'. الغرف نظيفة ومرتبة، والخدمة سريعة. يحيط به العديد من المحلات التجارية والمطاعم، مما يسهل إقامة النزلاء.",
        location: "المنطقة المركزية الغربية",
        locationEn: "West Central Area",
        city: "madinah",
        rating: 4,
        reviews: 0,
        basePrice: 350,
        image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1000",
        images: ["https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1000", "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000"],
        coords: [24.4690, 39.6060],
        amenities: ["wifi", "food", "cafe", "concierge", "room_service"],
        distanceFromHaram: "150 متر (غربي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "إطلالة جزئية",
        isFeatured: false
    },
    {
        name: "سجى المدينة", // 16. Saja Al Madinah
        nameEn: "Saja Al Madinah",
        description: "فندق حديث نسبياً (4 نجوم) حقق نجاحاً كبيراً بفضل نظافته وتصميمه المودرن الاقتصادي. يستهدف المعتمرين الذين يبحثون عن مكان مريح للنوم، نظيف جداً، وقريب من الحرم بسعر معقول. يتميز بأسرة مريحة جداً وديكورات بسيطة وأنيقة.",
        location: "المنطقة المركزية الشمالية",
        locationEn: "North Central Area",
        city: "madinah",
        rating: 4,
        reviews: 0,
        basePrice: 290,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000",
        images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000"],
        coords: [24.4740, 39.6090],
        amenities: ["wifi", "concierge", "laundry"],
        distanceFromHaram: "250 متر (شمالي)",
        hasFreeBreakfast: false,
        hasFreeTransport: false,
        view: "إطلالة مدينة",
        isFeatured: false
    },
    {
        name: "روف المدينة", // 17. Ruve Al Madinah
        nameEn: "Ruve Al Madinah",
        description: "يشتهر فندق روف بسمعته الطيبة في النظافة والترتيب. يقع على بعد خطوات قليلة من الحرم، ويوفر بوفيهات طعام مميزة جداً مقارنة بفئته. طاقم العمل متعاون، والغرف مصممة لتكون عملية ومريحة، وهو خيار العائلات الاقتصادية الأول.",
        location: "المنطقة المركزية الغربية",
        locationEn: "West Central Area",
        city: "madinah",
        rating: 4,
        reviews: 0,
        basePrice: 320,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000",
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000", "https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=1000"],
        coords: [24.4685, 39.6050],
        amenities: ["wifi", "food", "concierge", "laundry"],
        distanceFromHaram: "100 متر (غربي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "إطلالة جزئية",
        isFeatured: false
    },
    {
        name: "نزل رويال إن", // 18. Nozol Royal Inn
        nameEn: "Nozol Royal Inn",
        description: "جزء من سلسلة 'رويال إن' الشهيرة في المدينة. يتميز بموقعه الممتاز وسعته الكبيرة. يقدم خدمات فندقية متكاملة بأسعار متوسطة. الغرف واسعة ونظيفة، والفندق قريب جداً من مصلى النساء، مما يجعله مفضلاً للمجموعات النسائية والعائلات.",
        location: "المنطقة المركزية الشمالية",
        locationEn: "North Central Area",
        city: "madinah",
        rating: 4,
        reviews: 0,
        basePrice: 380,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
        images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000", "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000"],
        coords: [24.4728, 39.6100],
        amenities: ["wifi", "food", "cafe", "concierge", "room_service"],
        distanceFromHaram: "120 متر (شمالي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "إطلالة مدينة",
        isFeatured: false
    },
    {
        name: "أرتال المنورة", // 19. Artal Al Munawarrah
        nameEn: "Artal Al Munawarrah",
        description: "فندق اقتصادي حديث يوفر إقامة عصرية ومريحة. يتميز بالألوان الهادئة والنظافة الفائقة. يعتبر خياراً ذكياً للشباب والمجموعات الذين يقضون معظم وقتهم في الحرم ويريدون مكاناً نظيفاً وحديثاً للمبيت والراحة بأسعار لا ترهق الميزانية.",
        location: "المنطقة المركزية الغربية",
        locationEn: "West Central Area",
        city: "madinah",
        rating: 3,
        reviews: 0,
        basePrice: 200,
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1000",
        images: ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1000", "https://images.unsplash.com/photo-1595858459295-a224f8e6583d?q=80&w=1000"],
        coords: [24.4680, 39.6055],
        amenities: ["wifi", "concierge"],
        distanceFromHaram: "300 متر (غربي)",
        hasFreeBreakfast: false,
        hasFreeTransport: false,
        view: "لا يوجد",
        isFeatured: false
    },
    {
        name: "زوار إنترناشيونال", // 20. Zowar International Hotel
        nameEn: "Zowar International Hotel",
        description: "الفندق الشعبي المحبوب بفضل موقعه وسعره. يقع على مسافة قريبة جداً من الحرم والأسواق الشعبية (سوق التمور القديم). على الرغم من بساطته، إلا أنه يوفر كل الأساسيات المطلوبة لإقامة مريحة، ويعتبر من أكثر الفنادق حجزاً نظراً لأسعاره الاقتصادية المنافسة جداً.",
        location: "المنطقة المركزية الشمالية",
        locationEn: "North Central Area",
        city: "madinah",
        rating: 3,
        reviews: 0,
        basePrice: 180,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000"],
        coords: [24.4750, 39.6110],
        amenities: ["wifi", "food", "shop", "concierge"],
        distanceFromHaram: "350 متر (شمالي)",
        hasFreeBreakfast: false,
        hasFreeTransport: true,
        view: "إطلالة مدينة",
        isFeatured: false
    }
];


async function main() {
    console.log('Starting seed request for 6 MORE Madinah hotels (Part 3)...');

    for (const h of madinahHotels3) {
        // Check if exists
        const exists = await prisma.hotel.findFirst({
            where: {
                OR: [
                    { name: h.name },
                    { nameEn: h.nameEn }
                ]
            }
        });

        if (exists) {
            console.log(`⚠️ Hotel already exists: ${h.nameEn}. Skipping creation.`);
            continue;
        }

        const slug = h.nameEn.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 1000);
        const coordsStr = Array.isArray(h.coords) ? `${h.coords[0]},${h.coords[1]}` : h.coords;

        try {
            const hotel = await prisma.hotel.create({
                data: {
                    name: h.name,
                    nameEn: h.nameEn,
                    description: h.description,
                    location: h.location,
                    locationEn: h.locationEn,
                    city: h.city || 'madinah',
                    rating: h.rating,
                    reviews: h.reviews,
                    basePrice: h.basePrice,
                    image: h.image,
                    images: {
                        create: h.images.map((img, idx) => ({
                            url: img,
                            isMain: idx === 0
                        }))
                    },
                    coords: coordsStr,
                    amenities: {
                        create: h.amenities.map(name => ({
                            amenity: {
                                connectOrCreate: {
                                    where: { name },
                                    create: { name, nameEn: name.charAt(0).toUpperCase() + name.slice(1) }
                                }
                            }
                        }))
                    },
                    distanceFromHaram: h.distanceFromHaram,
                    hasFreeBreakfast: h.hasFreeBreakfast,
                    hasFreeTransport: h.hasFreeTransport,
                    view: h.view,
                    isFeatured: h.isFeatured,
                    slug: slug,
                    extraBedStock: 2,
                    isVisible: true,
                }
            });
            console.log(`✅ Created hotel: ${hotel.nameEn}`);
        } catch (error) {
            console.error(`❌ Error creating ${h.nameEn}:`, error);
        }
    }
    console.log('Seeding Part 3 complete.');
}


main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
