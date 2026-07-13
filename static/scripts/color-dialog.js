const hSlider = document.getElementById('h-slider');
const sSlider = document.getElementById('s-slider');
const vSlider = document.getElementById('v-slider');
const hInput = document.getElementById('h-input');
const sInput = document.getElementById('s-input');
const vInput = document.getElementById('v-input');

const rSlider = document.getElementById('r-slider');
const gSlider = document.getElementById('g-slider');
const bSlider = document.getElementById('b-slider');
const rInput = document.getElementById('r-input');
const gInput = document.getElementById('g-input');
const bInput = document.getElementById('b-input');

const colorResult = document.getElementById('color-result');

const hsvTab = document.getElementById('hsv-tab');
const rgbTab = document.getElementById('rgb-tab');
const gradientTab = document.getElementById('gradient-tab');

const colorDialog = document.getElementById('color-dialog');
const colorDialogConfirm = document.getElementById('color-action');
const colorDialogTopBar = document.getElementById('color-dialog-top-bar');

let primaryColor = "rgb(0, 0, 0)";
let secondaryColor = "rgb(0, 0, 0)";

const colorTabs = {
    rgb: {
        element: document.getElementById('rgb-select'),
        tab: rgbTab
    },
    hsv: {
        element: document.getElementById('hsv-select'),
        tab: hsvTab
    },
    // gradient: {
    //     element: document.getElementById('gradient-select'),
    //     tab: gradientTab
    // }
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

function linkRangeInput(range, input) {
    range.addEventListener('input', () => {
        input.value = range.value; 
    })

    input.addEventListener('input', () => {
        range.value = input.value; 
    })
}

function linkInputsBar(mode, ...inputs) {
    for (let input of inputs) {
        if (mode === "rgb") {
            input.addEventListener('input', () => {
                colorDialogTopBar.style.backgroundColor = `rgb(${rSlider.value}, ${gSlider.value}, ${bSlider.value})`;
            })
        } else if (mode === "hsv") {
            input.addEventListener('input', () => {
                let hsvColor = HSVtoRGB(hSlider.value / 360, sSlider.value, vSlider.value);
                colorDialogTopBar.style.backgroundColor = `rgb(${hsvColor.join(", ")})`;
            })
        }
    }
}

linkRangeInput(rSlider, rInput);
linkRangeInput(gSlider, gInput);
linkRangeInput(bSlider, bInput);
linkRangeInput(hSlider, hInput);
linkRangeInput(sSlider, sInput);
linkRangeInput(vSlider, vInput);

linkInputsBar("rgb", rSlider, gSlider, bSlider, rInput, gInput, bInput);
linkInputsBar("hsv", hSlider, sSlider, vSlider, hInput, sInput, vInput);

let colorActivated;

primCol.addEventListener('click', () => {
    colorActivated = 0;
    colorDialogTopBar.style.backgroundColor = primaryColor;
    showDialog(colorDialog);
})

scnCol.addEventListener('click', () => {
    colorActivated = 1;
    colorDialogTopBar.style.backgroundColor = secondaryColor;
    showDialog(colorDialog);
})

colorDialogConfirm.addEventListener('click', () => {
    if (colorActivated === 0) {
        primaryColor = colorDialogTopBar.style.backgroundColor;
        updateSelectedObject("primary-color");
    } else {
        secondaryColor = colorDialogTopBar.style.backgroundColor;
        updateSelectedObject("secondary-color");
    }

    closeDialog(colorDialog);
    updateColorButtons();
})

function updateColorButtons() {
    primCol.style.backgroundColor = primaryColor;
    scnCol.style.backgroundColor = secondaryColor;
}

updateColorButtons();