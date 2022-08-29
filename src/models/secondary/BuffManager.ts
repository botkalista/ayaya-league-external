import { CachedClass } from "../../components/CachedClass";

import League from "../../components/League";
import Offsets from "../../components/Offsets";
import { DataType } from "../../components/winapi/typings/enums/DataType";
import { Buff } from "./Buff";

export class BuffManager extends CachedClass {


    constructor(public address: number) { super(); }

    get buffs() {
        return this.use('buffs', () => {
            const buffsSize = League.read<number>(this.address + Offsets.oBuffArrayLength, DataType.DWORD);
            const buffsArray = League.read<number>(this.address + Offsets.oBuffArray, DataType.DWORD);
            const result: Buff[] = [];
            for (let i = 0; i < 150; i++) {
                const buffAddress = League.read<number>(buffsArray + (i * Offsets.oBuffSize), DataType.DWORD);
                // if (buffAddress > buffsSize) break;
                const buff = new Buff(buffAddress);
                if (buff.count > 1000) break;
                result.push(buff);
            }
            return result;
        });
    }

    byName(name: string): Buff | undefined {
        const buffs = this.buffs
            .filter(e => e.name == name)
            .sort((a, b) => b.count - a.count);

        return (buffs.length > 0) ? buffs[0] : undefined;

    }

    has(name: string): boolean {
        const buff = this.byName(name);
        if (!buff) return false;
        return buff.count > 0;
    }


}