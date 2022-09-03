

class State {
    private _data = new Map<string, any>();
    get rawData() { return this._data; }
    getData(key: string) { return this._data.get(key); }
    setData(key: string, value: any) { this._data.set(key, value); }
}

const instance = new State();
export default instance;