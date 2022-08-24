process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

console.log('ELECTRON', process.versions.electron, 'NODE', process.versions.node, 'ARCH', process.arch)

import WindowsManager from './overlay/Windows';
import { registerHandlers } from './main/Handlers';
import { app, globalShortcut } from 'electron';

async function entry() {
    WindowsManager.createEntryWindow();
    registerHandlers();
}

app.whenReady().then(entry);


app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

