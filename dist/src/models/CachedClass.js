"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedClass = void 0;
class CachedClass {
    constructor() {
        this.localCache = new Map();
    }
    static _get(key, cache) {
        return cache.get(key);
    }
    static _has(key, cache) {
        return cache.has(key);
    }
    static _set(key, value, cache) {
        return cache.set(key, value);
    }
    static _use(key, fn, cache) {
        if (CachedClass._has(key, cache))
            return CachedClass._get(key, cache);
        if (CachedClass.debug)
            console.log('Calculating', key);
        const result = fn();
        CachedClass._set(key, result, cache);
        return result;
    }
    static _clear(cache) {
        cache.clear();
    }
    clear() {
        return CachedClass._clear(this.localCache);
    }
    get(key) {
        return CachedClass._get(key, this.localCache);
    }
    has(key) {
        return CachedClass._has(key, this.localCache);
    }
    set(key, value) {
        return CachedClass._set(key, value, this.localCache);
    }
    use(key, fn) {
        return CachedClass._use(key, fn, this.localCache);
    }
    static get(key) {
        return this._get(key, CachedClass.globalCache);
    }
    static has(key) {
        return this._has(key, CachedClass.globalCache);
    }
    static set(key, value) {
        return this._set(key, value, CachedClass.globalCache);
    }
    static use(key, fn) {
        return this._use(key, fn, CachedClass.globalCache);
    }
    static clear() {
        return this._clear(CachedClass.globalCache);
    }
}
exports.CachedClass = CachedClass;
CachedClass.debug = false;
CachedClass.globalCache = new Map();
