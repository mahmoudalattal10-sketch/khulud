const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Get or Create User
        let user = await prisma.user.findFirst();
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: 'test@diafat.com',
                    name: 'Mr. Test User',
                    password: 'password123',
                    phone: '+966500000000'
                }
            });
        }

        // 2. Get or Create Hotel & Room
        let hotel = await prisma.hotel.findFirst({ include: { rooms: true } });
        if (!hotel) {
            hotel = await prisma.hotel.create({
                data: {
                    name: 'Makkah Royal Clock',
                    nameEn: 'Makkah Royal Clock',
                    location: 'Makkah',
                    locationEn: 'Makkah',
                    city: 'Makkah',
                    basePrice: 500,
                    image: '/uploads/test.jpg',
                    description: 'Luxury Hotel',
                    slug: 'makkah-royal-clock-' + Date.now(),
                    images: '[]',
                    amenities: '[]',
                    coords: '21.42,39.82'
                }
            });
        }

        let room = await prisma.room.findFirst({ where: { hotelId: hotel.id } });
        if (!room) {
            room = await prisma.room.create({
                data: {
                    name: 'Deluxe Room',
                    type: 'Double',
                    capacity: 2,
                    price: 500,
                    hotelId: hotel.id,
                    mealPlan: 'Breakfast'
                }
            });
        }

        // 3. Create Booking
        const booking = await prisma.booking.create({
            data: {
                userId: user.id,
                roomId: room.id,
                checkIn: new Date(),
                checkOut: new Date(Date.now() + 86400000 * 3), // 3 nights
                totalPrice: 1500,
                status: 'CONFIRMED',
                guestsCount: 2,
                paymentStatus: 'PAID',
                guestName: 'Mr. Test Guest'
            }
        });

        console.log('BOOKING_ID:', booking.id);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
