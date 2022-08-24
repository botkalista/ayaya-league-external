"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishOnMissileCreate = void 0;
function publishOnMissileCreate(manager, persistentMissiles, settings, publish) {
    //* Check missiles for onMissileCreate function
    for (const missile of manager.missiles) {
        // If missile is inside persistent skip
        if (persistentMissiles.find(m => m.address == missile.address))
            return;
        // Otherwise notify every script for the new missile
        publish('onMissileCreate', settings, missile, manager);
        // Add it to persistent
        persistentMissiles.push(missile);
    }
    // Remove deleted missiles from persistent
    persistentMissiles = persistentMissiles.filter(m => manager.missiles.find(e => e.address == m.address));
}
exports.publishOnMissileCreate = publishOnMissileCreate;
