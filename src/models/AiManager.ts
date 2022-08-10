import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import { OFFSET } from "../consts/Offsets";
import { Vector3 } from "./Vector";


const Reader = AyayaLeague.reader;


export class AiManager extends CachedClass {
    constructor(public address: number) { super() }
    get startPath(): Vector3 {
        return this.use('startPath', () => Vector3.fromData(Reader.readProcessMemory(this.address + OFFSET.oAiManagerStartPath, "VEC3")));
    }
    get endPath(): Vector3 {
        return this.use('endPath', () => Vector3.fromData(Reader.readProcessMemory(this.address + OFFSET.oAiManagerEndPath, "VEC3")));
    }
    get isDashing(): boolean {
        return this.use('isDashing', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerIsDashing, "BOOL"));
    }
    get isMoving(): boolean {
        return this.use('isMoving', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerIsMoving, "BOOL"));
    }
    get dashSpeed(): boolean {
        return this.use('dashSpeed', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerDashSpeed, "DWORD"));
    }
    // get currentSegment() {
    //     return this.use('currentSegment', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerCurrentSegment, "DWORD"));
    // }
}