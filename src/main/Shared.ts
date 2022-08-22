
import type { UserScriptManager } from '../../scripts/UserScriptManager';
import type { DrawContext } from '../models/drawing/DrawContext';
import type { Vector2, Vector3 } from "../models/Vector";
import type { Performance } from '../utils/Performance';
import type { Preparator } from '../overlay/Preparator';
import type { UserScript } from "../events/types";
import type { Missile } from '../models/Missile';

class Shared {

    userScripts: UserScript[] = [];

    settingsShortcutInterval: NodeJS.Timer;

    persistentMissiles: Missile[] = [];
    aiManagerCache = new Map<string, [Vector3, Vector3]>();

    manager: UserScriptManager;
    drawContext: DrawContext;

    highestReadTime: number = 0;
    tickInfo = { lastOnTickPublish: 0, ticks: 1 }

    performance: Performance
    preparator: Preparator;
    renderer: any;
    screen: Vector2;


    constructor() { }


}


const instance = new Shared();

export default instance;