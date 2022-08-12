let lastAaTick = 0;
let canPlayerMove = true;

function getTime(manager) {
    return manager.game.time * 1000
}

function canAttack(attackDelay, manager) {
    const canAttack = lastAaTick + attackDelay < getTime(manager);
    return canAttack;
}

function canMove(windupTime, manager) {
    const canMove = lastAaTick + windupTime < getTime(manager);
    return canPlayerMove || canMove;
}

function setup() {
    console.log('Orbwalker.js loaded.')
}

/** 
 * @param {import("../UserScriptManager").UserScriptManager} manager ScriptManager
 * @param {number} ticks Ticks counter
 * 
 * This JSDOC is optional, it's only purpose is to add intellisense while you write the script
 * 
 * */


async function onTick(manager, ticks) {
    const active = manager.game.isKeyPressed(0x5); // 0x4E = N | 0x5 = MouseButtonX | 0x20 = SPACE
    if (!active) return;

    if (manager.playerState == 'isAttacking') return;

    const targets = manager.champions.enemies;
    if (targets.length == 0) return;
    const closestInRange = manager.champions.enemies.reduce((p, e) => {
        const dist = Math.hypot(e.screenPos.x - manager.me.screenPos.x, e.screenPos.y - manager.me.screenPos.y);
        const pRange = manager.me.range;
        const eBoundingBox = manager.me.boundingBox;
        return (dist < (pRange / 2) + eBoundingBox * 2 && dist < p.d) ? { d: dist, e } : p;
    }, { d: 999, e: targets[0] });

    if (closestInRange.d == 999) { canPlayerMove = true;  }

    if ((closestInRange.d != 999) && canAttack(manager.me.attackDelay, manager) && manager.playerState == "idle" || manager.playerState == undefined) {
        canPlayerMove = false;
        lastAaTick = getTime(manager);
        manager.game.issueOrder(closestInRange.e.screenPos, true);
    } else if (canMove(manager.me.windupTime, manager) && (manager.playerState == "idle" || manager.playerState == "isCharging" || manager.playerState == undefined)) {
    
        const pos = await manager.game.getMousePos();
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
function onMissileCreate(missile, manager) {
    if (missile.spellName.startsWith(manager.me.name + 'BasicAttack') ||
        missile.spellName.startsWith(manager.me.name + 'BioArcaneBarrageAttack')) {
        canPlayerMove = true;
    }
}

module.exports = { setup, onTick, onMissileCreate }
