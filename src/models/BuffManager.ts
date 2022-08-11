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
            for (let i = 0; i < 100; i++) {
                const buffAddress = Reader.readProcessMemory(buffsArray + (i * OFFSET.oBuffSize), "DWORD");
                if (buffAddress >= buffsSize && i > 30) break;
                const buff = new Buff(buffAddress);
                result.push(buff);
            }
            return result;
        });
    }

    byName(name: string) {
        return this.buffs.find(e => e.name == name);
    }



}