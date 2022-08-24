"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const CachedClass_1 = require("../models/CachedClass");
const fetch = require("node-fetch");
class WebApi {
    constructor() {
        this.interval = 250;
        this.running = false;
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        this.loop();
    }
    stop() {
        this.running = false;
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.running)
                return;
            try {
                const res = yield fetch(`https://127.0.0.1:2999/liveclientdata/activeplayer`);
                const data = yield res.json();
                CachedClass_1.CachedClass.set('webapi_me', data);
            }
            catch (ex) {
                console.log(ex);
                electron_1.app.exit();
            }
            setTimeout(() => this.loop(), this.interval);
        });
    }
}
const instance = new WebApi();
exports.default = instance;
