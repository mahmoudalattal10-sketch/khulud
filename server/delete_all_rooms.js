/**
 * ====================================================
 * 🧹 DELETE ALL ROOMS - Database Cleanup Script
 * ====================================================
 * This script removes all rooms from all hotels.
 * WARNING: This will also cascade-delete related data like bookings.
 * ====================================================
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllRooms() {
    console.log('\n🧹 Starting room deletion process...\n');

    try {
        // 1. Count existing rooms
        const roomCount = await prisma.room.count();
        console.log(`📊 Found ${roomCount} rooms in the database.`);

        if (roomCount === 0) {
            console.log('✅ No rooms to delete. Database is already clean.');
            return;
        }

        // 2. Count related bookings (for awareness)
        const bookingCount = await prisma.booking.count();
        console.log(`📊 Found ${bookingCount} bookings that will be affected (cascade delete).`);

        // 3. Delete all rooms (this will cascade to RoomImage, RoomFeature, PricingPeriod, and Booking)
        console.log('\n🗑️  Deleting all rooms...');
        const deleteResult = await prisma.room.deleteMany({});

        console.log(`\n✅ Successfully deleted ${deleteResult.count} rooms.`);

        // 4. Verify
        const remainingRooms = await prisma.room.count();
        const remainingBookings = await prisma.booking.count();
        console.log(`\n📊 Verification:`);
        console.log(`   - Remaining rooms: ${remainingRooms}`);
        console.log(`   - Remaining bookings: ${remainingBookings}`);

    } catch (error) {
        console.error('❌ Error during room deletion:', error);
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Database connection closed.');
    }
}

deleteAllRooms();
