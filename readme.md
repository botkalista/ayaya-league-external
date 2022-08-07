

# AyayaLeague [_ayaya-league-external_]

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

1. Clone the repo `git clone https://github.com/botkalista/ayaya-league-external.git`

2. Install Node.js 32bit v16.10.0
	
	Download for Windows: https://nodejs.org/dist/v16.10.0/node-v16.10.0-x86.msi
	
	Download for other OS: https://nodejs.org/fa/blog/release/v16.10.0/
	
3. Install windows build tools if you don't have them `npm install --g --production windows-build-tools`

4. Run `npm i` and `npm run rebuild-deps`

5. Enter into a league game (must be `windowed` or `no borders`)

6. Run `npm run execute`

7. Enjoy :3


# User Scripts

Every user script is located into: `/scripts/userscripts/`

AyayaLeague comes with a default UserScript called `SimpleEvade.js`.

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
7. Start AyayaLeague (`npm run execute`) and enjoy your script :3

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

- *game* [`Game`](#game) - get game informations

- *mouse* [`Mouse`](#mouse) - execute mouse actions

- *me* [`Entity`](#entity) - get local player

- *missiles* [`Missile`](#missile) - get all missiles

- *monsters* [`Entity[]`](#entity) - get all monsters

- *champions*:
	- *all* [`Entity[]`](#entity) - get all champions
	- *allies* [`Entity[]`](#entity) - get allied champions
	- *enemies* [`Entity[]`](#entity) - get enemy champions

- *turrets*:
	- *all* [`Entity[]`](#entity) - get all turrets
	- *allies* [`Entity[]`](#entity) - get allied turrets
	- *enemies* [`Entity[]`](#entity) - get enemy turrets

- *minions*: 
	- *all* [`Entity[]`](#entity) - get all minions
	- *allies* [`Entity[]`](#entity) - get allied minions
	- *enemies* [`Entity[]`](#entity) - get enemy minions

**methods**

- *checkCollision*(target:[`Entity`](#entity), missile:[`Missile`](#missile)): [`CollisionResult`](#collisionresult) - checks the collision between target and missile

# Models

## Entity

**properties**

- *netId* `number` - entity network identifier

- *name* `string` - entity name

- *gamePos* [`Vector3`](#vector3) - entity position relative to the game map

- *screenPos* [`Vector3`](#vector3) - entity position relative to the screen

- *hp* `number` - entity current health points

- *maxHp* `number` - entity max health points

- *visible* `boolean` - true if the entity is outside fog of war

- *range* `number` - entity attack range 

- *team* `number` - entity team identifier (`100` = Team1, `200` = Neutral, `300` = Team2)

- *spells* [`Spell[]`](#spell) - entity spells

- *AiManager* [`AiManager`](#aimanager) - used to check player movement

- *satHitbox* - Used internally to check collisions

## Spell

**properties**

- *name* `string` - spell name

- *readyAt* `number` - timestamp when the spell will be ready

- *level* `number` - spell level (*always 1 for summoner spells*)

- *ready* `boolean` - true if the spell is not on cooldown

- *readyIn* `boolean` - seconds to wait before the spell is ready

## Missile

**properties**

- *gameStartPos* [`Vector3`](#vector3) - missile start position relative to the game map

- *gameEndPos* [`Vector3`](#vector3) - missile end position relative to the game map

- *screenStartPos* [`Vector3`](#vector3) - missile start position relative to the screen

- *screenEndPos* [`Vector3`](#vector3) - missile end position relative to the screen

- *isBasicAttack* `boolean` - true if the missile is a basic attack

- *isTurretAttack* `boolean` - true if the missile is a turret shot

- *isMinionAttack* `boolean` - true if the missile is a minion attack

- *spellName* `string` - name of the spell that created the missile

- *satHitbox* - Used internally to check collisions


## AiManager

**properties**

- *startPath*  [`Vector3`](#vector3)  - start position of the player movement

- *endPath*  [`Vector3`](#vector3)  - end position of the player movement

- *isDashing*  `boolean`  - true if the entity is dashing

- *isMoving*  `boolean`  - true if the entity is moving

- *dashSpeed*  `number`  - speed of the dash

## CollisionResult

**properties**

- *result* `boolean` - true if there is a collision

- *evadeAt* [`Vector3`](#vector3) - screen position to move the player in order to dodge the missile

## Game

**properties**

- *time* `number` - get seconds passed after game start

**methods**

- *issueOrder*(pos:[`Vector2`](#vector2), isAttack:`boolean`, delay?:`boolean`): `Promise<void>` - Clicks the right mouse button at `pos` or Clicks `a` button to `pos`. `delay` is the number of ms to wait between mouseup and mousedown.

## Vector2

**properties**

- *x* `number` - x

- *y* `number` - y


**methods**

- *copy*: [`Vector2`](#vector2) - returns a copy of the vector

- *getFlat*: [`Vector2`](#vector2) - returns a copy of the vector with x, y as `integer` (instead of `float`)

- *mult*(x: `number`, y:`number`): [`Vector2`](#vector2)  - returns a copy of the vector with his x, y multiplied by `x`, `y`

- `static` *zero*: [`Vector2`](#vector2)  - returns a vector with x=0 y=0

-  `static` *fromVector*(v: [`Vector2`](#vector2)): [`Vector2`](#vector2)  - returns a copy of the vector `v`

-  `static` *fromData*(x: `number`, y: `number`): [`Vector2`](#vector2)  - returns a vector with x=`x` y=`y` 


## Vector3

**properties**

- *x* `number` - x

- *y* `number` - y

- *z* `number` - z


**methods**

- *copy*: [`Vector3`](#vector3) - returns a copy of the vector

- *getFlat*: [`Vector3`](#vector3) - returns a copy of the vector with x, y, z as `integer` (instead of `float`)

- *mult*(x: `number`, y:`number`, z:`number`): [`Vector3`](#vector3)  - returns a copy of the vector with his x, y, z multiplied by `x`, `y`, `z`

- `static` *zero*: [`Vector3`](#vector3)  - returns a vector with x=0 y=0 z=0

-  `static` *fromVector*(v: [`Vector3`](#vector3)): [`Vector3`](#vector3)  - returns a copy of the vector `v`

-  `static` *fromData*(x: `number`, y: `number`, z: `number`): [`Vector3`](#vector3)  - returns a vector with x=`x` y=`y` z=`z`



# vFAQ (_very Frequently Asked Questions_)

1. ### Why nodejs ? it's slow.
	Fuck you. It's fast enough.
	


# TODO

- Add width and height of missiles
- Use better serialization for settings
- Add keyboard automation
- Add script manager to load/unload the script



# Media

> Simple evade `SimpleEvade.js`

https://user-images.githubusercontent.com/42075940/183254354-5bea1c30-d41c-409f-a1b6-531f8d0929f9.mp4

> Cooldown tracker

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/cooldown_tracker.png?raw=true"></img>


> Settings window

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/settings_window.png?raw=true"></img>

> UserScript example

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/user_scripts.png?raw=true"></img>

