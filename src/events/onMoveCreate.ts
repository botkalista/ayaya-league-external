import { UserScriptManager } from "../../scripts/UserScriptManager";
import { Vector3 } from "../models/Vector";
import { fnPublish, ScriptSettingsFull } from '../events/types';

export function publishOnMoveCreate(manager: UserScriptManager, aiManagerCache: Map<string, [Vector3, Vector3]>, settings: ScriptSettingsFull, publish: fnPublish) {

    for (const champ of manager.champions.enemies) {

        const target = aiManagerCache.get(champ.name);
        if (target) {
            const oStart = target[0];
            const oEnd = target[1];
            if (oStart && oEnd && oStart.isEqual(champ.AiManager.startPath) && oEnd.isEqual(champ.AiManager.endPath)) {
                // console.log(champ.name);
                publish('onMoveCreate', settings, champ, manager);
            }
        }
        aiManagerCache.set(champ.name, [champ.AiManager.startPath.copy(), champ.AiManager.endPath.copy()]);

    }

}