/**
 * =========================================================
 * 🔐 MANAGE ADMIN ACCOUNTS
 * =========================================================
 * Shows all admin accounts and allows keeping only one
 * =========================================================
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function manageAdmins() {
    console.log('👑 Checking admin accounts...\n');

    try {
        // Get all admin accounts
        const admins = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
            orderBy: {
                email: 'asc'
            }
        });

        console.log(`Found ${admins.length} admin accounts:\n`);
        admins.forEach((admin, index) => {
            console.log(`  ${index + 1}. ${admin.email} (${admin.role})`);
        });

        // Keep only the first one (admin@diafat.com)
        const primaryAdmin = admins[0];
        const toDelete = admins.slice(1);

        if (toDelete.length > 0) {
            console.log(`\n🔒 Keeping: ${primaryAdmin.email}`);
            console.log(`\n🗑️ Deleting ${toDelete.length} extra admin(s)...`);

            const deleteIds = toDelete.map(a => a.id);
            const deleted = await prisma.user.deleteMany({
                where: {
                    id: { in: deleteIds }
                }
            });

            console.log(`✅ Deleted ${deleted.count} admin accounts`);
            console.log(`\n✅ Now you have only ONE admin: ${primaryAdmin.email}`);
        } else {
            console.log('\n✅ Already have only one admin account');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

manageAdmins();
