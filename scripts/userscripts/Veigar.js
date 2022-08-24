// #Author: Emily
// #Description: Veigar test

/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */


const scriptChampName = 'Veigar';


/** @type {Manager} */
let manager;

function setup(_manager) {
    console.log('Veigar.js loaded.')
}

let lastPick = 0;

/** 
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(_manager, ticks) {
    if (_manager.me.name != scriptChampName) return;
    manager = _manager;

    if (!manager.game.isKeyPressed(0x5)) return;

    const spell = manager.me.spells[1];
    const spellName = manager.me.spells[1].infoName;

    if (spellName == 'PickACard' && spell.ready && manager.game.time > lastPick + 0.80) {
        manager.game.pressKey(manager.spellSlot.W);
        manager.game.releaseKey(manager.spellSlot.W);
        lastPick = manager.game.time;
    } else if (spellName == 'GoldCardLock') {
        manager.game.pressKey(manager.spellSlot.W);
        manager.game.releaseKey(manager.spellSlot.W);
    }

}

function getDamageQ() {
    const baseDamage = [80, 120, 160, 200, 240][manager.me.spells[0].level - 1];
    const scalingDamage = 0.6 * manager.me.ap;
    return baseDamage + scalingDamage;
}

function isCollectable(target) {
    return manager.utils.calculateMagicDamage(manager.me, target, getDamageQ()) >= target.hp;
}


/** 
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, _manager, settings) {
    manager = _manager;

    ctx.text((manager.me.address).toString(16), 50, 50, 22, 255);

    return;
    // Q helper
    const closeThings = manager.utils.genericInRange(manager.minions.enemies, 2500);
    const collectableThings = closeThings.filter(isCollectable);
    for (const thing of collectableThings) ctx.circle(thing.gamePos, 30, 40, [0, 0, 220, 90], 3);

    // Q counter
    const cost = [30, 34, 40, 45, 50][manager.spell[0].level - 1];
    const count = Math.floor(manager.me.mana / cost);

    const hpbarPos = manager.utils.getHealthBarPosition(manager.me);

    ctx.text(count + ' Q', hpbarPos.x + 114, hpbarPos.y - 7, 14, 255);

}


module.exports = { setup, onTick, onDraw }
