function or(x, y) {
    return (x === null || x === undefined) ? y : x;
}

let createSVGElement = x => document.createElementNS("http://www.w3.org/2000/svg", x);

function updateObject(obj, downX = null, downY = null, upX = null, upY = null) {
    let element = obj.element;

    let d;

    switch (obj.type) {
        case "line":
            element = element || createSVGElement('line');    

            // console.log(obj.points, upX, upY)

            element.setAttribute('x1', downX === null ? obj.points[0][0] : downX);
            element.setAttribute('y1', downY === null ? obj.points[0][1]: downY);
            element.setAttribute('x2', upX === null ? obj.points[1][0] : upX);
            element.setAttribute('y2', upY === null ? obj.points[1][1] : upY);

            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");

            break;
        case "rect":
            element = element || createSVGElement('rect');

            element.setAttribute('x', obj.bBox[0]);
            element.setAttribute('y', obj.bBox[1]);
            element.setAttribute('width', Math.abs(obj.bBox[2]));
            element.setAttribute('height', Math.abs(obj.bBox[3]));
            
            element.setAttribute('rx', obj.radiusX);
            element.setAttribute('ry', obj.radiusY);

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
            element = element || createSVGElement('path');

            if (obj.points.length === 1) {
                d = `M ${obj.points[0].join(" ")} L ${upX} ${upY}`;
            } else if (obj.points.length === 2) {
                d = `M ${obj.points[0].join(" ")} Q ${obj.points[1].join(" ")}, ${upX} ${upY}`;
            } else if (obj.points.length === 3) {
                d = `M ${obj.points[0].join(" ")} Q ${obj.points[1].join(" ")}, ${obj.points[2].join(" ")}`;    
            }

            element.setAttribute('d', d);

            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");

            break;
        case "cubic-curve":
            element = element || createSVGElement('path');

            if (obj.points.length === 0) {
                d = `M ${downX} ${downY}`;
            } else if (obj.points.length === 1) {
                d = `M ${obj.points[0].join(" ")} L ${upX} ${upY}`;
            } else if (obj.points.length === 2) {
                d = `M ${obj.points[0].join(" ")} C ${obj.points[1].join(" ")}, ${obj.points[1].join(" ")}, ${upX} ${upY}`;
            } else if (obj.points.length === 3) {
                d = `M ${obj.points[0].join(" ")} C ${obj.points[1].join(" ")}, ${obj.points[2].join(" ")}, ${upX} ${upY}`;    
            } else {
                d = `M ${obj.points[0].join(" ")} C ${obj.points[1].join(" ")}, ${obj.points[2].join(" ")}, ${obj.points[3].join(" ")}`;
            }

            element.setAttribute('d', d);

            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");

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
            element = element || createSVGElement('text');

            element.textContent = obj.text;
            
            element.setAttribute('x', obj.bBox[0]);
            element.setAttribute('y', obj.bBox[1]);
            //element.setAttribute('textLength', Math.abs(obj.bBox[2]));

            element.setAttribute('white-space', 'break-space');

            element.setAttribute('font-family', obj.fontFamily || "sans-serif");
            element.setAttribute('font-size', obj.fontSize);
            element.setAttribute('dominant-baseline', obj.textAlign || "hanging");
            
            element.setAttribute('stroke', obj.strokeColor);
            element.setAttribute('stroke-width', obj.strokeWidth);            
            element.setAttribute('fill', obj.fillColor || "none");
            
            element.setAttribute('contenteditable', true);        

            break;
        case "image":
            element = element || createSVGElement('image');

            element.setAttribute('href', obj.url);
            element.setAttribute('x', obj.bBox[0]);
            element.setAttribute('y', obj.bBox[1]);
            element.setAttribute('width', obj.bBox[2]);
            element.setAttribute('height', obj.bBox[3]);
            element.setAttribute('object-id', obj.index);

            break;
        default:
            break;
    }

    element?.setAttribute('opacity', obj.opacity);
    element?.setAttribute('object-id', obj.index);
    element?.setAttribute('transform', `rotate(${obj.rotation} ${obj.bBox[0] + obj.bBox[2] / 2} ${obj.bBox[1] + obj.bBox[3] / 2})`);

    if (!obj.element) return element;
}

