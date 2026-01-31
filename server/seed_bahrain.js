
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Allowed Amenities
const ALLOWED = [
    'wifi', 'parking', 'pool', 'gym', 'food', 'shuttle', 'spa',
    'room_service', 'kids_club', 'business', 'laundry', 'concierge',
    'cafe', 'valet'
];

const BAHRAIN_HOTELS = [
    // --- MANAMA ---
    {
        name: "فندق فورسيزونز خليج البحرين (Four Seasons Hotel Bahrain Bay)",
        city: "manama",
        location: "خليج البحرين",
        distance: "2.5 كم من المركز",
        rating: 5,
        price: 1600,
        desc: "يتربع على جزيرة خاصة ويعد أيقونة المنامة. يوفر شاطئاً خاصاً ومسابح 'إنفينيتي' وإطلالات بانورامية لا مثيل لها.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "valet"],
        coords: "26.2490,50.5900"
    },
    {
        name: "فندق ويندهام جراند (Wyndham Grand Manama)",
        city: "manama",
        location: "خليج البحرين",
        distance: "2.5 كم من المركز",
        rating: 5,
        price: 900,
        desc: "برج معماري 'ملتوي' يوفر إطلالات 360 درجة. فندق 'خالٍ من الكحول' ومناسب جداً للعائلات، مع مسابح ومرافق فخمة.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "valet"],
        coords: "26.2510,50.5920"
    },
    {
        name: "فندق ذا دبلومات راديسون بلو (The Diplomat Radisson Blu)",
        city: "manama",
        location: "المنطقة الدبلوماسية",
        distance: "1.5 كم من المركز",
        rating: 5,
        price: 700,
        desc: "فندق عريق تم تجديده بالكامل. يشتهر بمسبحه الكبير وناديه الصحي الممتاز، ويقع في قلب حي السفارات.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "business"],
        coords: "26.2400,50.5950"
    },
    {
        name: "فندق الخليج (The Gulf Hotel Bahrain)",
        city: "manama",
        location: "العدلية",
        distance: "3 كم من المركز",
        rating: 5,
        price: 850,
        desc: "الفندق الأسطوري في البحرين. يضم أكبر عدد من المطاعم الراقية وحدائق استوائية وقاعات ضخمة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "business", "valet"],
        coords: "26.2150,50.5970"
    },
    {
        name: "فندق داون تاون روتانا (Downtown Rotana)",
        city: "manama",
        location: "سوق المنامة",
        distance: "0.5 كم من المركز",
        rating: 5,
        price: 600,
        desc: "برج حديث وسط المنامة القديمة. قريب جداً من 'باب البحرين' والسوق، ويوفر إطلالات رائعة على المدينة.",
        amenities: ["wifi", "pool", "gym", "food", "business"],
        coords: "26.2350,50.5750"
    },
    {
        name: "فندق انتركونتيننتال ريجنسي (InterContinental Regency Bahrain)",
        city: "manama",
        location: "سوق المنامة",
        distance: "0.5 كم من المركز",
        rating: 5,
        price: 750,
        desc: "يقع في قلب المنطقة التجارية. يتميز بخدمته الموثوقة وغرفه الكلاسيكية الواسعة، وموقعه القريب من الأسواق.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "business"],
        coords: "26.2360,50.5730"
    },
    {
        name: "فندق ويستين سيتي سنتر (The Westin City Centre Bahrain)",
        city: "manama",
        location: "السيف",
        distance: "4 كم من المركز",
        rating: 5,
        price: 1100,
        desc: "متصل مباشرة بـ 'سيتي سنتر البحرين' أكبر مول في المملكة. خيار العائلات الأول للتسوق والترفيه.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "kids_club"],
        coords: "26.2320,50.5520"
    },
    {
        name: "فندق لو ميريديان (Le Méridien City Centre Bahrain)",
        city: "manama",
        location: "السيف",
        distance: "4 كم من المركز",
        rating: 5,
        price: 1000,
        desc: "التوأم لفندق ويستين والمتصل أيضاً بالمول. يتميز بطابع عصري وأنيق وبوفيه إفطار شهير.",
        amenities: ["wifi", "pool", "gym", "food", "spa"],
        coords: "26.2325,50.5525"
    },
    {
        name: "فندق كراون بلازا (Crowne Plaza Bahrain)",
        city: "manama",
        location: "المنطقة الدبلوماسية",
        distance: "1.5 كم من المركز",
        rating: 5,
        price: 650,
        desc: "فندق حيوي ومشهور بمركز المؤتمرات. موقع استراتيجي لرجال الأعمال وقريب من الأفنيوز والمتاحف.",
        amenities: ["wifi", "pool", "gym", "food", "business"],
        coords: "26.2410,50.5930"
    },
    {
        name: "فندق ذا مرشنت هاوس (The Merchant House)",
        city: "manama",
        location: "باب البحرين",
        distance: "0 كم من المركز",
        rating: 5,
        price: 1300,
        desc: "أول فندق 'بوتيك' 5 نجوم في البحرين. يقع في مبنى تاريخي ويتميز بتصميمه الفني ومطعمه الجميل على السطح.",
        amenities: ["wifi", "pool", "food", "spa", "valet"],
        coords: "26.2340,50.5720"
    },

    // --- MUHARRAQ ---
    {
        name: "فندق موفنبيك البحرين (Mövenpick Hotel Bahrain)",
        city: "muharraq",
        location: "المطار",
        distance: "2 كم من المركز",
        rating: 5,
        price: 800,
        desc: "فندق 'بوتيك' أنيق بجوار المطار. يطل على بحيرة دوحة عراد، ويشتهر بجودة طعامه وأجوائه الهادئة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "shuttle"],
        coords: "26.2580,50.6270"
    },
    {
        name: "فندق آرت (The Art Hotel & Resort)",
        city: "muharraq",
        location: "جزر أمواج",
        distance: "10 كم من المركز",
        rating: 5,
        price: 1200,
        desc: "منتجع عائلي ضخم يضم حديقة مائية وشاطئاً خاصاً. جميع الغرف تطل على البحر، وهو وجهة ترفيهية متكاملة.",
        amenities: ["wifi", "pool", "kids_club", "food", "spa", "gym", "valet"],
        coords: "26.2880,50.6600"
    },
    {
        name: "فندق ومنتجع دراجون (Dragon Hotel and Resort)",
        city: "muharraq",
        location: "جزر أمواج",
        distance: "10 كم من المركز",
        rating: 4,
        price: 900,
        desc: "يتميز بتصميمه الفريد على شكل 'تنين'. يوفر شاليهات وفللاً خاصة ومسابح مطلة على البحر.",
        amenities: ["wifi", "pool", "kids_club", "food", "valet"],
        coords: "26.2850,50.6550"
    },
    {
        name: "ماجستيك أرجان من روتانا (Majestic Arjaan by Rotana)",
        city: "muharraq",
        location: "البسيتين",
        distance: "3 كم من المركز",
        rating: 4,
        price: 500,
        desc: "شقق فندقية راقية مقابل مستشفى الملك حمد. منطقة هادئة وشقق واسعة جداً ومجهزة بالكامل.",
        amenities: ["wifi", "pool", "gym", "food", "laundry"],
        coords: "26.2650,50.6100"
    },
    {
        name: "منتجع إليت (Elite Resort & Spa)",
        city: "muharraq",
        location: "جسر الشيخ حمد",
        distance: "2 كم من المركز",
        rating: 4,
        price: 600,
        desc: "منتجع عائلي يطل على خليج البحرين. يتميز بشققه الواسعة وموقعه الاستراتيجي بين المنامة والمحرق.",
        amenities: ["wifi", "pool", "spa", "gym", "food"],
        coords: "26.2450,50.6100"
    },
    {
        name: "نوفوتيل الدانة (Novotel Bahrain Al Dana Resort)",
        city: "muharraq",
        location: "جسر الشيخ حمد",
        distance: "2.5 كم من المركز",
        rating: 4,
        price: 700,
        desc: "منتجع تقليدي منخفض الارتفاع بطراز عربي. يمتلك شاطئاً خاصاً وحدائق، ويوفر أجواء استرخاء مميزة.",
        amenities: ["wifi", "pool", "kids_club", "food", "spa"],
        coords: "26.2480,50.6080"
    },
    {
        name: "فندق مطار البحرين (Bahrain Airport Hotel)",
        city: "muharraq",
        location: "داخل المطار",
        distance: "2 كم من المركز",
        rating: 4,
        price: 900,
        desc: "يقع داخل مبنى المسافرين الجديد. يوفر كبسولات نوم وغرفاً للترانزيت والراحة القصيرة بجودة عالية.",
        amenities: ["wifi", "spa", "food", "business"],
        coords: "26.2700,50.6330"
    },
    {
        name: "منتجع جروف (The Grove Resort Bahrain)",
        city: "muharraq",
        location: "جزر أمواج",
        distance: "10 كم من المركز",
        rating: 5,
        price: 1400,
        desc: "فلل وشقق عائلية فاخرة مع شاطئ خاص ومسابح. مثالي للعائلات الكبيرة التي تبحث عن الخصوصية.",
        amenities: ["wifi", "pool", "kids_club", "food", "valet"],
        coords: "26.2900,50.6620"
    },
    {
        name: "فندق رمادا أمواج (Ramada Hotel & Suites by Wyndham)",
        city: "muharraq",
        location: "جزر أمواج",
        distance: "10 كم من المركز",
        rating: 4,
        price: 400,
        desc: "فندق اقتصادي وعملي في قلب أمواج. قريب من المطاعم واللاغون، ويوفر غرفاً مريحة بأسعار جيدة.",
        amenities: ["wifi", "pool", "gym", "food"],
        coords: "26.2870,50.6580"
    },
    {
        name: "منتجع فيدا الشاطئي (Vida Beach Resort)",
        city: "muharraq",
        location: "مراسي البحرين",
        distance: "12 كم من المركز",
        rating: 5,
        price: 1300,
        desc: "أحدث منتجع عصري في المحرق. يتصل بمول 'مراسي جاليريا' ويطل على شاطئ خلاب. وجهة عصرية وشبابية.",
        amenities: ["wifi", "pool", "gym", "food", "valet"],
        coords: "26.2950,50.6400"
    },

    // --- RIFFA ---
    {
        name: "منتجع وفندق البندر (Al Bander Hotel & Resort)",
        city: "riffa",
        location: "سترة/الرفاع الشرقي",
        distance: "7 كم من المركز",
        rating: 4,
        price: 800,
        desc: "منتجع بحري متكامل يشبه القرية. يضم شاليهات ومرينا لليخوت ومسابح ومطاعم، ويعتبر المتنفس البحري الأقرب لسكان الرفاع.",
        amenities: ["wifi", "pool", "kids_club", "food", "gym"],
        coords: "26.1300,50.6200"
    },
    {
        name: "منتجع نورديك (Nordic Resort)",
        city: "riffa",
        location: "الهملة",
        distance: "9 كم من المركز",
        rating: 4,
        price: 1100,
        desc: "فلل فندقية بمسابح خاصة (Private Pools). مشهور جداً بين العائلات السعودية والخليجية للخصوصية التامة.",
        amenities: ["wifi", "pool", "food", "parking"],
        coords: "26.1500,50.4800"
    },
    {
        name: "فندق ذا كيه (The K Hotel)",
        city: "riffa",
        location: "الجفير",
        distance: "10 كم من المركز",
        rating: 4,
        price: 450,
        desc: "رغم كونه في الجفير، إلا أنه يعتبر الخيار المفضل لزوار الرفاع نظراً لموقعه على الطريق السريع المؤدي لها مباشرة.",
        amenities: ["wifi", "pool", "gym", "food", "business"],
        coords: "26.2100,50.6050"
    },
    {
        name: "منتجع العرين (Raffles Al Areen Palace Bahrain)",
        city: "riffa",
        location: "الصخير",
        distance: "12 كم من المركز",
        rating: 5,
        price: 2500,
        desc: "واحة الصحراء الفاخرة. عبارة عن فيلات كاملة بمسابح خاصة. قريب جداً من حلبة البحرين الدولية وجنة دلمون المفقودة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet", "concierge"],
        coords: "26.0300,50.5100"
    },
    {
        name: "فندق سوفتيل الزلاق (Sofitel Bahrain Zallaq)",
        city: "riffa",
        location: "الزلاق",
        distance: "10 كم من المركز",
        rating: 5,
        price: 1400,
        desc: "المنتجع البحري الأقرب لمنطقة الرفاع والقصور. يتميز بالعلاج بماء البحر وشاطئه الخاص، ويعتبر الملاذ الفاخر للمنطقة الجنوبية.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet"],
        coords: "26.0000,50.4800"
    }
];

