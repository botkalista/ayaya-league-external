import AyayaLeague from './LeagueReader'
import { BrowserWindow, app, ipcMain } from 'electron';
import { Spell } from './models/Spell';
import { Entity } from './models/Entity';

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
        skipTaskbar: false,
        transparent: true
    });
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setIgnoreMouseEvents(true);
    win.loadFile('../static/index.html');
    return win;
}

const renderer = AyayaLeague.getRenderBase();
const screen = AyayaLeague.getScreenSize(renderer);

let gameTime;
let matrix;
let highestReadTime = 0;

function loop(sendObject) {

    const start = performance.now();

    gameTime = AyayaLeague.getGameTime();

    const _matrix = AyayaLeague.getViewProjectionMatrix();
    matrix = AyayaLeague.matrixToArray(_matrix);

    const me = AyayaLeague.getLocalPlayer();
    sendObject('me', prepareChampion(me));

    const entities = AyayaLeague.getEntities();
    const groupEntities = AyayaLeague.groupEntities(entities, me.team);
    const enemyChampions = groupEntities.enemyChampions.map(e => prepareChampion(e));


    const end = performance.now();
    const readingTime = end - start;
    if (readingTime > highestReadTime) highestReadTime = readingTime;

    sendObject('gameData', {
        enemyChampions, performance: {
            time: parseFloat(readingTime.toFixed(1)),
            max: parseFloat(highestReadTime.toFixed(1))
        }
    });

    setTimeout(() => loop(sendObject), 16);
}



function prepareSpell(data: Spell) {
    const result = { cd: data.getSeconds(gameTime) }
    return result;
}

function prepareChampion(data: Entity) {
    const screenPos = AyayaLeague.worldToScreen(data.pos, screen, matrix);

    const result = {
        x: screenPos.x, y: screenPos.y,
        hp: parseInt(data.hp.toFixed(0)),
        maxHp: parseInt(data.maxHp.toFixed(0)),
        range: parseInt(data.range.toFixed(0)),
        vis: data.visible,
        spells: data.spells.map(e => prepareSpell(e))
    }

    return result;
}


app.whenReady().then(() => {
    const win = createOverlay();

    const screenSizeInterval = setInterval(() => {
        win.webContents.send('setScreenSize', JSON.stringify(screen));
        win.setSize(screen.x, screen.y);
    }, 2000);

    function sendObject(name, obj) {
        win.webContents.send(name, JSON.stringify(obj));
    }

    loop(sendObject);

    ipcMain.on('screenSizeOK', (e, message) => {
        // clearInterval(screenSizeInterval);
    });

});