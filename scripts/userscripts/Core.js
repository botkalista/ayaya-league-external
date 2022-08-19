
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
        { type: 'check', default: false, text: 'Show wards' },
        { type: 'check', default: true, text: 'Show Discord' },
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
    if (settings[2].value == true) drawEnemiesRange(ctx, manager);
    if (settings[3].value == true) drawMissiles(ctx, manager);
    if (settings[4].value == true) drawWards(ctx, manager);

    if (settings[5].value == true) {
        ctx.text('Join the AyayaLeague discord: https://discord.gg/qYy8Qz4Cr5', 50, 50, 22, 255);
    }
}


/**
 * @param {DrawContext} ctx 
 * @param {Manager} manager 
 */
function drawWards(ctx, manager, color) {

    const wards = manager.wards.enemies.filter(e => e.hp > 0);

    for (const ward of wards) {

        ctx.circle(ward.gamePos, 20, 10, [0, 220, 0], 2);

        if (ward.name == 'YellowTrinket') {
            const duration = ward.buffManager.byName('relicyellowward').endtime - manager.game.time;
            const pos = ward.screenPos.copy();
            pos.x -= 30;
            pos.y += 15;
            const total = 90;
            const percent = 100 / total * duration;
            ctx.rect(pos, 60, 5, undefined, 110);
            ctx.rect(pos, 60 / 100 * percent, 5, undefined, 255);
        } else {
            const hp = ward.hp;
            const pos = ward.screenPos.copy();
            pos.x -= 10;
            pos.y += 25;
            const total = ward.maxHp;
            ctx.text(`${hp}/${total}`, pos.x, pos.y, 15, 255);

        }

    }

    // let wards = manager.monsters.filter(e => {
    //     return !e.name.startsWith('SRU') &&
    //         (
    //             e.name == 'BlueTrinket' ||
    //             e.name == 'JammerDevice' ||
    //             e.name == 'YellowTrinket'
    //         )
    // });

    // ctx.text(wards.map(e => `${e.hp} | ${e.name}`).join('\n'), 50, 50, 22, 225);
    // const buffs = wards[1].buffManager.buffs.map(e => `${manager.game.time - e.endtime} | ${e.name}`);
    // ctx.text(buffs.join('\n'), 50, 170, 22, 225);


    // // wards = wards.filter(e => e.team != manager.me.team);
    // for (const ward of wards) {
    //     ctx.circle(ward.gamePos, 20, 10, [0, 220, 0], 2);
    // }
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


/**
 * @param {DrawContext} ctx 
 * @param {Manager} manager 
 */
function drawMissiles(ctx, manager) {



    for (const missile of manager.missiles) {
        if (missile.spellName.startsWith('SRU')) continue;
        if (missile.spellName.includes('BasicAttack')) continue;
        // if (missile.team == manager.me.team) continue;
        const startpos = missile.gameStartPos.copy();
        startpos.y += 100;


        const width = missile.width || 80;
        const endpos = missile.gameEndPos.sub(new manager.typings.Vector3(startpos.x, 0, startpos.z)).normalize();
        const cRange = missile.castRange || startpos.sub(missile.gameEndPos).length;

        endpos.x = endpos.x * cRange + startpos.x;
        endpos.y = startpos.y;
        endpos.z = endpos.z * cRange + startpos.z;



        const N = width;
        const L = endpos.sub(startpos).length
        const x1p = startpos.x + N * (endpos.z - startpos.z) / L;
        const x2p = endpos.x + N * (endpos.z - startpos.z) / L;
        const y1p = startpos.z + N * (startpos.x - endpos.x) / L;
        const y2p = endpos.z + N * (startpos.x - endpos.x) / L;
        const startpos_p = new manager.typings.Vector3(x1p, startpos.y, y1p);
        const endpos_p = new manager.typings.Vector3(x2p, endpos.y, y2p);

        const startpos_p_s = manager.worldToScreen(startpos_p);
        const endpos_p_s = manager.worldToScreen(endpos_p);
        const x3p = startpos.x - N * (endpos.z - startpos.z) / L;
        const x4p = endpos.x - N * (endpos.z - startpos.z) / L;
        const y3p = startpos.z - N * (startpos.x - endpos.x) / L;
        const y4p = endpos.z - N * (startpos.x - endpos.x) / L;
        const startpos_q = new manager.typings.Vector3(x3p, startpos.y, y3p);
        const endpos_q = new manager.typings.Vector3(x4p, endpos.y, y4p);
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