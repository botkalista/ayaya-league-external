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


const a = 746662828
const b = 684409948

const t = b;

const len = AyayaLeague.reader.readProcessMemory(t + 0x10, "DWORD");
const name_1 = AyayaLeague.reader.readProcessMemory(t, "STR");
const buff_1 = AyayaLeague.reader.readProcessMemoryBuffer(t, 30);
const name_2_address = AyayaLeague.reader.readProcessMemory(t, 'DWORD');
const name_2 = AyayaLeague.reader.readProcessMemory(name_2_address, "STR");
const buff_2 = AyayaLeague.reader.readProcessMemoryBuffer(name_2_address, 30);

console.log(buff_1);
console.log(buff_2);

console.log({ len, name_1, name_2 });


// //* Create UserScriptManager
// const manager = new UserScriptManager();

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