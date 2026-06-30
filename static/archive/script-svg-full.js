// Variables and housekeeping

const homePage = document.getElementById('home-content');
const mainPage = document.getElementById('main-content');

const mainCanvas = document.getElementById('main-canvas');
const canvasBoxes = document.getElementById('canvas-boxes');
const editor = document.getElementById('editor');

let canvasWidth = 800;
let canvasHeight = 600;

editor.style.width = canvasWidth + "px";
editor.style.height = canvasHeight + "px";

const saveAs = document.getElementById('save-as');
const saveDialog = document.getElementById('save-dialog');
const saveFormat = document.getElementById('save-format');
const saveQuality = document.getElementById('save-quality');
const saveAction = document.getElementById('save-action');
const saveFilename = document.getElementById('save-filename');
const savePercentage = document.getElementById('save-percentage');

const saveProject = document.getElementById('save-project');
const saveProjectDialog = document.getElementById('save-project-dialog');
const saveProjectFilename = document.getElementById('save-proj-filename');
const saveProjectAction = document.getElementById('save-proj-action');

const closeButtons = document.querySelectorAll('.close');
const dialogs = document.querySelectorAll('.dialog-box');

const zoomBox = document.getElementById('zoom-box');
const zoomMinus = document.getElementById('zoom-minus');
const zoomPlus = document.getElementById('zoom-plus');
const zoomPercentage = document.getElementById('zoom-percentage');

const newProject = document.getElementById('new-project');
const openProject = document.getElementById('open-project');
const openImage = document.getElementById('open-image');

const newProjectDialog = document.getElementById('new-project-dialog');
const newProjectAction = document.getElementById('new-project-action');
const newProjectCanvasWidth = document.getElementById('canvas-width-input');
const newProjectCanvasHeight = document.getElementById('canvas-height-input');
const canvasInchDimensions = document.getElementById('canvas-inch-dimensions');

const modeLine = document.getElementById('line');
const modeRect = document.getElementById('rect');
const modeEllipse = document.getElementById('ellipse');
const modeTriangleScalene = document.getElementById('triangle-scalene');
const modeTriangleIsosceles = document.getElementById('triangle-isosceles');
const modePolygonFree = document.getElementById('polygon-free');
const modeQuadraticCurve = document.getElementById('quadratic-curve');
const modeText = document.getElementById('text');
const modes = [modeLine, modeRect, modeEllipse, modeTriangleScalene, modeTriangleIsosceles, modePolygonFree, modeQuadraticCurve, modeText];

const stroke = document.getElementById('stroke');
const fill = document.getElementById('fill');
const sides = document.getElementById('sides');
const fontSize = document.getElementById('font-size');

const strokeLabel = document.getElementById('stroke-label');
const fillLabel = document.getElementById('fill-label');
const sidesLabel = document.getElementById('sides-label');
const fontSizeLabel = document.getElementById('font-size-label');

let canvasDragging = false;
let canvasDragOffset;
let canvasDragPosition = [0, 0];
let canvasDragPositionBuffer = [0, 0];

const leftAlign = document.getElementById('left-align');
const rightAlign = document.getElementById('right-align');
const centerAlign = document.getElementById('center-align');
const topAlign = document.getElementById('top-align');
const middleAlign = document.getElementById('middle-align');
const bottomAlign = document.getElementById('bottom-align');

const textAlignH = document.querySelectorAll('.text-align-h');
const textAlignV = document.querySelectorAll('.text-align-v');

let alignHActivated = "left";
let alignVActivated = "top";

textAlignH.forEach(el => el.addEventListener('click', () => {
    alignHActivated = el.id.slice(0, -6);
    textAlignH.forEach(el => el.classList.remove('activated'));
    el.classList.add('activated');
}))

textAlignV.forEach(el => el.addEventListener('click', () => {
    alignVActivated = el.id.slice(0, -6);
    textAlignV.forEach(el => el.classList.remove('activated'));
    el.classList.add('activated');
}))

const primCol = document.getElementById('primcol');
const scnCol = document.getElementById('scncol');

const switchCol = document.getElementById('switch');

let stretchObject;
let stretchPoint;
let stretching = false;

let selecting = false;
let selectedObject;

let moving = false;
let moveObject;
let moveOffset;

let shiftKey = false;
let altKey = false;

let zoom = 1;

let canvasBoundingRect = mainCanvas.getBoundingClientRect();

