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


//* Create UserScriptManager
const manager = new UserScriptManager();

//* Load required global variables
const gameTime = AyayaLeague.getGameTime();
const me = manager.me;
const myTeam = me.team;
const nmeTeam = myTeam == 100 ? 200 : 100;


//* Put global variables into global cache

CachedClass.set('gameTime', gameTime);
CachedClass.set('myTeam', myTeam);
CachedClass.set('nmeTeam', nmeTeam);


console.log(manager.champions.enemies[0].name)