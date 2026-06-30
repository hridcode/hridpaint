let homeObjects = [];
let fadingObjects = [];

let homeActivated = true;

const homeSvg = document.getElementById('home-animation');

let randomType = () => {["rect", "ellipse"][Math.round(Math.random())]}
let printurn = x => console.log(x) || x;

const htmlColors = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

function animationStep(timestamp) {
    if (!homeActivated) return;
    // if (start === undefined) {
    //     start = timestamp;
    // }
    // const elapsed = timestamp - start;

    for (let object of homeObjects) {
        object.x += object.xVel;
        object.y += object.yVel;

        if (object.x <= 0 || object.x + object.width >= window.innerWidth) {
            object.xVel *= -1;
            if (object.x <= 0) object.x = 0;
            if (object.x + object.width >= window.innerWidth) object.x = window.innerWidth - object.width;    
        }
        
        if (object.y <= 0 || object.y + object.height >= window.innerHeight) {
            object.yVel *= -1;
            if (object.y <= 0) object.y = 0;
            if (object.y + object.height >= window.innerHeight) object.y = window.innerHeight - object.height;    
        }

        object.element.setAttribute("x", object.x);
        object.element.setAttribute("y", object.y);
    }

    for (let objectIndex in fadingObjects) {
        let fadingObject = fadingObjects[objectIndex];
        
        if (!fadingObject) continue;
        fadingObject.opacity += fadingObject.opacitySpeed * fadingObject.opacityDirection;
        fadingObject.element.setAttribute("fill-opacity", fadingObject.opacity);

        if (fadingObject.opacity >= fadingObject.opacityThreshold) {
            homeObjects.push(fadingObject);
            fadingObjects.splice(objectIndex, 1);
        }

        if (fadingObject.opacity <= 0) {
            fadingObject.element.remove();
            fadingObjects.splice(objectIndex, 1);
        }
    }

    if (Math.random() <= 0.03) {
        let newHomeObject = {};

        newHomeObject.width = Math.max(window.innerWidth / 20, Math.floor(Math.random() * window.innerWidth / 10));
        newHomeObject.height = Math.max(window.innerHeight / 20, Math.floor(Math.random() * window.innerHeight / 10));

        newHomeObject.x = Math.floor(
            Math.random() * (window.innerWidth - newHomeObject.width)
        );

        newHomeObject.y = Math.floor(
            Math.random() * (window.innerHeight - newHomeObject.height)
        );

        newHomeObject.xVel = Math.random();
        newHomeObject.yVel = Math.random();

        newHomeObject.opacitySpeed = 0.01;//Math.pow(Math.random(), 2) / 20;
        newHomeObject.opacityThreshold = 0.5;//Math.max(0.3, Math.min(0.5, Math.pow(Math.random(), 2) / 2));
        newHomeObject.opacityDirection = 1;

        newHomeObject.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        
        newHomeObject.element.setAttribute("x", newHomeObject.x);
        newHomeObject.element.setAttribute("y", newHomeObject.y);
        newHomeObject.element.setAttribute("rx", Math.floor(Math.random() * newHomeObject.width));
        newHomeObject.element.setAttribute("ry", Math.floor(Math.random() * newHomeObject.height));
        newHomeObject.element.setAttribute("width", newHomeObject.width);
        newHomeObject.element.setAttribute("height", newHomeObject.height);
        newHomeObject.element.setAttribute("fill", htmlColors[Math.floor(Math.random() * htmlColors.length)]);
        newHomeObject.element.setAttribute("fill-opacity", 0);

        newHomeObject.opacity = 0;

        fadingObjects.push(newHomeObject);

        homeSvg.appendChild(newHomeObject.element);
        
        if (homeObjects.length >= 250) {
            let fadeOutObject = homeObjects.shift();
            fadeOutObject.opacityDirection = -1;
            fadingObjects.push(fadeOutObject);
        }
    }

    requestAnimationFrame(animationStep);
}

requestAnimationFrame(animationStep);