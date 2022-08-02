
const { ipcRenderer } = require('electron');

const state = Vue.reactive({
    me: { range: true },
    nmeChamps: { range: true, spells: true },
    over: { nmeSpells: true, performance: true },
});

// ----- Settings -----
ipcRenderer.on('dataSettings', function (evt, message) {
    const data = JSON.parse(message);
    settings = data;
});
ipcRenderer.send('requestSettings');


const app = Vue.createApp({
    data() { return state; },
    methods: {
        updateSettings() {
            ipcRenderer.send('updateSettings', JSON.stringify(state));
        },
        closeWindow() {
            ipcRenderer.send('closeSettingsWindow');
        }
    }
});

app.mount('#app')