
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const fs = require('fs');
const path = require('path');

const state = Vue.reactive({
    version: "2.2.0",
    vKeys,
    updated: true,
    inGame: false,
    donations: [],
    offsets: {},
    now: Date.now(),
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
    mounted,
    data() { return state },
    methods: {
        toggleSettings,
        updateSettings,
        reloadScripts,
        closeWindow,
        openDonateLink,
        openMarket
    },
    computed: {
        durationString() {
            const a = ((state.offsets - state.now) / 1000).toFixed(0);
            const b = ((state.offsets - state.now) / 1000 / 60).toFixed(0);
            return `DURATION: ${a} s [${b} min]`
        }
    }
});


function openDonateLink() {
    electron.shell.openExternal('https://ko-fi.com/ayayaleague')
}

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

function openMarket() {
    ipcRenderer.send('openMarket');
}

const appElement = document.getElementById('app');
appElement.style.visibility = 'hidden';


// app.component('test', {
//     template: fs.readFileSync(path.join(__dirname, '../comps/test.html'), 'utf8')
// });



fetch('http://95.216.218.179:7551/kofi').then(res => res.status != 500 ? res.json() : []).then(data => {
    state.donations = data;
});
fetch('http://95.216.218.179:7551/static/ayaya_version').then(res => res.text()).then(data => {
    state.updated = (data == `v${state.version}`);
});


ipcRenderer.on('toggleSettings', (e, data) => {
    console.log('TOGGLE SETTINGS')
    toggleSettings();
});

ipcRenderer.on('__offsets', (e, data) => {
    state.offsets = JSON.parse(data);
});

setInterval(() => {
    state.now = Date.now();
    if (state.now >= state.offsets) {
        ipcRenderer.send('expired');
    }
}, 1000)

ipcRenderer.on('scripts', (e, scripts) => {
    state.scripts = scripts;
    console.log('Got script settings', scripts)
});


ipcRenderer.on('inGame', (e, value) => {
    console.log('got inGame', value);
    state.inGame = value;
});


app.use(ElementPlus);
app.mount('#app');
ipcRenderer.send('loaded');

function mounted() {
    setTimeout(() => {
        appElement.style.visibility = 'visible';
        const loader = document.getElementsByClassName('loader')[0];
        loader.style.display = 'none';
        ipcRenderer.send('loaded');
        ipcRenderer.send('settingsRequest')
    }, 1000);
}



