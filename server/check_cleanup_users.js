/**
 * =========================================================
 * 🧹 CHECK & CLEANUP USERS
 * =========================================================
 * Checks remaining users and deletes all non-admin accounts
 * =========================================================
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndCleanupUsers() {
    console.log('🔍 Checking user accounts...\n');

    try {
        // 1. Show all users
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        console.log(`Found ${allUsers.length} total users:\n`);
        allUsers.forEach(user => {
            console.log(`  ${user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '👑' : '👤'} ${user.name} (${user.email}) - ${user.role}`);
        });

        // 2. Delete all non-admin users
        const regularUsers = allUsers.filter(u => u.role === 'USER');

        if (regularUsers.length > 0) {
            console.log(`\n🧹 Deleting ${regularUsers.length} regular user(s)...`);

            const deleted = await prisma.user.deleteMany({
                where: {
                    role: 'USER'
                }
            });

            console.log(`✅ Deleted ${deleted.count} user accounts`);
        } else {
            console.log('\n✅ No regular users to delete');
        }

        // 3. Final count
        const remainingCount = await prisma.user.count();
        console.log(`\n📊 Remaining users: ${remainingCount} (admins only)`);
        console.log('🎉 Visitors count is now clean!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAndCleanupUsers();
