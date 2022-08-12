
import * as fs from 'fs';
import { ScriptSettingsFull } from '../events/types';

let settings: ScriptSettingsFull = []

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

export function setSettings(data: any[]) {
    settings = data;
}