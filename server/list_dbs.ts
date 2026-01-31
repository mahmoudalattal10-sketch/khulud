
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to verify databases...");
        // Use raw query to list databases
        const dbs = await prisma.$queryRawUnsafe('SHOW DATABASES;');
        console.log("Found Databases:");
        console.table(dbs);
    } catch (e) {
        console.error('❌ Connection Failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
