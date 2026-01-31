const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const rooms = await prisma.room.findMany({
        include: { hotel: true }
    });

    console.log(JSON.stringify(rooms.map(r => ({
        hotel: r.hotel.name,
        room: r.name,
        city: r.hotel.city,
        visible: r.hotel.isVisible,
        pricing: r.pricingPeriods
    })), null, 2));
}

main().finally(() => prisma.$disconnect());
