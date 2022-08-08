


let lastAaTick = 0;
let canMove = false;
let _canAttack = true;

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

    const test = await manager.game.isKeyPressed(0x4D);
    if (test < 0) process.exit();

    const active = await manager.game.isKeyPressed(0x4E);
    if (active == 0) return;

    const targets = manager.champions.enemies;
    if (targets.length == 0) return;
    const closestInRange = manager.champions.enemies.reduce((p, e) => {
        const dist = Math.hypot(e.screenPos.x - manager.me.screenPos.x, e.screenPos.y - manager.me.screenPos.y);
        const pRange = manager.me.range;
        const eBoundingBox = 30;
        return (dist < pRange + eBoundingBox * 2 && dist < p.d) ? { d: dist, e } : p;
    }, { d: 999, e: targets[0] });

    if (closestInRange.d == 999) return;

    if (canAttack(manager.me.attackDelay) && _canAttack) {
        lastAaTick = Date.now();
        await manager.game.issueOrder(closestInRange.e.screenPos, true);
    }

    if (canMove) {
        canMove = false;
        const pos = await manager.game.getMousePos();
        await manager.game.issueOrder(pos, false);
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
    if (missile.spellName.startsWith(manager.me.name + 'BasicAttack')) {
        canMove = true;
        _canAttack = true;
    }
}

module.exports = { setup, onTick, onMissileCreate }




