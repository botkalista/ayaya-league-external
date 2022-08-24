"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../overlay/Settings");
const UserScriptManager_1 = require("../../scripts/UserScriptManager");
const Performance_1 = require("../utils/Performance");
const Utils_1 = require("../utils/Utils");
const CachedClass_1 = require("../models/CachedClass");
const onMoveCreate_1 = require("../events/onMoveCreate");
const onMissileCreate_1 = require("../events/onMissileCreate");
const onTick_1 = require("../events/onTick");
const MessageHandler_1 = require("./MessageHandler");
const Preparator_1 = require("../overlay/Preparator");
const Windows_1 = require("../overlay/Windows");
const LeagueReader_1 = require("../LeagueReader");
const ScriptLoader_1 = require("./ScriptLoader");
class LoopManager {
    constructor() {
        this.persistentMissiles = [];
        this.aiManagerCache = new Map();
        this.performance = new Performance_1.Performance();
        this.tickInfo = { ticks: 0, lastOnTickPublish: 0 };
        this.isLooping = false;
        this.manager = new UserScriptManager_1.UserScriptManager();
        this.highestReadTime = 0;
        this.preparator = new Preparator_1.Preparator(LeagueReader_1.default);
        this.overlayWindow = (0, Windows_1.getWindows)().overlayWindow;
        this.screen = LeagueReader_1.default.getScreenSize(LeagueReader_1.default.getRenderBase());
    }
    start() {
        if (this.isLooping)
            return;
        this.isLooping = true;
        this.loop();
    }
    stop() {
        this.isLooping = false;
    }
    loop() {
        this.performance.start();
        this.manager.dispose();
        const settings = (0, Settings_1.getSettings)();
        //* Load required global variables
        const gameTime = LeagueReader_1.default.getGameTime();
        const me = this.manager.me;
        const myTeam = me.team;
        const nmeTeam = myTeam == 100 ? 200 : 100;
        const matrix = (0, Utils_1.matrixToArray)(LeagueReader_1.default.getViewProjectionMatrix());
        //* Put global variables into global cache
        CachedClass_1.CachedClass.set('screen', screen);
        CachedClass_1.CachedClass.set('matrix', matrix);
        CachedClass_1.CachedClass.set('gameTime', gameTime);
        CachedClass_1.CachedClass.set('myTeam', myTeam);
        CachedClass_1.CachedClass.set('nmeTeam', nmeTeam);
        this.performance.spot('first_part');
        (0, onMissileCreate_1.publishOnMissileCreate)(this.manager, this.persistentMissiles, settings, ScriptLoader_1.default.publishToScript);
        this.performance.spot('missile_publish');
        (0, onMoveCreate_1.publishOnMoveCreate)(this.manager, this.aiManagerCache, settings, ScriptLoader_1.default.publishToScript);
        this.performance.spot('on_move_create_publish');
        const finalData = {
            enemyChampions: [],
            performance: { time: 0, max: parseFloat(this.highestReadTime.toFixed(1)), reads: this.performance.getReads() },
            screen: this.screen,
            matrix,
        };
        this.performance.spot('drawer data');
        finalData.enemyChampions = this.manager.champions.enemies.map(e => this.preparator.prepareChampion(e));
        this.performance.spot('drawer - nmeChamps');
        // Publish onTick to scripts
        (0, onTick_1.publishOnTicks)(this.manager, this.tickInfo, settings, ScriptLoader_1.default.publishToScript);
        this.performance.spot('on_tick_publish');
        // --- performance ---
        const result = this.performance.end();
        if (result.time > this.highestReadTime)
            this.highestReadTime = result.time;
        // --- performance ---
        finalData.performance.time = result.time;
        (0, MessageHandler_1.sendMessageToWin)(this.overlayWindow, 'gameData', finalData);
        this.tickInfo.ticks++;
        this.manager.dispose();
        if (this.isLooping)
            setTimeout(() => this.loop(), 5);
    }
}
const instance = new LoopManager();
exports.default = instance;
