
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugSearch() {
    const city = 'makkah';
    const checkIn = '2026-01-29T14:58:00.000Z'; // Emulate frontend ISO
    const checkOut = '2026-01-30T14:58:00.000Z';
    const guests = 2;

    console.log(`--- SIMULATING SEARCH ---`);
    console.log(`Check-in: ${checkIn}`);
    console.log(`Check-out: ${checkOut}`);

    const startStr = String(checkIn).split('T')[0];
    const endStr = String(checkOut).split('T')[0];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const requiredGuests = Number(guests) || 1;

    console.log(`Normalized Start: ${start.toISOString()} (${start.getTime()})`);
    console.log(`Normalized End: ${end.toISOString()} (${end.getTime()})`);

    const stayNights = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        stayNights.push(d.toISOString().split('T')[0]);
    }
    console.log(`Stay Nights: ${stayNights.join(', ')}`);

    const allHotels = await prisma.hotel.findMany({
        where: { isVisible: true, city: { contains: city } },
        include: { rooms: { include: { bookings: true } } }
    });

    console.log(`Total visible hotels in ${city}: ${allHotels.length}`);

    allHotels.forEach(hotel => {
        console.log(`\nAnalyzing Hotel: ${hotel.name}`);
        const availableRooms = hotel.rooms.filter(room => {
            console.log(`  Room: ${room.name} (Capacity: ${room.capacity})`);
            if (room.capacity < requiredGuests) {
                console.log(`    REJECTED: Capacity ${room.capacity} < ${requiredGuests}`);
                return false;
            }

            let periods = [];
            try {
                periods = typeof room.pricingPeriods === 'string' ? JSON.parse(room.pricingPeriods) : (room.pricingPeriods || []);
            } catch (e) { }

            if (periods.length === 0) {
                console.log(`    REJECTED: No pricing periods`);
                return false;
            }

            const isAvailable = stayNights.every(nightStr => {
                const nightDate = new Date(nightStr);
                const hasPrice = periods.some(p => {
                    const pStart = new Date(String(p.startDate).split('T')[0]);
                    const pEnd = new Date(String(p.endDate).split('T')[0]);

                    // The logic from index.ts
                    const periodEndPlusOne = new Date(pEnd.getTime() + 86400000);
                    const match = nightDate >= pStart && nightDate < periodEndPlusOne;

                    if (match) console.log(`      Night ${nightStr} covered by period ${p.startDate} to ${p.endDate}`);
                    return match;
                });
                return hasPrice;
            });

            if (!isAvailable) {
                console.log(`    REJECTED: Missing price for some night`);
                return false;
            }

            console.log(`    PASSED!`);
            return true;
        });

        if (availableRooms.length > 0) {
            console.log(`  HOTEL QUALIFIES with ${availableRooms.length} rooms`);
        } else {
            console.log(`  HOTEL REJECTED: No available rooms`);
        }
    });

    process.exit(0);
}

debugSearch();