let canvasActivated = false;

let downX, downY;
let upX, upY;

let downClickX, downClickY;

let polyPoints = [];

let objects = [];

let mode = "none";

let alignSnapRadius = 3;

// Core functions

function mouseToCanvas(event) {
    return [
        (event.clientX - canvasBoundingRect.left) / zoom,
        (event.clientY - canvasBoundingRect.top) / zoom
    ];
}

function adjustZoom() {
    zoom = Math.max(0.05, zoom);

    editor.style.width = canvasWidth * zoom + 'px';
    editor.style.height = canvasHeight * zoom + 'px';

    for (let object of objects) {
        object.canvasBox.style.left = object.bBox[0] * zoom + 'px';
        object.canvasBox.style.top = object.bBox[1] * zoom + 'px';
        object.canvasBox.style.width = object.bBox[2] * zoom + 'px';
        object.canvasBox.style.height = object.bBox[3] * zoom + 'px';

        if (isModeFree(object.type)) {
            for (let stretchIndex in object.stretchPoints) {
                let stretchPoint = object.stretchPoints[stretchIndex];
                let polyPoint = object.points[stretchIndex];

                let coordsPoint = coordsBox(object.bBox, ...polyPoint);
                
                coordsPoint = adjustPointByZoom(zoom, ...coordsPoint);

                stretchPoint.style.left = (coordsPoint[0] - 3) + 'px';
                stretchPoint.style.top = (coordsPoint[1] - 3) + 'px';

                console.log(stretchPoint.style.left, stretchPoint.style.top, polyPoint);
            }
        }

        updateObject(object);
    }

    mainCanvas.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
    mainCanvas.setAttribute("width", canvasWidth);
    mainCanvas.setAttribute("height", canvasHeight);

    zoomPercentage.textContent = `${(zoom * 100).toFixed(0)}%`

    canvasBoundingRect = mainCanvas.getBoundingClientRect();
    drawBackgroundCheckerboard();
}

function isModeFree(mode) {
    return ["polygon-free", "triangle-scalene", "quadratic-curve", "line"].includes(mode);
}

function adjustPointByZoom(zoomFactor, x, y) {
    return [x * zoomFactor, y * zoomFactor];
}

function or(x, y) {
    return (x === null || x === undefined) ? y : x;
}

let createSVGElement = x => document.createElementNS("http://www.w3.org/2000/svg", x);

function updateObject(obj, downX = null, downY = null, upX = null, upY = null) {
    let element = obj.element;

    switch (obj.type) {
        case "line":
            element = element || createSVGElement('line');    

            element.setAttribute('x1', or(downX, obj.points[0][0]));
            element.setAttribute('y1', or(downY, obj.points[0][1]));
            element.setAttribute('x2', or(upX, obj.points[1][0]));
            element.setAttribute('y2', or(upY, obj.points[1][1]));

            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");

            break;
        case "rect":
            element = element || createSVGElement('rect');

            element.setAttribute('x', obj.bBox[0]);
            element.setAttribute('y', obj.bBox[1]);
            element.setAttribute('width', obj.bBox[2]);
            element.setAttribute('height', obj.bBox[3]);

            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");

            break;
        case "ellipse":
            element = element || createSVGElement('ellipse');

            let halfObjWidth = obj.bBox[2] / 2;
            let halfObjHeight = obj.bBox[3] / 2;

            element.setAttribute('cx', obj.bBox[0] + halfObjWidth);
            element.setAttribute('cy', obj.bBox[1] + halfObjHeight);
            element.setAttribute('rx', halfObjWidth);
            element.setAttribute('ry', halfObjHeight);

            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");

            break;
        case "polygon-free":
        case "triangle-scalene":
            element = element || createSVGElement('polygon');

            element.setAttribute('points', obj.points.map(x => x.join(", ")).join(" ") + ` ${!obj.element ? or(upX, "") : ""}, ${!obj.element ? or(upY, "") : ""}`); //+ (upX === null && upY === null) ? "" : ` ${upX} ${upY}`);

            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");

            break;
        case "quadratic-curve":
            break;
        case "triangle-isosceles":
            element = element || createSVGElement('polygon');

            let halfObjWidth_ = obj.bBox[2] / 2;
            let objWidth = obj.bBox[2];
            let objHeight = obj.bBox[3];

            element.setAttribute('points', `${obj.bBox[0] + halfObjWidth_} ${obj.bBox[1]} ${obj.bBox[0]} ${obj.bBox[1] + objHeight} ${obj.bBox[0] + objWidth} ${obj.bBox[1] + objHeight}`)

            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");
            break;
        case "text":
            // objCtx.font = `${obj.fontSize * zoom}px ${obj.fontType}`;
            // objCtx.textAlign = obj.textHorizontalAlign;
            // objCtx.textBaseline = obj.textVerticalAlign;

            // let alignH = ["left", "center", "right"].indexOf(obj.textHorizontalAlign);
            // let alignV = ["top", "middle", "bottom"].indexOf(obj.textVerticalAlign);
            
            // if (filling) {
            //     objCtx.fillText(obj.text, minX + (alignH * width / 2), minY + (alignV * height / 2));
            // }

            // if (stroking) {
            //     objCtx.strokeText(obj.text, minX + (alignH * width / 2), minY + (alignV * height / 2));
            // }

            break;
        default:
            break;
    }

    if (!obj.element) return element;
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
        height = Math.sign(height) * size;

        maxX = minX + width;
        maxY = minY + height;
    }

    return [minX, minY, width, height];
}

