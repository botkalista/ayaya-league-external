"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spell = void 0;
const CachedClass_1 = require("./CachedClass");
const LeagueReader_1 = require("..//LeagueReader");
const StructureReader_1 = require("../StructureReader");
const Offsets_1 = require("../consts/Offsets");
const Reader = LeagueReader_1.default.reader;
class Spell extends CachedClass_1.CachedClass {
    constructor(address) {
        super();
        this.address = address;
    }
    ;
    get spellbook() {
        return this.use('spellbook', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oSpellSlots, "DWORD"));
    }
    get info() {
        return this.use('info', () => Reader.readProcessMemory(this.spellbook + Offsets_1.OFFSET.oSpellInfo, "DWORD"));
    }
    get data() {
        return this.use('data', () => Reader.readProcessMemory(this.info + Offsets_1.OFFSET.oSpellInfoData, "DWORD"));
    }
    get name() {
        return this.use('name', () => {
            const sNamePtr = Reader.readProcessMemory(this.data + Offsets_1.OFFSET.oSpellInfoDataName, "DWORD");
            return (0, StructureReader_1.readName)(sNamePtr, true);
        });
    }
    get infoName() {
        return this.use('infoName', () => Reader.readProcessMemory(this.info + Offsets_1.OFFSET.oSpellInfoName, "STR"));
    }
    get readyAt() {
        return this.use('readyAt', () => Reader.readProcessMemory(this.spellbook + Offsets_1.OFFSET.oSpellReadyAt, "FLOAT"));
    }
    get level() {
        return this.use('level', () => Reader.readProcessMemory(this.spellbook + Offsets_1.OFFSET.oSpellLevel, 'DWORD'));
    }
    get ready() {
        return this.readyIn <= 0;
    }
    get readyIn() {
        const cd = this.readyAt - CachedClass_1.CachedClass.get('gameTime');
        return cd > 0 ? cd : 0;
    }
}
exports.Spell = Spell;
