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

// We are looking for lines that start with single quote ' and contain ${import...
// and replacing the single quotes with backticks `
console.log(`Scanning ${targetDir}...`);

walk(targetDir, (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    let changed = false;

    // Regex to match: fetch('${import...}') or fetch('${import...}/api...')
    // We want to turn '...' into `...` IF it contains ${} logic.
    // The previous failed build log showed: await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users');

    // Safety replacement: find any occurrence of '${import.meta.env.VVITE_API_URL...}' and replace outer quotes with backticks.

    const regex = /'(\$\{import\.meta\.env\.VITE_API_URL[^']*\})'/g;
    // This matches '${...}' literally.

    // But wait, the string might continue: '${...}/api/foo'
    // So let's match: '(\$\{import\.meta\.env\.VITE_API_URL.*?)'

    // Actually, simple string replacement is safer if we know the exact prefix
    const wrongPrefix = "'${import.meta.env.VITE_API_URL";

    if (content.includes(wrongPrefix)) {
        console.log(`Fixing: ${filepath}`);
        // We need to find the specific lines and change ' to ` at start and end of string.
        const lines = content.split('\n');
        const newLines = lines.map(line => {
            if (line.includes(wrongPrefix)) {
                // Replace the specific single-quoted block with a backticked block.
                // CAREFUL: There might be single quotes INSIDE the block: || 'http://localhost'
                // We only want to replace the OUTER quotes wrapping the whole string interpolation.

                // Heuristic: If it starts with fetch(' and has ${ inside, it is likely wrong.
                // Transformation: fetch('${...}...') -> fetch(`${...}...`)

                // Let's replace the first ' that appears before ${import with `
                // and the matching closing ' with `

                // Since we generated this code via a tool, we know the structure mostly.
                // It looks like: fetch('${import...}/some/path')

                // Replace '${ with `${
                let newLine = line.replace(/'\${/g, '`${');

                // Now we need to find where the string ends. 
                // If we changed start to `, we must change end to `.
                // The end is likely the last ' before ) or ,
                // This is risky with regex.

                // Better approach:
                // The broken lines look like: await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users');
                // We want: await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users`);

                // The pattern is: '${ ... }'
                // We can simply replacing explicit strings.

                // Replace: '${import
                // With: `${import
                newLine = newLine.replace(/'\${import/g, '`${import');

                // Now, if we did that, we have an open backtick.
                // The string ends with '.
                // But wait, inside is 'http://localhost:3001'. That inner quote is fine.
                // The closing quote of the URL string needs to be `.

                // Let's assume the string ends before ); or , {
                // This is getting complicated.

                // Let's just fix the known pattern: '}/api
                // The log error was: fetch('${...}/api/users');
                // Only the START was definitely wrong syntax for interpolation.
                // Wait, NO.
                // '${...}' is a VALID string in JS. It just doesn't interpolate. It literally sends the string "${...}".
                // And because it contains complex chars, maybe babel fails?
                // The error was: Unexpected token, expected ","
                // 90 |      if (response.ok) {

                // Ah, the issue is likely unbalanced quotes or something.

                // Let's revert to the core issue: We inserted '${...}' (literal string) instead of `${...}` (template literal).

                // Strategy:
                // 1. Replace start: '${import  ---> `${import
                // 2. We need to find the matching end quote to turn it into `.
                //    Since we know these are fetch calls, they usually end with `')` or `',`
                //    Let's replace `')` with `\`)` and `',` with `\`, `

                if (newLine.includes('`${import')) {
                    // Try to close it.
                    // Be careful not to replace inner quotes.
                    // The string likely ends with /api/something'

                    // Regex to replace the last quote in the line? 
                    // Or simply: replace ')/ with `)/ ? No.

                    // Let's try to match: /api/.*?'
                    // Replace ' at the end of the URL path with `

                    // E.g. /api/users' -> /api/users`
                    newLine = newLine.replace(/\/api\/([^']*?)'/g, '/api/$1`');

                    // Also handle query params: ?q=...'
                    newLine = newLine.replace(/\?([^']*?)'/g, '?$1`');

                    // Handle simple end: 'http://localhost:3001' (fallback) NO do not touch this.
                }

                return newLine;
            }
            return line;
        });
        return newLines.join('\n');
    }
    return content;
});

// We will overwrite file if changed. A bit risky but we are in recovery mode.
// Actually, `walk` above just returned content, need to modify to write.
