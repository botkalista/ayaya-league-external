import { UserScriptManager } from "../../scripts/UserScriptManager";
import { Vector3 } from "../models/Vector";
import { fnPublish } from '../events/types';

export function publishOnMoveCreate(manager: UserScriptManager, aiEndPositions: Map<number, Vector3>, publish: fnPublish) {
    for (const champ of manager.champions.enemies) {
        const oldPos = aiEndPositions.get(champ.address);
        if (oldPos && champ.AiManager.endPath.isEqual(oldPos)) return;
        aiEndPositions.set(champ.address, champ.AiManager.endPath);
        publish('onMoveCreate', champ, manager);
    }
}