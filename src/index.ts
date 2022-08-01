import AyayaLeague from './LeagueReader'
import { BrowserWindow, app, ipcMain } from 'electron';

function createOverlay() {
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
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setIgnoreMouseEvents(true);
    win.loadFile('../static/index.html');
    return win;
}



app.whenReady().then(() => {
    const win = createOverlay();

    const renderer = AyayaLeague.getRenderBase();
    const screen = AyayaLeague.getScreenSize(renderer);
    const screenSizeInterval = setInterval(() => {
        win.webContents.send('setScreenSize', JSON.stringify(screen));
        win.setSize(screen.x, screen.y);
    }, 500);

    function loop() {
        const me = AyayaLeague.getLocalPlayer();
        const location = AyayaLeague.worldToScreen(me.pos, screen);
        win.webContents.send('me_pos', JSON.stringify(location));
        setTimeout(loop, 10);
    }

    loop();

    ipcMain.on('screenSizeOK', (e, message) => {
        clearInterval(screenSizeInterval);
    });

});