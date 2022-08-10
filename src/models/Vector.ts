import { classDocs, desc, arg, res } from '../models/Decorators';

@classDocs()
export class Vector2 {

    constructor(public x: number, public y: number) { }

    @desc('Returns a vector with x=0 y=0')
    @res(Vector2)
    static zero() {
        const instance = new Vector2(0, 0);
        return instance;
    }

    @desc('Returns a copy of the vector `v`')
    @arg('v', Vector2)
    @res(Vector2)
    static fromVector(vector: Vector2) {
        const instance = vector.copy();
        return instance;
    }

    @desc('Returns a copy of the vector with his x, y multiplied by `x`, `y`')
    @arg('x', 0)
    @arg('y', 0)
    @res(Vector2)
    mult(x: number, y: number) {
        const cp = this.copy();
        cp.x *= x;
        cp.y *= y;
        return cp;
    }

    @desc('Returns true if vectors have the same `x`, `y`')
    @arg('vec', Vector2)
    @res(true)
    isEqual(vector: Vector2): boolean {
        return this.x == vector.x && this.y == vector.y;
    }


    get flat() { return this.getFlat(); }

    @desc('Returns a copy of the vector with x, y as `integer` (instead of `float`)')
    @res(Vector2)
    getFlat() {
        const cp = this.copy();
        cp.x = parseInt(cp.x.toFixed(0));
        cp.y = parseInt(cp.y.toFixed(0));
        return cp;
    }

    @desc('Returns a copy of the vector')
    @res(Vector2)
    copy() {
        const instance = new Vector2(this.x, this.y);
        return instance;
    }

}

@classDocs()
export class Vector3 {

    constructor(public x: number, public y: number, public z: number) { }


    static fromData(data: { x: number, y: number, z: number }) {
        const instance = new Vector3(data.x, data.y, data.z);
        return instance;
    }

    @desc('Returns a vector with x=0 y=0 z=0')
    @res(Vector3)
    static zero() {
        const instance = new Vector3(0, 0, 0);
        return instance;
    }

    @desc('Returns a copy of the vector `v`')
    @arg('v', Vector3)
    @res(Vector3)
    static fromVector(vector: Vector3) {
        const instance = vector.copy();
        return instance;
    }

    @desc('Returns a copy of the vector with his x, y multiplied by `x`, `y`')
    @arg('x', 0)
    @arg('y', 0)
    @res(Vector3)
    mult(x: number, y: number, z: number) {
        const cp = this.copy();
        cp.x *= x;
        cp.y *= y;
        cp.z *= z;
        return cp;
    }

    @desc('Returns true if vectors have the same `x`, `y`, `z`')
    @arg('vec', Vector3)
    @res(Vector3)
    isEqual(vector: Vector3): boolean {
        return this.x == vector.x && this.y == vector.y && this.z == vector.z;
    }


    get flat() { return this.getFlat(); }

    
    @desc('Returns a copy of the vector with x, y, z as `integer` (instead of `float`)')
    @res(Vector3)
    getFlat() {
        const cp = this.copy();
        cp.x = parseInt(cp.x.toFixed(0));
        cp.y = parseInt(cp.y.toFixed(0));
        cp.z = parseInt(cp.z.toFixed(0));
        return cp;
    }

    @desc('Returns a copy of the vector')
    @res(Vector3)
    copy() {
        const instance = new Vector3(this.x, this.y, this.z);
        return instance;
    }

}

export class Vector4 {

    constructor(public x: number, public y: number, public z: number, public w: number) { }

    static zero() {
        const instance = new Vector4(0, 0, 0, 0);
        return instance;
    }

    static fromVector(vector: Vector4) {
        const instance = vector.copy();
        return instance;
    }

    copy() {
        const instance = new Vector4(this.x, this.y, this.z, this.w);
        return instance;
    }

}