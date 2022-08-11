
/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
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

let isChargingQ = false;

function getCurrentQRange(time) {
    const ret = 735 + (102.14 * ((time - qTimer) / 0.25));
    return Math.min(ret, 1450);
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

    if (manager.game.isKeyPressed(0x20)) {
        isChargingQ = false;
    }

    const active = manager.game.isKeyPressed(0x5);
    if (!active) return;

    if (isChargingQ) return;

    const currentQRange = getCurrentQRange(manager.game.time);

    if (currentQRange >= 1450) {
        const hero = manager.champions.enemies.find(e => e.address == qTarget);
        castQ(hero, manager)
        return;
    }

    const me = manager.me;
    const Q = me.spells[0];

    if (Q.ready && me.mana > qCost[Q.level]) {
        const target = getLowestHealthTargetWithinRange(manager.champions.enemies, 1450, manager); //1450 Max Q range
        if (target.hp == 9999) return; //DA CAMBIARE PER CONTINUARE RESTO ONTICK
        qTarget = target.e.address;
        manager.game.pressKey(manager.spellSlot.Q);
        qTimer = manager.game.time;
        manager.setPlayerState("isCharging");
        isChargingQ = true;
        return;
    }
}

/** 
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, manager) {
    // const range = manager.me.range;
    // const bb = manager.me.boundingBox;
    // ctx.circle(manager.me.gamePos, (range + bb / 2), 50, 0, 1);
    if (qTarget) {
        const target = manager.champions.enemies.find(e => e.address == qTarget);
        ctx.circle(target.gamePos, (target.boundingBox / 2), 10, 0, 3);
    }

}


/** 
 * @param {Entity} hero
 * @param {Manager} manager
 */
function onMoveCreate(hero, manager) {
    if (manager.me.name != 'Xerath') return;
    if (hero.address != qTarget) return;
    if (!isChargingQ) return;
    const active = manager.game.isKeyPressed(0x5);
    if (!active) return;
    castQ(hero, manager);
}

/** 
 * @param {Entity} hero
 * @param {Manager} manager
 */
function castQ(hero, manager) {
    try {
        const dQ = hero.AiManager.endPath.sub(hero.gamePos.normalize());
        const dQ_travel = hero.movSpeed * 0.528; // Q cast time
        const qPredicted_pos = hero.gamePos.add(dQ.mult(dQ_travel));
        if (qPredicted_pos.dist(manager.me.gamePos) > getCurrentQRange(manager.game.time)) return;
        const { setMousePos, sleep, releaseKey, blockInput, getMousePos } = manager.game;
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
        casting = false;
    } catch (ex) {
        console.log(ex);
        console.log({ hero })
    }
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

module.exports = { setup, onTick, onMissileCreate, onMoveCreate, onDraw }
