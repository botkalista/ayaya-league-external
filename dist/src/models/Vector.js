"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector4 = exports.Vector3 = exports.Vector2 = void 0;
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static get zero() { return new Vector2(0, 0); }
    static fromAxis(axis) { return new Vector2(axis[0], axis[1]); }
    static fromData(data) { return new Vector2(data.x, data.y); }
    get length() { return Math.sqrt(this.getAxis().reduce((p, v) => p + (v * v), 0)); }
    getAxis() { return [this.x, this.y]; }
    copy() { return new Vector2(this.x, this.y); }
    normalize() { const l = this.length; this.x /= l; this.y /= l; return this; }
    add(v) { return new Vector2(this.x + v.x, this.y + v.y); }
    sub(v) { return new Vector2(this.x - v.x, this.y - v.y); }
    mul(v) { return new Vector2(this.x * v.x, this.y * v.y); }
    div(v) { return new Vector2(this.x / v.x, this.y / v.y); }
    isEqual(v) { return this.x == v.x && this.y == v.y; }
    dist(v) { return Math.hypot(this.x - v.x, this.y - v.y); }
    flatten() {
        this.x = parseInt(this.x.toFixed());
        this.y = parseInt(this.y.toFixed());
        return this;
    }
}
exports.Vector2 = Vector2;
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static get zero() { return new Vector3(0, 0, 0); }
    static fromAxis(axis) { return new Vector3(axis[0], axis[1], axis[2]); }
    static fromData(data) { return new Vector3(data.x, data.y, data.z); }
    get length() { return Math.sqrt(this.getAxis().reduce((p, v) => p + (v * v), 0)); }
    getAxis() { return [this.x, this.y, this.z]; }
    copy() { return new Vector3(this.x, this.y, this.z); }
    normalize() { const l = this.length; this.x /= l; this.y /= l; this.z /= l; return this; }
    add(v) { return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z); }
    sub(v) { return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z); }
    mul(v) { return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z); }
    div(v) { return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z); }
    isEqual(v) { return this.x == v.x && this.y == v.y && this.z == v.z; }
    dist(v) { return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z); }
    flatten() {
        this.x = parseInt(this.x.toFixed());
        this.y = parseInt(this.y.toFixed());
        this.z = parseInt(this.z.toFixed());
        return this;
    }
}
exports.Vector3 = Vector3;
class Vector4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    static get zero() { return new Vector4(0, 0, 0, 0); }
    static fromAxis(axis) { return new Vector4(axis[0], axis[1], axis[2], axis[3]); }
    static fromData(data) { return new Vector4(data.x, data.y, data.z, data.w); }
    get length() { return Math.sqrt(this.getAxis().reduce((p, v) => p + (v * v), 0)); }
    getAxis() { return [this.x, this.y, this.z, this.w]; }
    copy() { return new Vector4(this.x, this.y, this.z, this.w); }
    normalize() { const l = this.length; this.x /= l; this.y /= l; this.z /= l; this.w /= l; return this; }
    add(v) { return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w); }
    sub(v) { return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w); }
    mul(v) { return new Vector4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w); }
    div(v) { return new Vector4(this.x / v.x, this.y / v.y, this.z / v.z, this.w / v.w); }
    isEqual(v) { return this.x == v.x && this.y == v.y && this.z == v.z && this.w == v.w; }
    dist(v) { return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w); }
    flatten() {
        this.x = parseInt(this.x.toFixed());
        this.y = parseInt(this.y.toFixed());
        this.z = parseInt(this.z.toFixed());
        this.w = parseInt(this.w.toFixed());
        return this;
    }
}
exports.Vector4 = Vector4;
