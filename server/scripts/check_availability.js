const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Availability Debug ---');
    const city = 'makkah';
    const startStr = '2026-01-25';
    const endStr = '2026-02-01';
    const guests = 2;

    const stayNights = [];
    const tempDate = new Date(startStr);
    const stopDate = new Date(endStr);
    while (tempDate < stopDate) {
        stayNights.push(tempDate.toISOString().split('T')[0]);
        tempDate.setDate(tempDate.getDate() + 1);
    }
    console.log('Stay nights:', stayNights);

    const hotels = await prisma.hotel.findMany({
        where: { isVisible: true, city: { contains: city } },
        include: { rooms: { include: { bookings: true } } }
    });

    console.log(`Found ${hotels.length} visible hotels in ${city}`);

    hotels.forEach(hotel => {
        console.log(`\nHotel: ${hotel.name} [${hotel.id}]`);
        hotel.rooms.forEach(room => {
            console.log(`  Room: ${room.name} [${room.id}] (Capacity: ${room.capacity})`);
            if (room.capacity < guests) {
                console.log('    ❌ Capacity too small');
                return;
            }

            let periods = [];
            try {
                periods = JSON.parse(room.pricingPeriods || '[]');
            } catch (e) {
                console.log('    ❌ Error parsing pricing periods');
            }

            const nightAnalysis = stayNights.map(nightStr => {
                const periodMatch = periods.find(p => {
                    let pStartStr = p.startDate.split('T')[0];
                    let pEndStr = p.endDate.split('T')[0];
                    return nightStr >= pStartStr && nightStr <= pEndStr;
                });

                if (!periodMatch) return { night: nightStr, available: false, reason: 'No price' };

                const bookingsOnNight = room.bookings.filter(b => {
                    if (b.status === 'CANCELLED' || b.status === 'REFUNDED') return false;
                    const bStartStr = b.checkIn.toISOString().split('T')[0];
                    const bEndStr = b.checkOut.toISOString().split('T')[0];
                    return nightStr >= bStartStr && nightStr < bEndStr;
                });

                const inStock = (room.availableStock || 0) - bookingsOnNight.length > 0;
                return { night: nightStr, available: inStock, reason: inStock ? '' : 'Out of stock' };
            });

            const allAvailable = nightAnalysis.every(n => n.available);
            console.log(`    Status: ${allAvailable ? '✅ Available' : '❌ Unavailable'}`);
            if (!allAvailable) {
                console.log('    Issues:', nightAnalysis.filter(n => !n.available).map(n => `${n.night}: ${n.reason}`).join(', '));
            }
        });
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
