
import Reader from './MemoryReader';
import { OFFSET } from './consts/Offsets'
import { Entity } from './models/Entity';
import { Spell } from './models/Spell';
import { getNameFromBuffer } from './utils/Utils';
import { Vector2, Vector3, Vector4 } from './models/Vector';

import * as math from 'mathjs'

class AyayaLeagueReader {

    private objectManager;
    private rootNode;
    reader: typeof Reader;

    constructor(hook = true) {
        console.log({ hook });
        if (hook) Reader.hookLeagueProcess();
        this.reader = Reader;
        if (hook) console.log('BaseAddress', this.toHex(Reader.baseAddr));
        if (hook) console.log('Handle', this.toHex(Reader.pHandle));
    }

    toHex(int: number) {
        return Reader.toHex(int);
    }

    getLocalPlayer(): Entity {
        const localPlayer = Reader.readProcessMemory(OFFSET.oLocalPlayer, "DWORD", true);
        const data = this.getObjectData(localPlayer);
        return Entity.fromData(data);
    }

    getEntities(timeoutTimestamp?: number): Entity[] {

        const objects = this.getAllObjects(timeoutTimestamp);

        const objectsData = objects.map(o => this.readObjectAt(o)).filter(e => e != undefined);

        return objectsData as Entity[];
    }


    getAttackableEntities(entities: Entity[]): Entity[] {


        return entities;
    }


    groupEntities(_entities: Entity[], playerTeamId: number) {

        const enemyTeamId = playerTeamId == 100 ? 200 : 100;

        const entities = _entities.filter(e => !e.name.startsWith('PreSeason'))

        const allies = entities.filter(e => e.team == playerTeamId);
        const enemies = entities.filter(e => e.team == enemyTeamId);
        const neutrals = entities.filter(e => e.team != 100 && e.team != 200);

        const turrets = entities.filter(e => e.name.startsWith('Turret'));
        const minions = entities.filter(e => e.name.startsWith('SRU'));
        const champions = entities.filter(e => !turrets.includes(e) && !minions.includes(e));

        const allyTurrets = allies.filter(e => turrets.includes(e));
        const enemyTurrets = enemies.filter(e => turrets.includes(e));

        const allyMinions = allies.filter(e => minions.includes(e));
        const enemyMinions = enemies.filter(e => minions.includes(e));

        const allyChampions = allies.filter(e => champions.includes(e));
        const enemyChampions = enemies.filter(e => champions.includes(e));




        return {
            allies, enemies, neutrals,
            turrets, allyTurrets, enemiesTurrets: enemyTurrets,
            minions, allyMinions, enemiesMinions: enemyMinions,
            champions, allyChampions, enemyChampions
        }

    }

    getGameTime() {
        const time = Reader.readProcessMemory(OFFSET.oGameTime, 'DWORD', true);
        return time;
    }



