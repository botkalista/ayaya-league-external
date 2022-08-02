import * as fs from 'fs';
import { OFFSET } from '../src/consts/Offsets';

const dump = fs.readFileSync('dump/dump.hex');

const localPlayer = dump.readInt32LE(OFFSET.oLocalPlayer);
console.log({ localPlayer, realLocalPlayer: 524844608 });
const hp1 = dump.readFloatLE(localPlayer + OFFSET.oObjectHealth - 0x2D0000);

console.log(localPlayer, hp1);

// console.log(dump);