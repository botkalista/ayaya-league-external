const { ipcRenderer } = require('electron')

let canvas;
let me = {};
let gameData = {};


ipcRenderer.on('setScreenSize', function (evt, message) {
    const data = JSON.parse(message);
    resizeCanvas(data.x, data.y);
    ipcRenderer.send('screenSizeOK');
});

ipcRenderer.on('gameData', function (evt, message) {
    const data = JSON.parse(message);
    gameData = data;
});


ipcRenderer.on('me', function (evt, message) {
    const data = JSON.parse(message);
    me = data;
});


function setup() {
    canvas = createCanvas(10, 10);
}

function draw() {
    clear();
    stroke(0, 220, 0);
    strokeWeight(3);
    noFill();
    ellipse(me.x, me.y, me.range, me.range);

    for (const enemy of gameData.enemyChampions) {
        const { x, y, spells, vis, range } = enemy;

        if (!vis) continue;
        if (x > screen.width || y > screen.height || x < 0 || y < 0) continue;

        ellipse(x, y, range, range);

        push();
        textAlign(CENTER, CENTER);
        stroke(0);
        strokeWeight(2);
        fill(0);
        text(`D: ${spells[4].cd} | F: ${spells[5].cd}`, x, y + 150);
        pop();
    }

    textSize(20);
    noStroke();
    fill(0);
    text(JSON.stringify(gameData.performance), 20, 20);
}