    printChat() {

        const chatInstance = Reader.readProcessMemory(OFFSET.oChatInstance, "PTR", true);
        const args = [
            { type: Reader.memInstance.T_VOID, value: chatInstance },
            { type: Reader.memInstance.T_CHAR, value: "test" },
            { type: Reader.memInstance.T_INT, value: 0 },
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




    worldToScreen(pos: Vector3, screenSize: Vector2, viewProjMatrixArg?: number[]) {

        let viewProjMatrix: number[] = [];

        if (viewProjMatrixArg) {
            viewProjMatrix = viewProjMatrixArg;
        } else {
            const _viewProjMatrix = this.getViewProjectionMatrix();
            viewProjMatrix = this.matrixToArray(_viewProjMatrix);
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
        const viewMatrix = this.readMatrixAt(OFFSET.oViewProjMatrix);
        const projMatrix = this.readMatrixAt(OFFSET.oViewProjMatrix + 0x40);
        const viewProjMatrix = math.multiply(viewMatrix, projMatrix);
        return viewProjMatrix;
    }
    matrixToArray(matrix: math.Matrix): number[] {
        const result: number[] = [];
        for (let i = 0; i < matrix['_data'].length; i++) {
            for (let k = 0; k < matrix['_data'][i].length; k++) {
                const val: number = matrix['_data'][i][k];
                result.push(val);
            }
        }
        return result;
    }
    private readMatrixAt(address: number) {
        const buffer = Reader.readProcessMemoryBuffer(address, 64, true);

        const matrix = math.matrix([
            [
                buffer.readFloatLE(0 * 4),
                buffer.readFloatLE(1 * 4),
                buffer.readFloatLE(2 * 4),
                buffer.readFloatLE(3 * 4)
            ],
            [
                buffer.readFloatLE(4 * 4),
                buffer.readFloatLE(5 * 4),
                buffer.readFloatLE(6 * 4),
                buffer.readFloatLE(7 * 4)
            ],
            [
                buffer.readFloatLE(8 * 4),
                buffer.readFloatLE(9 * 4),
                buffer.readFloatLE(10 * 4),
                buffer.readFloatLE(11 * 4)
            ],
            [
                buffer.readFloatLE(12 * 4),
                buffer.readFloatLE(13 * 4),
                buffer.readFloatLE(14 * 4),
                buffer.readFloatLE(15 * 4)
            ]
        ]);
        return matrix;
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
        const data = this.getObjectData(object);
        return data;
    }
    getObjectData(address: number, bypassNameChecks = false) {

        const namePointer = Reader.readProcessMemory(address + OFFSET.oObjName, 'DWORD');
        const nameBuffer = Reader.readProcessMemoryBuffer(namePointer, 0x25);
        const name = getNameFromBuffer(nameBuffer);

        if (!bypassNameChecks) {
            if (name.length < 3) return;
            if (name.startsWith(' ')) return;
        }

        const netId = Reader.readProcessMemory(address + OFFSET.oObjNetId, "DWORD");

        if (!bypassNameChecks) {
            if (netId - 0x40000000 > 0x100000) return;
            if (netId < 0) return;
        }

        const pos = Reader.readProcessMemory(address + OFFSET.oObjPosition, "VEC3");
        const hp = Reader.readProcessMemory(address + OFFSET.oObjectHealth, "FLOAT");
        const maxHp = Reader.readProcessMemory(address + OFFSET.oObjectMaxHealth, "FLOAT");
        const visible = Reader.readProcessMemory(address + OFFSET.oObjVisible, 'BOOL');
        const range = Reader.readProcessMemory(address + OFFSET.oObjAttackRange, 'FLOAT');
        const team = Reader.readProcessMemory(address + OFFSET.oObjTeam, "DWORD");

        // const index = Reader.readProcessMemory(address + OFFSET.oObjIndex, "DWORD");
        // const dead = Reader.readProcessMemory(address + OFFSET.oObjectDead, "DWORD");

        const spells: Spell[] = [];

        if (team == 100 || team == 200) {
            for (let i = 0; i < 6; i++) {

                const spellAddress = Reader.readProcessMemory(address + OFFSET.oSpellBook + (i * 4), "DWORD");
                // const spellNameBuffer = Reader.readProcessMemoryBuffer(spellAddress + OFFSET.oSpellName, 0x25);
                // const spellName = getNameFromBuffer(spellNameBuffer);
                // const spellLevel = Reader.readProcessMemory(spellAddress + OFFSET.oSpellLevel, "DWORD");
                // const spellManaCost = Reader.readProcessMemory(spellAddress + OFFSET.oSpellManaCost, "DWORD");
                // const spellInfo = Reader.readProcessMemory(spellAddress + OFFSET.oSpellInfo, 'DWORD');
                const spellReadyAt = Reader.readProcessMemory(spellAddress + OFFSET.oSpellReadyAt, "DWORD");
                const spell = new Spell(Reader.toHex(spellAddress), 0, 0, 0, spellReadyAt, 0, "spellName");
                spells.push(spell);
            }
        }
        return { netId, hp, maxHp, pos, name, team, visible, range, address: Reader.toHex(address), spells }

    }

}

const instance = new AyayaLeagueReader(process.argv[2] != 'nohook');

export default instance;