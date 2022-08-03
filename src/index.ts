import { BrowserWindow, app, ipcMain, globalShortcut, IpcMainEvent, WebContents } from 'electron';
import AyayaLeague from './LeagueReader';
import { createOverlayWindow, createSettingsWindow } from './overlay/Windows'
import { loadSettingsFromFile, setSettings, saveSettingsToFile, getSettings } from './overlay/Settings'
import { Settings } from './overlay/models/Settings';
import { Vector2 } from './models/Vector';
import { Preparator } from './overlay/Preparator';
import { matrixToArray } from './utils/Utils';
import { Performance } from './utils/Performance';

if (process.argv[2] == 'nohook') { AyayaLeague.reader.setMode("DUMP"); AyayaLeague.reader.loadDump(); }


const preparator = new Preparator(AyayaLeague);

let overlayWindow: BrowserWindow;
let settingsWindow: BrowserWindow;

let highestReadTime = 0;

let renderer: number;
let screen: Vector2;

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

    onMessage<Settings>('updateSettings', (e, data) => {
        setSettings(data);
        saveSettingsToFile();
        sendMessageToWin(overlayWindow, 'dataSettings', data);
        sendMessageToWin(settingsWindow, 'dataSettings', data);
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


}

function main() {

    loadSettingsFromFile();
    registerHandlers();

    overlayWindow = createOverlayWindow();
    settingsWindow = createSettingsWindow();

    renderer = AyayaLeague.getRenderBase();
    screen = AyayaLeague.getScreenSize(renderer);
    overlayWindow.setSize(screen.x, screen.y);

    //* SHORTCUTS
    globalShortcut.register('CommandOrControl+Space', () => {
        settingsWindow.isVisible() ? settingsWindow.hide() : settingsWindow.show();
    });

    loop();

}


const performance = new Performance();

function loop() {

    performance.start();


    const gameTime = AyayaLeague.getGameTime();

    const _matrix = AyayaLeague.getViewProjectionMatrix();
    const matrix = matrixToArray(_matrix);


    const localPlayer = AyayaLeague.getLocalPlayer();
    const me = preparator.prepareChampion(localPlayer, screen, matrix, gameTime);

    performance.spot('localPlayer');

    const enemyTeamId = localPlayer.team == 100 ? 200 : 100;

    const champs = AyayaLeague.getChampionsList(undefined, performance);
    performance.spot('champsRead');
    const enemyChampions = champs.filter(e => e.team == enemyTeamId).map(e => preparator.prepareChampion(e, screen, matrix, gameTime))

    performance.spot('champsPrepare');

    // --- performance ---
    const result = performance.end();
    if (result.time > highestReadTime) highestReadTime = result.time;
    // --- performance ---


    const finalData = {
        me,
        enemyChampions,
        performance: {
            readings: result.readings,
            time: result.time,
            max: parseFloat(highestReadTime.toFixed(1))
        }
    }

    sendMessageToWin(overlayWindow, 'gameData', finalData);

    setTimeout(loop, Math.max(result.time + 10, 20));
}

app.whenReady().then(main);


app.on('will-quit', () => {
    globalShortcut.unregisterAll()
});