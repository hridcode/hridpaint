function updateStretchPointPositions(object) {
    if (isModeFree(object.type)) {
        for (let point in object.points) {
            let polyPoint = object.points[point];
            let stretchPoint = object.stretchPoints[point];

            let polyPointCanvas = coordsBox(object.bBox, ...polyPoint);

            stretchPoint.style.left = (polyPointCanvas[0] * zoom) + "px";
            stretchPoint.style.top = (polyPointCanvas[1] * zoom) + "px";
        }
    } else {
        object.stretchPoints[0].style.left = "0px";
        object.stretchPoints[0].style.top = "0px";

        object.stretchPoints[1].style.left = object.bBox[2] * zoom + "px";
        object.stretchPoints[1].style.top = "0px";

        object.stretchPoints[2].style.left = "0px";
        object.stretchPoints[2].style.top = object.bBox[3] * zoom + "px";

        object.stretchPoints[3].style.left = object.bBox[2] * zoom + "px";
        object.stretchPoints[3].style.top = object.bBox[3] * zoom + "px";
    }
}

function stretchPointPolyMousedown(event) {
    stretching = true;
    console.log("stretching");
    stretchObject = objects[+event.target.parentElement.getAttribute('object-id')];
    stretchPoint = +event.target.getAttribute('point-index');
    console.log(stretchPoint);
}

function stretchPointPolyMousemove(event) {
    let [x, y] = mouseToCanvas(event);

    if (!stretching) return;
    stretchObject.points[stretchPoint] = [x, y];

    stretchObject.bBox = updateBox(stretchObject.points);

    updateStretchPointPositions(stretchObject);

    let pointAdjusted = coordsBox(stretchObject.bBox, stretchObject.points[stretchPoint]);

    let stretchPointTarget = stretchObject.stretchPoints[stretchPoint];

    stretchPointTarget.style.left = pointAdjusted[0] + "px";
    stretchPointTarget.style.top = pointAdjusted[1] + "px";

    stretchObject.canvasBox.style.left = stretchObject.bBox[0] * zoom + "px";
    stretchObject.canvasBox.style.top = stretchObject.bBox[1] * zoom + "px";
    stretchObject.canvasBox.style.width = stretchObject.bBox[2] * zoom + "px";
    stretchObject.canvasBox.style.height = stretchObject.bBox[3] * zoom + "px";
    
    updateObject(stretchObject, stretchObject.bBox[0], stretchObject.bBox[1], x, y);
    updateObjectDataBox();
}

function stretchPointPolyMouseup(event) {
    stretching = false;
    stretchObject = null;
    stretchPoint = null;
}

function stretchPointRectMousemove(event, shift = false, alt = false) {
    if (!stretching) return;

    let [x, y] = mouseToCanvas(event);

    let aspectRatio = stretchObject.bBox[3] / stretchObject.bBox[2];

    let stretchPointPositions = stretchObject.stretchPoints.map(x => x.getBoundingClientRect());
    let stretchPointX = stretchPointPositions.map(x => x.x);
    let stretchPointY = stretchPointPositions.map(x => x.y);
    let stretchPointIndices = [];
    
    for (let positionIndex in stretchPointPositions) {
        let position = stretchPointPositions[positionIndex];

        let posX = position.x;
        let posY = position.y;

        if (posX === Math.min(...stretchPointX)) {
            if (posY === Math.min(...stretchPointY)) {
                stretchPointIndices.push(0);
            } else {
                stretchPointIndices.push(2);
            }
        } else {
            if (posY === Math.min(...stretchPointY)) {
                stretchPointIndices.push(1);
            } else {
                stretchPointIndices.push(3);
            }
        }
    }

    stretchPoint = stretchPointIndices[stretchPoint];

    for (let pointIndex in stretchObject.stretchPoints) {
        let point = stretchObject.stretchPoints[pointIndex];

        point.setAttribute("point-index", stretchPointIndices[pointIndex]);
    }

    stretchObject.bBox = updateRectBoxByPoint(stretchObject.bBox, stretchPoint, x, y, shift);

    let pointAdjusted = coordsBox(stretchObject.bBox, stretchObject.stretchPoints[stretchPoint]);

    let stretchPointTarget = stretchObject.stretchPoints[stretchPoint];

    stretchPointTarget.style.left = pointAdjusted[0] + "px";
    stretchPointTarget.style.top = pointAdjusted[1] + "px";

    updateStretchPointPositions(stretchObject);

    stretchObject.canvasBox.style.left = stretchObject.bBox[0] * zoom + "px";
    stretchObject.canvasBox.style.top = stretchObject.bBox[1] * zoom + "px";
    stretchObject.canvasBox.style.width = stretchObject.bBox[2] * zoom + "px";
    stretchObject.canvasBox.style.height = stretchObject.bBox[3] * zoom + "px";

    updateObject(stretchObject, stretchObject.bBox[0], stretchObject.bBox[1], x, y);
    updateObjectDataBox();
}

document.addEventListener('mousemove', (event) => {
    if (stretching) {
        if (isModeFree(stretchObject.type)) {
            stretchPointPolyMousemove(event);
        } else {
            stretchPointRectMousemove(event, shiftKey);
        }
        return;
    }
});

document.addEventListener('mouseup', (event) => {
    stretchPointPolyMouseup(event);
})