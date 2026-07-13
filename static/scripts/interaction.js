function updateSelectedObject(change) {
    if (!selectedObjects) return;
    console.log("updating object");
    
    for (let object of selectedObjects) {
        if (change === "primary-color" || change === "color-switch") object.strokeColor = primCol.value;
        else if (change === "secondary-color" || change === "color-switch") object.fillColor = fill.checked ? scnCol.value : null; 
        else if (change === "line-width") object.strokeWidth = stroke.value;
        else if (change === "radius-x") object.radiusX = radiusX.value;
        else if (change === "radius-y") object.radiusY = radiusY.value;
        else if (change === "opacity") object.opacity = opacity.value;

        updateObject(object);
    }
}

switchCol.addEventListener('click', () => {
    const prevPrimaryCol = primCol.value;
    const prevSecondaryCol = scnCol.value;

    primCol.value = prevSecondaryCol;
    scnCol.value = prevPrimaryCol;

    updateSelectedObject("color-switch");
})

primCol.addEventListener('change', () => {
    updateSelectedObject("primary-color");
})

scnCol.addEventListener('change', () => {
    updateSelectedObject("secondary-color");
})

stroke.addEventListener('change', () => {
    updateSelectedObject("line-width");
})

fill.addEventListener('change', () => {
    updateSelectedObject("secondary-color");
})

fontSize.addEventListener('change', () => {
    updateSelectedObject("font-size");
})

radiusX.addEventListener('change', () => {
    updateSelectedObject("radius-x");
})

radiusY.addEventListener('change', () => {
    updateSelectedObject("radius-y");
})

opacity.addEventListener('change', () => {
    updateSelectedObject("opacity");
})

modes.forEach(el => el.addEventListener('click', () => {
    if (el.classList.contains('mode-active')) {
        el.classList.remove('mode-active');
        mode = "none";
        updateInteractionBar();
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
    
    if (selectedObjects.length > 0) {
        currentMode = selectedObjects[0].type;
    }

    stroke.style.display = "none";
    fill.style.display = "none";
    sides.style.display = "none";
    fontSize.style.display = "none";
    opacity.style.display = "none";
    controlPoints.style.display = "none";

    strokeLabel.style.display = "none";
    fillLabel.style.display = "none";
    sidesLabel.style.display = "none";
    fontSizeLabel.style.display = "none";
    opacityLabel.style.display = "none";    

    leftAlign.style.display = "none";
    centerAlign.style.display = "none";
    rightAlign.style.display = "none";
    topAlign.style.display = "none";
    middleAlign.style.display = "none";
    bottomAlign.style.display = "none";

    radiusX.style.display = "none";
    radiusY.style.display = "none";

    radiusXLabel.style.display = "none";
    radiusYLabel.style.display = "none";

    controlPointsLabel.style.display = "none";

    if (currentMode !== "none") {
        stroke.style.display = "";
        fill.style.display = "";

        strokeLabel.style.display = "";
        fillLabel.style.display = "";

        opacity.style.display = "";
        opacityLabel.style.display = "";

        if (selectedObjects.length === 1) {
            stroke.value = or(selectedObjects[0].strokeWidth, 1);
            fill.checked = or(selectedObjects[0].fillColor !== null, false);
            opacity.value = or(selectedObjects[0].opacity, 1);
        }
    }

    if (currentMode === "polygon-free" && !selectedObjects) {
        sides.style.display = "";
        sidesLabel.style.display = "";

        if (selectedObjects.length === 1) {
            sides.value = or(selectedObjects[0].points.length, 4);
        }
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

    if (currentMode === "rect") {
        radiusX.style.display = "";
        radiusY.style.display = "";

        radiusXLabel.style.display = "";
        radiusYLabel.style.display = "";
    }

    if (currentMode === "variable-curve") {
        controlPoints.style.display = "";
        controlPointsLabel.style.display = "";
    }
}

window.addEventListener('resize', () => {
    adjustZoom();
})

document.addEventListener('keydown', (event) => {
    let plain = !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
    
    if (plain) {
        switch (event.key.toLowerCase()) {
            case "l":
                mode = "line";
                break;
            case "r":
                mode = "rect";
                break;
            case "e":
                mode = "ellipse";
                break;
            case "c":
                mode = "triangle-scalene";
                break;
            case "i":
                mode = "triangle-isosceles";
                break;
            case "x":
                mode = "polygon-free";
                break;
            case "q":
                mode = "quadratic-curve";
                break;
            case "v":
                mode = "cubic-curve";
                break;
            case "t":
                mode = "text";
                break;
            default:
                break;
        }
        updateInteractionBar();
    }
})