
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Allowed Amenities from Admin Panel (Strict)
const ALLOWED = [
    'wifi', 'parking', 'pool', 'gym', 'food', 'shuttle', 'spa',
    'room_service', 'kids_club', 'business', 'laundry', 'concierge',
    'cafe', 'valet'
];

const OMAN_HOTELS = [
    // --- MUSCAT ---
    {
        name: "قصر البستان، فندق ريتز كارلتون (Al Bustan Palace, a Ritz-Carlton Hotel)",
        city: "muscat",
        location: "البستان",
        distance: "15 كم من المركز",
        rating: 5,
        price: 1800,
        desc: "جوهرة فنادق عمان وأفخمها تاريخياً. يقع بين الجبال والبحر ويمتلك شاطئاً خاصاً هو الأطول في مسقط. يتميز بالبهو الضخم ذو القبة الشاهقة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "valet", "concierge"],
        coords: "23.5670,58.6100"
    },
    {
        name: "منتجع وسبا شانغريلا بر الجصة (Shangri-La Barr Al Jissah Resort & Spa)",
        city: "muscat",
        location: "بندر الجصة",
        distance: "20 كم من المركز",
        rating: 5,
        price: 1500,
        desc: "منتجع ضخم يتكون من ثلاثة فنادق (الواحة، البندر، الحصن). يقع في خليج منعزل بين الجبال الصخرية والبحر. مثالي للعائلات والأزواج.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "valet", "shuttle"],
        coords: "23.5500,58.6500"
    },
    {
        name: "دبليو مسقط (W Muscat)",
        city: "muscat",
        location: "شاطئ القرم",
        distance: "10 كم من المركز",
        rating: 5,
        price: 1300,
        desc: "الفندق الأكثر عصرية وحيوية في مسقط. يقع بجوار دار الأوبرا السلطانية مباشرة. يشتهر بتصميمه الجريء ومسبحه الحيوي.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "valet", "cafe"],
        coords: "23.6150,58.4700"
    },
    {
        name: "كمبينسكي مسقط (Kempinski Hotel Muscat)",
        city: "muscat",
        location: "الموج",
        distance: "35 كم من المركز",
        rating: 5,
        price: 1400,
        desc: "يقع في قلب مشروع 'الموج' العصري. يتميز بتصميم هندسي رائع وموقع استراتيجي بالقرب من المارينا والمطاعم والمقاهي.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "business", "valet"],
        coords: "23.6300,58.2600"
    },
    {
        name: "فندق شيدي مسقط (The Chedi Muscat)",
        city: "muscat",
        location: "الغبرة الشمالية",
        distance: "15 كم من المركز",
        rating: 5,
        price: 1600,
        desc: "أيقونة الهدوء والأناقة البسيطة. يتميز بحدائقه الهندسية وأطول مسبح في المنطقة. طرازه المعماري يدمج البياض مع التراث العماني.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet"],
        coords: "23.5900,58.4000"
    },
    {
        name: "جراند حياة مسقط (Grand Hyatt Muscat)",
        city: "muscat",
        location: "شاطئ القرم",
        distance: "12 كم من المركز",
        rating: 5,
        price: 1100,
        desc: "فندق كلاسيكي فخم في حي السفارات. يتميز بطرازه المعماري اليمني/العماني وبهوه الداخلي الضخم. يقع مباشرة على شاطئ القرم العام.",
        amenities: ["wifi", "pool", "gym", "food", "business", "valet"],
        coords: "23.6100,58.4500"
    },
    {
        name: "إنتركونتيننتال مسقط (InterContinental Muscat)",
        city: "muscat",
        location: "القرم",
        distance: "10 كم من المركز",
        rating: 5,
        price: 1000,
        desc: "من أعرق فنادق مسقط وأكثرها شهرة. يقع وسط حدائق خضراء واسعة ومسابح أولمبية. يعتبر نادياً اجتماعياً راقياً وموقعه استراتيجي.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "business"],
        coords: "23.6120,58.4600"
    },
    {
        name: "شيراتون عُمان (Sheraton Oman Hotel)",
        city: "muscat",
        location: "روي",
        distance: "0 كم من المركز",
        rating: 5,
        price: 800,
        desc: "أطول فندق في مسقط ومعلم بارز في منطقة الأعمال القديمة (روي). تم تجديده بالكامل ليقدم فخامة عصرية. خيار ممتاز لرجال الأعمال.",
        amenities: ["wifi", "pool", "gym", "food", "business", "shuttle"],
        coords: "23.5950,58.5400"
    },
    {
        name: "فندق كراون بلازا مسقط (Crowne Plaza Muscat)",
        city: "muscat",
        location: "مرتفعات القرم",
        distance: "8 كم من المركز",
        rating: 4,
        price: 900,
        desc: "يتربع على قمة تلة صخرية توفر أجمل إطلالة بانورامية في مسقط على البحر والمدينة. يمتلك شاطئاً خاصاً صغيراً.",
        amenities: ["wifi", "pool", "gym", "food", "valet", "business"],
        coords: "23.6200,58.4800"
    },
    {
        name: "سانت ريجيس الموج مسقط (The St. Regis Al Mouj Muscat Resort)",
        city: "muscat",
        location: "الموج",
        distance: "35 كم من المركز",
        rating: 5,
        price: 2000,
        desc: "أحدث وجهة للفخامة في مسقط. يجلب خدمة 'البتلر' وتصاميم سانت ريجيس الراقية إلى شاطئ الموج. يضم مجموعة مطاعم عالمية فاخرة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet", "concierge"],
        coords: "23.6350,58.2550"
    },

    // --- SALALAH ---
    {
        name: "منتجع البليد صلالة بإدارة أنانتارا (Al Baleed Resort Salalah by Anantara)",
        city: "salalah",
        location: "الدهاريز - المنصورة",
        distance: "6 كم من المركز",
        rating: 5,
        price: 1700,
        desc: "المنتجع الأفخم في صلالة. يقع بين شاطئ خاص وبحيرة مياه عذبة وموقع أثري. يتميز بالفلل الخاصة ذات المسابح.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "valet"],
        coords: "17.0150,54.1200"
    },
    {
        name: "منتجع روتانا صلالة (Salalah Rotana Resort)",
        city: "salalah",
        location: "هوانا صلالة",
        distance: "20 كم من المركز",
        rating: 5,
        price: 1100,
        desc: "أكبر منتجع في صلالة، مصمم كقرية بندقية عربية تتخللها القنوات المائية. يقع في مجمع هوانا السياحي ويوفر شاطئاً مفتوحاً.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club"],
        coords: "17.0350,54.2700"
    },
    {
        name: "فندق فنار (Fanar Hotel & Residences)",
        city: "salalah",
        location: "هوانا صلالة",
        distance: "20 كم من المركز",
        rating: 5,
        price: 1000,
        desc: "فندق عائلي ضخم وشامل الخدمات. يضم عدة شواطئ وبحيرات وحديقة ألعاب مائية صغيرة. المكان الأفضل للعائلات.",
        amenities: ["wifi", "pool", "kids_club", "food", "gym", "shuttle"],
        coords: "17.0370,54.2720"
    },
    {
        name: "كراون بلازا صلالة (Crowne Plaza Resort Salalah)",
        city: "salalah",
        location: "الدهاريز",
        distance: "5 كم من المركز",
        rating: 5,
        price: 900,
        desc: "منتجع كلاسيكي يقع وسط حدائق استوائية كثيفة ونخيل جوز الهند. يمتلك شاطئاً رملياً أبيض ناعماً جداً.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "business"],
        coords: "17.0100,54.1100"
    },
    {
        name: "منتجع هيلتون صلالة (Hilton Salalah Resort)",
        city: "salalah",
        location: "الدهاريز",
        distance: "10 كم من المركز",
        rating: 4,
        price: 850,
        desc: "يطل على شاطئ طويل ومفتوح. يتميز بطابعه الكلاسيكي ومرافقه المناسبة للعائلات، وموقعه القريب من الميناء والأسواق.",
        amenities: ["wifi", "pool", "gym", "food", "business", "kids_club"],
        coords: "17.0050,54.1000"
    },
    {
        name: "منتجع ميلينيوم صلالة (Millennium Resort Salalah)",
        city: "salalah",
        location: "السعادة",
        distance: "10 كم من المركز",
        rating: 4,
        price: 700,
        desc: "يتميز بكونه حديثاً ويوفر شققاً فندقية واسعة وفللاً، ومسبحاً كبيراً وخدمة نقل للشاطئ. يقع في منطقة السعادة.",
        amenities: ["wifi", "pool", "gym", "food", "shuttle", "spa"],
        coords: "17.0500,54.1500"
    },
    {
        name: "فندق إنتر سيتي صلالة (IntercityHotel Salalah)",
        city: "salalah",
        location: "وسط المدينة",
        distance: "0.5 كم من المركز",
        rating: 4,
        price: 450,
        desc: "يقع في قلب المنطقة التجارية والحكومية. فندق عملي وحديث، مثالي لرجال الأعمال ولمن يريد أن يكون قريباً من الأسواق.",
        amenities: ["wifi", "gym", "food", "business", "laundry"],
        coords: "17.0180,54.0950"
    },
    {
        name: "منتجع بلاد بونت (Belad Bont Resort)",
        city: "salalah",
        location: "عوقد",
        distance: "10 كم من المركز",
        rating: 4,
        price: 600,
        desc: "فندق حديث بتصاميم عصرية ومرافق متكاملة تشمل عدة مطاعم وسبا. يعتبر خياراً جيداً في الجانب الغربي من المدينة.",
        amenities: ["wifi", "pool", "gym", "food", "spa"],
        coords: "17.0000,54.0500"
    },
    {
        name: "فندق جويرة بوتيك (Juweira Boutique Hotel)",
        city: "salalah",
        location: "هوانا صلالة",
        distance: "20 كم من المركز",
        rating: 4,
        price: 800,
        desc: "فندق بوتيك هادئ يطل على المارينا في هوانا صلالة. مخصص للباحثين عن الهدوء والاسترخاء، 'للبالغين فقط' في بعض المواسم.",
        amenities: ["wifi", "pool", "gym", "food", "cafe"],
        coords: "17.0320,54.2680"
    },
    {
        name: "قرية سمهرم السياحية (Samharam Tourist Village)",
        city: "salalah",
        location: "الدهاريز",
        distance: "8 كم من المركز",
        rating: 3,
        price: 350,
        desc: "خيار اقتصادي وشعبي للعائلات. يوفر شاليهات وفللاً بسيطة مباشرة على الشاطئ. يتميز بمساحاته الخضراء الواسعة.",
        amenities: ["wifi", "pool", "food", "parking"],
        coords: "17.0200,54.1250"
    },

    // --- SOHAR ---
    {
        name: "فندق راديسون بلو صحار (Radisson Blu Hotel & Resort, Sohar)",
        city: "sohar",
        location: "الزعفران - الواجهة البحرية",
        distance: "6 كم من المركز",
        rating: 5,
        price: 700,
        desc: "أفخم فندق في صحار. يقع مباشرة على البحر ويتميز بتصميمه العصري ومسبحه الكبير المطل على الشاطئ. الوجهة الأولى لرجال الأعمال.",
        amenities: ["wifi", "pool", "gym", "food", "business", "spa"],
        coords: "24.3600,56.7400"
    },
    {
        name: "كراون بلازا صحار (Crowne Plaza Sohar)",
        city: "sohar",
        location: "فلج القبائل",
        distance: "20 كم من المركز",
        rating: 5,
        price: 650,
        desc: "فندق فاخر يقع بالقرب من المنطقة الصناعية والميناء. يتميز بحدائقه الواسعة ومرافقه الرياضية (بولينغ).",
        amenities: ["wifi", "pool", "gym", "food", "business", "kids_club"],
        coords: "24.4000,56.6500"
    },
    {
        name: "فندق ميركيور صحار (Mercure Sohar)",
        city: "sohar",
        location: "الطريف",
        distance: "4 كم من المركز",
        rating: 4,
        price: 450,
        desc: "فندق حديث وعملي يقع على الشارع العام. يوفر غرفاً مريحة وخدمة ممتازة، وموقعه يسهل الوصول إلى المولات والخدمات.",
        amenities: ["wifi", "pool", "gym", "food", "business"],
        coords: "24.3400,56.7200"
    },
    {
        name: "فندق شاطئ صحار (Sohar Beach Hotel)",
        city: "sohar",
        location: "الصالان",
        distance: "7 كم من المركز",
        rating: 4,
        price: 400,
        desc: "منتجع تقليدي مبني على الطراز العماني (حصن). يقع على الشاطئ مباشرة ويوفر أجواء هادئة وكلاسيكية.",
        amenities: ["wifi", "pool", "food", "parking"],
        coords: "24.3700,56.7500"
    },
    {
        name: "فندق الوادي (Al Wadi Hotel)",
        city: "sohar",
        location: "الطريف",
        distance: "7 كم من المركز",
        rating: 3,
        price: 350,
        desc: "من أقدم فنادق صحار وأكثرها شهرة. يتميز بطابعه التاريخي وحدائقه ومسبحه. يعتبر نقطة تجمع اجتماعية في المدينة.",
        amenities: ["wifi", "pool", "food", "cafe"],
        coords: "24.3450,56.7150"
    },
    {
        name: "فندق الحدائق الملكية (Royal Gardens Hotel)",
        city: "sohar",
        location: "الملتقى",
        distance: "16 كم من المركز",
        rating: 3,
        price: 300,
        desc: "فندق يقع على مدخل صحار. يوفر غرفاً واسعة ومسبحاً خارجياً، ويعتبر خياراً جيداً للمسافرين عبر الطريق البري.",
        amenities: ["wifi", "pool", "food", "parking"],
        coords: "24.3200,56.7000"
    }
];

