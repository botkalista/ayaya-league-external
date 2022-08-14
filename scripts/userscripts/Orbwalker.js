let lastAaTick = 0;
let canPlayerMove = true;
let lastWasMove = false;

/** @type {import("../UserScriptManager").UserScriptManager} */
let manager;

function getTime() {
    return manager.game.time * 1000
}

function canAttack(attackDelay, manager) { return lastAaTick + attackDelay < getTime() }

function canMove(windupTime, manager) { return (lastAaTick + windupTime < getTime() || canPlayerMove) }

function setup() {
    console.log('Orbwalker.js loaded.')

    return [
        { type: 'check', default: false, text: 'Enabled' }
    ]
}

/** 
 * @param {import("../UserScriptManager").UserScriptManager} manager
 * @param {number} ticks
 * */
async function onTick(_manager, ticks, settings) {
    if (!settings[0].value) return;
    manager = _manager;
    if (!manager.game.isKeyPressed(0x5)) return;

    if (manager.playerState == 'isAttacking') return;


    const target = manager.utils.lowestHealthEnemyChampInRange(manager.me.range);
    if (!target) canPlayerMove = true;


    if (target && canAttack(manager.me.attackDelay) && (manager.playerState == "idle" || manager.playerState == undefined)) {
        canPlayerMove = false;
        lastAaTick = getTime();
        manager.game.issueOrder(target.screenPos, true);
    } else if (canMove(manager.me.windupTime) && (manager.playerState == "idle" || manager.playerState == "isCharging" || manager.playerState == undefined)) {
        if (lastWasMove) return lastWasMove = false;
        const pos = await manager.game.getMousePos();
        lastWasMove = true;
        manager.game.issueOrder(pos, false);
    }

}

/** 
 * @param {import("../../src/models/Missile").Missile} missile Missile
 * @param {import("../UserScriptManager").UserScriptManager} manager ScriptManager
 * 
 * This JSDOC is optional, it's only purpose is to add intellisense while you write the script
 * 
 * */
function onMissileCreate(missile, manager, settings) {
    if (!settings[0].value) return;
    if (missile.spellName.startsWith(manager.me.name + 'BasicAttack') ||
        missile.spellName.startsWith(manager.me.name + 'BioArcaneBarrageAttack')) {
        canPlayerMove = true;
    }
}

module.exports = { setup, onTick, onMissileCreate }