function isModeFree(mode) {
    return ["polygon-free", "triangle-scalene", "quadratic-curve", "cubic-curve", "line"].includes(mode);
}

let polyModeMax = {
    "polygon-free": 4,
    "triangle-scalene": 3,
    "quadratic-curve": 3,
    "cubic-curve": 4,
    "line": 2
}

document.addEventListener('click', (event) => {
    let [clickX, clickY] = mouseToCanvas(event);
    if (clickX < 0 || clickY < 0) {return;}
    
    if (stretching) return;
    if (selecting) return;

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
        if (isModeFree(mode)) {
            polyModeMax["polygon-free"] = +sides.value;
            polyPoints.push([clickX, clickY]);
            if (polyPoints.length === polyModeMax[mode]) finish();
        } else {
            finish();
        }       
    }
})

document.addEventListener('mousemove', (event) => {
    // if (canvasDragging) {
    //     let currentCanvasDragOffset = mouseToCanvas(event);
    //     //editor.style.transform = `translate(calc(-50% + ${currentCanvasDragOffset[0] - canvasDragOffset[0] + canvasDragPosition[0]}px), calc(-50% + ${currentCanvasDragOffset[1] - canvasDragOffset[1] + canvasDragPosition[1]}px))`;
    //     canvasDragPositionBuffer = [currentCanvasDragOffset[0] - canvasDragOffset[0] - canvasDragPosition[0], currentCanvasDragOffset[1] - canvasDragOffset[1] - canvasDragPosition[1]];
    //     return;
    // }

    if (stretching) return;
    if (!canvasActivated) return;

    [upX, upY] = mouseToCanvas(event);
 
    let minX = Math.min(downX, upX);
    let minY = Math.min(downY, upY);
    let width = Math.abs(downX - upX);
    let height = Math.abs(downY - upY);

    if (shiftKey && !isModeFree(mode)) height = width;

    let tempObj = {};

    tempObj.bBox = [minX, minY, width, height];
    tempObj.fillColor = fill.checked ? scnCol.value : null;
    tempObj.strokeColor = primCol.value;
    tempObj.strokeWidth = stroke.value;
    tempObj.opacity = opacity.value;
    tempObj.type = mode;
    tempObj.rotation = 0;

    tempObj.fontSize = fontSize.value;
    
    if (polyPoints) {
        tempObj.points = polyPoints;
    }

    if (mode === "text") {
        tempObj.text = "Text";
        tempObj.textHorizontalAlign = alignHActivated;
        tempObj.textVerticalAlign = alignVActivated;
    }

    if (mode === "rect") {
        tempObj.radiusX = radiusX.value;
        tempObj.radiusY = radiusY.value;
    }

    let element = updateObject(tempObj, downX, downY, upX, upY);
    if (element) element.id = "temp-obj";

    document.querySelector('#temp-obj')?.remove();
    if (element) mainCanvas.appendChild(element);
})

document.addEventListener('keydown', (event) => {
    if (event.shiftKey) shiftKey = true;
    if (event.altKey) altKey = true;
})

document.addEventListener('keyup', (event) => {
    shiftKey = false;
    altKey = false;
})

