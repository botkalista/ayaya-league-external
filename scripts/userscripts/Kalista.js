// #Author: UwUai
// #Description: kalista execution (champions - objectives)

/**
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */

const neutralsTargets = [
  "SRU_Baron",
  "SRU_Dragon_Air",
  "SRU_Dragon_Fire",
  "SRU_Dragon_Water",
  "SRU_Dragon_Earth",
  "SRU_Dragon_Elder",
  "SRU_RiftHerald",
  "SRU_Dragon_Chemtech",
  "SRU_Dragon_Hextech",
];

const eCost = 30;
const eFirstDamage = [20, 30, 40, 50, 60];
const eFirstScaling = 70;

const ePerDamage = [10, 16, 22, 28, 34];
const ePerScaling = [23.2, 27.55, 31.9, 36.25, 40.6];

const stacks = "kalistaexpungemarker";
const scriptChampName = "Kalista";

/** @type {Manager} */
let manager;

function setup() {
  console.log("Kalista.js loaded.");
}

const draw = {
  championsTargets: [],
  minionsTargets: [],
};

/**
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(_manager, ticks) {
  if (_manager.me.name != scriptChampName || _manager.me.hp < 10) return;
  manager = _manager;

  //* Get champions in range
  const inRange = manager.utils.enemyChampsInRange(1100);

  //* Champions in range with E stacks
  const eStacksTargetsChamps = inRange.filter((e) => {
    const eStacks = e.buffManager.byName(stacks);
    return eStacks?.count > 0;
  });

  //* Draw champions with E stacks
  draw.championsTargets = eStacksTargetsChamps;

  //* check if E can kill champions with E stacks
  for (const e of eStacksTargetsChamps) {
    if (e.hp <= getDamageE(e)) {
      return castE();
    }
  }

  //* Get neutralsTargets in range and last hit them if possible
  const targets = manager.monsters.filter((e) =>
    neutralsTargets.includes(e.name)
  );
  if (targets.length == 0) return;
  const lowest = manager.utils.lowestHealthGenericInRange(targets, 1100);
  if (!lowest) return;
  // kalista 50% damage to epic monsters
  if (lowest.hp <= getDamageE(lowest) * 0.5) {
    castE();
  }
}

/**
 * @param {boolean} poisoned
 * @param {Entity} target
 * @returns
 */
function getDamageE(target) {
  const level = manager.me.spells[2].level;
  const ad = manager.me.attackDamage;
  const baseDamage = eFirstDamage[level - 1] + (ad / 100) * eFirstScaling;
  let armor = target.armor + target.bonusArmor;

  if (target.buffManager.byName(stacks).count == 1)
    return baseDamage * (100 / (100 + armor));
  const bonusDamage =
    (ePerDamage[manager.me.spells[2].level - 1] +
      (ad / 100) * ePerScaling[manager.me.spells[2].level - 1]) *
      target.buffManager.byName(stacks).count -
    1;
  return (baseDamage + bonusDamage) * (100 / (100 + armor));
}

function castE() {
  const eSpell = manager.me.spells[2];
  if (!eSpell.ready || manager.me.mana < eCost) return;
  manager.game.pressKey(manager.spellSlot.E);
  manager.game.sleep(35);
  manager.game.releaseKey(manager.spellSlot.E);
  manager.game.sleep(300);
}

/**
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, manager) {
  if (manager.me.name != scriptChampName) return;
  draw.championsTargets.forEach((e) => {
    ctx.circle(e.gamePos, e.boundingBox, 30, [200, 0, 0], 3);
  });
}

module.exports = { setup, onTick, onDraw };