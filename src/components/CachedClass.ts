
type CacheMap = Map<string, any>;

export abstract class CachedClass {
    static debug: boolean = false;

    private static globalCache = new Map<string, any>();
    private localCache = new Map<string, any>();

    constructor() {
    }

    private static _get<T>(key: string, cache: CacheMap): T {
        return cache.get(key);
    }
    private static _has(key: string, cache: CacheMap): boolean {
        return cache.has(key);
    }
    private static _set<T>(key: string, value: T, cache: CacheMap) {
        return cache.set(key, value);
    }
    private static _use<T>(key: string, fn: () => T, cache: CacheMap): T {
        if (CachedClass._has(key, cache)) return CachedClass._get(key, cache);
        if (CachedClass.debug) console.log('Calculating', key);
        const result = fn();
        CachedClass._set(key, result, cache);
        return result;
    }
    private static _clear(cache: CacheMap) {
        cache.clear();
    }

    protected clear() {
        return CachedClass._clear(this.localCache);
    }
    protected get<T>(key: string): T {
        return CachedClass._get(key, this.localCache);
    }
    protected has(key: string): boolean {
        return CachedClass._has(key, this.localCache);
    }
    protected set<T>(key: string, value: T) {
        return CachedClass._set(key, value, this.localCache);
    }
    protected use<T>(key: string, fn: () => T): T {
        return CachedClass._use(key, fn, this.localCache);
    }

    static get<T>(key: string): T {
        return this._get(key, CachedClass.globalCache);
    }
    static has(key: string): boolean {
        return this._has(key, CachedClass.globalCache);
    }
    static set<T>(key: string, value: T) {
        return this._set(key, value, CachedClass.globalCache);
    }
    static use<T>(key: string, fn: () => T): T {
        return this._use(key, fn, CachedClass.globalCache);
    }
    static clear() {
        return this._clear(CachedClass.globalCache);
    }


}