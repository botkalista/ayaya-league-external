import { CachedClass } from "./CachedClass";
import { Entity } from "./Entity";



export class TeamDistinct extends CachedClass {

    constructor(public entities: Entity[]) { super() }

    get all(): Entity[] {
        return this.entities;
    }

    get allies(): Entity[] {
        return this.all.filter(e => e.team == CachedClass.get('myTeam'));
    }

    get enemies(): Entity[] {
        return this.all.filter(e => e.team == CachedClass.get('nmeTeam'));
    }

}
