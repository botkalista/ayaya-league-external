import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import { OFFSET } from "../consts/Offsets";
import { Buff } from "./Buff";

const Reader = AyayaLeague.reader;

export class BuffManager extends CachedClass {


    constructor(private address: number) { super(); }

    get buffs() {
        return this.use('buffs', () => {
            const buffsSize = Reader.readProcessMemory(this.address + OFFSET.oBuffArrayLength, "DWORD");
            const buffsArray = Reader.readProcessMemory(this.address + OFFSET.oBuffArray, "DWORD");
            const result: Buff[] = [];
            for (let i = 0; i < 150; i++) {
                const buffAddress = Reader.readProcessMemory(buffsArray + (i * OFFSET.oBuffSize), "DWORD");
                // if (buffAddress > buffsSize) break;
                const buff = new Buff(buffAddress);
                if (buff.count > 500) break;
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



}