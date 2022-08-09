

# AyayaLeague [_ayaya-league-external_]


**EVERYTHING CAN CHANGE AT ANY TIME SINCE THIS IS STILL AN ALPHA VERSION**


## What's AyayaLeague ?

AyayaLeague is an external script platform written in nodejs that supports custom user scripts.

# Features

- Show player attack range
- Show enemy champions attack range
- Show enemy champions summoner spells cooldown
- Settings window [CTRL + SPACE] (shortcut sometimes doesn't word while League is focused)
- Show enemy champions ultimate cooldown
- Show missiles (fixed length for now)
- Custom user scripts  (Read more [here](#user-scripts))

## How to setup and run

### Prebuilt version

1. Download prebuilt version of AyayaLeague [**HERE**](https://github.com/botkalista/ayaya-league-external/releases/tag/Version1)

2. Extract the folder content

3. Run `AyayaLeague.exe` (*run it from a terminal if you want to read console.log outputs*)

### From source code

1. Clone the repo `git clone https://github.com/botkalista/ayaya-league-external.git`

2. Install Node.js 32bit v16.10.0
	
	Download for Windows: https://nodejs.org/dist/v16.10.0/node-v16.10.0-x86.msi
	
	Download for other OS: https://nodejs.org/fa/blog/release/v16.10.0/
	
3. Install windows build tools if you don't have them `npm install --g --production windows-build-tools`

4. Run `npm run check-dependencies` to check that everything is ok and automatically build packages

5. Enter into a league game (must be `windowed` or `no borders`)

6. Run `npm start`

7. Enjoy :3


# Set game settings

To use correctly the script you must adjust some settings inside League.
- Set screen mode to `no borders`
- Set *Player Move Click* to **U** inside *Settings > Shortcuts -> Player Movement*
- Set *Player Attack Only* to **I** inside *Settings > Shortcuts -> Player Movement*


# User Scripts

Every user script is located into: `/scripts/userscripts/` (on prebuilt version `/resources/app/scripts/userscripts/`)

AyayaLeague comes with 2 default UserScripts called `SimpleEvade.js` and `Orbwalker.js`.

## How to write a script

1. Create your script file inside the `/scripts/userscripts/` folder and call it `_yourscriptname_.js`

2. Write a [`setup`](#setup) function to manage initialization
    ```js
    function setup() {
      console.log('Script is loaded');
    }
    ```
3. Write a [`onTick`](#ontick) function to execute actions every tick. It accepts 2 arguments: [`manager`](#userscriptmanager) and `ticks`.
    ```js
    function onTick(manager, ticks) {
      if (manager.me.spells[3].ready == true) {
        console.log('R is up');
      }
    }
    ```
4. Write a [`onMissileCreate`](#onmissilecreate) function to execute actions every time a new missile is created
    ```js
    function onMissileCreate(missile, manager) {
      if (missile.isAutoAttack) console.log('Auto attack missile created');
      if (missile.isTurretShot) console.log('Turret shot missile created');
    }
    ```
    
5. Optionally you can add the JSDoc before the functions to get intellisense inside visual studio code
    ```js
    
    /**
    * @param {import("../UserScriptManager").UserScriptManager} manager
    * @param {number} ticks Ticks counter
    **/
    function onTick(manager, ticks) {
      if (manager.me.spells[3].ready == true) {
        console.log('R is up');
      }
    }
    
    /**
    * @param {import("../../src/models/Missile").Missile} missile
    * @param {import("../UserScriptManager").UserScriptManager} manager
    **/
    function onMissileCreate(missile, manager) {
      if (missile.isAutoAttack) console.log('Auto attack missile created');
      if (missile.isTurretShot) console.log('Turret shot missile created');
    }
    
    ```
6. Export the functions we just created
    ```js
    module.exports = { setup, onTick, onMissileCreate }
    ```
7. Start AyayaLeague (`npm run start`) and enjoy your script :3

## Script functions

### onTick

*onTick*(manager: [`UserScriptManager`](#userscriptmanager), ticks:number) - Called every tick. Used to execute actions inside user scripts.

### setup

*setup*() - Called at script load. Used to initialize the script.

### onMissileCreate

*onMissileCreate*(missile: [`Missile`](#missile), manager: [`UserScriptManager`](#userscriptmanager)) - Called every time a new missile is created


## UserScriptManager

**How data is read**
*Every time a property is used it gets read from the game and cached for subsequent calls on the same tick.*
*The manager reads the game data only if a script use that specific piece of data*

**properties**

- *game* [`Game`](#game) - Get game informations and execute actions

- *me* [`Entity`](#entity) - Get local player

- *missiles* [`Missile`](#missile) - Get all missiles

- *monsters* [`Entity[]`](#entity) - Get all monsters

- *champions*:
	- *all* [`Entity[]`](#entity) - Get all champions
	- *allies* [`Entity[]`](#entity) - Get allied champions
	- *enemies* [`Entity[]`](#entity) - Get enemy champions

- *turrets*:
	- *all* [`Entity[]`](#entity) - Get all turrets
	- *allies* [`Entity[]`](#entity) - Get allied turrets
	- *enemies* [`Entity[]`](#entity) - Get enemy turrets

- *minions*: 
	- *all* [`Entity[]`](#entity) - Get all minions
	- *allies* [`Entity[]`](#entity) - Get allied minions
	- *enemies* [`Entity[]`](#entity) - Get enemy minions

**methods**

- *checkCollision*(target:[`Entity`](#entity), missile:[`Missile`](#missile)): [`CollisionResult`](#collisionresult) - Checks the collision between target and missile

# Models

## Entity

**properties**

- *netId* `number` - Entity network identifier

- *name* `string` - Entity name

- *gamePos* [`Vector3`](#vector3) - Entity position relative to the game map

- *screenPos* [`Vector3`](#vector3) - Entity position relative to the screen

- *hp* `number` - Entity current health points

- *maxHp* `number` - Entity max health points

- *visible* `boolean` - True if the entity is outside fog of war

- *range* `number` - Entity attack range 

- *team* `number` - Entity team identifier (`100` = Team1, `200` = Neutral, `300` = Team2)

- *spells* [`Spell[]`](#spell) - Entity spells

- *AiManager* [`AiManager`](#aimanager) - Used to check player movement

- *satHitbox* - Used internally to check collisions

## Spell

**properties**

- *name* `string` - Spell name

- *readyAt* `number` - Timestamp when the spell will be ready

- *level* `number` - Spell level (*always 1 for summoner spells*)

- *ready* `boolean` - True if the spell is not on cooldown

- *readyIn* `boolean` - Seconds to wait before the spell is ready

## Missile

**properties**

- *gameStartPos* [`Vector3`](#vector3) - Missile start position relative to the game map

- *gameEndPos* [`Vector3`](#vector3) - Missile end position relative to the game map

- *screenStartPos* [`Vector3`](#vector3) - Missile start position relative to the screen

- *screenEndPos* [`Vector3`](#vector3) - Missile end position relative to the screen

- *team* `number` - Missile team identifier (`100` = Team1, `200` = Neutral, `300` = Team2)

- *isBasicAttack* `boolean` - True if the missile is a basic attack

- *isTurretAttack* `boolean` - True if the missile is a turret shot

- *isMinionAttack* `boolean` - True if the missile is a minion attack

- *spellName* `string` - Name of the spell that created the missile

- *satHitbox* - Used internally to check collisions


## AiManager

**properties**

- *startPath*  [`Vector3`](#vector3)  - Start position of the player movement

- *endPath*  [`Vector3`](#vector3)  - End position of the player movement

- *isDashing*  `boolean`  - True if the entity is dashing

- *isMoving*  `boolean`  - True if the entity is moving

- *dashSpeed*  `number`  - Speed of the dash

## CollisionResult

**properties**

- *result* `boolean` - True if there is a collision

- *evadeAt* [`Vector3`](#vector3) - Screen position to move the player in order to dodge the missile

## Game

**properties**

- *time* `number` - get seconds passed after game start

**methods**

- *issueOrder*(pos:[`Vector2`](#vector2), isAttack:`boolean`, delay?:`boolean`): `void` - Moves the player to `pos` position. If isAttack is true attacks at `pos` position.
<br> **NOTE**: You must set PlayerMoveClick to **U** and PlayerAttackOnly to **I**. [**Read more here**](#set-game-settings)

- *isKeyPressed*(key:`number`): `boolean` - Return true if the key is pressed. You can get the key numbers [**here**](https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes)

## Vector2

**properties**

- *x* `number` - x

- *y* `number` - y


**methods**

- *copy*: [`Vector2`](#vector2) - Returns a copy of the vector

- *getFlat*: [`Vector2`](#vector2) - Returns a copy of the vector with x, y as `integer` (instead of `float`)

- *mult*(x: `number`, y:`number`): [`Vector2`](#vector2)  - Returns a copy of the vector with his x, y multiplied by `x`, `y`

- `static` *zero*: [`Vector2`](#vector2)  - Returns a vector with x=0 y=0

-  `static` *fromVector*(v: [`Vector2`](#vector2)): [`Vector2`](#vector2)  - Returns a copy of the vector `v`

-  `static` *fromData*(x: `number`, y: `number`): [`Vector2`](#vector2)  - Returns a vector with x=`x` y=`y` 


## Vector3

**properties**

- *x* `number` - x

- *y* `number` - y

- *z* `number` - z


**methods**

- *copy*: [`Vector3`](#vector3) - Returns a copy of the vector

- *getFlat*: [`Vector3`](#vector3) - Returns a copy of the vector with x, y, z as `integer` (instead of `float`)

- *mult*(x: `number`, y:`number`, z:`number`): [`Vector3`](#vector3)  - Returns a copy of the vector with his x, y, z multiplied by `x`, `y`, `z`

- `static` *zero*: [`Vector3`](#vector3)  - returns a vector with x=0 y=0 z=0

-  `static` *fromVector*(v: [`Vector3`](#vector3)): [`Vector3`](#vector3)  - Returns a copy of the vector `v`

-  `static` *fromData*(x: `number`, y: `number`, z: `number`): [`Vector3`](#vector3)  - Returns a vector with x=`x` y=`y` z=`z`



# vFAQ (_very Frequently Asked Questions_)

1. ### Why nodejs ? it's slow.
	Fuck you. It's fast enough.
	


# TODO

- Add width and height of missiles
- Use better serialization for settings


# Media

> Simple evade `SimpleEvade.js`

https://user-images.githubusercontent.com/42075940/183254354-5bea1c30-d41c-409f-a1b6-531f8d0929f9.mp4

> Cooldown tracker

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/cooldown_tracker.png?raw=true"></img>


> Settings window

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/settings_window.png?raw=true"></img>

> UserScript example

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/user_scripts.png?raw=true"></img>

