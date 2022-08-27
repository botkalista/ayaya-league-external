
import { CachedClass } from "./CachedClass";
import AyayaLeague from '../LeagueReader';
import OFFSET  from "../consts/Offsets";
import { Vector3 } from "./Vector";

const Reader = AyayaLeague.reader;

export class ActiveSpellEntry extends CachedClass {


    constructor(public address: number) { super(); }

    get isBasic() {
        return this.use("isBasic", () => Reader.readProcessMemory(this.address + OFFSET.oActiveSpellEntryIsBasic, "BOOL"));
    }

    get startPos() {
        return this.use("startPos", () => Vector3.fromData(Reader.readProcessMemory(this.address + OFFSET.oActiveSpellEntryStartPos, "VEC3")));
    }

    get endPos() {
        return this.use("endPos", () => Vector3.fromData(Reader.readProcessMemory(this.address + OFFSET.oActiveSpellEntryEndPos, "VEC3")));
    }

}