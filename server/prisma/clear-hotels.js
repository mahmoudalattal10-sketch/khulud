const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearHotels() {
    console.log('🗑️ جاري حذف بيانات الفنادق والغرف...');

    // Delete rooms first (foreign key constraint)
    const deletedRooms = await prisma.room.deleteMany({});
    console.log(`✅ تم حذف ${deletedRooms.count} غرف`);

    // Delete hotels
    const deletedHotels = await prisma.hotel.deleteMany({});
    console.log(`✅ تم حذف ${deletedHotels.count} فنادق`);

    console.log('🎉 تم حذف جميع البيانات الوهمية بنجاح!');
    console.log('📋 يمكنك الآن إضافة الفنادق من لوحة التحكم');
}

clearHotels()
    .catch((e) => {
        console.error('❌ حدث خطأ:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
