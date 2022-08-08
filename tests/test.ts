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

import A from '../src/ActionControllerWrapper'
import { getChampionWindup, matrixToArray } from '../src/utils/Utils';
A.start('D:\\ayaya-league-external\\src\\cpp\\ALActionManager.exe');

async function sleep(ms) {
    return new Promise(e => setTimeout(e, ms));
}
async function main() {
    await sleep(100);

    const renderer = AyayaLeague.getRenderBase();




    setInterval(() => {

        const screen = AyayaLeague.getScreenSize(renderer);
        const matrix = matrixToArray(AyayaLeague.getViewProjectionMatrix());
        //* Put global variables into global cache
        CachedClass.set('screen', screen);
        CachedClass.set('matrix', matrix);
        const m = new UserScriptManager();
        m.monsters.forEach(e => {
            if (e.name.startsWith('Sru_Crab')) {
                const pos = e.screenPos.getFlat();
                A.move(pos.x, pos.y);
            }
        })
    }, 500)


}

main();


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