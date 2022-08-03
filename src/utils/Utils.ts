// import { allowedChars } from "../consts/Offsets";
import * as math from 'mathjs';

// export function getNameFromBuffer(buffer): string {
//     const _name: any[] = [];
//     for (let i = 0; i < buffer.length; i++) {
//         const s = String.fromCharCode(buffer.at(i))
//         if (!allowedChars.includes(s)) break;
//         _name.push(s);
//     }
//     const name = _name.join('');
//     return name;
// }

export function matrixToArray(matrix: math.Matrix): number[] {
    const result: number[] = [];
    for (let i = 0; i < matrix['_data'].length; i++) {
        for (let k = 0; k < matrix['_data'][i].length; k++) {
            const val: number = matrix['_data'][i][k];
            result.push(val);
        }
    }
    return result;
}