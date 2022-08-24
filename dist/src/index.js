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
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
console.log('ELECTRON', process.versions.electron, 'NODE', process.versions.node, 'ARCH', process.arch);
const Windows_1 = require("./overlay/Windows");
const Handlers_1 = require("./main/Handlers");
const electron_1 = require("electron");
function entry() {
    return __awaiter(this, void 0, void 0, function* () {
        Windows_1.default.createEntryWindow();
        (0, Handlers_1.registerHandlers)();
    });
}
electron_1.app.whenReady().then(entry);
electron_1.app.on('will-quit', () => {
    electron_1.globalShortcut.unregisterAll();
});
