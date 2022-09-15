function _draw_textAt(str, x, y, size, color) {
    textSize(size);
    noStroke();
    fill(color);
    text(str, x, y);
}

function _draw_circleAt(x, y, size, color) {
    noFill();
    stroke(color);
    ellipse(x, y, size, size);
}

function _draw_imageAt(url, x, y, width, height) {
    if (!assetsManager) return;
    const img = assetsManager.getAsset(url);
    if (!img) return;
    noFill();
    noStroke();
    image(img, x, y, width, height);
}

function _draw_circle3D(points, weight, color) {
    noFill();
    stroke(color);
    strokeWeight(weight);
    for (let i = 0; i < points.length; i++) {
        line(points[i][0].x, points[i][0].y, points[i][1].x, points[i][1].y);
    }
}

function _draw_lineAt(x1, y1, x2, y2, weight, color) {
    noFill();
    stroke(color);
    strokeWeight(weight);
    line(x1, y1, x2, y2)
}