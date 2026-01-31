/**
 * =========================================================
 * 🔐 UPDATE ADMIN - NOOR CREDENTIALS
 * =========================================================
 * Updates admin credentials using "noor" as base
 * =========================================================
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Credentials based on "noor"
const NEW_EMAIL = 'noor@admin.sa';
const NEW_PASSWORD = 'Noor@2026!Secure';  // Strong but based on noor

async function updateAdminToNoor() {
    console.log('🔐 Updating admin credentials to Noor...\n');

    try {
        // 1. Hash the new password
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

        // 2. Get current admin
        const currentAdmin = await prisma.user.findFirst({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] }
            }
        });

        if (!currentAdmin) {
            console.log('❌ No admin account found!');
            return;
        }

        console.log(`📧 Old Email: ${currentAdmin.email}`);
        console.log(`📧 New Email: ${NEW_EMAIL}\n`);

        // 3. Update the admin account
        await prisma.user.update({
            where: { id: currentAdmin.id },
            data: {
                email: NEW_EMAIL,
                password: hashedPassword,
                name: 'Noor Admin'
            }
        });

        console.log('✅ Admin credentials updated to Noor!\n');
        console.log('═══════════════════════════════════════════════════');
        console.log('🔑 NEW ADMIN LOGIN CREDENTIALS (SAVE THIS!)');
        console.log('═══════════════════════════════════════════════════');
        console.log(`📧 Email:    ${NEW_EMAIL}`);
        console.log(`🔒 Password: ${NEW_PASSWORD}`);
        console.log('═══════════════════════════════════════════════════');
        console.log('\n⚠️  IMPORTANT: Save these credentials!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminToNoor();
