const { ipcRenderer } = require('electron');

function _draw_textAt(str, x, y, size, color) {
    textSize(size);
    noStroke();
    fill(color);
    text(str, x, y);
}



function setup() {
    const canvas = createCanvas(screen.width, screen.height);
    canvas.elt.style.position = 'absolute';
    canvas.elt.style.top = '0';
    canvas.elt.style.left = '0';
}

function draw() {
    clear();

    try {
        const commands = JSON.parse(ipcRenderer.sendSync('drawingContext'));
        for (const command of commands) {
            const [fn, ...args] = command;
            window['_draw_' + fn] && window['_draw_' + fn](...args);
        }
    } catch (ex) {
        console.error(ex);
    }


}