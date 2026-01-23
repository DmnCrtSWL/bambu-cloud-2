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

const targetDir = path.resolve('../admin/src');
const searchString = "'${import.meta.env.VITE_API_URL || 'http://localhost:3001'}'";
const replaceString = "import.meta.env.VITE_API_URL || 'http://localhost:3001'";

console.log(`Scanning ${targetDir}...`);
console.log(`Searching for: ${searchString}`);

walk(targetDir, (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    // Previous script might have been imperfect or we have mixed cases.
    // The error specificly in log is: fetch('${import...
    // which means it is literally trying to fetch a string that starts with ${...
    // We want to replace '${import.meta.env.VITE_API_URL || 'http://localhost:3001'}' 
    // WITH just the value: (import.meta.env.VITE_API_URL || 'http://localhost:3001')

    // BUT wait, in JS template literals: `${...}` is valid. 
    // The error says: await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users');
    // This looks like nested strings: ' ... ${ ... } ... '
    // We want to remove the outer quotes so it becomes a template literal or direct expression.

    // Exact pattern causing error: '${import.meta.env.VITE_API_URL || 'http://localhost:3001'}'
    // We should replace it with: (import.meta.env.VITE_API_URL || 'http://localhost:3001')
    // OR simply `http://localhost:3001` if we want to rely on the sanitized version we did manually?
    // No, better to correct the syntax.

    if (content.includes(searchString)) {
        console.log(`Fixing: ${filepath}`);
        const newContent = content.split(searchString).join(replaceString);
        fs.writeFileSync(filepath, newContent, 'utf8');
    }
});

console.log('Done.');
