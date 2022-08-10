
const fs = require('fs');
import { SIGNATURE } from '../src/consts/Offsets_12.14';


const name_12_14 = 'League of Legends_exe_PID3014_League of Legends.exe_F70000_x86'
let dump = fs.readFileSync('dumps/12.14/' + name_12_14 + '.exe');
let dumpNums = Array.from<number>(dump);
dump = undefined;

let dumpStr: string = '';

for (let i = 0; i < dumpNums.length; i += 10000000) {
    dumpStr += dumpNums.splice(0, 10000000).map(e => {
        const r = e.toString(16).toUpperCase();
        if (r.length == 1) return `0${r}`;
        return r;
    }).join(' ');
}
dumpNums.length = 0;


//0x1872A8C



const res = findSignature("08 30 8A 2C 56 0B 05 00 01 00 00 00 00 00 00 00 01 00 00 00 00 B7 29 0A 00 00 00 00 00 70 26 0A 60 8C 27 0A 60 00 00 80 5B 00 00 80 88 FD 91 00 E0 E0 21 0B")


console.log(res.toString(16))

function findSignature(sig: string): number {
    const regexp_str = sig.replace(/\?/g, '\\w*');
    console.log('signature', sig);
    console.log('regexp', regexp_str);
    const regexp = RegExp(regexp_str);
    const regexp_result = regexp.exec(dumpStr);
    if (!regexp_result) return 0;
    const index: number = regexp_result.index;

    const off = dumpStr.substring(0, index).split(' ').length - 1;

    console.log(off);
    console.log(off.toString(16));

    const memArea = dumpStr.substring(index, index + 18)

    const dword = memArea.substring(6);

    const dwordValue = dword[9] + dword[10] + dword[6] + dword[7] + dword[3] + dword[4] + dword[0] + dword[1]

    const result = parseInt('0x' + dwordValue, 16) + 0xF70000;

    return result;
}