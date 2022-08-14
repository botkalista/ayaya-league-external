
export class Vector2 {
    constructor(public x: number, public y: number) { }
    static get zero() { return new Vector2(0, 0) }
    static fromAxis(axis: number[]) { return new Vector2(axis[0], axis[1]) }
    static fromData(data: { x: number, y: number }) { return new Vector2(data.x, data.y) }
    get length() { return Math.sqrt(this.getAxis().reduce((p, v) => p + (v * v), 0)) }
    getAxis() { return [this.x, this.y] }
    copy() { return new Vector2(this.x, this.y) }
    normalize() { const l = this.length; this.x /= l; this.y /= l; return this; }
    add(v: Vector2) { return new Vector2(this.x + v.x, this.y + v.y) }
    sub(v: Vector2) { return new Vector2(this.x - v.x, this.y - v.y) }
    mul(v: Vector2) { return new Vector2(this.x * v.x, this.y * v.y) }
    div(v: Vector2) { return new Vector2(this.x / v.x, this.y / v.y) }
    isEqual(v: Vector2) { return this.x == v.x && this.y == v.y }
    dist(v: Vector2) { return Math.hypot(this.x - v.x, this.y - v.y) }
    flatten() {
        this.x = parseInt(this.x.toFixed());
        this.y = parseInt(this.y.toFixed());
        return this;
    }
}
export class Vector3 {
    constructor(public x: number, public y: number, public z: number) { }
    static get zero() { return new Vector3(0, 0, 0) }
    static fromAxis(axis: number[]) { return new Vector3(axis[0], axis[1], axis[2]) }
    static fromData(data: { x: number, y: number, z: number }) { return new Vector3(data.x, data.y, data.z) }
    get length() { return Math.sqrt(this.getAxis().reduce((p, v) => p + (v * v), 0)) }
    getAxis() { return [this.x, this.y, this.z] }
    copy() { return new Vector3(this.x, this.y, this.z) }
    normalize() { const l = this.length; this.x /= l; this.y /= l; this.z /= l; return this; }
    add(v: Vector3) { return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z) }
    sub(v: Vector3) { return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z) }
    mul(v: Vector3) { return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z) }
    div(v: Vector3) { return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z) }
    isEqual(v: Vector3) { return this.x == v.x && this.y == v.y && this.z == v.z }
    dist(v: Vector3) { return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z) }
    flatten() {
        this.x = parseInt(this.x.toFixed());
        this.y = parseInt(this.y.toFixed());
        this.z = parseInt(this.z.toFixed());
        return this;
    }
}
export class Vector4 {
    constructor(public x: number, public y: number, public z: number, public w: number) { }
    static get zero() { return new Vector4(0, 0, 0, 0) }
    static fromAxis(axis: number[]) { return new Vector4(axis[0], axis[1], axis[2], axis[3]) }
    static fromData(data: { x: number, y: number, z: number, w: number }) { return new Vector4(data.x, data.y, data.z, data.w) }
    get length() { return Math.sqrt(this.getAxis().reduce((p, v) => p + (v * v), 0)) }
    getAxis() { return [this.x, this.y, this.z, this.w] }
    copy() { return new Vector4(this.x, this.y, this.z, this.w) }
    normalize() { const l = this.length; this.x /= l; this.y /= l; this.z /= l; this.w /= l; return this; }
    add(v: Vector4) { return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w) }
    sub(v: Vector4) { return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w) }
    mul(v: Vector4) { return new Vector4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w) }
    div(v: Vector4) { return new Vector4(this.x / v.x, this.y / v.y, this.z / v.z, this.w / v.w) }
    isEqual(v: Vector4) { return this.x == v.x && this.y == v.y && this.z == v.z && this.w == v.w }
    dist(v: Vector4) { return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w) }
    flatten() {
        this.x = parseInt(this.x.toFixed());
        this.y = parseInt(this.y.toFixed());
        this.z = parseInt(this.z.toFixed());
        this.w = parseInt(this.w.toFixed());
        return this;
    }
}

