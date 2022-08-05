const ws = require('ws');
const ActionController = require('./ActionController.js');
const server = new ws.Server({ port: 7007 });
console.log('Listening on port 7007');



let lastAction = 0;

server.on('connection', socket => {
    console.log('Socket connected');
    socket.on('message', e => {
        try {
            const now = performance.now();
            if (lastAction > now - 50) return;
            const [action, ...args] = e.toString().split('#');
            ActionController[action](...args);
            lastAction = now;
        } catch (ex) {
            console.error(ex);
        }
    });
});

