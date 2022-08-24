"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawContext = void 0;
const CachedClass_1 = require("../CachedClass");
class DrawContext {
    constructor() {
        this.commands = [];
    }
    __getCommands() {
        return this.commands;
    }
    __clearCommands() {
        this.commands.length = 0;
    }
    raw(command, ...args) {
        this.commands.push([command, ...args]);
    }
    rect(p, w, h, color = 0, fill, thickness) {
        this.commands.push([`noStroke`]);
        this.commands.push([`noFill`]);
        if (thickness)
            this.commands.push([`strokeWeight`, thickness]);
        if (color)
            this.commands.push([`stroke`, color]);
        if (fill)
            this.commands.push([`fill`, fill]);
        this.commands.push(['rect', p.x, p.y, w, h]);
    }
    line3D(p1, p2, color = 0, thickness = 1) {
        this.commands.push(['__saveData', ['__internalLineP1', '__internal_worldToScreen', p1, CachedClass_1.CachedClass.get('screen'), CachedClass_1.CachedClass.get('matrix')]]);
        this.commands.push(['__saveData', ['__internalLineP2', '__internal_worldToScreen', p2, CachedClass_1.CachedClass.get('screen'), CachedClass_1.CachedClass.get('matrix')]]);
        this.commands.push([`stroke`, color]);
        this.commands.push([`strokeWeight`, thickness]);
        this.commands.push(['__drawLine3DFromSavedData', '__internalLineP1', '__internalLineP2']);
    }
    image(p, path, key, w, h) {
        this.commands.push([`__image`, p, path, key, w, h]);
    }
    line(p1, p2, color = 0, thickness = 1) {
        this.commands.push([`strokeWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['line', p1.x, p1.y, p2.x, p2.y]);
    }
    linePoints(x1, y1, x2, y2, color = 0, thickness = 1) {
        this.commands.push([`strokeWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['line', x1, y1, x2, y2]);
    }
    circle(c, r, points = 50, color = 0, thickness = 1) {
        this.commands.push([`strokeWeight`, thickness]);
        this.commands.push([`stroke`, color]);
        this.commands.push(['__saveData', ['__internalCircle', '__internal_getCircle3D', c, points, r, CachedClass_1.CachedClass.get('screen'), CachedClass_1.CachedClass.get('matrix')]]);
        this.commands.push([`__drawCircle3dFromSavedData`, '__internalCircle']);
    }
    text(str, x, y, size, color = 0) {
        this.commands.push([`fill`, color]);
        this.commands.push([`noStroke`]);
        this.commands.push([`textSize`, size]);
        this.commands.push(['text', str, x, y]);
    }
}
exports.DrawContext = DrawContext;
