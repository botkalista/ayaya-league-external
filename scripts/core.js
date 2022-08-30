


function setup() {
    console.log('Core loaded');
}

function onTick() {

}

function onDraw() {
    ctx.textAt('Test', 200, 200, 20, 255);
}


register({ setup, onTick, onDraw });






