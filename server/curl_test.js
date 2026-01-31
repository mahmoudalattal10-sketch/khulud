// Native fetch in Node 18+
async function testFetch() {
    // The path from the directory listing:
    // hotels\فندق-ساعة-مكة-فيرمونت-(Fairmont-Makkah-Clock-Royal\hotel\1769749712225-80984859.png

    // We need to encode the path components correctly.
    // encodeURIComponent would encode everything including / which is wrong.
    // We encode each segment.

    const parts = [
        'hotels',
        'فندق-ساعة-مكة-فيرمونت-(Fairmont-Makkah-Clock-Royal',
        'hotel',
        '1769749712225-80984859.png'
    ];

    const urlPath = parts.map(encodeURIComponent).join('/');
    const fullUrl = `http://localhost:3001/uploads/${urlPath}`;

    console.log(`Fetching: ${fullUrl}`);

    try {
        const res = await fetch(fullUrl);
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (res.ok) {
            console.log("✅ Success! Content-Length:", res.headers.get('content-length'));
        } else {
            console.log("❌ Failed!");
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }

    // Also try without encoding (Node fetch might handle it?)
    // Actually typically browsers send encoded.
}

testFetch();