async function main() {
    console.log('Seeding Oman Hotels...');

    for (const h of OMAN_HOTELS) {
        let nameAr = h.name.includes("(") ? h.name.split("(")[0].trim() : h.name;
        let nameEn = h.name.includes("(") ? h.name.split("(")[1].replace(")", "").trim() : h.name;
        if (!nameEn) nameEn = nameAr; // Fallback

        const validAmenities = h.amenities.filter(a => ALLOWED.includes(a));

        const hotel = await prisma.hotel.create({
            data: {
                slug: `hotel-om-${h.city}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: nameAr,
                nameEn: nameEn,
                location: h.location,
                locationEn: h.location, // Keeping simple translation not required
                city: h.city,
                country: "OM",
                rating: h.rating,
                reviews: Math.floor(Math.random() * 200) + 30, // Random review count
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
                image: "https://images.unsplash.com/photo-1590059390492-d54dfb746816?q=80&w=1000", // Generic Oman/Desert/Luxury feel
                // Images Relation
                images: {
                    create: [{
                        url: "https://images.unsplash.com/photo-1590059390492-d54dfb746816?q=80&w=1000",
                        isMain: true
                    }]
                },
                view: "",
                isFeatured: h.rating >= 5, // Feature 5 stars
                distanceFromHaram: h.distance,

                guestReviews: {
                    create: [
                        { userName: "Oman Visitor", rating: 5, text: "Excellent stay.", date: new Date().toISOString() },
                        { userName: "Guest", rating: h.rating, text: "Nice location.", date: new Date().toISOString() }
                    ]
                }
            }
        });

        console.log(`✅ Added: ${hotel.name} (${h.city})`);
    }

    console.log('🎉 Oman Hotels Seeding Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
