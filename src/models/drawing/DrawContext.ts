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

    raw(command: string, ...args: any) {
        this.commands.push([command, ...args]);
    }

    rect(p: Vector2, w: number, h: number, color: Color = 0, fill?: Color, thickness?: number) {
        this.commands.push([`noStroke`]);
        this.commands.push([`noFill`]);
        if (thickness) this.commands.push([`strokeWeight`, thickness]);
        if (color) this.commands.push([`stroke`, color]);
        if (fill) this.commands.push([`fill`, fill]);
        this.commands.push(['rect', p.x, p.y, w, h]);
    }

    line3D(p1: Vector3, p2: Vector3, color: Color = 0, thickness: number = 1) {
        this.commands.push(['__saveData', ['__internalLineP1', '__internal_worldToScreen', p1, CachedClass.get('screen'), CachedClass.get('matrix')]]);
        this.commands.push(['__saveData', ['__internalLineP2', '__internal_worldToScreen', p2, CachedClass.get('screen'), CachedClass.get('matrix')]]);
        this.commands.push([`stroke`, color]);
        this.commands.push([`strokeWeight`, thickness]);
        this.commands.push(['__drawLine3DFromSavedData', '__internalLineP1', '__internalLineP2']);
    }

    image(p: Vector2, path: string, key: string, w: number, h: number) {
        this.commands.push([`__image`, p, path, key, w, h]);
    }

    line(p1: Vector2, p2: Vector2, color: Color = 0, thickness: number = 1) {
        this.commands.push([`strokeWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['line', p1.x, p1.y, p2.x, p2.y]);
    }

    linePoints(x1: number, y1: number, x2: number, y2: number, color: Color = 0, thickness: number = 1) {
        this.commands.push([`strokeWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['line', x1, y1, x2, y2]);
    }

    circle(c: Vector3, r: number, points: number = 50, color: Color = 0, thickness: number = 1) {
        this.commands.push([`strokeWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['__saveData', ['__internalCircle', '__internal_getCircle3D', c, points, r, CachedClass.get('screen'), CachedClass.get('matrix')]]);
        this.commands.push([`__drawCircle3dFromSavedData`, '__internalCircle']);
    }


    text(str: string, x: number, y: number, size: number, color: Color = 0) {
        this.commands.push([`fill`, color]);
        this.commands.push([`noStroke`]);
        this.commands.push([`textSize`, size]);
        this.commands.push(['text', str, x, y]);
    }
}