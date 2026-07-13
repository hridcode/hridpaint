function updateOrder() {
    let sortedObjects = [...objects].filter(Boolean).sort((a, b) => a.zIndex - b.zIndex);

    for (let object in sortedObjects) {
        sortedObjects[object].zIndex = object;
    }

    for (let object of sortedObjects) {
        mainCanvas.insertBefore(object.element, alignmentLineGroup);
        canvasBoxes.appendChild(object.canvasBox);
    }
}

function pushObjectZIndex(object, direction = 1) {
    let sortedObjects = objects.filter(Boolean).sort((a, b) => a.zIndex - b.zIndex);

    const index = sortedObjects.indexOf(object);
    if (index === -1) return;

    const newIndex = Math.max(0, Math.min(index + direction, sortedObjects.length - 1));

    if (newIndex === index) return;

    sortedObjects.splice(index, 1);
    sortedObjects.splice(newIndex, 0, object);

    sortedObjects.forEach((obj, i) => obj.zIndex = i);

    updateOrder();
    updateSelectBar();
}

let draggedItem;
let dragging = false;

function selectBarMousedownListener(event) {
    event.preventDefault();

    draggedItem = event.target.closest('.object-name-container');
    
    if (dragging || !draggedItem) return;
    
    dragging = true;
    draggedItem.classList.add('dragging');
}

function selectBarMousemoveListener(event) {
    let target = event.target.closest('.object-name-container');

    if (dragging && target !== draggedItem) {
        const rect = target.getBoundingClientRect();

        if (event.clientY < rect.top + rect.height / 2) {
            selectList.insertBefore(draggedItem, target);
        } else {
            selectList.insertBefore(draggedItem, target.nextSibling);
        }
    }
}

function selectBarMouseupListener(event) {
    if (!dragging) return;

    dragging = false;

    let newOrder = Array.from(selectList.children).map(x => +x.querySelector('.object-name-index').textContent).reverse();
    
    objects.filter(Boolean).forEach((obj, i) => {
        obj.zIndex = newOrder[i];
    });

    updateOrder();

    draggedItem.classList.remove('dragging');
    draggedItem = null;
}

document.addEventListener('mouseup', selectBarMouseupListener);