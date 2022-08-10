

class Vector {
}

export class Vector2 extends Vector {

    constructor(public x: number, public y: number) { super() }

    static zero() {
        const instance = new Vector2(0, 0);
        return instance;
    }

    static fromVector(vector: Vector2) {
        const instance = vector.copy();
        return instance;
    }

    mult(x: number, y: number) {
        const cp = this.copy();
        cp.x *= x;
        cp.y *= y;
        return cp;
    }

    isEqual(vector: Vector2): boolean {
        return this.x == vector.x && this.y == vector.y;
    }


    get flat() { return this.getFlat(); }

    getFlat() {
        const cp = this.copy();
        cp.x = parseInt(cp.x.toFixed(0));
        cp.y = parseInt(cp.y.toFixed(0));
        return cp;
    }

    copy() {
        const instance = new Vector2(this.x, this.y);
        return instance;
    }

}

export class Vector3 extends Vector {

    constructor(public x: number, public y: number, public z: number) { super() }

    static fromData(data: { x: number, y: number, z: number }) {
        const instance = new Vector3(data.x, data.y, data.z);
        return instance;
    }

    static zero() {
        const instance = new Vector3(0, 0, 0);
        return instance;
    }

    static fromVector(vector: Vector3) {
        const instance = vector.copy();
        return instance;
    }

    isEqual(vector: Vector3): boolean {
        return this.x == vector.x && this.y == vector.y && this.z == vector.z;
    }

    mult(x: number, y: number, z: number) {
        const cp = this.copy();
        cp.x *= x;
        cp.y *= y;
        cp.z *= z;
        return cp;
    }

    get flat() { return this.getFlat(); }

    getFlat() {
        const cp = this.copy();
        cp.x = parseInt(cp.x.toFixed(0));
        cp.y = parseInt(cp.y.toFixed(0));
        cp.z = parseInt(cp.z.toFixed(0));
        return cp;
    }

    copy() {
        const instance = new Vector3(this.x, this.y, this.z);
        return instance;
    }

}

export class Vector4 extends Vector {

    constructor(public x: number, public y: number, public z: number, public w: number) { super() }

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