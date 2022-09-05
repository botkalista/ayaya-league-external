
import { DataType } from "../../components/winapi/typings/enums/DataType";
import { CachedClass } from "../../components/CachedClass";

import Winapi from '../../components/winapi/Winapi';
import Offsets from '../../components/Offsets';
import League from '../../components/League';
import { Vector2 } from "../Vector";


const ALT = 0x12;
const CTRL = 0x11;


export class Game extends CachedClass {

    get time(): number {
        return this.use('time', () => League.read(Offsets.oGameTime, DataType.FLOAT, true));
    }

    get zoom() {
        return this.use('zoom', () => {
            const hudInstance = League.read<number>(Offsets.oHud, DataType.DWORD, true);
            const zoomInstance = League.read<number>(hudInstance + 0xC, DataType.DWORD);
            const currentZoom = League.read<number>(zoomInstance + 0x268, DataType.FLOAT);
            return currentZoom;
        })
    }

    get winapi() {
        return Winapi;
    }

    async sleep(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms));
    }

    async issueOrder(pos: Vector2, isAttack: boolean,
        sleeps = { afterMove: 3, afterPress: 10, afterRelease: 1, }
    ) {
        const startMousePos = this.winapi.actions.getMousePos();
        const position = pos.flatten();
        if (isAttack) {
            this.winapi.actions.blockInput(true);
            this.winapi.actions.move(position.x, position.y);
            await this.sleep(sleeps.afterMove);
            this.winapi.actions.press(23);
            await this.sleep(sleeps.afterPress);
            this.winapi.actions.release(23);
            await this.sleep(sleeps.afterRelease);
            this.winapi.actions.move(startMousePos.x, startMousePos.y);
            this.winapi.actions.blockInput(false);
        } else {
            this.winapi.actions.move(position.x, position.y);
            await this.sleep(sleeps.afterMove);
            this.winapi.actions.press(22);
            await this.sleep(sleeps.afterPress);
            this.winapi.actions.release(22);
            await this.sleep(sleeps.afterRelease);
        }
    }

    async castSpell(slot: number, pos1?: Vector2, pos2?: Vector2, selfCast?: boolean,
        sleeps = { afterMove: 3, afterPress: 10, afterRelease: 1, }
    ) {

        const startMousePos = this.winapi.actions.getMousePos();
        this.winapi.actions.blockInput(true);

        if (selfCast) {
            this.winapi.actions.press(ALT);
            this.winapi.actions.press(slot);
            await this.sleep(sleeps.afterPress);
            this.winapi.actions.release(ALT);
            this.winapi.actions.release(slot);
            return this.winapi.actions.blockInput(false);
        }

        if (pos1) {
            const p1 = pos1.flatten();
            this.winapi.actions.move(p1.x, p1.y);
        }

        await this.sleep(sleeps.afterMove);
        this.winapi.actions.press(slot);
        await this.sleep(sleeps.afterPress);

        if (pos2) {
            const p2 = pos2.flatten();
            this.winapi.actions.move(p2.x, p2.y);
        }

        this.winapi.actions.release(slot);
        await this.sleep(sleeps.afterRelease);
        this.winapi.actions.move(startMousePos.x, startMousePos.y);

        this.winapi.actions.blockInput(false);

    }

}