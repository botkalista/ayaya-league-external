import type { UserScriptManager } from "../../scripts/UserScriptManager";
import type { fnPublish, ScriptSettingsFull } from './types';


export function publishOnTicks(manager: UserScriptManager, tickInfo: { ticks: number, lastOnTickPublish: number }, settings: ScriptSettingsFull, publish: fnPublish) {
    if (manager.game.time * 1000 < tickInfo.lastOnTickPublish + 30) return;
    publish('onTick', settings, manager, tickInfo.ticks);
    tickInfo.lastOnTickPublish = manager.game.time * 1000;

}
