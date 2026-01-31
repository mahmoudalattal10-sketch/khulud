
import { PrismaClient } from '@prisma/client';
import { HotelService } from './src/services/hotelService';

const prisma = new PrismaClient();
const hotelService = new HotelService();

async function run() {
    try {
        console.log('--- Setting up Partial Availability Test ---');

        // 1. Find a hotel and room
        const city = 'makkah';
        const hotels = await prisma.hotel.findMany({
            where: { city: { contains: city } },
            include: { rooms: true },
            take: 1
        });

        if (hotels.length === 0) {
            console.log('No hotels found in Makkah.');
            return;
        }

        const hotel = hotels[0];
        const room = hotel.rooms[0];
        console.log(`Selected Hotel: ${hotel.name} (ID: ${hotel.id})`);
        console.log(`Selected Room: ${room.name} (ID: ${room.id})`);

        // 2. Create a blocking booking
        // Search Range: 2025-02-01 to 2025-02-10 (9 nights)
        // Block: 2025-02-05 to 2025-02-06 (1 night in middle)

        // 2. Create blocking bookings for ALL rooms
        const createdBookings = [];
        const originalStocks = new Map();

        // Find a valid user
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No user found to create booking.');
            return;
        }

        // Clean up existing bookings for all rooms in this range to be sure
        await prisma.booking.deleteMany({
            where: {
                roomId: { in: hotel.rooms.map(r => r.id) },
                checkIn: { gte: new Date('2025-02-01') },
                checkOut: { lte: new Date('2025-02-10') }
            }
        });

        for (const r of hotel.rooms) {
            // Save original stock
            originalStocks.set(r.id, r.availableStock);

            // Set stock to 1
            await prisma.room.update({
                where: { id: r.id },
                data: { availableStock: 1 }
            });

            const booking = await prisma.booking.create({
                data: {
                    roomId: r.id,
                    userId: user.id,
                    checkIn: new Date('2025-02-05'),
                    checkOut: new Date('2025-02-06'),
                    status: 'CONFIRMED',
                    totalPrice: 100,
                    roomCount: 1,
                    guestsCount: 1
                }
            });
            createdBookings.push(booking);
            console.log(`Blocked room: ${r.name} with booking ID: ${booking.id}`);
        }

        console.log(`Created ${createdBookings.length} blocking bookings.`);

        // 3. Search via HotelService (mimicking API)
        const filters = {
            city: 'makkah',
            checkIn: '2025-02-01',
            checkOut: '2025-02-10',
            guests: 1,
            adminView: false
        };

        // Ensure room is updated
        const updatedRoom = await prisma.room.findUnique({ where: { id: room.id }, include: { bookings: true } });
        console.log('Verified Room Stock:', updatedRoom?.availableStock);
        console.log('Verified Room Bookings:', updatedRoom?.bookings.length);
        if (updatedRoom?.bookings.length) {
            console.log('First Booking:', updatedRoom.bookings[0]);
        }

        const results = await hotelService.searchHotels(filters);
        // Filter purely for logging clarity if needed, but searchHotels runs all.
        // Actually hotelService.searchHotels does NOT support filtering by name in arguments here easily unless I use 'city' as name matches OR logic?
        // searchHotels logic: if (city) where.OR = [{city}, {name: contains city}...]
        // So if I set city to the hotel name, it should work!

        const strictFilters = {
            ...filters,
            city: hotel.name // Hack to search by name
        };

        console.log(`Searching for hotel: ${hotel.name}`);
        const tightResults = await hotelService.searchHotels(strictFilters);
        const match = results.find((h: any) => h.id === hotel.id);

        if (match) {
            console.log(`Match Found: ${match.name}`);
            console.log(`Is Partial: ${match.isPartial}`);
            console.log(`Partial Match: ${match.partialMatch}`);

            const matchedRoom = match.rooms.find((r: any) => r.id === room.id);
            if (matchedRoom) {
                console.log('Room Metadata:', matchedRoom.partialMetadata);
            }
        } else {
            console.log('Hotel NOT found in search results (maybe filtered out entirely?)');
        }

        // 4. Cleanup
        for (const b of createdBookings) {
            try {
                await prisma.booking.delete({ where: { id: b.id } });
            } catch (e) {
                console.log('Error deleting booking', b.id);
            }
        }
        for (const [roomId, stock] of originalStocks) {
            try {
                await prisma.room.update({ where: { id: roomId }, data: { availableStock: stock } });
            } catch (e) {
                console.log('Error restoring room', roomId);
            }
        }
        console.log('Cleanup done.');

    } catch (e: any) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
