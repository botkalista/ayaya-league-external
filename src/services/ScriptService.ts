
import * as fs from 'fs';
import * as path from 'path';

import * as vm from 'vm';

import Manager from '../models/main/Manager';
import DrawService from './DrawService';

import { vKeys } from './KeyMappingService';

type Script = {
    script: vm.Script,
    path: string,
    name: string,
    settings: any,
    fns: { [key: string]: vm.Script }
}


const scripts: Script[] = [];

export async function loadScripts() {

    console.log('Loading scripts');

    scripts.length = 0;
    const basePath = path.join(__dirname, '../../scripts');
    const scriptsFiles = fs.readdirSync(basePath);
    for (const scriptPath of scriptsFiles) {
        const path = `${basePath}\\${scriptPath}`;
        const script = new vm.Script(fs.readFileSync(path, 'utf8'));

        const fns: { [key: string]: vm.Script } = {};
        let settings;

        try {
            script.runInNewContext({
                register: (res) => {
                    for (const fn in res) {
                        const fnText = res[fn].toString();
                        fns[fn] = new vm.Script(fnText + `\n${fn}();`);
                    }
                },
                settings: (res) => { settings = res; },
                getVKEY: (vKey: keyof typeof vKeys) => { return vKey }
            });
        } catch (ex) {
            console.log('Error on script', path, ex);
        }



        scripts.push({ script, name: scriptPath, path, settings, fns });
    }

    console.log('Scripts loaded');
}

export function getScripts() {
    return scripts;
}

export function executeFunction(functionName: string, ...args) {

    for (const script of scripts) {
        const fn = script.fns[functionName];
        if (!fn) continue;

        try {
            fn.runInNewContext({
                ...script.fns,
                args,
                console,
                manager: Manager,
                ctx: DrawService,
                settings: script.settings,
                vKeys,
                getSetting: (id) => {
                    const target = getSettingRaw(script.settings, id);
                    return target?.value;
                }
            });
        } catch (ex) {
            console.log('Error on script', script.name, ex);
        }

    }

}

export function getSettingRaw(settings: any, id: string) {
    const groups = settings.filter(e => e.group != undefined).map(e => e.group);
    let setting;
    for (const group of groups) {
        for (let i = 0; i < group.length; i++) {
            if (group[i].id == id) {
                setting = group[i];
                break;
            }
        }
    }
    return setting;
}

export async function reloadScripts() {
    await loadScripts();
}