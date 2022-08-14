/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */

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

const scriptChampName = 'Xerath';
const qBuffName = 'XerathArcanopulseChargeUp';

let qTarget;
let lastMove;


function setup() {
    console.log('Xerath.js loaded.')
}


/**@param {Manager} manager */
function getQBuff(manager) {
    return manager.me.buffManager.byName(qBuffName);
}
/**
 * @param {Manager} manager 
 * @returns {boolean}
 */
function hasQBuff(manager) {
    const qBuff = getQBuff(manager);
    if (!qBuff) return false;
    return qBuff.count > 0;
}

function getCurrentQRange(manager) {
    const qBuff = getQBuff(manager);
    if (!qBuff) return 0;
    const qTimer = qBuff.startTime;
    const ret = 735 + (102.14 * ((manager.game.time - qTimer + 0.2) / 0.25));
    return Math.min(ret, 1450);
}


/** 
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(manager, ticks) {

    //* If champ is not Xerath return
    if (manager.me.name != scriptChampName) return;

    if (manager.game.isKeyPressed(0x4E)) manager.game.releaseKey(manager.spellSlot.Q);


    const active = manager.game.isKeyPressed(0x5);
    if (!active) return;


    if (hasQBuff(manager)) {

        const qBuff = getQBuff(manager);
        if (qBuff.endtime - manager.game.time <= 0) {
            manager.game.releaseKey(manager.spellSlot.Q);
        } else if (qBuff.endtime - manager.game.time < 1) {
            const target = manager.utils.lowestHealthEnemyChampInRange(getCurrentQRange(manager));
            if (!target) return;
            castQ(target, manager);
        }

        return;
    };

    const me = manager.me;
    const Q = me.spells[0];

    if (Q.ready && me.mana > qCost[Q.level - 1]) {
        const target = manager.utils.lowestHealthEnemyChampInRange(1450); //1450 Max Q range
        if (!target) return;
        qTarget = target.name;
        manager.game.pressKey(manager.spellSlot.Q);
        return;
    }

}


/** 
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, manager) {


    // ctx.text(manager.me.buffManager.buffs.map(e => `${e.count} | ${e.name}`).join('\n'), 600, 40, 20, 255);

    if (manager.me.name != scriptChampName) return;

    const Q = manager.me.spells[0];
    ctx.text('Q ready: ' + Q.ready, 50, 40, 20, 255);
    ctx.text('Mana: ' + manager.me.mana.toFixed(), 50, 60, 20, 255);
    ctx.text('Q cost: ' + (qCost[Q.level - 1]), 50, 80, 20, 255);
    ctx.text('Has mana: ' + (manager.me.mana > qCost[Q.level - 1]), 50, 100, 20, 255);
    ctx.text('Charging: ' + hasQBuff(manager), 50, 120, 20, 255);


    if (!hasQBuff(manager)) return;

    const range = getCurrentQRange(manager);
    ctx.circle(manager.me.gamePos, range, 50, [0, 170, 0], 2);
    ctx.text('Range: ' + range, 50, 150, 20, 255);


    if (!qTarget) return;

    const target = manager.champions.enemies.find(e => e.name == qTarget);
    if (!target) return;

    ctx.circle(target.gamePos, 60, 20, [200, 0, 0], 3);
    ctx.text('Target: ' + qTarget, 50, 170, 20, 255);

    if (lastMove) {
        const start = manager.worldToScreen(lastMove.startPath);
        const end = manager.worldToScreen(lastMove.endPath);
        ctx.linePoints(start.x, start.y, end.x, end.y, 255, 2);
    }


    const predictedPos = predictPosition(target, manager);
    if (!predictedPos || predictedPos.x == NaN) return;
    ctx.circle(manager.me.gamePos, predictedPos.dist(manager.me.gamePos), 100, [0, 200, 0], 8);
    ctx.text('PDist: ' + predictedPos.dist(manager.me.gamePos), 50, 200, 20, 255);
    if (predictedPos.dist(manager.me.gamePos) > getCurrentQRange(manager)) return;
    ctx.text('INRANGE', 50, 230, 20, 255);


}



/** 
 * @param {Entity} hero
 * @param {Manager} manager
 */
function onMoveCreate(hero, manager) {
    lastMove = hero.AiManager;
    if (manager.me.name != scriptChampName) return;
    if (hero.name != qTarget) return;
    if (!hasQBuff(manager)) return;
    // const active = manager.game.isKeyPressed(0x5);
    // if (!active) return;
    castQ(hero, manager);
}

/** 
 * @param {Entity} hero
 * @param {Manager} manager
 */
function castQ(hero, manager) {
    try {

        let castPos;

        if (hero.AiManager.startPath && hero.AiManager.endPath) {
            castPos = predictPosition(hero, manager);
            if (!castPos) return;
            if (castPos.x == NaN || castPos.x == null) return;
            if (castPos.dist(manager.me.gamePos) > getCurrentQRange(manager)) return;
            castPos = manager.worldToScreen(castPos);
        } else {
            castPos = manager.worldToScreen(hero.gamePos).flatten();
        }

        const { setMousePos, sleep, releaseKey, blockInput, getMousePos } = manager.game;
        const oldMousePos = getMousePos();
        blockInput(true);
        setMousePos(castPos.x, castPos.y);
        sleep(3);
        releaseKey(manager.spellSlot.Q);
        sleep(20);
        setMousePos(oldMousePos.x, oldMousePos.y);
        blockInput(false);
        qTarget = undefined;

    } catch (ex) {
        console.error('ERROR', ex);
    }
}

/** 
 * @param {Entity} hero
 * @param {Manager} manager
 */
function predictPosition(hero, manager) {
    const dQ = hero.AiManager.endPath.sub(hero.gamePos).normalize();
    const dQ_travel = hero.movSpeed * 0.528; // Q cast time
    const tmp = dQ.mul(new manager.typings.Vector3(dQ_travel, dQ_travel, dQ_travel));
    const qPredicted_pos = hero.gamePos.add(tmp);
    return qPredicted_pos;
}

module.exports = { setup, onTick, onMoveCreate, onDraw }
