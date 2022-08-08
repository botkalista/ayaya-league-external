
import * as child from 'child_process';
import * as path from 'path';
import { Vector2 } from './models/Vector';

const AyayaWinapiWrapper = require('../../src/cpp/build/Release/AyayaWinapiWrapper');

class ActionControllerWrapper {

    isPressed(key: number): boolean {
        return AyayaWinapiWrapper.isKeyPressed(key)
    }
    press(key: number) {
        AyayaWinapiWrapper.pressKey(key);
    }
    release(key: number) {
       AyayaWinapiWrapper.releaseKey(key);
    }
    move(x: number, y: number) {
        AyayaWinapiWrapper.setMousePos(x, y);
    }
    click(button: "left" | "right") {

    }
    getMousePos(): Vector2 {
        const [x, y] = AyayaWinapiWrapper.getMousePos().split('_')
        return new Vector2(parseInt(x), parseInt(y));
    }
    blockInput(block: boolean): boolean {
        return AyayaWinapiWrapper.blockInput(block);
    }
}

const instance = new ActionControllerWrapper();

export default instance;