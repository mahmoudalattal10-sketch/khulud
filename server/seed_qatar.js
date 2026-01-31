
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Allowed Amenities
const ALLOWED = [
    'wifi', 'parking', 'pool', 'gym', 'food', 'shuttle', 'spa',
    'room_service', 'kids_club', 'business', 'laundry', 'concierge',
    'cafe', 'valet'
];

const QATAR_HOTELS = [
    // --- DOHA ---
    {
        name: "رافلز الدوحة (Raffles Doha)",
        city: "doha",
        location: "لوسيل (أبراج كتارا)",
        distance: "12 كم من المركز",
        rating: 5,
        price: 3500,
        desc: "الفندق الأيقوني داخل 'الهلال' المعماري. فندق 'أجنحة فقط' يوفر خدمة خادم شخصي وإطلالات بانورامية، ويعتبر قمة الفخامة العصرية في قطر.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "concierge", "valet"],
        coords: "25.3833,51.5333"
    },
    {
        name: "فيرمونت الدوحة (Fairmont Doha)",
        city: "doha",
        location: "لوسيل (أبراج كتارا)",
        distance: "12 كم من المركز",
        rating: 5,
        price: 2800,
        desc: "النصف الثاني من الهلال الأيقوني. يستلهم تصميمه من اليخوت الفاخرة، ويضم أكبر ثريا في العالم. يجمع بين الفخامة والحيوية.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "concierge", "valet"],
        coords: "25.3835,51.5330"
    },
    {
        name: "سانت ريجيس الدوحة (The St. Regis Doha)",
        city: "doha",
        location: "الخليج الغربي (West Bay)",
        distance: "7 كم من المركز",
        rating: 5,
        price: 2500,
        desc: "العنوان الكلاسيكي للفخامة، يشتهر بمطاعمه العالمية وحفلاته الموسيقية. يمتلك مسبحاً أولمبياً وشاطئاً خاصاً، وخدمة ملكية.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "concierge", "valet", "kids_club"],
        coords: "25.3522,51.5268"
    },
    {
        name: "فور سيزونز الدوحة (Four Seasons Hotel Doha)",
        city: "doha",
        location: "الخليج الغربي",
        distance: "5.5 كم من المركز",
        rating: 5,
        price: 3200,
        desc: "واحة حضرية تمتلك شاطئاً خاصاً ومراسي لليخوت. يضم مطعم 'نوبو' الشهير، ويجمع بين كفاءة الأعمال ورفاهية المنتجعات.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "business", "valet"],
        coords: "25.3218,51.5280"
    },
    {
        name: "فندق شيراتون جراند الدوحة (Sheraton Grand Doha)",
        city: "doha",
        location: "الكورنيش",
        distance: "4 كم من المركز",
        rating: 5,
        price: 1800,
        desc: "'الهرم' الذي يعرفه كل زائر، أعرق فندق في قطر. يتميز بأفضل موقع على الكورنيش وحديقة شاسعة وشاطئ رملي، وهو المفضل للعائلات التقليدية.",
        amenities: ["wifi", "pool", "gym", "food", "kids_club", "spa", "valet"],
        coords: "25.3094,51.5332"
    },
    {
        name: "دبليو الدوحة (W Doha)",
        city: "doha",
        location: "الخليج الغربي",
        distance: "5 كم من المركز",
        rating: 5,
        price: 1500,
        desc: "فندق الطاقة والحياة الصاخبة. يضم أشهر المطاعم والمقاهي العصرية. يتميز بتصميمه الداخلي الحديث، وهو الوجهة الأولى للشباب.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "cafe", "valet"],
        coords: "25.3235,51.5263"
    },
    {
        name: "موندريان الدوحة (Mondrian Doha)",
        city: "doha",
        location: "الخليج الغربي (قرب لوسيل)",
        distance: "10 كم من المركز",
        rating: 5,
        price: 1600,
        desc: "فندق 'للحالمين' بتصميم خيالي من 'أليس في بلاد العجائب'. يضم مطاعم شهيرة ومسبحاً داخلياً مبهراً، وهو وجهة محبي التصوير.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet"],
        coords: "25.3606,51.5167"
    },
    {
        name: "فنادق بوتيك سوق واقف (Souq Waqif Boutique Hotels)",
        city: "doha",
        location: "سوق واقف",
        distance: "0 كم من المركز",
        rating: 5,
        price: 1200,
        desc: "مجموعة فنادق تاريخية صغيرة متناثرة داخل السوق التراثي. تقدم تجربة إقامة أصيلة تعيدك للماضي مع رفاهية 5 نجوم.",
        amenities: ["wifi", "spa", "food", "concierge", "cafe"],
        coords: "25.2882,51.5312"
    },
    {
        name: "مرسى ملاذ كمبينسكي (Marsa Malaz Kempinski)",
        city: "doha",
        location: "جزيرة اللؤلؤة (The Pearl)",
        distance: "14 كم من المركز",
        rating: 5,
        price: 2900,
        desc: "قصر يطفو على جزيرة خاصة داخل اللؤلؤة. يعكس الفخامة الأوروبية الملكية ويضم شاطئاً خاصاً ومجموعة ضخمة من المطاعم.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "valet"],
        coords: "25.3738,51.5518"
    },
    {
        name: "ماندارين أورينتال الدوحة (Mandarin Oriental, Doha)",
        city: "doha",
        location: "مشيرب قلب الدوحة",
        distance: "0.5 كم من المركز",
        rating: 5,
        price: 3100,
        desc: "جوهرة مشيرب الذكية. يمزج بين التصميم القطري التراثي واللمسات العصرية الأنيقة جداً. يعتبر الملاذ الحضري الأرقى في وسط المدينة.",
        amenities: ["wifi", "spa", "gym", "pool", "food", "concierge", "valet"],
        coords: "25.2861,51.5258"
    },

    // --- AL WAKRAH ---
    {
        name: "فندق سوق الوكرة (Souq Al Wakra Hotel)",
        city: "al_wakrah",
        location: "سوق الوكرة القديم",
        distance: "0 كم من المركز",
        rating: 5,
        price: 800,
        desc: "منتجع تراثي من فئة 5 نجوم يمتد على شاطئ البحر. يتكون من بيوت تراثية قديمة تم تحويلها لغرف فندقية فاخرة. يجمع بين الأصالة والهدوء.",
        amenities: ["wifi", "pool", "spa", "food", "gym", "cafe"],
        coords: "25.1764,51.6083"
    },
    {
        name: "فندق تايم راكو (TIME Rako Hotel)",
        city: "al_wakrah",
        location: "الوكرة (طريق مسيعيد)",
        distance: "5 كم من المركز",
        rating: 4,
        price: 400,
        desc: "فندق 4 نجوم عصري يطل على البحر والمدينة. يوفر مسبحاً على السطح وغرفاً مريحة. خيار ممتاز لرجال الأعمال والمسافرين القريبين من المطار.",
        amenities: ["wifi", "pool", "gym", "food", "business"],
        coords: "25.1582,51.6000"
    },
    {
        name: "رتاج إن الوكرة (Retaj Inn Al Wakrah)",
        city: "al_wakrah",
        location: "وسط الوكرة",
        distance: "2 كم من المركز",
        rating: 3,
        price: 250,
        desc: "شقق فندقية وغرف عملية توفر إقامة مريحة واقتصادية. يتميز بقربه من الخدمات والمحلات التجارية في مدينة الوكرة.",
        amenities: ["wifi", "food", "laundry"],
        coords: "25.1700,51.6050"
    },

    // --- AL KHOR ---
    {
        name: "منتجع تيو سي (Tio Sea Resort)",
        city: "al_khor",
        location: "شاطئ الخور",
        distance: "2 كم من المركز",
        rating: 4,
        price: 600,
        desc: "منتجع شاطئي مصمم كقلعة بدوية تطل على الخليج العربي. يضم مسبحاً كبيراً وشاطئاً خاصاً، وهو الوجهة الكلاسيكية للعائلات.",
        amenities: ["wifi", "pool", "organic", "food", "kids_club"], // 'organic' not allowed -> filtered
        coords: "25.6833,51.5000"
    },
    {
        name: "منتجع سميسمة، من مروب (Simaisma A Murwab Resort)",
        city: "al_khor",
        location: "سميسمة (جنوب الخور)",
        distance: "15 كم من المركز",
        rating: 5,
        price: 1800,
        desc: "منتجع فخم يوفر فيلات خاصة واسعة وشاطئاً هادئاً. يعتبر الملاذ المفضل للعائلات القطرية الباحثة عن الخصوصية والراحة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "valet"],
        coords: "25.5727,51.4883"
    },
    {
        name: "منتجع زلال الصحي (Zulal Wellness Resort)",
        city: "al_khor",
        location: "الرويس (شمال الخور)",
        distance: "40 كم من المركز",
        rating: 5,
        price: 4500,
        desc: "أكبر وجهة للعلاج الصحي والاستجمام في المنطقة. يقع في منطقة معزولة وهادئة تماماً، ويقدم برامج علاجية وغذائية متخصصة.",
        amenities: ["wifi", "spa", "gym", "pool", "food", "concierge", "valet"],
        coords: "26.1153,51.1897"
    },
    {
        name: "منتجع حليتان الصحي (Hleetan Wellness Resort)",
        city: "al_khor",
        location: "الخور",
        distance: "1 كم من المركز",
        rating: 4,
        price: 1200,
        desc: "منتجع صحي يوفر إقامة هادئة مع التركيز على العافية والخصوصية، ويعد من الخيارات الحديثة في منطقة الخور.",
        amenities: ["wifi", "spa", "pool", "food", "gym"],
        coords: "25.6900,51.5100"
    }
];

async function main() {
    console.log('Seeding Qatar Hotels...');

    for (const h of QATAR_HOTELS) {
        let nameAr = h.name.includes("(") ? h.name.split("(")[0].trim() : h.name;
        let nameEn = h.name.includes("(") ? h.name.split("(")[1].replace(")", "").trim() : h.name;
        if (!nameEn) nameEn = nameAr;

        // Filter Amenities
        const validAmenities = h.amenities ? h.amenities.filter(a => ALLOWED.includes(a)) : [];

        const hotel = await prisma.hotel.create({
            data: {
                slug: `hotel-${h.city}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: nameAr,
                nameEn: nameEn,
                location: h.location,
                locationEn: h.location, // Keeping simplified
                city: h.city,
                country: "QA", // Qatar
                rating: h.rating,
                reviews: Math.floor(Math.random() * 200) + 30,
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
                        { userName: "Qatar Resident", rating: 5, text: "Amazing experience.", date: new Date().toISOString() },
                        { userName: "Visitor", rating: h.rating, text: "Very good service.", date: new Date().toISOString() }
                    ]
                }
            }
        });

        console.log(`✅ Added: ${hotel.name} (${h.city})`);
    }

    console.log('🎉 Qatar Hotels Seeding Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
