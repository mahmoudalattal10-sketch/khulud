
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    console.log('🔍 Checking Users in Database...');
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                // Do not select password hash for security, just knowing it exists is enough
            }
        });

        if (users.length === 0) {
            console.log('❌ No users found in the database.');
        } else {
            console.log(`✅ Found ${users.length} users:`);
            console.table(users);
        }
    } catch (error) {
        console.error('❌ Error fetching users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
