function projectFormat() {
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
        let objectBlock = '';

        objectBlock += `${object.index} ${object.type} "${object.name || ""}"`
        objectBlock += "\n";
        
        if (isModeFree(object)) {
            objectBlock += `- p$ ${object.points.map(x => x.join(',')).join(' ')}\n`;
        } else {
            objectBlock += `- b$ ${object.bBox.join(' ')}\n`;    
        }
        
        objectBlock += `- s$ ${object.strokeWidth} ${object.strokeColor}\n`;
        objectBlock += `- f$ ${object.fillColor === null ? 0 : 1} ${object.fillColor || ''}\n`;
        
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

    return content;
}

saveAction.addEventListener('click', () => {
    const format = saveFormat.value;

    const blob = new Blob(
        [mainCanvas.outerHTML],
        { type: "image/svg+xml;charset=utf-8" }
    );

    const svgUrl = URL.createObjectURL(blob);

    if (format === "svg") {
        download(svgUrl);
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

        download(url, false);
    };

    img.src = svgUrl;

    function download(url, isObjectURL = true) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${saveProjectFilename.value}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (isObjectURL) {
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    }
});