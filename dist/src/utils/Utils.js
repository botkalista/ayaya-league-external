"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCircle3D = exports.worldToScreen = exports.matrixToArray = exports.factoryFromArray = exports.getChampionRadius = exports.getChampionBaseAttackSpeed = exports.getChampionWindupMod = exports.getChampionWindup = void 0;
const Vector_1 = require("../models/Vector");
const ChampionsWindups_1 = require("../consts/ChampionsWindups");
const ChampionsRadius_1 = require("../consts/ChampionsRadius");
const ChampionsBaseAttackSpeed_1 = require("../consts/ChampionsBaseAttackSpeed");
function getChampionWindup(championName) {
    return parseFloat(ChampionsWindups_1.ChampionsWindups.find(e => e.champName == championName).windup);
}
exports.getChampionWindup = getChampionWindup;
function getChampionWindupMod(championName) {
    const modWindup = ChampionsWindups_1.ChampionsWindups.find(e => e.champName == championName).modWindup;
    return parseFloat(modWindup == 'N/A' ? '0' : modWindup);
}
exports.getChampionWindupMod = getChampionWindupMod;
function getChampionBaseAttackSpeed(championName) {
    return ChampionsBaseAttackSpeed_1.ChampionsBaseAttackSpeed.find(e => e.name == championName).base;
}
exports.getChampionBaseAttackSpeed = getChampionBaseAttackSpeed;
function getChampionRadius(championName) {
    return (ChampionsRadius_1.ChampionsRadius.find(e => e.name == championName) || { size: 65 }).size;
}
exports.getChampionRadius = getChampionRadius;
//* i hope this is right, i suck at typings
function factoryFromArray(type, arr) {
    return arr.map(e => new type(e));
}
exports.factoryFromArray = factoryFromArray;
function matrixToArray(matrix) {
    const result = [];
    for (let i = 0; i < matrix['_data'].length; i++) {
        for (let k = 0; k < matrix['_data'][i].length; k++) {
            const val = matrix['_data'][i][k];
            result.push(val);
        }
    }
    return result;
}
exports.matrixToArray = matrixToArray;
function worldToScreen(pos, screenSize, viewProjMatrix) {
    const out = Vector_1.Vector2.zero;
    const screen = screenSize.copy();
    const clipCoords = Vector_1.Vector4.zero;
    clipCoords.x = pos.x * viewProjMatrix[0] + pos.y * viewProjMatrix[4] + pos.z * viewProjMatrix[8] + viewProjMatrix[12];
    clipCoords.y = pos.x * viewProjMatrix[1] + pos.y * viewProjMatrix[5] + pos.z * viewProjMatrix[9] + viewProjMatrix[13];
    clipCoords.z = pos.x * viewProjMatrix[2] + pos.y * viewProjMatrix[6] + pos.z * viewProjMatrix[10] + viewProjMatrix[14];
    clipCoords.w = pos.x * viewProjMatrix[3] + pos.y * viewProjMatrix[7] + pos.z * viewProjMatrix[11] + viewProjMatrix[15];
    if (clipCoords.w < 1.0)
        clipCoords.w = 1;
    const m = Vector_1.Vector3.zero;
    m.x = clipCoords.x / clipCoords.w;
    m.y = clipCoords.y / clipCoords.w;
    m.z = clipCoords.z / clipCoords.w;
    out.x = (screen.x / 2 * m.x) + (m.x + screen.x / 2);
    out.y = -(screen.y / 2 * m.y) + (m.y + screen.y / 2);
    return out;
}
exports.worldToScreen = worldToScreen;
function getCircle3D(pos, points, radius, screenSize, viewProjMatrixArg) {
    const p = Math.PI * 2 / points;
    const result = [];
    for (let a = 0; a < Math.PI * 2; a += p) {
        const start = new Vector_1.Vector3(radius * Math.cos(a) + pos.x, radius * Math.sin(a) + pos.z, pos.y);
        const end = new Vector_1.Vector3(radius * Math.cos(a + p) + pos.x, radius * Math.sin(a + p) + pos.z, pos.y);
        const start2 = new Vector_1.Vector3(start.x, start.z, start.y);
        const end2 = new Vector_1.Vector3(end.x, end.z, end.y);
        const startScreen = worldToScreen(start2, screenSize, viewProjMatrixArg);
        const endScreen = worldToScreen(end2, screenSize, viewProjMatrixArg);
        result.push([startScreen, endScreen]);
    }
    return result;
}
exports.getCircle3D = getCircle3D;
