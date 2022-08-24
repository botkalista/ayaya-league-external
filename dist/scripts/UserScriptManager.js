"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserScriptManager = void 0;
const Missile_1 = require("../src/models/Missile");
const Game_1 = require("../src/models/Game");
const LeagueReader_1 = require("../src/LeagueReader");
const Utils_1 = require("../src/utils/Utils");
const TeamDistinct_1 = require("../src/models/TeamDistinct");
const CachedClass_1 = require("../src/models/CachedClass");
const Entity_1 = require("../src/models/Entity");
const Vector_1 = require("../src/models/Vector");
const UserScriptUtils_1 = require("./UserScriptUtils");
const SAT = require("sat");
const Offsets_1 = require("../src/consts/Offsets");
var SpellSlot;
(function (SpellSlot) {
    SpellSlot[SpellSlot["Item1"] = 2] = "Item1";
    SpellSlot[SpellSlot["Item2"] = 3] = "Item2";
    SpellSlot[SpellSlot["Item3"] = 4] = "Item3";
    SpellSlot[SpellSlot["Trinket"] = 5] = "Trinket";
    SpellSlot[SpellSlot["Item5"] = 6] = "Item5";
    SpellSlot[SpellSlot["Item6"] = 7] = "Item6";
    SpellSlot[SpellSlot["Item7"] = 9] = "Item7";
    SpellSlot[SpellSlot["Q"] = 16] = "Q";
    SpellSlot[SpellSlot["W"] = 17] = "W";
    SpellSlot[SpellSlot["E"] = 18] = "E";
    SpellSlot[SpellSlot["R"] = 19] = "R";
    SpellSlot[SpellSlot["D"] = 32] = "D";
    SpellSlot[SpellSlot["F"] = 33] = "F";
})(SpellSlot || (SpellSlot = {}));
const Reader = LeagueReader_1.default.reader;
class UserScriptManager extends CachedClass_1.CachedClass {
    constructor() {
        super();
        this.spellSlot = SpellSlot;
    }
    get _offsets() {
        return Offsets_1.OFFSET;
    }
    get _reader() {
        return Reader;
    }
    get typings() {
        return { Vector2: Vector_1.Vector2, Vector3: Vector_1.Vector3, Vector4: Vector_1.Vector4 };
    }
    dispose() {
        this.clear();
    }
    get playerState() {
        return CachedClass_1.CachedClass.get('playerState');
    }
    setPlayerState(state) {
        CachedClass_1.CachedClass.set('playerState', state);
    }
    worldToScreen(pos) {
        const screen = CachedClass_1.CachedClass.get('screen');
        const matrix = CachedClass_1.CachedClass.get('matrix');
        return (0, Utils_1.worldToScreen)(pos, screen, matrix);
    }
    get underMouseObject() {
        return this.use('underMouse', () => {
            const address = Reader.readProcessMemory(Offsets_1.OFFSET.oUnderMouse, "DWORD", true);
            const c = this.champions.all.find(e => e.address == address);
            if (c)
                return c;
            const m = this.minions.all.find(e => e.address == address);
            if (m)
                return m;
            const n = this.monsters.find(e => e.address == address);
            if (n)
                return n;
            const t = this.turrets.all.find(e => e.address == address);
            if (t)
                return t;
            return undefined;
        });
    }
    get game() {
        return this.use('game', () => new Game_1.Game());
    }
    get missiles() {
        return this.use('missiles', () => (0, Utils_1.factoryFromArray)(Missile_1.Missile, LeagueReader_1.default.getMissiles()));
    }
    get me() {
        return this.use('me', () => new Entity_1.Entity(LeagueReader_1.default.getLocalPlayer()));
    }
    get champions() {
        return this.use('champs', () => {
            const champions = (0, Utils_1.factoryFromArray)(Entity_1.Entity, LeagueReader_1.default.getChampions());
            const teamDistinctChampions = new TeamDistinct_1.TeamDistinct(champions);
            return teamDistinctChampions;
        });
    }
    get turrets() {
        return this.use('turrets', () => {
            const turrets = (0, Utils_1.factoryFromArray)(Entity_1.Entity, LeagueReader_1.default.getTurrets());
            const teamDistinctTurrets = new TeamDistinct_1.TeamDistinct(turrets);
            return teamDistinctTurrets;
        });
    }
    get minions() {
        return this.use('minions', () => {
            const minionsMonsters = LeagueReader_1.default.getMinionsMonsters();
            const entitiesWithShits = (0, Utils_1.factoryFromArray)(Entity_1.Entity, minionsMonsters);
            const entities = entitiesWithShits.filter(e => !e.name.startsWith('PreSeason'));
            const wards = entities.filter(e => e.name == 'BlueTrinket' ||
                e.name == 'JammerDevice' ||
                e.name == 'YellowTrinket');
            const minions = entities.filter(e => !wards.includes(e) && e.name.includes('Minion'));
            const monsters = entities.filter(e => !wards.includes(e) && !minions.includes(e));
            const teamDistinctMinions = new TeamDistinct_1.TeamDistinct(minions);
            const teamDistinctWards = new TeamDistinct_1.TeamDistinct(wards);
            this.set('monsters', monsters);
            this.set('wards', teamDistinctWards);
            return teamDistinctMinions;
        });
    }
    get monsters() {
        return this.use('monsters', () => {
            const minionsMonsters = LeagueReader_1.default.getMinionsMonsters();
            const entitiesWithShits = (0, Utils_1.factoryFromArray)(Entity_1.Entity, minionsMonsters);
            const entities = entitiesWithShits.filter(e => !e.name.startsWith('PreSeason'));
            const wards = entities.filter(e => e.name == 'BlueTrinket' ||
                e.name == 'JammerDevice' ||
                e.name == 'YellowTrinket');
            const minions = entities.filter(e => !wards.includes(e) && e.name.includes('Minion'));
            const monsters = entities.filter(e => !wards.includes(e) && !minions.includes(e));
            const teamDistinctMinions = new TeamDistinct_1.TeamDistinct(minions);
            const teamDistinctWards = new TeamDistinct_1.TeamDistinct(wards);
            this.set('minions', teamDistinctMinions);
            this.set('wards', teamDistinctWards);
            return monsters;
        });
    }
    get wards() {
        return this.use('wards', () => {
            const minionsMonsters = LeagueReader_1.default.getMinionsMonsters();
            const entitiesWithShits = (0, Utils_1.factoryFromArray)(Entity_1.Entity, minionsMonsters);
            const entities = entitiesWithShits.filter(e => !e.name.startsWith('PreSeason'));
            const wards = entities.filter(e => e.name == 'BlueTrinket' ||
                e.name == 'JammerDevice' ||
                e.name == 'YellowTrinket');
            const minions = entities.filter(e => !wards.includes(e) && e.name.includes('Minion'));
            const monsters = entities.filter(e => !wards.includes(e) && !minions.includes(e));
            const teamDistinctMinions = new TeamDistinct_1.TeamDistinct(minions);
            const teamDistinctWards = new TeamDistinct_1.TeamDistinct(wards);
            this.set('minions', teamDistinctMinions);
            this.set('monsters', monsters);
            return teamDistinctWards;
        });
    }
    checkCollision(target, missile) {
        const response = new SAT.Response();
        const res = SAT.testCirclePolygon(target.satHitbox, missile.satHitbox, response);
        return {
            result: res,
            evadeAt: res ? new Vector_1.Vector2(target.screenPos.x - response.overlapV.x, target.screenPos.y - response.overlapV.y) : Vector_1.Vector2.zero
        };
    }
    get utils() {
        return this.use('utils', () => new UserScriptUtils_1.UserScriptUtils(this));
    }
    debug() {
        console.log('debug');
    }
}
exports.UserScriptManager = UserScriptManager;
