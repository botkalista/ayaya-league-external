
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const fetch = require('node-fetch');
const child = require('child_process');

const getFilesMappings = require('./getFileMappings.js');
const server = 'http://95.216.218.179:7551'

main()
async function main() {

    //* Update server sha
    await fetch(server + '/recreate_sha');

    //* Get server sha
    const resSha = await fetch(server + '/sha');
    const shaFiles = await resSha.json();

    //* Get local sha
    const localSha = getFilesMappings();


    for (const file of localSha) {
        const rFile = shaFiles.find(e => e.path == file.path);
        if (rFile && rFile.sha == file.sha) continue;
        console.log('Updating', file.path);
        await fetch(server + '/prepare_dir', {
            headers: { file: file.path }
        });
        child.execSync(`scp -r ${file.path} root@95.216.218.179:/home/AyayaLeague_Server_Update/__files/${file.path}`);
    }

    //* Update server sha
    await fetch(server + '/recreate_sha');
}