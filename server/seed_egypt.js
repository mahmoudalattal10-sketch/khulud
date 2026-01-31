
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Allowed Amenities
const ALLOWED = [
    'wifi', 'parking', 'pool', 'gym', 'food', 'shuttle', 'spa',
    'room_service', 'kids_club', 'business', 'laundry', 'concierge',
    'cafe', 'valet'
];

const EGYPT_HOTELS = [
    // --- CAIRO ---
    {
        name: "سانت ريجيس القاهرة (The St. Regis Cairo)",
        city: "cairo",
        location: "كورنيش النيل - بولاق",
        distance: "2 كم من المركز",
        rating: 5,
        price: 2200,
        desc: "قمة الفخامة الحديثة، يتميز بخدمة 'البتلر' وتصميمه الفخم جداً وموقعه المركزي.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet", "concierge"],
        coords: "30.0560,31.2290"
    },
    {
        name: "فورسيزونز نايل بلازا (Four Seasons Hotel Cairo at Nile Plaza)",
        city: "cairo",
        location: "جاردن سيتي",
        distance: "1.5 كم من المركز",
        rating: 5,
        price: 2500,
        desc: "الفندق المفضل للدبلوماسيين والخليجيين، يقع في أرقى أحياء القاهرة بإطلالات نيلية ساحرة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "business", "valet"],
        coords: "30.0360,31.2280"
    },
    {
        name: "ماريوت مينا هاوس (Marriott Mena House)",
        city: "cairo",
        location: "الهرم - الجيزة",
        distance: "15 كم من المركز",
        rating: 5,
        price: 1800,
        desc: "قصر تاريخي يقع في حضن الأهرامات، تجربة ملكية وإطلالة مباشرة على خوفو.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "concierge"],
        coords: "29.9860,31.1190"
    },
    {
        name: "النيل ريتز كارلتون (The Nile Ritz-Carlton)",
        city: "cairo",
        location: "ميدان التحرير",
        distance: "0 كم من المركز",
        rating: 5,
        price: 2100,
        desc: "يقع في قلب الأحداث بجوار المتحف المصري، يجمع بين عراقة التاريخ وخدمة الريتز.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "business"],
        coords: "30.0440,31.2330"
    },
    {
        name: "فيرمونت نايل سيتي (Fairmont Nile City)",
        city: "cairo",
        location: "كورنيش النيل - رملة بولاق",
        distance: "3 كم من المركز",
        rating: 5,
        price: 1600,
        desc: "أبراج شاهقة بتصميم 'آرت ديكو'، يضم مطاعم راقية ومسبحاً على السطح بإطلالة خيالية.",
        amenities: ["wifi", "pool", "gym", "food", "business", "valet"],
        coords: "30.0630,31.2290"
    },
    {
        name: "إنتركونتيننتال سيتي ستارز (InterContinental Cairo Citystars)",
        city: "cairo",
        location: "مدينة نصر",
        distance: "12 كم من المركز",
        rating: 5,
        price: 1400,
        desc: "متصل بمول سيتي ستارز الضخم، الخيار الأول للتسوق والرفاهية القريبة من المطار.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "shuttle"],
        coords: "30.0730,31.3460"
    },
    {
        name: "سوفيتيل الجزيرة (Sofitel Cairo Nile El Gezirah)",
        city: "cairo",
        location: "الزمالك",
        distance: "1 كم من المركز",
        rating: 5,
        price: 1900,
        desc: "برج دائري داخل النيل، يتميز بممشى خشبي رائع ومطاعم خارجية على الماء مباشرة.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "valet"],
        coords: "30.0380,31.2240"
    },
    {
        name: "والدورف أستوريا هليوبوليس (Waldorf Astoria Cairo Heliopolis)",
        city: "cairo",
        location: "مصر الجديدة",
        distance: "15 كم من المركز",
        rating: 5,
        price: 1700,
        desc: "واحة فخامة قريبة من المطار، يشتهر بالبهو الضخم المليء بالنباتات والخدمة الراقية.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "shuttle"],
        coords: "30.1110,31.3750"
    },
    {
        name: "كمبينسكي النيل (Kempinski Nile Hotel)",
        city: "cairo",
        location: "جاردن سيتي",
        distance: "1.5 كم من المركز",
        rating: 5,
        price: 1500,
        desc: "فندق بوتيك فاخر يركز على الخصوصية، ومسبحه على السطح يوفر أجمل غروب.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "butler"],
        coords: "30.0355,31.2285"
    },
    {
        name: "فندق ماريوت الزمالك (Cairo Marriott Hotel & Omar Khayyam Casino)",
        city: "cairo",
        location: "الزمالك",
        distance: "2 كم من المركز",
        rating: 5,
        price: 1300,
        desc: "قصر حقيقي بناه الخديوي إسماعيل، يتميز بحدائقه الملكية وأجوائه التاريخية الصاخبة.",
        amenities: ["wifi", "pool", "gym", "food", "business", "cafe"],
        coords: "30.0570,31.2250"
    },

    // --- ALEXANDRIA ---
    {
        name: "فورسيزونز سان ستيفانو (Four Seasons Hotel Alexandria at San Stefano)",
        city: "alexandria",
        location: "سان ستيفانو",
        distance: "8 كم من المركز",
        rating: 5,
        price: 2000,
        desc: "أفخم فندق في الإسكندرية، يمتلك شاطئاً خاصاً ومتصل بمول تجاري كبير، إطلالات بحرية لا تضاهى.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet", "kids_club"],
        coords: "31.2460,29.9650"
    },
    {
        name: "هيلتون الإسكندرية كورنيش (Hilton Alexandria Corniche)",
        city: "alexandria",
        location: "سيدي بشر",
        distance: "10 كم من المركز",
        rating: 5,
        price: 1200,
        desc: "فندق عصري يطل على البحر، يمتلك شاطئاً خاصاً ومسبحاً علوياً (Rooftop) رائعاً.",
        amenities: ["wifi", "pool", "gym", "food", "shuttle", "business"],
        coords: "31.2600,29.9800"
    },
    {
        name: "شتايجنبرجر سيسيل (Steigenberger Cecil Hotel)",
        city: "alexandria",
        location: "محطة الرمل",
        distance: "0 كم من المركز",
        rating: 4,
        price: 900,
        desc: "فندق تاريخي أيقوني في قلب الميدان، يتميز بطرازه الكلاسيكي وإطلالته على الميناء الشرقي.",
        amenities: ["wifi", "food", "business", "laundry"],
        coords: "31.2020,29.9000"
    },
    {
        name: "توليب الإسكندرية (Tolip Hotel Alexandria)",
        city: "alexandria",
        location: "مصطفى كامل",
        distance: "4 كم من المركز",
        rating: 5,
        price: 1000,
        desc: "مجمع فندقي ضخم يضم مسابح وشاطئاً ونادياً رياضياً، مفضل للعائلات والمجموعات.",
        amenities: ["wifi", "pool", "gym", "food", "kids_club", "parking"],
        coords: "31.2300,29.9300"
    },
    {
        name: "صن رايز أليكس أفينيو (SUNRISE Alex Avenue Hotel)",
        city: "alexandria",
        location: "رشدي",
        distance: "5 كم من المركز",
        rating: 5,
        price: 1100,
        desc: "يقع على الكورنيش مباشرة، فندق حديث بخدمات ممتازة ومسابح مطلة على البحر.",
        amenities: ["wifi", "pool", "gym", "food", "spa"],
        coords: "31.2350,29.9400"
    },
    {
        name: "هيلنان فلسطين (Helnan Palestine Hotel)",
        city: "alexandria",
        location: "المنتزه",
        distance: "15 كم من المركز",
        rating: 5,
        price: 1500,
        desc: "يقع داخل حدائق المنتزه الملكية ويطل على خليج خاص، قمة الهدوء والخصوصية الملكية.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "valet"],
        coords: "31.2880,30.0180"
    },
    {
        name: "شيراتون المنتزه (Sheraton Montazah Hotel)",
        city: "alexandria",
        location: "المنتزه",
        distance: "15 كم من المركز",
        rating: 5,
        price: 950,
        desc: "يطل على حدائق المنتزه والبحر، فندق كلاسيكي جدد مؤخراً، موقع ممتاز للاستجمام.",
        amenities: ["wifi", "pool", "gym", "food", "business"],
        coords: "31.2900,30.0150"
    },
    {
        name: "فندق ويندسور بالاس (Windsor Palace Luxury Heritage Hotel)",
        city: "alexandria",
        location: "محطة الرمل",
        distance: "0 كم من المركز",
        rating: 4,
        price: 700,
        desc: "قصر تاريخي آخر على البحر، يتميز بالتراس المفتوح 'رووف' ذو الإطلالة البانورامية.",
        amenities: ["wifi", "food", "cafe", "business"],
        coords: "31.2010,29.8990"
    },
    {
        name: "راديسون بلو الإسكندرية (Radisson Blu Hotel, Alexandria)",
        city: "alexandria",
        location: "أليكس ويست",
        distance: "25 كم من المركز",
        rating: 5,
        price: 800,
        desc: "يقع خارج المدينة في منطقة هادئة، مناسب جداً للاسترخاء والخصوصية بعيداً عن الزحام.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "shuttle"],
        coords: "30.9800,29.7500"
    },
    {
        name: "فندق بارادايس إن المعمورة (Paradise Inn Beach Resort)",
        city: "alexandria",
        location: "المعمورة",
        distance: "16 كم من المركز",
        rating: 4,
        price: 850,
        desc: "شاليهات وغرف فندقية على الشاطئ مباشرة في منطقة المعمورة الخاصة، خيار عائلي ممتاز.",
        amenities: ["wifi", "pool", "food", "kids_club"],
        coords: "31.2950,30.0300"
    },

    // --- SHARM EL SHEIKH ---
    {
        name: "فورسيزونز شرم الشيخ (Four Seasons Resort Sharm El Sheikh)",
        city: "sharm_el_sheikh",
        location: "تلال خليج القرش",
        distance: "8 كم من المركز",
        rating: 5,
        price: 3000,
        desc: "المنتجع رقم 1 في الفخامة، مصمم كقرية عربية فاخرة بشاطئ وشعاب مرجانية خاصة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "valet"],
        coords: "27.9400,34.3800"
    },
    {
        name: "ريكسوس بريميوم سيجيت (Rixos Premium Seagate)",
        city: "sharm_el_sheikh",
        location: "خليج نبق",
        distance: "18 كم من المركز",
        rating: 5,
        price: 1800,
        desc: "عملاق 'شامل كلياً' للعائلات، يضم حديقة ألعاب مائية ضخمة وجسراً بحرياً طويلاً.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "shuttle"],
        coords: "28.0100,34.4200"
    },
    {
        name: "ريكسوس شرم الشيخ (Rixos Sharm El Sheikh - Adults Only)",
        city: "sharm_el_sheikh",
        location: "خليج نبق",
        distance: "18 كم من المركز",
        rating: 5,
        price: 1900,
        desc: "منتجع للبالغين فقط، يوفر الهدوء والرفاهية المطلقة وحفلات مسائية راقية.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet"],
        coords: "28.0050,34.4150"
    },
    {
        name: "شتايجنبرجر الكازار (Steigenberger Alcazar)",
        city: "sharm_el_sheikh",
        location: "خليج نبق",
        distance: "18 كم من المركز",
        rating: 5,
        price: 1600,
        desc: "قصر أندلسي فخم، يتميز بمسابحه الشاسعة وغرفه التي تفتح على المسبح مباشرة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club"],
        coords: "28.0200,34.4250"
    },
    {
        name: "صن رايز أرابيان بيتش (Sunrise Arabian Beach Resort)",
        city: "sharm_el_sheikh",
        location: "خليج القرش",
        distance: "8 كم من المركز",
        rating: 5,
        price: 1200,
        desc: "تصميم عربي أبيض ساحر على تلال مطلة على جزيرة تيران، خدمة ممتازة وقيمة عالية.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club"],
        coords: "27.9500,34.3900"
    },
    {
        name: "فندق وايت هيلز (White Hills Resort)",
        city: "sharm_el_sheikh",
        location: "رأس نصراني",
        distance: "10 كم من المركز",
        rating: 5,
        price: 1400,
        desc: "الوجهة الجديدة 'الترند' بتصميم مستقبلي أبيض بالكامل، وجهة مفضلة للشباب والعرسان.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet"],
        coords: "27.9700,34.4000"
    },
    {
        name: "بارك ريجنسي (Park Regency)",
        city: "sharm_el_sheikh",
        location: "حدائق الخليج",
        distance: "3 كم من المركز",
        rating: 5,
        price: 1000,
        desc: "يتميز بتصميمه المتدرج وحدائقه الاستوائية وشاطئه الرملي الممتاز في قلب المدينة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club"],
        coords: "27.9100,34.3400"
    },
    {
        name: "البارون ريزورت (Baron Resort Sharm El Sheikh)",
        city: "sharm_el_sheikh",
        location: "رأس نصراني",
        distance: "12 كم من المركز",
        rating: 5,
        price: 1300,
        desc: "فندق كلاسيكي فخم يمتلك شاطئاً رملياً طويلاً وممشى رائعاً (البوليفارد).",
        amenities: ["wifi", "pool", "spa", "gym", "food", "business"],
        coords: "27.9750,34.4100"
    },
    {
        name: "فندق ميركيور شرم الشيخ (Meraki Resort Sharm El Sheikh)",
        city: "sharm_el_sheikh",
        location: "رأس نصراني",
        distance: "10 كم من المركز",
        rating: 4,
        price: 1100,
        desc: "منتجع 'بوهيمي' للبالغين فقط، يركز على التصميم العصري والأجواء الاحتفالية.",
        amenities: ["wifi", "pool", "gym", "food", "spa", "cafe"],
        coords: "27.9650,34.4050"
    },
    {
        name: "فندق إيبروتيل بالاس (Iberotel Palace)",
        city: "sharm_el_sheikh",
        location: "السوق القديم",
        distance: "6 كم من المركز",
        rating: 4,
        price: 950,
        desc: "الفندق الوحيد الذي يمتلك شاطئاً رملياً طبيعياً بالكامل وقريب جداً من السوق القديم.",
        amenities: ["wifi", "pool", "food", "shuttle", "spa"],
        coords: "27.8650,34.2950"
    },

    // --- SPECIAL: NORTH COAST & HURGHADA ---
    {
        name: "فندق العلمين (Al Alamein Hotel)",
        city: "north_coast",
        location: "مراسي - سيدي عبد الرحمن",
        distance: "0 كم من مراسي",
        rating: 5,
        price: 3500,
        desc: "الفندق الأيقوني والتاريخي في سيدي عبد الرحمن، جددته 'إعمار' ليصبح قمة الفخامة والرقي، يتميز بشاطئ فيروزي خيالي.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet", "kids_club"],
        coords: "30.9850,28.8450"
    },
    {
        name: "ريكسوس بريميوم العلمين (Rixos Premium Alamein)",
        city: "north_coast",
        location: "العلمين الجديدة",
        distance: "2 كم من المركز",
        rating: 5,
        price: 3200,
        desc: "أبراج فندقية شاهقة تطل على البحر المتوسط، تقدم تجربة ريكسوس العالمية وأجواء صيفية فاخرة جداً.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet", "kids_club"],
        coords: "30.8250,28.9550"
    },
    {
        name: "فندق العنوان مراسي (Address Marassi Golf Resort)",
        city: "north_coast",
        location: "مراسي",
        distance: "1 كم من الشاطئ",
        rating: 5,
        price: 2800,
        desc: "فندق فاخر بلمسة توسكانية يطل على ملاعب الجولف، يوفر الهدوء والفخامة داخل قرية مراسي الشهيرة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "business", "shuttle"],
        coords: "30.9700,28.8300"
    },
    {
        name: "بورتو مارينا (Porto Marina Resort)",
        city: "north_coast",
        location: "مارينا العلمين",
        distance: "0 كم من المارينا",
        rating: 4,
        price: 1500,
        desc: "'فينيسيا المصرية'، فندق يطل على المارينا واليخوت، يتميز بالحياة الليلية والمطاعم والأسواق المحيطة به.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club"],
        coords: "30.8300,28.9600"
    },
    {
        name: "ريكسوس بريميوم مجاويش (Rixos Premium Magawish)",
        city: "hurghada",
        location: "طريق القرى",
        distance: "10 كم من المركز",
        rating: 5,
        price: 2200,
        desc: "أفخم منتجع 'فيلات وأجنحة' في الغردقة، يمتلك شاطئاً رملياً طويلاً ومرافق للخيول، مفضل جداً للعائلات السعودية.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "valet"],
        coords: "27.1500,33.8200"
    },
    {
        name: "شتايجنبرجر الداو بيتش (Steigenberger ALDAU Beach)",
        city: "hurghada",
        location: "الممشى السياحي",
        distance: "5 كم من المركز",
        rating: 5,
        price: 1800,
        desc: "المنتجع الألماني المتكامل في الممشى السياحي، يضم نهراً صناعياً ومسبحاً ضخماً وخدمة لا يعلى عليها.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club"],
        coords: "27.1650,33.8150"
    },
    {
        name: "ذا أوبيروي سهل حشيش (The Oberoi Beach Resort)",
        city: "hurghada",
        location: "سهل حشيش",
        distance: "25 كم من المركز",
        rating: 5,
        price: 2600,
        desc: "منتجع 'أجنحة فقط' يوفر خصوصية تامة وفخامة ملكية، كل جناح له فناء خاص، وهو المفضل للباحثين عن الهدوء.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "valet"],
        coords: "27.0500,33.8800"
    },
    {
        name: "كمبينسكي سوما باي (Kempinski Hotel Soma Bay)",
        city: "hurghada",
        location: "سوما باي",
        distance: "45 كم من المركز",
        rating: 5,
        price: 2000,
        desc: "قلعة فاخرة في شبه جزيرة سوما باي، يتميز بشاطئ رملي بكر ومرافق مائية رائعة، وجهة شتوية ممتازة.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club", "shuttle"],
        coords: "26.8500,33.9900"
    },
    {
        name: "البارون بالاس (Baron Palace Sahl Hasheesh)",
        city: "hurghada",
        location: "سهل حشيش",
        distance: "25 كم من المركز",
        rating: 5,
        price: 1900,
        desc: "قصر أبيض ضخم وفخم جداً، يعد من أفضل فنادق سهل حشيش للعائلات وقضاء شهر العسل.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "kids_club"],
        coords: "27.0300,33.8700"
    },
    {
        name: "كازا كوك الجونة (Casa Cook El Gouna)",
        city: "el_gouna",
        location: "الجونة",
        distance: "3 كم من الداون تاون",
        rating: 5,
        price: 1700,
        desc: "فندق عصري بتصميم صحراوي (للكبار أو العائلات العصرية)، يقع في الجونة التي يعشقها الشباب لأجوائها الراقية.",
        amenities: ["wifi", "pool", "spa", "gym", "food", "cafe"],
        coords: "27.3950,33.6800"
    }
];

