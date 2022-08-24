"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Shared {
    constructor() {
        this.userScripts = [];
        this.persistentMissiles = [];
        this.aiManagerCache = new Map();
        this.highestReadTime = 0;
        this.tickInfo = { lastOnTickPublish: 0, ticks: 1 };
    }
}
const instance = new Shared();
exports.default = instance;