function updateStretchPointPositions(object, zoomFactor = zoom) {
    for (let point in object.points) {
        let polyPoint = object.points[point];
        let stretchPoint = object.stretchPoints[point];

        let polyPointCanvas = coordsBox(object.bBox, ...polyPoint);

        stretchPoint.style.left = (polyPointCanvas[0] * zoomFactor) - 3 + "px";
        stretchPoint.style.top = (polyPointCanvas[1] * zoomFactor) - 3 + "px";
    }
}

function stretchPointPolyMousedown(event) {
    stretching = true;
    console.log("stretching");
    stretchObject = +event.target.parentElement.getAttribute('object-id');
    stretchPoint = +event.target.getAttribute('point-index');
    console.log(stretchPoint);
}

function stretchPointPolyMousemove(event) {
    let [x, y] = mouseToCanvas(event);

    if (!stretching) return;
    let object = objects[stretchObject];
    object.points[stretchPoint] = [x, y];

    object.bBox = updateBox(object.points);

    updateStretchPointPositions(object);

    let pointAdjusted = coordsBox(object.bBox, object.points[stretchPoint]);

    pointAdjusted = adjustPointByZoom(zoom, ...pointAdjusted);

    let stretchPointTarget = object.stretchPoints[stretchPoint];

    stretchPointTarget.style.left = (pointAdjusted[0] - 3) / zoom + "px";
    stretchPointTarget.style.top = (pointAdjusted[1] - 3) / zoom + "px";

    object.canvasBox.style.left = object.bBox[0] * zoom + "px";
    object.canvasBox.style.top = object.bBox[1] * zoom + "px";
    object.canvasBox.style.width = object.bBox[2] * zoom + "px";
    object.canvasBox.style.height = object.bBox[3] * zoom + "px";
    
    updateObject(object, object.bBox[0], object.bBox[1], x, y);
}

function stretchPointPolyMouseup(event) {
    stretching = false;
    stretchObject = null;
    stretchPoint = null;
}

function stretchPointRectMousemove(event, shift = false, alt = false) {
    if (!stretching) return;

    let [x, y] = mouseToCanvas(event);

    let object = objects[stretchObject];

    let aspectRatio = object.bBox[3] / object.bBox[2];

    object.bBox = updateRectBoxByPoint(object.bBox, stretchPoint, x, y, shift);

    if (shift) {
        if (stretchPoint > 1) object.bBox[3] = object.bBox[3] * aspectRatio;
        else object.bBox[2] = object.bBox[2] * aspectRatio;
    }

    object.canvasBox.style.left = object.bBox[0] + "px";
    object.canvasBox.style.top = object.bBox[1] - 1 + "px";
    object.canvasBox.style.width = object.bBox[2] + "px";
    object.canvasBox.style.height = object.bBox[3] + "px";

    updateObject(object, object.bBox[0], object.bBox[1], x, y);
}

function canvasBoxMousedown(event) {
    if (!selectedObject) return;
    if (selectedObject.canvasBox !== event.target) return;

    moving = true;
    moveObject = +event.target.getAttribute('object-id');

    const [mouseX, mouseY] = mouseToCanvas(event);

    moveOffset = [
        mouseX - selectedObject.bBox[0],
        mouseY - selectedObject.bBox[1]
    ];
}

