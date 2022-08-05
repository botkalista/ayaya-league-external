
function setup() {

}

/** @param {import("../UserScriptManager").UserScriptManager} manager */
function onTick(manager) {
    const me = manager.me;
    manager.missiles.forEach(missile => {
        const coll = manager.checkCollision(me, missile);
        if (coll.result) {
            const e = coll.evadeAt;
            console.log('SimpleEvade::Evading');
            for (let i = 0; i < 3; i++) {
                manager.mouse.rightClickAt(me.screenPos.x + e.x * 2, me.screenPos.y + e.y * 2);
            }
        }
    });
}

module.exports = { setup, onTick }