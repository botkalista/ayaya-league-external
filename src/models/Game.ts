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

    async isKeyPressed(key: number) {
        return await ActionControllerWrapper.isPressed(key);
    }

    async getMousePos() {
        return await ActionControllerWrapper.getMousePos();
    }

    async issueOrder(pos: Vector2, isAttack: boolean) {
        const startMousePos = await ActionControllerWrapper.getMousePos();
        ActionControllerWrapper.blockInput(true);
        isAttack ? await this.executeOrderAttack(pos) : await this.executeOrderMove(pos);
        await ActionControllerWrapper.move(startMousePos.x, startMousePos.y);
        ActionControllerWrapper.blockInput(false);
    }

    private async executeOrderAttack(pos: Vector2) {
        await ActionControllerWrapper.move(pos.x, pos.y);
        await ActionControllerWrapper.press(0x1E);
        await ActionControllerWrapper.click("LEFT", pos.x, pos.y, 10);
    }

    private async executeOrderMove(pos: Vector2) {
        await ActionControllerWrapper.click("RIGHT", pos.x, pos.y, 10);
    }

}