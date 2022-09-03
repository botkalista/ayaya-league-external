/// <reference path="../src/typings/ScriptTypings.d.ts" />


function setup() {
    console.log('SpellTracker loaded');
}

function onTick() {


}

function onDraw() {
    const result = [];

    const enemies = manager.champions.enemies;

    for (const enemy of enemies) {
        const spells = enemy.spells.map(e => e.ready);
        result.push(spells);
    }
    const txt = result.map(e => e.join(' ')).join('\n');
    ctx.textAt(txt, 30, 40, 20, 255);
}

register({ setup, onTick, onDraw });
