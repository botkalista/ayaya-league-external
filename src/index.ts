process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

console.log('ELECTRON', process.versions.electron, 'NODE', process.versions.node, 'ARCH', process.arch)

import { BrowserWindow, app, ipcMain, globalShortcut, IpcMainEvent, WebContents } from 'electron';
import AyayaLeague from './LeagueReader';

import AyayaActionController from './ActionControllerWrapper';
import { createOverlayWindow, createSettingsWindow } from './overlay/Windows'
import { loadSettingsFromFile, setSettings, saveSettingsToFile, getSettings } from './overlay/Settings'

import { Vector2, Vector3 } from './models/Vector';
import { Preparator } from './overlay/Preparator';
import { matrixToArray } from './utils/Utils';
import { Performance } from './utils/Performance';
import { UserScriptManager } from '../scripts/UserScriptManager';
import { CachedClass } from './models/CachedClass';

import { publishOnMoveCreate } from './events/onMoveCreate';
import { publishOnMissileCreate } from './events/onMissileCreate';
import { publishOnTicks } from './events/onTick';
import { DrawContext } from './models/drawing/DrawContext';

import * as path from 'path';
import * as fs from 'fs';
import * as fetch from 'node-fetch';
import { Missile } from './models/Missile';
import { ScriptSettingsFull, UserScript } from './events/types';

if (process.argv[2] == 'nohook') {
    AyayaLeague.reader.setMode("DUMP");
    AyayaLeague.reader.loadDump();
} else {
    AyayaLeague.reader.hookLeagueProcess();
}

const preparator = new Preparator(AyayaLeague);

let overlayWindow: BrowserWindow;
let settingsWindow: BrowserWindow;

let highestReadTime = 0;

let renderer: number;
let screen: Vector2;


const userScripts: UserScript[] = [];
const manager = new UserScriptManager();
const drawContext = new DrawContext();

function sendMessageToWin(win: BrowserWindow | WebContents, name: string, data: any) {
    if (win['webContents']) return (win as BrowserWindow).webContents.send(name, JSON.stringify(data));
    return (win as WebContents).send(name, JSON.stringify(data));
}
function onMessage<T>(name: string, cb: (e: IpcMainEvent, message: T) => void) {
    ipcMain.on(name, (e, message) => {
        if (message == undefined || message == 'undefined') return cb(e, undefined);
        cb(e, JSON.parse(message));
    });
}
function registerHandlers() {

    onMessage<any[]>('updateSettings', (e, data) => {
        setSettings(data);
        saveSettingsToFile();
        sendMessageToWin(settingsWindow, 'dataSettings', data);
    });

    onMessage<any>('updateBaseSettings', (e, data) => {
        sendMessageToWin(overlayWindow, 'dataBaseSettings', data);
    });

    onMessage<never>('requestSettings', (e, data) => {
        const settings = getSettings();
        sendMessageToWin(e.sender, 'dataSettings', settings);
    });

    onMessage<never>('requestScreenSize', (e, data) => {
        renderer = renderer || AyayaLeague.getRenderBase();
        screen = screen || AyayaLeague.getScreenSize(renderer);
        sendMessageToWin(e.sender, 'dataScreenSize', screen);
    });

    onMessage<never>('closeSettingsWindow', (e, data) => {
        settingsWindow.hide();
    });


    onMessage<never>('reloadScripts', async (e, data) => {
        await unloadUserScripts();
        await loadUserScripts();
    });

    onMessage<never>('reloadWindows', (e, data) => {
        overlayWindow.reload();
        settingsWindow.reload();
    });

    onMessage<never>('openOverlayDevTools', (e, data) => {
        if (AyayaActionController.isPressed(0x11)) return settingsWindow.webContents.openDevTools({ mode: 'detach' });
        overlayWindow.webContents.openDevTools({ mode: 'detach' });
    });

}

async function loadUserScripts() {
    loadSettingsFromFile();

    const basePath = path.join(__dirname, '../../scripts/userscripts');
    const userScriptsPaths = fs.readdirSync(basePath);
    for (const scriptPath of userScriptsPaths) {
        try {
            if (scriptPath.endsWith('.ts')) {
                console.log('Skipped', scriptPath, ' - You need to compile it to js');
                continue;
            }
            const p = path.join(basePath, scriptPath);
            const imp = await require(p);
            userScripts.push({ ...imp, _modulename: p, _scriptname: scriptPath });
        } catch (ex) {
            console.error('Error loading', scriptPath, ex);
        }
    }

    const scriptSettings: any[] = [];

    const loadedSettings = getSettings();

    for (const script of userScripts) {
        try {
            if (script.setup) {
                const setupResult = await script.setup(script._modulename, script._scriptname);
                if (!setupResult) continue;

                const setting = loadedSettings.find(s => s.name == script._scriptname);

                const data = setupResult.map(e => {
                    if (setting) {
                        const s = setting.data.find(k => k.text == e.text);

                        if (s && s.value != undefined) {
                            e.value = s.value;
                            e.default = undefined;
                            return e;
                        }
                    }
                    e.value = e.default;
                    e.default = undefined;
                    return e;
                });

                scriptSettings.push({ name: script._scriptname, data });
            }
        } catch (ex) {
            console.error('Error on script', script._modulename, 'function setup\n', ex);
        }
    }

    setSettings(scriptSettings);

    console.log('Loaded', userScripts.length, 'user scripts.');
}

