/// <reference path="../src/typings/ScriptTypings.d.ts" />

function setup() {
    console.log('Core loaded');

    return [
        { title: 'AyayaCore' },
        {
            group: [
                // { id: 'show.player.range', type: 'toggle', text: 'Show Player Range', style: 1, value: false },
                { id: 'show.discord', type: 'toggle', text: 'Show Discord', style: 1, value: true },
                // { id: 'test.slider', type: 'slider', text: 'Test slider', style: 1, value: 10, max: 100, min: 0, size: 1 },
                // { id: 'test.text', type: 'text', text: 'Test text', value: 'Something' },
                // { id: 'test.radio', type: 'radio', text: 'Test radio', value: 'Option A', options: ['Option A', 'Option B', 'Option C'] },
                // { id: 'test.key', type: 'key', text: 'Test key', value: getVKEY("SPACEBAR") },
            ],
        },
        { desc: 'Ayaya core is a builtin script and it is NOT required for AyayaLeague to work' }
    ];

}

let lastAaTick = 0;
let canPlayerMove = true;
let lastWasMove = 0;

function getTime() {
    return manager.game.time * 1000
}

function canAttack(attackDelay) { return lastAaTick + attackDelay < getTime() }

function canMove(windupTime) { return (lastAaTick + windupTime < getTime() || canPlayerMove) }

async function onTick(getSetting) {
}

function onDraw(getSetting) {
    const showDiscord = getSetting('show.discord');
    if (showDiscord) ctx.textAt('Join the AyayaLeague discord: https://discord.gg/qYy8Qz4Cr5', 20, 35, 26, 255);
}


function onMissileCreate(missile, settings) {
    console.log('onMissileCreate', missile.address);
}

module.exports = { onTick, onDraw, setup, onMissileCreate }
