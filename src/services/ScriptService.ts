import * as fs from 'fs';
import * as path from 'path';

import Manager from '../models/main/Manager';
import DrawService from './DrawService';
import { vKeys } from './KeyMappingService';

type Script = {
  fns: any;
  path: string;
  name: string;
  pending: any;
  settings: any[];
};

const scripts: Script[] = [];

export async function loadScripts() {
  console.log('Loading scripts');

  global.manager = Manager;
  global.ctx = DrawService;
  global.getVKEY = function (key: keyof typeof vKeys) {
    return parseInt(vKeys[key][0]);
  };

  // Uncache all scripts
  for (const script of scripts) {
    delete require.cache[script.path];
  }

  scripts.length = 0;

  const basePath = path.join(__dirname, '../../scripts');
  const scriptsFiles = fs.readdirSync(basePath);
  for (const scriptPath of scriptsFiles) {
    const filePath = path.join(basePath, scriptPath);

    try {
      // Require script
      const scriptRequired = await require(filePath);

      // Execute setup
      const scriptSettings = scriptRequired.setup?.();

      const scriptObject = {
        fns: scriptRequired,
        name: scriptPath,
        path: filePath,
        settings: scriptSettings || [],
        pending: {},
      };

      scripts.push(scriptObject);
    } catch (ex) {
      console.error('Error loading', filePath, ex);
    }
  }

  console.log('Scripts loaded');
}

export function executeFunction(functionName: string, ...args: any) {
  for (const scriptObject of scripts) {
    const fn = scriptObject.fns[functionName];
    if (!fn || scriptObject.pending[functionName]) continue;

    const getSetting = (id) => getSettingRaw(scriptObject.settings, id)?.value;

    try {
      const exec = fn(...args, getSetting);
      if (!exec || !exec.then) continue;
      scriptObject.pending[functionName] = true;
      exec.then(() => (scriptObject.pending[functionName] = false));
    } catch (ex) {
      console.error('Error during function', functionName, 'of', scriptObject.name, ex);
    }
  }
}

export function getScripts() {
  return scripts;
}

export function getSettingRaw(settings: any, id: string) {
  const groups = settings.filter((e) => e.group != undefined).map((e) => e.group);
  for (const group of groups) {
    for (const setting of group) {
      if (setting.id === id) {
        return setting;
      }
    }
  }
  return null;
}
