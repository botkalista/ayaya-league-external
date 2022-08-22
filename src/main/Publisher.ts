
import type { ScriptSettingsFull, UserScript } from "../events/types";

import Shared from './Shared';


//TODO: Add typings
export function publishToScript(fName: keyof UserScript, settings: ScriptSettingsFull, ...args: any) {
    for (const userScript of Shared.userScripts) {
        try {
            if (userScript[fName]) {
                const setting = settings.find(e => e.name == userScript._scriptname);
                (userScript[fName] as (...a) => any)(...args, (setting || { data: [] }).data);
            }
        } catch (ex) {
            console.error(`Error on script ${userScript._modulename} function ${fName}\n`, ex, '\n');
        }
    }
}
