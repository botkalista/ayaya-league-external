
import * as ws from 'ws';
import * as child from 'child_process';
import * as path from 'path';

class ActionControllerWrapper {
    private socket: ws;
    private connected = false;
    private lastActionTime = 0;
    private blockInputProcess: child.ChildProcess;
    connect() {
        if (this.connected) return;
        this.socket = new ws("ws://127.0.0.1:7007");
        this.blockInputProcess = child.execFile(path.join(__dirname, "../../src/cpp/BlockInput.exe"));
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
    blockInput(block: boolean) {
        this.blockInputProcess.stdin.write(block ? 'on\n' : 'off\n');
    }
}

const instance = new ActionControllerWrapper();

export default instance;