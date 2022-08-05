
import { Spell } from '../models/Spell';
import { Entity } from '../models/Entity';
import AyayaLeague from '../LeagueReader';
import { Vector2 } from '../models/Vector';
import { Missile } from '../models/Missile';

export class Preparator {

    constructor(public ayayaLeague: typeof AyayaLeague) { }

    prepareSpell(data: Spell, gameTime: number) {
        const result = {
            cd: parseInt(data.getSeconds(gameTime).toFixed(0)),
            name: data.name,
            level: data.level
        }
        return result;
    }

    prepareChampion(data: Entity, screen: Vector2, matrix: number[], gameTime: number) {
        const screenPos = this.ayayaLeague.worldToScreen(data.pos, screen, matrix);

        const range = parseInt(data.range.toFixed(0));

        const circlePoints = this.ayayaLeague.getCircle3D(data.pos, 50, range, screen, matrix).map(e => {
            const c0 = e[0].getFlat();
            const c1 = e[1].getFlat();
            return [c0, c1];
        });


        const result = {
            x: parseInt(screenPos.x.toFixed(0)),
            y: parseInt(screenPos.y.toFixed(0)),
            circle3d: circlePoints,
            hp: parseInt(data.hp.toFixed(0)),
            name: data.name,
            maxHp: parseInt(data.maxHp.toFixed(0)),
            range: range,
            vis: data.visible,
            spells: data.spells.map(e => this.prepareSpell(e, gameTime))
        }

        return result;
    }

    prepareMissile(missile: Missile, screen: Vector2, matrix: number[]) {
        const sPos = this.ayayaLeague.worldToScreen(missile.startPos, screen, matrix);
        const ePos = this.ayayaLeague.worldToScreen(missile.endPos, screen, matrix);
        const result = { sPos, ePos }
        return result;
    }

}
