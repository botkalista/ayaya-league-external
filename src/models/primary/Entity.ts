import type { memVector3 } from "../../components/winapi/typings/Vector";

import { CachedClass } from "../../components/CachedClass";
import { DataType } from "../../components/winapi/typings/enums/DataType";

import { Vector2, Vector3 } from "../Vector";
import { readName } from '../../components/StructureReader'
import { worldToScreen } from '../main/ManagerUtils';

import Offsets from '../../components/Offsets';
import League from '../../components/League';
import Manager from '../main/Manager';

import * as SAT from 'sat';

import { BuffManager } from '../secondary/BuffManager';

import { Spell } from "./Spell";
import { AiManager } from "../secondary/AiManager";
import { getChampionWindup } from "../../components/consts/ChampionsWindups";
import { getChampionBaseAttackSpeed } from "../../components/consts/ChampionsBaseAttackSpeed";
import { getChampionRadius } from "../../components/consts/ChampionsRadius";

export class Entity extends CachedClass {

    constructor(public address: number) { super(); }

    get netId(): number {
        return this.use('netId', () => League.read<number>(this.address + Offsets.oObjNetId, DataType.DWORD));
    }
    get name(): string {
        return this.use('name', () => readName(this.address + Offsets.oObjName))
    }
    get gamePos(): Vector3 {
        return this.use('gamePos', () => Vector3.fromData(League.read<memVector3>(this.address + Offsets.oObjPosition, DataType.VEC3)));
    }
    get screenPos(): Vector2 {
        return worldToScreen(this.gamePos, Manager.__internal.screen, Manager.__internal.matrix);
    }
    get level(): number {
        return this.use('level', () => League.read(this.address + Offsets.oObjLevel, DataType.DWORD));
    }
    get ad(): number {
        return this.use('ad', () => {
            return League.read<number>(this.address + Offsets.oObjStatBaseAd, DataType.FLOAT) +
                League.read<number>(this.address + Offsets.oObjStatBonusAd, DataType.FLOAT)
        });
    }
    get armor(): number {
        return this.use('armor', () => League.read(this.address + Offsets.oObjArmor, DataType.FLOAT));
    }
    get ap(): number {
        return this.use('ap', () => League.read(this.address + Offsets.oObjStatAp, DataType.FLOAT));
    }
    // ----- Penetrations -----
    get magicPenFlat(): number {
        return this.use('magicPenFlat', () => League.read(this.address + Offsets.oObjStatMagicPenFlat, DataType.FLOAT));
    }
    get magicPenPercent(): number {
        return this.use('magicPenPercent', () => (1 - League.read<number>(this.address + Offsets.oObjStatMagicPenPerc, DataType.FLOAT)) * 100);
    }
    get armorPenPercent(): number {
        return this.use('armorPenPercent', () => (1 - League.read<number>(this.address + Offsets.oObjStatArmorPen, DataType.FLOAT)) * 100);
    }
    get lethality(): number {
        return this.use('lethality', () => League.read(this.address + Offsets.oObjStatLethality, DataType.FLOAT));
    }

    get spawnCount(): number {
        return this.use('spawnCount', () => League.read(this.address + Offsets.oObjSpawnCount, DataType.BYTE));
    }

    get magicResist(): number {
        return this.use('magicResist', () => League.read(this.address + Offsets.oObjMagicRes, DataType.FLOAT));
    }
    get hp(): number {
        return this.use('hp', () => League.read(this.address + Offsets.oObjHealth, DataType.FLOAT));
    }
    get maxHp(): number {
        return this.use('maxHp', () => League.read(this.address + Offsets.oObjMaxHealth, DataType.FLOAT));
    }
    get mana(): number {
        return this.use('mana', () => League.read(this.address + Offsets.oObjMana, DataType.FLOAT));
    }
    get maxMana(): number {
        return this.use('maxMana', () => League.read(this.address + Offsets.oObjMaxMana, DataType.FLOAT));
    }
    get movSpeed(): number {
        return this.use('movSpeed', () => League.read(this.address + Offsets.oObjStatMovSpeed, DataType.FLOAT));
    }
    get visible(): boolean {
        return this.use('visible', () => League.read(this.address + Offsets.oObjVisible, DataType.BOOL));
    }
    get invulnerable(): boolean {
        return this.use('invulnerable', () => !League.read(this.address + Offsets.oObjVulnerable, DataType.BOOL));
    }
    get targetable(): boolean {
        return this.use('targetable', () => League.read(this.address + Offsets.oObjTargetable, DataType.BOOL));
    }
    get range(): number {
        return this.use('range', () => League.read(this.address + Offsets.oObjStatAttackRange, DataType.FLOAT));
    }
    get team(): number {
        return this.use('team', () => League.read(this.address + Offsets.oObjTeam, DataType.DWORD));
    }

