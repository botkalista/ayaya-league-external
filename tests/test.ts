import { OFFSET } from '../src/consts/Offsets';
import AyayaLeague from '../src/LeagueReader'


// const enemyTeamId = me.team == 100 ? 200 : 100;

// function showEnemiesSummoners() {
//     const startTime = performance.now();

//     const gameTime = AyayaLeague.getGameTime();
//     const entities = AyayaLeague.getEntities();
//     const enemies = entities.filter(e => e.team == enemyTeamId);
//     const enemyTurrets = enemies.filter(e => e.name.startsWith('Turret'))
//     const enemyChamps = enemies.filter(e => !e.name.startsWith('SRU') && e.name.length > 3 && !e.name.startsWith('PreSeason') && !enemyTurrets.includes(e))

//     const endTime = performance.now();

//     console.log('Time elapsed', endTime - startTime, 'ms');

//     console.log(enemyChamps.map(e => {
//         return `${e.name} D: ${parseInt(e.spells[4].getSeconds(gameTime).toFixed(0))} F: ${parseInt(e.spells[5].getSeconds(gameTime).toFixed(0))}`
//     }).join('\n'));
// }

// function loop() {
//     showEnemiesSummoners();
//     setTimeout(loop, 10000);
// }


AyayaLeague.reader.setMode("DUMP");
AyayaLeague.reader.loadDump();

const me = AyayaLeague.getLocalPlayer();

console.log(me.spells[4]);
console.log(me.spells[5]);


// const renderer = AyayaLeague.getRenderBase();
// const screen = AyayaLeague.getScreenSize(renderer);
// const test = AyayaLeague.worldToScreen(me.pos, screen);

// console.log('local', test);

