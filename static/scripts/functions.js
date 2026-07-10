
function mouseToCanvas(event) {
    return [
        (event.clientX - canvasBoundingRect.left) / zoom,
        (event.clientY - canvasBoundingRect.top) / zoom
    ];
}

function adjustPointByZoom(zoomFactor, x, y) {
    return [x * zoomFactor, y * zoomFactor];
}

function coordsRef(objRect, x, y) {
    return [x - objRect.left, y - objRect.top];
}

function coordsBox(objBox, x, y) {
    return [x - objBox[0], y - objBox[1]];
}

function boundingBoxDiff(b1, b2) {
    let xDiff = b2[0] - b1[0];
    let yDiff = b2[1] - b1[1];

    return [-xDiff, -yDiff];
}

function updateBox(polyPoint) {
    let polyXvals = polyPoint.map(p => p[0]);
    let polyYvals = polyPoint.map(p => p[1]);

    let minX = Math.min(...polyXvals);
    let minY = Math.min(...polyYvals);
    let maxX = Math.max(...polyXvals);
    let maxY = Math.max(...polyYvals);

    let width = maxX - minX;
    let height = maxY - minY;

    return [minX, minY, width, height];
}

function updateRectBoxByPoint(box, pointIndex, x, y, shift = false) {
    let minX = box[0];
    let minY = box[1];
    let maxX = box[0] + box[2];
    let maxY = box[1] + box[3];

    switch (pointIndex) {
        case 0:
            minX = x;
            minY = y;
            break;
        case 1:
            maxX = x;
            minY = y;
            break;
        case 2:
            minX = x;
            maxY = y;
            break;
        case 3:
            maxX = x;
            maxY = y;
            break;
    }

    let width = maxX - minX;
    let height = maxY - minY;

    if (shift) {
        const size = Math.max(Math.abs(width), Math.abs(height));

        width = Math.sign(width) * size;
        height = Math.sign(width) * size;

        switch (pointIndex) {
            case 0:
                minX = maxX - width;
                minY = maxY - height;
                break;
            case 1:
                minY = maxY - height;
                break;
            case 2:
                minX = maxX - width;
                break;
            case 3:
                maxY = minY + height;
                break;
        }
    }

    return [minX, minY, width, height];
}

function pointInElement(x, y, el) {
    const rect = el.getBoundingClientRect();

    return (
        x >= rect.left &&
        x <= rect.left + rect.width &&
        y >= rect.top &&
        y <= rect.top + rect.height
    );
}
