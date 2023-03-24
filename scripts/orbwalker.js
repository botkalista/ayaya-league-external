/// <reference path="../src/typings/ScriptTypings.d.ts" />

function setup() {
  console.log('Orbwalker loaded');

  return [
    { title: 'Orbwalker' },
    {
      group: [
        { id: 'orb.enabled', type: 'toggle', text: 'Enabled', style: 1, value: false },
        { id: 'orb.key', type: 'key', text: 'OrbwalkerKey', value: getVKEY("SPACEBAR") },
      ],
    },
    { desc: 'Please set the correct keys on the game settings (U for move, I for attack)' }
  ];
}

let lastAttackTick = 0;
let canPlayerMove = true;
let remainingMoveTicks = 0;

function getCurrentTime() {
  return manager.game.time * 1000;
}

function canAttack(attackDelay) {
  return lastAttackTick + attackDelay < getCurrentTime();
}

async function onTick(getSetting) {
  const orbEnabled = getSetting('orb.enabled');
  if (!orbEnabled) return;

  const orbKey = getSetting('orb.key');
  if (!manager.game.winapi.actions.isPressed(orbKey)) return;

  const target = manager.utils.lowestHealthEnemyChampInRange(manager.me.range, { includeClones: true, includeDead: true });
  if (!target) {
    canPlayerMove = true;
  }

  if (target && canAttack(manager.me.attackDelay)) {
    canPlayerMove = false;
    lastAttackTick = getCurrentTime();
    await manager.game.issueOrder(target.screenPos, true);
    console.log('Attacking');
  } else if (canPlayerMove && remainingMoveTicks === 0) {
    const pos = manager.game.winapi.actions.getMousePos();
    remainingMoveTicks = 2;
    await manager.game.issueOrder(pos, false);
  }

  if (remainingMoveTicks > 0) {
    remainingMoveTicks--;
  }
}

function onMissileCreate(missile, getSetting) {
  if (missile.spellName.startsWith(manager.me.name) && missile.spellName.includes('BasicAttack')) {
    canPlayerMove = true;
  }
}

module.exports = { onTick, setup, onMissileCreate };
