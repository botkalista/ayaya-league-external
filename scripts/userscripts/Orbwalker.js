


let lastAaTick = 0;
let canMove = false;
let _canAttack = true;

function canAttack(attackDelay) {
    const canAttack = lastAaTick + attackDelay < performance.now();
    console.log({ attackDelay: attackDelay.toFixed(0), lastAaTick: lastAaTick.toFixed(), time: performance.now().toFixed(), canAttack })
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
    if (test < 0) {
        process.exit();
    }

    const active = await manager.game.isKeyPressed(0x4E);
    if (active == 0) return;

    console.log('active', active, performance.now().toFixed(0));

    const targets = manager.champions.enemies;
    if (targets.length == 0) return;
    const closestInRange = manager.champions.enemies.reduce((p, e) => {
        const dist = Math.hypot(e.screenPos.x - manager.me.screenPos.x, e.screenPos.y - manager.me.screenPos.y);
        const pRange = manager.me.range;
        const eBoundingBox = 30;
        return (dist < pRange + eBoundingBox * 2 && dist < p[0]) ? [dist, e] : p;
    }, [999, targets[0]]);

    if (closestInRange[0] == 999) return;

    if (canAttack(manager.me.attackDelay) && _canAttack) {
        console.log('IM ATTACKING');
        await manager.game.issueOrder(closestInRange[1].screenPos, true);
        lastAaTick = performance.now();
    }

    if (canMove) {
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




