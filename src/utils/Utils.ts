// import { allowedChars } from "../consts/Offsets";
import * as math from 'mathjs';

import { Vector2, Vector3, Vector4 } from '../models/Vector';

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

//* i hope this is right, i suck at typings
export function factoryFromArray<T, R>(type: { new(a: any): R }, arr: T[]): R[] {
    return arr.map(e => new type(e));
}

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

export function worldToScreen(pos: Vector3, screenSize: Vector2, viewProjMatrix: number[]) {
    const out = Vector2.zero();
    const screen = new Vector2(screenSize.x, screenSize.y);
    const clipCoords = Vector4.zero();
    clipCoords.x = pos.x * viewProjMatrix[0] + pos.y * viewProjMatrix[4] + pos.z * viewProjMatrix[8] + viewProjMatrix[12];
    clipCoords.y = pos.x * viewProjMatrix[1] + pos.y * viewProjMatrix[5] + pos.z * viewProjMatrix[9] + viewProjMatrix[13];
    clipCoords.z = pos.x * viewProjMatrix[2] + pos.y * viewProjMatrix[6] + pos.z * viewProjMatrix[10] + viewProjMatrix[14];
    clipCoords.w = pos.x * viewProjMatrix[3] + pos.y * viewProjMatrix[7] + pos.z * viewProjMatrix[11] + viewProjMatrix[15];
    if (clipCoords.w < 1.0) clipCoords.w = 1;
    const m = Vector3.zero();
    m.x = clipCoords.x / clipCoords.w;
    m.y = clipCoords.y / clipCoords.w;
    m.z = clipCoords.z / clipCoords.w;
    out.x = (screen.x / 2 * m.x) + (m.x + screen.x / 2);
    out.y = -(screen.y / 2 * m.y) + (m.y + screen.y / 2);
    return out;
}

export function getCircle3D(pos: Vector3, points: number, radius: number, screenSize: Vector2, viewProjMatrixArg: number[]) {

    const p = Math.PI * 2 / points;

    const result: [Vector2, Vector2][] = []

    for (let a = 0; a < Math.PI * 2; a += p) {
        const start = new Vector3(
            radius * Math.cos(a) + pos.x,
            radius * Math.sin(a) + pos.z,
            pos.y
        );
        const end = new Vector3(
            radius * Math.cos(a + p) + pos.x,
            radius * Math.sin(a + p) + pos.z,
            pos.y
        );
        const start2 = new Vector3(start.x, start.z, start.y);
        const end2 = new Vector3(end.x, end.z, end.y);
        const startScreen = this.worldToScreen(start2, screenSize, viewProjMatrixArg);
        const endScreen = this.worldToScreen(end2, screenSize, viewProjMatrixArg);
        result.push([startScreen, endScreen]);
    }

    return result;

}