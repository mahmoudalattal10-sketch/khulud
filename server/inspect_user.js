
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'sadsadsd@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        console.log("User found:", JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            passwordLength: user.password.length, // Don't log hash for privacy, but length helps check if it's hashed
            role: user.role,
            createdAt: user.createdAt
        }, null, 2));

        // Check if password looks like a bcrypt hash (starts with $2b$ or $2a$)
        console.log("Password starts with bcrypt prefix:", user.password.startsWith('$2b$') || user.password.startsWith('$2a$'));
    } else {
        console.log("User not found:", email);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
