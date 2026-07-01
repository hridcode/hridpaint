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

        const newLabel = document.createElement('label');
        newLabel.textContent = object.name || (object.type.substring(0, 1).toUpperCase() + object.type.substring(1) + ", " + object.index);

        if (selected && !newLabel.textContent.startsWith('(')) {
            newLabel.textContent = '(' + newLabel.textContent + ')';
            console.log(newLabel.textContent)
        }

        newLabel.onclick = (event) => {
            // let selected = selectedObjects.map(x => x.index).indexOf(object.index) > 0;
            
            if (!shiftKey) {
                selectList.querySelectorAll('label').forEach(x => {
                    x.textContent = x.textContent.replace(/^\(|\)$/g, '');
                });
            }

            select(object, shiftKey);
        }

        selectList.appendChild(newLabel);
    }
}