function canvasBoxMousemove(event) {
    if (!moving) return;

    let object = objects[moveObject];

    let prevBox = [...object.bBox];

    const [mouseX, mouseY] = mouseToCanvas(event);

    object.bBox[0] = mouseX - moveOffset[0];
    object.bBox[1] = mouseY - moveOffset[1];

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

function canvasBoxMouseup(event) {
    moving = false;
    moveObject = null;
    moveOffset = null;
}

function unselectAll() {
    for (let objIndex in objects) {
        let obj = objects[objIndex];
        if (!obj) continue;
        obj.canvasBox.classList.remove('selected');
    }
    updateInteractionBar();
}

function finish() {
    canvasActivated = false;

    if (downX && downY && upX && upY && mode !== "none") {
        let bBox = [];
        let modeFree = isModeFree(mode);
        // Compute bounding box

        if (modeFree) {
            let polyXvals = polyPoints.map(x => x[0]);
            let polyYvals = polyPoints.map(y => y[1]);

            let width = Math.max(...polyXvals) - Math.min(...polyXvals);
            let height = Math.max(...polyYvals) - Math.min(...polyYvals);

            bBox = [Math.min(...polyXvals), Math.min(...polyYvals), width, height]

        } else {
            bBox = [Math.min(downX, upX), Math.min(downY, upY), Math.abs(downX - upX), Math.abs(downY - upY)]
        }

        // Create items

        let newItemProperties = {};

        newItemProperties.index = objects.length;

        newItemProperties.bBox = bBox;
        newItemProperties.type = mode;

        if (modeFree) {
            newItemProperties.points = polyPoints;
        }

        newItemProperties.strokeWidth = stroke.value;
        newItemProperties.strokeColor = primCol.value;

        newItemProperties.fillColor = fill.checked ? scnCol.value : null;

        if (mode === "text") {
            newItemProperties.fontSize = fontSize.value;
            newItemProperties.text = "Text";
            newItemProperties.textHorizontalAlign = alignHActivated;
            newItemProperties.textVerticalAlign = alignVActivated;
        }

        newItemProperties.element = updateObject(newItemProperties);

        objects.push(newItemProperties);

        let objectID = objects.length - 1;

        newItemProperties.element.setAttribute('object-id', objectID);
        mainCanvas.appendChild(newItemProperties.element);

        let newCanvasBox = document.createElement('div');
        newCanvasBox.classList.add('canvas-box');

        newCanvasBox.style.left = (bBox[0] - 1) * zoom + "px";
        newCanvasBox.style.top = (bBox[1]) * zoom + "px";
        newCanvasBox.style.width = (bBox[2]) * zoom + "px";
        newCanvasBox.style.height = (bBox[3]) * zoom + "px";

        newCanvasBox.setAttribute('object-id', objectID);

        newCanvasBox.addEventListener('mousedown', canvasBoxMousedown);
        newCanvasBox.addEventListener('mousemove', canvasBoxMousemove);
        newCanvasBox.addEventListener('mouseup', canvasBoxMouseup);

        newItemProperties.canvasBox = newCanvasBox;

        newItemProperties.stretchPoints = [];

        unselectAll();

        selecting = true;
        selectedObject = newItemProperties;

        newCanvasBox.classList.add('selected');

        // Create stretch points

        if (modeFree) {
            for (let point in polyPoints) {
                let polyPoint = polyPoints[point];
                let polyAdjusted = coordsBox(bBox, ...polyPoint);

                let stretchPoint = document.createElement('div');
                stretchPoint.classList.add('stretch-point');
                stretchPoint.setAttribute('point-index', point);

                stretchPoint.style.left = (polyAdjusted[0] - 3) * zoom + "px";
                stretchPoint.style.top = (polyAdjusted[1] - 3) * zoom + "px";

                stretchPoint.addEventListener('mousedown', stretchPointPolyMousedown);
                // stretchPoint.addEventListener('mousemove', stretchPointPolyMousemove);
                stretchPoint.addEventListener('mouseup', stretchPointPolyMouseup);

                newCanvasBox.appendChild(stretchPoint);

                newItemProperties.stretchPoints.push(stretchPoint);
            }
        } else {
            let stretchPointDirections = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            for (let direction in stretchPointDirections) {
                let stretchPoint = document.createElement('div');
                stretchPoint.classList.add('stretch-point');
                stretchPoint.classList.add('stretch-point-' + stretchPointDirections[direction]);
                
                stretchPoint.setAttribute('point-index', direction);

                stretchPoint.addEventListener('mousedown', stretchPointPolyMousedown);
                // stretchPoint.addEventListener('mousemove', stretchPointRectMousemove);
                stretchPoint.addEventListener('mouseup', stretchPointPolyMouseup);

                newCanvasBox.appendChild(stretchPoint);

                newItemProperties.stretchPoints.push(stretchPoint);
            }
        }

        canvasBoxes.appendChild(newCanvasBox);
    }

    document.querySelector('#temp-obj')?.remove();

    downX = null;
    downY = null;
    upX = null;
    upY = null;

    mode = "none";

    unselectModes();
    
    polyPoints = [];
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

// Main canvas events

document.addEventListener('mousedown', (event) => {
    downClickX = event.clientX;
    downClickY = event.clientY;
})

document.addEventListener('mouseup', (event) => {
    downClickX = null;
    downClickY = null;
})

document.addEventListener('click', (event) => {
    let [clickX, clickY] = mouseToCanvas(event);
    if (clickX < 0 || clickY < 0) {return;}

    if (stretching) return;
    if (selecting) {
        let inElement = pointInElement(event.clientX, event.clientY, selectedObject.canvasBox);
        if (inElement) {
            return;
        }
        selecting = false;
        selectedObject = null;
        unselectAll();
        return;
    }
    
    let elementOverPoint = document.elementFromPoint(event.clientX, event.clientY);

    if (elementOverPoint.classList.contains('canvas-box') && mode === "none") return;

    let modeFree = isModeFree(mode);

    if (canvasActivated === false) {
        downX = clickX;
        downY = clickY;

        canvasActivated = true;
        
        if (modeFree) {
            polyPoints.push([downX, downY]);
        }

        return;
    } else {
        if (mode === "triangle-scalene") {
            polyPoints.push([clickX, clickY]);
            if (polyPoints.length === 3) {
                finish();
            }
        } else if (mode === "polygon-free") {
            polyPoints.push([clickX, clickY]);
            if (polyPoints.length === +sides.value) {
                finish();
            }
        } else if (mode === "quadratic-curve") {
            polyPoints.push([clickX, clickY]);
            if (polyPoints.length === 4) {
                finish();
            }
        } else if (mode === "line") {
            polyPoints.push([clickX, clickY]);
            if (polyPoints.length === 2) {
                finish();
            }
        } else {
            finish();
        }       
    }
})

document.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;

    canvasDragOffset = mouseToCanvas(event);

    if (canvasDragOffset[0] > 0 && canvasDragOffset[0] < canvasWidth && canvasDragOffset[1] > 0 && canvasDragOffset[1] < canvasHeight) {
        canvasDragging = false;
        return;
    }

    canvasDragging = true;
})

