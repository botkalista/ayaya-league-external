
import { Vector2, Vector3, Vector4 } from "../Vector";

import { Polygon, Vector, testCirclePolygon } from 'sat';
import { Entity } from "../primary/Entity";

import Manager from './Manager';


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
    const out = Vector2.zero;
    const screen = screenSize.copy();
    const clipCoords = Vector4.zero;
    clipCoords.x = pos.x * viewProjMatrix[0] + pos.y * viewProjMatrix[4] + pos.z * viewProjMatrix[8] + viewProjMatrix[12];
    clipCoords.y = pos.x * viewProjMatrix[1] + pos.y * viewProjMatrix[5] + pos.z * viewProjMatrix[9] + viewProjMatrix[13];
    clipCoords.z = pos.x * viewProjMatrix[2] + pos.y * viewProjMatrix[6] + pos.z * viewProjMatrix[10] + viewProjMatrix[14];
    clipCoords.w = pos.x * viewProjMatrix[3] + pos.y * viewProjMatrix[7] + pos.z * viewProjMatrix[11] + viewProjMatrix[15];
    if (clipCoords.w < 1.0) clipCoords.w = 1;
    const m = Vector3.zero;
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
        const startScreen = worldToScreen(start2, screenSize, viewProjMatrixArg);
        const endScreen = worldToScreen(end2, screenSize, viewProjMatrixArg);
        result.push([startScreen, endScreen]);
    }

    return result;

}


//*  ------ Testing ------

export function hasEnemyOnPath(source: Entity, target: Entity) {
    const line = new Polygon(new Vector(source.screenPos.x, source.screenPos.y), [new Vector(target.screenPos.x, source.screenPos.y)]);
    const entities: Entity[] = []
    entities.push(...Manager.champions.enemies);
    entities.push(...Manager.minions.enemies);
    entities.push(...Manager.monsters);
    return entities.filter(e => testCirclePolygon(e.satHitbox, line));
}



//*  ------ Damage calculation ------

export function calculateDamage(source: Entity, target: Entity, physicDmg: number = 0, magicDmg: number = 0, trueDmg: number = 0) {
    const resultPhysic = calculatePhysicalDamage(source, target, physicDmg);
    const resultMagic = calculateMagicDamage(source, target, magicDmg);
    const resultTrue = trueDmg;
    return resultPhysic + resultMagic + resultTrue

}
export function calculatePhysicalDamage(source: Entity, target: Entity, damage: number) {
    const A = target.armor;
    const B = source.lethality;
    const C = source.armorPenPercent;

    const flatArmorPen = B * (0.6 + (0.4 * source.level / 18));

    let def = A - flatArmorPen;
    def = def / 100 * (100 - C);

    if (def < 0) return damage * (2 - (100 / (100 - def)));

    return damage * (100 / (100 + def));
}
export function calculateMagicDamage(source: Entity, target: Entity, damage: number) {
    const A = target.magicResist;
    const B = source.magicPenFlat;
    const C = source.magicPenPercent;

    let def = A - B;

    def = def / 100 * (100 - C);

    if (def < 0) return damage * (2 - (100 / (100 - def)));

    return damage * (100 / (100 + def));
}


//*  ------ Things in range ------

type OptionsInRange = { includeClones: boolean, includeDead: boolean }

export function enemyChampsInRange(range: number, options: OptionsInRange = { includeClones: true, includeDead: false }) {
    return genericInRange(Manager.champions.enemies, range, options);
}
export function genericInRange(list: Entity[], range: number, options: OptionsInRange = { includeClones: true, includeDead: false }) {
    const me = Manager.me;
    return list.filter(e => {
        const deadCheck = options.includeDead ? true : !e.dead;
        const cloneCheck = options.includeClones ? true : e.level > 0;
        return deadCheck && cloneCheck && e.visible && e.gamePos.dist(me.gamePos) < ((range + e.boundingBox + me.boundingBox))
    });
}
export function lowestHealthEnemyChampInRange(range: number, options: OptionsInRange = { includeClones: true, includeDead: false }) {
    return enemyChampsInRange(range, options).sort((a, b) => a.hp - b.hp)[0];
}
export function lowestHealthGenericInRange(list: Entity[], range: number, options: OptionsInRange = { includeClones: true, includeDead: false }) {
    return genericInRange(list, range, options).sort((a, b) => a.hp - b.hp)[0];
}



export function getHealthBarPosition(target: Entity) {
    const screen = Manager.__internal.screen;
    const xFromCenter = (screen.x / 2) - target.screenPos.x;
    const yFromCenter = (screen.y / 2) - target.screenPos.y;
    const pos = target.screenPos.copy();
    pos.y -= target.baseDrawingOffset;
    pos.y -= 30;
    pos.y -= (yFromCenter * 0.02);
    pos.x -= 50;
    pos.x -= (xFromCenter * 0.035);
    return pos;
}

export function predictPosition(target: Entity, castTime: number) {
    if (target.AiManager.startPath.x == target.AiManager.endPath.x && target.AiManager.startPath.y == target.AiManager.endPath.y) {
        return target.gamePos;
    }
    const dQ = target.AiManager.endPath.sub(target.gamePos).normalize();
    const dQ_travel = target.movSpeed * castTime;
    const tmp = dQ.mul(new Vector3(dQ_travel, dQ_travel, dQ_travel));
    const qPredicted_pos = target.gamePos.add(tmp);
    return qPredicted_pos;
}
