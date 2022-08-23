
// This is the setup function,
// where we initialize the script
function setup() {

    // A console.log to check if the script
    // is correctly loaded
    console.log('SimpleEvade.js loaded.')

    // Creating the settings for the script
    // that will appear in the settings window
    const settings = [
        { type: 'check', default: false, text: 'Enabled' },
    ];

    // Setup function must return the settings
    // in order to use them
    return settings;
}


// This is the onMissileCreate function,
// where we execute an action on every missile creation
function onMissileCreate(missile, manager, settings) {
    // Checking if the script is enabled,
    // if it's not stop executing the function
    if (!settings[0].value) return;
    // Checking if the missile is a basic attack,
    // if it is stop executing the function
    if (missile.isBasicAttack) return;
    // Checking if the missile is a minion attack,
    // if it is stop executing the function
    if (missile.isMinionAttack) return;
    // Checking if the missile is a turret attack,
    // if it is stop executing the function
    if (missile.isTurretAttack) return;
    // Checking if the missile is created from an ally,
    // if it is stop executing the function
    if (missile.team == manager.me.team) return;

    // Check if the missille is colliding with the player
    const collision = manager
        .checkCollision(manager.me, missile);

    // If it's not colliding stop executing the function
    if (!collision.result) return;

    // If it's colliding get the closest position to dodge it
    const evadeAt = collision.evadeAt;

    // And tell the player to move in that position
    manager.game.issueOrder(evadeAt.flatten(), false);
    
}

// Export the functions we created
module.exports = { setup, onMissileCreate }
