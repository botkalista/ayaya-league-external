
import { Missile } from '../src/models/Missile';
import { Game } from '../src/models/Game';
import AyayaLeague from '../src/LeagueReader';
import { factoryFromArray, worldToScreen } from '../src/utils/Utils';
import { TeamDistinct } from '../src/models/TeamDistinct';
import { CachedClass } from '../src/models/CachedClass';
import { Entity } from '../src/models/Entity';
import { Vector2, Vector3, Vector4 } from '../src/models/Vector';
import { UserScriptUtils } from './UserScriptUtils'

import * as SAT from 'sat';
import { OFFSET } from '../src/consts/Offsets';

export type PlayerState = "isCasting" | "isMoving" | "isAttacking" | "isEvading" | "isCharging" | "isChanneling" | "idle";

enum SpellSlot {
    Item1 = 0x2,
    Item2 = 0x3,
    Item3 = 0x4,
    Trinket = 0x5,
    Item5 = 0x6,
    Item6 = 0x7,
    Item7 = 0x9,
    Q = 0x10,
    W = 0x11,
    E = 0x12,
    R = 0x13,
    D = 0x20,
    F = 0x21
}


const Reader = AyayaLeague.reader;

export class UserScriptManager extends CachedClass {

    constructor() { super(); }

    public spellSlot = SpellSlot;

    get _offsets() {
        return OFFSET;
    }

    get _reader() {
        return Reader;
    }

    get typings() {
        return { Vector2, Vector3, Vector4 }
    }

    dispose() {
        this.clear();
    }

    get playerState(): PlayerState {
        return CachedClass.get<PlayerState>('playerState');
    }

    setPlayerState(state: PlayerState) {
        CachedClass.set<PlayerState>('playerState', state);
    }

    worldToScreen(pos: Vector3) {
        const screen = CachedClass.get<Vector2>('screen');
        const matrix = CachedClass.get<number[]>('matrix');
        return worldToScreen(pos, screen, matrix);
    }

    get underMouseObject() {
        return this.use('underMouse', () => {
            const address = Reader.readProcessMemory(OFFSET.oUnderMouse, "DWORD", true);
            const c = this.champions.all.find(e => e.address == address);
            if (c) return c;
            const m = this.minions.all.find(e => e.address == address);
            if (m) return m;
            const n = this.monsters.find(e => e.address == address);
            if (n) return n;
            const t = this.turrets.all.find(e => e.address == address);
            if (t) return t;
            return undefined;
        });
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
            this.set('monsters', monsters);
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
            this.set('minions', teamDistinctMinions);
            return monsters;
        });
    }

    checkCollision(target: Entity, missile: Missile): { result: boolean, evadeAt: Vector2 } {
        const response = new SAT.Response();
        const res = SAT.testCirclePolygon(target.satHitbox, missile.satHitbox, response);
        return {
            result: res,
            evadeAt: res ? new Vector2(target.screenPos.x - response.overlapV.x, target.screenPos.y - response.overlapV.y) : Vector2.zero
        }
    }

    get utils() {
        return this.use('utils', () => new UserScriptUtils(this));
    }


    debug() {
        console.log('debug');
    }

}