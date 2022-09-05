const { ipcRenderer } = require('electron');

let assetsManager;

function setup() {
    const canvas = createCanvas(screen.width, screen.height);
    canvas.elt.style.position = 'absolute';
    canvas.elt.style.top = '0';
    canvas.elt.style.left = '0';
    canvas.elt.style.zIndex = '-10';

    ipcRenderer.on('startLoop', () => {
        console.log('LoopStarted')
        loop();
    });
    ipcRenderer.on('stopLoop', () => {
        console.log('LoopStopped')
        noLoop();
    });

    ipcRenderer.send('settingsRequest');

    assetsManager = assets_manager_scoped()

    noLoop();
}

const graphBuffer = [];

function draw() {
    graphBuffer.length = 0;
    clear();

    try {
        const commands = JSON.parse(ipcRenderer.sendSync('drawingContext'));
        graphBuffer.push(...commands);
        for (const command of commands) {
            const [fn, ...args] = command;
            window['_draw_' + fn] && window['_draw_' + fn](...args);
        }
    } catch (ex) {
        console.error(ex);
    }

}