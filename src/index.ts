console.log('ELECTRON', process.versions.electron, 'NODE', process.versions.node, process.arch);

import * as ElectronRemote from '@electron/remote/main';
ElectronRemote.initialize();

import { app, BrowserWindow, ipcMain, screen } from 'electron';

import League from './components/League';
import Watcher from './services/LeagueWatcherService';
import DrawService from './services/DrawService';
import Manager from './models/main/Manager';

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


    ipcMain.on('drawingContext', (e, args) => {
        if (!Watcher.isRunning) {
            e.returnValue = '[]';
            return;
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
    });

    ipcMain.on('settingsRequest', () => {
        sendScripts();
    });

    Watcher.startLoopCheck();

    let onTickExecutor;
    let readDataInterval;

    Watcher.onChange = (isRunning: boolean) => {
        console.log('CHANGED', isRunning)

        if (isRunning) {

            League.openLeagueProcess();

            ScriptService.executeFunction('setup');

            onTickExecutor = setInterval(() => {
                Manager.prepareForLoop();
                ScriptService.executeFunction('onTick');
            }, 30);

            win.webContents.send('startLoop');

        } else {
            win.webContents.send('stopLoop');
            League.closeLeagueProcess();
            clearInterval(onTickExecutor);
            clearInterval(readDataInterval);
        }

    }




}


