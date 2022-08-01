import { Spell } from "./Spell";
import { Vector3 } from "./Vector";

export class Entity {
    address: string;
    netId: number;
    index: number;
    name: string;
    team: number;
    pos: Vector3;
    hp: number;
    maxHp: number;
    dead: boolean;
    spells: Spell[];

    static fromData(data: any) {
        const instance = new Entity();
        for (const key in data) {
            instance[key] = data[key];
        }
        return instance;
    }

    get healthPercent(): number {
        return 100 / this.maxHp * this.hp;
    }

}