import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';

export class Game extends CachedClass {

    constructor() { super() };

    get time(): number {
        return this.use('time', AyayaLeague.getGameTime);
    }

}