async function main() {
    console.log('Seeding Egypt Hotels...');

    for (const h of EGYPT_HOTELS) {
        let nameAr = h.name.includes("(") ? h.name.split("(")[0].trim() : h.name;
        let nameEn = h.name.includes("(") ? h.name.split("(")[1].replace(")", "").trim() : h.name;
        if (!nameEn) nameEn = nameAr;

        const validAmenities = h.amenities.filter(a => ALLOWED.includes(a));

        const hotel = await prisma.hotel.create({
            data: {
                slug: `hotel-eg-${h.city}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: nameAr,
                nameEn: nameEn,
                location: h.location,
                locationEn: h.location,
                city: h.city, // Will need mapping in Frontend or use direct IDs
                country: "EG",
                rating: h.rating,
                reviews: Math.floor(Math.random() * 400) + 50,
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
                image: "https://images.unsplash.com/photo-1560130958-0ea9c4ef305d?q=80&w=1000", // Generic Egypt/Pyramids/Red Sea
                // Images Relation
                images: {
                    create: [{
                        url: "https://images.unsplash.com/photo-1560130958-0ea9c4ef305d?q=80&w=1000",
                        isMain: true
                    }]
                },
                view: "",
                isFeatured: h.rating >= 5,
                distanceFromHaram: h.distance,

                guestReviews: {
                    create: [
                        { userName: "Egypt Lover", rating: 5, text: "Amazing hospitality.", date: new Date().toISOString() },
                        { userName: "Guest", rating: h.rating, text: "Great location.", date: new Date().toISOString() }
                    ]
                }
            }
        });

        console.log(`✅ Added: ${hotel.name} (${h.city})`);
    }

    console.log('🎉 Egypt Hotels Seeding Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
