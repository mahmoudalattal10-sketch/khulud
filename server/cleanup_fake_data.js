/**
 * =========================================================
 * 🧹 CLEANUP SCRIPT - Delete Fake Data
 * =========================================================
 * Deletes all bookings and contact messages from the database.
 * Run with: node cleanup_fake_data.js
 * =========================================================
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupFakeData() {
    console.log('🧹 Starting database cleanup...\n');

    try {
        // 1. Delete all bookings
        const deletedBookings = await prisma.booking.deleteMany({});
        console.log(`✅ Deleted ${deletedBookings.count} bookings`);

        // 2. Delete all contact messages
        const deletedMessages = await prisma.contactMessage.deleteMany({});
        console.log(`✅ Deleted ${deletedMessages.count} contact messages`);

        // 3. Delete all notifications
        const deletedNotifications = await prisma.notification.deleteMany({});
        console.log(`✅ Deleted ${deletedNotifications.count} notifications`);

        // 4. Delete all non-admin users (optional - keep admin accounts)
        const deletedUsers = await prisma.user.deleteMany({
            where: {
                role: 'USER' // Only delete regular users, keep admins
            }
        });
        console.log(`✅ Deleted ${deletedUsers.count} test user accounts`);

        console.log('\n🎉 Database cleanup complete! Ready for real data.');

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupFakeData();
