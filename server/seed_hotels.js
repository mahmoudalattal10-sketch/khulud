
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const madinahHotels = [
    {
        name: "فندق أوبروي المدينة",
        nameEn: "The Oberoi Madinah",
        location: "المنطقة المركزية الشمالية (أمام باب النساء)",
        locationEn: "North Central Area",
        city: "المدينة المنورة",
        country: "SA",
        rating: 5,
        basePrice: 850,
        coords: "24.4710,39.6110",
        description: "جوهرة المدينة المنورة وعنوان الفخامة المطلقة. يعتبره الكثيرون الفندق الأرقى بلا منازع، حيث يتميز بموقعه الملاصق تماماً للحرم النبوي. يتميز بديكوراته المذهبة، وخدمة الخادم الشخصي (Butler).",
        amenities: JSON.stringify(["wifi", "food", "concierge", "valet", "gym", "spa"]),
        image: "https://images.unsplash.com/photo-1570213489059-0ecd6633251a?q=80&w=1000",
        distanceFromHaram: "50 متر",
        view: "إطلالة على القبة الخضراء",
        isFeatured: true
    },
    {
        name: "دار الإيمان إنتركونتيننتال",
        nameEn: "Dar Al Iman InterContinental",
        location: "المنطقة المركزية الشمالية (أمام ساحة الحرم الرئيسية)",
        locationEn: "North Central Area",
        city: "المدينة المنورة",
        country: "SA",
        rating: 5,
        basePrice: 700,
        coords: "24.4715,39.6105",
        description: "فندق يتمتع بموقع استراتيجي لا يضاهى في مواجهة بوابة الملك فهد. يفضله الزوار لسهولة الوصول منه إلى الروضة الشريفة. يقدم الفندق تجربة ضيافة كلاسيكية راقية جداً.",
        amenities: JSON.stringify(["wifi", "food", "shuttle", "elevator", "ac"]),
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
        distanceFromHaram: "100 متر",
        view: "إطلالة على الحرم",
        isFeatured: true
    },
    {
        name: "فندق دار التقوى",
        nameEn: "Dar Al Taqwa Hotel",
        location: "المنطقة المركزية الشمالية (أمام باب الملك فهد)",
        locationEn: "North Central Area",
        city: "المدينة المنورة",
        country: "SA",
        rating: 5,
        basePrice: 650,
        coords: "24.4720,39.6100",
        description: "يتميز بموقع 'خط أول' مباشر أمام المدخل الرئيسي للحرم. يعتبر من الفنادق المفضلة للعائلات الخليجية لما يوفره من خصوصية وخدمة حميمة ودافئة.",
        amenities: JSON.stringify(["wifi", "food", "cafe", "ac", "shop"]),
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000",
        distanceFromHaram: "80 متر",
        view: "إطلالة بانورامية على الحرم",
        isFeatured: true
    },
    {
        name: "شهد المدينة",
        nameEn: "Shahd Al Madinah",
        location: "المنطقة المركزية الشمالية (الجهة الشرقية)",
        locationEn: "North Central Area - East",
        city: "المدينة المنورة",
        country: "SA",
        rating: 5,
        basePrice: 580,
        coords: "24.4725,39.6120",
        description: "يقدم مفهوماً مختلفاً للفخامة بلمسات أندلسية وشرقية ساحرة. يتميز الفندق بتصميمه الداخلي الفريد الذي يبعث على الهدوء والسكينة، والإضاءة الخافتة المريحة للأعصاب.",
        amenities: JSON.stringify(["wifi", "food", "concierge", "ac"]),
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        distanceFromHaram: "120 متر",
        view: "إطلالة على المدينة",
        isFeatured: false
    },
    {
        name: "أنوار المدينة موفنبيك",
        nameEn: "Anwar Al Madinah Mövenpick",
        location: "المنطقة المركزية الشمالية",
        locationEn: "North Central Area",
        city: "المدينة المنورة",
        country: "SA",
        rating: 5,
        basePrice: 480,
        coords: "24.4730,39.6090",
        description: "الفندق الأضخم في المدينة المنورة والأكثر شهرة. يتميز بارتباطه بمركز تجاري متكامل (مول) في الطوابق السفلية، مما يجعله الخيار الأفضل للعائلات للتسوق.",
        amenities: JSON.stringify(["wifi", "food", "shop", "elevator", "ac"]),
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
        distanceFromHaram: "150 متر",
        view: "إطلالة جزئية",
        isFeatured: false
    },
    {
        name: "فندق هيلتون المدينة",
        nameEn: "Madinah Hilton Hotel",
        location: "المنطقة المركزية الشمالية (شارع الملك فهد)",
        locationEn: "King Fahd St",
        city: "المدينة المنورة",
        country: "SA",
        rating: 5,
        basePrice: 520,
        coords: "24.4735,39.6080",
        description: "من العلامات التجارية الراسخة التي يثق بها زوار المدينة. يتميز بموقعه الحيوي بالقرب من المطاعم والمحلات التجارية، ومواجهته للحرم. يوفر الفندق غرفاً واسعة.",
        amenities: JSON.stringify(["wifi", "food", "parking", "ac"]),
        image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000",
        distanceFromHaram: "200 متر",
        view: "إطلالة على الحرم",
        isFeatured: false
    },
    {
        name: "دلة طيبة",
        nameEn: "Dallah Taibah Hotel",
        location: "المنطقة المركزية الغربية (قرب باب السلام)",
        locationEn: "West Central Area",
        city: "المدينة المنورة",
        country: "SA",
        rating: 4,
        basePrice: 400,
        coords: "24.4700,39.6070",
        description: "يحظى بشعبية جارفة وسمعة طيبة جداً. يتميز بموقعه القريب جداً من 'باب السلام'، مما يجعله مفضلاً لمن يرغب في كثرة السلام على النبي ﷺ.",
        amenities: JSON.stringify(["wifi", "food", "cafe", "ac"]),
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000",
        distanceFromHaram: "250 متر",
        view: "إطلالة على المدينة",
        isFeatured: false
    }
];


