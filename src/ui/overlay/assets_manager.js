
function assets_manager_scoped() {
    const assets = {};
    function getAsset(url) {
        const target = assets[url];
        if (!target) return downloadAsset(url);
        return assets[url];
    }
    function downloadAsset(url) {
        assets[url] = loadImage(url);
    }
    return { getAsset, downloadAsset }
}