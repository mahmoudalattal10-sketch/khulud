
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HOTELS_DATA = [
    // ========== فنادق مكة المكرمة (4) ==========
    {
        id: 'makkah-1',
        slug: 'makkah-clock-royal-tower-fairmont',
        name: 'فندق ساعة مكة فيرمونت',
        nameEn: 'Makkah Clock Royal Tower - Fairmont',
        location: 'مكة المكرمة',
        locationEn: 'Makkah',
        basePrice: 2500,
        rating: 4.9,
        reviews: 8500,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
        imagesList: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1590490360182-c87de9f99767?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800'
        ],
        coords: "21.4189,39.8262",
        amenitiesList: ['إطلالة على الحرم', 'سبا فاخر', 'مطاعم عالمية', 'خدمة الغرف 24/7'],
        description: 'أيقونة مكة المكرمة، يقع في قلب أبراج البيت مع إطلالة مباشرة على الكعبة المشرفة.',
        isOffer: true,
        discount: 'خصم 20%',
        distanceFromHaram: '50 متر',
        hasFreeBreakfast: true,
        hasFreeTransport: false,
        city: 'makkah',
    },
    // ... Additional hotels (shortened for seed, can add more later if needed)
];

async function main() {
    console.log('🌱 Seeding database (MySQL Professional Schema)...');

    for (const hotelData of HOTELS_DATA) {
        const { imagesList, amenitiesList, ...hotelReq } = hotelData;

        console.log(`Processing hotel: ${hotelReq.name}...`);

        // Upsert Hotel
        const hotel = await prisma.hotel.upsert({
            where: { slug: hotelReq.slug },
            update: {},
            create: {
                ...hotelReq,
                // Hotel Images Relation
                images: {
                    create: imagesList.map(url => ({
                        url,
                        caption: 'Hotel View'
                    }))
                },
                // Amenities Relation
                amenities: {
                    create: amenitiesList.map(am => ({
                        amenity: {
                            connectOrCreate: {
                                where: { name: am },
                                create: { name: am, nameEn: am, icon: 'Star' }
                            }
                        }
                    }))
                },
                // Rooms Relation
                rooms: {
                    create: [
                        {
                            name: 'غرفة ديلوكس',
                            type: 'double',
                            capacity: 2,
                            price: hotelReq.basePrice,
                            availableStock: 5,
                            mealPlan: 'breakfast',
                            view: 'City View',
                            // Features as relation
                            features: {
                                create: [
                                    { name: 'Wifi' },
                                    { name: 'AC' }
                                ]
                            }
                        }
                    ]
                }
            }
        });
        console.log(`✅ Synced: ${hotel.name}`);
    }

    console.log('✅ Seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
