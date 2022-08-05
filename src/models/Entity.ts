import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import { readName } from "../StructureReader";
import { OFFSET } from "../consts/Offsets";
import { Vector2, Vector3 } from "./Vector";
import { factoryFromArray, worldToScreen } from "../utils/Utils";
import { Spell } from "./Spell";

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
        return this.use('gamePos', () => Reader.readProcessMemory(this.address + OFFSET.oObjPosition, "VEC3"));
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
        return this.use('range', () => Reader.readProcessMemory(this.address + OFFSET.oObjAttackRange, "DWORD"));
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

}