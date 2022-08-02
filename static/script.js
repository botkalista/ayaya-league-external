
const { ipcRenderer } = require('electron');


let gameData = {};
let settings = {};

function addHandlars() {
    // ----- Screen size -----
    ipcRenderer.on('dataScreenSize', function (evt, message) {
        const data = JSON.parse(message);
        resizeCanvas(data.x, data.y);
    });
    ipcRenderer.send('requestScreenSize');


    // ----- Settings -----
    ipcRenderer.on('dataSettings', function (evt, message) {
        const data = JSON.parse(message);
        console.log('gotsettings')
        settings = data;
    });
    ipcRenderer.send('requestSettings');


    // ----- Game data -----
    ipcRenderer.on('gameData', function (evt, message) {
        const data = JSON.parse(message);
        gameData = data;
    });
}


function setup() {
    canvas = createCanvas(10, 10);
    addHandlars();
    // frameRate(50);
}

function drawOverlayEnemySpells() {
    push();

    textAlign(CENTER, CENTER);

    for (let i = 0; i < gameData.enemyChampions.length; i++) {

        const { spells } = gameData.enemyChampions[i];

        const x = 30;
        const y = 30 + 45 * i;

        noStroke();
        fill(0);
        rect(x, y, 40, 40);

        fill(255);
        text(spells[4].cd, x + 40 + 5, y, 40, 40);
        text(spells[5].cd, x + 40 + 5 + 40, y, 40, 40);

    }

    pop();
}

function drawPlayerRange() {
    push();

    stroke(0, 220, 0);
    strokeWeight(3);
    noFill();

    const { me } = gameData;

    ellipse(me.x, me.y, me.range, me.range);

    pop();
}

function drawEnemiesRange() {
    push();

    stroke(0, 220, 0);
    strokeWeight(3);
    noFill();

    for (const enemy of gameData.enemyChampions) {
        const { x, y, vis, range } = enemy;
        if (!vis) continue;
        if (x > screen.width || y > screen.height || x < 0 || y < 0) continue;
        ellipse(x, y, range * 1.2, range * 1.2);
    }

    pop();
}

function drawEnemiesSpells() {
    push();

    stroke(0);
    strokeWeight(2);
    fill(0);

    for (const enemy of gameData.enemyChampions) {
        const { x, y, vis, spells } = enemy;
        if (!vis) continue;
        if (x > screen.width || y > screen.height || x < 0 || y < 0) continue;
        text(`D: ${spells[4].cd} | F: ${spells[5].cd}`, x, y + 150);
    }

    pop();
}

function draw() {
    clear();

    if (!settings) return;

    if (gameData.me && settings.me && settings.me.range) drawPlayerRange();
    if (gameData.enemyChampions && settings.nmeChamps && settings.nmeChamps.range) drawEnemiesRange();
    if (gameData.enemyChampions && settings.nmeChamps && settings.nmeChamps.spells) drawEnemiesSpells();
    if (gameData.enemyChampions && settings.over && settings.over.nmeSpells) drawOverlayEnemySpells();

    textSize(20);
    noStroke();
    fill(0);
    if (gameData.performance && settings.over && settings.over.performance) text(JSON.stringify(gameData.performance), 20, 20);
}