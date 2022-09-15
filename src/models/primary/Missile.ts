

import { CachedClass } from "../../components/CachedClass";

import * as SAT from 'sat';
import Manager from '../main/Manager';
import Offsets from '../../components/Offsets';
import League from "../../components/League";
import { DataType } from "../../components/winapi/typings/enums/DataType";
import { readMap, readName } from "../../components/StructureReader";
import { Vector2, Vector3 } from "../Vector";
import { worldToScreen } from "../main/ManagerUtils";
import { getMissile } from "../../components/consts/Missiles";

export class Missile extends CachedClass {
    constructor(public address: number) { super() };

    static readMissiles() {
        const missileManager = League.read<number>(Offsets.oMissileManager, DataType.DWORD, true);
        const rootNode = League.read<number>(missileManager + 0x4, DataType.DWORD);
        const missilesSize = League.read<number>(missileManager + 0x8, DataType.DWORD);
        if (missilesSize == 0) return [];
        const addresses = readMap(rootNode, missilesSize + 1);
        addresses.splice(0, 1);
        return addresses.map(e => new Missile(e));
    }


    private get entry(): number {
        return this.use('entry', () => League.read(this.address + Offsets.oMissileObjectEntry, DataType.DWORD));
    }
    get team(): number {
        return this.use('team', () => League.read(this.entry + Offsets.oObjTeam, DataType.DWORD));
    }
    get gameStartPos(): Vector3 {
        return this.use('gStartPos', () => Vector3.fromData(League.read(this.entry + Offsets.oMissileStartPos, DataType.VEC3)));
    }
    get gameEndPos(): Vector3 {
        return this.use('gEndPos', () => Vector3.fromData(League.read(this.entry + Offsets.oMissileEndPos, DataType.VEC3)));
    }
    get screenStartPos(): Vector2 {
        return this.use('sStartPos', () => worldToScreen(this.gameStartPos, Manager.__internal.screen, Manager.__internal.matrix));

    }
    get screenEndPos(): Vector2 {
        return this.use('sEndPos', () => worldToScreen(this.gameEndPos, Manager.__internal.screen, Manager.__internal.matrix));
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
        return this.use('missileInfo', () => getMissile(this.spellName));
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
            const sInfo = League.read<number>(this.entry + Offsets.oMissileSpellInfo, DataType.DWORD);
            const sData = League.read<number>(sInfo + Offsets.oSpellInfoData, DataType.DWORD);
            const spellNameAddress = League.read<number>(sData + Offsets.oSpellInfoDataName, DataType.DWORD);
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