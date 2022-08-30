
const fs = require('fs');
const path = require('path');

const state = Vue.reactive({
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
        toggleSettings
    }
});

function toggleSettings() {
    const settingsWindow = document.getElementsByClassName('settings')[0];
    settingsWindow.classList.toggle('anim_enter');

}

app.component('test', {
    template: fs.readFileSync(path.join(__dirname, '../comps/test.html'), 'utf8')
});

app.use(ElementPlus);
app.mount('#app');