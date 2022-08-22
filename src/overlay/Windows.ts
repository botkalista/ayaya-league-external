
import { BrowserWindow, screen } from 'electron';

class WindowsManager {

    overlayWindow: BrowserWindow;
    settingsWindow: BrowserWindow;
    entryWindow: BrowserWindow;

    constructor() { }

    createOverlayWindow() {
        if (this.overlayWindow) return;

        const win = new BrowserWindow({
            width: 100,
            height: 100,
            x: 0,
            y: 0,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            frame: false,
            alwaysOnTop: true,
            skipTaskbar: true,
            transparent: true
        });
        win.setMenu(null);
        win.setAlwaysOnTop(true, 'screen-saver');
        win.setIgnoreMouseEvents(true);
        win.loadFile('../../static/overlay/index.html');

        this.overlayWindow = win;

        return win;
    }

    createSettingsWindow() {
        if (this.settingsWindow) return;

        const win = new BrowserWindow({
            width: 250,
            height: 380,
            x: screen.getPrimaryDisplay().workAreaSize.width / 100 * 80,
            y: 250,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
            resizable: false,
            transparent: true,
            frame: false,
            autoHideMenuBar: true,
            alwaysOnTop: true,
            skipTaskbar: true,
        });
        win.setMenu(null);
        win.setAlwaysOnTop(true, 'screen-saver');
        win.loadFile('../../static/settings/settings.html');
        //win.hide();

        this.settingsWindow = win;

        return win;
    }

    createEntryWindow() {
        if (this.entryWindow) return;

        const win = new BrowserWindow({
            width: 600,
            height: 450,
            frame: false,
            resizable: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
        });
        win.setAlwaysOnTop(true, 'screen-saver');
        win.loadFile('../../static/entry/index.html');

        this.entryWindow = win;

        return win;
    }

}

const instance = new WindowsManager();

export default instance;