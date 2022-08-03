import { Spell } from "./Spell";
import { Vector3 } from "./Vector";

export class Entity {
    address: string;
    netId: number;
    name: string;
    team: number;
    pos: Vector3;
    hp: number;
    maxHp: number;
    visible: boolean;
    spells: Spell[];
    range: number;

    get healthPercent(): number {
        return 100 / this.maxHp * this.hp;
    }

}