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

    async issueOrder(pos: Vector2, isAttack: boolean, delay: number = 10) {
        const startMousePos = await ActionControllerWrapper.getMousePos();
        ActionControllerWrapper.blockInput(true);
        isAttack ? this.executeOrderAttack(pos, delay) : this.executeOrderMove(pos, delay);
        await this.sleep(40);
        ActionControllerWrapper.move(startMousePos.x, startMousePos.y);
        ActionControllerWrapper.blockInput(false);
    }

    private async sleep(ms) {
        return new Promise(e => setTimeout(e, ms));
    }

    private executeOrderAttack(pos: Vector2, delay: number = 10) {
        console.log(`executeOrderAttack not yet implemented.`);
    }

    private executeOrderMove(pos: Vector2, delay: number = 10) {
        ActionControllerWrapper.click("RIGHT", pos.x, pos.y, delay);
    }

}