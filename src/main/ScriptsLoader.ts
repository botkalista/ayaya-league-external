
import * as path from 'path';
import * as fs from 'fs';

import type { UserScript } from '../events/types';

import { loadSettingsFromFile, setSettings, getSettings } from '../overlay/Settings';


export async function loadUserScripts(userScripts: UserScript[]) {
    loadSettingsFromFile();

    const basePath = path.join(__dirname, '../../../scripts/userscripts');
    const userScriptsPaths = fs.readdirSync(basePath);
    for (const scriptPath of userScriptsPaths) {
        try {
            if (scriptPath.startsWith('.gitkeep')) continue;
            if (scriptPath.endsWith('.ts')) {
                console.log('Skipped', scriptPath, ' - You need to compile it to js');
                continue;
            }
            const p = path.join(basePath, scriptPath);
            const imp = await require(p);
            userScripts.push({ ...imp, _modulename: p, _scriptname: scriptPath });
        } catch (ex) {
            console.error('Error loading', scriptPath, ex);
        }
    }

    const scriptSettings: any[] = [];

    const loadedSettings = getSettings();

    for (const script of userScripts) {
        try {
            if (script.setup) {
                const setupResult = await script.setup(script._modulename, script._scriptname);
                if (!setupResult) continue;

                const setting = loadedSettings.find(s => s.name == script._scriptname);

                const data = setupResult.map(e => {
                    if (setting) {
                        const s = setting.data.find(k => k.text == e.text);

                        if (s && s.type === 'key' && s.strValue) {
                            e.strValue = s.strValue;
                        }

                        if (s && s.value != undefined) {
                            e.value = s.value;
                            e.default = undefined;
                            return e;
                        }
                    }
                    e.value = e.default;
                    e.default = undefined;
                    return e;
                });

                scriptSettings.push({ name: script._scriptname, data });
            }
        } catch (ex) {
            console.error('Error on script', script._modulename, 'function setup\n', ex);
        }
    }

    setSettings(scriptSettings);

    console.log('Loaded', userScripts.length, 'user scripts.');
}

export async function unloadUserScripts(userScripts: UserScript[]) {
    for (const script of userScripts) {
        delete require.cache[script._modulename];
    }

    userScripts.length = 0;
}