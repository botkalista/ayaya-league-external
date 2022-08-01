

export class Vector2 {

    constructor(public x: number, public y: number) { }

    static zero() {
        const instance = new Vector2(0, 0);
        return instance;
    }

    static fromVector(vector: Vector2) {
        const instance = vector.copy();
        return instance;
    }

    copy() {
        const instance = new Vector2(this.x, this.y);
        return instance;
    }

}

export class Vector3 {

    constructor(public x: number, public y: number, public z: number) { }

    static zero() {
        const instance = new Vector3(0, 0, 0);
        return instance;
    }

    static fromVector(vector: Vector3) {
        const instance = vector.copy();
        return instance;
    }

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