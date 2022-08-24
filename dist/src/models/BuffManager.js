"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuffManager = void 0;
const CachedClass_1 = require("./CachedClass");
const LeagueReader_1 = require("../LeagueReader");
const Offsets_1 = require("../consts/Offsets");
const Buff_1 = require("./Buff");
const Reader = LeagueReader_1.default.reader;
class BuffManager extends CachedClass_1.CachedClass {
    constructor(address) {
        super();
        this.address = address;
    }
    get buffs() {
        return this.use('buffs', () => {
            const buffsSize = Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oBuffArrayLength, "DWORD");
            const buffsArray = Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oBuffArray, "DWORD");
            const result = [];
            for (let i = 0; i < 150; i++) {
                const buffAddress = Reader.readProcessMemory(buffsArray + (i * Offsets_1.OFFSET.oBuffSize), "DWORD");
                // if (buffAddress > buffsSize) break;
                const buff = new Buff_1.Buff(buffAddress);
                if (buff.count > 500)
                    break;
                result.push(buff);
            }
            return result;
        });
    }
    byName(name) {
        const buffs = this.buffs
            .filter(e => e.name == name)
            .sort((a, b) => b.count - a.count);
        return (buffs.length > 0) ? buffs[0] : undefined;
    }
}
exports.BuffManager = BuffManager;
