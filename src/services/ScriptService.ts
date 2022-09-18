
import * as fs from 'fs';
import * as path from 'path';

type Script = {
    fns: any,
    path: string,
    name: string,
    pending: any,
    settings: any[],
}


import Manager from '../models/main/Manager';
import DrawService from './DrawService';
import { vKeys } from './KeyMappingService';


const scripts: Script[] = [];

export async function loadScripts() {
    console.log('Loading scripts');

    global.manager = Manager;
    global.ctx = DrawService;
    global.getVKEY = function (key: keyof typeof vKeys) {
        return parseInt(vKeys[key][0]);
    }

    // Uncache all scripts
    for (const script of scripts) {
        delete require.cache[script.path];
    }

    scripts.length = 0;


    const basePath = path.join(__dirname, '../../scripts');
    const scriptsFiles = fs.readdirSync(basePath);
    for (const scriptPath of scriptsFiles) {

        const path = `${basePath}\\${scriptPath}`;

        try {
            // Require script
            const scriptRequired = await require(path);

            // Execute setup
            const scriptSettings = scriptRequired.setup?.();

            const scriptObject = {
                fns: scriptRequired,
                name: scriptPath,
                path,
                settings: scriptSettings || [],
                pending: {}
            }

            scripts.push(scriptObject);

        } catch (ex) {
            console.error('Error loading', path, ex);
        }


    }

    console.log('Scripts loaded');
}

export function executeFunction(functionName: string, ...args: any) {

    for (const scriptObject of scripts) {

        const fn = scriptObject.fns[functionName];

        if (!fn) continue;
        if (scriptObject.pending[functionName] == true) continue;

        const finalArgs = [...args] || [];
        

        finalArgs.push(function getSetting(id) {
            return getSettingRaw(scriptObject.settings, id)?.value;
        })

        try {
            const exec = fn(...finalArgs);
            if (!exec || !exec.then) continue;
            scriptObject.pending[functionName] = true;
            exec.then(() => scriptObject.pending[functionName] = false);
        } catch (ex) {
            console.error('Error during function', functionName, 'of', scriptObject.name, ex);
        }


    }
}

export function getScripts() {
    return scripts;
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
