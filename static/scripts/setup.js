const homePage = document.getElementById('home-content');
const mainPage = document.getElementById('main-content');

const mainCanvas = document.getElementById('main-canvas');
const canvasBoxes = document.getElementById('canvas-boxes');
const editor = document.getElementById('editor');

const svgDefs = document.getElementById('svg-defs');

let canvasWidth = 800;
let canvasHeight = 600;

editor.style.width = canvasWidth + "px";
editor.style.height = canvasHeight + "px";

const saveAs = document.getElementById('save-as');
const saveDialog = document.getElementById('save-dialog');
const saveFormat = document.getElementById('save-format');
const saveQuality = document.getElementById('save-quality');
const saveAction = document.getElementById('save-action');
const saveFilename = document.getElementById('save-filename');
const savePercentage = document.getElementById('save-percentage');

const saveProject = document.getElementById('save-project');
const saveProjectDialog = document.getElementById('save-project-dialog');
const saveProjectFilename = document.getElementById('save-proj-filename');
const saveProjectAction = document.getElementById('save-proj-action');

const closeButtons = document.querySelectorAll('.close');
const dialogs = document.querySelectorAll('.dialog-box');

const zoomBox = document.getElementById('zoom-box');
const zoomMinus = document.getElementById('zoom-minus');
const zoomPlus = document.getElementById('zoom-plus');
const zoomPercentage = document.getElementById('zoom-percentage');

const newProject = document.getElementById('new-project');
const openProject = document.getElementById('open-project');
const openProjectInt = document.getElementById('open-project-int');
const openImage = document.getElementById('open-image');

const newProjectDialog = document.getElementById('new-project-dialog');
const newProjectAction = document.getElementById('new-project-action');
const newProjectCanvasWidth = document.getElementById('canvas-width-input');
const newProjectCanvasHeight = document.getElementById('canvas-height-input');
const newProjectColor = document.getElementById('canvas-color-input');
const newProjectOpacity = document.getElementById('canvas-opacity-input');
const canvasInchDimensions = document.getElementById('canvas-inch-dimensions');

const svgBackground = document.getElementById('svg-background');
const svgCheckerboardBackground = document.getElementById('svg-checkerboard-background');

const styleSelect = document.getElementById('style-select');
const objectStyleDialog = document.getElementById('object-style-dialog');

const modeLine = document.getElementById('line');
const modeRect = document.getElementById('rect');
const modeEllipse = document.getElementById('ellipse');
const modeTriangleScalene = document.getElementById('triangle-scalene');
const modeTriangleIsosceles = document.getElementById('triangle-isosceles');
const modePolygonFree = document.getElementById('polygon-free');
const modeQuadraticCurve = document.getElementById('quadratic-curve');
const modeCubicCurve = document.getElementById('cubic-curve');
const modeText = document.getElementById('text');
const modes = [modeLine, modeRect, modeEllipse, modeTriangleScalene, modeTriangleIsosceles, modePolygonFree, modeQuadraticCurve, modeCubicCurve, modeText];

const stroke = document.getElementById('stroke');
const fill = document.getElementById('fill');
const sides = document.getElementById('sides');
const fontSize = document.getElementById('font-size');
const radiusX = document.getElementById('rect-x');
const radiusY = document.getElementById('rect-y');
const opacity = document.getElementById('opacity');

const strokeLabel = document.getElementById('stroke-label');
const fillLabel = document.getElementById('fill-label');
const sidesLabel = document.getElementById('sides-label');
const fontSizeLabel = document.getElementById('font-size-label');
const radiusXLabel = document.getElementById('rect-x-label');
const radiusYLabel = document.getElementById('rect-y-label');
const opacityLabel = document.getElementById('opacity-label');

let canvasDragging = false;
let canvasDragOffset;
let canvasDragPosition = [0, 0];
let canvasDragPositionBuffer = [0, 0];

const leftAlign = document.getElementById('left-align');
const rightAlign = document.getElementById('right-align');
const centerAlign = document.getElementById('center-align');
const topAlign = document.getElementById('top-align');
const middleAlign = document.getElementById('middle-align');
const bottomAlign = document.getElementById('bottom-align');

const textAlignH = document.querySelectorAll('.text-align-h');
const textAlignV = document.querySelectorAll('.text-align-v');

let alignHActivated = "left";
let alignVActivated = "top";

textAlignH.forEach(el => el.addEventListener('click', () => {
    alignHActivated = el.id.slice(0, -6);
    textAlignH.forEach(el => el.classList.remove('activated'));
    el.classList.add('activated');
}))

textAlignV.forEach(el => el.addEventListener('click', () => {
    alignVActivated = el.id.slice(0, -6);
    textAlignV.forEach(el => el.classList.remove('activated'));
    el.classList.add('activated');
}))

const primCol = document.getElementById('primcol');
const scnCol = document.getElementById('scncol');

const switchCol = document.getElementById('switch');

let stretchObject;
let stretchPoint;
let stretching = false;

let selecting = false;
let selectedObjects = [];

const selectBar = document.getElementById('right-bar');
const selectList = document.getElementById('objects-list');

let moving = false;
let moveObjects = [];
let moveOffset;
let moveStart;

let rotating = false;
let rotateObject;

let shiftKey = false;
let altKey = false;

let zoom = 1;

let canvasBoundingRect = mainCanvas.getBoundingClientRect();

let canvasActivated = false;

let downX, downY;
let upX, upY;

let downClickX, downClickY;

let polyPoints = [];

let objects = [];

let mode = "none";

let alignSnapRadius = 3;