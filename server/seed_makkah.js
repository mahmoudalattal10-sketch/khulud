const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ALLOWED_AMENITIES = [
    'wifi', 'parking', 'pool', 'gym', 'food', 'shuttle', 'spa',
    'room_service', 'kids_club', 'business', 'laundry', 'concierge',
    'cafe', 'valet'
];

const makkahHotels = [
    {
        name: "فندق ساعة مكة فيرمونت (Fairmont Makkah Clock Royal Tower)",
        nameEn: "Fairmont Makkah Clock Royal Tower",
        location: "أبراج البيت - وقف الملك عبدالعزيز",
        locationEn: "Abraj Al Bait - King Abdulaziz Endowment",
        city: "makkah",
        rating: 5,
        basePrice: 1500,
        coords: "21.41818,39.82557",
        distanceFromHaram: "100 متر",
        description: "أيقونة مكة المكرمة وأقرب فندق للحرم المكي الشريف. يقع داخل برج الساعة الشهير ويوفر إطلالات مباشرة على الكعبة المشرفة.",
        image: "https://images.unsplash.com/photo-1519817650390-1c069b275f0f?q=80&w=1000",
        amenities: ["wifi", "food", "concierge", "valet", "business", "room_service", "kids_club"]
    },
    {
        name: "قصر رافلز مكة (Raffles Makkah Palace)",
        nameEn: "Raffles Makkah Palace",
        location: "أبراج البيت",
        locationEn: "Abraj Al Bait",
        city: "makkah",
        rating: 5,
        basePrice: 2000,
        coords: "21.41893,39.82615",
        distanceFromHaram: "100 متر",
        description: "أجنحة فاخرة فقط بإطلالات بانورامية على الحرم. يتميز بخدمة الخادم الشخصي (البتلر) والهدوء التام والخصوصية.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
        amenities: ["wifi", "spa", "food", "butler", "concierge", "valet"]
    },
    {
        name: "دار التوحيد إنتركونتيننتال (Dar Al Tawhid Intercontinental)",
        nameEn: "Dar Al Tawhid Intercontinental",
        location: "شارع إبراهيم الخليل",
        locationEn: "Ibrahim Al Khalil St",
        city: "makkah",
        rating: 5,
        basePrice: 1800,
        coords: "21.42096,39.82272",
        distanceFromHaram: "150 متر",
        description: "الفندق المفضل لكبار الشخصيات. يقع مباشرة أمام بوابة الملك فهد. يتميز بالفخامة الكلاسيكية والمصلى الخاص المطل على الحرم.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        amenities: ["wifi", "food", "business", "laundry", "concierge", "valet"]
    },
    {
        name: "سويس أوتيل المقام (Swissôtel Al Maqam)",
        nameEn: "Swissôtel Al Maqam Makkah",
        location: "أبراج البيت",
        locationEn: "Abraj Al Bait",
        city: "makkah",
        rating: 5,
        basePrice: 900,
        coords: "21.41890,39.82600",
        distanceFromHaram: "100 متر",
        description: "خيار عصري وممتاز داخل المجمع. يوفر مداخل مباشرة للحرم عبر أبراج البيت. المطعم الجبلي فيه يوفر إطلالات رائعة.",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
        amenities: ["wifi", "food", "cafe", "room_service", "concierge"]
    },
    {
        name: "سويس أوتيل مكة (Swissôtel Makkah)",
        nameEn: "Swissôtel Makkah",
        location: "أبراج البيت",
        locationEn: "Abraj Al Bait",
        city: "makkah",
        rating: 5,
        basePrice: 850,
        coords: "21.41850,39.82650",
        distanceFromHaram: "150 متر",
        description: "أول فندق سويس أوتيل في السعودية. مفضل للحجاج والمعتمرين لسهولة الوصول والمصاعد الكثيرة.",
        image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000",
        amenities: ["wifi", "food", "business", "room_service"]
    },
    {
        name: "فندق بولمان زمزم مكة (Pullman ZamZam Makkah)",
        nameEn: "Pullman ZamZam Makkah",
        location: "أبراج البيت",
        locationEn: "Abraj Al Bait",
        city: "makkah",
        rating: 5,
        basePrice: 750,
        coords: "21.41950,39.82550",
        distanceFromHaram: "100 متر",
        description: "أول فندق افتتح في أبراج البيت. يتميز بقربه الشديد من بوابة الملك عبدالعزيز وتوفير سماعات الأذان داخل الغرف.",
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000",
        amenities: ["wifi", "food", "cafe", "room_service", "laundry"]
    },
    {
        name: "المروة ريحان من روتانا (Al Marwa Rayhaan by Rotana)",
        nameEn: "Al Marwa Rayhaan by Rotana",
        location: "أبراج البيت",
        locationEn: "Abraj Al Bait",
        city: "makkah",
        rating: 5,
        basePrice: 800,
        coords: "21.41800,39.82700",
        distanceFromHaram: "190 متر",
        description: "فندق بتصميم عصري وألوان دافئة. يقع في الصف الأول من الأبراج ويوفر إطلالات جزئية وكاملة على الحرم.",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
        amenities: ["wifi", "food", "gym", "concierge", "room_service"]
    },
    {
        name: "موفنبيك برج هاجر (Mövenpick Hotel & Residence Hajar Tower)",
        nameEn: "Mövenpick Hajar Tower Makkah",
        location: "أبراج البيت",
        locationEn: "Abraj Al Bait",
        city: "makkah",
        rating: 5,
        basePrice: 950,
        coords: "21.41980,39.82520",
        distanceFromHaram: "100 متر",
        description: "يجمع بين التقاليد السويسرية والضيافة العربية. خيار ممتاز للعائلات والمجموعات.",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
        amenities: ["wifi", "food", "cafe", "business", "kids_club"]
    },
    {
        name: "فندق أنجم مكة (Anjum Hotel Makkah)",
        nameEn: "Anjum Hotel Makkah",
        location: "جبل الكعبة",
        locationEn: "Jabal Al Kaaba",
        city: "makkah",
        rating: 5,
        basePrice: 600,
        coords: "21.4250,39.8200",
        distanceFromHaram: "500 متر",
        description: "أكبر فندق في مكة من حيث عدد الغرف. يتميز بباحته الأمامية الواسعة ومدخله الخاص عبر نفق للمشاة للحرم.",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000",
        amenities: ["wifi", "food", "shuttle", "kids_club", "parking"]
    },
    {
        name: "أبراج الكسوة (Kiswah Towers Hotel)",
        nameEn: "Kiswah Towers Hotel",
        location: "حي التيسير",
        locationEn: "At Taysir Dist",
        city: "makkah",
        rating: 3,
        basePrice: 200,
        coords: "21.4300,39.8100",
        distanceFromHaram: "1500 متر",
        description: "الخيار الاقتصادي الأضخم. يوفر آلاف الغرف بأسعار منافسة جداً مع خدمة نقل مجانية للحرم على مدار الساعة.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        amenities: ["wifi", "shuttle", "food", "laundry"]
    },
    {
        name: "فوكو مكة (Voco Makkah)",
        nameEn: "Voco Makkah",
        location: "المسفلة - شارع إبراهيم الخليل",
        locationEn: "Ibrahim Al Khalil St",
        city: "makkah",
        rating: 5,
        basePrice: 450,
        coords: "21.4050,39.8200",
        distanceFromHaram: "1300 متر",
        description: "أكبر فندق فوكو في العالم. تصميم عصري وأنيق، يوفر باصات ترددية كثيرة للحرم.",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
        amenities: ["wifi", "food", "shuttle", "gym", "business"]
    },
    {
        name: "مكارم أجياد (Makarem Ajyad Makkah Hotel)",
        nameEn: "Makarem Ajyad Makkah Hotel",
        location: "شارع أجياد",
        locationEn: "Ajyad Street",
        city: "makkah",
        rating: 5,
        basePrice: 700,
        coords: "21.4170,39.8300",
        distanceFromHaram: "300 متر",
        description: "من أعرق فنادق مكة. يقع في شارع أجياد العام. يتميز باللوبي الفسيح والخدمة الروحانية المميزة.",
        image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1000",
        amenities: ["wifi", "food", "cafe", "concierge", "valet"]
    },
    {
        name: "إيلاف كندا (Elaf Kinda Hotel)",
        nameEn: "Elaf Kinda Hotel",
        location: "المسيال",
        locationEn: "Al Misyal",
        city: "makkah",
        rating: 5,
        basePrice: 650,
        coords: "21.4180,39.8240",
        distanceFromHaram: "100 متر",
        description: "ملاصق لساحات الحرم وأبراج البيت. موقع استراتيجي وسعر ممتاز مقارنة بجيرانه.",
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000",
        amenities: ["wifi", "food", "cafe", "room_service"]
    },
    {
        name: "لو ميريديان مكة (Le Méridien Makkah)",
        nameEn: "Le Méridien Makkah",
        location: "شارع أجياد",
        locationEn: "Ajyad Street",
        city: "makkah",
        rating: 5,
        basePrice: 600,
        coords: "21.4160,39.8320",
        distanceFromHaram: "200 متر",
        description: "يتميز بموقعه الهادئ نسبياً وإطلالته الجميلة على الحرم من جهة أجياد. مطعم الشهد فيه يقدم بوفيهات رائعة.",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
        amenities: ["wifi", "food", "business", "room_service", "concierge"]
    },
    {
        name: "فندق الشهداء (Al Shohada Hotel)",
        nameEn: "Al Shohada Hotel",
        location: "أجياد",
        locationEn: "Ajyad",
        city: "makkah",
        rating: 5,
        basePrice: 550,
        coords: "21.4150,39.8330",
        distanceFromHaram: "400 متر",
        description: "فندق كلاسيكي مشهود له بالجودة والنظافة. الغرف واسعة جداً ومناسبة للعائلات الكبيرة.",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
        amenities: ["wifi", "food", "shuttle", "business", "laundry"]
    },
    {
        name: "ملينيوم مكة النسيم (Millennium Makkah Al Naseem)",
        nameEn: "Millennium Makkah Al Naseem",
        location: "حي النسيم",
        locationEn: "Al Naseem Dist",
        city: "makkah",
        rating: 5,
        basePrice: 350,
        coords: "21.3700,39.8800",
        distanceFromHaram: "7000 متر",
        description: "مدينة فندقية متكاملة في النسيم. يوفر خدمات 5 نجوم بأسعار اقتصادية، مع نقل ترددي مريح للحرم.",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000",
        amenities: ["wifi", "food", "shuttle", "parking", "gym", "kids_club"]
    },
    {
        name: "شيراتون مكة جبل الكعبة (Sheraton Makkah Jabal Al Kaaba)",
        nameEn: "Sheraton Makkah Jabal Al Kaaba",
        location: "جبل الكعبة",
        locationEn: "Jabal Al Kaaba",
        city: "makkah",
        rating: 5,
        basePrice: 700,
        coords: "21.4260,39.8190",
        distanceFromHaram: "550 متر",
        description: "من أحدث فنادق مكة. يتميز بجسر خاص للمشاة يوصلك للحرم مباشرة. التصميم الداخلي فخم وعصري.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
        amenities: ["wifi", "food", "concierge", "business", "cafe"]
    }
];

async function main() {
    console.log('Seeding Makkah Hotels...');

    for (const h of makkahHotels) {
        // Filter amenities
        const validAmenities = h.amenities ? h.amenities.filter(a => ALLOWED_AMENITIES.includes(a)) : [];

        const hotel = await prisma.hotel.create({
            data: {
                slug: `hotel-makkah-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: h.name,
                nameEn: h.nameEn,
                location: h.location,
                locationEn: h.locationEn,
                city: h.city,
                country: "SA",
                rating: h.rating,
                reviews: Math.floor(Math.random() * 1000) + 200,
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
                view: "",
                isFeatured: true,
                distanceFromHaram: h.distanceFromHaram
            }
        });
        console.log(`✅ Added: ${hotel.name}`);
    }

    console.log('🎉 Makkah Hotels Seeding Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
