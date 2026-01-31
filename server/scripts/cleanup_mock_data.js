
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    console.log("🧹 Starting database cleanup...");

    try {
        // 1. Delete Bookings (Has FK to rooms and users, but cascade should be handled)
        const bookings = await prisma.booking.deleteMany({});
        console.log(`✅ Deleted ${bookings.count} bookings.`);

        // 2. Delete Users (Keep ONLY ADMIN and SUPER_ADMIN)
        const users = await prisma.user.deleteMany({
            where: {
                NOT: {
                    role: { in: ['ADMIN', 'SUPER_ADMIN'] }
                }
            }
        });
        console.log(`✅ Deleted ${users.count} non-admin users.`);

        // 3. Clear Notifications
        const notifications = await prisma.notification.deleteMany({});
        console.log(`✅ Deleted ${notifications.count} notifications.`);

        // 4. Clear Contact Messages
        const messages = await prisma.contactMessage.deleteMany({});
        console.log(`✅ Deleted ${messages.count} contact messages.`);

        // 5. Clear Coupons (usually mock data in development)
        const coupons = await prisma.coupon.deleteMany({});
        console.log(`✅ Deleted ${coupons.count} coupons.`);

        console.log("\n🎉 Cleanup complete! Database is now fresh for production use.");
    } catch (e) {
        console.error("❌ Error during cleanup:", e);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
