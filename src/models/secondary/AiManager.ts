
import { CachedClass } from '../../components/CachedClass';

import Offsets from '../../components/Offsets';
import League from '../../components/League';
import { Vector3 } from '../Vector';
import { DataType } from '../../components/winapi/typings/enums/DataType';


export class AiManager extends CachedClass {
    constructor(public address: number) { super() }

    get startPath(): Vector3 {
        return this.use('startPath', () => Vector3.fromData(League.read(this.address + Offsets.oAiManagerStartPath, DataType.VEC3)));
    }
    get endPath(): Vector3 {
        return this.use('endPath', () => Vector3.fromData(League.read(this.address + Offsets.oAiManagerEndPath, DataType.VEC3)));
    }
    get isDashing(): boolean {
        return this.use('isDashing', () => League.read(this.address + Offsets.oAiManagerIsDashing, DataType.BOOL));
    }
    get isMoving(): boolean {
        return this.use('isMoving', () => League.read(this.address + Offsets.oAiManagerIsMoving, DataType.BOOL));
    }
    get dashSpeed(): boolean {
        return this.use('dashSpeed', () => League.read(this.address + Offsets.oAiManagerDashSpeed, DataType.DWORD));
    }

    // get currentSegment() {
    //     return this.use('currentSegment', () => Reader.readProcessMemory(this.address + Offsets.oAiManagerCurrentSegment, DataType.DWORD));
    // }
}