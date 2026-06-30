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