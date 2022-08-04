
const { ipcRenderer } = require('electron');


let gameData = {};
let settings = {};

let assets = {};

function getChampionImage(name) {
    if (assets[name]) return assets[name];
    const img = createImg(`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${name}.png`, name);
    img.hide();
    assets[name] = img;
}

function getSpellImage(name) {
    if (assets[name]) return assets[name];
    const img = createImg(`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/${name}.png`, name);
    img.hide();
    assets[name] = img;
}

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
        console.log('gotsettings', data)
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

        const { spells, name, maxHp, hp } = gameData.enemyChampions[i];


        const iStart = 3;
        const W = 45;
        const H = 45;
        const S1 = 10;
        const S = 5;

        const x = 30;
        const y = 30 + (H + 10) * i;


        const img = getChampionImage(name);
        try {
            if (!img) throw Error('noimage')
            image(img, x, y, W, H);
        } catch (ex) {
            noStroke();
            fill(0);
            rect(x, y, W, H);
        }


        for (let i = iStart; i < 6; i++) {
            const spell = spells[i];
            if (!spell) continue;
            const img = getSpellImage(spell.name);
            if (!img) continue;

            const xPos = x + (W + S + S1) + (W + S) * (i - iStart);

            image(img, xPos, y, W, H);
            if (spell.cd > 0) {
                noStroke();
                fill(0, 0, 0, 150);
                rect(xPos, y, W, H);
                noStroke();
                fill(255);
                text(spells[4].cd, xPos, y, W, H);
            }
        }


        const pad = 3;
        const hei = 4;

        const val = parseInt(100 / maxHp * hp);

        noStroke();

        fill(100);
        rect(x + pad, y + H - hei - pad, W - pad * 2, hei);
        fill(0, 200, 0);
        rect(x + pad, y + H - hei - pad, (W - pad * 2) / 100 * val, hei);


        // const spellImg1 = getSpellImage(spells[4].name);
        // try {
        //     if (!spellImg1) throw Error('noimage');
        //     image(spellImg1, x + 40 + 5, y, 40, 40);
        //     if (spells[4].cd > 0) {
        //         noStroke();
        //         fill(0, 0, 0, 100);
        //         rect(x + 40 + 5, y, 40, 40)
        //     }
        // } catch (ex) { }

        // const spellImg2 = getSpellImage(spells[5].name);

        // try {
        //     if (!spellImg2) throw Error('noimage');
        //     image(spellImg2, x + 40 + 5 + 40 + 5, y, 40, 40);
        //     if (spells[5].cd > 0) {
        //         noStroke();
        //         fill(0, 0, 0, 100);
        //         rect(x + 40 + 5 + 40 + 5, y, 40, 40)
        //     }
        // } catch (ex) { }

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
        if (spells.length < 6) continue;
        if (!vis) continue;
        if (x > screen.width || y > screen.height || x < 0 || y < 0) continue;
        text(`D: ${spells[4].cd} | F: ${spells[5].cd}`, x - 100, y + 100);
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
    fill(255);
    if (gameData.performance && settings.over && settings.over.performance) {

        const _time = (gameData.performance.time || 0).toFixed(1);
        const max = (gameData.performance.max || 0).toFixed(1);
        const readings = (gameData.performance.readings || []).map(e => {
            return `${e.name}: ${e.delta.toFixed(1)}`
        });
        text(`Time: ${_time} ms\nMax: ${max} ms\nReadTime: ${settings.root.readingTime} ms\nReads:\n${readings.join('\n')}`, 20, 250);
    }
}