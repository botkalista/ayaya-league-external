
import Reader from './MemoryReader';
import { allowedChars, OFFSET } from './consts/Offsets'
import { Entity } from './models/Entity';
import { Spell } from './models/Spell';
import { getNameFromBuffer } from './utils/Utils';

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

    getGameTime() {
        const time = Reader.readProcessMemory(OFFSET.oGameTime, 'DWORD', true);
        return time;
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
        const netId = Reader.readProcessMemory(address + OFFSET.oMapNetId, "DWORD");
        const hp = Reader.readProcessMemory(address + OFFSET.oObjectHealth, "FLOAT");
        const maxHp = Reader.readProcessMemory(address + OFFSET.oObjectMaxHealth, "FLOAT");
        const pos = Reader.readProcessMemory(address + OFFSET.oObjPosition, "VEC3");
        const index = Reader.readProcessMemory(address + OFFSET.oObjIndex, "DWORD");
        const team = Reader.readProcessMemory(address + OFFSET.oObjTeam, "DWORD");
        const dead = Reader.readProcessMemory(address + OFFSET.oObjectDead, "DWORD");

        const spells: Spell[] = [];

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

        return { netId, hp, maxHp, pos, name, index, team, dead, address: Reader.toHex(address), spells }

    }

}


const instance = new AyayaLeagueReader();

export default instance;