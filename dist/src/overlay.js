"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Electron', process.versions.electron, 'Node', process.versions.node);
const electron_1 = require("electron");
const Windows_1 = require("./overlay/Windows");
const Settings_1 = require("./overlay/Settings");
const ws = require("ws");
let overlayWindow;
let settingsWindow;
const socket = new ws('ws://127.0.0.1:7007');
function main() {
    (0, Settings_1.loadSettingsFromFile)();
    registerHandlers();
    overlayWindow = (0, Windows_1.createOverlayWindow)();
    settingsWindow = (0, Windows_1.createSettingsWindow)();
}
function sendToServer(action, body) {
    const payload = JSON.stringify({ action, body });
    socket.send(payload);
}
function sendMessageToWin(win, name, data) {
    if (win['webContents'])
        return win.webContents.send(name, JSON.stringify(data));
    return win.send(name, JSON.stringify(data));
}
function onMessage(name, cb) {
    electron_1.ipcMain.on(name, (e, message) => {
        if (message == undefined || message == 'undefined')
            return cb(e, message);
        cb(e, JSON.parse(message));
    });
}
function registerHandlers() {
    socket.on('message', msg => {
        try {
            const data = JSON.parse(msg.toString());
            if (data.action == 'gameData') {
                sendMessageToWin(overlayWindow, 'gameData', data.body);
            }
            else if (data.action == 'dataScreenSize') {
                overlayWindow.setSize(data.body.x, data.body.y);
                sendMessageToWin(overlayWindow, 'dataScreenSize', data.body);
            }
        }
        catch (ex) {
            console.error('Unable to parse', msg.toString());
        }
    });
    //renderer = renderer || AyayaLeague.getRenderBase();
    //screen = screen || AyayaLeague.getScreenSize(renderer);
    //sendMessageToWin(e.sender, 'dataScreenSize', screen);
    onMessage('updateSettings', (e, data) => {
        (0, Settings_1.setSettings)(data);
        (0, Settings_1.saveSettingsToFile)();
        sendMessageToWin(overlayWindow, 'dataSettings', data);
        sendMessageToWin(settingsWindow, 'dataSettings', data);
    });
    onMessage('requestSettings', (e, data) => {
        const settings = (0, Settings_1.getSettings)();
        sendMessageToWin(e.sender, 'dataSettings', settings);
    });
    onMessage('requestScreenSize', (e, data) => {
        sendToServer('requestScreenSize', {});
    });
    onMessage('closeSettingsWindow', (e, data) => {
        settingsWindow.hide();
    });
    onMessage('reloadWindows', (e, data) => {
        overlayWindow.reload();
        settingsWindow.reload();
    });
    onMessage('openOverlayDevTools', (e, data) => {
        overlayWindow.webContents.openDevTools({ mode: 'detach' });
    });
}
electron_1.app.whenReady().then(main);
electron_1.app.on('will-quit', () => {
    electron_1.globalShortcut.unregisterAll();
});
