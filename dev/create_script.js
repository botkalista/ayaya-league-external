const fs = require('fs');
const path = require('path');
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

const scriptPath = path.join(__dirname, '../scripts');

const ScriptTemplate = scriptName => {
  //region script template
  return `/// <reference path="../src/typings/ScriptTypings.d.ts" />

  function setup() {
    console.log('${scriptName || 'script'}.js loaded');
  }

  function onTick() {
    if (!getSetting('script.enable')) return
  }

  function onDraw() {}

  register({ setup, onTick, onDraw });

  settings(
    [
      { title: '${scriptName || 'script'}' },
      {
        group: [
          { id: 'script.enable', type: 'toggle', text: 'Enable', style: 1, value: false },
          { id: 'script.slider', type: 'slider', text: 'Slider', style: 1, value: 10, max: 100, min: 0, size: 1 },
          { id: 'script.text', type: 'text', text: 'Textbox', value: 'Something' },
          { id: 'script.radio', type: 'radio', text: 'Radio', value: 'Option A', options: ['Option A', 'Option B', 'Option C'] },
          { id: 'script.key', type: 'key', text: 'Key', value: getVKEY("SPACEBAR") },
        ],
      },
      { desc: 'Description here' }
    ]
  );`;
  //endregion script template
};

rl.setPrompt('Enter script name?: ');
rl.prompt();
rl.on('line', ip => {
  if (!ip) {
    rl.prompt();
  } else {
    fs.stat(`${scriptPath}/${ip}.js`, (err, stat) => {
      if (err == null) {
        console.log(`${ip} already exists\nChoose other name!`);
        rl.prompt();
      } else if (err.code === 'ENOENT') {
        fs.writeFileSync(`${scriptPath}/${ip}.js`, ScriptTemplate(ip));
        if (fs.existsSync(`${scriptPath}/${ip}.js`)) {
          console.log(`The ${ip}.js has been created!`);
          rl.close();
        } else {
          console.log(`The ${ip}.js could not be created!`);
          rl.close();
        }
      } else {
        console.log('Some other error: ', err.code);
        rl.close();
      }
    });
  }
});

