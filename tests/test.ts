import { OFFSET } from '../src/consts/Offsets';
import AyayaLeague from '../src/LeagueReader'

if (process.argv[2] == 'nohook') {
    AyayaLeague.reader.setMode("DUMP");
    AyayaLeague.reader.loadDump();
} else {
    AyayaLeague.reader.hookLeagueProcess();
}



// const Reader = AyayaLeague.reader;
// const me = AyayaLeague.getMissilesList();
// console.log(me);