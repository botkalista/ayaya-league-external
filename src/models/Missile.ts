import AyayaLeague from '../LeagueReader';
import { OFFSET } from "../consts/Offsets";
import { Vector2, Vector3 } from "./Vector";
import { worldToScreen } from "../utils/Utils";
import { CachedClass } from './CachedClass';
import * as SAT from 'sat';
import { Spell } from './Spell';
import { readName } from '../StructureReader';

const Reader = AyayaLeague.reader;

export class Missile extends CachedClass {
    constructor(public address: number) { super() };

    private get entry(): number {
        return this.use('entry', () => Reader.readProcessMemory(this.address + OFFSET.oMissileObjectEntry, "DWORD"));
    }
    get gameStartPos(): Vector3 {
        return this.use('gStartPos', () => Reader.readProcessMemory(this.entry + OFFSET.oMissileStartPos, "VEC3"));
    }
    get gameEndPos(): Vector3 {
        return this.use('gEndPos', () => Reader.readProcessMemory(this.entry + OFFSET.oMissileEndPos, "VEC3"));
    }
    get screenStartPos(): Vector2 {
        return this.use('sStartPos', () => worldToScreen(this.gameStartPos, CachedClass.get('screen'), CachedClass.get('matrix')));

    }
    get screenEndPos(): Vector2 {
        return this.use('sEndPos', () => worldToScreen(this.gameEndPos, CachedClass.get('screen'), CachedClass.get('matrix')));
    }

    get isBasicAttack(): boolean {
        return this.use('isBasic', () => (this.spellName.includes('BasicAttack') && !this.spellName.includes('Turret')));
    }

    get isTurretAttack(): boolean {
        return this.use('isTurret', () => (this.spellName.includes('BasicAttack') && this.spellName.includes('Turret')));
    }

    get isMinionAttack(): boolean {
        return this.use('isMinion', () => (this.spellName.includes('SRU')));
    }

    get name(): string {
        return this.use('name', () => {
            const name = Reader.readProcessMemory(this.entry + OFFSET.oObjName, "DWORD");
            const missileName = readName(name);
            return missileName;
        });
    }

    get spellName(): string {
        return this.use('spellName', () => {
            const sInfo = Reader.readProcessMemory(this.entry + OFFSET.oMissileSpellInfo, "DWORD");
            const sData = Reader.readProcessMemory(sInfo + OFFSET.oSpellInfoData, "DWORD");
            const spellNameAddress = Reader.readProcessMemory(sData + OFFSET.oSpellInfoDataName, "DWORD");
            const spellName = readName(spellNameAddress, true);
            return spellName;
        });
    }

    get satHitbox() {
        return this.use('satHitbox', () => {
            const length = Math.hypot(this.screenEndPos.x - this.screenStartPos.x, this.screenEndPos.y - this.screenStartPos.y);
            const width = 200;
            const angle = Math.atan2(this.screenEndPos.y - this.screenStartPos.y, this.screenEndPos.x - this.screenStartPos.x)
            const hitbox = new SAT.Box(new SAT.Vector(this.screenStartPos.x, this.screenStartPos.y), length, width).toPolygon();
            hitbox.setAngle(angle);
            hitbox.setOffset(new SAT.Vector(0, -width / 2));
            return hitbox;
        });
    }
}