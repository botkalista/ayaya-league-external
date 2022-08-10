let lastAaTick = 0;
let canMove = false;

function canAttack(attackDelay) {
    const canAttack = lastAaTick + attackDelay < Date.now();
    return canAttack;
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

    const active = manager.game.isKeyPressed(0x20); // 0x4E = N | 0x5 = MouseButtonX | 0x20 = SPACE
    if (!active) return;

    const targets = manager.champions.enemies;
    if (targets.length == 0) return;

    const closestInRange = manager.champions.enemies.reduce((p, e) => {
        const dist = Math.hypot(e.screenPos.x - manager.me.screenPos.x, e.screenPos.y - manager.me.screenPos.y);
        const pRange = manager.me.range;
        const eBoundingBox = 65; // Ashe bounding box
        return (dist < (pRange / 2) + eBoundingBox * 2 && dist < p.d) ? { d: dist, e } : p;
    }, { d: 999, e: targets[0] });

    if (closestInRange.d == 999) canMove = true;

    if (canAttack(manager.me.attackDelay) && (closestInRange.d != 999) && manager.playerState == "idle") {
        manager.game.issueOrder(closestInRange.e.screenPos, true);
        lastAaTick = Date.now();
        canMove = false;
    } else if (canMove && (manager.playerState == "idle" || manager.playerState == "isCharging")) {
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
    if (missile.spellName.startsWith(manager.me.name + "BasicAttack")) {
        canMove = !canAttack(manager.me.attackDelay);
    }
}

module.exports = { setup, onTick, onMissileCreate }
