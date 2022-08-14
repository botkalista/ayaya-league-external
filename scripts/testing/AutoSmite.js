/**
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/events/types").ScriptSettings} Settings
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 */

const neutralsTargets = [
    "SRU_Baron",
    "SRU_Dragon_Air",
    "SRU_Dragon_Fire",
    "SRU_Dragon_Water",
    "SRU_Dragon_Earth",
    "SRU_Dragon_Elder",
    "SRU_RiftHerald",
    "SRU_Dragon_Chemtech",
    "SRU_Dragon_Hextech"
]

const smites = {
    SummonerSmite: 450,
    S5_SummonerSmiteDuel: 900,
    S5_SummonerSmitePlayerGanker: 900
}

function getSmite(manager) {
    const smite = manager.spells.find(e => e.name.includes('SummonerSmite'));
    return smite;
}

function setup() {
    console.log("AutoSmite.js loaded.");

    const settings = [
        { type: 'check', defalue: false, text: 'Active' }
    ]

    return settings;
}

/**

 * @param {Manager} manager 
 * @param {*} ticks 
 * @param {Settings} settings 
 * @returns 
 */
async function onTick(manager, ticks, settings) {

    if (!settings[0].value) return;

    const smite = getSmite(manager);
    if (!smite.ready) return;

    const targets = manager.monsters.filter(e => neutralsTargets.includes(e.name));
    if (targets.length == 0) return;

    const closestInRange = targets2.reduce((p, e) => {
        const dist = Math.hypot(
            e.screenPos.x - manager.me.screenPos.x,
            e.screenPos.y - manager.me.screenPos.y
        );
        const pRange = manager.me.range;
        const eBoundingBox = manager.me.boundingBox;
        return dist < pRange / 2 + eBoundingBox * 2 && dist < p.d ? { d: dist, e } : p;
    }, { d: 999, e: targets[0] });

    if (closestInRange.d == 999) return;
    if (closestInRange.e.hp <= 0) return;

    if (closestInRange.e.hp <= smites[smite]) {
        const oldMousePos = manager.game.getMousePos();
        manager.game.setMousePos(closestInRange.e.screenPos.x, closestInRange.e.screenPos.y);
        manager.game.pressKey(manager.spellSlot.D);
        manager.game.sleep(35);
        manager.game.releaseKey(manager.spellSlot.D);
        manager.game.setMousePos(oldMousePos.x, oldMousePos.y);
    }
}

module.exports = { setup, onTick };