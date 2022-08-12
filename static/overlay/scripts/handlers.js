
function addHandlars() {
    // ----- Screen size -----
    ipcRenderer.on('dataScreenSize', function (evt, message) {
        const data = JSON.parse(message);
        resizeCanvas(data.x, data.y);
    });
    ipcRenderer.send('requestScreenSize');


    // ----- Settings -----
    
    // ipcRenderer.on('dataSettings', function (evt, message) {
    //     const data = JSON.parse(message);
    //     console.log('gotsettings', data)
    //     settings = data;
    // });
    // ipcRenderer.send('requestSettings');
    
    ipcRenderer.on('dataBaseSettings', function (evt, message) {
        const data = JSON.parse(message);
        console.log('gotbasesettings', data)
        baseSettings = data;
    });

    // ----- Game data -----
    ipcRenderer.on('gameData', function (evt, message) {
        const data = JSON.parse(message);
        gameData = data;
    });
}
