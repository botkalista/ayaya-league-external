import Manager from "../models/main/Manager";
import type { Vector2, Vector3 } from "../models/Vector";

type Color = number | number[] | string;

class DrawService {

    private win;

    private buffer = [];

    attachOverlay(win) {
        this.win = win;
    }

    flushContext() {
        const res = JSON.stringify(this.buffer);
        this.buffer.length = 0;
        return res;

    }

    textAt(str: string, x: number, y: number, size: number = 20, color: Color = 255) {
        this.buffer.push(['textAt', str, x, y, size, color]);
    }
    textAtPoint(str: string, pos: Vector2, size: number = 20, color: Color = 255) {
        this.buffer.push(['textAt', str, pos.x, pos.y, size, color]);
    }
    textAtPoint3D(str: string, pos: Vector3, size: number = 20, color: Color = 255) {
        const pos2d = Manager.worldToScreen(pos);
        this.buffer.push(['textAt', str, pos2d.x, pos2d.y, size, color]);
    }


}


const instance = new DrawService();
export default instance;