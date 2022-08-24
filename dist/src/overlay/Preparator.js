"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preparator = void 0;
class Preparator {
    constructor(ayayaLeague) {
        this.ayayaLeague = ayayaLeague;
    }
    prepareSpell(data) {
        const result = {
            cd: parseInt(data.readyIn.toFixed(0)),
            name: data.name,
            level: data.level
        };
        return result;
    }
    prepareChampion(data, performance) {
        const name = data.name;
        if (performance)
            performance.spot('prepareChamp - name');
        const pos = data.gamePos.flatten();
        if (performance)
            performance.spot('prepareChamp - pos');
        const x = parseInt(data.screenPos.x.toFixed(0));
        if (performance)
            performance.spot('prepareChamp - x');
        const y = parseInt(data.screenPos.y.toFixed(0));
        if (performance)
            performance.spot('prepareChamp - y');
        const hp = parseInt(data.hp.toFixed(0));
        if (performance)
            performance.spot('prepareChamp - hp');
        const maxHp = parseInt(data.maxHp.toFixed(0));
        if (performance)
            performance.spot('prepareChamp - maxhp');
        const range = parseInt(data.range.toFixed(0));
        if (performance)
            performance.spot('prepareChamp - range');
        const vis = data.visible;
        if (performance)
            performance.spot('prepareChamp - vis');
        const result = {
            pos, x, y, hp, name, maxHp,
            range, vis,
            spells: data.spells.map(e => this.prepareSpell(e))
        };
        return result;
    }
    prepareMissile(data) {
        const result = {
            sPos: data.gameStartPos,
            ePos: data.gameEndPos,
            spellName: data.spellName,
            debug: {
                points: data.satHitbox.calcPoints,
                off: data.satHitbox.pos
            }
        };
        return result;
    }
}
exports.Preparator = Preparator;
