/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */

const qCost = [50, 60, 70, 80, 90];
const eCost = [50, 48, 46, 44, 42];

const poisons = ['cassiopeiaqdebuff', 'cassiopeiawpoison']
const scriptChampName = "Cassiopeia";

/** @type {Manager} */
let manager;

function setup() {
    console.log('Cassio.js loaded.')
}


const draw = {
    targets: []
}

/** 
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(_manager, ticks) {
    if (_manager.me.name != scriptChampName) return;
    manager = _manager;
    if (!manager.game.isKeyPressed(0x5)) return draw.targets = [];


    const targets = manager.utils.enemyChampsInRange(700 - 75).filter(e => {
        const qPoison = e.buffManager.byName(poisons[0]);
        const wPoison = e.buffManager.byName(poisons[1]);
        return ((qPoison?.count > 0) || (wPoison?.count > 0));
    });

    draw.targets = targets;

    if (targets.length == 0) return;

    const eSpell = manager.me.spells[2];
    if (!eSpell.ready || manager.me.mana < eCost[eSpell.level - 1]) return;

    const closest = targets.reduce((p, e) => e.hp < p.hp ? e : p, targets[0]);

    manager.game.castSpell(manager.spellSlot.E, closest.screenPos);

}




/** 
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, manager) {

    draw.targets.forEach(e => {
        ctx.circle(e.gamePos, e.boundingBox, 30, [200, 0, 0], 3);
    });

}


module.exports = { setup, onTick, onDraw }
