import { OFFSET } from '../src/consts/Offsets';
import AyayaLeague from '../src/LeagueReader'

if (process.argv[2] == 'nohook') {
    AyayaLeague.reader.setMode("DUMP");
    AyayaLeague.reader.loadDump();
} else {
    AyayaLeague.reader.hookLeagueProcess();
}

import { UserScriptManager } from '../scripts/UserScriptManager';
import { CachedClass } from '../src/models/CachedClass';


const Reader = AyayaLeague.reader;

//* Create UserScriptManager
const manager = new UserScriptManager();

const me = manager.me;


function getAiManager() {
    const v1 = Reader.readProcessMemory(me.address + OFFSET.oObjAiManager, "DWORD");
    const v2 = me.address + OFFSET.oObjAiManager - 8;
    const v3 = Reader.readProcessMemory(v2 + 4, "DWORD");
    let v4 = Reader.readProcessMemory(v2 + (4 * v1 + 12), "DWORD");
    v4 = v4 ^ ~v3;
    return Reader.readProcessMemory(v4 + 0x8, "DWORD");
}




setInterval(() => {
    const AiManager = getAiManager();
    const startPath = Reader.readProcessMemory(AiManager + OFFSET.oAiManagerEndPath, "VEC3");
    console.log({ startPath })
}, 100)





// //* Load required global variables
// const gameTime = AyayaLeague.getGameTime();
// const me = manager.me;
// const myTeam = me.team;
// const nmeTeam = myTeam == 100 ? 200 : 100;


// //* Put global variables into global cache

// CachedClass.set('gameTime', gameTime);
// CachedClass.set('myTeam', myTeam);
// CachedClass.set('nmeTeam', nmeTeam);

// console.log(manager.champions.enemies[0].spells.length);
// console.log(manager.champions.enemies[0].spells[4].name);

// for (let i = 0; i < manager.champions.enemies[0].spells.length; i++) {
//     console.log(AyayaLeague.reader.toHex(manager.champions.enemies[0].spells[i].address));
//     console.log(manager.champions.enemies[0].spells[i].name);
//     console.log(manager.champions.enemies[0].spells[i].level);
//     console.log(manager.champions.enemies[0].spells[i].readyAt);
//     console.log('---')
// }