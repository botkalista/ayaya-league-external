
import { Missile } from '../src/models/Missile';
import { Game } from '../src/models/Game';
import AyayaLeague from '../src/LeagueReader';
import { factoryFromArray } from '../src/utils/Utils';
import { TeamDistinct } from '../src/models/TeamDistinct';
import { CachedClass } from '../src/models/CachedClass';
import { Entity } from '../src/models/Entity';
import { Vector2 } from '../src/models/Vector';
import ActionControllerWrapper from '../src/ActionControllerWrapper';

import * as SAT from 'sat';

export class UserScriptManager extends CachedClass {

    constructor() { super(); }

    get mouse() {
        return ActionControllerWrapper;
    }

    get game() {
        return this.use('game', () => new Game());
    }

    get missiles(): Missile[] {
        return this.use('missiles', () => factoryFromArray(Missile, AyayaLeague.getMissiles()));
    }

    get me(): Entity {
        return this.use('me', () => new Entity(AyayaLeague.getLocalPlayer()));
    }

    get champions() {
        return this.use('champs', () => {
            const champions = factoryFromArray(Entity, AyayaLeague.getChampions());
            const teamDistinctChampions = new TeamDistinct(champions);
            return teamDistinctChampions;
        });
    }

    get turrets() {
        return this.use('turrets', () => {
            const turrets = factoryFromArray(Entity, AyayaLeague.getTurrets());
            const teamDistinctTurrets = new TeamDistinct(turrets);
            return teamDistinctTurrets;
        });
    }

    get minions() {
        return this.use('minions', () => {
            const minionsMonsters = AyayaLeague.getMinionsMonsters();
            const entitiesWithShits = factoryFromArray(Entity, minionsMonsters);
            const entities = entitiesWithShits.filter(e => !e.name.startsWith('PreSeason'));
            const minions = entities.filter(e => e.name.includes('Minion'));
            const monsters = entities.filter(e => !minions.includes(e));
            const teamDistinctMinions = new TeamDistinct(minions);
            const teamDistinctMonsters = new TeamDistinct(monsters);
            this.set('monsters', teamDistinctMonsters);
            return teamDistinctMinions;
        });
    }

    get monsters() {
        return this.use('monsters', () => {
            const minionsMonsters = AyayaLeague.getMinionsMonsters();
            const entitiesWithShits = factoryFromArray(Entity, minionsMonsters);
            const entities = entitiesWithShits.filter(e => !e.name.startsWith('PreSeason'));
            const minions = entities.filter(e => e.name.includes('Minion'));
            const monsters = entities.filter(e => !minions.includes(e));
            const teamDistinctMinions = new TeamDistinct(minions);
            const teamDistinctMonsters = new TeamDistinct(monsters);
            this.set('minions', teamDistinctMinions);
            return teamDistinctMonsters;
        });
    }

    checkCollision(target: Entity, missile: Missile): { result: boolean, evadeAt: Vector2 } {
        const response = new SAT.Response();
        const res = SAT.testCirclePolygon(target.satHitbox, missile.satHitbox, response);
        return {
            result: res,
            evadeAt: res ? new Vector2(response.overlapV.x, response.overlapV.y) : Vector2.zero()
        }
    }

    debug() {
        console.log('debug');
    }

}