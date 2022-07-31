

export class Spell {

    constructor(public address: string, public level: number, public damage: number, public manaCost: number, public readyAt: number, public info: number, public name: string) { }

    isReady(gameTime: number) {
        return this.getSeconds(gameTime) <= 0;
    }

    getSeconds(gameTime: number) {
        const cd = (this.readyAt - gameTime) / 1000 / 4;
        return cd > 0 ? cd : 0;
    }
}