
console.log("--- ENV DIAGNOSTIC START ---");
Object.keys(process.env).forEach(key => {
    if (key.includes("DATABASE") || key.includes("URL") || key.includes("POSTGRES")) {
        const val = process.env[key];
        console.log(`Key: ${key}`);
        console.log(`  Length: ${val ? val.length : "null"}`);
        console.log(`  Starts with: ${val ? val.substring(0, 15) : "null"}`);
    }
});
console.log("--- ENV DIAGNOSTIC END ---");
