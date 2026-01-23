const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filepath = path.join(dir, file);
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            walk(filepath, callback);
        } else if (stats.isFile() && file.endsWith('.vue')) {
            callback(filepath);
        }
    });
}

const targetDir = path.resolve(process.cwd(), 'src');

console.log(`Scanning ${targetDir}...`);

walk(targetDir, (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');

    // Pattern: '${import...}'
    // Goal: `${import...}`

    // We strictly look for the sequence '${import.meta.env.VITE_API_URL
    // and we want to change that leading ' to `
    // AND find the trailing ' that closes this specific string and turn it to `

    if (content.includes("'${import.meta.env.VITE_API_URL")) {
        console.log(`Fixing: ${filepath}`);

        // 1. Replace the starting sequence
        let newContent = content.replace(/'\$\{import\.meta\.env\.VITE_API_URL/g, "`\${import.meta.env.VITE_API_URL");

        // 2. Now we have an opening backtick `. We need to find the specific closing ' for these strings.
        // These strings are URLS. They usually end with:
        //   .../api/users'
        //   .../items'
        //   .../search?q=...'

        // We can use a regex that matches our NEW starting sequence, grabs everything until the next ', and replaces that ' with `
        // Regex: (`\$\{import\.meta\.env\.VITE_API_URL.*?)(')

        // We run this iteratively to catch all instances
        newContent = newContent.replace(/(`\$\{import\.meta\.env\.VITE_API_URL.*?)(')/g, "$1`");

        fs.writeFileSync(filepath, newContent, 'utf8');
    }
});

console.log('Done.');
