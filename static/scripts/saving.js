function projectFormat(description = "") {
    // transparent 600 600 f

    // 0 rect ""
    // - b$ 25 25 25 25
    // - s$ 6 #ffffff
    // - f$ 1 #eeeeee
    // - e$shadow dx=5 dy=5 stDev=3.2 #dddddd 0.84
    // - e$blur 3.3
    // - e$lighting 50 50 100 #ffffff
    // 1 cubic-curve "Curve"
    // - p$ 150,150 25,25 15,15 300,300
    // - s$ 6 black
    // - f$ 0

    // --meta
    // - d$ "cool projec"

    let content = `transparent ${canvasWidth} ${canvasHeight}\n\n`;

    for (let object of objects) {
        if (!object) continue;
        let objectBlock = '';

        objectBlock += `${object.index} ${object.type} "${object.name || ""}"`
        objectBlock += "\n";
        
        if (isModeFree(object.type)) {
            console.log(object);
            let pointsX = object.points.map(x => x[0]);
            let pointsY = object.points.map(x => x[1]);

            let minX = Math.min(...pointsX);
            let maxX = Math.max(...pointsX);
            
            let minY = Math.min(...pointsY);
            let maxY = Math.max(...pointsY);
            
            objectBlock += `- b$ ${minX} ${minY} ${maxX - minX} ${maxY - minY}\n`;
            objectBlock += `- p$ ${object.points.map(x => x.join(',')).join(' ')}\n`;
        } else {
            objectBlock += `- b$ ${object.bBox.join(' ')}\n`;    
        }
        
        objectBlock += `- s$ ${object.strokeWidth} ${object.strokeColor}\n`;
        objectBlock += `- f$ ${object.fillColor === null ? 0 : 1} ${object.fillColor || ''}\n`;
        objectBlock += `- o$ ${object.opacity}\n`;
        objectBlock += `- r$ ${object.rotation}\n`;
        
        if (object.type === "rect") {
            objectBlock += `- rd$ x=${object.radiusX} y=${object.radiusY}\n`;
        }

        if (object.type === "image") {
            objectBlock += `- iu$ ${object.dimensions[0]} ${object.dimensions[1]} ${object.url}`
        }

        for (let effect in object.filter) {
            let effectLine = `- e$${effect} `;

            for (let attribute in object.filter[effect]) {
                effectLine += `${attribute}=${object.filter[effect][attribute]} `;
            }

            effectLine += '\n';

            objectBlock += effectLine;
        }

        content += objectBlock;
    }

    content += '\n';
    content += "--meta ";
    content += `description=${description}\n`;

    return content;
}

function openProjectFile(content) {
    let contentLines = content.trim().split('\n');

    let firstLine = contentLines[0];
    let middleLines = contentLines.slice(1, -1);
    let lastLine = contentLines.slice(-1)[0];

    let firstLineWords = firstLine.split(" ");
    let newWidth = +firstLineWords[1];
    let newHeight = +firstLineWords[2];

    let currObj = {};
    let tempObjList = [];

    for (let line of middleLines) {
        if (!line) continue;
        if (!line.startsWith("- ")) {
            if (Object.values(currObj).length > 0) {
                tempObjList.push(currObj);
                currObj = {};
            };
            let lineWords = line.split(" ");
            currObj.index = +lineWords[0];
            currObj.type = lineWords[1];
            currObj.filter = {};
            if (lineWords[2] !== '""') {
                currObj.name = lineWords.slice(2).join(" ").slice(1, -1);
            }
        } else {
            let trimLine = line.substring(2);
            let tag = trimLine.split("$")[0];

            let params = trimLine.split("$")[1].trim().split(" ");

            switch (tag) {
                case "b":
                    currObj.bBox = params.map(Number);
                    break;
                case "p":
                    currObj.points = params.map(x => x.split(",").map(Number));
                    break;
                case "s":
                    currObj.strokeWidth = +params[0];
                    currObj.strokeColor = params[1];
                    break;
                case "f":
                    currObj.fillColor = params[0] === "1" ? params[1] : null;
                    break;
                case "e":
                    let effectType = params[0];
                    currObj.filter[effectType] = {};

                    for (let parameter of params.slice(1)) {
                        let [name, value] = parameter.split("=");
                        currObj.filter[effectType][name] = isNaN(+value) ? value : +value;
                    }
                    break;
                case "o":
                    currObj.opacity = +params[0];
                    break;
                case "r":
                    currObj.rotation = isNaN(+params[0]) ? 0 : +params[0];
                    break;
                case "rd":
                    currObj.radiusX = +params[0].split("=")[1];
                    currObj.radiusY = +params[1].split("=")[1];
                    break;
                case "iu":
                    currObj.url = params[0];
                    currObj.dimensions = [+params[1], +params[2]];
                    break;
                default:
                    break;
            }
        }
    }

    if (currObj) tempObjList.push(currObj);

    return {
        width: newWidth,
        height: newHeight,
        objects: tempObjList
    }
}

function download(filename, url, isObjectURL = true) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (isObjectURL) {
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
}

saveAction.addEventListener('click', () => {
    svgCheckerboardBackground.style.display = "none";
    const format = saveFormat.value;

    const blob = new Blob(
        [mainCanvas.outerHTML],
        { type: "image/svg+xml;charset=utf-8" }
    );

    const svgUrl = URL.createObjectURL(blob);

    if (format === "svg") {
        download(`${saveFilename.value}.svg`, svgUrl);
        return;
    }

    const img = new Image();

    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const url = canvas.toDataURL(`image/${format}`);
        URL.revokeObjectURL(svgUrl);

        download(`${saveFilename.value}`, url, false);
    };

    img.src = svgUrl;
    svgCheckerboardBackground.style.display = "";
});

saveProjectAction.addEventListener('click', () => {
    const projectBlob = new Blob([projectFormat()], {type: 'application/octet-stream'});
    const projectURL = URL.createObjectURL(projectBlob);

    download(`${saveProjectFilename.value}.hxj`, projectURL);
})

async function projectFileListener() {
    const [handle] = await window.showOpenFilePicker({
        types: [{
            description: "hridPaint file",
            accept: {
                "application/octet-stream": [".hxj"]
            }
        }]
    });

    const file = await handle.getFile();
    const text = await file.text();

    const openData = openProjectFile(text);
    
    canvasWidth = openData.width;
    canvasHeight = openData.height;

    adjustZoom();

    objects = openData.objects;

    for (let objectIndex in objects) {
        let object = objects[objectIndex];
        objects[objectIndex].element = updateObject(object);
        mainCanvas.appendChild(objects[objectIndex].element);
        createCanvasBox(object);
        updateFilter(object);
    }
}

openProject.addEventListener('click', async () => {
    homePage.style.display = "none";
    mainPage.style.display = "block";
    projectFileListener();
})

openProjectInt.addEventListener('click', projectFileListener);

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
            case "s":
                showDialog(saveDialog);
                event.preventDefault();
                break;
            case "p":
                showDialog(saveProjectDialog);
                event.preventDefault();
                break;
            case "o":
                projectFileListener();
                event.preventDefault();
                break;    
        }
    }
})