async function main() {
    console.log('Seeding Bahrain Hotels...');

    for (const h of BAHRAIN_HOTELS) {
        let nameAr = h.name.includes("(") ? h.name.split("(")[0].trim() : h.name;
        let nameEn = h.name.includes("(") ? h.name.split("(")[1].replace(")", "").trim() : h.name;
        if (!nameEn) nameEn = nameAr;

        const validAmenities = h.amenities.filter(a => ALLOWED.includes(a));

        const hotel = await prisma.hotel.create({
            data: {
                slug: `hotel-${h.city}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: nameAr,
                nameEn: nameEn,
                location: h.location,
                locationEn: h.location, // Keeping simple
                city: h.city,
                country: "BH", // Bahrain
                rating: h.rating,
                reviews: Math.floor(Math.random() * 300) + 40,
                basePrice: h.price,
                description: h.desc,
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
                image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
                // Images Relation
                images: {
                    create: [{
                        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
                        isMain: true
                    }]
                },
                view: "", // Strict
                isFeatured: h.rating >= 5,
                distanceFromHaram: h.distance,

                guestReviews: {
                    create: [
                        { userName: "Bahrain Lover", rating: 5, text: "Wonderful service.", date: new Date().toISOString() },
                        { userName: "Guest", rating: h.rating, text: "Nice hotel.", date: new Date().toISOString() }
                    ]
                }
            }
        });

        console.log(`✅ Added: ${hotel.name} (${h.city})`);
    }

    console.log('🎉 Bahrain Hotels Seeding Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