document.addEventListener('mousemove', (event) => {
    // if (canvasDragging) {
    //     let currentCanvasDragOffset = mouseToCanvas(event);
    //     //editor.style.transform = `translate(calc(-50% + ${currentCanvasDragOffset[0] - canvasDragOffset[0] + canvasDragPosition[0]}px), calc(-50% + ${currentCanvasDragOffset[1] - canvasDragOffset[1] + canvasDragPosition[1]}px))`;
    //     canvasDragPositionBuffer = [currentCanvasDragOffset[0] - canvasDragOffset[0] - canvasDragPosition[0], currentCanvasDragOffset[1] - canvasDragOffset[1] - canvasDragPosition[1]];
    //     return;
    // }

    if (stretching) {
        let stretchObj = objects[stretchObject];
        if (isModeFree(stretchObj.type)) {
            stretchPointPolyMousemove(event);
        } else {
            stretchPointRectMousemove(event, shiftKey);
        }
        return;
    }
    if (!canvasActivated) return;

    [upX, upY] = mouseToCanvas(event);
 
    let minX = Math.min(downX, upX);
    let minY = Math.min(downY, upY);
    let width = Math.abs(downX - upX);
    let height = Math.abs(downY - upY);

    let tempObj = {};

    tempObj.bBox = [minX, minY, width, height];
    tempObj.fillColor = fill.checked ? scnCol.value : null;
    tempObj.strokeColor = primCol.value;
    tempObj.strokeWidth = stroke.value;
    tempObj.type = mode;

    tempObj.fontSize = fontSize.value;
    
    if (polyPoints) {
        tempObj.points = polyPoints;
    }

    if (mode === "text") {
        tempObj.text = "Text";
        tempObj.textHorizontalAlign = alignHActivated;
        tempObj.textVerticalAlign = alignVActivated;
    }

    let element = updateObject(tempObj, downX, downY, upX, upY);
    if (element) element.id = "temp-obj";

    document.querySelector('#temp-obj')?.remove();
    if (element) mainCanvas.appendChild(element);
})

