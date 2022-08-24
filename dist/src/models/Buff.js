"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buff = void 0;
const CachedClass_1 = require("./CachedClass");
const LeagueReader_1 = require("../LeagueReader");
const Offsets_1 = require("../consts/Offsets");
const StructureReader_1 = require("../StructureReader");
const Reader = LeagueReader_1.default.reader;
class Buff extends CachedClass_1.CachedClass {
    constructor(address) {
        super();
        this.address = address;
    }
    get entry() {
        return this.use('entry', () => Reader.readProcessMemory(this.address + 0x8, "DWORD"));
    }
    get name() {
        return this.use('name', () => (0, StructureReader_1.readName)(this.entry + Offsets_1.OFFSET.oBuffName, true));
    }
    get startTime() {
        return this.use('startTime', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oBuffStartTime, "FLOAT"));
    }
    get endtime() {
        return this.use('endtime', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oBuffEndTime, "FLOAT"));
    }
    get count() {
        return this.use('count', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oBuffCount, "DWORD"));
    }
    get count2() {
        return this.use('count2', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oBuffCount2, "DWORD"));
    }
}
exports.Buff = Buff;
