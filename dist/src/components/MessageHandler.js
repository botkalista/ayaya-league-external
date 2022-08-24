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
exports.registerHandlers = exports.onMessage = exports.sendMessageToWin = void 0;
const Settings_1 = require("../overlay/Settings");
const electron_1 = require("electron");
const ScriptLoader_1 = require("./ScriptLoader");
function sendMessageToWin(win, name, data) {
    if (win['webContents'])
        return win.webContents.send(name, JSON.stringify(data));
    return win.send(name, JSON.stringify(data));
}
exports.sendMessageToWin = sendMessageToWin;
function onMessage(name, cb) {
    electron_1.ipcMain.on(name, (e, message) => {
        if (message == undefined || message == 'undefined')
            return cb(e, undefined);
        cb(e, JSON.parse(message));
    });
}
exports.onMessage = onMessage;
function registerHandlers(args) {
    onMessage('updateSettings', (e, data) => {
        (0, Settings_1.setSettings)(data);
        (0, Settings_1.saveSettingsToFile)();
        sendMessageToWin(args.wins.settingsWindow, 'dataSettings', data);
    });
    onMessage('updateBaseSettings', (e, data) => {
        sendMessageToWin(args.wins.overlayWindow, 'dataBaseSettings', data);
    });
    onMessage('requestSettings', (e, data) => {
        const settings = (0, Settings_1.getSettings)();
        sendMessageToWin(e.sender, 'dataSettings', settings);
    });
    onMessage('requestScreenSize', (e, data) => {
        const renderer = args.AyayaLeague.getRenderBase();
        const screen = args.AyayaLeague.getScreenSize(renderer);
        sendMessageToWin(e.sender, 'dataScreenSize', screen);
    });
    onMessage('closeSettingsWindow', (e, data) => {
        args.wins.settingsWindow.hide();
    });
    onMessage('reloadScripts', (e, data) => __awaiter(this, void 0, void 0, function* () {
        yield ScriptLoader_1.default.unloadUserScripts();
        yield ScriptLoader_1.default.loadUserScripts();
    }));
    onMessage('reloadWindows', (e, data) => {
        args.wins.overlayWindow.reload();
        args.wins.settingsWindow.reload();
    });
    onMessage('openOverlayDevTools', (e, data) => {
        args.wins.overlayWindow.webContents.openDevTools();
    });
    onMessage('toggleLoop', (e, data) => {
    });
}
exports.registerHandlers = registerHandlers;
