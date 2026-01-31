
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// The STRICT list of allowed amenities from Admin Dashboard (DestinationsTab.tsx)
const ALLOWED_AMENITIES = [
    'wifi',
    'parking',
    'pool',
    'gym',
    'food',
    'shuttle',
    'spa',
    'room_service',
    'kids_club',
    'business',
    'laundry',
    'concierge',
    'cafe',
    'valet'
];

// Mapping common "invented" amenities to allowed ones where sensible
const AMENITY_MAPPING = {
    'restaurant': 'food',
    'coffee_shop': 'cafe',
    'fitness_center': 'gym',
    'swimming_pool': 'pool',
    'transfer': 'shuttle',
    'transport': 'shuttle',
    'business_center': 'business'
};

async function main() {
    console.log('Starting amenities standardization...');

    // Fetch all hotels
    const hotels = await prisma.hotel.findMany();
    console.log(`Found ${hotels.length} hotels to check.`);

    for (const hotel of hotels) {
        let currentAmenities = [];

        // Parse current amenities safely
        try {
            if (typeof hotel.amenities === 'string') {
                currentAmenities = JSON.parse(hotel.amenities);
            } else if (Array.isArray(hotel.amenities)) {
                currentAmenities = hotel.amenities;
            }
        } catch (e) {
            console.warn(`Could not parse amenities for hotel ${hotel.name}:`, e);
            continue;
        }

        // Filter and Map
        const newAmenities = new Set();

        for (const amenity of currentAmenities) {
            const lowerAmenity = amenity.toLowerCase();

            // 1. Direct match
            if (ALLOWED_AMENITIES.includes(lowerAmenity)) {
                newAmenities.add(lowerAmenity);
                continue;
            }

            // 2. Mapped match
            if (AMENITY_MAPPING[lowerAmenity]) {
                const mapped = AMENITY_MAPPING[lowerAmenity];
                if (ALLOWED_AMENITIES.includes(mapped)) {
                    newAmenities.add(mapped);
                }
            }
        }

        // Convert back to array
        const finalAmenities = Array.from(newAmenities);

        // Check if update is needed (compare arrays)
        const isDifferent =
            finalAmenities.length !== currentAmenities.length ||
            !finalAmenities.every(a => currentAmenities.includes(a));

        if (isDifferent) {
            console.log(`Updating ${hotel.name}:`);
            console.log(`   Old: ${JSON.stringify(currentAmenities)}`);
            console.log(`   New: ${JSON.stringify(finalAmenities)}`);

            await prisma.hotel.update({
                where: { id: hotel.id },
                data: {
                    amenities: JSON.stringify(finalAmenities)
                }
            });
            console.log(`   ✅ Saved.`);
        } else {
            console.log(`No changes needed for ${hotel.name}.`);
        }
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
