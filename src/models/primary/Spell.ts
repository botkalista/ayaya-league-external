
import { CachedClass } from "../../components/CachedClass";

import Manager from '../main/Manager';
import Offsets from '../../components/Offsets';
import League from "../../components/League";
import { DataType } from "../../components/winapi/typings/enums/DataType";
import { readName } from "../../components/StructureReader";
import { ActiveSpellEntry } from "../secondary/ActiveSpellEntry";

export class Spell extends CachedClass {
    constructor(public address: number) { super() };

    static readSpells(address: number) {
        const result: number[] = [];
        for (let i = 0; i < 6; i++) {
            result.push(address + (i * 4));
        }
        return result.map(e => new Spell(e));
    }

    private get spellbook(): number {
        return this.use('spellbook', () => League.read(this.address + Offsets.oSpellSlots, DataType.DWORD));
    }
    private get info(): number {
        return this.use('info', () => League.read(this.spellbook + Offsets.oSpellInfo, DataType.DWORD));
    }
    private get data(): number {
        return this.use('data', () => League.read(this.info + Offsets.oSpellInfoData, DataType.DWORD));
    }

    get activeSpellEntry() {
        return this.use('activeSpellEntry', () => new ActiveSpellEntry(League.read(this.address + Offsets.oSpellBook + Offsets.oSpellBookActiveSpellEntry, DataType.DWORD)));
    }

    get name(): string {
        return this.use('name', () => {
            const sNamePtr = League.read<number>(this.data + Offsets.oSpellInfoDataName, DataType.DWORD);
            return readName(sNamePtr, true);
        });
    }

    get infoName2(): string {
        return this.use('infoName2', () => League.read(this.info + Offsets.oSpellInfoName + 0x14, DataType.STR))
    }
    get infoName(): string {
        return this.use('infoName', () => League.read(this.info + Offsets.oSpellInfoName, DataType.STR))
    }
    get infoDataName(): string {
        return this.use('infoDataName', () => League.read(this.data + Offsets.oSpellInfoDataName, DataType.STR))
    }
    get infoDataMissileName(): string {
        return this.use('infoDataMissileName', () => League.read(this.data + Offsets.oSpellInfoDataMissileName, DataType.STR))
    }


    get readyAt(): number {
        return this.use('readyAt', () => League.read(this.spellbook + Offsets.oSpellReadyAt, DataType.FLOAT));
    }
    get level(): number {
        return this.use('level', () => League.read(this.spellbook + Offsets.oSpellLevel, DataType.DWORD));
    }

    get ready(): boolean {
        return this.readyIn <= 0;
    }
    get readyIn(): number {
        const cd = this.readyAt - Manager.game.time;
        return cd > 0 ? cd : 0;
    }

}