function blobToDataURL(blob) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

document.addEventListener('copy', async (event) => {
    console.log('copying');
    let objectsToCopy = [...selectedObjects].filter(x => x);
    for (let object in objectsToCopy) {
        objectsToCopy[object] = {...objectsToCopy[object]};

        delete objectsToCopy[object].element;
        delete objectsToCopy[object].index;
        delete objectsToCopy[object].canvasBox;
        delete objectsToCopy[object].stretchPoints;
        delete objectsToCopy[object].rotationPoint;
        delete objectsToCopy[object].filterElement;
    }

    event.clipboardData.setData("text/plain", JSON.stringify(objectsToCopy));
    event.preventDefault();
})

document.addEventListener('paste', async (event) => {
    console.log('pasting');
    for (const item of event.clipboardData.items) {
        if (item.type.startsWith('image/')) {
            const blob = item.getAsFile();

            const url = await blobToDataURL(blob);

            const image = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'image'
            );

            const bitmap = await createImageBitmap(blob);

            const [x, y] = [0, 0]// mouseToCanvas(event);

            const newObj = {
                bBox: [x, y, bitmap.width, bitmap.height],
                url: url,
                type: "image",
                dimensions: [bitmap.width, bitmap.height],
                index: objects.length,
                element: image
            }

            createCanvasBox(newObj);

            select(newObj);
        
            objects.push(newObj);

            image.setAttribute('href', url);
            image.setAttribute('x', 0);
            image.setAttribute('y', 0);
            image.setAttribute('width', bitmap.width);
            image.setAttribute('height', bitmap.height);
            image.setAttribute('object-id', newObj.index);

            document.getElementById('main-canvas').appendChild(image);
        } else if (item.type === "text/plain") {
            item.getAsString((content) => {
                console.log(content);
                try {
                    unselectAll();

                    let contentJSON = JSON.parse(content);
                    
                    for (let object of contentJSON) {
                        object.index = objects.length;
                        
                        object.element = updateObject(object);
                        mainCanvas.appendChild(object.element);

                        createCanvasBox(object);
                        updateFilter(object);
                        select(object, true);

                        objects.push(object);
                    }
                        
                    updateSelectBar();
                } catch (e) {
                    console.log(e);
                }
            })    
        }
    }
});