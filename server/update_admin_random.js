/**
 * =========================================================
 * 🔐 UPDATE ADMIN - RANDOM SECURE CREDENTIALS
 * =========================================================
 * Ultra-secure random credentials with no site references
 * =========================================================
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Generate ultra-secure random credentials
function generateRandomString(length, includeSpecial = true) {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'; // Removed confusing chars
    const numbers = '23456789'; // Removed 0, 1
    const special = '!@#$%^&*';

    const chars = includeSpecial
        ? letters + numbers + special
        : letters + numbers;

    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[crypto.randomInt(0, chars.length)];
    }
    return result;
}

// Random email with random domain
const randomUsername = generateRandomString(12, false).toLowerCase();
const NEW_EMAIL = `${randomUsername}@securemail.net`;

// Ultra-secure random password (32 chars)
const NEW_PASSWORD = generateRandomString(32, true);

async function updateAdminCredentials() {
    console.log('🔐 Generating ultra-secure random credentials...\n');

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
                name: 'System Administrator' // Generic name
            }
        });

        console.log('✅ Admin credentials updated with RANDOM values!\n');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🔑 NEW RANDOM ADMIN CREDENTIALS (SAVE IMMEDIATELY!)');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`📧 Email:    ${NEW_EMAIL}`);
        console.log(`🔒 Password: ${NEW_PASSWORD}`);
        console.log('═══════════════════════════════════════════════════════════');
        console.log('\n⚠️  CRITICAL: Save NOW! This is completely random!');
        console.log('⚠️  Password: 32 characters, no site/city references');
        console.log('⚠️  Email: Random username, generic domain');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminCredentials();
