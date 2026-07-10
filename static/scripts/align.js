let alignmentLines = [];
const alignmentLineGroup = document.getElementById('alignment-line-group');

const objAlignLeft = document.getElementById('object-left-align');
const objAlignCenter = document.getElementById('object-center-align');
const objAlignRight = document.getElementById('object-right-align');
const objAlignTop = document.getElementById('object-top-align');
const objAlignMiddle = document.getElementById('object-middle-align');
const objAlignBottom = document.getElementById('object-bottom-align');
const objDistH = document.getElementById('object-dist-h');
const objDistV = document.getElementById('object-dist-v');

const alignLeft = () => {
    let selectedObjectsLeft = selectedObjects.map(x => x.bBox[0]);

    for (let object of selectedObjects) {
        object.bBox[0] = Math.min(...selectedObjectsLeft);
        updateObject(object);

        object.canvasBox.style.left = object.bBox[0] * zoom + 'px';
    }
}

const alignCenter = () => {
    let selectedObjectsLeft = selectedObjects.map(x => x.bBox[0]);
    let selectedObjectsRight = selectedObjects.map(x => x.bBox[0] + x.bBox[2]);

    let selectedObjectsCenter = (Math.min(...selectedObjectsLeft) + Math.max(...selectedObjectsRight)) / 2;

    for (let object of selectedObjects) {
        object.bBox[0] = selectedObjectsCenter - object.bBox[2] / 2;
        updateObject(object);

        object.canvasBox.style.left = object.bBox[0] * zoom + 'px';
    }
}

const alignRight = () => {
    let selectedObjectsRight = selectedObjects.map(x => x.bBox[0] + x.bBox[2]);

    for (let object of selectedObjects) {
        object.bBox[0] = Math.max(...selectedObjectsRight) - object.bBox[2];
        updateObject(object);

        object.canvasBox.style.left = object.bBox[0] * zoom + 'px';
    }
}

const alignTop = () => {
    let selectedObjectsTop = selectedObjects.map(x => x.bBox[1]);

    for (let object of selectedObjects) {
        object.bBox[1] = Math.min(...selectedObjectsTop);
        updateObject(object);

        object.canvasBox.style.top = object.bBox[1] * zoom + 'px';
    }
}

const alignMiddle = () => {
    let selectedObjectsTop = selectedObjects.map(x => x.bBox[1]);
    let selectedObjectsBottom = selectedObjects.map(x => x.bBox[1] + x.bBox[3]);

    let selectedObjectsMiddle = (Math.min(...selectedObjectsTop) + Math.max(...selectedObjectsBottom)) / 2;

    for (let object of selectedObjects) {
        object.bBox[1] = selectedObjectsMiddle - object.bBox[3] / 2;
        updateObject(object);

        object.canvasBox.style.top = object.bBox[1] * zoom + 'px';
    }
}

const alignBottom = () => {
    let selectedObjectsBottom = selectedObjects.map(x => x.bBox[1] + x.bBox[3]);

    for (let object of selectedObjects) {
        object.bBox[1] = Math.max(...selectedObjectsBottom) - object.bBox[3];
        updateObject(object);

        object.canvasBox.style.top = object.bBox[1] * zoom + 'px';
    }
}

const distH = () => {
    let selectedObjectBoxes = selectedObjects.map(x => {
        return {
            index: x.index,
            box: x.bBox
        }
    });

    selectedObjectBoxes.sort((a, b) => a.box[0] - b.box[0]);

    let firstObject = selectedObjectBoxes[0];
    let lastObject = selectedObjectBoxes[selectedObjectBoxes.length - 1];

    let space = lastObject.box[0] - firstObject.box[0] - firstObject.box[2];
    let middleObjects = selectedObjectBoxes.slice(1, -1);

    let middleSum = middleObjects.map(x => x.box[2]).reduce((a, c) => a + c, 0);
    let gap = (space - middleSum) / (middleObjects.length + 1);

    console.log(space, middleSum, gap, middleObjects);

    let pushX = firstObject.box[0] + firstObject.box[2];

    for (let objectIndex in middleObjects) {
        let object = objects[middleObjects[objectIndex].index]; 
        //console.log(firstCenter, distance * (objectIndex + 1), (selectedObjectsCenters.length - 1), object.bBox[2], firstCenter + (distance * (objectIndex + 1) / (selectedObjectsCenters.length - 1)) - object.bBox[2]);
        object.bBox[0] = pushX + gap;
        updateObject(object);
        object.canvasBox.style.left = object.bBox[0] * zoom + 'px';
        select(object, true);

        pushX += gap;
        pushX += object.bBox[2];
    }
}

const distV = () => {
    let selectedObjectBoxes = selectedObjects.map(x => {
        return {
            index: x.index,
            box: x.bBox
        }
    });

    selectedObjectBoxes.sort((a, b) => a.box[1] - b.box[1]);

    let firstObject = selectedObjectBoxes[0];
    let lastObject = selectedObjectBoxes[selectedObjectBoxes.length - 1];

    let space = lastObject.box[1] - firstObject.box[1] - firstObject.box[3];
    let middleObjects = selectedObjectBoxes.slice(1, -1);

    let middleSum = middleObjects.map(x => x.box[3]).reduce((a, c) => a + c, 0);
    let gap = (space - middleSum) / (middleObjects.length + 1);

    console.log(space, middleSum, gap, middleObjects);

    let pushY = firstObject.box[1] + firstObject.box[3];

    for (let objectIndex in middleObjects) {
        let object = objects[middleObjects[objectIndex].index]; 
        object.bBox[1] = pushY + gap;
        updateObject(object);
        object.canvasBox.style.top = object.bBox[1] * zoom + 'px';
        select(object, true);

        pushY += gap;
        pushY += object.bBox[3];
    }
}

objAlignLeft.addEventListener('click', alignLeft);
objAlignCenter.addEventListener('click', alignCenter);
objAlignRight.addEventListener('click', alignRight);

objAlignTop.addEventListener('click', alignTop);
objAlignMiddle.addEventListener('click', alignMiddle);
objAlignBottom.addEventListener('click', alignBottom);

objDistH.addEventListener('click', distH);
objDistV.addEventListener('click', distV);

function createAlignmentLine(x1, y1, x2, y2) {
    let newLine = createSVGElement('line');

    newLine.setAttribute("x1", x1);
    newLine.setAttribute("y1", y1);
    newLine.setAttribute("x2", x2);
    newLine.setAttribute("y2", y2);

    alignmentLines.push({
        element: newLine,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    })
}

function updateAlignmentLines() {
    alignmentLineGroup.innerHTML = "";
    
    for (let line of alignmentLines) {
        alignmentLineGroup.appendChild(line.element);
    }
}

function clearAlignmentLines() {
    alignmentLines = [];
    updateAlignmentLines();
}

document.addEventListener('keydown', (event) => {
    if (event.altKey) {
        switch (event.key.toLowerCase()) {
            case "l":
                alignLeft();
                break;
            case "c":
                alignCenter();
                break;
            case "r":
                alignRight();
                break;
            case "t":
                alignTop();
                break;
            case "m":
                alignMiddle();
                break;
            case "b":
                alignBottom();
                break;
            case "h":
                if (event.shiftKey) {
                    distH();
                }
                break;
            case "v":
                if (event.shiftKey) {
                    distV();
                }
                break;
            default:
                break;
        } 
    }
})