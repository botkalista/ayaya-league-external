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

const Reader = AyayaLeague.reader;

const localPlayer = Reader.readProcessMemory(OFFSET.oLocalPlayer, "DWORD", true);
const hp = Reader.readProcessMemory(localPlayer + OFFSET.oObjectHealth, "FLOAT");
console.log({ hp });
const spell = Reader.readProcessMemory(localPlayer + OFFSET.oSpellBook + (4 * 4), "DWORD");
const sLevel = Reader.readProcessMemory(spell + OFFSET.oSpellLevel, "DWORD");
const sCd = Reader.readProcessMemory(spell + OFFSET.oSpellReadyAt, "FLOAT");
console.log({ sLevel })
console.log({ sCd })

const gameTime = AyayaLeague.getGameTime();
console.log({ gameTime })

const sInfo = Reader.readProcessMemory(spell + OFFSET.oSpellInfo, "DWORD");
const sData = Reader.readProcessMemory(sInfo + OFFSET.oSpellInfoData, "DWORD");
const name = Reader.readProcessMemory(sData + OFFSET.oSpellInfoDataName, "DWORD");

const realName = Reader.readProcessMemory(name, "STR");
console.log({ realName });


// const spellDinfo = Reader.readProcessMemory(spellD + OFFSET.oSpellInfo, "DWORD");

// const index = Reader.readProcessMemory(spellDinfo + OFFSET.oSpellInfoIndex, "DWORD");
// const level = Reader.readProcessMemory(spellDinfo + OFFSET.oSpellInfoLevel, "DWORD");
// const startTime = Reader.readProcessMemory(spellDinfo + OFFSET.oSpellInfoStartTime, "DWORD");

// const data = Reader.readProcessMemory(spellDinfo + OFFSET.oSpellInfoData, "DWORD");

// const cd = Reader.readProcessMemory(data + OFFSET.oSpellInfoDataCooldownTime, "DWORD");

// console.log(index)
// console.log(level)
// console.log(startTime)
// console.log(spellDinfo)
// console.log(cd)

// const renderer = AyayaLeague.getRenderBase();
// const screen = AyayaLeague.getScreenSize(renderer);
// const test = AyayaLeague.worldToScreen(me.pos, screen);

// console.log('local', test);

