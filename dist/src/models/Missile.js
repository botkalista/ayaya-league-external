"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Missile = void 0;
const LeagueReader_1 = require("../LeagueReader");
const Offsets_1 = require("../consts/Offsets");
const Vector_1 = require("./Vector");
const Utils_1 = require("../utils/Utils");
const CachedClass_1 = require("./CachedClass");
const SAT = require("sat");
const Missiles_1 = require("../consts/Missiles");
const StructureReader_1 = require("../StructureReader");
const Reader = LeagueReader_1.default.reader;
class Missile extends CachedClass_1.CachedClass {
    constructor(address) {
        super();
        this.address = address;
    }
    ;
    get entry() {
        return this.use('entry', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oMissileObjectEntry, "DWORD"));
    }
    get team() {
        return this.use('team', () => Reader.readProcessMemory(this.entry + Offsets_1.OFFSET.oObjTeam, "DWORD"));
    }
    get gameStartPos() {
        return this.use('gStartPos', () => Vector_1.Vector3.fromData(Reader.readProcessMemory(this.entry + Offsets_1.OFFSET.oMissileStartPos, "VEC3")));
    }
    get gameEndPos() {
        return this.use('gEndPos', () => Vector_1.Vector3.fromData(Reader.readProcessMemory(this.entry + Offsets_1.OFFSET.oMissileEndPos, "VEC3")));
    }
    get screenStartPos() {
        return this.use('sStartPos', () => (0, Utils_1.worldToScreen)(this.gameStartPos, CachedClass_1.CachedClass.get('screen'), CachedClass_1.CachedClass.get('matrix')));
    }
    get screenEndPos() {
        return this.use('sEndPos', () => (0, Utils_1.worldToScreen)(this.gameEndPos, CachedClass_1.CachedClass.get('screen'), CachedClass_1.CachedClass.get('matrix')));
    }
    get isBasicAttack() {
        return this.use('isBasic', () => (this.spellName.includes('BasicAttack') && !this.spellName.includes('Turret')));
    }
    get isTurretAttack() {
        return this.use('isTurret', () => (this.spellName.includes('BasicAttack') && this.spellName.includes('Turret')));
    }
    get isMinionAttack() {
        return this.use('isMinion', () => (this.spellName.includes('SRU')));
    }
    get missileInfo() {
        return this.use('missileInfo', () => Missiles_1.Missiles[this.spellName] || {});
    }
    get width() {
        return this.use('info.width', () => this.missileInfo.width);
    }
    get height() {
        return this.use('info.height', () => this.missileInfo.height);
    }
    get speed() {
        return this.use('info.speed', () => this.missileInfo.speed);
    }
    get delay() {
        return this.use('info.delay', () => this.missileInfo.delay);
    }
    get castRadius() {
        return this.use('info.castRadius', () => this.missileInfo.castRadius);
    }
    get castRange() {
        return this.use('info.castRange', () => this.missileInfo.castRange);
    }
    get flags() {
        return this.use('info.flags', () => this.missileInfo.flags);
    }
    get champName() {
        return this.use('info.champName', () => this.missileInfo.championName);
    }
    get spellName() {
        return this.use('spellName', () => {
            const sInfo = Reader.readProcessMemory(this.entry + Offsets_1.OFFSET.oMissileSpellInfo, "DWORD");
            const sData = Reader.readProcessMemory(sInfo + Offsets_1.OFFSET.oSpellInfoData, "DWORD");
            const spellNameAddress = Reader.readProcessMemory(sData + Offsets_1.OFFSET.oSpellInfoDataName, "DWORD");
            const spellName = (0, StructureReader_1.readName)(spellNameAddress, true);
            return spellName;
        });
    }
    get satHitbox() {
        return this.use('satHitbox', () => {
            const length = this.castRange || Math.hypot(this.screenEndPos.x - this.screenStartPos.x, this.screenEndPos.y - this.screenStartPos.y);
            const width = this.width || 80;
            const angle = Math.atan2(this.screenEndPos.y - this.screenStartPos.y, this.screenEndPos.x - this.screenStartPos.x);
            const hitbox = new SAT.Box(new SAT.Vector(this.screenStartPos.x, this.screenStartPos.y), length, width).toPolygon();
            hitbox.setAngle(angle);
            hitbox.setOffset(new SAT.Vector(0, -width / 2));
            return hitbox;
        });
    }
}
exports.Missile = Missile;
