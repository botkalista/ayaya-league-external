console.log('ELECTRON', process.versions.electron, 'NODE', process.versions.node, process.arch);

// import * as ElectronRemote from '@electron/remote/main';
// ElectronRemote.initialize();

import { app, BrowserWindow, ipcMain, ipcRenderer, protocol, screen, dialog } from 'electron';

import League from './components/League';
import Watcher from './services/LeagueWatcherService';
import DrawService from './services/DrawService';
import Manager from './models/main/Manager';

import * as path from 'path';
import * as ScriptService from './services/ScriptService';

const DEBUG = (process.env.debug?.trim() == 'true');


app.whenReady().then(async () => {
    start();
});


let overlayWin;
let settingsWin;

function createOverlay() {

    const win = new BrowserWindow({
        x: 0,
        y: 0,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        width: screen.getPrimaryDisplay().workArea.width,
        height: screen.getPrimaryDisplay().workArea.height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,

        },
    });

    // ElectronRemote.enable(win.webContents);

    win.setIgnoreMouseEvents(true, { forward: false });
    win.setAlwaysOnTop(true, 'screen-saver');

    if (DEBUG) win.webContents.openDevTools({ mode: 'detach' });

    const file = path.join(__dirname, '../src/ui/overlay/overlay.html')
    win.loadFile(file);

    overlayWin = win;
    return win;
}
function createSettings() {

    const win = new BrowserWindow({
        width: 350,
        height: 500,
        x: screen.getPrimaryDisplay().workArea.width - 350,
        y: (screen.getPrimaryDisplay().workArea.height - 500) / 2,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        movable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.setAlwaysOnTop(true, 'screen-saver');

    const file = path.join(__dirname, '../src/ui/settings/settings.html')
    win.loadFile(file)

    settingsWin = win;
    return win;
}


async function start() {

    console.log('STARTING')

    const win = createOverlay();
    const sett = createSettings();


    ipcMain.on('loaded', (e, args) => {
        const isRunning = Watcher.check();
        sett.webContents.send('inGame', isRunning);
    });

    ipcMain.on('drawingContext', (e, args) => {
        if (!DEBUG) {
            if (!Watcher.isRunning) {
                e.returnValue = '[]';
                return;
            }
        }
        ScriptService.executeFunction('onDraw');
        e.returnValue = DrawService.flushContext();
    });

    await new Promise(resolve => sett.webContents.on('did-finish-load', resolve));

    await ScriptService.loadScripts();

    function sendScripts() {
        sett.webContents.send('scripts', ScriptService.getScripts().map(e => {
            return { name: e.name, settings: e.settings }
        }));
    }

    sendScripts();

    // Update settings
    ipcMain.on('settings', (e, { scriptName, id, value }) => {
        const settings = ScriptService.getScripts().find(s => s.name == scriptName).settings;
        const target = ScriptService.getSettingRaw(settings, id);
        if (!target) return;
        target.value = value;
    });

    ipcMain.on('expired', (e, args) => {
        app.exit();
    });


    ipcMain.on('reloadScripts', async () => {
        await ScriptService.loadScripts();
        sendScripts();
    });

    ipcMain.on('settingsRequest', () => {
        sendScripts();
    });

    Watcher.startLoopCheck();


    let lastOpen = 0;
    let settingsOpened = true;
    async function checkSettingsShortcut() {
        const now = Date.now();
        if (lastOpen + 550 < now) {
            const checkKey = Manager.game.winapi.actions.isPressed;
            if (checkKey(0x20) && checkKey(0x11)) {
                sett.webContents.send('toggleSettings');
                sett.setIgnoreMouseEvents(settingsOpened, { forward: false });
                settingsOpened = !settingsOpened;
                lastOpen = now;
            }
        }
        await new Promise(r => setTimeout(r, 20));
        setImmediate(checkSettingsShortcut);
    }

    checkSettingsShortcut();


    let onTickExecutor;
    Watcher.onChange = (isRunning: boolean) => {

        console.log('CHANGED', isRunning)
        win.webContents.send('inGame', isRunning);
        sett.webContents.send('inGame', isRunning);

        if (isRunning) {
            onTickExecutor = setInterval(() => {
                Manager.prepareForLoop();
                ScriptService.executeFunction('onTick');
            }, 30);

            console.log('Starting loop on renderer');
            win.webContents.send('startLoop');

        } else {
            win.webContents.send('stopLoop');
            League.closeLeagueProcess();
            clearInterval(onTickExecutor);
        }

    }


}


