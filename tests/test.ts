import { OFFSET } from '../src/consts/Offsets';
import AyayaLeague from '../src/LeagueReader'

import { Performance } from '../src/utils/Performance';


if (process.argv[2] == 'nohook') {
    AyayaLeague.reader.setMode("DUMP");
    AyayaLeague.reader.loadDump();
} else {
    AyayaLeague.reader.hookLeagueProcess();
}


// AyayaLeague.reader.setMode("DUMP");
// AyayaLeague.reader.loadDump();





// const Reader = AyayaLeague.reader;
// const me = AyayaLeague.getMissilesList();
// console.log(me);



// const heroManager = Reader.readProcessMemory(OFFSET.oHeroManager, "DWORD", true);

// const heroList = Reader.readProcessMemory(heroManager + 0x4, "DWORD");
// const heroListSize = Reader.readProcessMemory(heroManager + 0x8, "DWORD");


// for (let i = 0; i < heroListSize; i++) {
//     const target = Reader.readProcessMemory(heroList + i * 0x4, "DWORD");
//     const hp = Reader.readProcessMemory(target + OFFSET.oObjectHealth, 'FLOAT');

//     const namePtr = Reader.readProcessMemory(target + OFFSET.oObjName, 'DWORD');
//     const name = Reader.readProcessMemory(namePtr, 'STR');
//     const nameSize = Reader.readProcessMemory(namePtr + 0x10, 'DWORD');
//     const nameCapacity = Reader.readProcessMemory(namePtr + 0x14, 'DWORD');

//     console.log({ hp, name, nameSize, nameCapacity })
// }

// console.log({ heroManager, heroList, heroListSize })