import { app } from "electron";

import { CachedClass } from "../models/CachedClass";

import * as fetch from 'node-fetch';

class WebApi {

    interval: number = 250;
    running: boolean = false;

    start() {
        if (this.running) return;
        this.running = true;
        this.loop();
    }

    stop() {
        this.running = false;
    }

    private async loop() {
        if (!this.running) return;
        try {
            const res = await fetch(`https://127.0.0.1:2999/liveclientdata/activeplayer`);
            const data = await res.json();
            CachedClass.set('webapi_me', data);
        } catch (ex) {
            console.log(ex);
            app.exit();
        }
        setTimeout(() => this.loop(), this.interval);
    }

}


const instance = new WebApi();

export default instance;