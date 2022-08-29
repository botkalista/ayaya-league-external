import { CachedClass } from "../components/CachedClass";
import { Entity } from "./primary/Entity";

import Manager from './main/Manager';

export class TeamDistinct extends CachedClass {

    constructor(public entities: Entity[]) { super() }

    get all(): Entity[] {
        return this.entities;
    }

    get allies(): Entity[] {
        return this.all.filter(e => e.team == Manager.__internal.myTeam);
    }

    get enemies(): Entity[] {
        return this.all.filter(e => e.team == Manager.__internal.nmeTeam);
    }

}
