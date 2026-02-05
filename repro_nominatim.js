const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testNominatim() {
    const queries = ['Berlin'];

    // Test generic Q
    for (const q of queries) {
        console.log(`\n--- Testing Generic Q: "${q}" ---`);
        const params = new URLSearchParams({
            q: q,
            format: 'json',
            addressdetails: '1',
            limit: '10', // Increased limit
            countrycodes: 'de',
            'accept-language': 'ru'
        });
        await runAuth(params);
    }

    // Test City param
    for (const q of queries) {
        console.log(`\n--- Testing City Param: "${q}" ---`);
        const params = new URLSearchParams({
            city: q,
            format: 'json',
            addressdetails: '1',
            limit: '10',
            countrycodes: 'de',
            'accept-language': 'ru'
        });
        await runAuth(params);
    }
}

async function runAuth(params) {
    const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
    console.log(`URL: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Svoi.de-Debug-Script/1.0'
            }
        });
        const data = await response.json();

        if (data.length === 0) console.log("No results.");
        data.forEach((item, index) => {
            console.log(JSON.stringify(item, null, 2));
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// async function testNominatim() { // Refactored above to run directly
//     ...
// }

testNominatim();
