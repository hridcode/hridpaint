function blobToDataURL(blob) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

document.addEventListener('paste', async (event) => {
    console.log('pasting');
    for (const item of event.clipboardData.items) {
        console.log(item.type);
        if (!item.type.startsWith('image/')) continue;

        console.log(item.type);

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
    }
});