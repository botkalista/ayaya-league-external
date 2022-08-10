
/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 */

const { Vector2, Vector3 } = require("../../src/models/Vector");


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

function getCurrentQRange(time) {
    const ret = 735 + (102.14 * ((time - qTimer) / 0.25));
    return Math.max(ret, 1450);
}

/**
 * @param {Entity[]} enemies 
 * @param {number} range 
 */
function getLowestHealthTargetWithinRange(enemies, range, manager) {
    return enemies.reduce((p, e) => {
        const dist = Math.hypot(e.screenPos.x - manager.me.screenPos.x, e.screenPos.y - manager.me.screenPos.y);
        const eBoundingBox = e.boundingBox;
        const mBoundingBox = manager.me.boundingBox;
        return (dist < (range + eBoundingBox + mBoundingBox) / 2 && e.hp < p.hp) ? { hp: e.hp, e } : p;
    }, { hp: 9999, e: enemies[0] });
}

/** 
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(manager, ticks) {
    if (manager.me.name != 'Xerath') return;

    if (manager.playerState == 'isCharging'
        || manager.playerState == 'isCasting'
        || manager.playerState == 'isAttacking') return;

    const active = manager.game.isKeyPressed(0x5);
    if (!active) return;


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
 * @param {Entity} hero
 * @param {Manager} manager
 */
function onMoveCreate(hero, manager) {
    if (manager.me.name != 'Xerath') return;
    if (hero.address != qTarget) return;
    if (manager.playerState != 'isCharging') return;

    const active = manager.game.isKeyPressed(0x5);
    if (!active) return;

    const { setMousePos, sleep, releaseKey, blockInput, getMousePos } = manager.game;

    const dQ = hero.AiManager.endPath.sub(hero.gamePos.normalize());
    const dQ_travel = hero.movSpeed * 0.528; // Q cast time

    const qPredicted_pos = hero.gamePos.add(dQ.mult(dQ_travel));

    if (qPredicted_pos.dist(manager.me.gamePos) > getCurrentQRange(manager.game.time)) return;

    manager.setPlayerState('isCasting');

    const oldMousePos = getMousePos();

    blockInput(true);
    const castPos = manager.worldToScreen(hero.AiManager.endPath).getFlat();    
    setMousePos(castPos.x, castPos.y);
    sleep(3);
    releaseKey(manager.spellSlot.Q);
    sleep(10);
    qTimer = 0;
    setMousePos(oldMousePos.x, oldMousePos.y);
    blockInput(false);
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
