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

    issueOrder(pos: Vector2, isAttack: boolean) {
        ActionControllerWrapper.blockInput(true);
        if (isAttack) {
            ActionControllerWrapper.rightClickAt(pos.x, pos.y);
        } else {
            ActionControllerWrapper.leftClickAt(pos.x, pos.y);
        }
        ActionControllerWrapper.blockInput(false);
    }

}