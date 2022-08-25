import { app, dialog } from 'electron';

import { Preparator } from '../overlay/Preparator';
import { loadUserScripts } from './ScriptsLoader';
import { Performance } from '../utils/Performance';
import { UserScriptManager } from '../../scripts/UserScriptManager';
import { DrawContext } from '../models/drawing/DrawContext';
import { getSettings } from '../overlay/Settings';
import { matrixToArray } from '../utils/Utils';
import { CachedClass } from '../models/CachedClass';
import { publishToScript } from './Publisher';
import { publishOnMoveCreate } from '../events/onMoveCreate';
import { publishOnMissileCreate } from '../events/onMissileCreate';
import { publishOnTicks } from '../events/onTick';
import { sendMessageToWin } from './Handlers'

import AyayaActionController from '../ActionControllerWrapper';
import WindowsManager from '../overlay/Windows';
import AyayaLeague from '../LeagueReader';
import Shared from './Shared';
import WebApi from './WebApi';



export async function main() {


    try {
        AyayaLeague.reader.hookLeagueProcess();
    } catch (ex) {
        if (WindowsManager.entryWindow) WindowsManager.entryWindow.hide();
        dialog.showMessageBoxSync({ title: 'Error', message: ex.message, type: 'error' });
        app.exit();
    }

    Shared.preparator = new Preparator(AyayaLeague);

    WebApi.start();

    WindowsManager.createOverlayWindow();
    WindowsManager.createSettingsWindow();

    Shared.renderer = AyayaLeague.getRenderBase();
    Shared.screen = AyayaLeague.getScreenSize(Shared.renderer);
    WindowsManager.overlayWindow.setSize(Shared.screen.x, Shared.screen.y);

    if (!Shared.settingsShortcutInterval) {
        let lastOpen = 0;
        Shared.settingsShortcutInterval = setInterval(() => {
            const now = Date.now();
            if (lastOpen + 350 > now) return;
            if (AyayaActionController.isPressed(0x20) && AyayaActionController.isPressed(0x11)) {
                WindowsManager.settingsWindow.isVisible() ? WindowsManager.settingsWindow.hide() : WindowsManager.settingsWindow.show();
                lastOpen = now;
            }
        }, 30);
    }

    await loadUserScripts(Shared.userScripts);


    Shared.performance = new Performance();

    Shared.manager = new UserScriptManager();
    Shared.drawContext = new DrawContext();


    loop();

}

function loop() {

    const performance = Shared.performance;
    const manager = Shared.manager;

    performance.start();
    manager.dispose();

    const settings = getSettings();


    //* Load required global variables
    const gameTime = AyayaLeague.getGameTime();
    const me = manager.me;
    const myTeam = me.team;
    const nmeTeam = myTeam == 100 ? 200 : 100;
    const matrix = matrixToArray(AyayaLeague.getViewProjectionMatrix());

    //* Put global variables into global cache
    CachedClass.set('screen', Shared.screen);
    CachedClass.set('matrix', matrix);
    CachedClass.set('gameTime', gameTime);
    CachedClass.set('myTeam', myTeam);
    CachedClass.set('nmeTeam', nmeTeam);


    performance.spot('first_part');

    publishOnMissileCreate(manager, Shared.persistentMissiles, settings, publishToScript);

    performance.spot('missile_publish');

    publishOnMoveCreate(manager, Shared.aiManagerCache, settings, publishToScript);

    performance.spot('on_move_create_publish');

    const finalData: {
        enemyChampions: any[],
        performance: any,
        screen: any,
        matrix: any
    } = {
        enemyChampions: [],
        performance: {
            time: 0,
            max: parseFloat(Shared.highestReadTime.toFixed(1)),
            reads: performance.getReads()
        },
        screen: Shared.screen,
        matrix,
    }
    performance.spot('drawer data');
    finalData.enemyChampions = manager.champions.enemies.map(e => Shared.preparator.prepareChampion(e));
    performance.spot('drawer - nmeChamps');

    // Publish onTick to scripts
    publishOnTicks(manager, Shared.tickInfo, settings, publishToScript);

    performance.spot('on_tick_publish');

    // --- performance ---
    const result = performance.end();
    if (result.time > Shared.highestReadTime) Shared.highestReadTime = result.time;
    // --- performance ---

    finalData.performance.time = result.time;
    sendMessageToWin(WindowsManager.overlayWindow, 'gameData', finalData);
    Shared.tickInfo.ticks++;
    manager.dispose();
    setTimeout(loop, 5);
}