const { PrismaClient } = require('@prisma/client');
const http = require('http');
const https = require('https');

const prisma = new PrismaClient();

// COPY OF FRONTEND LOGIC
const getImageUrl = (url) => {
    if (!url || url === 'undefined' || url === 'null') {
        return 'FALLBACK_LOGO';
    }
    if (url.startsWith('http') || url.startsWith('https') || url.startsWith('blob:')) {
        return url;
    }
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:3001${encodeURI(cleanPath)}`;
};

async function checkUrl(url, description) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.request(url, { method: 'HEAD' }, (res) => {
            console.log(`[${res.statusCode}] ${description} \n    -> ${url}`);
            resolve(res.statusCode === 200);
        });
        req.on('error', (e) => {
            console.log(`[ERR] ${description} \n    -> ${url} : ${e.message}`);
            resolve(false);
        });
        req.end();
    });
}

async function main() {
    console.log("🔍 DIAGNOSING FRONTEND IMAGE LOGIC...");

    // 1. Check a known Unsplash Hotel
    const unsplashHotel = await prisma.hotel.findFirst({
        where: { image: { startsWith: 'http' } }
    });
    if (unsplashHotel) {
        console.log("\n1. Testing Unsplash Image (Should work independent of backend path):");
        const url = getImageUrl(unsplashHotel.image);
        await checkUrl(url, `Hotel: ${unsplashHotel.name}`);
    }

    // 2. Check a Local Image Hotel (if any)
    const localHotel = await prisma.hotel.findFirst({
        where: { NOT: { image: { startsWith: 'http' } } }
    });

    if (localHotel) {
        console.log("\n2. Testing Local Image (The problematic ones):");
        console.log(`   Raw DB Value: '${localHotel.image}'`);
        const url = getImageUrl(localHotel.image);
        await checkUrl(url, `Hotel: ${localHotel.name}`);
    } else {
        console.log("\n2. No local image hotels found in DB to test.");
    }

    // 3. Test the specific "newest" file found earlier if possible (Manual Test)
    // /uploads/hotels/فندق-تجربة-الفا/hotel/1769751282063-658284211.jpg
    const manualPath = "/uploads/hotels/فندق-تجربة-الفا/hotel/1769751282063-658284211.jpg";
    console.log("\n3. Testing Manual Path (Verification):");
    const manualUrl = getImageUrl(manualPath);
    await checkUrl(manualUrl, "Manual Test File");

}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
