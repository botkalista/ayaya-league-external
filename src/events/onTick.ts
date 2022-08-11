import { UserScriptManager } from "../../scripts/UserScriptManager";
import { fnPublish } from './types';


export function publishOnTicks(manager: UserScriptManager, tickInfo: { ticks: number, lastOnTickPublish: number }, publish: fnPublish) {
    if (manager.game.time * 1000 < tickInfo.lastOnTickPublish + 30) return;
    publish('onTick', manager, tickInfo.ticks);
    tickInfo.lastOnTickPublish = manager.game.time * 1000;

}
