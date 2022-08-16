/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */


const scriptChampName = 'TwistedFate';


/** @type {Manager} */
let manager;

function setup() {
    console.log('TwistedFate.js loaded.')
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




module.exports = { setup, onTick }
