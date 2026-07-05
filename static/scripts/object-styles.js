const shadowTab = document.getElementById('obj-shadow-tab');
const blurTab = document.getElementById('obj-blur-tab');
const lightingTab = document.getElementById('obj-lighting-tab');

const objShadowActivated = document.getElementById('obj-shadow-activate');
const objShadowDX = document.getElementById('obj-shadow-dx');
const objShadowDY = document.getElementById('obj-shadow-dy');
const objShadowStDev = document.getElementById('obj-shadow-stdev');
const objShadowFloodColor = document.getElementById('obj-shadow-flood-color');
const objShadowFloodOpacity = document.getElementById('obj-shadow-flood-opacity');

const objBlurActivated = document.getElementById('obj-blur-activate');
const objBlurStDev = document.getElementById('obj-blur-stdev');

const objLightingActivated = document.getElementById('obj-lighting-activate');
const objLightingX = document.getElementById('obj-lighting-x');
const objLightingY = document.getElementById('obj-lighting-y');
const objLightingZ = document.getElementById('obj-lighting-z');
const objLightingColor = document.getElementById('obj-lighting-color');

let currentStyleTab;

const styleAction = document.getElementById('style-action');

const styleTabs = {
    shadow: {
        element: document.getElementById('obj-shadow-select'),
        tab: shadowTab
    },
    blur: {
        element: document.getElementById('obj-blur-select'),
        tab: blurTab
    },
    lighting: {
        element: document.getElementById('obj-lighting-select'),
        tab: lightingTab
    }
};

for (const tabName in styleTabs) {
    styleTabs[tabName].element.addEventListener('click', () => {
        currentStyleTab = tabName;

        // Hide all tab contents
        Object.values(styleTabs).forEach(tab => {
            tab.tab.style.display = "none";
            tab.element.classList.remove('selected-tab');
        });

        // Show selected tab content
        styleTabs[tabName].tab.style.display = "";
        styleTabs[tabName].element.classList.add('selected-tab');

        console.log('tab');
    });
}

styleAction.addEventListener('click', () => {
    for (let object of selectedObjects) {
        object.filter.shadow = objShadowActivated.checked ? {
            dX: +objShadowDX.value,
            dY: +objShadowDY.value,
            stDev: +objShadowStDev.value,
            floodColor: objShadowFloodColor.value,
            floodOpacity: +objShadowFloodOpacity.value
        } : null;

        object.filter.blur = objBlurActivated.checked ? {
            stDev: +objBlurStDev.value
        } : null;

        object.filter.lighting = objLightingActivated.checked ? {
            x: +objLightingX.value,
            y: +objLightingY.value,
            z: +objLightingZ.value,
            color: objLightingColor.value
        } : null;

        updateFilter(object);
    }
})

function updateFilter(object) {
    let objectFilter = object.filterElement;
    if (!objectFilter) {
        object.filterElement = createSVGElement('filter');
        object.filterElement.id = `object-${object.index}-filter`;
        svgDefs.appendChild(object.filterElement);
        objectFilter = object.filterElement;
    }
    objectFilter.innerHTML = "";

    for (let filter in object.filter) {
        if (Object.values(object.filter[filter]).length === 0) continue;
        switch (filter) {
            case "shadow":
                let shadowObject = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
            
                shadowObject.setAttribute('dx', object.filter.shadow.dX);
                shadowObject.setAttribute('dy', object.filter.shadow.dY);
                shadowObject.setAttribute('stdDeviation', object.filter.shadow.stDev);
                shadowObject.setAttribute('flood-color', object.filter.shadow.floodColor);
                shadowObject.setAttribute('flood-opacity', object.filter.shadow.floodOpacity);

                objectFilter.appendChild(shadowObject);
                break;
            case "blur":
                let blurObject = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
                blurObject.setAttributeNS('http://www.w3.org/2000/svg', 'stdDeviation', object.filter.blur.stDev);

                objectFilter.appendChild(blurObject);
                break;
            case "lighting":
                let lightingObject = document.createElementNS('http://www.w3.org/2000/svg', 'feDiffuseLighting');

                lightingObject.setAttribute('lighting-color', object.filter.lighting.color);
                lightingObject.setAttribute('in', 'SourceGraphic');
                lightingObject.setAttribute('result', 'lighting');

                let pointLightObject = document.createElementNS('http://www.w3.org/2000/svg', 'fePointLight');

                pointLightObject.setAttribute('x', object.filter.lighting.x);
                pointLightObject.setAttribute('y', object.filter.lighting.y);
                pointLightObject.setAttribute('z', object.filter.lighting.z);
                
                lightingObject.appendChild(pointLightObject);

                objectFilter.appendChild(lightingObject);

                let compositeObject = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');

                compositeObject.setAttribute('in', 'SourceGraphic');
                compositeObject.setAttribute('in2', 'lighting');
                compositeObject.setAttribute('operator', 'arithmetic');
                compositeObject.setAttribute('k1', 1);
                compositeObject.setAttribute('k2', 0);
                compositeObject.setAttribute('k3', 0);
                compositeObject.setAttribute('k4', 0);
            
                objectFilter.appendChild(compositeObject);

                break;
            default:
                break;
        }
    }

    if (Object.keys(object.filter).length === 0) {
        object.element.removeAttributeNS('http://www.w3.org/2000/svg', 'filter');
    } else {
        object.element.setAttribute('filter', `url(#object-${object.index}-filter)`);
    }
}