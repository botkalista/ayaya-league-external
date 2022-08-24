"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const CachedClass_1 = require("./CachedClass");
const LeagueReader_1 = require("../LeagueReader");
const ActionControllerWrapper_1 = require("../../src/ActionControllerWrapper");
const Offsets_1 = require("../consts/Offsets");
const ALT = 0x12;
const CTRL = 0x11;
class Game extends CachedClass_1.CachedClass {
    constructor() { super(); }
    ;
    get time() {
        return this.use('time', LeagueReader_1.default.getGameTime);
    }
    get currentZoom() {
        return this.use('currentZoom', () => {
            const hudInstance = LeagueReader_1.default.reader.readProcessMemory(Offsets_1.OFFSET.oHud, "DWORD", true);
            const zoomInstance = LeagueReader_1.default.reader.readProcessMemory(hudInstance + 0xC, "DWORD");
            const currentZoom = LeagueReader_1.default.reader.readProcessMemory(zoomInstance + 0x268, "FLOAT");
            return currentZoom;
        });
    }
    get screenSize() {
        return CachedClass_1.CachedClass.get('screen');
    }
    castSpell(slot, pos1, pos2, selfCast) {
        CachedClass_1.CachedClass.set('playerState', "isCasting");
        const startMousePos = this.getMousePos();
        ActionControllerWrapper_1.default.blockInput(true);
        if (selfCast) {
            ActionControllerWrapper_1.default.press(ALT);
            ActionControllerWrapper_1.default.press(slot);
            this.sleep(10);
            ActionControllerWrapper_1.default.release(ALT);
            ActionControllerWrapper_1.default.release(slot);
            return ActionControllerWrapper_1.default.blockInput(false);
        }
        if (pos1) {
            const p1 = pos1.flatten();
            ActionControllerWrapper_1.default.move(p1.x, p1.y);
        }
        this.sleep(15);
        ActionControllerWrapper_1.default.press(slot);
        this.sleep(9);
        if (pos2) {
            const p2 = pos2.flatten();
            ActionControllerWrapper_1.default.move(p2.x, p2.y);
        }
        ActionControllerWrapper_1.default.release(slot);
        this.sleep(5);
        ActionControllerWrapper_1.default.move(startMousePos.x, startMousePos.y);
        ActionControllerWrapper_1.default.blockInput(false);
        CachedClass_1.CachedClass.set('playerState', "idle");
    }
    isKeyPressed(key) {
        return ActionControllerWrapper_1.default.isPressed(key);
    }
    getMousePos() {
        return ActionControllerWrapper_1.default.getMousePos();
    }
    setMousePos(x, y) {
        ActionControllerWrapper_1.default.move(x, y);
    }
    sleep(ms) {
        const t = Date.now();
        while (Date.now() - t < ms) { }
    }
    pressKey(key) {
        ActionControllerWrapper_1.default.press(key);
        this.sleep(10);
    }
    blockInput(value) {
        ActionControllerWrapper_1.default.blockInput(value);
    }
    releaseKey(key) {
        ActionControllerWrapper_1.default.release(key);
    }
    issueOrder(pos, isAttack) {
        const startMousePos = this.getMousePos();
        const position = pos.flatten();
        if (isAttack) {
            CachedClass_1.CachedClass.set('playerState', "isAttacking");
            ActionControllerWrapper_1.default.blockInput(true);
            ActionControllerWrapper_1.default.move(position.x, position.y);
            this.sleep(1);
            ActionControllerWrapper_1.default.press(23);
            this.sleep(15);
            ActionControllerWrapper_1.default.release(23);
            ActionControllerWrapper_1.default.move(startMousePos.x, startMousePos.y);
            ActionControllerWrapper_1.default.blockInput(false);
        }
        else {
            CachedClass_1.CachedClass.set('playerState', "isMoving");
            ActionControllerWrapper_1.default.move(position.x, position.y);
            this.sleep(1);
            ActionControllerWrapper_1.default.press(22);
            this.sleep(15);
            ActionControllerWrapper_1.default.release(22);
        }
        CachedClass_1.CachedClass.set('playerState', "idle");
    }
}
exports.Game = Game;
