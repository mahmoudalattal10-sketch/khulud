
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Allowed Amenities (Strict)
const ALLOWED_AMENITIES = [
    'wifi', 'parking', 'pool', 'gym', 'food', 'shuttle', 'spa',
    'room_service', 'kids_club', 'business', 'laundry', 'concierge',
    'cafe', 'valet'
];

const jeddahHotels = [
    {
        name: "فندق روز وود جدة (Rosewood Jeddah)",
        nameEn: "Rosewood Jeddah",
        location: "الكورنيش الشمالي - حي الشاطئ",
        locationEn: "North Corniche - Al Shatie Dist",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 1800,
        coords: "21.5705,39.1086",
        distanceFromHaram: "12 كم من المركز",
        description: "أيقونة جدة التي لا تخطئها العين. يعتبر الفندق الأكثر طلباً للنخبة ورجال الأعمال بفضل موقعه المباشر على الكورنيش. يشتهر بخدمة الخادم الشخصي (Butler) لكل غرفة، ومسبحه الموجود على السطح الذي يوفر إطلالة بانورامية ساحرة على البحر الأحمر.",
        amenities: ["wifi", "pool", "gym", "food", "concierge", "valet", "room_service"],
        image: "https://images.unsplash.com/photo-1570213489059-0ecd6633251a?q=80&w=1000",
        reviews: [
            { user: "Hassan Al-Amri", comment: "The rooftop pool view is iconic. Best service in Jeddah.", rating: 5 },
            { user: "مها العتيبي", comment: "الخدمة فوق الوصف، والاهتمام بالتفاصيل دقيق جداً.", rating: 5 }
        ]
    },
    {
        name: "شانغريلا جدة (Shangri-La Jeddah)",
        nameEn: "Shangri-La Jeddah",
        location: "الكورنيش - برج أصيلة",
        locationEn: "Corniche - Assila Tower",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 2200,
        coords: "21.6250,39.1060",
        distanceFromHaram: "18 كم من المركز",
        description: "الوجهة الأحدث والأكثر 'ترند' في جدة حالياً. يتميز بموقعه الاستراتيجي الملاصق لـ 'رد سي مول' وإطلالاته المفتوحة بالكامل على البحر وحلبة الفورمولا 1. يضم مطاعم عالمية شهيرة مثل 'شانغ بالاس'.",
        amenities: ["wifi", "pool", "gym", "food", "kids_club", "spa", "valet"],
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
        reviews: [
            { user: "Sarah J.", comment: "Modern luxury at its finest. Directly connected to Red Sea Mall.", rating: 5 },
            { user: "فهد الدوسري", comment: "المطاعم عندهم عالمية، والإطلالة على الحلبة خرافية.", rating: 5 }
        ]
    },
    {
        name: "فندق ريتز كارلتون جدة (The Ritz-Carlton, Jeddah)",
        nameEn: "The Ritz-Carlton, Jeddah",
        location: "حي الحمراء - الكورنيش الجنوبي",
        locationEn: "Al Hamra - South Corniche",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 2000,
        coords: "21.5126,39.1558",
        distanceFromHaram: "4 كم من المركز",
        description: "قصر ملكي تحول إلى فندق. يتميز بمساحاته الشاسعة وقاعاته الضخمة التي تستضيف أكبر حفلات الزفاف والمؤتمرات. يقع قبالة نافورة الملك فهد، ويوفر أجواءً من الفخامة الكلاسيكية.",
        amenities: ["wifi", "business", "food", "spa", "gym", "concierge", "valet"],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        reviews: [
            { user: "أميرة", comment: "مكان ملكي، الهدوء والفخامة في كل ركن.", rating: 5 },
            { user: "John Doe", comment: "Perfect for large events. The fountain view is majestic.", rating: 5 }
        ]
    },
    {
        name: "فندق هيلتون جدة (Jeddah Hilton Hotel)",
        nameEn: "Jeddah Hilton Hotel",
        location: "الكورنيش الشمالي",
        locationEn: "North Corniche",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 1200,
        coords: "21.6050,39.1080",
        distanceFromHaram: "15 كم من المركز",
        description: "العملاق الذي يحافظ على شعبيته منذ سنوات. يعتبر الفندق العائلي رقم 1 في جدة بفضل مساحاته الكبيرة، ومسابحه المتعددة، وإطلالته المباشرة على الواجهة البحرية.",
        amenities: ["wifi", "pool", "kids_club", "food", "gym", "business", "cafe"],
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
        reviews: [
            { user: "أبو خالد", comment: "خيارنا الأول كعائلة دائماً. البوفيه عندهم ضخم ومتنوع.", rating: 5 },
            { user: "Ahmed K.", comment: "Great location and very spacious lobby.", rating: 4 }
        ]
    },
    {
        name: "فندق أصيلة، من لاكشري كوليكشن (Assila, a Luxury Collection Hotel)",
        nameEn: "Assila, a Luxury Collection Hotel",
        location: "شارع التحلية",
        locationEn: "Tahlia Street",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 1500,
        coords: "21.5505,39.1670",
        distanceFromHaram: "5 كم من المركز",
        description: "فندق عشاق الفن والتسوق. يقع في قلب شارع التحلية النابض بالحياة. يتميز الفندق بكونه معرضاً فنياً مفتوحاً يضم آلاف الأعمال الفنية. المسبح الموجود على السطح والمطاعم الراقية تجعله وجهة عصرية.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "concierge", "valet"],
        image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000",
        reviews: [
            { user: "روان", comment: "تصميم الفندق فني ورايق. موقعه في التحلية ممتاز.", rating: 5 },
            { user: "Layla M.", comment: "Very chic and trendy. Rooftop pool is great.", rating: 5 }
        ]
    },
    {
        name: "بارك حياة جدة - مارينا ونادي وسبا",
        nameEn: "Park Hyatt Jeddah - Marina, Club and Spa",
        location: "حي الحمراء - نادي الفروسية",
        locationEn: "Al Hamra - Equestrian Club",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 1900,
        coords: "21.5030,39.1530",
        distanceFromHaram: "3 كم من المركز",
        description: "منتجع في قلب المدينة. يتميز بكونه منخفض الارتفاع وممتداً داخل البحر وسط حدائق غناء. يمتلك مرسى لليخوت ونادياً صحياً (سبا) هو الأفضل في جدة. مطعم 'النافور' فيه يوفر أجمل جلسة خارجية.",
        amenities: ["wifi", "spa", "pool", "food", "gym", "valet", "concierge"],
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000",
        reviews: [
            { user: "سعيد الغامدي", comment: "أفضل سبا في جدة بلا منازع. جلسة النافورة في المساء خيال.", rating: 5 },
            { user: "Maria P.", comment: "Feels like a secluded resort in the middle of the city.", rating: 5 }
        ]
    },
    {
        name: "والدورف أستوريا جدة - قصر الشرق",
        nameEn: "Waldorf Astoria Jeddah - Qasr Al Sharq",
        location: "الكورنيش الشمالي",
        locationEn: "North Corniche",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 3000,
        coords: "21.5950,39.1080",
        distanceFromHaram: "14 كم من المركز",
        description: "ليس مجرد فندق، بل قصر من قصور ألف ليلة وليلة. يتميز بديكوراته المذهبة وثرياته الكريستالية. يقدم أعلى مستوى من الرفاهية والخصوصية (أجنحة فقط).",
        amenities: ["wifi", "spa", "food", "concierge", "butler", "valet"], // "butler" mapped to concierge usually but kept strict below
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
        reviews: [
            { user: "عبدالله", comment: "فخامة لا تضاهى. الخصوصية عالية جداً.", rating: 5 },
            { user: "Royal Guest", comment: "Truly a palace. The gold details are impressive.", rating: 5 }
        ]
    },
    {
        name: "فندق ذا فينيو جدة الكورنيش",
        nameEn: "The Venue Jeddah Corniche",
        location: "الكورنيش الشمالي",
        locationEn: "North Corniche",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 1100,
        coords: "21.5800,39.1080",
        distanceFromHaram: "12 كم من المركز",
        description: "فندق حديث وعصري نال شهرة واسعة بسرعة. يتميز بتصميمه الذي يشبه السفينة، وموقعه المباشر على البحر. الغرف واسعة جداً ومجهزة بأحدث التقنيات.",
        amenities: ["wifi", "pool", "gym", "food", "business", "valet", "cafe"],
        image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000",
        reviews: [
            { user: "نواف", comment: "سعر ممتاز مقابل الموقع والفخامة. الغرف وسيعة وشرحة.", rating: 5 },
            { user: "Khaled", comment: "Great value for money on the Corniche. Modern.", rating: 4 }
        ]
    },
    {
        name: "فندق جاليريا من إيلاف",
        nameEn: "The Hotel Galleria Jeddah, Curio Collection",
        location: "شارع التحلية",
        locationEn: "Tahlia Street",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 1300,
        coords: "21.5480,39.1650",
        distanceFromHaram: "5 كم من المركز",
        description: "قطعة من إيطاليا في قلب جدة. تصميمه المعماري مستوحى من 'جاليريا فيتوريو إيمانويل' في ميلانو. يقع وسط شارع التحلية ومتصل بمول فاخر.",
        amenities: ["wifi", "spa", "food", "cafe", "concierge", "gym"],
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000",
        reviews: [
            { user: "لمى", comment: "التصميم الإيطالي رائع. متصل بالمول وهذا شي مريح جداً.", rating: 5 },
            { user: "Italiano", comment: "Beautiful architecture. Right in the middle of Tahlia.", rating: 5 }
        ]
    },
    {
        name: "منتجع نارسيس أبحر",
        nameEn: "Narcissus Resort & Spa Obhur",
        location: "أبحر الشمالية",
        locationEn: "North Obhur",
        city: "jeddah",
        country: "SA",
        rating: 5,
        basePrice: 2500,
        coords: "21.7500,39.1300",
        distanceFromHaram: "35 كم من المركز",
        description: "الوجهة الأولى لمحبي 'الشاليهات' والخصوصية. يقع في منطقة أبحر بعيداً عن صخب المدينة، ويوفر فللاً خاصة بمسابح داخلية بالإضافة للمسابح العامة والشاطئ الرملي.",
        amenities: ["wifi", "pool", "spa", "food", "kids_club", "parking", "valet"],
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
        reviews: [
            { user: "عائلة فهد", comment: "الفلل الخاصة مع المسبح ممتازة للعوائل المحافظة. راحة واستجمام.", rating: 5 },
            { user: "Summer Lover", comment: "Best resort vibes in Jeddah. The beach is nice.", rating: 4 }
        ]
    }
];

