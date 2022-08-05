

import * as robot from 'robotjs';

class ActionController {
    async sleep(ms: number) {
        await new Promise(r => setTimeout(r, ms));
    }
    leftClick() {
        robot.mouseClick('left');
    }
    rightClick() {
        robot.mouseClick('left');
    }
    leftClickAt(x: number, y: number) {
        this.moveMouse(x, y);
        this.leftClick();
    }
    rightClickAt(x: number, y: number) {
        this.moveMouse(x, y);
        this.rightClick();
    }
    moveMouse(x: number, y: number) {
        robot.moveMouse(x, y);
    }
}

const instance = new ActionController();

export default instance;
