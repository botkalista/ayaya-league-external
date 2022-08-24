"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const robot = require("robotjs");
class ActionController {
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(r => setTimeout(r, ms));
        });
    }
    leftClick() {
        robot.mouseClick('left');
    }
    rightClick() {
        robot.mouseClick('left');
    }
    leftClickAt(x, y) {
        this.moveMouse(x, y);
        this.leftClick();
    }
    rightClickAt(x, y) {
        this.moveMouse(x, y);
        this.rightClick();
    }
    moveMouse(x, y) {
        robot.moveMouse(x, y);
    }
}
const instance = new ActionController();
exports.default = instance;
