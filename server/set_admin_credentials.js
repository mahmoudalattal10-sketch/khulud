/**
 * =========================================================
 * 🔐 UPDATE ADMIN - CUSTOM CREDENTIALS
 * =========================================================
 * Sets admin credentials to specified values
 * =========================================================
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// User-specified credentials
const NEW_EMAIL = 'khulud357diafat@heroadmin';
const NEW_PASSWORD = 'diafatnoor1';

async function updateToCustomCredentials() {
    console.log('🔐 Updating admin credentials to custom values...\n');

    try {
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

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

        await prisma.user.update({
            where: { id: currentAdmin.id },
            data: {
                email: NEW_EMAIL,
                password: hashedPassword,
                name: 'Khulud Admin'
            }
        });

        console.log('✅ Admin credentials updated successfully!\n');
        console.log('═══════════════════════════════════════════════════');
        console.log('🔑 NEW ADMIN LOGIN CREDENTIALS');
        console.log('═══════════════════════════════════════════════════');
        console.log(`📧 Email:    ${NEW_EMAIL}`);
        console.log(`🔒 Password: ${NEW_PASSWORD}`);
        console.log('═══════════════════════════════════════════════════');
        console.log('\n✅ These are now the ONLY credentials for admin access!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateToCustomCredentials();
