
const fs = require('fs');
const JSZip = require('jszip');
const child = require('child_process');
const getFileMappings = require('./getFileMappings.js');

const files = getFileMappings();
const zip = new JSZip();

for (const file of files) zip.file(file.path, fs.readFileSync(file.path, 'utf8'));


zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream('data.zip'))
    .on('finish', function () {
        child.execSync(`scp -r data.zip root@95.216.218.179:/home/AyayaLeague_Server_Update/upload/data.zip`);
        child.execSync(`scp -r ayaya_version root@95.216.218.179:/home/AyayaLeague_Server_Update/upload/ayaya_version`);
    });
