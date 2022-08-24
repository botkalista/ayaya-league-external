"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamDistinct = void 0;
const CachedClass_1 = require("./CachedClass");
class TeamDistinct extends CachedClass_1.CachedClass {
    constructor(entities) {
        super();
        this.entities = entities;
    }
    get all() {
        return this.entities;
    }
    get allies() {
        return this.all.filter(e => e.team == CachedClass_1.CachedClass.get('myTeam'));
    }
    get enemies() {
        return this.all.filter(e => e.team == CachedClass_1.CachedClass.get('nmeTeam'));
    }
}
exports.TeamDistinct = TeamDistinct;
