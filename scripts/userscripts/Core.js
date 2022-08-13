
/**
 * @typedef {import('../../src/models/drawing/DrawContext').DrawContext} DrawContext
 * @typedef {import('../UserScriptManager').UserScriptManager} Manager
 */

function setup() {
    console.log('Core.js loaded.');

    const core_settings = [
        { type: 'check', default: false, text: 'Player range' },
        { type: 'color', default: 0, text: 'Player range color' },
        { type: 'check', default: false, text: 'Enemies range' },
        { type: 'check', default: false, text: 'Show missiles' },
    ];

    return core_settings;
}


/**
 * @param {*} ctx 
 * @param {Manager} manager 
 * @param {*} settings 
 */
function onDraw(ctx, manager, settings) {

    if (settings[0].value == true) drawPlayerRange(ctx, manager, settings[1].value);
    if (settings[2].value == true) drawPlayerRange(ctx, manager);
    if (settings[3].value == true) drawMissiles(ctx, manager);
}

/**
 * @param {DrawContext} ctx 
 * @param {Manager} manager 
 */
function drawPlayerRange(ctx, manager, color) {
    const me = manager.me;
    ctx.circle(me.gamePos, me.range, 50, color, 2);
}

/**
 * @param {DrawContext} ctx 
 * @param {Manager} manager 
 */
function drawEnemiesRange(ctx, manager) {
    for (const enemy of manager.champions.enemies) {
        if (!enemy.visible) continue;
        ctx.circle(enemy.gamePos, enemy.range, 50, 120, 2);
    }
}


function createVector(base, x, y, z) {
    const v = base.copy();
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
}

/**
 * @param {DrawContext} ctx 
 * @param {Manager} manager 
 */
function drawMissiles(ctx, manager) {

    for (const missile of manager.missiles) {
        if (missile.spellName.startsWith('SRU')) continue;
        if (missile.spellName.includes('BasicAttack')) continue;
        if (missile.team == manager.me.team) continue;

        const startpos = missile.gameStartPos.copy();
        startpos.y += 100;

        const width = missile.width || 80;

        const endpos = missile.gameEndPos.sub(startpos.x, 0, startpos.z).normalize();

        const cRange = missile.castRange || startpos.sub(missile.gameEndPos.x, missile.gameEndPos.y, missile.gameEndPos.z).length;

        endpos.x = endpos.x * cRange + startpos.x;
        endpos.y = startpos.y;
        endpos.z = endpos.z * cRange + startpos.z;


        const N = width;
        const L = endpos.sub(startpos.x, startpos.y, startpos.z).length
        const x1p = startpos.x + N * (endpos.z - startpos.z) / L;
        const x2p = endpos.x + N * (endpos.z - startpos.z) / L;
        const y1p = startpos.z + N * (startpos.x - endpos.x) / L;
        const y2p = endpos.z + N * (startpos.x - endpos.x) / L;
        const startpos_p = createVector(startpos, x1p, startpos.y, y1p);
        const endpos_p = createVector(startpos, x2p, endpos.y, y2p);

        const startpos_p_s = manager.worldToScreen(startpos_p);
        const endpos_p_s = manager.worldToScreen(endpos_p);
        const x3p = startpos.x - N * (endpos.z - startpos.z) / L;
        const x4p = endpos.x - N * (endpos.z - startpos.z) / L;
        const y3p = startpos.z - N * (startpos.x - endpos.x) / L;
        const y4p = endpos.z - N * (startpos.x - endpos.x) / L;
        const startpos_q = createVector(startpos, x3p, startpos.y, y3p);
        const endpos_q = createVector(startpos, x4p, endpos.y, y4p);
        const startpos_q_s = manager.worldToScreen(startpos_q);
        const endpos_q_s = manager.worldToScreen(endpos_q);

        const sPos1 = startpos_p_s;
        const sPos2 = startpos_q_s;
        const ePos1 = endpos_p_s;
        const ePos2 = endpos_q_s;

        ctx.raw('stroke', 255);
        ctx.raw('noFill');
        ctx.raw('beginShape');
        ctx.raw('vertex', sPos1.x, sPos1.y);
        ctx.raw('vertex', ePos1.x, ePos1.y);
        ctx.raw('vertex', ePos2.x, ePos2.y);
        ctx.raw('vertex', sPos2.x, sPos2.y);
        ctx.raw('endShape', 'close');


    }


}

module.exports = { setup, onDraw }