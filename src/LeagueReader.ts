
import Reader from './MemoryReader';
import { OFFSET } from './consts/Offsets'
import { Vector2 } from './models/Vector';
import { EntityReadOptions, readMap, readMatrix, readVTable } from './StructureReader';
import * as math from 'mathjs'

class AyayaLeagueReader {

    private objectManager;
    private rootNode;
    reader: typeof Reader;

    constructor() {
        this.reader = Reader;
    }

    getGameTime(): number {
        return Reader.readProcessMemory(OFFSET.oGameTime, 'FLOAT', true);
    }
    getLocalPlayer(): number {
        return Reader.readProcessMemory(OFFSET.oLocalPlayer, "DWORD", true);
    }
    getChampions() {
        const heroManager = Reader.readProcessMemory(OFFSET.oHeroManager, "DWORD", true);
        const addresses = readVTable(heroManager);
        return addresses;
    }
    getMinionsMonsters() {
        const minionManager = Reader.readProcessMemory(OFFSET.oMinionManager, "DWORD", true);
        const addresses = readVTable(minionManager);
        return addresses;
    }
    getTurrets(_opts?: EntityReadOptions) {
        const turretManager = Reader.readProcessMemory(OFFSET.oTurretManager, "DWORD", true);
        const addresses = readVTable(turretManager);
        return addresses;
    }
    getSpellsOf(targetAddress: number): number[] {
        const result: number[] = [];
        for (let i = 0; i < 6; i++) {
            result.push(targetAddress + (i * 4));
        }
        return result;
    }
    getMissiles(): number[] {
        const missileManager = Reader.readProcessMemory(OFFSET.oMissileManager, "DWORD", true);
        const rootNode = Reader.readProcessMemory(missileManager + 0x4, "DWORD");
        const missilesSize = Reader.readProcessMemory(missileManager + 0x8, "DWORD");
        const addresses = readMap(rootNode, missilesSize + 1);
        return addresses.splice(1);
    }
    
    // worldToScreen(pos: Vector3, screenSize: Vector2, viewProjMatrixArg?: number[]) {

    //     let viewProjMatrix: number[] = [];

    //     if (viewProjMatrixArg) {
    //         viewProjMatrix = viewProjMatrixArg;
    //     } else {
    //         const _viewProjMatrix = this.getViewProjectionMatrix();
    //         viewProjMatrix = matrixToArray(_viewProjMatrix);
    //     }

    //     const out = Vector2.zero();
    //     const screen = new Vector2(screenSize.x, screenSize.y);
    //     const clipCoords = Vector4.zero();
    //     clipCoords.x = pos.x * viewProjMatrix[0] + pos.y * viewProjMatrix[4] + pos.z * viewProjMatrix[8] + viewProjMatrix[12];
    //     clipCoords.y = pos.x * viewProjMatrix[1] + pos.y * viewProjMatrix[5] + pos.z * viewProjMatrix[9] + viewProjMatrix[13];
    //     clipCoords.z = pos.x * viewProjMatrix[2] + pos.y * viewProjMatrix[6] + pos.z * viewProjMatrix[10] + viewProjMatrix[14];
    //     clipCoords.w = pos.x * viewProjMatrix[3] + pos.y * viewProjMatrix[7] + pos.z * viewProjMatrix[11] + viewProjMatrix[15];
    //     if (clipCoords.w < 1.0) clipCoords.w = 1;
    //     const m = Vector3.zero();
    //     m.x = clipCoords.x / clipCoords.w;
    //     m.y = clipCoords.y / clipCoords.w;
    //     m.z = clipCoords.z / clipCoords.w;
    //     out.x = (screen.x / 2 * m.x) + (m.x + screen.x / 2);
    //     out.y = -(screen.y / 2 * m.y) + (m.y + screen.y / 2);
    //     return out;

    // }


    getScreenSize(renderer: number) {
        const width = Reader.readProcessMemory(renderer + OFFSET.oGameWindowWidth, "DWORD");
        const height = Reader.readProcessMemory(renderer + OFFSET.oGameWindowHeight, "DWORD");
        return new Vector2(width, height);
    }
    getRenderBase() {
        return Reader.readProcessMemory(OFFSET.oRenderer, "DWORD", true);
    }
    getViewProjectionMatrix() {
        const viewMatrix = readMatrix(OFFSET.oViewProjMatrix);
        const projMatrix = readMatrix(OFFSET.oViewProjMatrix + 0x40);
        const viewProjMatrix = math.multiply(viewMatrix, projMatrix);
        return viewProjMatrix;
    }
    private getAllObjects(timeoutTimestamp?: number) {

        const objectManager = this.objectManager || this.getObjectManager();
        const rootNode = this.rootNode || this.getObjectManagerRootNode(objectManager);

        const checked = new Set<number>();
        const toCheck = new Set<number>();
        toCheck.add(rootNode);

        while (toCheck.size > 0) {

            const now = Date.now();
            if (timeoutTimestamp && now > timeoutTimestamp) break;

            const target: number = Array.from(toCheck.values())[0];
            checked.add(target);
            toCheck.delete(target);
            const nextObject1 = Reader.readProcessMemory(target + 0x0, "DWORD");
            const nextObject2 = Reader.readProcessMemory(target + 0x4, "DWORD");
            const nextObject3 = Reader.readProcessMemory(target + 0x8, "DWORD");
            if (!checked.has(nextObject1)) toCheck.add(nextObject1);
            if (!checked.has(nextObject2)) toCheck.add(nextObject2);
            if (!checked.has(nextObject3)) toCheck.add(nextObject3);
        }

        return Array.from(checked.values());
    }
    private getObjectManager() {
        const aObjectManager = Reader.readProcessMemory(OFFSET.oObjectManager, "DWORD", true);
        return aObjectManager;
    }
    private getObjectManagerRootNode(aObjectManager: number) {
        const rootNode = Reader.readProcessMemory(aObjectManager + OFFSET.oMapRoot, "DWORD");
        return rootNode;
    }
    private readObjectAt(address: number) {
        const object = Reader.readProcessMemory(address + OFFSET.oMapNodeObject, 'DWORD');
        // const data = readEntity(object);
        // return data;
    }

    /**
     *  @deprecated Not Working
     */
    getHoveredEntity(entities) {
        const hovered = Reader.readProcessMemory(OFFSET.oUnderMouse, "DWORD", true);
        const netId = Reader.readProcessMemory(hovered + OFFSET.oMapNetId, "DWORD");
        console.log('netId', Reader.toHex(netId))
        const target = entities.find(e => e.netId == netId);
        return target;
    }

}

const instance = new AyayaLeagueReader();

export default instance;