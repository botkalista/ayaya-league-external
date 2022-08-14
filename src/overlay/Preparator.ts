
import { Spell } from '../models/Spell';
import { Entity } from '../models/Entity';
import AyayaLeague from '../LeagueReader';
import { Vector2 } from '../models/Vector';
import { Missile } from '../models/Missile';
import { getCircle3D, worldToScreen } from '../utils/Utils';
import { CachedClass } from '../models/CachedClass';
import { Performance } from '../utils/Performance';

export class Preparator {

    constructor(public ayayaLeague: typeof AyayaLeague) { }

    prepareSpell(data: Spell) {
        const result = {
            cd: parseInt(data.readyIn.toFixed(0)),
            name: data.name,
            level: data.level
        }
        return result;
    }

    prepareChampion(data: Entity, performance?: Performance) {

        const name = data.name;
        if (performance) performance.spot('prepareChamp - name');
        const pos = data.gamePos.flatten();
        if (performance) performance.spot('prepareChamp - pos');
        const x = parseInt(data.screenPos.x.toFixed(0));
        if (performance) performance.spot('prepareChamp - x');
        const y = parseInt(data.screenPos.y.toFixed(0));
        if (performance) performance.spot('prepareChamp - y');
        const hp = parseInt(data.hp.toFixed(0));
        if (performance) performance.spot('prepareChamp - hp');
        const maxHp = parseInt(data.maxHp.toFixed(0));
        if (performance) performance.spot('prepareChamp - maxhp');
        const range = parseInt(data.range.toFixed(0));
        if (performance) performance.spot('prepareChamp - range');
        const vis = data.visible;
        if (performance) performance.spot('prepareChamp - vis');
        const result = {
            pos, x, y, hp, name, maxHp,
            range, vis,
            spells: data.spells.map(e => this.prepareSpell(e))
        }

        return result;
    }

    prepareMissile(data: Missile) {
        const result = {
            sPos: data.gameStartPos,
            ePos: data.gameEndPos,
            spellName: data.spellName,
            debug: {
                points: data.satHitbox.calcPoints,
                off: data.satHitbox.pos
            }
        }
        return result;
    }

}