document.addEventListener('mouseup', (event) => {
    canvasDragPosition = canvasDragPositionBuffer;
    canvasDragPositionBuffer = [0, 0];
    canvasDragging = false;
    canvasDragOffset = null;
    //adjustZoom();
})

document.addEventListener('keydown', (event) => {
    if (event.shiftKey) shiftKey = true;
    if (event.altKey) altKey = true;
})

document.addEventListener('keyup', (event) => {
    shiftKey = false;
    altKey = false;

    if (event.key === "Delete") {
        let index = selectedObject.index;

        selectedObject.element.remove();

        unselectAll();

        selecting = false;

        objects[index] = null;
        selectedObject = null;
    }
})

document.addEventListener('wheel', (event) => {
    zoom += -Math.sign(event.deltaY) * 0.05;
    adjustZoom();
})

zoomMinus.addEventListener('click', () => {
    zoom -= 0.05;
    adjustZoom();
})

zoomPlus.addEventListener('click', () => {
    zoom += 0.05;
    adjustZoom();
})

// Interaction bar events

function updateSelectedObject() {
    if (!selectedObject) return;
    if (!selectedObject) return;
    console.log("updating object");
    selectedObject.strokeColor = primCol.value;
    selectedObject.fillColor = fill.checked ? scnCol.value : null; 
    selectedObject.strokeWidth = stroke.value;
    selectedObject.fontSize = fontSize.value;
    console.log(selectedObject.fillColor);
    updateObject(selectedObject);
}

switchCol.addEventListener('click', () => {
    const prevPrimaryCol = primCol.value;
    const prevSecondaryCol = scnCol.value;

    primCol.value = prevSecondaryCol;
    scnCol.value = prevPrimaryCol;

    updateSelectedObject();
})

primCol.addEventListener('change', () => {
    updateSelectedObject();
})

scnCol.addEventListener('change', () => {
    updateSelectedObject();
})

stroke.addEventListener('change', () => {
    updateSelectedObject();
})

fill.addEventListener('change', () => {
    updateSelectedObject();
})

fontSize.addEventListener('change', updateSelectedObject);

modes.forEach(el => el.addEventListener('click', () => {
    if (el.classList.contains('mode-active')) {
        el.classList.remove('mode-active');
        mode = "none";
        return;
    }
    mode = el.id;
    modes.forEach(el => el.classList.remove('mode-active'));
    el.classList.add('mode-active');
    updateInteractionBar();
}))

function unselectModes() {
    mode = "none";
    modes.forEach(el => el.classList.remove('mode-active'));
}

function updateInteractionBar() {
    let currentMode = mode;
    
    if (selectedObject) {
        currentMode = selectedObject.mode;
    }

    stroke.style.display = "none";
    fill.style.display = "none";
    sides.style.display = "none";
    fontSize.style.display = "none";

    strokeLabel.style.display = "none";
    fillLabel.style.display = "none";
    sidesLabel.style.display = "none";
    fontSizeLabel.style.display = "none";

    leftAlign.style.display = "none";
    centerAlign.style.display = "none";
    rightAlign.style.display = "none";
    topAlign.style.display = "none";
    middleAlign.style.display = "none";
    bottomAlign.style.display = "none";

    if (currentMode !== "none") {
        stroke.style.display = "";
        fill.style.display = "";

        strokeLabel.style.display = "";
        fillLabel.style.display = "";
    }

    if (currentMode === "polygon-free") {
        sides.style.display = "";
        sidesLabel.style.display = "";
    }

    if (currentMode === "text") {
        fontSize.style.display = "";
        fontSizeLabel.style.display = "";

        leftAlign.style.display = "";
        centerAlign.style.display = "";
        rightAlign.style.display = "";
        topAlign.style.display = "";
        middleAlign.style.display = "";
        bottomAlign.style.display = "";
    }
}

