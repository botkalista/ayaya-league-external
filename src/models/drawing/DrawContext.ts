import { CachedClass } from '../CachedClass';
import { Vector2, Vector3 } from '../Vector';

type Color = number | string | [number, number?, number?, number?];

export class DrawContext {

    private commands: any[] = [];

    __getCommands() {
        return this.commands;
    }

    __clearCommands() {
        this.commands.length = 0;
    }

    line(p1: Vector2, p2: Vector2, color: Color = 0, thickness: number = 1) {
        this.commands.push([`lineWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['line', p1.x, p1.y, p2.x, p2.y]);
    }

    linePoints(x1: number, y1: number, x2: number, y2: number, color: number = 0, thickness: number = 1) {
        this.commands.push([`lineWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['line', x1, y1, x2, y2]);
    }

    circle(c: Vector3, r: number, points: number = 50, color: number = 0, thickness: number = 1) {
        this.commands.push([`lineWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['__saveData', ['__internalCircle', '__internal_getCircle3D', c, points, r, CachedClass.get('screen'), CachedClass.get('matrix')]]);
        this.commands.push([`__drawCircle3dFromSavedData`, '__internalCircle']);
    }


    text(str: string, x: number, y: number, size: number, color: Color = 0) {
        this.commands.push([`fill`, color]);
        this.commands.push([`noStroke`]);
        this.commands.push([`fontSize`, size]);
        this.commands.push(['text', str, x, y]);
    }
}