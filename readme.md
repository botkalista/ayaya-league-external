


Examples for scripts:


- Calling function outside scope
To call functions outside the scope of current function (`onTick` in this case) you need to register it

```js
function test1() {
    console.log('Test1');
}

function onTick() {
    test1(); // Test1
}

register({ test1, onTick });
```

- Share data
To share data between scripts/functions you can use `manager.state`

```js
function onDraw() {
    console.log('My name is', manager.state.getState('me').name); // My name is Ashe
    console.log('num value is', manager.state.getState('num')); // num value is 123
}

function onTick() {
    manager.state.setState('me', manager.game.me);
    manager.state.setState('num', 123);
}

register({ test1, onTick });
```

- Show settings
To show settings you need to export them using `settings` function

```js
 settings(
    [
        { title: 'AyayaCore' },
        {
            group: [
                { id: 'show.player.range', type: 'toggle', text: 'Show Player Range', style: 1, value: false },
                { id: 'show.discord', type: 'toggle', text: 'Show Discord', style: 1, value: true },
                { id: 'test.slider', type: 'slider', text: 'Test slider', style: 1, value: 10, max: 100, min: 0, size: 1 },
                { id: 'test.text', type: 'text', text: 'Test text', value: 'Something' },
                { id: 'test.radio', type: 'radio', text: 'Test radio', value: 'Option A', options: ['Option A', 'Option B', 'Option C'] },
                { id: 'test.key', type: 'key', text: 'Test key', value: getVKEY("SPACEBAR") },
            ],
        },
        { desc: 'Ayaya core is a builtin script and it is NOT required for AyayaLeague to work' }
    ]
 );
```

- Get key from settings
To get the key value from settings you can use the `getKeyValue` function

```js
function onTick() {

    const settingValue = getSetting('test.key');
    const keyValue = getKeyValue(settingValue);
    console.log('test.key value is', keyValue); // test.key value is 32

}

settings([
    { title: 'Test' },
        {
            group: [
                { id: 'test.key', type: 'key', text: 'Test key', value: getVKEY("SPACEBAR") },
            ],
        },
        { desc: 'Just a test' }
    ]
    );
```