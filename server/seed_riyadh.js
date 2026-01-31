
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Riyadh Hotels Data from User
const riyadhHotels = [
    {
        name: "الريتز-كارلتون، الرياض (The Ritz-Carlton, Riyadh)",
        nameEn: "The Ritz-Carlton, Riyadh",
        location: "الهدا، طريق مكة المكرمة",
        locationEn: "Al Hada, Makkah Al Mukarramah Rd",
        city: "riyadh", // Standardizing for DB
        country: "SA",
        rating: 5,
        basePrice: 2500,
        coords: "24.6657,46.6302",
        description: "ليس مجرد فندق، بل هو قصر ملكي مفتوح للضيافة. يعتبر العنوان الأول للفخامة المطلقة في المملكة، حيث يستقبل كبار الشخصيات والوفود الرسمية. يتميز بمدخله المهيب وحدائقه الغنّاء التي تشبه القصور الأوروبية، ومسبحه الداخلي الأسطوري ذو القبة المزخرفة.",
        amenities: JSON.stringify(["wifi", "pool", "spa", "gym", "concierge", "valet", "food", "business"]),
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000", // Placeholder
        reviews: [
            { user: "عبدالعزيز آل سعود", comment: "تحفة معمارية وخدمة تليق بالملوك. المسبح الداخلي خيال.", rating: 5 },
            { user: "James Wilson", comment: "Absolute luxury. The gardens are breathtaking.", rating: 5 }
        ]
    },
    {
        name: "فور سيزونز الرياض (Four Seasons Hotel Riyadh)",
        nameEn: "Four Seasons Hotel Riyadh",
        location: "العليا، برج المملكة",
        locationEn: "Olaya, Kingdom Centre",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 2200,
        coords: "24.7114,46.6744",
        description: "إقامة تعانق السحاب في أشهر معالم الرياض 'برج المملكة'. يمنحك هذا الفندق إطلالات بانورامية خيالية تكشف العاصمة بالكامل من غرفتك. تم تجديده حديثاً ليعكس قمة الفخامة العصرية. خيار مثالي لعشاق التسوق الفاخر.",
        amenities: JSON.stringify(["wifi", "gym", "spa", "shop", "concierge", "valet", "food"]),
        image: "https://images.unsplash.com/photo-1570213489059-0ecd6633251a?q=80&w=1000",
        reviews: [
            { user: "نورة القحطاني", comment: "الإطلالة من الغرفة تسوى الدنيا كلها. التسوق في المول تحت مريح جداً.", rating: 5 },
            { user: "Faisal Al-Otaibi", comment: "Best view in Riyadh. Service is top notch as expected from Four Seasons.", rating: 5 }
        ]
    },
    {
        name: "ماندرين أورينتال الفيصلية (Mandarin Oriental Al Faisaliah)",
        nameEn: "Mandarin Oriental Al Faisaliah",
        location: "العليا، برج الفيصلية",
        locationEn: "Olaya, Al Faisaliah Tower",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 2800,
        coords: "24.6901,46.6849",
        description: "أيقونة العراقة التي ارتدت حلة جديدة من الفخامة الآسيوية العالمية. يجمع بين كرم الضيافة العربي وخدمة ماندرين أورينتال الأسطورية. يشتهر بمطعمه 'ذا جلوب' الموجود داخل الكرة الزجاجية الذهبية.",
        amenities: JSON.stringify(["wifi", "spa", "concierge", "butler", "food", "gym"]),
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        reviews: [
            { user: "سلطان العمري", comment: "خدمة البتلر (الخادم الشخصي) فرقت معنا كثير. تجربة لا تنسى.", rating: 5 },
            { user: "Sarah L.", comment: "Dinner at The Globe was unforgettable. The asian touch in design is beautiful.", rating: 5 }
        ]
    },
    {
        name: "سانت ريجيس الرياض (The St. Regis Riyadh)",
        nameEn: "The St. Regis Riyadh",
        location: "فيا الرياض، الهدا",
        locationEn: "Via Riyadh, Al Hada",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 3500,
        coords: "24.6635,46.6262",
        description: "العنوان الجديد للفخامة العصرية في منطقة 'فيا الرياض'. الفندق الوحيد المبني بالحجر الصخري السلماني. يقدم خدمة البتلر الشهيرة وسينما فاخرة بجواره.",
        amenities: JSON.stringify(["wifi", "spa", "concierge", "butler", "cinema", "food"]),
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
        reviews: [
            { user: "خالد بن محمد", comment: "المكان تحفة فنية. فيا رياضة جنبك فيها أفخم المطاعم.", rating: 5 },
            { user: "Mohammed A.", comment: "The Salmani architecture is stunning. True luxury.", rating: 5 }
        ]
    },
    {
        name: "فندق مانسارد الرياض، راديسون كوليكشن (Mansard Riyadh)",
        nameEn: "Mansard Riyadh, A Radisson Collection Hotel",
        location: "حي الربيع، طريق الأمير محمد بن سلمان",
        locationEn: "Al Rabi, Prince Mohammed Bin Salman Rd",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 1800,
        coords: "24.7877,46.6343",
        description: "قطعة من باريس في قلب الرياض. يتميز بتصميمه المعماري الفرنسي الكلاسيكي (Hausmann). 'الترند' الجديد في الرياض بفضل مطاعمه العالمية الشهيرة مثل ساديلز وكاربوني.",
        amenities: JSON.stringify(["wifi", "pool", "gym", "food", "cafe", "valet"]),
        image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000",
        reviews: [
            { user: "ريما السبيعي", comment: "كأنك في باريس! الديكور والتفاصيل تاخذ العقل.", rating: 5 },
            { user: "Saud K.", comment: "Carbone restaurant is a MUST. The hotel vibe is very chic.", rating: 5 }
        ]
    },
    {
        name: "فيرمونت الرياض (Fairmont Riyadh)",
        nameEn: "Fairmont Riyadh",
        location: "قرطبة، بوابة الأعمال",
        locationEn: "Qurtubah, Business Gate",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 1600,
        coords: "24.8118,46.7358",
        description: "فندق الأعمال الأول في الرياض. يقع داخل مجمع بوابة الأعمال وقريب جداً من المطار. يتميز بالفخامة الكلاسيكية والهدوء التام.",
        amenities: JSON.stringify(["wifi", "business", "meeting_rooms", "gym", "pool", "shuttle"]),
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000",
        reviews: [
            { user: "بدر الهزاع", comment: "ممتاز جداً لرجال الأعمال. هدوء وانترنت سريع وقريب من المطار.", rating: 5 },
            { user: "Ali Hassan", comment: "Very professional service. The business facilities are extensive.", rating: 4 }
        ]
    },
    {
        name: "جي دبليو ماريوت الرياض (JW Marriott Hotel Riyadh)",
        nameEn: "JW Marriott Hotel Riyadh",
        location: "الصحافة، طريق الملك فهد (برج رافال)",
        locationEn: "As Sahafah, King Fahd Rd (Burj Rafal)",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 1500,
        coords: "24.7937,46.6231",
        description: "أطول فندق سكني في الرياض، يقع في برج رافال. يوفر ملاذاً من الهدوء مع إطلالات ساحرة. يشتهر بمنتجعه الصحي الفاخر وتصاميمه النجدية الحديثة.",
        amenities: JSON.stringify(["wifi", "spa", "pool", "gym", "concierge", "food"]),
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
        reviews: [
            { user: "منى الخالد", comment: "السبا عندهم يفوز، هدوء واسترخاء مو طبيعي.", rating: 5 },
            { user: "Turki M.", comment: "Peaceful oasis in the north of Riyadh. Great views.", rating: 5 }
        ]
    },
    {
        name: "فندق نارسيس الرياض (Narcissus Hotel & SPA Riyadh)",
        nameEn: "Narcissus Hotel & SPA Riyadh",
        location: "العليا، تقاطع التحلية",
        locationEn: "Olaya, Tahlia Intersection",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 1300,
        coords: "24.6974,46.6853",
        description: "في قلب تقاطع شارع العليا مع التحلية، يضج بالحياة والفخامة الكلاسيكية. يشتهر ببوفيهات الطعام الضخمة والسبا الفاخر.",
        amenities: JSON.stringify(["wifi", "spa", "pool", "food", "concierge"]),
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
        reviews: [
            { user: "أم فهد", comment: "البوفيه عندهم لا يعلى عليه، تنوع وطعم خرافة.", rating: 5 },
            { user: "Saleh A.", comment: "Classic luxury. Perfect location for walking around Tahlia.", rating: 4 }
        ]
    },
    {
        name: "هيلتون الرياض والشقق الفندقية (Hilton Riyadh)",
        nameEn: "Hilton Riyadh Hotel & Residences",
        location: "غرناطة، الطريق الدائري الشرقي",
        locationEn: "Ghirnatah, Eastern Ring Rd",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 1400,
        coords: "24.7932,46.7415",
        description: "فندق ضخم ومتكامل يقع بجوار غرناطة مول. خيار رقم 1 للعائلات والإقامات الطويلة. يضم مساحات واسعة للمشي ومسابح متعددة.",
        amenities: JSON.stringify(["wifi", "pool", "kids_club", "food", "shop", "parking"]),
        image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000",
        reviews: [
            { user: "أبو ياسر", comment: "ممتاز للعائلات، المول جنبك وكل الخدمات متوفرة. الشقق واسعة ونظيفة.", rating: 5 },
            { user: "Hussain F.", comment: "Great resort feel within the city. Connected to Granada Mall is a big plus.", rating: 5 }
        ]
    },
    {
        name: "فندق جاريد (Jareed Hotel)",
        nameEn: "Jareed Hotel",
        location: "حطين، ذا بوليفارد",
        locationEn: "Hittin, The Boulevard",
        city: "riyadh",
        country: "SA",
        rating: 5,
        basePrice: 1900,
        coords: "24.7649,46.6026",
        description: "جوهرة مخفية لعشاق الفنادق البوتيك في قلب ذا بوليفارد. يقدم تجربة إقامة حميمة وشخصية للغاية مع تصميم داخلي فني.",
        amenities: JSON.stringify(["wifi", "concierge", "food", "cafe", "valet"]),
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000",
        reviews: [
            { user: "روان المالكي", comment: "هوتيل بوتيك رايق جداً، هدوء وخصوصية رغم انه في نص البوليفارد.", rating: 5 },
            { user: "Omar K.", comment: "Very stylish and intimate. Perfect for a weekend getaway.", rating: 5 }
        ]
    }
];

async function main() {
    console.log('Seeding Riyadh Hotels...');

    for (const h of riyadhHotels) {
        // Basic format "ARABIC (ENGLISH)" for name as standardized
        const fullName = `${h.name}`; // User provided format usually has English in parens already or we fix it.
        // Actually user provided: "الريتز-كارلتون، الرياض (The Ritz-Carlton, Riyadh)" -> Matches our format!

        const amenitiesList = JSON.parse(h.amenities);

        const hotel = await prisma.hotel.create({
            data: {
                slug: `hotel-riyadh-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: h.name, // Already in AR (EN) format mostly
                nameEn: h.nameEn,
                location: h.location,
                locationEn: h.locationEn,
                city: h.city, // 'riyadh'
                country: h.country,
                rating: h.rating,
                reviews: Math.floor(Math.random() * 500) + 100, // Review COUNT
                basePrice: h.basePrice,
                description: h.description,
                // Amenities Relation
                amenities: {
                    create: amenitiesList.map(name => ({
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
                view: "", // Strict View Policy: Empty for Riyadh
                isFeatured: Math.random() > 0.7, // Randomly feature some
                distanceFromHaram: "", // Not applicable

                // Add User Reviews
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

    console.log('🎉 Riyadh Hotels Seeding Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
