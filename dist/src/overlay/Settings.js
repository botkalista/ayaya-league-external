"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSettings = exports.getSettings = exports.saveSettingsToFile = exports.loadSettingsFromFile = void 0;
const fs = require("fs");
let settings = [];
function loadSettingsFromFile() {
    if (!fs.existsSync('settings.json'))
        return saveSettingsToFile();
    settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
}
exports.loadSettingsFromFile = loadSettingsFromFile;
function saveSettingsToFile() {
    fs.writeFileSync('settings.json', JSON.stringify(settings));
}
exports.saveSettingsToFile = saveSettingsToFile;
function getSettings() {
    return settings;
}
exports.getSettings = getSettings;
function setSettings(data) {
    settings = data;
}
exports.setSettings = setSettings;
