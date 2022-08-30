
const fs = require('fs');
const path = require('path');

const state = Vue.reactive({

});

const app = Vue.createApp({
    data() { return state },
    methods: {
        forwardEvents
    }
});




app.component('test', {
    template: fs.readFileSync(path.join(__dirname, '../comps/test.html'), 'utf8')
});

app.mount('#app');