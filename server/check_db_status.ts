
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.hotel.count();
        console.log(`✅ Database Connected! Found ${count} hotels.`);
        const hotels = await prisma.hotel.findMany({ select: { name: true } });
        console.log('Hotels:', hotels.map(h => h.name).join(', '));
    } catch (e) {
        console.error('❌ Connection Failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
