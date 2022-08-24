"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Performance = void 0;
class Performance {
    constructor() { }
    spot(name) {
        const now = performance.now();
        const delta = now - this.tSpot;
        this.readings.push({ name, delta });
        this.tSpot = now;
    }
    start() {
        this.tStart = performance.now();
        this.tSpot = this.tStart;
        this.readings = [];
    }
    getReads() {
        return this.readings;
    }
    end() {
        return { readings: this.readings, time: performance.now() - this.tStart };
    }
}
exports.Performance = Performance;
