const ws = require('ws');
const ActionController = require('./ActionController.js');
const server = new ws.Server({ port: 7007 });
console.log('Listening on port 7007');


server.on('connection', socket => {
    console.log('Socket connected');
    socket.on('message', e => {
        try {
            const [action, ...args] = e.toString().split('#');
            ActionController[action](...args);
        } catch (ex) {
            console.error(ex);
        }
    });
});

