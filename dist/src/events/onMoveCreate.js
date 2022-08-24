"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishOnMoveCreate = void 0;
function publishOnMoveCreate(manager, aiManagerCache, settings, publish) {
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
exports.publishOnMoveCreate = publishOnMoveCreate;
