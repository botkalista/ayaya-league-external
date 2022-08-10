

export class Performance {

    private tStart: number;
    private tSpot: number;

    private readings: { name: string, delta: number }[];

    constructor() { }

    spot(name: string) {
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
