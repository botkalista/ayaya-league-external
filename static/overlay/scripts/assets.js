

function getChampionImage(name) {
    if (assets[name]) return assets[name];
    const img = createImg(`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${name}.png`, name);
    img.hide();
    assets[name] = img;
}

function getSpellImage(name) {
    if (assets[name]) return assets[name];
    const img = createImg(`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/${name}.png`, name);
    img.hide();
    assets[name] = img;
}

function getRemoteImage(path, key) {
    if (assets[`remote_${key}`]) return assets[`remote_${key}`];
    const img = createImg(path, key);
    img.hide();
    assets[`remote_${key}`] = img;
}