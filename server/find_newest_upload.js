const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/uploads');

function getNewestFile(dir) {
    let newest = null;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const subNewest = getNewestFile(filePath);
            if (subNewest) {
                if (!newest || subNewest.mtime > newest.mtime) {
                    newest = subNewest;
                }
            }
        } else {
            if (!newest || stat.mtime > newest.mtime) {
                newest = { file: filePath, mtime: stat.mtime };
            }
        }
    }
    return newest;
}

const result = getNewestFile(dir);
if (result) {
    console.log("Newest File:", result.file);
    console.log("Modified:", result.mtime);

    // Suggest URL
    const relPath = result.file.split('public')[1].replace(/\\/g, '/');
    console.log("Suggested URL: http://localhost:3001" + encodeURI(relPath));
    // Also try encoded component style
    const encodedComp = relPath.split('/').map(s => encodeURIComponent(s)).join('/');
    console.log("Component Encoded URL: http://localhost:3001" + encodedComp);
} else {
    console.log("No files found.");
}
