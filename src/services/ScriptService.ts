
import * as fs from 'fs';
import * as path from 'path';

import * as vm from 'vm';


type Script = {
    script: vm.Script,
    path: string,
    name: string,
    fns: { [key: string]: vm.Script }
}


const scripts: Script[] = [];

export async function loadScripts() {
    const basePath = path.join(__dirname, '../../scripts');
    const scriptsFiles = fs.readdirSync(basePath);
    for (const scriptPath of scriptsFiles) {
        const path = `${basePath}\\${scriptPath}`;
        const script = new vm.Script(fs.readFileSync(path, 'utf8'));
        const res = script.runInNewContext({ register: (opts) => opts });
        const fns: { [key: string]: vm.Script } = {};
        for (const fn in res) {
            const fnText = res[fn].toString();
            fns[fn] = new vm.Script(fnText + `\n${fn}()`);
        }
        scripts.push({ script, name: scriptPath, path, fns });
    }
}

export function getScripts() {
    return scripts;
}
