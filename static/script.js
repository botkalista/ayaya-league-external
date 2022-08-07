
const { ipcRenderer } = require('electron');

let gameData = {};
let settings = {};

let assets = {};

let spellsData = {}

function preload() {
    spellsData = loadJSON('data/missiles.json');
}

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


//* -----------------------------------------------


function __internal_worldToScreen(pos, screenSize, viewProjMatrix) {
    const out = { x: 0, y: 0 }
    const screen = { x: screenSize.x, y: screenSize.y };
    const clipCoords = { x: 0, y: 0, z: 0, w: 0 }
    clipCoords.x = pos.x * viewProjMatrix[0] + pos.y * viewProjMatrix[4] + pos.z * viewProjMatrix[8] + viewProjMatrix[12];
    clipCoords.y = pos.x * viewProjMatrix[1] + pos.y * viewProjMatrix[5] + pos.z * viewProjMatrix[9] + viewProjMatrix[13];
    clipCoords.z = pos.x * viewProjMatrix[2] + pos.y * viewProjMatrix[6] + pos.z * viewProjMatrix[10] + viewProjMatrix[14];
    clipCoords.w = pos.x * viewProjMatrix[3] + pos.y * viewProjMatrix[7] + pos.z * viewProjMatrix[11] + viewProjMatrix[15];
    if (clipCoords.w < 1.0) clipCoords.w = 1;
    const m = { x: 0, y: 0, z: 0 };
    m.x = clipCoords.x / clipCoords.w;
    m.y = clipCoords.y / clipCoords.w;
    m.z = clipCoords.z / clipCoords.w;
    out.x = (screen.x / 2 * m.x) + (m.x + screen.x / 2);
    out.y = -(screen.y / 2 * m.y) + (m.y + screen.y / 2);
    return out;
}
function __internal_getCircle3D(pos, points, radius, screenSize, viewProjMatrixArg) {

    const p = Math.PI * 2 / points;
    const result = []

    for (let a = 0; a < Math.PI * 2; a += p) {
        const start = {
            x: radius * Math.cos(a) + pos.x,
            y: radius * Math.sin(a) + pos.z,
            z: pos.y
        }
        const end = {
            x: radius * Math.cos(a + p) + pos.x,
            y: radius * Math.sin(a + p) + pos.z,
            z: pos.y
        }
        const start2 = { x: start.x, y: start.z, z: start.y }
        const end2 = { x: end.x, y: end.z, z: end.y }
        const startScreen = __internal_worldToScreen(start2, screenSize, viewProjMatrixArg);
        const endScreen = __internal_worldToScreen(end2, screenSize, viewProjMatrixArg);
        result.push([startScreen, endScreen]);
    }

    return result;

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

            try {
                image(img, xPos, y, W, H);
            } catch (ex) {
                noStroke();
                fill(0);
                rect(xPos, y, W, H);
            }

            if (spell.cd > 0 || spell.level == 0) {
                noStroke();
                fill(0, 0, 0, 150);
                rect(xPos, y, W, H);
                if (spell.level > 0) {
                    noStroke();
                    fill(255);
                    text(spell.cd, xPos, y, W, H);
                }
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
    const me = gameData.me;
    const screen = gameData.screen;
    const matrix = gameData.matrix;
    const points = __internal_getCircle3D(me.pos, 50, me.range, screen, matrix);

    push();
    stroke(120);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < points.length; i++) {
        line(points[i][0].x, points[i][0].y, points[i][1].x, points[i][1].y);
    }



    pop();
}

function drawEnemiesRange() {

    const screen = gameData.screen;
    const matrix = gameData.matrix;

    push();

    stroke(120, 20, 20);
    strokeWeight(2);
    noFill();

    for (const enemy of gameData.enemyChampions) {
        const { x, y, vis, range } = enemy;
        const points = __internal_getCircle3D(enemy.pos, 50, range, screen, matrix);
        if (!vis) continue;
        if (x > screen.width || y > screen.height || x < 0 || y < 0) continue;

        for (let i = 0; i < points.length; i++) {
            line(points[i][0].x, points[i][0].y, points[i][1].x, points[i][1].y);
        }

    }

    pop();
}

