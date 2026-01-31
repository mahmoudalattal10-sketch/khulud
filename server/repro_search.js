
const allHotels = [
    {
        name: "Abdo Hotel",
        rooms: [
            {
                name: "Room A (Jan 25-Feb 1)",
                capacity: 2,
                availableStock: 50,
                pricingPeriods: "[{\"startDate\":\"2026-01-25\",\"endDate\":\"2026-02-01\"}]",
                bookings: []
            }
        ]
    },
    {
        name: "New Hotel",
        rooms: [
            {
                name: "Room B (Feb 18-Mar 28)",
                capacity: 2,
                availableStock: 5,
                pricingPeriods: "[{\"startDate\":\"2026-02-18\",\"endDate\":\"2026-03-28\"}]",
                bookings: []
            }
        ]
    }
];

const checkIn = "2026-01-27T00:00:00.000Z";
const checkOut = "2026-01-28T00:00:00.000Z";
const guests = 2;

function test() {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    console.log(`Search: ${start.toISOString()} to ${end.toISOString()}`);

    const stayNights = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        stayNights.push(d.toISOString().split('T')[0]);
    }

    const filtered = allHotels.map(hotel => {
        const availableRooms = hotel.rooms.filter(room => {
            // Capacity
            if (room.capacity < guests) return false;

            // Periods
            let periods = [];
            try {
                if (typeof room.pricingPeriods === 'string') {
                    periods = JSON.parse(room.pricingPeriods);
                }
            } catch (e) { console.error(e); }

            if (periods.length === 0) return false;

            const isAvailable = stayNights.every(nightStr => {
                const nightDate = new Date(nightStr);
                const hasPrice = periods.some(p => {
                    const pStart = new Date(p.startDate);
                    const pEnd = new Date(p.endDate);
                    // Nightly logic: night is covered if it starts on or after pStart 
                    // and before or on pEnd (inclusive of the last night)
                    return nightDate >= pStart && nightDate <= pEnd;
                });
                return hasPrice;
            });

            if (!isAvailable) {
                console.log(`  Room ${room.name} HIDDEN (Missing price for some nights)`);
                return false;
            }

            return true;
        });

        if (availableRooms.length === 0) return null;
        return { ...hotel, rooms: availableRooms };
    }).filter(Boolean);

    console.log("Results:", filtered.map(h => h.name));
}

test();
