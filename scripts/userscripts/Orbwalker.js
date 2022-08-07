


let lastAaTick;
let lastMoveTick;

function canAttack(attackDelay) {
    return lastAaTick + attackDelay < performance.now();
}

function canMove(attackDelay, windupTime) {
    return lastMoveTick + attackDelay + windupTime < performance.now();
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

    const active = await manager.game.isKeyPressed(0x56);

    if (!active) return;

    const targets = manager.champions.enemies;

    if (targets.length == 0) return;


    const closestInRange = manager.champions.enemies.reduce((p, e) => {
        const dist = Math.hypot(e.screenPos.x - manager.me.screenPos.x, e.screenPos.y - manager.me.screenPos.y);
        const pRange = manager.me.range;
        const eBoundingBox = 30;
        return (dist < pRange + eBoundingBox && dist < p) ? [dist, e] : p;
    }, [-999, targets[0]]);

    if (!closestInRange[1]) return;

    if (canAttack()) {
        manager.game.issueOrder(closestInRange[1].screenPos, true);
        lastAaTick = performance.now();
    }

    if (canMove()) {
        const pos = await manager.game.getMousePos();
        manager.game.issueOrder(pos, false);
    }

}




function onMissileCreate(missile, manager) { }

module.exports = { setup, onTick, onMissileCreate }




