const fs = require('fs-extra');
const child = require('child_process');

const ignoreFiles = [
    '^/cache',
    '^/dump',
    '^/media',
    '^/tests',
    '^/tmpbuild',
    'AyayaLeague-win32-ia32.zip'
]

const ignorePattern = `--ignore="(${ignoreFiles.join('|')})"`;


const command = `electron-packager . AyayaLeague --platform=win32 --arch=ia32 ${ignorePattern} --overwrite`
console.log(command);

const p = child.exec(command);

p.stdout.on('data', e => console.log(e));
p.stderr.on('data', e => console.error(e));

p.on('spawn', () => console.log('[build.js] Build started\n'));
p.on('exit', () => {
    console.log('[build.js] Preparing build\n')
    prepareBuild();
    console.log('[build.js] Build finished\n')
});

function prepareBuild() {
    const basePath = `AyayaLeague-win32-ia32`;
    const appPath = `${basePath}/resources/app`;
    fs.moveSync(`${appPath}/static`, `${basePath}/static`);
}