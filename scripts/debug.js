/// <reference path="../src/typings/ScriptTypings.d.ts" />


function setup() {
    console.log('Debug loaded');

    return [
        { title: 'Debug' },
        {
            group: [
                { id: 'show.debug.info', type: 'toggle', text: 'Show Debug Info', style: 1, value: false },
            ],
        },
        { desc: 'Script created to check data when offsets changes' }
    ];

}

function onTick() {
    // console.log('Tick')
}

function onDraw(getSetting) {
     const showDebugInfo = getSetting('show.debug.info');

      if (!showDebugInfo) return;

    const info = {
        address: manager.me.address,
        name: manager.me.name,
        level: manager.me.level,
        ad: manager.me.ad,
        ap: manager.me.ap,
        hp: manager.me.hp,
        maxHp: manager.me.maxHp,
        mana: manager.me.mana,
        maxMana: manager.me.maxMana,
        level: manager.me.level,
        armor: manager.me.armor,
        magicResist: manager.me.magicResist,
        magicPenFlat: manager.me.magicPenFlat,
        magicPenPercent: manager.me.magicPenPercent,
        lethality: manager.me.lethality,
        armorPenPercent: manager.me.armorPenPercent,
        gamePos: manager.me.gamePos,
        screenPos: manager.me.screenPos,
        movSpeed: manager.me.movSpeed,
        range: manager.me.range,
        spawnCount: manager.me.spawnCount,
        attackSpeed: manager.me.attackSpeed,
        attackSpeedBase: manager.me.attackSpeedBase,
        attackSpeedBonus: manager.me.attackSpeedBonus,
        spell1: manager.me.spells[0].name,
        spell2: manager.me.spells[1].name,
        spell3: manager.me.spells[2].name,
        spell4: manager.me.spells[3].name,
    }

    ctx.textAt(JSON.stringify(info, null, 2), 30, 30, 20, 255);



}

module.exports = { onTick, onDraw, setup }