function drawMissiles() {

    const screen = gameData.screen;
    const matrix = gameData.matrix;

    for (const missile of gameData.missiles) {

        if (missile.spellName.startsWith('SRU')) continue;
        if (missile.spellName.includes('BasicAttack')) continue;


        const width = spellsData.EzrealQ.width;
        const length = dist(missile.sPos.x, missile.sPos.y, missile.ePos.x, missile.ePos.y);
        const angle = createVector(missile.ePos.x - missile.sPos.x, missile.ePos.y - missile.sPos.y).heading();

        const startpos = createVector(missile.sPos.x, missile.sPos.y, missile.sPos.z);
        const endpos = createVector(missile.ePos.x, missile.ePos.y, missile.ePos.z);
        const N = width;
        const L = p5.Vector.sub(endpos, startpos).mag();
        const x1p = startpos.x + N * (endpos.z - startpos.z) / L;
        const x2p = endpos.x + N * (endpos.z - startpos.z) / L;
        const y1p = startpos.z + N * (startpos.x - endpos.x) / L;
        const y2p = endpos.z + N * (startpos.x - endpos.x) / L;
        const startpos_p = createVector(x1p, startpos.y, y1p);
        const endpos_p = createVector(x2p, endpos.y, y2p);
        const startpos_p_s = __internal_worldToScreen(startpos_p, screen, matrix);
        const endpos_p_s = __internal_worldToScreen(endpos_p, screen, matrix);
        const x3p = startpos.x - N * (endpos.z - startpos.z) / L;
        const x4p = endpos.x - N * (endpos.z - startpos.z) / L;
        const y3p = startpos.z - N * (startpos.x - endpos.x) / L;
        const y4p = endpos.z - N * (startpos.x - endpos.x) / L;
        const startpos_q = createVector(x3p, startpos.y, y3p);
        const endpos_q = createVector(x4p, endpos.y, y4p);
        const startpos_q_s = __internal_worldToScreen(startpos_q, screen, matrix);
        const endpos_q_s = __internal_worldToScreen(endpos_q, screen, matrix);


        const sPos1 = startpos_p_s;
        const sPos2 = startpos_q_s;
        const ePos1 = endpos_p_s;
        const ePos2 = endpos_q_s;


        // stroke(0);
        // line(sPos1.x, sPos1.y, sPos2.x, sPos2.y);
        // line(sPos2.x, sPos2.y, ePos1.x, ePos1.y);
        // line(ePos1.x, ePos1.y, ePos2.x, ePos2.y);
        // line(ePos2.x, ePos2.y, sPos1.x, sPos1.y);


        stroke(255);
        noFill();
        beginShape();
        vertex(sPos1.x, sPos1.y);
        vertex(ePos1.x, ePos1.y);
        vertex(ePos2.x, ePos2.y);
        vertex(sPos2.x, sPos2.y);
        endShape(CLOSE);

        // push();
        // stroke(200, 0, 0);
        // noFill();
        // translate(missile.sPos.x, missile.sPos.y);
        // rotate(angle);
        // stroke(50);
        // strokeWeight(2);
        // fill(50, 100);
        // rect(0, -width / 2, length, width);

        // noStroke();
        // fill(0);
        // // text(missile.spellName, 0, 0, 100, 20)
        // pop();



        // fill(0, 100);
        // stroke(0, 100);
        // const o = missile.debug.off;
        // beginShape();
        // for (const p of missile.debug.points) {
        //     // ellipse(p.x + o.x, p.y + o.y, 20, 20);
        //     vertex(p.x + o.x, p.y + o.y);
        // }
        // endShape();

    }


}

function drawMissiles_old() {

    const screen = gameData.screen;
    const matrix = gameData.matrix;

    for (const missile of gameData.missiles) {

        if (missile.spellName.startsWith('SRU')) continue;
        if (missile.spellName.includes('BasicAttack')) continue;

        push();

        const _sPos = missile.sPos;
        const _ePos = missile.ePos;

        const sPos = __internal_worldToScreen(_sPos, screen, matrix);
        const ePos = __internal_worldToScreen(_ePos, screen, matrix);

        const angle = createVector(ePos.x - sPos.x, ePos.y - sPos.y).heading();
        const length = dist(sPos.x, sPos.y, ePos.x, ePos.y);

        const width = spellsData.EzrealW.width;

        stroke(200, 0, 0);
        noFill();
        translate(sPos.x, sPos.y);
        rotate(angle);
        stroke(50);
        strokeWeight(2);
        fill(50, 100);
        rect(0, -width / 2, length, width);

        noStroke();
        fill(0);
        // text(missile.spellName, 0, 0, 100, 20)
        pop();



        // fill(0, 100);
        // stroke(0, 100);
        // const o = missile.debug.off;
        // beginShape();
        // for (const p of missile.debug.points) {
        //     // ellipse(p.x + o.x, p.y + o.y, 20, 20);
        //     vertex(p.x + o.x, p.y + o.y);
        // }
        // endShape();

    }


}

function draw() {
    clear();

    if (!gameData) return;

    if (!settings) return;
    if (gameData.me && settings.me && settings.me.range) drawPlayerRange();
    if (gameData.enemyChampions && settings.nmeChamps && settings.nmeChamps.range) drawEnemiesRange();
    if (gameData.enemyChampions && settings.over && settings.over.nmeSpells) drawOverlayEnemySpells();
    if (gameData.missiles && settings.missiles && settings.missiles.show) drawMissiles();

    textSize(20);
    noStroke();
    fill(255);
    if (gameData.performance && settings.over && settings.over.performance) {

        const _time = (gameData.performance.time || 0).toFixed(1);
        const max = (gameData.performance.max || 0).toFixed(1);
        text(`ReadTime: ${settings.root.readingTime} ms\nTime: ${_time} ms\nMax: ${max} ms\nMissiles: ${gameData.missiles.length}`, 20, 250);
    }
}