async function main() {
    console.log('Seeding Jeddah Hotels...');


    for (const h of jeddahHotels) {
        // Basic format "ARABIC (ENGLISH)"
        // Filter amenities to strict list (Extra safety)
        const validAmenities = h.amenities.filter(a => ALLOWED_AMENITIES.includes(a));

        const hotel = await prisma.hotel.create({
            data: {
                slug: `hotel-jeddah-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: h.name,
                nameEn: h.nameEn,
                location: h.location,
                locationEn: h.locationEn,
                city: h.city,
                country: h.country,
                rating: h.rating,
                reviews: Math.floor(Math.random() * 500) + 100,
                basePrice: h.basePrice,
                description: h.description,
                // Amenities Relation
                amenities: {
                    create: validAmenities.map(name => ({
                        amenity: {
                            connectOrCreate: {
                                where: { name },
                                create: { name, nameEn: name.charAt(0).toUpperCase() + name.slice(1) }
                            }
                        }
                    }))
                },
                coords: h.coords,
                image: h.image,
                // Images Relation
                images: {
                    create: [{
                        url: h.image,
                        isMain: true
                    }]
                },
                view: "", // Strict View Policy
                isFeatured: Math.random() > 0.6,
                distanceFromHaram: h.distanceFromHaram, // "X km from Center"

                guestReviews: {
                    create: h.reviews.map(r => ({
                        userName: r.user,
                        rating: r.rating,
                        text: r.comment,
                        date: new Date().toISOString()
                    }))
                }
            }
        });
        console.log(`✅ Added: ${hotel.name}`);
    }


    console.log('🎉 Jeddah Hotels Seeding Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
