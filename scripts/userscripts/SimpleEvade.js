// #Author: Emily
// #Description: Dodge skillshots

/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */

function setup() {
    console.log('SimpleEvade.js loaded.')

    const settings = [
        { type: 'check', default: false, text: 'Enabled' },
    ];

    return settings;
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
    if (missile.isBasicAttack) return;
    if (missile.isMinionAttack) return;
    if (missile.isTurretAttack) return;
    if (missile.team == manager.me.team) return;

    const collision = manager.checkCollision(manager.me, missile);
    if (!collision.result) return;
    const evadeAt = collision.evadeAt;
    manager.game.issueOrder(evadeAt.mul(new manager.typings.Vector2(1, 1)).flatten(), false);
    console.log('SimpleEvade::Evading', [evadeAt.x * 1, evadeAt.y * 1]);

}



module.exports = { setup, onMissileCreate }




