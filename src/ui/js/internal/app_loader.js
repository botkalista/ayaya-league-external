
const { ipcRenderer } = require('electron');

const fs = require('fs');
const path = require('path');

const state = Vue.reactive({
    inGame: false,
    scripts: [
        {
            script: 'default', settings: [
                { title: 'AYAYA-LEAGUE' },
                {
                    group: [
                        { id: 'enabled', text: 'Enable', type: 'toggle', style: 2, value: true }
                    ]
                },
                { desc: 'This enables/disables all scripts' }
            ]
        }
    ]
});

const app = Vue.createApp({
    data() { return state },
    methods: {
        forwardEvents,
        toggleSettings,
        updateSettings,
        reloadScripts,
        closeWindow
    }
});

function closeWindow() {
    window.close();
}

function reloadScripts(event) {
    ipcRenderer.send('reloadScripts');
}

function updateSettings(script, s, e) {
    const name = script.name;
    const id = e.id;
    const value = e.value;
    console.log('updateSettings', { scriptName: name, id, value })
    ipcRenderer.send('settings', { scriptName: name, id, value })
}

function toggleSettings() {
    const settingsWindow = document.getElementsByClassName('settings')[0];
    settingsWindow.classList.toggle('anim_enter');
}

app.component('test', {
    template: fs.readFileSync(path.join(__dirname, '../comps/test.html'), 'utf8')
});

app.use(ElementPlus);
app.mount('#app');


ipcRenderer.on('scripts', (e, scripts) => {
    state.scripts = scripts;
    console.log('Got script settings', scripts)
});


ipcRenderer.on('inGame', (e, value) => {
    state.inGame = value;
    if (value == true) {
        loop();
    }
});