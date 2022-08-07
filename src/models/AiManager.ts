import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import { OFFSET } from "../consts/Offsets";


const Reader = AyayaLeague.reader;


export class AiManager extends CachedClass {
    constructor(public address: number) { super() }
    get startPath() {
        return this.use('startPath', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerStartPath, "POS3"));
    }
    get endPath() {
        return this.use('endPath', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerEndPath, "POS3"));
    }
    get isDashing() {
        return this.use('isDashing', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerIsDashing, "BOOL"));
    }
    get isMoving() {
        return this.use('isMoving', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerIsMoving, "BOOL"));
    }
    get dashSpeed() {
        return this.use('dashSpeed', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerDashSpeed, "DWORD"));
    }
    // get currentSegment() {
    //     return this.use('currentSegment', () => Reader.readProcessMemory(this.address + OFFSET.oAiManagerCurrentSegment, "DWORD"));
    // }
}