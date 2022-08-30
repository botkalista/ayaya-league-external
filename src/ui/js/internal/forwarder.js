
const remote = require('@electron/remote');

const thisWin = remote.BrowserWindow.getFocusedWindow();

function forwardEvents(val) {
    thisWin.setIgnoreMouseEvents(val, { forward: true });
}
