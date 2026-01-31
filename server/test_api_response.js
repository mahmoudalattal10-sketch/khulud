
const http = require('http');

http.get('http://localhost:3001/api/hotels', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const hotels = JSON.parse(data);
            const sample = hotels[0];
            console.log("--- API Response Sample ---");
            console.log("Name:", sample.name);
            console.log("Lat:", sample.lat);
            console.log("Lng:", sample.lng);
            console.log("Distance:", sample.distance); // The frontend often looks for 'distance'
            console.log("DistanceFromHaram:", sample.distanceFromHaram);
            console.log("Raw object keys:", Object.keys(sample));
        } catch (e) {
            console.error("Parse error:", e.message);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e.message);
});
