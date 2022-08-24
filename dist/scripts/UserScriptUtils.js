"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserScriptUtils = void 0;
const CachedClass_1 = require("../src/models/CachedClass");
const Vector_1 = require("../src/models/Vector");
const sat_1 = require("sat");
class UserScriptUtils extends CachedClass_1.CachedClass {
    constructor(manager) {
        super();
        this.manager = manager;
    }
    hasEnemyOnPath(source, target) {
        const line = new sat_1.Polygon(new sat_1.Vector(source.screenPos.x, source.screenPos.y), [new sat_1.Vector(target.screenPos.x, source.screenPos.y)]);
        const entities = [];
        entities.push(...this.manager.champions.enemies);
        entities.push(...this.manager.minions.enemies);
        entities.push(...this.manager.monsters);
        return entities.filter(e => (0, sat_1.testCirclePolygon)(e.satHitbox, line));
    }
    calculateDamage(source, target, physicDmg = 0, magicDmg = 0, trueDmg = 0) {
        const resultPhysic = this.calculatePhysicalDamage(source, target, physicDmg);
        const resultMagic = this.calculateMagicDamage(source, target, magicDmg);
        const resultTrue = trueDmg;
        return resultPhysic + resultMagic + resultTrue;
    }
    calculatePhysicalDamage(source, target, damage) {
        const A = target.armor;
        const B = source.lethality;
        const C = source.armorPenPercent;
        const flatArmorPen = B * (0.6 + (0.4 * source.level / 18));
        let def = A - flatArmorPen;
        def = def / 100 * (100 - C);
        if (def < 0)
            return damage * (2 - (100 / (100 - def)));
        return damage * (100 / (100 + def));
    }
    calculateMagicDamage(source, target, damage) {
        const A = target.magicResistTotal;
        const B = source.magicPenFlat;
        const C = source.magicPenPercent;
        let def = A - B;
        def = def / 100 * (100 - C);
        if (def < 0)
            return damage * (2 - (100 / (100 - def)));
        return damage * (100 / (100 + def));
    }
    enemyChampsInRange(range) {
        return this.use('enemyChampInRange', () => this.genericInRange(this.manager.champions.enemies, range));
    }
    genericInRange(list, range) {
        const me = this.manager.me;
        return list.filter(e => !e.dead && e.visible && e.gamePos.dist(me.gamePos) < ((range + e.boundingBox + me.boundingBox)));
    }
    lowestHealthEnemyChampInRange(range) {
        return this.use('lowestHealthEnemyChampInRange', () => this.enemyChampsInRange(range).sort((a, b) => a.hp - b.hp)[0]);
    }
    lowestHealthGenericInRange(list, range) {
        return this.genericInRange(list, range).sort((a, b) => a.hp - b.hp)[0];
    }
    getHealthBarPosition(target) {
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
    predictPosition(target, castTime) {
        if (target.AiManager.startPath.x == target.AiManager.endPath.x && target.AiManager.startPath.y == target.AiManager.endPath.y) {
            return target.gamePos;
        }
        const dQ = target.AiManager.endPath.sub(target.gamePos).normalize();
        const dQ_travel = target.movSpeed * castTime;
        const tmp = dQ.mul(new Vector_1.Vector3(dQ_travel, dQ_travel, dQ_travel));
        const qPredicted_pos = target.gamePos.add(tmp);
        return qPredicted_pos;
    }
}
exports.UserScriptUtils = UserScriptUtils;
