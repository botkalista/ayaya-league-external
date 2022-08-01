
import Reader from './MemoryReader';
import { OFFSET } from './consts/Offsets'
import { Entity } from './models/Entity';
import { Spell } from './models/Spell';
import { getNameFromBuffer } from './utils/Utils';

class AyayaLeagueReader {

    private objectManager;
    private rootNode;

    constructor() {
        Reader.hookLeagueProcess();
        console.log('BaseAddress', this.toHex(Reader.baseAddr));
        console.log('Handle', this.toHex(Reader.pHandle));
    }

    toHex(int: number) {
        return Reader.toHex(int);
    }

    getLocalPlayer(): Entity {
        const localPlayer = Reader.readProcessMemory(OFFSET.oLocalPlayer, "DWORD", true);
        const data = this.getObjectData(localPlayer);
        return Entity.fromData(data);
    }

    getEntities(): Entity[] {
        const objects = this.getAllObjects();
        const objectsData = objects.map(o => this.readObjectAt(o)).filter(e => e != undefined);
        return objectsData as Entity[];
    }

    getHeroes() {
        //* ??
    }

    getGameTime() {
        const time = Reader.readProcessMemory(OFFSET.oGameTime, 'DWORD', true);
        return time;
    }

    worldToScreen(pos: { x: number, y: number, z: number }) {
        // public static Vector2 WorldToScreen(Vector3 pos)
        // {
        //     Vector2 returnVec = Vector2.Zero;
        //     Vector2 screen = ScreenSize();
        //     Matrix matrix = ViewProjectionMatrix();
        //     Vector4 clipCoords;
        //     clipCoords.X = pos.X * matrix.M11 + pos.Y * matrix.M21 + pos.Z * matrix.M31 + matrix.M41;
        //     clipCoords.Y = pos.X * matrix.M12 + pos.Y * matrix.M22 + pos.Z * matrix.M32 + matrix.M42;
        //     clipCoords.Z = pos.X * matrix.M13 + pos.Y * matrix.M23 + pos.Z * matrix.M33 + matrix.M43;
        //     clipCoords.W = pos.X * matrix.M14 + pos.Y * matrix.M24 + pos.Z * matrix.M34 + matrix.M44;

        //     if (clipCoords[3] < 0.1f)
        //     {
        //         return returnVec;
        //     }
        //     Vector3 M;
        //     M.X = clipCoords.X / clipCoords.W;
        //     M.Y = clipCoords.Y / clipCoords.W;
        //     M.Z = clipCoords.Z / clipCoords.W;

        //     returnVec.X = (screen.X / 2 * M.X) + (M.X + screen.X / 2);
        //     returnVec.Y = -(screen.Y / 2 * M.Y) + (M.Y + screen.Y / 2);
        //     return returnVec;
        // }
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


    private getAllObjects() {

        const objectManager = this.objectManager || this.getObjectManager();
        const rootNode = this.rootNode || this.getObjectManagerRootNode(objectManager);

        const checked = new Set<number>();
        const toCheck = new Set<number>();
        toCheck.add(rootNode);
        while (toCheck.size > 0) {
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

    private getObjectData(address: number) {
        const namePointer = Reader.readProcessMemory(address + OFFSET.oObjName, 'DWORD');
        const nameBuffer = Reader.readProcessMemoryBuffer(namePointer, 0x25);
        const name = getNameFromBuffer(nameBuffer);

        if (name.length < 3) return;

        const netId = Reader.readProcessMemory(address + OFFSET.oObjNetId, "DWORD");
        const hp = Reader.readProcessMemory(address + OFFSET.oObjectHealth, "FLOAT");
        const maxHp = Reader.readProcessMemory(address + OFFSET.oObjectMaxHealth, "FLOAT");
        const pos = Reader.readProcessMemory(address + OFFSET.oObjPosition, "VEC3");
        const index = Reader.readProcessMemory(address + OFFSET.oObjIndex, "DWORD");
        const team = Reader.readProcessMemory(address + OFFSET.oObjTeam, "DWORD");
        const dead = Reader.readProcessMemory(address + OFFSET.oObjectDead, "DWORD");

        const spells: Spell[] = [];

        if (team == 100 || team == 200) {
            for (let i = 0; i < 6; i++) {

                const spellAddress = Reader.readProcessMemory(address + OFFSET.oSpellBook + (i * 4), "DWORD");


                const spellNameBuffer = Reader.readProcessMemoryBuffer(spellAddress + OFFSET.oSpellName, 0x25);
                const spellName = getNameFromBuffer(spellNameBuffer);
                const spellLevel = Reader.readProcessMemory(spellAddress + OFFSET.oSpellLevel, "DWORD");
                const spellManaCost = Reader.readProcessMemory(spellAddress + OFFSET.oSpellManaCost, "DWORD");
                const spellReadyAt = Reader.readProcessMemory(spellAddress + OFFSET.oSpellReadyAt, "DWORD");

                const spell = new Spell(Reader.toHex(spellAddress), spellLevel, 0, spellManaCost, spellReadyAt, 0, spellName);
                spells.push(spell);
            }
        }
        return { netId, hp, maxHp, pos, name, index, team, dead, address: Reader.toHex(address), spells }

    }

}


const instance = new AyayaLeagueReader();

export default instance;