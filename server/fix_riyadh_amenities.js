
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Strictly allowed amenities from Admin Panel (DestinationsTab.tsx)
const ALLOWED_AMENITIES = [
    'wifi', 'parking', 'pool', 'gym', 'food', 'shuttle', 'spa',
    'room_service', 'kids_club', 'business', 'laundry', 'concierge',
    'cafe', 'valet'
];

async function main() {
    console.log('Standardizing Amenities to Admin Panel Defaults...');

    // Get all hotels (Riyadh specifically but good to check all)
    const hotels = await prisma.hotel.findMany({
        where: { city: 'riyadh' }
    });

    for (const h of hotels) {
        let currentAmenities = [];
        try {
            currentAmenities = JSON.parse(h.amenities || '[]');
        } catch (e) {
            console.warn(`Failed to parse amenities for ${h.name}`);
            continue;
        }

        // Filter to allow ONLY the strict list
        const validAmenities = currentAmenities.filter(a => ALLOWED_AMENITIES.includes(a));

        // Sort for consistency
        validAmenities.sort();

        // Check if we need to update (if length changed or different)
        if (JSON.stringify(validAmenities) !== JSON.stringify(currentAmenities)) {
            console.log(`[${h.name}] Fixed Amenities:`);
            console.log(`   OLD: ${JSON.stringify(currentAmenities)}`);
            console.log(`   NEW: ${JSON.stringify(validAmenities)}`);

            await prisma.hotel.update({
                where: { id: h.id },
                data: { amenities: JSON.stringify(validAmenities) }
            });
        }
    }

    console.log('✅ Amenities Standardized.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
