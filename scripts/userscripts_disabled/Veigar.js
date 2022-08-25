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
    if (manager.me.spells[0].level == 0) return 0;
    const baseDamage = [80, 120, 160, 200, 240][manager.me.spells[0].level - 1];
    const scalingDamage = 0.6 * manager.me.ap;
    return baseDamage + scalingDamage;
}

/**@param {Entity} target */
function getDamageR(target) {
    if (manager.me.spells[3].level == 0) return 0;
    const baseDamage = [175, 250, 325][manager.me.spells[3].level - 1];
    const scalingDamage = 0.75 * manager.me.ap;

    const percentHp = 100 / target.maxHp * target.hp;
    const percentMissingHp = 100 - percentHp;

    const bonusDamagePercent = Math.max(percentMissingHp * 1.5, 100)


    return (baseDamage + scalingDamage) + ((baseDamage + scalingDamage) / 100 * bonusDamagePercent);
}

function isCollectableQ(target) {
    return manager.utils.calculateMagicDamage(manager.me, target, getDamageQ()) >= target.hp;
}

function isCollectableR(target) {
    return manager.utils.calculateMagicDamage(manager.me, target, getDamageR(target)) >= target.hp;
}


/** 
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, _manager, settings) {
    manager = _manager;

    // Q helper
    const closeThings = manager.utils.genericInRange(manager.minions.enemies, 2500);
    const collectableThings = closeThings.filter(isCollectableQ);
    for (const thing of collectableThings) ctx.circle(thing.gamePos, 30, 40, [0, 0, 220, 90], 3);

    // Q counter
    const cost = [30, 34, 40, 45, 50][manager.me.spells[0].level - 1];
    const count = Math.floor(manager.me.mana / cost);
    const hpbarPos = manager.utils.getHealthBarPosition(manager.me);
    ctx.text(count + ' Q', hpbarPos.x + 114, hpbarPos.y - 7, 14, 255);


    // R helper
    const closeChampsThings = manager.utils.enemyChampsInRange(2500);
    const collectableChamps = closeChampsThings.filter(isCollectableR);
    for (const champ of collectableChamps) ctx.circle(champ.gamePos, 30, 40, [220, 0, 0, 90], 5);
}


module.exports = { setup, onTick, onDraw }
