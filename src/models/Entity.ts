import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import { readName } from "../StructureReader";
import { OFFSET } from "../consts/Offsets";
import { Vector2, Vector3 } from "./Vector";
import { factoryFromArray, worldToScreen } from "../utils/Utils";
import { Spell } from "./Spell";
import * as SAT from 'sat';

const Reader = AyayaLeague.reader;

export class Entity extends CachedClass {
    constructor(public address: number) { super() };


    get netId(): number {
        return this.use('netId', () => Reader.readProcessMemory(this.address + OFFSET.oObjNetId, "VEC3"));
    }
    get name(): string {
        return this.use('name', () => readName(this.address + OFFSET.oObjName))
    }
    get gamePos(): Vector3 {
        return this.use('gamePos', () => Vector3.fromData(Reader.readProcessMemory(this.address + OFFSET.oObjPosition, "VEC3")));
    }
    get screenPos(): Vector2 {
        return worldToScreen(this.gamePos, CachedClass.get('screen'), CachedClass.get('matrix'));
    }

    get hp(): number {
        return this.use('hp', () => Reader.readProcessMemory(this.address + OFFSET.oObjHealth, "FLOAT"));
    }
    get maxHp(): number {
        return this.use('maxHp', () => Reader.readProcessMemory(this.address + OFFSET.oObjMaxHealth, "FLOAT"));
    }
    get visible(): number {
        return this.use('visible', () => Reader.readProcessMemory(this.address + OFFSET.oObjVisible, "BOOL"));
    }
    get range(): number {
        return this.use('range', () => Reader.readProcessMemory(this.address + OFFSET.oObjAttackRange, "FLOAT"));
    }
    get team(): number {
        return this.use('team', () => Reader.readProcessMemory(this.address + OFFSET.oObjTeam, "DWORD"));
    }

    get spells(): Spell[] {
        return this.use('spells', () => {
            if (this.team != 100 && this.team != 200) return [];
            if (this.name.startsWith('PracticeTool')) return [];
            return factoryFromArray(Spell, AyayaLeague.getSpellsOf(this.address))
        });
    }

    get satHitbox() {
        return this.use('satHitbox', () => new SAT.Circle(new SAT.Vector(this.screenPos.x, this.screenPos.y), 120 / 2));
    }

}