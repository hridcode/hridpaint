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