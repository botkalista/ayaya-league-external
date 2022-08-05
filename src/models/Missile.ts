import AyayaLeague from '../LeagueReader';
import { OFFSET } from "../consts/Offsets";
import { Vector2, Vector3 } from "./Vector";
import { worldToScreen } from "../utils/Utils";
import { CachedClass } from './CachedClass';
import * as SAT from 'sat';

const Reader = AyayaLeague.reader;

export class Missile extends CachedClass {
    constructor(public address: number) { super() };
    private get entry(): number {
        return this.use('entry', () => Reader.readProcessMemory(this.address + OFFSET.oMissileObjectEntry, "DWORD"));
    }
    get gameStartPos(): Vector3 {
        return this.use('startPos', () => Reader.readProcessMemory(this.entry + OFFSET.oMissileStartPos, "VEC3"));
    }
    get gameEndPos(): Vector3 {
        return this.use('endPos', () => Reader.readProcessMemory(this.entry + OFFSET.oMissileEndPos, "VEC3"));
    }
    get screenStartPos(): Vector2 {
        return worldToScreen(this.gameStartPos, CachedClass.get('screen'), CachedClass.get('matrix'));
    }
    get screenEndPos(): Vector2 {
        return worldToScreen(this.gameEndPos, CachedClass.get('screen'), CachedClass.get('matrix'));
    }

    get satHitbox() {
        return this.use('satHitbox', () => {
            const length = Math.hypot(this.screenEndPos.x - this.screenStartPos.x, this.screenEndPos.y - this.screenStartPos.y);
            const width = 120;
            return new SAT.Box(new SAT.Vector(this.screenStartPos.x, this.screenStartPos.y), length, width).toPolygon();
        });
    }
}