import type { UserScriptManager } from "../../scripts/UserScriptManager";
import type { Vector3 } from "../models/Vector";
import type { fnPublish, ScriptSettingsFull } from '../events/types';

export function publishOnMoveCreate(manager: UserScriptManager, aiManagerCache: Map<string, [Vector3, Vector3]>, settings: ScriptSettingsFull, publish: fnPublish) {
    for (const champ of manager.champions.enemies) {
        const target = aiManagerCache.get(champ.address.toString());
        if (target) {
            const oStart = target[0];
            const oEnd = target[1];
            if (!oStart.isEqual(champ.AiManager.startPath) || !oEnd.isEqual(champ.AiManager.endPath)) {
                publish('onMoveCreate', settings, champ, manager);
            }
        }
        aiManagerCache.set(champ.address.toString(), [champ.AiManager.startPath.copy(), champ.AiManager.endPath.copy()]);
    }
}