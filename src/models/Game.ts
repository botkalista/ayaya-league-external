import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import { Vector2 } from "./Vector";
import ActionControllerWrapper from '../../src/ActionControllerWrapper';
import { PlayerState } from "../../scripts/UserScriptManager";


const ALT = 0x12;
const CTRL = 0x11;

export class Game extends CachedClass {

    constructor() { super() };

    get time(): number {
        return this.use('time', AyayaLeague.getGameTime);
    }


    castSpell(slot: number, pos1?: Vector2, pos2?: Vector2, selfCast?: boolean) {

        CachedClass.set<PlayerState>('playerState', "isCasting");

        const startMousePos = this.getMousePos();
        ActionControllerWrapper.blockInput(true);

        if (selfCast) {
            ActionControllerWrapper.press(ALT);
            ActionControllerWrapper.press(slot);
            this.sleep(10);
            ActionControllerWrapper.release(ALT);
            ActionControllerWrapper.release(slot);
            return ActionControllerWrapper.blockInput(false);
        }

        if (pos1) {
            const p1 = pos1.getFlat();
            ActionControllerWrapper.move(p1.x, p1.y);
        }

        this.sleep(5);
        ActionControllerWrapper.press(slot);
        this.sleep(10);

        if (pos2) {
            const p2 = pos2.getFlat();
            ActionControllerWrapper.move(p2.x, p2.y);
        }

        ActionControllerWrapper.release(slot);

        ActionControllerWrapper.move(startMousePos.x, startMousePos.y);

        ActionControllerWrapper.blockInput(false);

        CachedClass.set<PlayerState>('playerState', "idle");

    }

    isKeyPressed(key: number) {
        return ActionControllerWrapper.isPressed(key);
    }

    getMousePos() {
        return ActionControllerWrapper.getMousePos();
    }

    setMousePos(x: number, y: number) {
        ActionControllerWrapper.move(x, y);
    }

    sleep(ms: number) {
        const t = Date.now();
        while (Date.now() - t < ms) { }
    }

    pressKey(key: number) {
        ActionControllerWrapper.press(key);
        this.sleep(10);
    }

    blockInput(value: boolean) {
        ActionControllerWrapper.blockInput(value);
    }

    releaseKey(key: number | number) {
        ActionControllerWrapper.release(key);
    }

    issueOrder(pos: Vector2, isAttack: boolean) {
        const startMousePos = this.getMousePos();
        const position = pos.getFlat();
        if (isAttack) {
            CachedClass.set<PlayerState>('playerState', "isAttacking");
            ActionControllerWrapper.blockInput(true);
            ActionControllerWrapper.move(position.x, position.y);
            this.sleep(5);
            ActionControllerWrapper.press(23);
            this.sleep(10);
            ActionControllerWrapper.release(23);
            ActionControllerWrapper.move(startMousePos.x, startMousePos.y);
            ActionControllerWrapper.blockInput(false);
        } else {
            CachedClass.set<PlayerState>('playerState', "isMoving");
            ActionControllerWrapper.move(position.x, position.y);
            this.sleep(5);
            ActionControllerWrapper.press(22);
            this.sleep(10);
            ActionControllerWrapper.release(22);
        }
        CachedClass.set<PlayerState>('playerState', "idle");
    }


}