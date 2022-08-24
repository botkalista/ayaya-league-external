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
const electron_1 = require("electron");
const Settings_1 = require("../overlay/Settings");
const ScriptsLoader_1 = require("./ScriptsLoader");
const main_1 = require("./main");
const ActionControllerWrapper_1 = require("../ActionControllerWrapper");
const Windows_1 = require("../overlay/Windows");
const LeagueReader_1 = require("../LeagueReader");
const Shared_1 = require("./Shared");
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
function registerHandlers() {
    onMessage('closeAyayaLeague', (e, data) => {
        try {
            electron_1.app.exit();
        }
        catch (ex) {
            console.error(ex);
        }
    });
    onMessage('startAyayaLeague', (e, data) => {
        try {
            Windows_1.default.entryWindow.hide();
            const leagueProcess = LeagueReader_1.default.reader.memInstance.getProcesses().find(e => {
                return e.szExeFile == 'League of Legends.exe';
            });
            if (!leagueProcess) {
                electron_1.dialog.showErrorBox('Not in game', 'You need to be in a game before starting AyayaLeague');
                Windows_1.default.entryWindow.show();
            }
            else {
                (0, main_1.main)();
            }
        }
        catch (ex) {
            console.error(ex);
        }
    });
    //* On Draw Manager
    onMessage('drawingContext', (e, data) => {
        Shared_1.default.drawContext.__clearCommands();
        for (const script of Shared_1.default.userScripts) {
            const setting = (0, Settings_1.getSettings)().find(e => e.name == script._scriptname);
            script.onDraw && script.onDraw(Shared_1.default.drawContext, Shared_1.default.manager, (setting || { data: [] }).data);
        }
        e.returnValue = JSON.stringify(Shared_1.default.drawContext.__getCommands());
    });
    onMessage('updateSettings', (e, data) => {
        (0, Settings_1.setSettings)(data);
        (0, Settings_1.saveSettingsToFile)();
        sendMessageToWin(Windows_1.default.settingsWindow, 'dataSettings', data);
    });
    onMessage('updateBaseSettings', (e, data) => {
        sendMessageToWin(Windows_1.default.overlayWindow, 'dataBaseSettings', data);
    });
    onMessage('requestSettings', (e, data) => {
        const settings = (0, Settings_1.getSettings)();
        sendMessageToWin(e.sender, 'dataSettings', settings);
    });
    onMessage('requestScreenSize', (e, data) => {
        Shared_1.default.renderer = Shared_1.default.renderer || LeagueReader_1.default.getRenderBase();
        Shared_1.default.screen = Shared_1.default.screen || LeagueReader_1.default.getScreenSize(Shared_1.default.renderer);
        sendMessageToWin(e.sender, 'dataScreenSize', Shared_1.default.screen);
    });
    onMessage('closeSettingsWindow', (e, data) => {
        Windows_1.default.settingsWindow.hide();
    });
    onMessage('reloadScripts', (e, data) => __awaiter(this, void 0, void 0, function* () {
        yield (0, ScriptsLoader_1.unloadUserScripts)(Shared_1.default.userScripts);
        yield (0, ScriptsLoader_1.loadUserScripts)(Shared_1.default.userScripts);
    }));
    onMessage('reloadWindows', (e, data) => {
        Windows_1.default.overlayWindow.reload();
        Windows_1.default.settingsWindow.reload();
    });
    onMessage('openOverlayDevTools', (e, data) => {
        if (ActionControllerWrapper_1.default.isPressed(0x11))
            return Windows_1.default.settingsWindow.webContents.openDevTools({ mode: 'detach' });
        Windows_1.default.overlayWindow.webContents.openDevTools({ mode: 'detach' });
    });
}
exports.registerHandlers = registerHandlers;
