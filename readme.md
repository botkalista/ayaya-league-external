
<div align="center">
<h1>AyayaLeague</h1>
</div>

<div align="center">
<img src="https://user-images.githubusercontent.com/42075940/187264788-c4c74bcb-2912-41ee-a0b9-c985741fff04.jpg" alt="AyayaLeagueLogo" width="512">


<div align="middle">
    <img align="top" src="https://img.shields.io/github/release-date/botkalista/ayaya-league-external" alt="Release Date"></img>
</div>

</div>

   [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T7ERHMQ)
   
## What's AyayaLeague ?

AyayaLeague is an external script platform written in nodejs that supports custom user scripts.

## How to setup and run

### Prebuilt version

*For UnknownCheats moderators: as i already discussed with a moderator the prebuilt version is just the code minified and compressed (since javascript is an interpreted language and you can't build it). The term PREBUILT, BUILD, etc.. are only for newbie users understanding*

<img align="top" src="https://img.shields.io/github/release-date/botkalista/ayaya-league-external" alt="Release Date"></img>

1. Download prebuilt version of AyayaLeague <a href="https://github.com/botkalista/ayaya-league-external/releases"><b>HERE</b></a>

2. Extract the folder content

3. Run `notepad.exe` as Administrator (_run it from a terminal if you want to read console.log outputs_)

### From source code

1. Clone the repo `git clone https://github.com/botkalista/ayaya-league-external.git`

2. Install Node.js 32bit v16.10.0

   Download for Windows: https://nodejs.org/dist/v16.10.0/node-v16.10.0-x86.msi

   Download for other OS: https://nodejs.org/fa/blog/release/v16.10.0/

3. Install windows build tools if you don't have them `npm install --g --production windows-build-tools`

4. Run `npm i`

5. Enter into a league game (must be `windowed` or `no borders`)

6. Run `npm start` from a terminal with Administrator privileges

7. Enjoy :3

# Set game settings

To use correctly the script you must adjust some settings inside League.

- Set screen mode to `no borders`
- Set _Player Move Click_ to **U** inside _Settings > Shortcuts -> Player Movement_
- Set _Player Attack Only_ to **I** inside _Settings > Shortcuts -> Player Movement_

# User Scripts

Every user script is located into: `/scripts/` (on prebuilt version `/resources/app/scripts/`)


## How to write a script

1. Create your script file inside the `/scripts/` folder and call it `_yourscriptname_.js`

2. Write a [`setup`](#setup) function to manage initialization
   ```js
   function setup() {
     console.log("Script is loaded");
   }
   ```
3. Write a [`onTick`](#ontick) function to execute actions every tick.
   ```js
   function onTick() {
     if (manager.me.spells[3].ready == true) {
       console.log("R is up");
     }
   }
   ```
4. Write a [`onMissileCreate`](#onmissilecreate) function to execute actions every time a new missile is created
   ```js
   function onMissileCreate(missile) {
     if (missile.isAutoAttack) console.log("Auto attack missile created");
     if (missile.isTurretShot) console.log("Turret shot missile created");
   }
   ```

5. Write a [`onMoveCreate`](#onmovecreate) function to execute actions every time an enemy changes direction
   ```js
   function onMoveCreate(player) {
      const x = player.AiManager.endPath.x;
      const z = player.AiManager.endPath.z;
      console.log(player.name + ' heading to' + x + ' ' + z);
   }
   ```
  
6. Write a [`onDraw`](#ondraw) function to draw something every frame
   ```js
   function onDraw() {
      ctx.circle(manager.me.gamePos, manager.me.range, 50, 255, 1);
   }
   ```

7. Export the functions we just created
   ```js
   module.exports = { setup, onTick, onMissileCreate, onMoveCreate, onDraw };
   ```

8. Start AyayaLeague and enjoy your script :3

## How to add settings to your script

1. From `setup` function return the settings for your script

    ```js
    function setup() {
      console.log('SettingTest is loaded');

      const settings = [
        {
            id: 'test.toggle',
            type: 'toggle',
            text: 'Test toggle',
            style: 1,
            value: true
        },
        {
            id: 'test.slider',
            type: 'slider',
            text: 'Test slider',
            style: 1,
            value: 10,
            max: 100,
            min: 0,
            size: 1
        },
        {
            id: 'test.text',
            type: 'text',
            text: 'Test text',
            value: 'Something'
        },
        { 
            id: 'test.radio',
            type: 'radio',
            text: 'Test radio',
            value: 'Option A',
            options: ['Option A', 'Option B', 'Option C']
        },
        {
            id: 'test.key',
            type: 'key',
            text: 'Test key',
            value: getVKEY("SPACEBAR")
        },
      ]

      return settings;
    }
    ```

2. Use them in other functions

    ```js
    function onTick(getSettings) {
        console.log(getSettings('test.toggle'));
        console.log(getSettings('test.slider'));
        console.log(getSettings('test.text'));
        console.log(getSettings('test.radio'));
        console.log(getSettings('test.key'));
    }
    ```
    
## Better documentation

I'm currently creating a website to publish a very detailed documentation on it.
For now stick to examples and use intellisense, for any question or doubt join our discord :3