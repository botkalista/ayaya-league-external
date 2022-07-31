
import Reader from './MemoryReader';
import { allowedChars, OFFSET } from './consts/Offsets'
import { Entity } from './models/Entity';

class AyayaLeagueReader {

    private objectManager;
    private rootNode;

    constructor() {
        Reader.hookLeagueProcess();
    }

    toHex(int: number) {
        return Reader.toHex(int);
    }

    getLocalPlayer(): Entity {
        const localPlayer = Reader.readProcessMemory(OFFSET.oLocalPlayer, "DWORD", true);
        const data = this.getObjectData(localPlayer);
        return Entity.fromData(data);
    }

    getEntities() {
        const objects = this.getAllObjects();
        const objectsData = objects.map(o => this.readObjectAt(o));
        return objectsData;
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
        const _name: any[] = [];
        for (let i = 0; i < nameBuffer.length; i++) {
            const s = String.fromCharCode(nameBuffer.at(i))
            if (!allowedChars.includes(s)) break;
            _name.push(s);
        }
        const name = _name.join('');

        const netId = Reader.readProcessMemory(address + OFFSET.oMapNetId, "DWORD");
        const hp = Reader.readProcessMemory(address + OFFSET.oObjectHealth, "FLOAT");
        const maxHp = Reader.readProcessMemory(address + OFFSET.oObjectMaxHealth, "FLOAT");
        const pos = Reader.readProcessMemory(address + OFFSET.oObjPosition, "VEC3");
        const index = Reader.readProcessMemory(address + OFFSET.oObjIndex, "DWORD");
        const team = Reader.readProcessMemory(address + OFFSET.oObjTeam, "DWORD");

        return { netId, hp, maxHp, pos, name, index, team, address: Reader.toHex(address) }
    }

}


const instance = new AyayaLeagueReader();

export default instance;