
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function fetchCities() {
    // Overpass query explaining:
    // Area: Germany (ISO3166-1=DE)
    // Nodes/Relations with place=city or place=town
    // Output: tags (name, name:ru, population), coordinates
    const query = `
        [out:json][timeout:25];
        area["ISO3166-1"="DE"]->.searchArea;
        (
          node["place"~"city|town"](area.searchArea);
          relation["place"~"city|town"](area.searchArea);
        );
        out tags center;
    `;

    const url = "https://overpass-api.de/api/interpreter";

    console.log("Fetching from Overpass...");
    try {
        const response = await fetch(url, {
            method: "POST",
            body: "data=" + encodeURIComponent(query)
        });

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        console.log(`Received ${data.elements.length} elements.`);

        // Filter and process
        const processed = data.elements
            .map(el => {
                const tags = el.tags || {};
                const population = parseInt(tags.population || "0".replace(/\D/g, ''));
                return {
                    id: el.id,
                    type: el.type,
                    name: tags.name,
                    name_ru: tags["name:ru"],
                    population: population,
                    lat: el.lat || el.center?.lat,
                    lon: el.lon || el.center?.lon,
                    tags: tags // debug
                };
            })
            .filter(item => item.population > 20000)
            .sort((a, b) => b.population - a.population);

        console.log(`Found ${processed.length} cities with population > 20k.`);

        // Log top 5
        console.log("Top 5:");
        processed.slice(0, 5).forEach(c => console.log(`${c.name} (${c.population}) - RU: ${c.name_ru}`));

    } catch (e) {
        console.error("Error:", e);
    }
}

fetchCities();
