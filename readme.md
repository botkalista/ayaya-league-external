<div align="center">
<h1>AyayaLeague</h1>
</div>

<div align="center">
<img src="https://user-images.githubusercontent.com/42075940/184498428-f34f09e9-21c5-4a6e-a284-7e9cccad15b5.jpg" alt="AyayaLeagueLogo" width="512">

**EVERYTHING CAN CHANGE AT ANY TIME SINCE THIS IS STILL AN ALPHA VERSION**

![GitHub last commit](https://img.shields.io/github/last-commit/botkalista/ayaya-league-external)

</div>



## WHY THE CIRCLES ARE LAGGING IN GAME ?

You should set the readTime from the settings window to a lower value and click update
(_That's the number of ms to wait for each tick_)

![read_time](https://user-images.githubusercontent.com/42075940/183614940-c5f882d6-93a6-4f81-97ed-2c28f1e84dd2.png)

## What's AyayaLeague ?

AyayaLeague is an external script platform written in nodejs that supports custom user scripts.

# Features

- Show player attack range
- Show enemy champions attack range
- Show enemy champions summoner spells cooldown
- Settings window [CTRL + SPACE] (shortcut sometimes doesn't word while League is focused)
- Show enemy champions ultimate cooldown
- Show missiles (fixed length for now)
- Custom user scripts (Read more [here](#user-scripts))

## How to setup and run

### Prebuilt version

1. Download prebuilt version of AyayaLeague [**HERE**](https://github.com/botkalista/ayaya-league-external/releases)

2. Extract the folder content

3. Run `AyayaLeague.exe` as Administrator (_run it from a terminal if you want to read console.log outputs_)

### From source code

1. Clone the repo `git clone https://github.com/botkalista/ayaya-league-external.git`

2. Install Node.js 32bit v16.10.0

   Download for Windows: https://nodejs.org/dist/v16.10.0/node-v16.10.0-x86.msi

   Download for other OS: https://nodejs.org/fa/blog/release/v16.10.0/

3. Install windows build tools if you don't have them `npm install --g --production windows-build-tools`

4. Run `npm run check-dependencies` to check that everything is ok and automatically build packages

5. Enter into a league game (must be `windowed` or `no borders`)

6. Run `npm start` from a terminal with Administrator privileges

7. Enjoy :3

# Set game settings

To use correctly the script you must adjust some settings inside League.

- Set screen mode to `no borders`
- Set _Player Move Click_ to **U** inside _Settings > Shortcuts -> Player Movement_
- Set _Player Attack Only_ to **I** inside _Settings > Shortcuts -> Player Movement_

# User Scripts

Every user script is located into: `/scripts/userscripts/` (on prebuilt version `/resources/app/scripts/userscripts/`)

AyayaLeague comes with 2 default UserScripts called `SimpleEvade.js` and `Orbwalker.js`.

## How to write a script

1. Create your script file inside the `/scripts/userscripts/` folder and call it `_yourscriptname_.js`

2. Write a [`setup`](#setup) function to manage initialization
   ```js
   function setup() {
     console.log("Script is loaded");
   }
   ```
3. Write a [`onTick`](#ontick) function to execute actions every tick. It accepts 2 arguments: [`manager`](#userscriptmanager) and `ticks`.
   ```js
   function onTick(manager, ticks) {
     if (manager.me.spells[3].ready == true) {
       console.log("R is up");
     }
   }
   ```
4. Write a [`onMissileCreate`](#onmissilecreate) function to execute actions every time a new missile is created
   ```js
   function onMissileCreate(missile, manager) {
     if (missile.isAutoAttack) console.log("Auto attack missile created");
     if (missile.isTurretShot) console.log("Turret shot missile created");
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
       console.log("R is up");
     }
   }

   /**
    * @param {import("../../src/models/Missile").Missile} missile
    * @param {import("../UserScriptManager").UserScriptManager} manager
    **/
   function onMissileCreate(missile, manager) {
     if (missile.isAutoAttack) console.log("Auto attack missile created");
     if (missile.isTurretShot) console.log("Turret shot missile created");
   }
   ```

6. Export the functions we just created
   ```js
   module.exports = { setup, onTick, onMissileCreate };
   ```
7. Start AyayaLeague (`npm run start`) and enjoy your script :3

## Script functions

### onTick

_onTick_(manager: [`UserScriptManager`](#userscriptmanager), ticks:number) - Called every tick. Used to execute actions inside user scripts.

### setup

_setup_() - Called at script load. Used to initialize the script.

### onMissileCreate

_onMissileCreate_(missile: [`Missile`](#missile), manager: [`UserScriptManager`](#userscriptmanager)) - Called every time a new missile is created

### onMoveCreate

_onMoveCreate_(player: [`Entity`](#entity), manager: [`UserScriptManager`](#userscriptmanager)) - Called every an enemy clicks to move

### _onDraw_

**onDraw**(ctx: [`DrawContext`](#drawcontext), manager: [`UserScriptManager`](#userscriptmanager)) - Called every frame (16ms at 60fps)

## UserScriptManager

**How data is read**
_Every time a property is used it gets read from the game and cached for subsequent calls on the same tick._
_The manager reads the game data only if a script use that specific piece of data_

**properties**

- _spellSlot_: `SpellSlot` - Enum of game key codes

- _game_ [`Game`](#game) - Get game informations and execute actions

- _playerState_ [`PlayerState`](#playerstate) - Get player state

- _me_ [`Entity`](#entity) - Get local player

- _missiles_ [`Missile`](#missile) - Get all missiles

- _monsters_ [`Entity[]`](#entity) - Get all monsters

- _champions_:

  - _all_ [`Entity[]`](#entity) - Get all champions
  - _allies_ [`Entity[]`](#entity) - Get allied champions
  - _enemies_ [`Entity[]`](#entity) - Get enemy champions

- _turrets_:

  - _all_ [`Entity[]`](#entity) - Get all turrets
  - _allies_ [`Entity[]`](#entity) - Get allied turrets
  - _enemies_ [`Entity[]`](#entity) - Get enemy turrets

- _minions_:
  - _all_ [`Entity[]`](#entity) - Get all minions
  - _allies_ [`Entity[]`](#entity) - Get allied minions
  - _enemies_ [`Entity[]`](#entity) - Get enemy minions

**methods**

- _checkCollision_(target:[`Entity`](#entity), missile:[`Missile`](#missile)): [`CollisionResult`](#collisionresult) - Checks the collision between target and missile

- _worldToScreen_(pos:[`Vector3`](#vector3)): `Vector2` - Return `pos` converted to screen position

- _setPlayerState_(state: [`PlayerState`](#playerstate)) - Set the player state

## DrawContext

- *line*(p1: [`Vector2`](#vector2), p2: [`Vector2`](#vector2), color?: `number`, thickness?: `number`) - Draw a line from `p1` to `p2` with color `color` and thickness `thickness`

- *linePoints*(x1: `number`, y1: `number`, x2: `number`, y2: `number`, color?: `number`, thickness?: `number`) - Draw a line from `x1` `y1` to `x2` `y2` with color `color` and thickness `thickness`

- *circle*(c: [`Vector3`](#vector3), r: `number`, points?: `number`, color?: `number`, thickness?: `number`) - Draw a circle at `c` of `r` radius with color `color` and thickness `thickness`. It automatically transform the circle from game coordinates to screen coordinates using `points` points to rappresent it

# Models

## Entity

**properties**

- _netId_ `number` - Entity network identifier

- _name_ `string` - Entity name

- _gamePos_ [`Vector3`](#vector3) - Entity position relative to the game map

- _screenPos_ [`Vector3`](#vector3) - Entity position relative to the screen

- _hp_ `number` - Entity current health points

- _maxHp_ `number` - Entity max health points

- _visible_ `boolean` - True if the entity is outside fog of war

- _dead_ `boolean` - True if the entity is dead

- _range_ `number` - Entity attack range

- _team_ `number` - Entity team identifier (`100` = Team1, `200` = Neutral, `300` = Team2)

- _spells_ [`Spell[]`](#spell) - Entity spells

- _AiManager_ [`AiManager`](#aimanager) - Used to check player movement

- _satHitbox_ - Used internally to check collisions

## Spell

**properties**

- _name_ `string` - Spell name

- _readyAt_ `number` - Timestamp when the spell will be ready

- _level_ `number` - Spell level (_always 1 for summoner spells_)

- _ready_ `boolean` - True if the spell is not on cooldown

- _readyIn_ `boolean` - Seconds to wait before the spell is ready

## Missile

**properties**

- _gameStartPos_ [`Vector3`](#vector3) - Missile start position relative to the game map

- _gameEndPos_ [`Vector3`](#vector3) - Missile end position relative to the game map

- _screenStartPos_ [`Vector3`](#vector3) - Missile start position relative to the screen

- _screenEndPos_ [`Vector3`](#vector3) - Missile end position relative to the screen

- _team_ `number` - Missile team identifier (`100` = Team1, `200` = Neutral, `300` = Team2)

- _isBasicAttack_ `boolean` - True if the missile is a basic attack

- _isTurretAttack_ `boolean` - True if the missile is a turret shot

- _isMinionAttack_ `boolean` - True if the missile is a minion attack

- _spellName_ `string` - Name of the spell that created the missile

- _satHitbox_ - Used internally to check collisions

## AiManager

**properties**

- _startPath_ [`Vector3`](#vector3) - Start position of the player movement

- _endPath_ [`Vector3`](#vector3) - End position of the player movement

- _isDashing_ `boolean` - True if the entity is dashing

- _isMoving_ `boolean` - True if the entity is moving

- _dashSpeed_ `number` - Speed of the dash

## CollisionResult

**properties**

- _result_ `boolean` - True if there is a collision

- _evadeAt_ [`Vector3`](#vector3) - Screen position to move the player in order to dodge the missile

## Game

**properties**

- _time_ `number` - get seconds passed after game start

**methods**

- _issueOrder_(pos:[`Vector2`](#vector2), isAttack:`boolean`, delay?:`boolean`): `void` - Moves the player to `pos` position. If isAttack is true attacks at `pos` position.
  <br> **NOTE**: You must set PlayerMoveClick to **U** and PlayerAttackOnly to **I**. [**Read more here**](#set-game-settings)

- _castSpell_(slot:`number`, pos1?:[`Vector2`](#vector2), pos2?: [`Vector2`](#vector2), selfCast?:`boolean`): `void` - Cast the spell `slot` at `pos1` if provided to `pos2` if provided.<br>Self cast the spell if `selfCast` is true.<br>Use `pos2` for spells like Viktor Q or Viego W.<br>You can use `spellSlot` of [UserScriptManager](#userscriptmanager) for `slot`

- _isKeyPressed_(key:`number`): `boolean` - Return true if the key is pressed.<br>You can get the key numbers [**here**](https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes)

- _pressKey_(key:`number`): `void`- Press the key `key`.<br>You can use `spellSlot` of [UserScriptManager](#userscriptmanager).<br>(Ex: `manager.spellSlot.Q`)

- _release_(key:`number`): `void`- Release the key `key`.<br>You can use `spellSlot` of [UserScriptManager](#userscriptmanager).<br>(Ex: `manager.spellSlot.Q`)

- _getMousePos_(): [`Vector2`](#vector2) - Return the mouse position

- _setMousePos_(x:`number`, y:`number`): `void` - Set the mouse position to `x`, `y`

- _blockInput_(value:`boolean`) - If true blocks user input (keyboard+mouse), if false unlocks it.

- _sleep_(ms:`number`) - Wait `ms` milliseconds synchronously

## Vector2

**properties**

- _x_ `number` - x

- _y_ `number` - y

**methods**

- _copy_(): [`Vector2`](#vector2) - Returns a copy of the vector

- _getFlat_(): [`Vector2`](#vector2) - Returns a copy of the vector with x, y as `integer` (instead of `float`)

- _isEqual_(vec: [`Vector2`](#vector2)): [`Vector2`](#vector2) - Returns true if vectors have the same `x`, `y`

- _mult_(x: `number`, y:`number`): [`Vector2`](#vector2) - Returns a copy of the vector with his x, y multiplied by `x`, `y`

- `static` _zero_(): [`Vector2`](#vector2) - Returns a vector with x=0 y=0

- `static` _fromVector_(v: [`Vector2`](#vector2)): [`Vector2`](#vector2) - Returns a copy of the vector `v`

- `static` _fromData_(x: `number`, y: `number`): [`Vector2`](#vector2) - Returns a vector with x=`x` y=`y`

## Vector3

**properties**

- _x_ `number` - x

- _y_ `number` - y

- _z_ `number` - z

**methods**

- _copy_(): [`Vector3`](#vector3) - Returns a copy of the vector

- _getFlat_(): [`Vector3`](#vector3) - Returns a copy of the vector with x, y, z as `integer` (instead of `float`)

- _isEqual_:(vec: [`Vector3`](#vector3)): [`Vector3`](#vector3) - Returns true if vectors have the same `x`, `y`, `z`

- _mult_(x: `number`, y:`number`, z:`number`): [`Vector3`](#vector3) - Returns a copy of the vector with his x, y, z multiplied by `x`, `y`, `z`

- `static` _zero_(): [`Vector3`](#vector3) - returns a vector with x=0 y=0 z=0

- `static` _fromVector_(v: [`Vector3`](#vector3)): [`Vector3`](#vector3) - Returns a copy of the vector `v`

- `static` _fromData_(x: `number`, y: `number`, z: `number`): [`Vector3`](#vector3) - Returns a vector with x=`x` y=`y` z=`z`

# Enums

## PlayerState

- `isCasting`
- `isMoving`
- `isAttacking`
- `isEvading`
- `isCharging`
- `isChanneling`
- `idle`

# vFAQ (_very Frequently Asked Questions_)

1. ### Why nodejs ? it's slow.
   Fuck you. It's fast enough.

# TODO

- Add width and height of missiles
- Use better serialization for settings

# Media

> Simple evade `SimpleEvade.js`

https://user-images.githubusercontent.com/42075940/183254354-5bea1c30-d41c-409f-a1b6-531f8d0929f9.mp4

> Orbwalker Test 1

https://user-images.githubusercontent.com/42075940/183676759-d1983937-f293-430f-adfd-15319d4626ab.mp4

> Orbwalker Test 2

https://user-images.githubusercontent.com/42075940/183676793-7bb93d23-a154-4641-a5d5-dd504b8d6bca.mp4

> Orbwalker Test 3

https://user-images.githubusercontent.com/42075940/183676831-09139271-4fa7-4564-ad05-5185b04ba860.mp4

> Cooldown tracker

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/cooldown_tracker.png?raw=true"></img>

> Settings window

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/settings_window.png?raw=true"></img>

> UserScript example

<img src="https://github.com/botkalista/ayaya-league-external/blob/master/media/user_scripts.png?raw=true"></img>
