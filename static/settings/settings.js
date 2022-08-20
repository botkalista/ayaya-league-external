
const { ipcRenderer } = require('electron');

window.mouseEventFired = false;

// console.log = (...args) => {
//     document.getElementsByClassName('logs')[0].append(args.join(' ') + '\n');
// }
// console.error = (...args) => {
//     document.getElementsByClassName('logs')[0].append(args.join(' ') + '\n');
// }


const state = Vue.reactive({
    base: {
        overlaySpells: false,
        debugPerformance: false,
    },
    scripts: []
});

// ----- Settings -----
ipcRenderer.on('dataSettings', function (evt, message) {
    const data = JSON.parse(message);
    state.scripts = data.sort((a, b) => {
        if (a.name == 'Core.js') return -1;
        if (b.name == 'Core.js') return 1;
        return 0;
    });
});
ipcRenderer.send('requestSettings');


const app = Vue.createApp({
    data() { return state; },
    methods: {
        parseKey(setting) {
            return setting.strValue;
        },
        unselect(evt) {
            evt.target.selectionEnd = 0;
        },
        setMouse(setting, evt) {
            if (evt.which != 4) return;
            setting.value = 0x5;
            setting.strValue = 'MBx2';
            mouseEventFired = true;
            ipcRenderer.send('updateSettings', JSON.stringify(state.scripts));
        },
        setKey(setting, evt) {
            if (mouseEventFired) return mouseEventFired = false;
            setting.value = evt.keyCode;
            setting.strValue = evt.code; //`${evt.code} (0x${evt.keyCode.toString(16).toUpperCase()})`;
            ipcRenderer.send('updateSettings', JSON.stringify(state.scripts));
        },
        updateBaseSettings() {
            ipcRenderer.send('updateBaseSettings', JSON.stringify(state.base));
        },
        updateSettings() {
            ipcRenderer.send('updateSettings', JSON.stringify(state.scripts));
        },
        closeWindow() {
            ipcRenderer.send('closeSettingsWindow');
        },
        reloadWindows() {
            ipcRenderer.send('reloadWindows');
        },
        openOverlayDevTools() {
            ipcRenderer.send('openOverlayDevTools');
        },
        reloadScripts() {
            ipcRenderer.send('reloadScripts');
        },
        reloadMe() {
            location.reload();
        }
    }
});

app.mount('#app')