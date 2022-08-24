import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import { Vector2 } from "./Vector";
import ActionControllerWrapper from '../ActionControllerWrapper';
import { PlayerState } from "../../scripts/UserScriptManager";
import { OFFSET } from "../consts/Offsets";


const ALT = 0x12;
const CTRL = 0x11;

export class Game extends CachedClass {

    constructor() { super() };

    get time(): number {
        return this.use('time', AyayaLeague.getGameTime);
    }

    get currentZoom() {
        return this.use('currentZoom', () => {
            const hudInstance = AyayaLeague.reader.readProcessMemory(OFFSET.oHud, "DWORD", true);
            const zoomInstance = AyayaLeague.reader.readProcessMemory(hudInstance + 0xC, "DWORD");
            const currentZoom = AyayaLeague.reader.readProcessMemory(zoomInstance + 0x268, "FLOAT");
            return currentZoom;
        })
    }

    get screenSize(): Vector2 {
        return CachedClass.get('screen');
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
            const p1 = pos1.flatten();
            ActionControllerWrapper.move(p1.x, p1.y);
        }

        this.sleep(15);
        ActionControllerWrapper.press(slot);
        this.sleep(9);

        if (pos2) {
            const p2 = pos2.flatten();
            ActionControllerWrapper.move(p2.x, p2.y);
        }

        ActionControllerWrapper.release(slot);
        this.sleep(5);
        ActionControllerWrapper.move(startMousePos.x, startMousePos.y);

        ActionControllerWrapper.blockInput(false);

        CachedClass.set<PlayerState>('playerState', "idle");

    }

    isKeyPressed(key: number): boolean {
        return ActionControllerWrapper.isPressed(key);
    }

    getMousePos(): Vector2 {
        return ActionControllerWrapper.getMousePos();
    }

    setMousePos(x: number, y: number): void {
        ActionControllerWrapper.move(x, y);
    }

    mouseClick(button: "left" | "right") {
        ActionControllerWrapper.click(button)
        this.sleep(10)
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
        const position = pos.flatten();
        if (isAttack) {
            CachedClass.set<PlayerState>('playerState', "isAttacking");
            ActionControllerWrapper.blockInput(true);
            ActionControllerWrapper.move(position.x, position.y);
            this.sleep(1);
            ActionControllerWrapper.press(23);
            this.sleep(15);
            ActionControllerWrapper.release(23);
            ActionControllerWrapper.move(startMousePos.x, startMousePos.y);
            ActionControllerWrapper.blockInput(false);
        } else {
            CachedClass.set<PlayerState>('playerState', "isMoving");
            ActionControllerWrapper.move(position.x, position.y);
            this.sleep(1);
            ActionControllerWrapper.press(22);
            this.sleep(15);
            ActionControllerWrapper.release(22);
        }
        CachedClass.set<PlayerState>('playerState', "idle");
    }

}