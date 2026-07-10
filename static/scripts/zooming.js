function adjustZoom() {
    zoom = Math.max(0.05, zoom);

    editor.style.width = canvasWidth * zoom + 'px';
    editor.style.height = canvasHeight * zoom + 'px';

    for (let object of objects) {
        if (!object) continue;
        object.canvasBox.style.left = object.bBox[0] * zoom + 'px';
        object.canvasBox.style.top = object.bBox[1] * zoom + 'px';
        object.canvasBox.style.width = object.bBox[2] * zoom + 'px';
        object.canvasBox.style.height = object.bBox[3] * zoom + 'px';

        updateStretchPointPositions(object);
        updateObject(object);
    }

    mainCanvas.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
    mainCanvas.setAttribute("width", canvasWidth);
    mainCanvas.setAttribute("height", canvasHeight);

    zoomPercentage.textContent = `${(zoom * 100).toFixed(0)}%`

    canvasBoundingRect = mainCanvas.getBoundingClientRect();
    // drawBackgroundCheckerboard();
}


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