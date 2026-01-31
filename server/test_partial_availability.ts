
import axios from 'axios';

const CHECK_IN = '2025-02-01';
const CHECK_OUT = '2025-02-10'; // 9 nights
const GUESTS = 2;
const API_URL = 'http://localhost:3001/api/hotels';

async function testPartialAvailability() {
    try {
        console.log(`Testing search: ${CHECK_IN} to ${CHECK_OUT}`);
        const response = await axios.get(API_URL, {
            params: {
                city: 'makkah',
                checkIn: CHECK_IN,
                checkOut: CHECK_OUT,
                guests: GUESTS
            }
        });

        const hotels = response.data;
        console.log(`Found ${hotels.length} hotels.`);

        const partials = hotels.filter((h: any) => h.partialMatch || h.isPartial);
        console.log(`Partially available hotels: ${partials.length}`);

        if (partials.length > 0) {
            console.log('--- Partial Matches ---');
            partials.forEach((h: any) => {
                console.log(`- ${h.name} (Partial: ${h.partialMatch})`);
                if (h.rooms) {
                    h.rooms.forEach((r: any) => {
                        if (r.partialMetadata) {
                            console.log(`  Room: ${r.name} - Available: ${r.partialMetadata.availableFrom} to ${r.partialMetadata.availableTo}`);
                        }
                    });
                }
            });
        } else {
            console.log('No partial matches found. Checking generic availability...');
            hotels.slice(0, 3).forEach((h: any) => {
                console.log(`- ${h.name} (Partial: ${h.partialMatch}, IsPartial: ${h.isPartial})`);
            });
        }

    } catch (error: any) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
}

testPartialAvailability();