window.addEventListener('resize', () => {
    canvasBoundingRect = mainCanvas.getBoundingClientRect();
})

// Dialog boxes

function generateProjectFile() {
    let firstLine = `canvas ${canvasWidth} ${canvasHeight}`;
    let objectLines = [];

    let currentLine = ""

    for (let object of objects) {
        currentLine = object.type + ' ';
        if (isModeFree(object.type)) {
            currentLine += object.points.join(" ");
        } else {
            currentLine += object.bBox.join(" ");
        }
        currentLine += ' ';
        currentLine += object.fillColor !== null ? 't' : 'f';
        currentLine += ' ';
        currentLine += `${object.strokeWidth} ${object.fillColor || 'none'} ${object.strokeColor}`;
        
        objectLines.push(currentLine);
        currentLine = "";
    }

    return new Blob([objectLines.join('\n')], { type: 'text/plain'});
}

saveAs.addEventListener('click', () => {saveDialog.style.display = "block"})

saveAction.addEventListener('click', () => {
    let format = saveFormat.value;
    let quality = saveQuality.value;
    console.log(format, quality);

    let saveCanvas = document.createElement('canvas');

    saveCanvas.width = canvasWidth;
    saveCanvas.height = canvasHeight;

    let saveContext = saveCanvas.getContext('2d');

    for (let object of objects) {
        if (!object) continue;
        saveContext.drawImage(object.canvas, 0, 0);
    }

    saveCanvas.toBlob((blob) => {
        let tempLink = document.createElement('a');
        tempLink.href = URL.createObjectURL(blob);
        tempLink.download = `${(saveFilename.value || "image").trim()}.${saveFormat.value}`;
        tempLink.click();
    }, `image/${saveFormat.value}`, saveQuality.value)
})

saveProject.addEventListener('click', () => {saveProjectDialog.style.display = "block"});

newProject.addEventListener('click', () => {console.log('hi!'); newProjectDialog.style.display = "block"});

newProjectAction.addEventListener('click', () => {
    newProjectDialog.style.display = "none";
    homePage.style.display = "none";
    mainPage.style.display = "block";
    
    canvasWidth = +newProjectCanvasWidth.value;
    canvasHeight = +newProjectCanvasHeight.value;

    zoom = window.innerHeight >= window.innerWidth ? window.innerHeight * 0.65 / canvasHeight : window.innerWidth * 0.65 / canvasHeight;
    zoom = Math.floor(zoom / 0.05) * 0.05;
        
    adjustZoom();
    
    canvasBoundingRect = mainCanvas.getBoundingClientRect();
    drawBackgroundCheckerboard();
})

function updateCanvasDimensionLabel(event, ppi = 96) {
    canvasInchDimensions.textContent = `${(+newProjectCanvasWidth.value / ppi).toFixed(2)}" × ${(+newProjectCanvasHeight.value / ppi).toFixed(2)}" @ ${ppi} PPI`;
}

newProjectCanvasWidth.addEventListener('change', updateCanvasDimensionLabel);
newProjectCanvasHeight.addEventListener('change', updateCanvasDimensionLabel);

updateCanvasDimensionLabel();

saveQuality.addEventListener('change', () => {
    savePercentage.textContent = (+saveQuality.value).toFixed(2);
})

// Post-initialization actions

updateInteractionBar();

function drawBackgroundCheckerboard() {
    // backgroundCanvas.width = canvasWidth;
    // backgroundCanvas.height = canvasHeight;

    // let bgCtx = backgroundCanvas.getContext('2d');

    // let rows = Math.floor(Math.ceil(canvasWidth / 30) / 2) * 2;
    // let cols = Math.floor(Math.ceil(canvasHeight / 30) / 2) * 2;

    // let isDark = false;

    // for (let i = 0; i <= rows; i++) {
    //     for (let j = 0; j <= cols; j++) {
    //         bgCtx.beginPath();
    //         isDark = !isDark;
    //         if (isDark) {
    //             bgCtx.fillStyle = "#BBBBBB";
    //         } else {
    //             bgCtx.fillStyle = "#EEEEEE";
    //         }

    //         bgCtx.rect(i * 30, j * 30, 30, 30);
    //         bgCtx.fill();
    //     }
    // }
}

drawBackgroundCheckerboard();

adjustZoom();

closeButtons.forEach(x => {
    x.addEventListener('click', () => {
        dialogs.forEach(y => y.style.display = "none")
    })
})