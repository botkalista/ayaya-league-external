
import * as child from 'child_process';
import * as path from 'path';
import { Vector2 } from './models/Vector';


class ActionControllerWrapper {

    private p: child.ChildProcess;
    private connected = false;
    private lastCall = 0;

    private onGetPos = (x: number, y: number) => { };
    private onGetKey = (result: number) => { }

    start(alaPath?: string) {
        if (this.connected) return;
        const exePath = alaPath || path.join(__dirname, "../../src/cpp/ALActionManager.exe");
        this.p = child.execFile(exePath);

        this.p.stdout.on('data', e => {
            const str = e.toString().trim();
            console.log(str);
            if (str.startsWith('pos')) {
                const [a, x, y] = str.split('_');
                this.onGetPos(parseInt(x), parseInt(y));
            } else if (str.startsWith('check')) {
                const [a, result] = str.split('_');
                this.onGetKey(result);
            }
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

    isPressed(key: number): Promise<boolean> {
        return new Promise(resolve => {
            this.onGetKey = (k: number) => resolve(k != 0);
            this.p.stdin.write(`check ${key}\n`);
        });
    }

    press(key: number) {
        this.p.stdin.write(`press ${key}\n`);
    }

    async move(x: number, y: number) {
        while (!this.canCall()) await new Promise(r => setTimeout(r, 5));
        this.p.stdin.write(`move ${x} ${y}\n`);
    }
    async click(button: "LEFT" | "RIGHT", x: number, y: number, delay: number = 10) {
        while (!this.canCall()) await new Promise(r => setTimeout(r, 5));
        const iButton = button == "LEFT" ? 1 : 2;
        this.p.stdin.write(`click ${x} ${y} ${iButton} ${delay}\n`);
    }
    getMousePos(): Promise<Vector2> {
        return new Promise(resolve => {
            this.onGetPos = (x: number, y: number) => resolve(new Vector2(x, y));
            this.p.stdin.write(`pos\n`);
        });
    }
    blockInput(block: boolean) {
        this.p.stdin.write(`block ${block ? 1 : 0}\n`);
    }
}

const instance = new ActionControllerWrapper();

export default instance;