let timeline = [];
let timelineCursor = -1;

let deletedObjects = [];

function createTimelineEntry(object, action, previousValue, newValue) {
    timeline.push({
        objects: object.map(x => x.index),
        action: action,
        previous: previousValue,
        new: newValue
    });

    timelineCursor = timeline.length - 1;
}

function reverseTimelineEntry(entry) {
    unselectAll();

    let timelineObjects = entry.objects.map(x => objects[x]);
    let object;

    switch (entry.action) {
        case "create":
            if (timelineObjects.length !== 1) return;
            object = timelineObjects[0];
            object.element.remove();
            object.canvasBox.remove();
            objects[entry.object] = null;
            break;
        case "delete":
            if (timelineObjects.length !== 1) return;
            object = timelineObjects[0];

            objects[entry.objects[0]] = entry.previous;
            updateObject(objects[entry.objects[0]]);
            createCanvasBox(objects[entry.objects[0]]);
            // console.log(objects[entry.object]);
            mainCanvas.appendChild(objects[entry.objects[0]].element);
            break;
        case "stretch":
            break;
        case "move":
            for (let objectIndex in timelineObjects) {
                object = timelineObjects[objectIndex];
                object.bBox[0] = entry.previous[objectIndex][0];
                object.bBox[1] = entry.previous[objectIndex][1];
                updateObject(object);
            }
            break;
        default:
            break;
    }

    updateSelectBar();
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        let keyLetter = event.key.toLowerCase();
        if (keyLetter === "z") {
            if (timelineCursor >= 0) {
                reverseTimelineEntry(timeline[timelineCursor]);
                timelineCursor--;
            }
        } else {
            if (timelineCursor < timeline.length - 1) {
                timelineCursor++;
            }
        }
    }
})