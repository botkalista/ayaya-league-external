function __internal_worldToScreen(pos, screenSize, viewProjMatrix) {
    const out = { x: 0, y: 0 }
    const screen = { x: screenSize.x, y: screenSize.y };
    const clipCoords = { x: 0, y: 0, z: 0, w: 0 }
    clipCoords.x = pos.x * viewProjMatrix[0] + pos.y * viewProjMatrix[4] + pos.z * viewProjMatrix[8] + viewProjMatrix[12];
    clipCoords.y = pos.x * viewProjMatrix[1] + pos.y * viewProjMatrix[5] + pos.z * viewProjMatrix[9] + viewProjMatrix[13];
    clipCoords.z = pos.x * viewProjMatrix[2] + pos.y * viewProjMatrix[6] + pos.z * viewProjMatrix[10] + viewProjMatrix[14];
    clipCoords.w = pos.x * viewProjMatrix[3] + pos.y * viewProjMatrix[7] + pos.z * viewProjMatrix[11] + viewProjMatrix[15];
    if (clipCoords.w < 1.0) clipCoords.w = 1;
    const m = { x: 0, y: 0, z: 0 };
    m.x = clipCoords.x / clipCoords.w;
    m.y = clipCoords.y / clipCoords.w;
    m.z = clipCoords.z / clipCoords.w;
    out.x = (screen.x / 2 * m.x) + (m.x + screen.x / 2);
    out.y = -(screen.y / 2 * m.y) + (m.y + screen.y / 2);
    return out;
}
function __internal_getCircle3D(pos, points, radius, screenSize, viewProjMatrixArg) {

    const p = Math.PI * 2 / points;
    const result = []

    for (let a = 0; a < Math.PI * 2; a += p) {
        const start = {
            x: radius * Math.cos(a) + pos.x,
            y: radius * Math.sin(a) + pos.z,
            z: pos.y
        }
        const end = {
            x: radius * Math.cos(a + p) + pos.x,
            y: radius * Math.sin(a + p) + pos.z,
            z: pos.y
        }
        const start2 = { x: start.x, y: start.z, z: start.y }
        const end2 = { x: end.x, y: end.z, z: end.y }
        const startScreen = __internal_worldToScreen(start2, screenSize, viewProjMatrixArg);
        const endScreen = __internal_worldToScreen(end2, screenSize, viewProjMatrixArg);
        result.push([startScreen, endScreen]);
    }

    return result;

}