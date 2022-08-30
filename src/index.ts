console.log('ELECTRON', process.versions.electron, 'NODE', process.versions.node, process.arch);

import * as ElectronRemote from '@electron/remote/main';
ElectronRemote.initialize();

import { app, BrowserWindow, ipcMain, screen } from 'electron';

import League from './components/League';
import Watcher from './services/LeagueWatcherService';
import DrawService from './services/DrawService';

import * as path from 'path';
import * as ScriptService from './services/ScriptService';

app.whenReady().then(start);

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

    win.webContents.openDevTools({ mode: 'detach' });

    const file = path.join(__dirname, '../src/ui/view/index.html')
    win.loadFile(file);

    return win;
}

async function start() {

    const win = createOverlay();

    DrawService.attachOverlay(win);

    await ScriptService.loadScripts();

    Watcher.startLoopCheck();

    let onTickExecutor;
    let onDrawExecutor;

    ipcMain.on('drawingContext', (e, args) => {
        if (!Watcher.isRunning) return;
        ScriptService.executeFunction('onDraw');
        e.returnValue = DrawService.flushContext();
    });

    Watcher.onChange = (isRunning: boolean) => {
        console.log('CHANGED', isRunning)

        if (isRunning) {

            League.openLeagueProcess();

            ScriptService.executeFunction('setup');

            onTickExecutor = setInterval(() => {
                ScriptService.executeFunction('onTick');
            }, 30);

        } else {
            League.closeLeagueProcess();
            clearInterval(onTickExecutor);
            clearInterval(onDrawExecutor);
        }

    }


}


