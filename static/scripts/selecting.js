function canvasBoxMouseover(event) {
    if (canvasActivated || stretching) return;
}

function canvasBoxMouseleave(event) {
    //if (event.target === selectedObject?.canvasBox) return; 
}

function select(object, multi=false) {
    if (!multi) unselectAll();
    selecting = true;
    selectedObjects.push(object);
    object.canvasBox.classList.add('selected');
    updateInteractionBar();
    updateSelectBar();
}

function unselectAll() {
    selectedObjects = [];
    selecting = false;
    for (let objIndex in objects) {
        let obj = objects[objIndex];
        if (!obj) continue;
        obj.canvasBox.classList.remove('selected'); 
        obj.canvasBox.style.border = "none";
    }
    updateInteractionBar();
    updateSelectBar();
}

document.addEventListener('click', (event) => {
    if (!selecting || shiftKey) {
        let elementOverPoint = document.elementFromPoint(event.clientX, event.clientY);

        if (elementOverPoint.classList.contains('canvas-box') && mode === "none") {
            let overObject = objects[+elementOverPoint.getAttribute('object-id')];
            select(overObject, shiftKey);
        }

        return;
    };
    
    let [clickX, clickY] = mouseToCanvas(event);
    if (!mainCanvas.contains(document.elementFromPoint(event.clientX, event.clientY))) return;

    let inElement = false;

    for (let object of selectedObjects) {
        inElement = pointInElement(event.clientX, event.clientY, object.canvasBox);
        if (inElement) {
            return;
        }
    }

    unselectAll();
});

document.addEventListener('keydown', (event) => {
    if (event.key === "Delete") {
        for (let object of selectedObjects) { 
            let index = object.index;

            object.element.remove();
            object.canvasBox.remove();

            unselectAll();

            createTimelineEntry([object,], "delete", object, null);

            objects[index] = null;
            updateSelectBar();
        }
    } else if (event.key === "Escape") {
        if (canvasActivated) {
            canvasActivated = false;
            tempObj = null;
            polyPoints = [];
            document.querySelector('#temp-obj')?.remove();
        }

        if (selectedObjects) unselectAll(); updateInteractionBar();
    }
})

function updateSelectBar() {
    selectList.innerHTML = "";

    for (let object of objects) {
        if (!object) continue;
        let selected = selectedObjects.some(x => x.index === object.index);

        let objectNameContainer = document.createElement('div');
        objectNameContainer.classList.add('object-name-container');

        let indexLabel = document.createElement('label');
        indexLabel.textContent = object.index;
        indexLabel.classList.add('object-name-index');

        const newInput = document.createElement('input');
        newInput.classList.add('object-name-input');
        newInput.value = object.name || object.type.substring(0, 1).toUpperCase() + object.type.substring(1);

        if (selected) {
            objectNameContainer.classList.add('object-name-selected');
        }

        newInput.onchange = (event) => {
            object.name = newInput.value; 
        }

        indexLabel.onclick = () => {
            select(object, shiftKey);
        }

        objectNameContainer.appendChild(indexLabel);
        objectNameContainer.appendChild(newInput);

        selectList.appendChild(objectNameContainer);
    }
}