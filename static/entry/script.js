
const fs = require('fs');
const path = require('path');
const electron = require('electron');

const isPrebuilt = !fs.existsSync(path.join(__dirname, '../../scripts/userscripts'));

const basePathEnabled = isPrebuilt ? path.join(__dirname, '../../resources/app/scripts/userscripts') : path.join(__dirname, '../../scripts/userscripts');
const basePathDisabled = isPrebuilt ? path.join(__dirname, '../../resources/app/scripts/userscripts_disabled') : path.join(__dirname, '../../scripts/userscripts_disabled');

const state = Vue.reactive({
    view: 1,
    scripts: []
});

const app = Vue.createApp({
    data() { return state; },
    methods: {
        reloadScripts,
        saveScripts,
        openDiscord() {
            electron.shell.openExternal('https://discord.gg/qYy8Qz4Cr5')
        },
        openGithub() {
            electron.shell.openExternal('https://github.com/botkalista/ayaya-league-external')
        },
        changeView(view) {
            state.view = view;
        },
        closeMe() {
            window.close();
        },
        startAyayaLeague() {
            electron.ipcRenderer.send('startAyayaLeague');
        }
    }
});

function addScript(script, basePath, loaded) {
    if (!script.endsWith('.js')) return;
    const s = {}
    const path = basePath + '/' + script;
    s.path = path;
    s.name = script.replace('.js', '');
    const size = fs.statSync(path).size;
    s.size = Math.round(size / 1000);
    const content = fs.readFileSync(path, 'utf8');
    const author = content.match(/#Author: (.*)/);
    const desc = content.match(/#Description: (.*)/);
    s.author = author?.length > 0 ? author[1] : '';
    s.desc = desc?.length > 0 ? desc[1] : '';
    s.load = loaded;
    state.scripts.push(s);
}

function reloadScripts() {
    state.scripts.length = 0;
    const scriptsEnabled = fs.readdirSync(basePathEnabled);
    for (const script of scriptsEnabled) {
        addScript(script, basePathEnabled, true);
    }
    const scriptsDisabled = fs.readdirSync(basePathDisabled);
    for (const script of scriptsDisabled) {
        addScript(script, basePathDisabled, false);
    }

    state.scripts.sort((a, b) => {
        if (a.name == 'Core') return -1;
        if (b.name == 'Core') return 1;
        return 0;
    });
}

function saveScripts() {


    for (const script of state.scripts.filter(e => e.load)) {
        if (!script.path.includes(basePathDisabled)) continue;
        fs.renameSync(script.path, basePathEnabled + '/' + script.name + '.js');
    }
    for (const script of state.scripts.filter(e => !e.load)) {
        if (script.path.includes(basePathDisabled)) continue;
        fs.renameSync(script.path, basePathDisabled + '/' + script.name + '.js');
    }

    reloadScripts();

}

reloadScripts();

app.mount('#app');