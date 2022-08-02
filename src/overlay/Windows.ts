
import { BrowserWindow } from 'electron';

export function createOverlayWindow() {
    const win = new BrowserWindow({
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        transparent: true
    });
    win.setMenu(null);
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setIgnoreMouseEvents(true);
    win.loadFile('../static/index.html');
    return win;
}

export function createSettingsWindow() {
    const win = new BrowserWindow({
        width: 250,
        height: 300,
        x: 250,
        y: 250,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        transparent: true,
        frame: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        skipTaskbar: true,
    });
    win.setMenu(null);
    win.setAlwaysOnTop(true, 'screen-saver');
    win.loadFile('../static/settings.html');
    win.hide();
    return win;
}