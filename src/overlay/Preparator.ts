
import { Spell } from '../models/Spell';
import { Entity } from '../models/Entity';
import AyayaLeague from '../LeagueReader';
import { Vector2 } from '../models/Vector';
import { Missile } from '../models/Missile';
import { getCircle3D, worldToScreen } from '../utils/Utils';

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

    prepareChampion(data: Entity, screen: Vector2, matrix: number[], gameTime: number) {

        const range = parseInt(data.range.toFixed(0));

        const circlePoints = getCircle3D(data.gamePos, 50, range, screen, matrix).map(e => {
            const c0 = e[0].getFlat();
            const c1 = e[1].getFlat();
            return [c0, c1];
        });


        const result = {
            x: parseInt(data.gamePos.x.toFixed(0)),
            y: parseInt(data.gamePos.y.toFixed(0)),
            circle3d: circlePoints,
            hp: parseInt(data.hp.toFixed(0)),
            name: data.name,
            maxHp: parseInt(data.maxHp.toFixed(0)),
            range: range,
            vis: data.visible,
            spells: data.spells.map(e => this.prepareSpell(e))
        }

        return result;
    }

    prepareMissile(data: Missile) {
        const result = {
            sPos: data.screenStartPos,
            ePos: data.screenEndPos
        }
        return result;
    }

}
