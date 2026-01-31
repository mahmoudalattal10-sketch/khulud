
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- 7 NEW MADINAH HOTELS ---
const madinahHotels = [
    {
        name: "فندق بولمان زمزم المدينة", // 8. Pullman Zamzam Madinah
        nameEn: "Pullman Zamzam Madinah",
        description: "فندق حديث وعصري يقع في الجهة الجنوبية للحرم (قريب من الروضة الشريفة). يتميز بخدمات 'أكور' العالمية، ويقدم غرفاً أنيقة بتجهيزات متطورة. يعتبر خياراً ممتازاً لمن يبحثون عن الهدوء بعيداً عن صخب المنطقة الشمالية، مع توفير مطعم 'الآفاق' الذي يقدم بوفيهات عالمية ومحلية مميزة.",
        location: "المنطقة المركزية الجنوبية",
        locationEn: "South Central Area",
        city: "madinah",
        rating: 5,
        reviews: 0,
        basePrice: 650,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000",
        images: [
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000",
            "https://images.unsplash.com/photo-1590523741831-ab7f41e93d13?q=80&w=1000"
        ],
        coords: [24.4672, 39.6112],
        amenities: ["wifi", "restaurant", "ac", "cafe", "accessible", "business"],
        distanceFromHaram: "150 متر (جنوبي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "إطلالة جزئية",
        isFeatured: false
    },
    {
        name: "كراون بلازا المدينة", // 9. Crowne Plaza Madinah
        nameEn: "Crowne Plaza Madinah",
        description: "يطل على ساحة الحرم الجنوبية، ويوفر مزيجاً مثالياً بين الرفاهية والعملية. يتميز الفندق بتصميمه الراقي وممراته الفسيحة. يعتبر موقعه ممتازاً جداً للوصول إلى الروضة الشريفة (للرجال والنساء حسب الأوقات). يشتهر بجودة الأسرّة والراحة في الغرف، مما يضمن نوماً هنيئاً بعد يوم طويل من العبادة.",
        location: "المنطقة المركزية الجنوبية",
        locationEn: "South Central Area",
        city: "madinah",
        rating: 5,
        reviews: 0,
        basePrice: 580,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
        images: [
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
            "https://images.unsplash.com/photo-1595858459295-a224f8e6583d?q=80&w=1000"
        ],
        coords: [24.4668, 39.6125],
        amenities: ["wifi", "restaurant", "ac", "cafe", "gym", "concierge"],
        distanceFromHaram: "100 متر (جنوبي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "إطلالة ساحة الحرم",
        isFeatured: false
    },
    {
        name: "إنتركونتيننتال دار الهجرة", // 10. InterContinental Dar Al Hijra
        nameEn: "InterContinental Dar Al Hijra",
        description: "على الرغم من أنه يقع في الصف الثاني (ليس مواجهاً مباشرة)، إلا أنه يعد من أفضل الفنادق خدمةً وجودة. يوفر مساحات غرف تعتبر من الأوسع في المدينة، ويشتهر بمطعمه المميز جداً 'الصفا'. خيار ذكي لمن يريد خدمة 5 نجوم حقيقية وسعر أقل قليلاً من فنادق الصف الأول.",
        location: "المنطقة المركزية الشمالية",
        locationEn: "North Central Area",
        city: "madinah",
        rating: 5,
        reviews: 0,
        basePrice: 450,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000",
        images: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000"
        ],
        coords: [24.4715, 39.6080],
        amenities: ["wifi", "restaurant", "ac", "room_service", "laundry"],
        distanceFromHaram: "300 متر (شمالي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "بدون إطلالة مباشرة",
        isFeatured: false
    },
    {
        name: "طيبة فرونت", // 11. Taiba Front Hotel
        nameEn: "Taiba Front Hotel",
        description: "(سابقاً آراك طيبة)، فندق مجدد وعصري يواجه الحرم مباشرة. يتميز بتصميمه الحديث وإطلالاته المباشرة. يعتبر من الخيارات المفضلة للمجموعات السياحية الراقية نظراً لموقعه الممتاز وخدماته السريعة. الغرف مصممة بذكاء لاستغلال المساحات وتوفير الراحة.",
        location: "المنطقة المركزية الشمالية",
        locationEn: "North Central Area",
        city: "madinah",
        rating: 4,
        reviews: 0,
        basePrice: 480,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
        images: [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
            "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1000"
        ],
        coords: [24.4720, 39.6105],
        amenities: ["wifi", "ac", "cafe", "elevator", "concierge"],
        distanceFromHaram: "50 متر (شمالي)",
        hasFreeBreakfast: false,
        hasFreeTransport: false,
        view: "إطلالة مباشرة",
        isFeatured: true
    },
    {
        name: "رؤى المدينة", // 12. Rua Al Madinah (formerly Coral)
        nameEn: "Rua Al Madinah",
        description: "فندق يتميز بالأناقة والهدوء، ويقدم خدمات راقية بأسعار تنافسية. موقعه قريب جداً من الأسواق والساحات، ويوفر بوفيه إفطار غني ومتنوع. الطاقم معروف بحسن الاستقبال والتعامل الراقي، مما يجعله خياراً محبباً للعائلات الصغيرة والأزواج.",
        location: "المنطقة المركزية الشمالية",
        locationEn: "North Central Area",
        city: "madinah",
        rating: 4,
        reviews: 0,
        basePrice: 380,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000",
        images: [
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000"
        ],
        coords: [24.4725, 39.6095],
        amenities: ["wifi", "restaurant", "ac", "family_rooms"],
        distanceFromHaram: "150 متر (شمالي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "إطلالة مدينة",
        isFeatured: false
    },
    {
        name: "إعمار رويال", // 13. Emaar Royal Hotel
        nameEn: "Emaar Royal Hotel",
        description: "فندق ضخم ومميز يقع في قلب المنطقة الحيوية. يتميز بقربه من مصلى النساء، مما يجعله خياراً مفضلاً للسيدات. يوفر الفندق طوابق ملكية بخدمات خاصة، وإطلالات رائعة من الأدوار العليا. الديكورات تجمع بين الأصالة والحداثة، واللوبي واسع ومريح للاستراحة.",
        location: "المنطقة المركزية الشمالية",
        locationEn: "North Central Area",
        city: "madinah",
        rating: 5,
        reviews: 0,
        basePrice: 520,
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1000",
        images: [
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1000",
            "https://images.unsplash.com/photo-1590073844002-c3cd0bc70364?q=80&w=1000"
        ],
        coords: [24.4730, 39.6085],
        amenities: ["wifi", "restaurant", "ac", "elevator", "spa", "room_service"],
        distanceFromHaram: "100 متر (شمالي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "إطلالة الحرم (أدوار عليا)",
        isFeatured: false
    },
    {
        name: "فرونتيل الحارثية", // 14. Frontel Al Harithia
        nameEn: "Frontel Al Harithia",
        description: "فندق 5 نجوم يقع في المنطقة الغربية الهادئة نسبياً. يتميز بقربه من باب السلام ومصلى العيد. يوفر غرفاً فسيحة وخدمة غرف ممتازة على مدار الساعة. يعتبر خياراً مثالياً لمن يبحث عن الفخامة ولكن يريد تجنب الزحام الشديد الموجود في المنطقة الشمالية.",
        location: "المنطقة المركزية الغربية",
        locationEn: "West Central Area",
        city: "madinah",
        rating: 5,
        reviews: 0,
        basePrice: 490,
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000",
        images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000",
            "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1000"
        ],
        coords: [24.4695, 39.6055],
        amenities: ["wifi", "restaurant", "ac", "room_service", "gym", "concierge"],
        distanceFromHaram: "200 متر (غربي)",
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        view: "إطلالة جزئية",
        isFeatured: false
    }
];


async function main() {
    console.log('Starting seed request for 7 Madinah hotels (Part 2)...');

    for (const h of madinahHotels) {
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

        // Convert coords array to string if needed, or keep as string if it is one. 
        // Schema expects string. Input is [lat, lng]
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
                    // Use new relation syntax
                    images: {
                        create: h.images.map((img, idx) => ({
                            url: img,
                            isMain: idx === 0
                        }))
                    },
                    coords: coordsStr,
                    // Use new relation syntax with connectOrCreate
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
    console.log('Seeding Part 2 complete.');
}


main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
