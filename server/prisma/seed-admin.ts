/**
 * =========================================================
 * 👑 ADMIN USER SEED SCRIPT
 * =========================================================
 * Creates a default admin user for the platform.
 * Run: npx ts-node prisma/seed-admin.ts
 * =========================================================
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
    console.log('🔐 Creating Admin User...\n');

    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@diafat.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';

    // Check if admin exists
    const existing = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existing) {
        console.log('⚠️  Admin user already exists:');
        console.log(`   Email: ${existing.email}`);
        console.log(`   Role: ${existing.role}`);
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Super Admin',
            phone: '966553882445',
            role: 'SUPER_ADMIN'
        }
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('   ╔═══════════════════════════════════════╗');
    console.log('   ║  ADMIN CREDENTIALS                    ║');
    console.log('   ╠═══════════════════════════════════════╣');
    console.log(`   ║  Email:    ${adminEmail}         ║`);
    console.log(`   ║  Password: ${adminPassword}              ║`);
    console.log('   ╚═══════════════════════════════════════╝');
    console.log('\n⚠️  Remember to change the password after first login!');
}

seedAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
