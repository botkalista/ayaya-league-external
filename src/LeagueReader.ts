
import Reader from './MemoryReader';
import { OFFSET } from './consts/Offsets'
import { Entity } from './models/Entity';
import { Spell } from './models/Spell';
import { Vector2, Vector3, Vector4 } from './models/Vector';
import { EntityReadOptions, readEntity, readMatrix, readVTable } from './StructureReader';
import { matrixToArray } from './utils/Utils';
import { Performance } from './utils/Performance';

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

    getLocalPlayer(_opts?: EntityReadOptions): Entity {
        const localPlayer: number = Reader.readProcessMemory(OFFSET.oLocalPlayer, "DWORD", true);
        return readEntity(localPlayer, _opts);
    }
    getChampionsList(_opts?: EntityReadOptions, performance?: Performance) {
        const heroManager = Reader.readProcessMemory(OFFSET.oHeroManager, "DWORD", true);
        const champsAddresses = readVTable(heroManager);
        const champs = champsAddresses.map(e => {
            const data = readEntity(e, _opts, performance);
            // performance.spot('entity ' + data.name.substring(0, 10));
            return data;
        });
        return champs;
    }
    getMinionsMonstersList(_opts?: EntityReadOptions) {
        const opts: EntityReadOptions = _opts || { skipProps: ["spells"] }
        const minionManager = Reader.readProcessMemory(OFFSET.oMinionManager, "DWORD", true);
        const minionsAddresses = readVTable(minionManager);
        const minionsMonsters = minionsAddresses.map(e => readEntity(e, opts)).filter(e => !e.name.startsWith('PreSeason'));
        const minions = minionsMonsters.filter(e => e.name.includes('Minion'));
        const monsters = minionsMonsters.filter(e => !minions.includes(e));
        return { minions, monsters };
    }
    getTurretsList(_opts?: EntityReadOptions) {
        const opts: EntityReadOptions = _opts || { skipProps: ["spells"] }
        const turretManager = Reader.readProcessMemory(OFFSET.oTurretManager, "DWORD", true);
        const turretsAddresses = readVTable(turretManager);
        const turrets = turretsAddresses.map(e => readEntity(e, opts));
        return turrets;
    }
    getMissilesList(_opts?: EntityReadOptions) {
        const opts: EntityReadOptions = _opts || { skipProps: ["spells"] }
        const missileManager = Reader.readProcessMemory(OFFSET.oMissileManager, "DWORD", true);
        const missilesAddresses = readVTable(missileManager);
        const missiles = missilesAddresses.map(e => readEntity(e, opts));
        return missiles;
    }


    worldToScreen(pos: Vector3, screenSize: Vector2, viewProjMatrixArg?: number[]) {

        let viewProjMatrix: number[] = [];

        if (viewProjMatrixArg) {
            viewProjMatrix = viewProjMatrixArg;
        } else {
            const _viewProjMatrix = this.getViewProjectionMatrix();
            viewProjMatrix = matrixToArray(_viewProjMatrix);
        }

        const out = Vector2.zero();
        const screen = new Vector2(screenSize.x, screenSize.y);
        const clipCoords = Vector4.zero();
        clipCoords.x = pos.x * viewProjMatrix[0] + pos.y * viewProjMatrix[4] + pos.z * viewProjMatrix[8] + viewProjMatrix[12];
        clipCoords.y = pos.x * viewProjMatrix[1] + pos.y * viewProjMatrix[5] + pos.z * viewProjMatrix[9] + viewProjMatrix[13];
        clipCoords.z = pos.x * viewProjMatrix[2] + pos.y * viewProjMatrix[6] + pos.z * viewProjMatrix[10] + viewProjMatrix[14];
        clipCoords.w = pos.x * viewProjMatrix[3] + pos.y * viewProjMatrix[7] + pos.z * viewProjMatrix[11] + viewProjMatrix[15];
        if (clipCoords.w < 1.0) clipCoords.w = 1;
        const m = Vector3.zero();
        m.x = clipCoords.x / clipCoords.w;
        m.y = clipCoords.y / clipCoords.w;
        m.z = clipCoords.z / clipCoords.w;
        out.x = (screen.x / 2 * m.x) + (m.x + screen.x / 2);
        out.y = -(screen.y / 2 * m.y) + (m.y + screen.y / 2);
        return out;

    }
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
        const data = readEntity(object);
        return data;
    }
    printChat() {

        const chatInstance = Reader.readProcessMemory(OFFSET.oChatInstance, "PTR", true);
        const args = [
            { type: Reader.memInstance.T_VOID, value: chatInstance },
            { type: Reader.memInstance.T_CHAR, value: "test" },
            { type: Reader.memInstance.T_INT, value: 1 },
        ]

        const res = Reader.callFunction(args, 0x4, Reader.baseAddr + OFFSET.fPrintChat);

        console.log(res);

        //     extern std::uint32_t PrintChat (offset function)
        // [[nodiscard]] __forceinline auto getChat() noexcept { return *reinterpret_cast<Chat**>(GetModuleHandle(nullptr) + offsets::global::ChatInstance); }

        // void printChat(const char* message) noexcept
        // 	{
        // 		static const auto PrintChat{ reinterpret_cast<void(__thiscall*)(void*, const char*, int)>(std::uintptr_t(::GetModuleHandle(nullptr)) + offsets::functions::PrintChat) };
        // 		PrintChat(this, message, 0xFFFFFF);
        // 	}


        // bool Print(const char* cMessage, int iColor, HANDLE pHandle) {
        //     DWORD* ChatClient = (DWORD*)getBase(pHandle) + 0x24A83B0;
        //     DWORD* PrintChat = (DWORD*)getBase(pHandle) + 0x5BF020;
        //     reinterpret_cast<void(__thiscall*) (DWORD*, const char*, int)>
        //             (PrintChat)
        //             ((DWORD*)ChatClient, cMessage, iColor);
        //         return true;

        // }


        // static void PrintChat(const char* Message) {
        //     typedef void(__thiscall* tPrintChat)(DWORD ChatClient, const char* Message, int Color);
        //     tPrintChat fnPrintChat = (tPrintChat)(baseAddr + oPrintChat);
        //     fnPrintChat(*(DWORD*)(baseAddr + oChatClientPtr), Message, 1);
        // }

    }
    getPing() {
        // void Game::GetPing(MemS& ms) {
        //     uint32_t cpuPingAdr;
        //     uint32_t networkPing;
        //     double netPing;
        //     double cpuPing;
        //     DWORD netClientPtr;
        //     DWORD Address1;
        //     DWORD Address2;
        //     DWORD Address3;
        //     DWORD cpuInstance;

        //     Mem::Read(hProcess, moduleBaseAddr + 0x3116F58, &netClientPtr, sizeof(DWORD));
        //     Mem::Read(hProcess, netClientPtr + 0x44, &Address1, sizeof(DWORD));
        //     Mem::Read(hProcess, Address1 + 0x4, &Address2, sizeof(DWORD));
        //     Mem::Read(hProcess, Address2 + 0x4, &Address3, sizeof(DWORD));

        //     networkPing = Address3 + 0x18 + 0xD8;

        //     Mem::Read(hProcess, moduleBaseAddr + 0x30E9228, &cpuInstance, sizeof(DWORD));

        //     cpuPingAdr = cpuInstance + 0x18;

        //     Mem::Read(hProcess, networkPing, &netPing, sizeof(double));
        //     Mem::Read(hProcess, cpuPingAdr, &cpuPing, sizeof(double));

        //     ms.ping = static_cast<int>((netPing + cpuPing) * 1000.0);

        // }
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