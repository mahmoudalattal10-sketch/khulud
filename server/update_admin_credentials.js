/**
 * =========================================================
 * 🔐 UPDATE ADMIN CREDENTIALS
 * =========================================================
 * Updates admin account with ultra-secure credentials
 * =========================================================
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Ultra-secure credentials
const NEW_EMAIL = 'diafat.khulud.secure@outlook.sa';
const NEW_PASSWORD = 'DK#2026!Makkah@Madinah$Secure99';  // Very strong password

async function updateAdminCredentials() {
    console.log('🔐 Updating admin credentials...\n');

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
                password: hashedPassword
            }
        });

        console.log('✅ Admin credentials updated successfully!\n');
        console.log('═══════════════════════════════════════════════════');
        console.log('🔑 NEW ADMIN LOGIN CREDENTIALS (SAVE THIS!)');
        console.log('═══════════════════════════════════════════════════');
        console.log(`📧 Email:    ${NEW_EMAIL}`);
        console.log(`🔒 Password: ${NEW_PASSWORD}`);
        console.log('═══════════════════════════════════════════════════');
        console.log('\n⚠️  IMPORTANT: Save these credentials in a secure location!');
        console.log('⚠️  Password contains: Numbers, Special chars, Uppercase, Lowercase');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminCredentials();
