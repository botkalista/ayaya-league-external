
const remote = require('@electron/remote');
const thisWin = remote.BrowserWindow.getFocusedWindow();

function forwardEvents(val) {
    if (!thisWin) return;
    thisWin.setIgnoreMouseEvents(val, { forward: true });
}
