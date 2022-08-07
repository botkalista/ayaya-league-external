
import * as child from 'child_process';
import * as path from 'path';
import { Vector2 } from './models/Vector';


class ActionControllerWrapper {

    private p: child.ChildProcess;
    private connected = false;
    private lastCall = 0;

    private onGetPos = (x: number, y: number) => { };

    start(alaPath?: string) {
        if (this.connected) return;
        const exePath = alaPath || path.join(__dirname, "../../src/cpp/ALActionManager.exe");
        this.p = child.execFile(exePath);

        this.p.stdout.on('data', e => {
            const str = e.toString().trim();
            if (!str.startsWith('pos')) return;
            const [a, x, y] = str.split('_');
            this.onGetPos(parseInt(x), parseInt(y));
        });

        this.p.stderr.on('data', e => {
            console.log(e.toString());
        })

        return this.p;
    }

    private canCall() {
        const now = performance.now();
        if (this.lastCall > now - 30) return false;
        this.lastCall = now;
        return true;
    }

    move(x: number, y: number) {
        if (!this.canCall()) return;
        this.p.stdin.write(`move ${x} ${y}\n`);
    }
    click(button: "LEFT" | "RIGHT", x: number, y: number, delay: number = 10) {
        if (!this.canCall()) return;
        const iButton = button == "LEFT" ? 1 : 2;
        this.p.stdin.write(`click ${x} ${y} ${iButton} ${delay}\n`);
    }
    getMousePos(): Promise<Vector2> {
        return new Promise(resolve => {
            this.onGetPos = (x: number, y: number) => resolve(new Vector2(x, y));
            this.p.stdin.write(`pos\n`);
        });
    }
    setMousePos(x: number, y: number) {
        this.p.stdin.write(`move ${parseInt(x.toFixed(0))} ${parseInt(y.toFixed(0))}\n`);
    }
    blockInput(block: boolean) {
        this.p.stdin.write(`block ${block ? 1 : 0}\n`);
    }
}

const instance = new ActionControllerWrapper();

export default instance;