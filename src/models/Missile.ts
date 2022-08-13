import AyayaLeague from '../LeagueReader';
import { OFFSET } from "../consts/Offsets";
import { Vector2, Vector3 } from "./Vector";
import { worldToScreen } from "../utils/Utils";
import { CachedClass } from './CachedClass';
import * as SAT from 'sat';
import { Missiles } from '../consts/Missiles';
import { readName } from '../StructureReader';

const Reader = AyayaLeague.reader;

export class Missile extends CachedClass {
    constructor(public address: number) { super() };

    private get entry(): number {
        return this.use('entry', () => Reader.readProcessMemory(this.address + OFFSET.oMissileObjectEntry, "DWORD"));
    }
    get team(): number {
        return this.use('team', () => Reader.readProcessMemory(this.entry + OFFSET.oObjTeam, "DWORD"));
    }
    get gameStartPos(): Vector3 {
        return this.use('gStartPos', () => Vector3.fromData(Reader.readProcessMemory(this.entry + OFFSET.oMissileStartPos, "VEC3")));
    }
    get gameEndPos(): Vector3 {
        return this.use('gEndPos', () => Vector3.fromData(Reader.readProcessMemory(this.entry + OFFSET.oMissileEndPos, "VEC3")));
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

    private get missileInfo() {
        return this.use('missileInfo', () => Missiles[this.spellName] || {});
    }

    get width(): number {
        return this.use('info.width', () => this.missileInfo.width);
    }

    get height(): number {
        return this.use('info.height', () => this.missileInfo.height);
    }

    get speed(): number {
        return this.use('info.speed', () => this.missileInfo.speed);
    }

    get delay(): number {
        return this.use('info.delay', () => this.missileInfo.delay);
    }

    get castRadius(): number {
        return this.use('info.castRadius', () => this.missileInfo.castRadius);
    }

    get castRange(): number {
        return this.use('info.castRange', () => this.missileInfo.castRange);
    }

    get flags(): number {
        return this.use('info.flags', () => this.missileInfo.flags);
    }

    get champName(): number {
        return this.use('info.champName', () => this.missileInfo.championName);
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
            const length = this.castRange || Math.hypot(this.screenEndPos.x - this.screenStartPos.x, this.screenEndPos.y - this.screenStartPos.y);
            const width = this.width || 80;
            const angle = Math.atan2(this.screenEndPos.y - this.screenStartPos.y, this.screenEndPos.x - this.screenStartPos.x)
            const hitbox = new SAT.Box(new SAT.Vector(this.screenStartPos.x, this.screenStartPos.y), length, width).toPolygon();
            hitbox.setAngle(angle);
            hitbox.setOffset(new SAT.Vector(0, -width / 2));
            return hitbox;
        });
    }
}