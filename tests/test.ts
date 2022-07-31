import AyayaLeague from '../src/LeagueReader'

const me = AyayaLeague.getLocalPlayer();
const enemyTeamId = me.team == 100 ? 200 : 100;
const entities = AyayaLeague.getEntities();
const enemies = entities.filter(e => e.team == enemyTeamId);

const enemyTurrets = enemies.filter(e => e.name.startsWith('Turret'))
const enemyChamps = enemies.filter(e => !e.name.startsWith('SRU') && e.name.length > 3 && !e.name.startsWith('PreSeason') && !enemyTurrets.includes(e))

const gameTime = AyayaLeague.getGameTime();

console.log(enemyChamps);