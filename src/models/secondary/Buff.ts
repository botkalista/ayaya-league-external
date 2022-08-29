
import { CachedClass } from "../../components/CachedClass";
import { DataType } from "../../components/winapi/typings/enums/DataType";

import League from "../../components/League";
import Offsets from "../../components/Offsets";
import { readName } from "../../components/StructureReader";

export class Buff extends CachedClass {


    constructor(public address: number) { super(); }

    private get entry(): number {
        return this.use('entry', () => League.read(this.address + 0x8, DataType.DWORD))
    }

    get type(): number {
        return this.use('type', () => League.read(this.address + Offsets.oBuffType, DataType.BYTE));
    }

    get name(): string {
        return this.use('name', () => readName(this.entry + Offsets.oBuffName, true));
    }

    get startTime(): number {
        return this.use('startTime', () => League.read(this.address + Offsets.oBuffStartTime, DataType.FLOAT));
    }

    get endtime(): number {
        return this.use('endtime', () => League.read(this.address + Offsets.oBuffEndTime, DataType.FLOAT));
    }

    get count(): number {
        return this.use('count', () => League.read(this.address + Offsets.oBuffCount, DataType.DWORD));
    }
    get count2(): number {
        return this.use('count2', () => League.read(this.address + Offsets.oBuffCount2, DataType.DWORD));
    }

}