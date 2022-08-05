
const robot = require('robotjs');

class ActionController {
    async sleep(ms) {
        await new Promise(r => setTimeout(r, ms));
    }
    leftClick() {
        robot.mouseClick('left');
    }
    rightClick() {
        robot.mouseClick('right');
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

module.exports = instance;