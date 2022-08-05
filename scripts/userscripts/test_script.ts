import { UserScriptManager } from "../UserScriptManager";

import AyayaLeague from '../../src/LeagueReader';
import { CachedClass } from "../../src/models/CachedClass";
AyayaLeague.reader.setMode('DUMP');
AyayaLeague.reader.loadDump();


CachedClass.debug = true;

function onTick() {
    // const e = require('../userscripts/BaseScript.ts')

    const c = new UserScriptManager();
    CachedClass.set('screen', 1);
    CachedClass.set('matrix', 1);
    CachedClass.set('gameTime', 1);
    CachedClass.set('myTeam', 1);
    CachedClass.set('nmeTeam', 1);

    // console.log(c.missiles[0].startPos);
    // console.log(c.missiles[0].endPos);
    // console.log(c.missiles[0].startPos);

    // e.default.call(c, c);
}

onTick();
