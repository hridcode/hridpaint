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

saveProject.addEventListener('click', () => {saveProjectDialog.style.display = "block"});

newProject.addEventListener('click', () => {newProjectDialog.style.display = "block"});

newProjectAction.addEventListener('click', () => {
    newProjectDialog.style.display = "none";
    homePage.style.display = "none";
    mainPage.style.display = "block";
    
    canvasWidth = +newProjectCanvasWidth.value;
    canvasHeight = +newProjectCanvasHeight.value;

    zoom = window.innerHeight >= window.innerWidth ? window.innerHeight * 0.45 / canvasHeight : window.innerWidth * 0.45 / canvasHeight;
    zoom = Math.floor(zoom / 0.05) * 0.05;
        
    adjustZoom();
    
    canvasBoundingRect = mainCanvas.getBoundingClientRect();

    homeActivated = false;
    homeObjects = null;
    homeSvg.innerHTML = "";
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

styleSelect.addEventListener('click', () => {objectStyleDialog.style.display = "block"});