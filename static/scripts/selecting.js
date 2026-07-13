function canvasBoxMouseover(event) {
    if (canvasActivated || stretching) return;
}

function canvasBoxMouseleave(event) {
    //if (event.target === selectedObject?.canvasBox) return; 
}

function select(object, multi=false) {
    if (!multi) unselectAll();
    let group = groups.filter(x => x.indexOf(object) > 0);
    if (group.length === 0) group = [object,];

    for (let object of group) {
        selecting = true;
        selectedObjects.push(object);
        canvasBoxes.appendChild(object.canvasBox);
        object.canvasBox.classList.add('selected');
    }    
    
    updateInteractionBar();
    updateSelectBar();
    updateObjectDataBox();
}

function unselectAll() {
    selectedObjects = [];
    selecting = false;
    for (let objIndex in objects) {
        let obj = objects[objIndex];
        if (!obj || !obj.canvasBox) continue;
        obj.canvasBox.classList.remove('selected'); 
        obj.canvasBox.style.border = "none";
    }
    updateInteractionBar();
    updateSelectBar();
    updateObjectDataBox();
    updateOrder();
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

            createTimelineEntry([object,], "delete", object, null);

            objects[index] = null;
        }
        unselectAll();
        updateSelectBar();
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

    let sortedObjects = [...objects].filter(Boolean);
    sortedObjects.sort((a, b) => b.zIndex - a.zIndex);

    for (let object of sortedObjects) {
        if (!object) continue;
        let selected = selectedObjects.some(x => x.index === object.index);

        let objectNameContainer = document.createElement('div');
        objectNameContainer.classList.add('object-name-container');

        objectNameContainer.setAttribute('draggable', true);

        let dragCircle = document.createElement('div');
        dragCircle.classList.add('object-name-drag-ball');

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

        objectNameContainer.appendChild(dragCircle);
        objectNameContainer.appendChild(indexLabel);
        objectNameContainer.appendChild(newInput);

        dragCircle.addEventListener('mousedown', selectBarMousedownListener);
        objectNameContainer.addEventListener('mousemove', selectBarMousemoveListener);

        selectList.appendChild(objectNameContainer);
    }
}

let groups = [];

function inGroup(object) {
    for (let group of groups) {
        if (group.indexOf(object) > 0) return false;
    }
    return true;
}

function makeGroup(objects) {
    groups.push(objects.filter(Boolean).filter(inGroup).map(x => x.index));
    return groups.length - 1;
}

function breakGroup(objects) {

}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.altKey) {
        if (event.key.toLowerCase() === "g") {
            if (!event.shiftKey) {
                makeGroup(selectedObjects);
                select(selectedObjects[0]);
            } else {
                breakGroup(selectedObjects);            
            }
        }
    }
})