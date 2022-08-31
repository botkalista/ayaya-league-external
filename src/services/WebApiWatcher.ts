import fetch from 'node-fetch';

class WebApiWatcher {

    private cache = {};
    private lastCheck = 0;
    private isRequesting = false;
    constructor() { }


    get data() {
        if (this.isRequesting) return this.cache;
        if (Date.now() > this.lastCheck + 1000) { this.getData(); this.lastCheck = Date.now() }
        return this.cache;
    }

    private async getData() {
        try {
            this.isRequesting = true;
            const res = await fetch(`https://127.0.0.1:2999/liveclientdata/activeplayer`);
            const data = await res.json();
            this.cache = data;
        } catch (ex) { } finally {
            this.isRequesting = false;
        }

    }
}

const instance = new WebApiWatcher();
export default instance;