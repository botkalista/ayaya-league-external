"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSpellEntry = void 0;
const CachedClass_1 = require("./CachedClass");
const LeagueReader_1 = require("../LeagueReader");
const Offsets_1 = require("../consts/Offsets");
const Vector_1 = require("./Vector");
const Reader = LeagueReader_1.default.reader;
class ActiveSpellEntry extends CachedClass_1.CachedClass {
    constructor(address) {
        super();
        this.address = address;
    }
    get isBasic() {
        return this.use("isBasic", () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oActiveSpellEntryIsBasic, "BOOL"));
    }
    get startPos() {
        return this.use("startPos", () => Vector_1.Vector3.fromData(Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oActiveSpellEntryStartPos, "VEC3")));
    }
    get endPos() {
        return this.use("endPos", () => Vector_1.Vector3.fromData(Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oActiveSpellEntryEndPos, "VEC3")));
    }
}
exports.ActiveSpellEntry = ActiveSpellEntry;
