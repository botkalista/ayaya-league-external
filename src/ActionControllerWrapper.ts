
import * as ws from 'ws';

class ActionControllerWrapper {
    private socket: ws;
    private connected = false;
    private lastActionTime = 0;
    connect() {
        if (this.connected) return;
        this.socket = new ws("ws://127.0.0.1:7007");
        this.connected = true;
    }
    leftClick() { if (!this.canSend()) return; this.socket.send('leftClick'); return true; }
    rightClick() { if (!this.canSend()) return; this.socket.send('rightClick'); return true; }
    leftClickAt(x: number, y: number) { if (!this.canSend()) return; this.socket.send(`leftClickAt#${x}#${y}`); return true; }
    rightClickAt(x: number, y: number) { if (!this.canSend()) return; this.socket.send(`rightClickAt#${x}#${y}`); return true; }
    moveMouse(x: number, y: number) { if (!this.canSend()) return; this.socket.send(`moveMouse#${x}#${y}`); return true; }
    private canSend() {
        const now = performance.now();
        if (this.lastActionTime > now - 50) return false;
        this.lastActionTime = now;
        return true;
    }
}

const instance = new ActionControllerWrapper();

export default instance;