// Native fetch in Node 18+

async function testApi() {
    try {
        console.log("Fetching http://localhost:3001/api/hotels?city=madinah...");
        const res = await fetch('http://localhost:3001/api/hotels?city=madinah');
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data Length:", Array.isArray(data) ? data.length : 'Not an array');
        if (Array.isArray(data) && data.length > 0) {
            console.log("First Hotel Sample:", JSON.stringify(data[0], null, 2));
        } else {
            console.log("Raw Data:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testApi();
