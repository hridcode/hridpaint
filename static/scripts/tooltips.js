class Tooltip {
    constructor(element, content) {
        this.parent = element;
        this.content = content;
        this.element = document.createElement('div');

        this.element.classList.add("tooltip");
        this.element.innerText = content;
        this.parent.appendChild(this.element);
    }
}

new Tooltip(modeLine, "Line (L)");
new Tooltip(modeRect, "Rect (R)");
new Tooltip(modeEllipse, "Ellipse (E)");
new Tooltip(modeTriangleScalene, "Scalene triangle (C)");
new Tooltip(modeTriangleIsosceles, "Isosceles triangle (I)");
new Tooltip(modePolygonFree, "Polygon (X)");
new Tooltip(modeQuadraticCurve, "Quadratic curve (Q)");
new Tooltip(modeCubicCurve, "Cubic curve (V)");
new Tooltip(modeText, "Text (T)");
new Tooltip(primCol, "Primary color");
new Tooltip(switchCol, "Switch color (2)");
new Tooltip(scnCol, "Secondary color");

document.addEventListener('keydown', (event) => {
    let plain = !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
    
    if (plain) {
        switch (event.key.toLowerCase()) {
            case "l":
                mode = "line";
                break;
            case "r":
                mode = "rect";
                break;
            case "e":
                mode = "ellipse";
                break;
            case "c":
                mode = "triangle-scalene";
                break;
            case "i":
                mode = "triangle-isosceles";
                break;
            case "x":
                mode = "polygon-free";
                break;
            case "q":
                mode = "quadratic-curve";
                break;
            case "v":
                mode = "cubic-curve";
                break;
            case "t":
                mode = "text";
                break;
            default:
                break;
        }
        updateInteractionBar();
    }
})