// #Author: Emily
// #Description: Xerath Q/R predict

/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */


const prints = [];

function print(...data) {
    prints.push(data.join(' '));
}

function clearPrint() {
    if (prints.length > 30) prints.splice(0, prints.length - 30);
}


const qCost = [80, 90, 100, 110, 120];

const qRanges = [
    { t: 0, r: 736 },
    { t: 0.25, r: 837 },
    { t: 0.5, r: 940 },
    { t: 0.75, r: 1040 },
    { t: 1, r: 1143 },
    { t: 1.25, r: 1245 },
    { t: 1.5, r: 1347 },
    { t: 1.75, r: 1450 }
];

const rRange = 5000;

const scriptChampName = 'Xerath';
const qBuffName = 'XerathArcanopulseChargeUp';
const rBuffName = 'XerathLocusOfPower2';


/** @type {Manager} */
let manager;
let qTarget;
let rTarget;

let internalStatus = 'idle';

let baseDrawingOffset;

function setup() {
    console.log('Xerath.js loaded.')
}


function getQBuff() { return manager.me.buffManager.byName(qBuffName); }
function getRBuff() { return manager.me.buffManager.byName(rBuffName); }
function hasQBuff() { return getQBuff()?.count > 0; }
function hasRBuff() { return getRBuff()?.count > 0; }

function getCurrentQRange() {
    if (!hasQBuff()) return;
    const ret = 735 + (102.14 * ((manager.game.time - getQBuff().startTime + 0.2) / 0.25));
    return Math.min(ret, 1450);
}


function executeLogicR() {
    if (!hasRBuff()) return;
    const target = manager.utils.lowestHealthEnemyChampInRange(rRange);
    if (!target) return;
    rTarget = target;
    const buff = getRBuff();
    if (buff.endtime - manager.game.time < 5) return castR(target);
}

function executeLogicQ() {

    const target = manager.utils.lowestHealthEnemyChampInRange(1450);
    qTarget = target;
    if (!target) return;
    print('qTarget set to ' + target.name);

    if (hasQBuff()) return executeLogicQWithBuff();

    if (internalStatus == 'justPressedQ') return;

    const qSpell = manager.me.spells[0];
    if (!qSpell.ready) return;

    print('Q is ready');

    if (manager.me.mana < qCost[qSpell.level - 1]) return;

    print('Mana is OK')

    manager.game.pressKey(manager.spellSlot.Q);

    internalStatus = 'justPressedQ';
}

function executeLogicQWithBuff() {
    internalStatus = 'pressingQ';

    const buff = getQBuff();

    print('Have Q Buff')

    print('Endtime:', buff.endtime);
    print('Gametime:', manager.game.time);

    if (buff.endtime - manager.game.time <= 0) {
        print('EXPIRED');
        manager.game.releaseKey(manager.spellSlot.Q);
    } else if (buff.endtime - manager.game.time < 1) {
        if (!qTarget) return;
        print('Casting anyways');
        castQ(qTarget);
    }
}


/** 
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(_manager, ticks) {
    if (_manager.me.name != scriptChampName) return;
    baseDrawingOffset = baseDrawingOffset || _manager.me.baseDrawingOffset;
    manager = _manager;
    clearPrint();
    if (manager.game.isKeyPressed(0x4E)) {
        manager.game.releaseKey(manager.spellSlot.Q);
        internalStatus = 'idle';
    }
    if (manager.game.isKeyPressed(0x4A)) return executeLogicR();
    if (manager.game.isKeyPressed(0x05)) return executeLogicQ();
}




/** 
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, manager) {

    // if (!baseDrawingOffset) return;
    // const gamePos = manager.me.gamePos.copy();
    // gamePos.y += baseDrawingOffset;
    // const pos = manager.worldToScreen(gamePos);
    // pos.y -= 141;
    // pos.x -= 45;

    // pos.y += 25;
    // ctx.rect(pos, 100, 10, undefined, [100, 0, 0, 100], 1);


    // for (let i = 0; i < prints.length; i++) {
    //     const p = prints[i];
    //     ctx.text(p, 20, 20 + i * 30, 20, 255);
    // }

    return;
    // manager.champions.enemies.forEach(e => {
    //     const a = manager.worldToScreen(e.AiManager.startPath);
    //     const b = manager.worldToScreen(e.AiManager.endPath);
    //     ctx.line(a, b, [200, 0, 0], 2);
    // });



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
    if (manager.me.name != scriptChampName) return;
    print('MOVE', hero.name);
    if (manager.game.isKeyPressed(0x5) && hasQBuff() && qTarget && qTarget.name == hero.name) return castQ(hero);
    if (manager.game.isKeyPressed(0x4A) && rTarget && rTarget.name == hero.name) return castR(hero);
}

/** @param {Entity} hero */
function castQ(hero) {
    try {
        print('Trying to cast Q')
        let castPos = predictPosition(hero);
        if (manager.me.gamePos.dist(castPos) > getCurrentQRange()) return;
        castPos = manager.worldToScreen(castPos);
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

/** @param {Entity} hero */
function castR(hero) {
    try {
        if (hero.AiManager.isDashing) return;
        let castPos = predictPosition(hero, 0.627);
        if (manager.me.gamePos.dist(castPos) > rRange) return;
        castPos = manager.worldToScreen(castPos);
        const { setMousePos, sleep, releaseKey, blockInput } = manager.game;
        blockInput(true);
        setMousePos(castPos.x, castPos.y);
        manager.game.pressKey(manager.spellSlot.R);
        sleep(20);
        releaseKey(manager.spellSlot.R);
        sleep(20);
        blockInput(false);
        rTarget = undefined;
    } catch (ex) {
        console.error('ERROR', ex);
    }
}

/** @param {Entity} hero */
function predictPosition(hero, castTime = 0.528) {
    if (hero.AiManager.startPath.x == hero.AiManager.endPath.x && hero.AiManager.startPath.y == hero.AiManager.endPath.y) {
        return hero.gamePos;
    }
    const dQ = hero.AiManager.endPath.sub(hero.gamePos).normalize();
    const dQ_travel = hero.movSpeed * castTime; // Q cast time
    const tmp = dQ.mul(new manager.typings.Vector3(dQ_travel, dQ_travel, dQ_travel));
    const qPredicted_pos = hero.gamePos.add(tmp);
    return qPredicted_pos;
}

module.exports = { setup, onTick, onMoveCreate, onDraw }
