"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const electron_1 = require("electron");
const Preparator_1 = require("../overlay/Preparator");
const ScriptsLoader_1 = require("./ScriptsLoader");
const Performance_1 = require("../utils/Performance");
const UserScriptManager_1 = require("../../scripts/UserScriptManager");
const DrawContext_1 = require("../models/drawing/DrawContext");
const Settings_1 = require("../overlay/Settings");
const Utils_1 = require("../utils/Utils");
const CachedClass_1 = require("../models/CachedClass");
const Publisher_1 = require("./Publisher");
const onMoveCreate_1 = require("../events/onMoveCreate");
const onMissileCreate_1 = require("../events/onMissileCreate");
const onTick_1 = require("../events/onTick");
const Handlers_1 = require("./Handlers");
const ActionControllerWrapper_1 = require("../ActionControllerWrapper");
const Windows_1 = require("../overlay/Windows");
const LeagueReader_1 = require("../LeagueReader");
const Shared_1 = require("./Shared");
const WebApi_1 = require("./WebApi");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.argv[2] == 'nohook') {
            LeagueReader_1.default.reader.setMode("DUMP");
            LeagueReader_1.default.reader.loadDump();
        }
        else {
            try {
                LeagueReader_1.default.reader.hookLeagueProcess();
            }
            catch (ex) {
                if (Windows_1.default.entryWindow)
                    Windows_1.default.entryWindow.hide();
                electron_1.dialog.showMessageBoxSync({ title: 'Error', message: ex.message, type: 'error' });
                electron_1.app.exit();
            }
        }
        Shared_1.default.preparator = new Preparator_1.Preparator(LeagueReader_1.default);
        WebApi_1.default.start();
        Windows_1.default.createOverlayWindow();
        Windows_1.default.createSettingsWindow();
        Shared_1.default.renderer = LeagueReader_1.default.getRenderBase();
        Shared_1.default.screen = LeagueReader_1.default.getScreenSize(Shared_1.default.renderer);
        Windows_1.default.overlayWindow.setSize(Shared_1.default.screen.x, Shared_1.default.screen.y);
        if (!Shared_1.default.settingsShortcutInterval) {
            let lastOpen = 0;
            Shared_1.default.settingsShortcutInterval = setInterval(() => {
                const now = Date.now();
                if (lastOpen + 350 > now)
                    return;
                if (ActionControllerWrapper_1.default.isPressed(0x20) && ActionControllerWrapper_1.default.isPressed(0x11)) {
                    Windows_1.default.settingsWindow.isVisible() ? Windows_1.default.settingsWindow.hide() : Windows_1.default.settingsWindow.show();
                    lastOpen = now;
                }
            }, 30);
        }
        yield (0, ScriptsLoader_1.loadUserScripts)(Shared_1.default.userScripts);
        Shared_1.default.performance = new Performance_1.Performance();
        Shared_1.default.manager = new UserScriptManager_1.UserScriptManager();
        Shared_1.default.drawContext = new DrawContext_1.DrawContext();
        loop();
    });
}
exports.main = main;
function loop() {
    const performance = Shared_1.default.performance;
    const manager = Shared_1.default.manager;
    performance.start();
    manager.dispose();
    const settings = (0, Settings_1.getSettings)();
    //* Load required global variables
    const gameTime = LeagueReader_1.default.getGameTime();
    const me = manager.me;
    const myTeam = me.team;
    const nmeTeam = myTeam == 100 ? 200 : 100;
    const matrix = (0, Utils_1.matrixToArray)(LeagueReader_1.default.getViewProjectionMatrix());
    //* Put global variables into global cache
    CachedClass_1.CachedClass.set('screen', Shared_1.default.screen);
    CachedClass_1.CachedClass.set('matrix', matrix);
    CachedClass_1.CachedClass.set('gameTime', gameTime);
    CachedClass_1.CachedClass.set('myTeam', myTeam);
    CachedClass_1.CachedClass.set('nmeTeam', nmeTeam);
    performance.spot('first_part');
    (0, onMissileCreate_1.publishOnMissileCreate)(manager, Shared_1.default.persistentMissiles, settings, Publisher_1.publishToScript);
    performance.spot('missile_publish');
    (0, onMoveCreate_1.publishOnMoveCreate)(manager, Shared_1.default.aiManagerCache, settings, Publisher_1.publishToScript);
    performance.spot('on_move_create_publish');
    const finalData = {
        enemyChampions: [],
        performance: {
            time: 0,
            max: parseFloat(Shared_1.default.highestReadTime.toFixed(1)),
            reads: performance.getReads()
        },
        screen: Shared_1.default.screen,
        matrix,
    };
    performance.spot('drawer data');
    finalData.enemyChampions = manager.champions.enemies.map(e => Shared_1.default.preparator.prepareChampion(e));
    performance.spot('drawer - nmeChamps');
    // Publish onTick to scripts
    (0, onTick_1.publishOnTicks)(manager, Shared_1.default.tickInfo, settings, Publisher_1.publishToScript);
    performance.spot('on_tick_publish');
    // --- performance ---
    const result = performance.end();
    if (result.time > Shared_1.default.highestReadTime)
        Shared_1.default.highestReadTime = result.time;
    // --- performance ---
    finalData.performance.time = result.time;
    (0, Handlers_1.sendMessageToWin)(Windows_1.default.overlayWindow, 'gameData', finalData);
    Shared_1.default.tickInfo.ticks++;
    manager.dispose();
    setTimeout(loop, 5);
}
