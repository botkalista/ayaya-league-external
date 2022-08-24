"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiManager = void 0;
const CachedClass_1 = require("./CachedClass");
const LeagueReader_1 = require("../LeagueReader");
const Offsets_1 = require("../consts/Offsets");
const Vector_1 = require("./Vector");
const Reader = LeagueReader_1.default.reader;
class AiManager extends CachedClass_1.CachedClass {
    constructor(address) {
        super();
        this.address = address;
    }
    get startPath() {
        return this.use('startPath', () => Vector_1.Vector3.fromData(Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oAiManagerStartPath, "VEC3")));
    }
    get endPath() {
        return this.use('endPath', () => Vector_1.Vector3.fromData(Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oAiManagerEndPath, "VEC3")));
    }
    get isDashing() {
        return this.use('isDashing', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oAiManagerIsDashing, "BOOL"));
    }
    get isMoving() {
        return this.use('isMoving', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oAiManagerIsMoving, "BOOL"));
    }
    get dashSpeed() {
        return this.use('dashSpeed', () => Reader.readProcessMemory(this.address + Offsets_1.OFFSET.oAiManagerDashSpeed, "DWORD"));
    }
}
exports.AiManager = AiManager;
