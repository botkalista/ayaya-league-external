
import { OFFSET } from './consts/Offsets';
import Reader from './MemoryReader';
import { Entity } from './models/Entity';
import { Spell } from './models/Spell';
import * as math from 'mathjs';


type EntityKey = keyof Entity;
type EntityKeys = (EntityKey)[];


export type EntityReadOptions = Partial<{ onlyProps: EntityKeys, skipProps: EntityKeys }>;

export function readName(address: number, forceFirstAddress: boolean = false): string {
    const length = Reader.readProcessMemory(address + 0x10, 'DWORD');
    if ((length < 15 && length > 0) || forceFirstAddress) return Reader.readProcessMemory(address, 'STR');
    const nameAddress = Reader.readProcessMemory(address, 'DWORD');
    const name = Reader.readProcessMemory(nameAddress, 'STR');
    return name;
}
export function readSpell(address: number): Spell {
    const spell = new Spell();
    const sAddress = Reader.readProcessMemory(address + OFFSET.oSpellBook, "DWORD");
    spell.readyAt = Reader.readProcessMemory(sAddress + OFFSET.oSpellReadyAt, "FLOAT");
    spell.level = Reader.readProcessMemory(sAddress + OFFSET.oSpellLevel, 'DWORD');
    const sInfo = Reader.readProcessMemory(sAddress + OFFSET.oSpellInfo, "DWORD");
    const sData = Reader.readProcessMemory(sInfo + OFFSET.oSpellInfoData, "DWORD");
    const sNamePtr = Reader.readProcessMemory(sData + OFFSET.oSpellInfoDataName, "DWORD");
    spell.name = readName(sNamePtr, true);
    return spell;
}
export function readEntity(address: number, opts?: EntityReadOptions): Entity | undefined {

    const entity = new Entity();

    function hasToRead(prop: EntityKey) {
        if (!opts) return true;
        if (opts.onlyProps && opts.onlyProps.includes(prop)) return true;
        if (opts.skipProps && opts.skipProps.includes(prop)) return false;
        if (opts.onlyProps) return false;
        if (opts.skipProps) return true;
    }

    if (hasToRead("address")) entity.address = Reader.toHex(address);

    if (hasToRead("name")) entity.name = readName(address + OFFSET.oObjName);

    const netId = Reader.readProcessMemory(address + OFFSET.oObjNetId, "DWORD");
    if (netId - 0x40000000 > 0x100000) return;
    if (hasToRead("netId")) entity.netId = netId;

    if (hasToRead("pos")) entity.pos = Reader.readProcessMemory(address + OFFSET.oObjPosition, "VEC3");
    if (hasToRead("hp")) entity.hp = Reader.readProcessMemory(address + OFFSET.oObjHealth, "FLOAT");
    if (hasToRead("maxHp")) entity.maxHp = Reader.readProcessMemory(address + OFFSET.oObjMaxHealth, "FLOAT");
    if (hasToRead("visible")) entity.visible = Reader.readProcessMemory(address + OFFSET.oObjVisible, 'BOOL');
    if (hasToRead("range")) entity.range = Reader.readProcessMemory(address + OFFSET.oObjAttackRange, 'FLOAT');
    if (hasToRead("team")) entity.team = Reader.readProcessMemory(address + OFFSET.oObjTeam, "DWORD");

    if (hasToRead("spells")) {
        if (entity.team == 100 || entity.team == 200) {
            entity.spells = [];
            for (let i = 0; i < 6; i++) {
                entity.spells.push(readSpell(address + (i * 4)));
            }
        }
    }

    return entity;
}
export function readMatrix(address: number): math.Matrix {
    const buffer = Reader.readProcessMemoryBuffer(address, 64, true);

    const matrix = math.matrix([
        [
            buffer.readFloatLE(0 * 4), buffer.readFloatLE(1 * 4),
            buffer.readFloatLE(2 * 4), buffer.readFloatLE(3 * 4)
        ],
        [
            buffer.readFloatLE(4 * 4), buffer.readFloatLE(5 * 4),
            buffer.readFloatLE(6 * 4), buffer.readFloatLE(7 * 4)
        ],
        [
            buffer.readFloatLE(8 * 4), buffer.readFloatLE(9 * 4),
            buffer.readFloatLE(10 * 4), buffer.readFloatLE(11 * 4)
        ],
        [
            buffer.readFloatLE(12 * 4), buffer.readFloatLE(13 * 4),
            buffer.readFloatLE(14 * 4), buffer.readFloatLE(15 * 4)
        ]
    ]);
    return matrix;
}
export function readVTable(address: number): number[] {
    const result: number[] = [];
    const list = Reader.readProcessMemory(address + 0x4, "DWORD");
    const size = Reader.readProcessMemory(address + 0x8, "DWORD");
    for (let i = 0; i < size; i++) {
        result.push(Reader.readProcessMemory(list + (i * 0x4), "DWORD"));
    }
    return result;

}