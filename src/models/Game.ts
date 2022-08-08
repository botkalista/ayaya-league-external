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

    issueOrder(pos: Vector2, isAttack: boolean) {
        const startMousePos = this.getMousePos();
        const position = pos.getFlat();
        if (isAttack) {
            ActionControllerWrapper.blockInput(true);
            ActionControllerWrapper.move(position.x, position.y);
            ActionControllerWrapper.press(23);
            const _tmp = Date.now();
            while (Date.now() - _tmp < 5) { }
            ActionControllerWrapper.release(23);
            ActionControllerWrapper.move(startMousePos.x, startMousePos.y);
            ActionControllerWrapper.blockInput(false);
        } else {
            ActionControllerWrapper.move(position.x, position.y);
            ActionControllerWrapper.press(22);
            const _tmp = performance.now();
            while (performance.now() - _tmp < 5) { }
            ActionControllerWrapper.release(22);
        }
    }


}