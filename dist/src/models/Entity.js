"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const CachedClass_1 = require("./CachedClass");
const LeagueReader_1 = require("../LeagueReader");
const StructureReader_1 = require("../StructureReader");
const Offsets_1 = require("../consts/Offsets");
const Vector_1 = require("./Vector");
const ActiveSpellEntry_1 = require("./ActiveSpellEntry");
const BuffManager_1 = require("./BuffManager");
const Utils_1 = require("../utils/Utils");
const Spell_1 = require("./Spell");
const SAT = require("sat");
const AiManager_1 = require("./AiManager");
const Reader = LeagueReader_1.default.reader;
class Entity extends CachedClass_1.CachedClass {
    constructor(address) {
        super();
        this.address = address;
    }
    ;
    get netId() {
        return this.use('netId', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjNetId, "VEC3"));
    }
    get name() {
        return this.use('name', () => (0, StructureReader_1.readName)(this.address + Offsets_1.OFFSET.oObjName));
    }
    get gamePos() {
        return this.use('gamePos', () => Vector_1.Vector3.fromData(Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjPosition, "VEC3")));
    }
    get screenPos() {
        return (0, Utils_1.worldToScreen)(this.gamePos, CachedClass_1.CachedClass.get('screen'), CachedClass_1.CachedClass.get('matrix'));
    }
    get level() {
        return this.use('level', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjLevel, "DWORD"));
    }
    get ad() {
        return this.use('ad', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjAD, "FLOAT"));
    }
    get lethality() {
        return this.use('lethality', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjLethality, "FLOAT"));
    }
    get armorPenPercent() {
        return this.use('armorPenPercent', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjArmorPen, "FLOAT"));
    }
    get armor() {
        return this.use('armor', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjArmor, "FLOAT"));
    }
    get ap() {
        return this.use('ap', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjAbilityPower, "FLOAT"));
    }
    get magicPenFlat() {
        return this.use('magicPenFlat', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjMagicPen, "FLOAT"));
    }
    get magicPenPercent() {
        return this.use('magicPenPercent', () => (1 - Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjMagicPenMulti, "FLOAT")) * 100);
    }
    get magicResistTotal() {
        return this.use('magicResistTotal', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjMagicRes, "FLOAT"));
    }
    get magicResistBonus() {
        return this.use('magicResistBonus', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjBonusMagicRes, "FLOAT"));
    }
    get hp() {
        return this.use('hp', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjHealth, "FLOAT"));
    }
    get maxHp() {
        return this.use('maxHp', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjMaxHealth, "FLOAT"));
    }
    get mana() {
        return this.use('mana', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjMana, "FLOAT"));
    }
    get maxMana() {
        return this.use('maxMana', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjMaxMana, "FLOAT"));
    }
    get movSpeed() {
        return this.use('movSpeed', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjMovSpeed, "FLOAT"));
    }
    get visible() {
        return this.use('visible', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjVisible, "BOOL"));
    }
    get invulnerable() {
        return this.use('invulnerable', () => !Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjVulnerable, "BOOL"));
    }
    get targetable() {
        return this.use('targetable', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjTargetable, "BOOL"));
    }
    get range() {
        return this.use('range', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjAttackRange, "FLOAT"));
    }
    get team() {
        return this.use('team', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjTeam, "DWORD"));
    }
    get dead() {
        return this.use('dead', () => {
            // const t = Reader.readProcessMemory(this.address + 0x20C, "DWORD");
            // const x1 = Reader.readProcessMemory(t + 0x20C, "DWORD");
            // const x2 = t + 0x1D8;
            // let x4 = Reader.readProcessMemory(x1 + x2 + 2, "DWORD");
            // const x5 = Reader.readProcessMemory(x2 + 5, "DWORD");
            // x4 ^= ~(x5 ^ xorKey);
            // x4 ^= x5 ^ 0xA0;
            // return x4;
            return this.hp <= 0 || (this.mana <= 0 && this.maxMana > 0);
        });
    }
    get spells() {
        return this.use('spells', () => {
            if (this.team != 100 && this.team != 200)
                return [];
            if (this.name.startsWith('PracticeTool'))
                return [];
            return (0, Utils_1.factoryFromArray)(Spell_1.Spell, LeagueReader_1.default.getSpellsOf(this.address));
        });
    }
    get activeSpellEntry() {
        return this.use('activeSpellEntry', () => new ActiveSpellEntry_1.ActiveSpellEntry(Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oSpellBook + Offsets_1.OFFSET.oSpellBookActiveSpellEntry, "DWORD")));
    }
    get buffManager() {
        return this.use('buffManager', () => new BuffManager_1.BuffManager(this.address + Offsets_1.OFFSET.oBuffManager));
    }
    get AiManager() {
        return this.use('AiManager', () => {
            const v1 = Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oObjAiManager, "BYTE");
            const v2 = this.address + Offsets_1.OFFSET.oObjAiManager - 8;
            const v3 = Reader.readProcessMemory(v2 + 4, "DWORD");
            let v4 = Reader.readProcessMemory(v2 + (4 * v1 + 12), "DWORD");
            v4 = v4 ^ ~v3;
            const aiManagerAddress = Reader.readProcessMemory(v4 + 0x8, "DWORD");
            return new AiManager_1.AiManager(aiManagerAddress);
        });
    }
    get attackDelay() {
        return 1000 / CachedClass_1.CachedClass.get('webapi_me').championStats.attackSpeed;
    }
    get windupTime() {
        const windupPercent = 100 / (0, Utils_1.getChampionWindup)(this.name);
        const baseAttackSpeed = (0, Utils_1.getChampionBaseAttackSpeed)(this.name);
        const bWindupTime = 1 / baseAttackSpeed * windupPercent;
        const totalAttackSpeed = CachedClass_1.CachedClass.get('webapi_me').championStats.attackSpeed;
        const cAttackTime = 1 / totalAttackSpeed;
        const windupModifier = (0, Utils_1.getChampionWindupMod)(this.name) == 0 ? 0 : 100 / (0, Utils_1.getChampionWindupMod)(this.name);
        const result = bWindupTime + ((cAttackTime * windupPercent) - bWindupTime) * windupModifier;
        return (1 / totalAttackSpeed * 1000) * result / 20;
    }
    get baseDrawingOffset() {
        return this.use('baseDrawingPos', () => {
            const v4 = Reader.readProcessMemory(this.address + 0x2ED1, "BYTE");
            const vTmp = Reader.readProcessMemory((this.address + 0x2ED8), "BYTE");
            let v5 = Reader.readProcessMemory(this.address + (0x4 * vTmp) + 0x2EDC, "DWORD");
            const vTmp2 = Reader.readProcessMemory(this.address + 0x2ED4, "DWORD");
            v5 ^= ~vTmp2;
            const o1 = Reader.readProcessMemory(v5 + 0x10, "DWORD");
            const o2 = Reader.readProcessMemory(o1 + 0x4, "DWORD");
            const o3 = Reader.readProcessMemory(o2 + 0x1C, "DWORD");
            const height = Reader.readProcessMemory(o3 + 0x88, "FLOAT");
            return height;
        });
    }
    get boundingBox() {
        return this.use('boundingBox', () => (0, Utils_1.getChampionRadius)(this.name));
    }
    get satHitbox() {
        return this.use('satHitbox', () => new SAT.Circle(new SAT.Vector(this.screenPos.x, this.screenPos.y), 60));
    }
}
exports.Entity = Entity;
