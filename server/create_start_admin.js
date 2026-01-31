
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
    console.log('🔐 Creating Admin User: noor@gmail.com ...');

    const email = 'noor@gmail.com';
    const password = 'password123'; // Simple password for user to login

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use upsert to create or update if exists (though we know it doesn't)
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Noor Admin'
            },
            create: {
                email: email,
                password: hashedPassword,
                name: 'Noor Admin',
                role: 'ADMIN',
                phone: '0500000000'
            }
        });

        console.log('✅ Admin user created/updated successfully!');
        console.log('═══════════════════════════════════════════════════');
        console.log('🔑 LOGIN CREDENTIALS');
        console.log('═══════════════════════════════════════════════════');
        console.log(`📧 Email:    ${email}`);
        console.log(`🔒 Password: ${password}`);
        console.log('═══════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
