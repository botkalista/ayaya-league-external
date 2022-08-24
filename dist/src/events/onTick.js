"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishOnTicks = void 0;
function publishOnTicks(manager, tickInfo, settings, publish) {
    if (manager.game.time * 1000 < tickInfo.lastOnTickPublish + 30)
        return;
    publish('onTick', settings, manager, tickInfo.ticks);
    tickInfo.lastOnTickPublish = manager.game.time * 1000;
}
exports.publishOnTicks = publishOnTicks;
