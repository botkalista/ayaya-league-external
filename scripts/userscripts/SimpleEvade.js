function setup() { }

/** 
 * @param {import("../UserScriptManager").UserScriptManager} manager ScriptManager
 * @param {number} ticks Ticks counter
 * 
 * This JSDOC is optional, it's only purpose is to add intellisense while you write the script
 * 
 * */
async function onTick(manager, ticks) {

    const alliesSpellsNames = [];
    manager.champions.allies.forEach(champ => {
        champ.spells.forEach(spell => {
            alliesSpellsNames.push(spell.name);
        });
    });
    const enemiesMissiles = manager.missiles.filter(m => !alliesSpellsNames.includes(m.spellName));
    const enemiesMissilesSpells = enemiesMissiles.filter(m => !m.isBasicAttack && !m.isTurretAttack && !m.isMinionAttack);

    const me = manager.me;

    const testMissiles = manager.missiles.filter(m => !m.isBasicAttack && !m.isTurretAttack && !m.isMinionAttack);

    testMissiles.forEach(async missile => {
        const collision = manager.checkCollision(me, missile);
        if (collision.result) {
            const evadeAt = collision.evadeAt;
            const action = await manager.game.issueOrder(evadeAt.mult(1, 1).getFlat(), false, 10);
            if (action) console.log('SimpleEvade::Evading', [evadeAt.x * 1, evadeAt.y * 1]);
        }
    });
}

module.exports = { setup, onTick }