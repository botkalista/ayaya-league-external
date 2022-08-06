
function setup() {

}

/** 
 * @param {import("../UserScriptManager").UserScriptManager} manager ScriptManager
 * @param {number} ticks Ticks counter
 * 
 * This JSDOC is optional, it's only purpose is to add intellisense while you write the script
 * 
 * */

function onTick(manager, ticks) {

    const alliesSpellsNames = [];
    manager.champions.allies.forEach(champ => {
        champ.spells.forEach(spell => {
            alliesSpellsNames.push(spell.name);
        });
    });
    const enemiesMissiles = manager.missiles.filter(m => !alliesSpellsNames.includes(m.spellName));
    const enemiesMissilesSpells = enemiesMissiles.filter(m => !m.isBasicAttack && !m.isTurretAttack && !m.isMinionAttack);

    const me = manager.me;

    enemiesMissilesSpells.forEach(missile => {
        const collision = manager.checkCollision(me, missile);
        if (collision.result) {
            const evadeAt = collision.evadeAt;
            const action = manager.mouse.rightClickAt(evadeAt.x * 1.2, evadeAt.y * 1.2);
            if (action) console.log('SimpleEvade::Evading', [evadeAt.x * 1.2, evadeAt.y * 1.2]);
        }
    });

}

module.exports = { setup, onTick }