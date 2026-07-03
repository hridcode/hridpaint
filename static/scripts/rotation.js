function rotatePointMousedown(event) {
    rotating = true;
    rotateObject = objects[+event.target.getAttribute("object-id")];
}

function rotatePointMousemove(event) {
    if (!rotating || !rotateObject) return;
    let [x, y] = mouseToCanvas(event);
    
    let rotateObjectCenter = [rotateObject.bBox[0] + rotateObject.bBox[2] / 2, rotateObject.bBox[1] + rotateObject.bBox[3] / 2];
    let rotateOffset = [x - rotateObjectCenter[0], y - rotateObjectCenter[1]];

    let angle = Math.atan(rotateOffset[1] / rotateOffset[0]);

    // if (rotateOffset[0] < 0) {
    //     angle += 180;
    // } else if (rotateOffset[1] < 0) {
    //     angle += 360;
    // }

    angle = angle * 180 / Math.PI;
    
    if (shiftKey) {
        angle = Math.floor(angle / 45) * 45;
    }

    angle -= 90;

    // let rotateRadius = rotateObject.bBox[2] * 0.6;

    // let newPos = [rotateRadius * Math.cos(angle), rotateRadius * Math.sin(angle)];
    // rotateObject.rotationPoint.style.left = `calc(50% + ${newPos[0]}px)`;
    // rotateObject.rotationPoint.style.top = `calc(50% + ${newPos[1]}px)`;

    rotateObject.rotation = angle;

    // console.log(angle);
    
    updateObject(rotateObject);
}

function rotatePointMouseup(event) {
    rotating = false;
    rotateObject = null;
}

document.addEventListener('mouseup', rotatePointMouseup);
document.addEventListener('mousemove', rotatePointMousemove);