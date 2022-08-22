import type { UserScriptManager } from "../../scripts/UserScriptManager";
import type { Missile } from "../models/Missile";
import type { fnPublish, ScriptSettingsFull } from './types';

export function publishOnMissileCreate(manager: UserScriptManager, persistentMissiles: Missile[], settings: ScriptSettingsFull, publish: fnPublish) {

    //* Check missiles for onMissileCreate function
    for (const missile of manager.missiles) {

        // If missile is inside persistent skip
        if (persistentMissiles.find(m => m.address == missile.address)) return;

        // Otherwise notify every script for the new missile
        publish('onMissileCreate', settings, missile, manager);

        // Add it to persistent
        persistentMissiles.push(missile);
    }

    // Remove deleted missiles from persistent
    persistentMissiles = persistentMissiles.filter(m => manager.missiles.find(e => e.address == m.address));


}
