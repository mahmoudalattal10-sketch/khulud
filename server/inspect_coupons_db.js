
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Inspecting Coupons & Bookings ---');

    try {
        const coupons = await prisma.coupon.findMany({
            include: {
                bookings: {
                    select: {
                        id: true,
                        createdAt: true,
                        room: {
                            select: {
                                name: true,
                                hotel: { select: { name: true } }
                            }
                        }
                    }
                }
            }
        });

        if (coupons.length === 0) {
            console.log('No coupons found.');
        } else {
            coupons.forEach(c => {
                console.log(`Coupon: ${c.code} | Used: ${c.usedCount} | Bookings Linked: ${c.bookings.length}`);
                c.bookings.forEach(b => {
                    console.log(`  - Booking ${b.id.slice(0, 5)}... at ${b.room?.hotel?.name || 'Unknown Hotel'}`);
                });
            });
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
