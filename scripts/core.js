/// <reference path="../src/typings/ScriptTypings.d.ts" />


function setup() {
    console.log('Core loaded');
}

function onTick() {

}

function onDraw() {
    const showDiscord = getSetting('show.discord');
    const showPlayerRange = getSetting('show.player.range');

    if (showPlayerRange) manager.prepareForLoop();


    if (showDiscord) ctx.textAt('Join the AyayaLeague discord: https://discord.gg/qYy8Qz4Cr5', 20, 35, 26, 255);

    if (showPlayerRange) {
        const me = manager.me;
        ctx.circleAtPoint3D(me.gamePos, 50, 200, 2)
    }


}

register({ setup, onTick, onDraw });

const scriptSettings = [
    { title: 'AyayaCore' },
    {
        group: [
            { id: 'show.player.range', type: 'toggle', text: 'Show Player Range', style: 1, value: false },
            { id: 'show.discord', type: 'toggle', text: 'Show Discord', style: 1, value: true },
            { id: 'test.slider', type: 'slider', text: 'Test', style: 1, value: 10, max: 100, min: 0, size: 1 },
        ],
    },
    { desc: 'Ayaya core is a builtin script and it is NOT required for AyayaLeague to work' }
]

settings(scriptSettings);