function createCanvasBox(object, rotation = 0) {
    let newCanvasBox = document.createElement('div');
    newCanvasBox.classList.add('canvas-box');

    newCanvasBox.style.left = (object.bBox[0]) * zoom + "px";
    newCanvasBox.style.top = (object.bBox[1]) * zoom + "px";
    newCanvasBox.style.width = (object.bBox[2]) * zoom + "px";
    newCanvasBox.style.height = (object.bBox[3]) * zoom + "px";

    newCanvasBox.setAttribute('object-id', object.index);

    newCanvasBox.addEventListener('mousedown', canvasBoxMousedown);
    newCanvasBox.addEventListener('mousemove', canvasBoxMousemove);
    newCanvasBox.addEventListener('mouseup', canvasBoxMouseup);
    
    newCanvasBox.addEventListener('mouseover', canvasBoxMouseover);
    newCanvasBox.addEventListener('mouseleave', canvasBoxMouseleave);

    object.canvasBox = newCanvasBox;

    object.stretchPoints = [];

    unselectAll();

    // Create stretch points

    if (isModeFree(object.type)) {
        for (let point in object.points) {
            let polyPoint = object.points[point];
            let polyAdjusted = coordsBox(object.bBox, ...polyPoint);

            let stretchPoint = document.createElement('div');
            stretchPoint.classList.add('stretch-point');
            stretchPoint.setAttribute('point-index', point);

            stretchPoint.style.left = polyAdjusted[0] * zoom + "px";
            stretchPoint.style.top = polyAdjusted[1] * zoom + "px";

            stretchPoint.addEventListener('mousedown', stretchPointPolyMousedown);
            stretchPoint.addEventListener('mouseup', stretchPointPolyMouseup);

            newCanvasBox.appendChild(stretchPoint);

            object.stretchPoints.push(stretchPoint);
        }
    } else {
        let stretchPointDirections = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        for (let direction in stretchPointDirections) {
            let stretchPoint = document.createElement('div');
            stretchPoint.classList.add('stretch-point');
            
            stretchPoint.setAttribute('point-index', direction);

            stretchPoint.addEventListener('mousedown', stretchPointPolyMousedown);
            stretchPoint.addEventListener('mouseup', stretchPointPolyMouseup);

            newCanvasBox.appendChild(stretchPoint);

            object.stretchPoints.push(stretchPoint);
        }
        updateStretchPointPositions(object);
    }

    let rotationPoint = document.createElement('div');
    rotationPoint.classList.add('rotation-point');
    rotationPoint.setAttribute('object-id', object.index);

    rotationPoint.addEventListener('mousedown', rotatePointMousedown);

    object.rotationPoint = rotationPoint;

    newCanvasBox.appendChild(rotationPoint);

    canvasBoxes.appendChild(newCanvasBox);
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
            bBox = [Math.min(downX, upX), Math.min(downY, upY), Math.abs(downX - upX), shiftKey ? Math.abs(downX - upX) : Math.abs(downY - upY)]
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
        newItemProperties.opacity = opacity.value;

        if (mode === "text") {
            newItemProperties.fontSize = fontSize.value;
            newItemProperties.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
            newItemProperties.textHorizontalAlign = alignHActivated;
            newItemProperties.textVerticalAlign = alignVActivated;
        }

        if (mode === "rect") {
            newItemProperties.radiusX = 0;
            newItemProperties.radiusY = 0;
        }

        newItemProperties.rotation = 0;
        newItemProperties.zIndex = objects.filter(x => x).length;

        newItemProperties.element = updateObject(newItemProperties);

        newItemProperties.filter = {}

        // let objectFilter = createSVGElement('filter');
        // objectFilter.id = `object-${newItemProperties.index}-filter`;

        // newItemProperties.filterElement = objectFilter;

        // svgDefs.appendChild(objectFilter);

        updateFilter(newItemProperties);

        objects.push(newItemProperties);

        mainCanvas.insertBefore(newItemProperties.element, alignmentLineGroup);

        createCanvasBox(newItemProperties);

        unselectAll();
        select(newItemProperties);

        createTimelineEntry([newItemProperties,], "create", null, newItemProperties);
    }

    document.querySelector('#temp-obj')?.remove();

    downX = null;
    downY = null;
    upX = null;
    upY = null;

    mode = "none";

    unselectModes();
    
    polyPoints = [];

    updateInteractionBar();

    updateOrder();
}