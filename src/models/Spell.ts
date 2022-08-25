import { CachedClass } from "./CachedClass";
import AyayaLeague from '..//LeagueReader';
import { readName } from "../StructureReader";
import OFFSET  from "../consts/Offsets";


const Reader = AyayaLeague.reader;

export class Spell extends CachedClass {
    constructor(public address: number) { super() };

    private get spellbook(): number {
        return this.use('spellbook', () => Reader.readProcessMemory(this.address + OFFSET.oSpellSlots, "DWORD"));
    }
    private get info(): number {
        return this.use('info', () => Reader.readProcessMemory(this.spellbook + OFFSET.oSpellInfo, "DWORD"));
    }
    private get data(): number {
        return this.use('data', () => Reader.readProcessMemory(this.info + OFFSET.oSpellInfoData, "DWORD"));
    }

    get name(): string {
        return this.use('name', () => {
            const sNamePtr = Reader.readProcessMemory(this.data + OFFSET.oSpellInfoDataName, "DWORD");
            return readName(sNamePtr, true);
        });
    }

    get infoName() {
        return this.use('infoName', () => Reader.readProcessMemory(this.info + OFFSET.oSpellInfoName, "STR"))
    }

    get readyAt(): number {
        return this.use('readyAt', () => Reader.readProcessMemory(this.spellbook + OFFSET.oSpellReadyAt, "FLOAT"));
    }
    get level(): number {
        return this.use('level', () => Reader.readProcessMemory(this.spellbook + OFFSET.oSpellLevel, 'DWORD'));
    }


    get ready(): boolean {
        return this.readyIn <= 0;
    }
    get readyIn(): number {
        const cd = this.readyAt - CachedClass.get<number>('gameTime');
        return cd > 0 ? cd : 0;
    }

}