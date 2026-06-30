function canvasBoxMousedown(event) {
    if (!selectedObjects) return;
    let match = false;

    for (let object of selectedObjects) {
        if (object.canvasBox === event.target) {
            match = true;
            break;
        }
    }

    if (!match) return;

    moving = true;
    moveObjects = selectedObjects;

    moveStart = moveObjects.map(x => x.bBox.slice(0, 2));

    const [mouseX, mouseY] = mouseToCanvas(event);

    moveOffset = selectedObjects.map(x => [
        mouseX - x.bBox[0],
        mouseY - x.bBox[1]
    ])
    
    // [
    //     mouseX - selectedObject.bBox[0],
    //     mouseY - selectedObject.bBox[1]
    // ];
}

function canvasBoxMousemove(event) {
    if (!moving) return;

    for (let objectIndex in moveObjects) {
        let object = moveObjects[objectIndex];

        let prevBox = [...object.bBox];

        const [mouseX, mouseY] = mouseToCanvas(event);

        object.bBox[0] = mouseX - moveOffset[objectIndex][0];
        object.bBox[1] = mouseY - moveOffset[objectIndex][1];

        let centerX = Math.floor(object.bBox[0] + object.bBox[2] / 2);
        let halfWidth = Math.floor(canvasWidth / 2);

        let centerY = Math.floor(object.bBox[1] + object.bBox[3] / 2);
        let halfHeight = Math.floor(canvasHeight / 2);

        if (Math.abs(centerX - halfWidth) <= alignSnapRadius) {
            object.bBox[0] = Math.floor(halfWidth - object.bBox[2] / 2)
            // alignmentCtx.beginPath();
            // alignmentCtx.moveTo(canvasWidth / 2, 0);
            // alignmentCtx.lineTo(canvasWidth / 2, canvasHeight);
            // alignmentCtx.stroke();
        }

        if (Math.abs(centerY - halfHeight) <= alignSnapRadius) {
            object.bBox[1] = Math.floor(halfHeight - object.bBox[3] / 2)
            // alignmentCtx.beginPath();
            // alignmentCtx.moveTo(0, canvasHeight / 2);
            // alignmentCtx.lineTo(canvasWidth, canvasHeight / 2);
            // alignmentCtx.stroke();
        }

        let boxDiff = boundingBoxDiff(prevBox, object.bBox);

        object.canvasBox.style.left = object.bBox[0] * zoom + "px";
        object.canvasBox.style.top = object.bBox[1] * zoom + "px";

        if (object.points) {
            for (let point of object.points) {
                point[0] -= boxDiff[0];
                point[1] -= boxDiff[1];
            }
        }

        updateObject(object, object.bBox[0], object.bBox[1], mouseX, mouseY);
    }
}

function canvasBoxMouseup(event) {
    createTimelineEntry(moveObjects, "move", moveStart, moveObjects.map(x => x.bBox.slice(0, 2)));
    moving = false;
    moveObjects = [];
    moveOffset = null;
}