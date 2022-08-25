const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ignore = [
    'media',
    'node_modules',
    'scripts',
    '.git',
    'settings.json',
    'COMMIT_EDITMSG',
    'AyayaLeague-win32',
];

function isIgnored(str) {
    for (const i of ignore) if (str.startsWith(i)) return true;
}
function getFiles(dir, res) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        try {
            const currPath = path.join(dir, file);
            if (isIgnored(currPath)) continue;
            const info = fs.statSync(currPath);
            if (info.isFile()) {
                res.push(currPath);
            } else if (info.isDirectory()) {
                getFiles(currPath, res);
            }
        } catch { }

    }
}

function getFilesMappings() {
    let files = [];
    getFiles('.', files);
    files = files.map(e => {
        const fileBuffer = fs.readFileSync(e);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const hex = hashSum.digest('hex');
        return { path: e.replace(/\\/g, '/'), sha: hex }
    });

    return files;
}

module.exports = getFilesMappings;