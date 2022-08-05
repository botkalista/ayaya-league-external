
import { Spell } from '../models/Spell';
import { Entity } from '../models/Entity';
import AyayaLeague from '../LeagueReader';
import { Vector2 } from '../models/Vector';
import { Missile } from '../models/Missile';
import { getCircle3D, worldToScreen } from '../utils/Utils';
import { CachedClass } from '../models/CachedClass';

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

    prepareChampion(data: Entity) {
        const result = {
            pos: data.gamePos.getFlat(),
            circle3D: getCircle3D(data.gamePos, 50, 500, CachedClass.get('screen'), CachedClass.get('matrix')),
            x: parseInt(data.screenPos.x.toFixed(0)),
            y: parseInt(data.screenPos.y.toFixed(0)),
            hp: parseInt(data.hp.toFixed(0)),
            name: data.name,
            maxHp: parseInt(data.maxHp.toFixed(0)),
            range: parseInt(data.range.toFixed(0)),
            vis: data.visible,
            spells: data.spells.map(e => this.prepareSpell(e))
        }

        return result;
    }

    prepareMissile(data: Missile) {
        const result = {
            sPos: data.gameStartPos,
            ePos: data.gameEndPos
        }
        return result;
    }

}
