
const child = require('child_process');


main();

function main() {

    //* Check node version

    const nodeVersion = child.execSync('node -v').toString().trim();
    if (nodeVersion != 'v16.10.0') return console.error(`NODE VERSION INSTALLED:\t${nodeVersion}\nNODE VERSION REQUIRED:\tv16.10.0`);
    const nodeArch = child.execSync('node -p "process.arch"').toString().trim();
    if (nodeArch != 'ia32') return console.error(`NODE ARCH INSTALLED:\t${nodeArch}\nNODE ARCH REQUIRED:\tia32`);

    //* install tsc and typescript globally

    console.log('Installing tsc');
    try { child.execSync('npm i -g tsc', { stdio: 'ignore' }); } catch (ex) { }

    console.log('Installing typescript');
    try { child.execSync('npm i -g typescript', { stdio: 'ignore' }); } catch (ex) { }

    //* install dependencies

    console.log('Installing dependencies');
    try { child.execSync('npm i', { stdio: 'ignore' }); } catch (ex) { }

    //* rebuild modules for current platform

    console.log('Rebuilding module 1/2');
    try { child.execSync('npm run rebuild-dep-m', { stdio: 'ignore' }); } catch (ex) { }

    console.log('Rebuilding module 2/2');
    try { child.execSync('npm run rebuild-dep-a', { stdio: 'ignore' }); } catch (ex) { }

    console.log('Completed');
}


