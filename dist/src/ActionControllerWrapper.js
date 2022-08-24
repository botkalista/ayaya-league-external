"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./models/Vector");
const AyayaWinapiWrapper = require('../../src/cpp/build/Release/AyayaWinapiWrapper');
class ActionControllerWrapper {
    isPressed(key) {
        return AyayaWinapiWrapper.isKeyPressed(key);
    }
    press(key) {
        AyayaWinapiWrapper.pressKey(key);
    }
    release(key) {
        AyayaWinapiWrapper.releaseKey(key);
    }
    move(x, y) {
        AyayaWinapiWrapper.setMousePos(x, y);
    }
    click(button) {
    }
    getMousePos() {
        const [x, y] = AyayaWinapiWrapper.getMousePos().split('_');
        return new Vector_1.Vector2(parseInt(x), parseInt(y));
    }
    blockInput(block) {
        return AyayaWinapiWrapper.blockInput(block);
    }
}
const instance = new ActionControllerWrapper();
exports.default = instance;
