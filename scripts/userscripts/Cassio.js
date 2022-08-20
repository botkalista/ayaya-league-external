/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */

const qCost = [50, 60, 70, 80, 90];
const eCost = [50, 48, 46, 44, 42];

const eDamage = [52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120];
const eScaling = 10;
const ePoisonDamage = [20, 40, 60, 80, 100];
const ePoisonScaling = 60;

const poisons = ['cassiopeiaqdebuff', 'cassiopeiawpoison']
const scriptChampName = "Cassiopeia";

/** @type {Manager} */
let manager;

function setup() {
    console.log('Cassio.js loaded.')
}


const draw = {
    championsTargets: [],
    minionsTargets: [],
}

/** 
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(_manager, ticks) {
    if (_manager.me.name != scriptChampName) return;
    manager = _manager;

    if (!manager.game.isKeyPressed(0x5)) { draw.championsTargets = []; draw.minionsTargets = []; return; };


    // console.log(manager.me.ap,manager.me.magicPenFlat,manager.me.magicPenPercent);
    // console.log(manager.me.magicResistTotal);


    //* Get champions in range 
    const inRange = manager.utils.enemyChampsInRange(700 - 75);

    //* Champions in range with poison
    const poisonedTargetsChamps = inRange.filter(e => {
        const qPoison = e.buffManager.byName(poisons[0]);
        const wPoison = e.buffManager.byName(poisons[1]);
        return ((qPoison?.count > 0) || (wPoison?.count > 0));
    });
    draw.championsTargets = poisonedTargetsChamps;
    if (poisonedTargetsChamps.length > 0) return castE(poisonedTargetsChamps);


    //* Champions that can be oneshot with E (without poison)
    const targetsChamps = inRange.filter(e => e.hp <= getDamageE(false, e));
    if (targetsChamps.length > 0) return castE(targetsChamps);


    //* Get minions in range 
    const minionsInRange = manager.utils.genericInRange(manager.minions.enemies, 700 - 75);

    //* Minions that can be oneshot with E
    const poisonedTargetsMinions = minionsInRange.filter(e => {
        const qPoison = e.buffManager.byName(poisons[0]);
        const wPoison = e.buffManager.byName(poisons[1]);
        return ((qPoison?.count > 0) || (wPoison?.count > 0));
    }).filter(e => e.hp <= getDamageE(true, e));

    if (poisonedTargetsMinions.length > 0) return castE(poisonedTargetsMinions);

    //* Minions that can be oneshot with E (no poison)
    const targetsMinions = minionsInRange.filter(e => e.hp <= getDamageE(false, e));
    if (targetsMinions.length > 0) return castE(targetsMinions);

}

/**
 * @param {boolean} poisoned 
 * @param {Entity} target 
 * @returns 
 */
function getDamageE(poisoned, target) {
    const level = manager.me.level;
    const ap = manager.me.ap;
    const baseDamage = eDamage[level - 1] + (ap / 100 * eScaling);
    const magicPenFlat = manager.me.magicPenFlat;
    const magicPenPercent = manager.me.magicPenPercent;
    let mr = target.magicResistTotal;

    // Apply flat penetration
    me = mr - magicPenFlat;
    // Apply percent penetration
    me = mr / 100 * magicPenPercent;
    if (!poisoned) return baseDamage * (100 / (100 + mr));
    const bonusDamage = ePoisonDamage[manager.me.spells[2].level - 1] + (ap / 100 * ePoisonScaling);
    return (baseDamage + bonusDamage) * (100 / (100 + mr))
}


function castE(targets) {
    const eSpell = manager.me.spells[2];
    if (!eSpell.ready || manager.me.mana < eCost[eSpell.level - 1]) return;
    const lowest = targets.reduce((p, e) => e.hp < p.hp ? e : p, targets[0]);
    manager.game.castSpell(manager.spellSlot.E, lowest.screenPos);
}

function castQ(target) {
    const qSpell = manager.me.spells[0];
    if (!qSpell.ready || manager.me.mana < qCost[qSpell.level - 1]) return;
    const prediction = manager.utils.predictPosition(target, 0.4);
    const prediction2d = manager.worldToScreen(prediction);
    manager.game.castSpell(manager.spellSlot.Q, prediction2d);
}


/** 
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, manager) {
    if (manager.me.name != scriptChampName) return;
    draw.championsTargets.forEach(e => {
        ctx.circle(e.gamePos, e.boundingBox, 30, [200, 0, 0], 3);
    });

}


module.exports = { setup, onTick, onDraw }
