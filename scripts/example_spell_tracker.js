/// <reference path="../src/typings/ScriptTypings.d.ts" />


function setup() {
    console.log('SpellTracker loaded');
}

function onTick() {


}

function onDraw() {
    const result = [];

    const closest = manager.utils.enemyChampsInRange(2000, { includeClones: true, includeDead: true });

    ctx.textAt(closest.length, 40, 40, 22, 255);

    if (closest.length == 0) return;

    ctx.circleAtPoint3D(closest[0].gamePos, 50, 150, 2, [200, 0, 0]);
}

register({ setup, onTick, onDraw });
