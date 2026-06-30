const hueSlider = document.getElementById('hue-slider');
const saturationSlider = document.getElementById('saturation-slider');
const valueSlider = document.getElementById('value-slider');

const rSlider = document.getElementById('r-slider');
const gSlider = document.getElementById('g-slider');
const bSlider = document.getElementById('b-slider');

const colorResult = document.getElementById('color-result');

const hsvTab = document.getElementById('hsv-tab');
const rgbTab = document.getElementById('rgb-tab');

const colorTabs = {
    rgb: {
        element: document.getElementById('rgb-select'),
        tab: rgbTab
    },
    hsv: {
        element: document.getElementById('hsv-select'),
        tab: hsvTab
    }
};

let currentColorTab = "rgb";

for (const tabName in colorTabs) {
    colorTabs[tabName].element.addEventListener('click', () => {
        currentColorTab = tabName;

        // Hide all tab contents
        Object.values(colorTabs).forEach(tab => {
            tab.tab.style.display = "none";
            tab.element.classList.remove('selected-tab');
        });

        // Show selected tab content
        colorTabs[tabName].tab.style.display = "";
        colorTabs[tabName].element.classList.add('selected-tab');

        console.log('tab');
    });
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ]
}

class Slider {
    constructor(parent) {
        this.parent = parent;
        this.sliderGrab = parent.querySelector('.slider-grab');

        this.parentRect = this.parent.getBoundingClientRect();
        this.sliderGrabRect = this.sliderGrab.getBoundingClientRect();

        this.value = 0;
        this.moving = false;

        this.sliderGrab.addEventListener('mousedown', (event) => {
            this.moving = true;
        })
        
        document.addEventListener('mousemove', (event) => {
            if (!this.moving) return;

            let offset = (event.clientX - this.parentRect.left) - (this.sliderGrabRect.width / 2);

            offset = Math.max(
                0,
                Math.min(offset, this.parentRect.width - this.sliderGrabRect.width)
            );

            this.sliderGrab.style.transform = `translateX(${offset}px)`;
            this.update();
        })
        
        document.addEventListener('mouseup', (event) => {
            this.moving = false;
        })
    }

    update() {
        this.parentRect = this.parent.getBoundingClientRect();
        this.sliderGrabRect = this.sliderGrab.getBoundingClientRect();

        let sliderWidth = this.parentRect.width - this.sliderGrabRect.width;
        this.value = Math.abs(this.parentRect.x - this.sliderGrabRect.x) / sliderWidth;
        this.value = Math.min(1, this.value);
        this.value = +this.value.toFixed(3);
        this.change();
    }

    setValue(value) {
        this.value = Math.min(0, Math.max(1, value));
        this.update();
    }

    change() {}
}

let hueSliderObject = new Slider(hueSlider);
let saturationSliderObject = new Slider(saturationSlider);
let valueSliderObject = new Slider(valueSlider);

let rSliderObject = new Slider(rSlider);
let gSliderObject = new Slider(gSlider);
let bSliderObject = new Slider(bSlider);

function updateColorResultHSV() {
    let color = HSVtoRGB(hueSliderObject.value, saturationSliderObject.value, valueSliderObject.value);
    colorResult.style.backgroundColor = `rgb(${color.join(", ")})`;    
}

function updateColorResultRGB() {
    let color = [rSliderObject.value * 255, gSliderObject.value * 255, bSliderObject.value * 255];
    colorResult.style.backgroundColor = `rgb(${color.join(", ")})`;    
}

hueSliderObject.change = updateColorResultHSV;
saturationSliderObject.change = updateColorResultHSV;
valueSliderObject.change = updateColorResultHSV;

rSliderObject.change = updateColorResultRGB;
gSliderObject.change = updateColorResultRGB;
bSliderObject.change = updateColorResultRGB;

updateColorResultHSV();