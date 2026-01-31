/**
 * =========================================================
 * 🔐 UPDATE ADMIN - ULTRA SECURE CREDENTIALS
 * =========================================================
 * Updates admin credentials to ultra-secure random values
 * =========================================================
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Generate truly random credentials
const randomEmail = `sec${crypto.randomBytes(4).toString('hex')}@admin.local`;
const randomPassword = crypto.randomBytes(16).toString('base64').replace(/[\/\+=]/g, 'X') + '!2K26';

async function updateToUltraSecure() {
    console.log('🔐 Generating ultra-secure credentials...\n');

    try {
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const currentAdmin = await prisma.user.findFirst({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] }
            }
        });

        if (!currentAdmin) {
            console.log('❌ No admin account found!');
            return;
        }

        await prisma.user.update({
            where: { id: currentAdmin.id },
            data: {
                email: randomEmail,
                password: hashedPassword,
                name: 'Administrator'
            }
        });

        console.log('✅ Admin credentials updated!\n');
        console.log('═══════════════════════════════════════════════════');
        console.log('🔑 ULTRA-SECURE ADMIN CREDENTIALS');
        console.log('═══════════════════════════════════════════════════');
        console.log(`📧 Email:    ${randomEmail}`);
        console.log(`🔒 Password: ${randomPassword}`);
        console.log('═══════════════════════════════════════════════════');
        console.log('\n⚠️  SAVE THESE NOW! Completely random and secure!');
        console.log('⚠️  You can change them anytime from the Admin Panel.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateToUltraSecure();
