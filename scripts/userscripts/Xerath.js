
/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 */


function setup() {
    console.log('Xerath.js loaded.')
}

// if getplayerstate == ischaring {

//     if player distance to me > getcurrentqrange return
//     predict position from last timestap
//     cast()

const qCost = [80, 90, 100, 110, 120]

const qRanges = [
    { t: 0, r: 736 },
    { t: 0.25, r: 837 },
    { t: 0.5, r: 940 },
    { t: 0.75, r: 1040 },
    { t: 1, r: 1143 },
    { t: 1.25, r: 1245 },
    { t: 1.5, r: 1347 },
    { t: 1.75, r: 1450 }
]

let qTimer = 0;
let qTarget;

/**
 * @param {Entity[]} enemies 
 * @param {number} range 
 */
function getLowestHealthTargetWithinRange(enemies, range, manager) {
    return enemies.reduce((p, e) => {
        const dist = Math.hypot(e.screenPos.x - manager.me.screenPos.x, e.screenPos.y - manager.me.screenPos.y);
        const eBoundingBox = 65; // Ashe bounding box
        return (dist < range / 2 + eBoundingBox && e.hp < p.hp) ? { hp: e.hp, e } : p;
    }, { hp: 9999, e: enemies[0] });
}

/** 
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(manager, ticks) {
    if (manager.playerState == 'isCharging' || manager.playerState == 'isCasting') return;

    const me = manager.me;
    const Q = me.spells[0];

    if (Q.ready && me.mana > qCost[Q.level]) {
        const target = getLowestHealthTargetWithinRange(manager.champions.enemies, 1450, manager); //1450 Max Q range
        if (target.hp == 9999) return; //DA CAMBIARE PER CONTINUARE RESTO ONTICK

        qTarget = target.e.address;

        manager.game.pressKey(manager.spellSlot.Q);
        qTimer = manager.game.time;
        manager.setPlayerState("isCharging");
        return;

    }

}

/** 
 * @param {Entity} player
 * @param {Manager} manager
 */
function onMoveCreate(player, manager) {

    if (player.address != qTarget) return;
    if (manager.playerState != 'isCharging') return;
    const { setMousePos, sleep, releaseKey, blockInput, getMousePos } = manager.game;
    const dist = Math.hypot(player.screenPos.x - manager.me.screenPos.x, player.screenPos.y - manager.me.screenPos.y);
    const qCurrentRange = qRanges.find(e => e.t <= manager.game.time - qTimer) || { r: 0 }.r;
    if (dist > qCurrentRange) return;
    const castPos = manager.worldToScreen(player.AiManager.endPath).getFlat();
    manager.setPlayerState('isCasting');
    const oldMousePos = getMousePos();
    blockInput(true);
    setMousePos(castPos.x, castPos.y);
    sleep(15);
    releaseKey(manager.spellSlot.Q);
    sleep(10);
    setMousePos(oldMousePos.x, oldMousePos.y);
    blockInput(false);
    qTimer = 0;
    qTarget = undefined;
    manager.setPlayerState('idle');

}

/** 
 * @param {import("../../src/models/Missile").Missile} missile Missile
 * @param {import("../UserScriptManager").UserScriptManager} manager ScriptManager
 * 
 * This JSDOC is optional, it's only purpose is to add intellisense while you write the script
 * 
 * */
function onMissileCreate(missile, manager) {

}

module.exports = { setup, onTick, onMissileCreate, onMoveCreate }
