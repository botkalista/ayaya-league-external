import { CachedClass } from "./CachedClass";
import AyayaLeague from '..//LeagueReader';
import { readName } from "../StructureReader";
import { OFFSET } from "../consts/Offsets";


const Reader = AyayaLeague.reader;

export class Spell extends CachedClass {
    constructor(public address: number) { super() };

    private get info(): number {
        return this.use('info', () => Reader.readProcessMemory(this.address + OFFSET.oSpellInfo, "DWORD"));
    }
    private get data(): number {
        return this.use('data', () => Reader.readProcessMemory(this.info + OFFSET.oSpellInfoData, "DWORD"));
    }

    get name(): string {
        return this.use('name', () => {
            const sNamePtr = Reader.readProcessMemory(this.data + OFFSET.oSpellInfoDataName, "DWORD");
            return readName(sNamePtr);
        });
    }

    get readyAt(): number {
        return this.use('readyAt', () => Reader.readProcessMemory(this.address + OFFSET.oSpellReadyAt, "FLOAT"));
    }
    get level(): number {
        return this.use('level', () => Reader.readProcessMemory(this.address + OFFSET.oSpellLevel, 'DWORD'));
    }


    get ready(): boolean {
        return this.readyIn <= 0;
    }
    get readyIn(): number {
        const cd = this.readyAt - CachedClass.get<number>('gameTime');
        return cd > 0 ? cd : 0;
    }

}