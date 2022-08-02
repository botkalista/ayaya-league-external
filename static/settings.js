
const { ipcRenderer } = require('electron');

const state = Vue.reactive({
    settings: {
        me: { range: true },
        nmeChamps: { range: true, spells: true },
        over: { nmeSpells: true, performance: true },
    }
});

// ----- Settings -----
ipcRenderer.on('dataSettings', function (evt, message) {
    const data = JSON.parse(message);
    state.settings = data;
});
ipcRenderer.send('requestSettings');


const app = Vue.createApp({
    data() { return state; },
    methods: {
        updateSettings() {
            ipcRenderer.send('updateSettings', JSON.stringify(state.settings));
        },
        closeWindow() {
            ipcRenderer.send('closeSettingsWindow');
        }
    }
});

app.mount('#app')