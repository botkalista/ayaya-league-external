
import { Spell } from '../models/Spell';
import { Entity } from '../models/Entity';
import type AyayaLeague from '../LeagueReader';
import { Vector2 } from '../models/Vector';

export class Preparator {

    constructor(public ayayaLeague: typeof AyayaLeague) { }

    prepareSpell(data: Spell, gameTime: number) {
        const result = { cd: data.getSeconds(gameTime) }
        return result;
    }

    prepareChampion(data: Entity, screen: Vector2, matrix: number[], gameTime: number) {
        const screenPos = this.ayayaLeague.worldToScreen(data.pos, screen, matrix);

        const result = {
            x: screenPos.x, y: screenPos.y,
            hp: parseInt(data.hp.toFixed(0)),
            name: data.name,
            maxHp: parseInt(data.maxHp.toFixed(0)),
            range: parseInt(data.range.toFixed(0)),
            vis: data.visible,
            spells: data.spells.map(e => this.prepareSpell(e, gameTime))
        }

        return result;
    }

}