async function unloadUserScripts() {
    for (const script of userScripts) {
        delete require.cache[script._modulename];
    }

    userScripts.length = 0;
}

async function main() {

    //* On Draw Manager
    onMessage<never>('drawingContext', (e, data) => {
        drawContext.__clearCommands();
        for (const script of userScripts) {
            const setting = getSettings().find(e => e.name == script._scriptname);
            script.onDraw && script.onDraw(drawContext, manager, (setting || { data: [] }).data);
        }
        e.returnValue = JSON.stringify(drawContext.__getCommands());
    });

    //* Read webapi data
    const webapi_interval = setInterval(async () => {
        const res = await fetch(`https://127.0.0.1:2999/liveclientdata/activeplayer`);
        const data = await res.json();
        CachedClass.set('webapi_me', data);
    }, 250);

    CachedClass.set('webapi_interval', webapi_interval);

    registerHandlers();

    overlayWindow = createOverlayWindow();
    settingsWindow = createSettingsWindow();

    renderer = AyayaLeague.getRenderBase();
    screen = AyayaLeague.getScreenSize(renderer);
    overlayWindow.setSize(screen.x, screen.y);

    //* SHORTCUTS
    // globalShortcut.register('CommandOrControl+Space', () => {
    //     settingsWindow.isVisible() ? settingsWindow.hide() : settingsWindow.show();
    // });

    let lastOpen = 0;
    setInterval(() => {
        const now = Date.now();
        if (lastOpen + 350 > now) return;
        if (AyayaActionController.isPressed(0x20) && AyayaActionController.isPressed(0x11)) {
            settingsWindow.isVisible() ? settingsWindow.hide() : settingsWindow.show();
            lastOpen = now;
        }
    }, 30);

    //* Load user scripts
    await loadUserScripts()

    //* Start loop
    loop();

}

const performance = new Performance();



const persistentMissiles: Missile[] = [];
const aiManagerCache = new Map<string, [Vector3, Vector3]>();

const tickInfo = {
    lastOnTickPublish: 0,
    ticks: 1
}

async function loop() {
    performance.start();

    manager.dispose();

    const settings = getSettings();

    //* Load required global variables
    const gameTime = AyayaLeague.getGameTime();
    const me = manager.me;
    const myTeam = me.team;
    const nmeTeam = myTeam == 100 ? 200 : 100;
    const matrix = matrixToArray(AyayaLeague.getViewProjectionMatrix());

    //* Put global variables into global cache
    CachedClass.set('screen', screen);
    CachedClass.set('matrix', matrix);
    CachedClass.set('gameTime', gameTime);
    CachedClass.set('myTeam', myTeam);
    CachedClass.set('nmeTeam', nmeTeam);

    performance.spot('first_part');

    publishOnMissileCreate(manager, persistentMissiles, settings, publishToScript);

    performance.spot('missile_publish');

    publishOnMoveCreate(manager, aiManagerCache, settings, publishToScript);

    performance.spot('on_move_create_publish');

    const finalData = {
        enemyChampions: undefined,
        performance: { time: 0, max: parseFloat(highestReadTime.toFixed(1)), reads: performance.getReads() },
        screen,
        matrix,
    }
    performance.spot('drawer data');
    finalData.enemyChampions = manager.champions.enemies.map(e => preparator.prepareChampion(e));
    performance.spot('drawer - nmeChamps');

    // Publish onTick to scripts
    publishOnTicks(manager, tickInfo, settings, publishToScript);

    performance.spot('on_tick_publish');

    // --- performance ---
    const result = performance.end();
    if (result.time > highestReadTime) highestReadTime = result.time;
    // --- performance ---

    finalData.performance.time = result.time;
    sendMessageToWin(overlayWindow, 'gameData', finalData);
    tickInfo.ticks++;
    manager.dispose();
    setTimeout(loop, 5);
}

//TODO: Add typings
function publishToScript(fName: keyof UserScript, settings: ScriptSettingsFull, ...args: any) {
    for (const userScript of userScripts) {
        try {
            if (userScript[fName]) {
                const setting = settings.find(e => e.name == userScript._scriptname);
                (userScript[fName] as (...a) => any)(...args, (setting || { data: [] }).data);
            }
        } catch (ex) {
            console.error(`Error on script ${userScript._modulename} function ${fName}\n`, ex, '\n');
        }
    }
}

app.whenReady().then(main);


app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});