    get dead(): boolean {
        return this.use('dead', () => {
            // const t = League.read(this.address + 0x20C, DataType.DWORD);
            // const x1 = League.read(t + 0x20C, DataType.DWORD);
            // const x2 = t + 0x1D8;
            // let x4 = League.read(x1 + x2 + 2, DataType.DWORD);
            // const x5 = League.read(x2 + 5, DataType.DWORD);
            // x4 ^= ~(x5 ^ xorKey);
            // x4 ^= x5 ^ 0xA0;
            // return x4;

            return this.spawnCount % 2 == 0;
            // return this.hp <= 0 || (this.mana <= 0 && this.maxMana > 0);
        });

    }

    get spells(): Spell[] {
        return this.use('spells', () => {
            if (this.team != 100 && this.team != 200) return [];
            if (this.name.startsWith('PracticeTool')) return [];
            return Spell.readSpells(this.address);
        });
    }

    get buffManager() {
        return this.use('buffManager', () => new BuffManager(this.address + Offsets.oBuffManager));
    }

    get AiManager(): AiManager {
        return this.use('AiManager', () => {
            const v1 = League.read<number>(this.address + Offsets.oObjAiManager, DataType.BYTE);
            const v2 = this.address + Offsets.oObjAiManager - 8;
            const v3 = League.read<number>(v2 + 4, DataType.DWORD);
            let v4 = League.read<number>(v2 + (4 * v1 + 12), DataType.DWORD);
            v4 = v4 ^ ~v3;
            const aiManagerAddress = League.read<number>(v4 + 0x8, DataType.DWORD);
            return new AiManager(aiManagerAddress);
        });
    }


    get attackSpeedBonus() {
        return this.use('attackSpeedBonus', () => {
            const mult = League.read<number>(this.address + Offsets.oObjAttackSpeedBonus, DataType.FLOAT);
            return mult;
        });
    }

    get attackSpeedBase() {
        return this.use('attackSpeedBase', () => {
            return getChampionBaseAttackSpeed(this.name).base;
        });
    }

    get attackSpeed() {
        return this.use('attackSpeed', () => {
            return this.attackSpeedBase * this.attackSpeedBonus;
        });
    }

    get attackDelay() {
        return 1000 / this.attackSpeed;
    }

    get windupTime() {
        const windup = getChampionWindup(this.name);
        const modParsed = parseInt(windup.modWindup);
        const modWindup = isNaN(modParsed) ? 0 : modParsed;
        const baseAttackSpeed = getChampionBaseAttackSpeed(this.name).base;

        const cAttackTime = 1 / this.attackSpeed;
        const windupPercent = parseInt(windup.windup) / 100;
        const bWindupTime = (1 / baseAttackSpeed) * windupPercent;

        const windupModifier = modWindup == 0 ? 0 : modWindup / 100;
        const result = bWindupTime + ((cAttackTime * windupPercent) - bWindupTime) * windupModifier;

        return result;
    }


    get baseDrawingOffset(): number {
        return this.use('baseDrawingPos', () => {
            const base = 0x2F01;
            const v4 = League.read<number>(this.address + 0x2ED1, DataType.BYTE);
            const vTmp = League.read<number>((this.address + (base + 0x7)), DataType.BYTE);
            let v5 = League.read<number>(this.address + (0x4 * vTmp) + (base + 0xB), DataType.DWORD);
            const vTmp2 = League.read<number>(this.address + (base + 0x3), DataType.DWORD);
            v5 ^= ~vTmp2;
            const o1 = League.read<number>(v5 + 0x10, DataType.DWORD);
            const o2 = League.read<number>(o1 + 0x4, DataType.DWORD);
            const o3 = League.read<number>(o2 + 0x1C, DataType.DWORD);
            const height = League.read<number>(o3 + 0x88, DataType.FLOAT);
            return height;
        });
    }

    get boundingBox() {
        return this.use('boundingBox', () => getChampionRadius(this.name).size);
    }

    get satHitbox() {
        return this.use('satHitbox', () => new SAT.Circle(new SAT.Vector(this.screenPos.x, this.screenPos.y), 60));
    }

}