"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryReader_1 = require("./MemoryReader");
const Offsets_1 = require("./consts/Offsets");
const Vector_1 = require("./models/Vector");
const StructureReader_1 = require("./StructureReader");
const math = require("mathjs");
class AyayaLeagueReader {
    constructor() {
        this.reader = MemoryReader_1.default;
    }
    getGameTime() {
        return MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oGameTime, 'FLOAT', true);
    }
    getLocalPlayer() {
        return MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oLocalPlayer, "DWORD", true);
    }
    getChampions() {
        const heroManager = MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oHeroManager, "DWORD", true);
        const addresses = (0, StructureReader_1.readVTable)(heroManager);
        return addresses;
    }
    getMinionsMonsters() {
        const minionManager = MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oMinionManager, "DWORD", true);
        const addresses = (0, StructureReader_1.readVTable)(minionManager);
        return addresses;
    }
    getTurrets(_opts) {
        const turretManager = MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oTurretManager, "DWORD", true);
        const addresses = (0, StructureReader_1.readVTable)(turretManager);
        return addresses;
    }
    getSpellsOf(targetAddress) {
        const result = [];
        for (let i = 0; i < 6; i++) {
            result.push(targetAddress + (i * 4));
        }
        return result;
    }
    getMissiles() {
        const missileManager = MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oMissileManager, "DWORD", true);
        const rootNode = MemoryReader_1.default.readProcessMemory(missileManager + 0x4, "DWORD");
        const missilesSize = MemoryReader_1.default.readProcessMemory(missileManager + 0x8, "DWORD");
        const addresses = (0, StructureReader_1.readMap)(rootNode, missilesSize + 1);
        return addresses.splice(1);
    }
    getScreenSize(renderer) {
        const width = MemoryReader_1.default.readProcessMemory(renderer + Offsets_1.OFFSET.oGameWindowWidth, "DWORD");
        const height = MemoryReader_1.default.readProcessMemory(renderer + Offsets_1.OFFSET.oGameWindowHeight, "DWORD");
        return new Vector_1.Vector2(width, height);
    }
    getRenderBase() {
        return MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oRenderer, "DWORD", true);
    }
    getViewProjectionMatrix() {
        const viewMatrix = (0, StructureReader_1.readMatrix)(Offsets_1.OFFSET.oViewProjMatrix);
        const projMatrix = (0, StructureReader_1.readMatrix)(Offsets_1.OFFSET.oViewProjMatrix + 0x40);
        const viewProjMatrix = math.multiply(viewMatrix, projMatrix);
        return viewProjMatrix;
    }
    getAllObjects(timeoutTimestamp) {
        const objectManager = this.objectManager || this.getObjectManager();
        const rootNode = this.rootNode || this.getObjectManagerRootNode(objectManager);
        const checked = new Set();
        const toCheck = new Set();
        toCheck.add(rootNode);
        while (toCheck.size > 0) {
            const now = Date.now();
            if (timeoutTimestamp && now > timeoutTimestamp)
                break;
            const target = Array.from(toCheck.values())[0];
            checked.add(target);
            toCheck.delete(target);
            const nextObject1 = MemoryReader_1.default.readProcessMemory(target + 0x0, "DWORD");
            const nextObject2 = MemoryReader_1.default.readProcessMemory(target + 0x4, "DWORD");
            const nextObject3 = MemoryReader_1.default.readProcessMemory(target + 0x8, "DWORD");
            if (!checked.has(nextObject1))
                toCheck.add(nextObject1);
            if (!checked.has(nextObject2))
                toCheck.add(nextObject2);
            if (!checked.has(nextObject3))
                toCheck.add(nextObject3);
        }
        return Array.from(checked.values());
    }
    getObjectManager() {
        const aObjectManager = MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oObjectManager, "DWORD", true);
        return aObjectManager;
    }
    getObjectManagerRootNode(aObjectManager) {
        const rootNode = MemoryReader_1.default.readProcessMemory(aObjectManager + Offsets_1.OFFSET.oMapRoot, "DWORD");
        return rootNode;
    }
    readObjectAt(address) {
        const object = MemoryReader_1.default.readProcessMemory(address + Offsets_1.OFFSET.oMapNodeObject, 'DWORD');
        // const data = readEntity(object);
        // return data;
    }
    /**
     *  @deprecated Not Working
     */
    getHoveredEntity(entities) {
        const hovered = MemoryReader_1.default.readProcessMemory(Offsets_1.OFFSET.oUnderMouse, "DWORD", true);
        const netId = MemoryReader_1.default.readProcessMemory(hovered + Offsets_1.OFFSET.oMapNetId, "DWORD");
        console.log('netId', MemoryReader_1.default.toHex(netId));
        const target = entities.find(e => e.netId == netId);
        return target;
    }
}
const instance = new AyayaLeagueReader();
exports.default = instance;
