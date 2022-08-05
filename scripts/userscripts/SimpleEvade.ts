
import { UserScriptManager } from "../UserScriptManager";

export function setup() {

}

export function onTick(manager: UserScriptManager) {

    if (manager.missiles.length > 2) console.log('Test1');
    if (manager.me.hp < 300) console.log('Test2');

}

