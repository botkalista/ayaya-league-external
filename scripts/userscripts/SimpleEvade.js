
function setup() {
    console.log('SimpleEvade.js loaded.')
}

/** 
 * @param {import("../UserScriptManager").UserScriptManager} manager ScriptManager
 * @param {number} ticks Ticks counter
 * 
 * This JSDOC is optional, it's only purpose is to add intellisense while you write the script
 * 
 * */
async function onTick(manager, ticks) { }

/** 
 * @param {import("../../src/models/Missile").Missile} missile Missile
 * @param {import("../UserScriptManager").UserScriptManager} manager ScriptManager
 * 
 * This JSDOC is optional, it's only purpose is to add intellisense while you write the script
 * 
 * */
function onMissileCreate(missile, manager) {
    
    if (missile.isBasicAttack) return;
    if (missile.isMinionAttack) return;
    if (missile.isTurretAttack) return;

    if (missile.team == manager.me.team) return;

    const collision = manager.checkCollision(manager.me, missile);
    if (!collision.result) return;
    const evadeAt = collision.evadeAt;
    manager.game.issueOrder(evadeAt.mult(1, 1).getFlat(), false);
    console.log('SimpleEvade::Evading', [evadeAt.x * 1, evadeAt.y * 1]);


}

module.exports = { setup, onTick, onMissileCreate }




