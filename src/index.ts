
import * as Reader from './components/winapi/Winapi';

import * as ElectronRemote from '@electron/remote/main';
ElectronRemote.initialize();

import * as path from 'path';
import { app, BrowserWindow, screen } from 'electron';


    
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

app.whenReady().then(() => {

    createOverlay();

});

