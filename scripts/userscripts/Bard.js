/** 
 * @typedef {import("../../src/models/Entity").Entity} Entity
 * @typedef {import("../UserScriptManager").UserScriptManager} Manager
 * @typedef {import("../../src/models/drawing/DrawContext").DrawContext} DrawContext
 */


const scriptChampName = 'Bard';

function setup() {
    console.log('Bard.js loaded.')
}


let mapEnabled = false;
/** @type {Entity[]} */
let mapMeeps = [];
/** @type {Entity} */
let closestMeep;
const passiveImage = 'http://ddragon.leagueoflegends.com/cdn/12.15.1/img/passive/Bard_Passive.png'


let baseDrawingOffset;

/** 
 * @param {Manager} manager
 * @param {number} ticks
 */
async function onTick(manager, ticks) {
    if (manager.me.name != scriptChampName) return;
    baseDrawingOffset = baseDrawingOffset || manager.me.baseDrawingOffset;
    mapMeeps = manager.monsters.filter(e => e.name == 'BardPickup' && e.hp > 0);
    mapEnabled = manager.game.isKeyPressed(0x5);
    if (!mapEnabled) return;
    const meeps = manager.utils.genericInRange(mapMeeps, 9999).sort((b, a) => {
        return b.gamePos.dist(manager.me.gamePos) - a.gamePos.dist(manager.me.gamePos);
    });
    if (meeps.length > 0) closestMeep = meeps[0];

}


/** 
 * @param {DrawContext} ctx
 * @param {Manager} manager
 */
function onDraw(ctx, manager) {
    if (manager.me.name != scriptChampName) return;
    if (!baseDrawingOffset) return;

    const pPos = manager.game.screenSize.copy();
    pPos.x /= 2;
    pPos.x += 125;
    pPos.y -= 146;
    ctx.image(pPos, passiveImage, 'bard_p', 32, 32)

    const bPos = pPos.copy();
    bPos.x += 32;
    bPos.y += 32 - 16;
    ctx.rect(bPos, 100, 16, undefined, 40, 1);


    const max = 15;
    const val = Math.min(max, mapMeeps.length);

    const iPos = bPos.copy();
    iPos.x += 2;
    iPos.y += 2;
    ctx.rect(iPos, parseInt((100 - 4) / max * val), 16 - 4, undefined, [180, 180, 0], 1);


    if (mapEnabled && closestMeep) {
        ctx.line3D(manager.me.gamePos, closestMeep.gamePos, 255, 2);
        // ctx.text(closestMeep.hp, 40, 40, 22, 255);
        // ctx.text(mapMeeps.map(e => e.hp).join('\n'), 40, 80, 22, 255);
    }



}


module.exports = { setup, onDraw, onTick }
