
import { UserScriptManager } from "../typings/UserScriptManager";


function main(manager: UserScriptManager) {

    if (manager.missiles.length > 2) console.log('Test1');
    if (manager.me.hp < 300) console.log('Test2');

}


export default main;