import { CachedClass } from "../src/models/CachedClass";
import { Entity } from "../src/models/Entity";
import { Vector3 } from "../src/models/Vector";
import { UserScriptManager } from "./UserScriptManager";

import { Polygon, Vector, testCirclePolygon } from 'sat';


export class UserScriptUtils extends CachedClass {
    constructor(private manager: UserScriptManager) { super(); }

    hasEnemyOnPath(source: Entity, target: Entity) {
        const line = new Polygon(new Vector(source.screenPos.x, source.screenPos.y), [new Vector(target.screenPos.x, source.screenPos.y)]);
        const entities: Entity[] = []
        entities.push(...this.manager.champions.enemies);
        entities.push(...this.manager.minions.enemies);
        entities.push(...this.manager.monsters);
        return entities.filter(e => testCirclePolygon(e.satHitbox, line));
    }

    enemyChampsInRange(range: number) {
        return this.use('enemyChampInRange', () => this.genericInRange(this.manager.champions.enemies, range));
    }

    genericInRange(list: Entity[], range: number) {
        const me = this.manager.me;
        return list.filter(e => e.hp > 0 && e.visible && e.gamePos.dist(me.gamePos) < ((range + e.boundingBox + me.boundingBox)));
    }

    lowestHealthEnemyChampInRange(range: number) {
        return this.use('lowestHealthEnemyChampInRange', () => this.enemyChampsInRange(range).sort((a, b) => a.hp - b.hp)[0])
    }

    lowestHealthGenericInRange(list: Entity[], range: number) {
        return this.genericInRange(list, range).sort((a, b) => a.hp - b.hp)[0];
    }

    getHealthBarPosition(target: Entity) {
        const screen = this.manager.game.screenSize;
        const xFromCenter = (screen.x / 2) - target.screenPos.x;
        const yFromCenter = (screen.y / 2) - target.screenPos.y;
        const pos = target.screenPos.copy();
        pos.y -= target.baseDrawingOffset;
        pos.y -= 30;
        pos.y -= (yFromCenter * 0.02);
        pos.x -= 50;
        pos.x -= (xFromCenter * 0.035);
        return pos;
    }

    predictPosition(target: Entity, castTime: number) {
        if (target.AiManager.startPath.x == target.AiManager.endPath.x && target.AiManager.startPath.y == target.AiManager.endPath.y) {
            return target.gamePos;
        }
        const dQ = target.AiManager.endPath.sub(target.gamePos).normalize();
        const dQ_travel = target.movSpeed * castTime;
        const tmp = dQ.mul(new Vector3(dQ_travel, dQ_travel, dQ_travel));
        const qPredicted_pos = target.gamePos.add(tmp);
        return qPredicted_pos;
    }

}
