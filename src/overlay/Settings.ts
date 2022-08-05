
import { Settings } from './models/Settings';
import * as fs from 'fs';

let settings: Settings = {
    me: { range: true },
    nmeChamps: { range: true },
    over: { nmeSpells: true, performance: true },
    missiles: { show: true },
    root: { readingTime: 3000 }
}

export function loadSettingsFromFile() {
    if (!fs.existsSync('settings.json')) return saveSettingsToFile();
    settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
}

export function saveSettingsToFile() {
    fs.writeFileSync('settings.json', JSON.stringify(settings));
}

export function getSettings() {
    return settings;
}

export function setSettings(data: Settings) {
    settings = data;
}