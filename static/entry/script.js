
const fs = require('fs');
const path = require('path');
const electron = require('electron');

const isPrebuilt = !fs.existsSync(path.join(__dirname, '../../scripts/userscripts'));

const basePathEnabled = isPrebuilt ? path.join(__dirname, '../../resources/app/scripts/userscripts') : path.join(__dirname, '../../scripts/userscripts');
const basePathDisabled = isPrebuilt ? path.join(__dirname, '../../resources/app/scripts/userscripts_disabled') : path.join(__dirname, '../../scripts/userscripts_disabled');

const state = Vue.reactive({
    view: 1,
    scripts: [],
    version: {
        current: '?',
        last: '?'
    }
});

const app = Vue.createApp({
    data() { return state; },
    computed: {
        versionColor() {
            const version = state.version;
            return {
                ok: (version.current == version.last) || version.last == '?',
                ko: (version.current != version.last) && version.last != '?',
            }
        }
    },
    methods: {
        reloadScripts,
        saveScripts,
        loadGuide,
        openDiscord() {
            electron.shell.openExternal('https://discord.gg/qYy8Qz4Cr5')
        },
        openGithub() {
            electron.shell.openExternal('https://github.com/botkalista/ayaya-league-external')
        },
        changeView(view) {
            if (view == 3) {
                return loadGuide();
            } else {
                state.view = view;
            }
        },
        closeMe() {
            electron.ipcRenderer.send('closeAyayaLeague');
            window.close();
        },
        startAyayaLeague() {
            electron.ipcRenderer.send('startAyayaLeague');
        },
    }
});

async function getSnippet(name) {
    const res = await fetch('guide/snippets/' + name);
    const data = await res.text();
    return data;
}

function loadGuide() {
 
console.log('loadGuide')

    fetch('guide/guide.html').then(res => res.text()).then(async _data => {

        let data = _data;

        do {
            currentSnippet = data.match(/\/\/file:(.*)\/\//);
            if (currentSnippet == null) break;
            const snippet = await getSnippet(currentSnippet[1]);
            data = data.replace(`//file:${currentSnippet[1]}//`, snippet)
        } while (currentSnippet)


        state.guideContent = data;
        state.view = 3;
        setTimeout(() => {
            console.log('HIGHLIGHT')
            hljs.highlightAll();
        }, 100);
    });

}

window.debug_reloadGuide = () => {
    loadGuide();
}
window.goToMainPage = () => {
    state.view = 1;
}

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

try {
    fetch('https://raw.githubusercontent.com/botkalista/ayaya-league-external/master/ayaya_version')
        .then(res => res.text()).then(e => {

            if (e.startsWith('404')) {
                state.version.last = '?';
            } else {
                const lastVersion = e;
                state.version.last = lastVersion;
            }

            const versionPath = fs.existsSync('ayaya_version') ? 'ayaya_version' : 'resources/app/ayaya_version';
            const version = fs.readFileSync(versionPath, 'utf-8');
            state.version.current = version;
        });
} catch (ex) {
    console.error(ex);
}

reloadScripts();

app.mount('#app');