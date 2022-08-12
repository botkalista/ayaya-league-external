
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

/**
 * @param {DrawContext} ctx 
 * @param {Manager} manager 
 */
function drawMissiles(ctx, manager) {
    ctx.raw('drawMissiles');
}

module.exports = { setup, onDraw }