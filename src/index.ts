console.log('ELECTRON', process.versions.electron, 'NODE', process.versions.node, process.arch);

import * as ElectronRemote from '@electron/remote/main';
ElectronRemote.initialize();

import { app, BrowserWindow, ipcMain, protocol, screen } from 'electron';

import League from './components/League';
import Watcher from './services/LeagueWatcherService';
import DrawService from './services/DrawService';
import Manager from './models/main/Manager';

// import WinApi from './components/winapi/Winapi';

import * as path from 'path';
import * as ScriptService from './services/ScriptService';

const DEBUG = (process.env.debug.trim() == 'true');

app.whenReady().then(start);

let marketWin;

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

    ElectronRemote.enable(win.webContents);

    win.setIgnoreMouseEvents(true, { forward: true });
    win.setAlwaysOnTop(true, 'screen-saver');

    if (DEBUG) win.webContents.openDevTools({ mode: 'detach' });

    const file = path.join(__dirname, '../src/ui/view/index.html')
    win.loadFile(file);

    return win;
}

function createMarket() {

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.setAlwaysOnTop(true, 'screen-saver');
    win.setMenu(null);
    win.loadURL('https://www.ayayaleague.com/market');

    marketWin = win;
    return win;
}



async function start() {

    const win = createOverlay();

    ipcMain.on('openMarket', (e, args) => {
        if (!marketWin) createMarket();
    });

    ipcMain.on('loaded', (e, args) => {
        const isRunning = Watcher.check();
        win.webContents.send('inGame', isRunning);
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


    await new Promise(resolve => win.webContents.on('did-finish-load', resolve));


    await ScriptService.loadScripts();


    function sendScripts() {
        win.webContents.send('scripts', ScriptService.getScripts().map(e => {
            return { name: e.name, settings: e.settings }
        }));
    }

    sendScripts();

    ipcMain.on('settings', (e, { scriptName, id, value }) => {
        const settings = ScriptService.getScripts().find(s => s.name == scriptName).settings;
        const target = ScriptService.getSettingRaw(settings, id);
        if (!target) return;
        target.value = value;
    });

    ipcMain.on('reloadScripts', () => {
        ScriptService.reloadScripts();
        sendScripts();
        if (Watcher.isRunning) ScriptService.executeFunction('setup');

    });

    ipcMain.on('settingsRequest', () => {
        sendScripts();
    });

    Watcher.startLoopCheck();

    let onTickExecutor;
    Watcher.onChange = (isRunning: boolean) => {
        console.log('CHANGED', isRunning)

        win.webContents.send('inGame', isRunning);

        if (isRunning) {

            console.log('Opening league process')
            League.openLeagueProcess();

            ScriptService.executeFunction('setup');

            onTickExecutor = setInterval(() => {
                const start = performance.now();
                Manager.prepareForLoop();
                ScriptService.executeFunction('onTick');
                const end = performance.now();
                // console.log('Tick duration:', end - start)
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


