
import * as ws from 'ws';

class ActionControllerWrapper {
    private socket: ws;
    private connected = false;
    connect() {
        if (this.connected) return;
        this.socket = new ws("ws://127.0.0.1:7007");
        this.connected = true;
    }
    leftClick() { this.socket.send('leftClick') }
    rightClick() { this.socket.send('rightClick') }
    leftClickAt(x: number, y: number) { this.socket.send(`leftClickAt#${x}#${y}`) }
    rightClickAt(x: number, y: number) { this.socket.send(`rightClickAt#${x}#${y}`) }
    moveMouse(x: number, y: number) { this.socket.send(`moveMouse#${x}#${y}`) }
}

const instance = new ActionControllerWrapper();

export default instance;