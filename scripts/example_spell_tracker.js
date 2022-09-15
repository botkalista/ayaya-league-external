// /// <reference path="../src/typings/ScriptTypings.d.ts" />


// function setup() {
//     console.log('SpellTracker loaded');
// }

// function onTick() {


// }

// function onDraw() {
//     const result = [];

//     const inRange = manager.utils.enemyChampsInRange(1100, { includeClones: true, includeDead: true });

//     if (inRange.length == 0) return;

//     const start = Date.now();
//     ctx.textAt(inRange[0].buffManager.buffs.map(e => e.name + '|' + e.count2).join('\n'), 40, 40, 22, 255);
//     const end = Date.now();
//     ctx.textAt(end-start, 240, 80, 22, 255);

//     // ctx.circleAtPoint3D(closest[0].gamePos, 50, 150, 2, [200, 0, 0]);
// }

// register({ setup, onTick, onDraw });
