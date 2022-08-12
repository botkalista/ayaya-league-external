
const { ipcRenderer } = require('electron');


function preload() {
    spellsData = loadJSON('../data/missiles.json');
}

function setup() {
    canvas = createCanvas(10, 10);
    addHandlars();
}

function __saveData(payload) {
    const [key, fn, ...args] = payload;
    const value = window[fn] && window[fn](...args);
    __savedData.set(key, value);
}

function __getData(key) {
    return __savedData.get(key);
}

function __drawCircle3dFromSavedData(key) {
    const data = __getData(key);
    for (let i = 0; i < data.length; i++) {
        line(data[i][0].x, data[i][0].y, data[i][1].x, data[i][1].y);
    }
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

function drawMissiles() {

    const screen = gameData.screen;
    const matrix = gameData.matrix;

    for (const missile of gameData.missiles) {

        if (missile.spellName.startsWith('SRU')) continue;
        if (missile.spellName.includes('BasicAttack')) continue;


        const width = spellsData.EzrealQ.width;
        const length = dist(missile.sPos.x, missile.sPos.y, missile.ePos.x, missile.ePos.y);
        const angle = createVector(missile.ePos.x - missile.sPos.x, missile.ePos.y - missile.sPos.y).heading();

        const startpos = createVector(missile.sPos.x, missile.sPos.y + 100, missile.sPos.z);
        const endpos = createVector(missile.ePos.x, missile.ePos.y + 100, missile.ePos.z);
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


const maxReads = {}

function draw() {
    clear();

    if (!gameData) return;

    if (!baseSettings) return;

    // if (gameData.me && settings.me && settings.me.range) drawPlayerRange();
    // if (gameData.enemyChampions && settings.nmeChamps && settings.nmeChamps.range) drawEnemiesRange();
    // if (gameData.missiles && settings.missiles && settings.missiles.show) drawMissiles();
    if (gameData.enemyChampions && baseSettings.overlaySpells) drawOverlayEnemySpells();

    textSize(20);
    noStroke();
    fill(255);
    if (gameData.performance && baseSettings.debugPerformance) {
        const _time = (gameData.performance.time || 0).toFixed(1);
        const max = (gameData.performance.max || 0).toFixed(1);
        text(`Time: ${_time} ms\nMax: ${max} ms`, 20, 250);
        const reads = gameData.performance.reads.map(e => {
            if (maxReads[e.name] && maxReads[e.name] > e.delta) return `${e.name}: ${e.delta.toFixed(0)} | ${maxReads[e.name].toFixed(0)}`;
            maxReads[e.name] = e.delta;
            return `${e.name}: ${e.delta.toFixed(0)} | ${maxReads[e.name].toFixed(0)}`;
        });
        text(`Reads:\n${reads.join('\n')}`, 20, 500);
    }

    try {
        const commands = JSON.parse(ipcRenderer.sendSync('drawingContext'));
        for (const command of commands) {
            const [fn, ...args] = command;
            window[fn] && window[fn](...args);
        }
    } catch (ex) {
        console.error(ex);
    }

}
