import winapi from '../components/winapi/Winapi';
import Manager from '../models/main/Manager';
import League from '../components/League';

export class LeagueWatcher {

    isRunning: boolean = false;
    loopChecking: NodeJS.Timer | undefined;

    startLoopCheck() {
        if (this.loopChecking) return;

        this.loopChecking = setInterval(() => {
            const running = this.check();
            if (this.isRunning && !League.isOpen()) League.openLeagueProcess();
            if (Manager.game.time <= 1) return;
            if (this.isRunning != running) this.onChange(running);
            this.isRunning = running;
        }, 5000);
    }

    stopLoopCheck() {
        if (!this.loopChecking) return;
        clearInterval(this.loopChecking);
        this.loopChecking = undefined;
    }

    check(): boolean {
        try {
            winapi.reader.openProcess('League of Legends.exe');
            return true;
        } catch (ex) {
            return false;
        }
    }

    onChange(running) { }

}

const instance = new LeagueWatcher();
export default instance;