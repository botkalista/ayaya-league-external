const fs = require('fs-extra');
const child = require('child_process');

const ignoreFiles = [
    '.zip$',
    'readme.md',
    'utils_dev'
]

const ignorePattern = `--ignore="(${ignoreFiles.join('|')})"`;

const base = 'AyayaLeague-win32-ia32';

if (fs.existsSync(base)) {
    console.log('[build.js] Updating build\n')
    fs.rmSync(base + '/src', { force: true, recursive: true });
    fs.copySync('src', base + '/resources/app/src');
    fs.rmSync(base + '/scripts', { force: true, recursive: true });
    fs.copySync('scripts', base + '/resources/app/scripts');
    fs.rmSync(base + '/static', { force: true, recursive: true });
    fs.copySync('static', base + '/resources/app/static');
    fs.rmSync(base + '/dist', { force: true, recursive: true });
    fs.copySync('dist', base + '/resources/app/dist');
    build();
    return;
}

const command = `electron-packager . AyayaLeague --platform=win32 --arch=ia32 ${ignorePattern} --overwrite`
console.log(command);

const p = child.exec(command);

p.stdout.on('data', e => console.log(e));
p.stderr.on('data', e => console.error(e));

p.on('spawn', () => console.log('[build.js] Build started\n'));
p.on('exit', () => build());

function build() {
    console.log('[build.js] Preparing build\n')
    prepareBuild();
    console.log('[build.js] Build finished\n')
    if (fs.existsSync('AyayaLeague-win32-ia32.zip')) fs.removeSync('AyayaLeague-win32-ia32.zip');
    console.log('[build.js] Zipping file\n')
    child.execSync('"C:\\Program Files\\7-Zip\\7z.exe" a -tzip AyayaLeague-win32-ia32.zip AyayaLeague-win32-ia32');
    console.log('[build.js] Finished\n')
}

function prepareBuild() {
    // const basePath = `AyayaLeague-win32-ia32`;
    // const appPath = `${basePath}/resources/app`;
    // fs.moveSync(`${appPath}/static`, `${basePath}/static`);
}