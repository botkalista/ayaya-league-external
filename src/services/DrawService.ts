import Manager from "../models/main/Manager";
import { getCircle3D } from "../models/main/ManagerUtils";
import type { Vector2, Vector3 } from "../models/Vector";

type Color = number | number[] | string;



/** TO MOVE IN DEDICATED FILE */

const ASSETS_URL = 'http://ddragon.leagueoflegends.com/cdn/12.16.1/';

function spellUrl(spellName: string, isPassive: boolean = false) {
    return `${ASSETS_URL}img/${isPassive ? 'passive' : 'spell'}/${spellName}.png`
}
function champUrl(spellName: string) {
    return `${ASSETS_URL}img/champion/${spellName}.png`
}
function itemUrl(itemId: string) {
    return `${ASSETS_URL}img/item/${itemId}.png`
}




class DrawService {

    private buffer = [];

    flushContext() {
        const res = JSON.stringify(this.buffer);
        this.buffer.length = 0;
        return res;
    }


    get urls() { return { spellUrl, champUrl, itemUrl }; }

    lineAt(x1: number, y1: number, x2: number, y2: number, weight: number = 1, color: Color = 255) {
        this.buffer.push(['lineAt', x1, y1, x2, y2, weight, color]);
    }
    lineAtPoints(pos1: Vector2, pos2: Vector2, weight: number = 1, color: Color = 255) {
        this.buffer.push(['lineAt', pos1.x, pos1.y, pos2.x, pos2.y, weight, color]);
    }
    lineAtPoints3D(pos1: Vector3, pos2: Vector3, weight: number = 1, color: Color = 255) {
        const pos2d1 = Manager.worldToScreen(pos1);
        const pos2d2 = Manager.worldToScreen(pos2);
        this.buffer.push(['lineAt', pos2d1.x, pos2d1.y, pos2d2.x, pos2d2.y, weight, color]);
    }

    imageAt(url: string, x: number, y: number, width: number, height: number) {
        this.buffer.push(['imageAt', url, x, y, width, height]);
    }
    imageAtPoint(url: string, pos: Vector2, width: number, height: number) {
        this.buffer.push(['imageAt', url, pos.x, pos.y, width, height]);
    }
    imageAtPoint3D(url: string, pos: Vector3, width: number, height: number) {
        const pos2d = Manager.worldToScreen(pos);
        this.buffer.push(['imageAt', url, pos2d.x, pos2d.y, width, height]);
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