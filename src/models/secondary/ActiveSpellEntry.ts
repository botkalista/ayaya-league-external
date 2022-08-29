
import { CachedClass } from "../../components/CachedClass";

import League from "../../components/League";
import Offsets from "../../components/Offsets";
import { DataType } from "../../components/winapi/typings/enums/DataType";
import { Vector3 } from "../Vector";

export class ActiveSpellEntry extends CachedClass {


    constructor(public address: number) { super(); }

    get isBasic() {
        return this.use("isBasic", () => League.read(this.address + Offsets.oActiveSpellEntryIsBasic, DataType.BOOL));
    }

    get startPos(): Vector3 {
        return this.use("startPos", () => Vector3.fromData(League.read(this.address + Offsets.oActiveSpellEntryStartPos, DataType.VEC3)));
    }

    get endPos(): Vector3 {
        return this.use("endPos", () => Vector3.fromData(League.read(this.address + Offsets.oActiveSpellEntryEndPos, DataType.VEC3)));
    }

}