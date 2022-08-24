process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

console.log('ELECTRON', process.versions.electron, 'NODE', process.versions.node, 'ARCH', process.arch)

import WindowsManager from './overlay/Windows';
import { registerHandlers } from './main/Handlers';

import { BrowserWindow, app, ipcMain, globalShortcut, IpcMainEvent, WebContents, dialog } from 'electron';
import AyayaLeague from './LeagueReader';

import AyayaActionController from './ActionControllerWrapper';

import { loadSettingsFromFile, setSettings, saveSettingsToFile, getSettings } from './overlay/Settings'

import { Vector2, Vector3 } from './models/Vector';
import { Preparator } from './overlay/Preparator';
import { matrixToArray } from './utils/Utils';
import { Performance } from './utils/Performance';
import { UserScriptManager } from '../scripts/UserScriptManager';
import { CachedClass } from './models/CachedClass';

import { publishOnMoveCreate } from './events/onMoveCreate';
import { publishOnMissileCreate } from './events/onMissileCreate';
import { publishOnTicks } from './events/onTick';
import { DrawContext } from './models/drawing/DrawContext';

import * as path from 'path';
import * as fs from 'fs';
import * as fetch from 'node-fetch';
import { Missile } from './models/Missile';
import { ScriptSettingsFull, UserScript } from './events/types';


async function entry() {
    WindowsManager.createEntryWindow();
    registerHandlers();
}

app.whenReady().then(entry);


app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

