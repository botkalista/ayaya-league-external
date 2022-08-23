

import { BrowserWindow, dialog, ipcMain, IpcMainEvent, WebContents } from 'electron';
import { setSettings, saveSettingsToFile, getSettings } from '../overlay/Settings'
import { loadUserScripts, unloadUserScripts } from './ScriptsLoader';
import { main } from './main';

import AyayaActionController from '../ActionControllerWrapper';
import WindowsManager from '../overlay/Windows';
import AyayaLeague from '../LeagueReader';
import Shared from './Shared';

export function sendMessageToWin(win: BrowserWindow | WebContents, name: string, data: any) {
    if (win['webContents']) return (win as BrowserWindow).webContents.send(name, JSON.stringify(data));
    return (win as WebContents).send(name, JSON.stringify(data));
}

export function onMessage<T>(name: string, cb: (e: IpcMainEvent, message: T) => void) {
    ipcMain.on(name, (e, message) => {
        if (message == undefined || message == 'undefined') return cb(e, undefined as unknown as T);
        cb(e, JSON.parse(message));
    });
}

export function registerHandlers() {

    onMessage<never>('startAyayaLeague', (e, data) => {
        try {

            WindowsManager.entryWindow.hide();
            const leagueProcess = AyayaLeague.reader.memInstance.getProcesses().find(e => {
                return e.szExeFile == 'League of Legends.exe'
            });
            if (!leagueProcess) {
                dialog.showErrorBox('Not in game', 'You need to be in a game before starting AyayaLeague')
                WindowsManager.entryWindow.show();
            } else {
                main();
            }
        } catch (ex) {

        }
    });


    //* On Draw Manager
    onMessage<never>('drawingContext', (e, data) => {
        Shared.drawContext.__clearCommands();
        for (const script of Shared.userScripts) {
            const setting = getSettings().find(e => e.name == script._scriptname);
            script.onDraw && script.onDraw(Shared.drawContext, Shared.manager, (setting || { data: [] }).data);
        }
        e.returnValue = JSON.stringify(Shared.drawContext.__getCommands());
    });



    onMessage<any[]>('updateSettings', (e, data) => {
        setSettings(data);
        saveSettingsToFile();
        sendMessageToWin(WindowsManager.settingsWindow, 'dataSettings', data);
    });

    onMessage<any>('updateBaseSettings', (e, data) => {
        sendMessageToWin(WindowsManager.overlayWindow, 'dataBaseSettings', data);
    });

    onMessage<never>('requestSettings', (e, data) => {
        const settings = getSettings();
        sendMessageToWin(e.sender, 'dataSettings', settings);
    });

    onMessage<never>('requestScreenSize', (e, data) => {
        Shared.renderer = Shared.renderer || AyayaLeague.getRenderBase();
        Shared.screen = Shared.screen || AyayaLeague.getScreenSize(Shared.renderer);
        sendMessageToWin(e.sender, 'dataScreenSize', Shared.screen);
    });

    onMessage<never>('closeSettingsWindow', (e, data) => {
        WindowsManager.settingsWindow.hide();
    });


    onMessage<never>('reloadScripts', async (e, data) => {
        await unloadUserScripts(Shared.userScripts);
        await loadUserScripts(Shared.userScripts);
    });

    onMessage<never>('reloadWindows', (e, data) => {
        WindowsManager.overlayWindow.reload();
        WindowsManager.settingsWindow.reload();
    });

    onMessage<never>('openOverlayDevTools', (e, data) => {
        if (AyayaActionController.isPressed(0x11)) return WindowsManager.settingsWindow.webContents.openDevTools({ mode: 'detach' });
        WindowsManager.overlayWindow.webContents.openDevTools({ mode: 'detach' });
    });


}