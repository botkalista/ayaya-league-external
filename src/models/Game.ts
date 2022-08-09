import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import { Vector2 } from "./Vector";
import ActionControllerWrapper from '../../src/ActionControllerWrapper';

type SpellSlotName = "Q" | "W" | "E" | "R" | "D" | "F" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

export class Game extends CachedClass {

    constructor() { super() };

    get time(): number {
        return this.use('time', AyayaLeague.getGameTime);
    }

    castSpell(slot: SpellSlotName, pos1: Vector2, pos2?: Vector2, selfCast?: boolean) {
        //TODO: Press button to cast spell
    }

    isKeyPressed(key: number) {
        return ActionControllerWrapper.isPressed(key);
    }

    private getMousePos() {
        return ActionControllerWrapper.getMousePos();
    }

    private syncWait(ms: number) {
        const t = Date.now();
        while (Date.now() - t < ms) { }
    }

    issueOrder(pos: Vector2, isAttack: boolean) {
        const startMousePos = this.getMousePos();
        const position = pos.getFlat();
        if (isAttack) {
            ActionControllerWrapper.blockInput(true);
            ActionControllerWrapper.move(position.x, position.y);
            this.syncWait(5);
            ActionControllerWrapper.press(23);
            this.syncWait(15);
            ActionControllerWrapper.release(23);
            ActionControllerWrapper.move(startMousePos.x, startMousePos.y);
            ActionControllerWrapper.blockInput(false);
        } else {
            ActionControllerWrapper.move(position.x, position.y);
            this.syncWait(5);
            ActionControllerWrapper.press(22);
            this.syncWait(6);
            ActionControllerWrapper.release(22);
        }
    }


}