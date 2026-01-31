
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking Hotels in Database...");
    const hotels = await prisma.hotel.findMany();

    console.log(`Found ${hotels.length} hotels.`);

    for (const h of hotels) {
        console.log(`[${h.id}] ${h.name}`);
        console.log(`   isOffer (Visible): ${h.isOffer}`);
        console.log(`   coords: ${h.coords} (Type: ${typeof h.coords})`);

        if (!h.isOffer) {
            console.log(`   -> Setting isOffer=true...`);
            await prisma.hotel.update({
                where: { id: h.id },
                data: { isOffer: true }
            });
            console.log(`   -> DONE.`);
        }
        console.log('------------------------------------------------');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