async function main() {
    console.log(`Starting seed for ${madinahHotels.length} Madinah hotels...`);

    // Pre-define common amenities to ensure they exist
    const commonAmenities = [
        "wifi", "food", "concierge", "valet", "gym", "spa",
        "shuttle", "elevator", "ac", "cafe", "shop", "parking",
        "restaurant", "room_service", "family_rooms"
    ];

    for (const name of commonAmenities) {
        await prisma.amenity.upsert({
            where: { name },
            update: {},
            create: { name, nameEn: name.charAt(0).toUpperCase() + name.slice(1) }
        });
    }

    for (const h of madinahHotels) {
        const amenitiesList = JSON.parse(h.amenities);
        const imagesList = [h.image]; // Using main image for now

        const hotel = await prisma.hotel.create({
            data: {
                slug: `hotel-madinah-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                name: h.name,
                nameEn: h.nameEn,
                location: h.location,
                locationEn: h.locationEn,
                city: h.city || "madinah", // Default to madinah if missing
                country: h.country,
                rating: h.rating,
                reviews: Math.floor(Math.random() * 300) + 20,
                basePrice: h.basePrice,
                image: h.image,
                // Handle Images Relation
                images: {
                    create: imagesList.map((img, idx) => ({
                        url: img,
                        isMain: idx === 0,
                        caption: idx === 0 ? "Main View" : undefined
                    }))
                },
                coords: h.coords,
                // Handle Amenities Relation
                amenities: {
                    create: amenitiesList.map(a => ({
                        amenity: {
                            connect: { name: a }
                        }
                    }))
                },
                description: h.description,
                isFeatured: h.isFeatured,
                distanceFromHaram: h.distanceFromHaram,
                hasFreeBreakfast: Math.random() > 0.5,
                hasFreeTransport: amenitiesList.includes('shuttle'),
                view: h.view
            }
        });

        console.log(`✅ Created: ${h.name}`);
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

