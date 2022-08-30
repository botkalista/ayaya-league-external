import Manager from "../models/main/Manager";
import { getCircle3D } from "../models/main/ManagerUtils";
import type { Vector2, Vector3 } from "../models/Vector";

type Color = number | number[] | string;

class DrawService {

    private buffer = [];

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

    circleAt(x: number, y: number, size: number = 20, color: Color = 255) {
        this.buffer.push(['circleAt', x, y, size, color]);
    }

    circleAtPoint(pos: Vector2, size: number = 20, color: Color = 255) {
        this.buffer.push(['circleAt', pos.x, pos.y, size, color]);
    }

    circleAtPoint3D(pos: Vector3, resolution: number = 50, size: number = 20, weight: number = 1, color: Color = 255) {
        const points = getCircle3D(pos, resolution, size, Manager.__internal.screen, Manager.__internal.matrix);
        this.buffer.push(['circle3D', points, weight, color]);
    }


}


const instance = new DrawService();
export default instance;