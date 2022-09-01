function _draw_textAt(str, x, y, size, color) {
    textSize(size);
    noStroke();
    fill(color);
    text(str, x, y);
}

function _draw_circleAt(x, y, size, color) {
    noFill();
    stroke(color);
    ellipse(x, y, size, size);
}

function _draw_circle3D(points, weight, color) {
    noFill();
    stroke(color);
    strokeWeight(weight);
    for (let i = 0; i < points.length; i++) {
        line(points[i][0].x, points[i][0].y, points[i][1].x, points[i][1].y);
    }
}



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