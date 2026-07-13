let dialogKeyframes = [
    {
        opacity: 0,
        transform: "translate(-50%, calc(-50% + 15px))",
        easing: "ease"
    },
    {
        opacity: 1,
        transform: "translate(-50%, -50%)"
    }
];

let dialogTiming = 300;

function showDialog(dialog) {
    dialog.style.display = "block";
    dialog.animate(dialogKeyframes, dialogTiming);
}

function closeDialog(dialog) {
    if (dialog.style.display !== "none") {
        dialog.animate(dialogKeyframes, {
            duration: dialogTiming,
            direction: "reverse"
        })
        setTimeout(x => dialog.style.display = "none", dialogTiming);
    }
}

let pageKeyframes = [
    {opacity: 0, easing: "ease"},
    {opacity: 1}
]

function switchPages(direction = 0) {
    let page1 = homePage;
    let page2 = mainPage;

    if (direction === 1) {
        page1 = mainPage;
        page2 = homePage;
    }

    page1.animate(
        pageKeyframes,
        {
            duration: dialogTiming,
            direction: "reverse"
        }
    )
    page2.style.display = "block";
    page2.animate(pageKeyframes, dialogTiming);
    setTimeout(x => page1.style.display = "none", dialogTiming);
}

saveAs.addEventListener('click', () => {showDialog(saveDialog)})

saveProject.addEventListener('click', () => {showDialog(saveProjectDialog)});

newProject.addEventListener('click', () => {showDialog(newProjectDialog)});

newProjectAction.addEventListener('click', () => {
    closeDialog(newProjectDialog);
    switchPages();
    
    canvasWidth = +newProjectCanvasWidth.value;
    canvasHeight = +newProjectCanvasHeight.value;

    zoom = window.innerHeight >= window.innerWidth ? window.innerHeight * 0.45 / canvasHeight : window.innerWidth * 0.45 / canvasHeight;
    zoom = Math.floor(zoom / 0.05) * 0.05;
        
    adjustZoom();
    
    canvasBoundingRect = mainCanvas.getBoundingClientRect();

    homeActivated = false;
    homeObjects = null;
    homeSvg.innerHTML = "";

    svgBackground.setAttribute('fill', newProjectColor.value);
    svgBackground.setAttribute('opacity', newProjectOpacity.value);
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

styleSelect.addEventListener('click', () => {showDialog(objectStyleDialog)});

const closeButtons = document.querySelectorAll('.close');
const dialogs = document.querySelectorAll('.dialog-box');

updateInteractionBar();

adjustZoom();

closeButtons.forEach(x => {
    console.log(x);
    x.addEventListener('click', () => {
        console.log("closing")
        dialogs.forEach(closeDialog);
    })
})

objectDataContent.style.setProperty(
    "--content-width",
    `${objectDataContent.scrollWidth}px`
);

objectDataCollapse.addEventListener("click", () => {
    const collapsed = objectDataBox.classList.toggle("collapsed");

    if (!collapsed) {
        objectDataContent.style.setProperty(
            "--content-width",
            `${objectDataContent.scrollWidth}px`
        );
    }
});

function updateObjectDataBox() {
    if (selectedObjects.length !== 1) {
        objectPosition.textContent = "-";
        objectDimensions.textContent = "-";
        objectCenter.textContent = "-";
    } else {
        let selectedBox = selectedObjects[0].bBox;
        objectPosition.textContent = `(${selectedBox[0].toFixed(2)}, ${selectedBox[1].toFixed(2)})`;
        objectDimensions.textContent = `W${selectedBox[2].toFixed(2)}, H${selectedBox[2].toFixed(2)}`;
        objectCenter.textContent = `(${(selectedBox[0] + selectedBox[2] / 2).toFixed(2)}, ${(selectedBox[1] + selectedBox[3] / 2).toFixed(2)})`
    }
}

function addTooltip(element, content) {
    let tooltip = document.createElement('div');

    tooltip.classList.add("tooltip");
    tooltip.innerText = content;
    element.appendChild(tooltip);
}

addTooltip(modeLine, "Line (L)");
addTooltip(modeRect, "Rect (R)");
addTooltip(modeEllipse, "Ellipse (E)");
addTooltip(modeTriangleScalene, "Scalene triangle (C)");
addTooltip(modeTriangleIsosceles, "Isosceles triangle (I)");
addTooltip(modePolygonFree, "Polygon (X)");
addTooltip(modeQuadraticCurve, "Quadratic curve (Q)");
addTooltip(modeCubicCurve, "Cubic curve (V)");
//addTooltip(modeText, "Text (T)");
addTooltip(primCol, "Primary color");
addTooltip(switchCol, "Switch color (2)");
addTooltip(scnCol, "Secondary color");

addTooltip(objectDataCollapse, "View object data");

let inactiveElements = document.querySelectorAll('.unfinished');
inactiveElements.forEach(el => {
    addTooltip(el, "Work in progress");
})

let contextMenu;

function createContextMenu(x, y, element, content) {
    if (contextMenu) contextMenu.remove();

    contextMenu = document.createElement('div');

    contextMenu.classList.add('context-menu');

    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';

    for (let item of content) {
        let contextOption = document.createElement('div');
        contextOption.classList.add('context-option');

        contextOption.textContent = item.text;
        contextOption.addEventListener('click', item.handler);
    }

    return contextMenu;
}