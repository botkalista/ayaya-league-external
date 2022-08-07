
import * as child from 'child_process';
import * as path from 'path';
import { Vector2 } from './models/Vector';


class ActionControllerWrapper {

    private p: child.ChildProcess;
    private connected = false;

    private onGetPos = (x: number, y: number) => { };

    start() {
        if (this.connected) return;
        const exePath = path.join(__dirname, "../../src/cpp/ALActionManager.exe");
        this.p = child.execFile(exePath);

        this.p.stdout.on('data', e => {
            const str = e.toString();
            if (!str.startsWith('pos')) return;
            const [a, x, y] = str.split('_');
            this.onGetPos(x, y);
        });

        return this.p;
    }

    move(x: number, y: number) {
        this.p.stdin.write(`move ${x} ${y}`);
    }
    click(button: "LEFT" | "RIGHT", x: number, y: number, delay: number = 10) {
        const iButton = button == "LEFT" ? 1 : 2;
        this.p.stdin.write(`click ${x} ${y} ${iButton} ${delay}`);
    }
    getMousePos(): Promise<Vector2> {
        return new Promise(resolve => {
            this.onGetPos = (x: number, y: number) => resolve(new Vector2(x, y));
            this.p.stdin.write(`pos`);
        });
    }
    setMousePos(x: number, y: number) {
        this.p.stdin.write(`move ${parseInt(x.toFixed(0))} ${parseInt(y.toFixed(0))}`);
    }
    blockInput(block: boolean) {
        this.p.stdin.write(`block ${block ? 1 : 0}`);
    }
}

const instance = new ActionControllerWrapper();

export default instance;