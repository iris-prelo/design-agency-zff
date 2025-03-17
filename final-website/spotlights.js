let numRings = 0;
let circlesPerRing = 60;
let maxRadius;
let minRadius = 5;
let camRotX = 0, camRotY = 0;
let targetRotX = 0, targetRotY = 0;
let maxSize = 30, minSize = 3;
let sliders = {};
let lastMouseX, lastMouseY;
let isSliderActive = false;
let isExporting = false;
let highResGraphics;

function setup() {
  let canvasContainer = select('#canvas-container');
  if (!canvasContainer) {
    console.error('Canvas container not found');
    return;
  }
  let canvas = createCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight, WEBGL);
  canvas.parent('canvas-container');
  resizeCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight);
  maxRadius = width * 0.4;
  noStroke();

  // Create high-res buffer (4× size)
  highResGraphics = createGraphics(width * 4, height * 4, WEBGL);
  
  let slidersContainer = select('#sliders-container');
  if (!slidersContainer) {
    console.error('Sliders container not found');
    return;
  }
  function addSlider(label, min, max, value, step) {
    let p = createP(label).parent(slidersContainer);
    let slider = createSlider(min, max, value, step).parent(slidersContainer);
    return slider;
  }
  
  sliders.maxSize = addSlider('Max Size', 10, 100, maxSize, 1);
  sliders.minSize = addSlider('Min Size', 1, 30, minSize, 1);
  sliders.circlesPerRing = addSlider('Circles Per Ring', 5, 70, circlesPerRing, 1);
  sliders.scale = addSlider('Scale', 0.05, 2, 0.7, 0.01);
  sliders.ringSpacing = addSlider('Ring Spacing', 1, 100, 15, 1);
  sliders.numRings = addSlider('Number of Rings', 0, 200, numRings, 1);
  sliders.cycleSpacing = addSlider('Cycle Spacing', 1, 10, 1, 1);
  sliders.cyclesPerRing = addSlider('Cycles Per Ring', 1, 10, 3, 1);
  sliders.offset = addSlider('Offset', 0, TWO_PI, 0, 0.01);
  sliders.rotationX = addSlider('Rotation X', 0, 360, 0, 1);
  sliders.rotationY = addSlider('Rotation Y', 0, 360, 0, 1);
  sliders.opacityEven = addSlider('Opacity Every 2nd', 0, 255, 255, 1);
  sliders.opacityOdd = addSlider('Opacity Rest', 0, 255, 255, 1);
  sliders.stretchFactor = addSlider('Stretch Every 3rd', 0.5, 3, 1, 0.1);

  // Create Export Button
  let exportButton = createButton('Export High-Res Screenshot');
  exportButton.parent(slidersContainer);
  exportButton.style('margin-top', '10px');  // Ensure spacing
  exportButton.style('padding', '8px 12px'); // Improve visibility
  exportButton.mousePressed(() => {
    isExporting = true;
  });

  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function windowResized() {
  let canvasContainer = select('#canvas-container');
  resizeCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight);
  maxRadius = width * 0.4;
  highResGraphics = createGraphics(width * 4, height * 4, WEBGL);
}

function draw() {
  if (isExporting) {
    drawScene(highResGraphics, 4);  // Draw high-res version
    save(highResGraphics, 'screenshot.png');  // Save file
    isExporting = false;
  } else {
    drawScene(this, 1);  // Normal rendering
  }
}

function drawScene(graphics, scaleFactor) {
  graphics.clear();
  graphics.background(0);
  graphics.push();
  graphics.scale(scaleFactor);
  
  let maxSize = sliders.maxSize.value();
  let minSize = sliders.minSize.value();
  let circlesPerRing = sliders.circlesPerRing.value();
  let ringSpacing = sliders.ringSpacing.value();
  let numRings = sliders.numRings.value();
  let scaleVal = sliders.scale.value();
  let cycleSpacing = sliders.cycleSpacing.value();
  let cyclesPerRing = sliders.cyclesPerRing.value();
  let offset = sliders.offset.value();
  let rotationAngleX = sliders.rotationX.value();
  let rotationAngleY = sliders.rotationY.value();
  let opacityEven = sliders.opacityEven.value();
  let opacityOdd = sliders.opacityOdd.value();
  let stretchFactor = sliders.stretchFactor.value();

  graphics.scale(scaleVal);
  graphics.rotateX(radians(rotationAngleX));
  graphics.rotateY(radians(rotationAngleY));
  
  for (let ringIndex = numRings - 1; ringIndex >= 0; ringIndex--) {
    let ringZ = -200 + ringIndex * ringSpacing;
    let ringRadius = lerp(minRadius, maxRadius, ringIndex / numRings);
    let adjustedMaxSize = maxSize * (ringIndex / numRings);
    let adjustedMinSize = minSize * (ringIndex / numRings);
    
    for (let circleIndex = 0; circleIndex < circlesPerRing; circleIndex++) {
      let baseAngle = map(circleIndex, 0, circlesPerRing, 0, TWO_PI);
      let x = cos(baseAngle) * ringRadius;
      let y = sin(baseAngle) * ringRadius;
      let circleSize = lerp(adjustedMinSize, adjustedMaxSize, (1 + sin(baseAngle * cyclesPerRing + offset)) / 2);
      let isEven = circleIndex % 2 === 0;
      let isThird = circleIndex % 3 === 0;
      
      let opacity = isEven ? opacityEven : opacityOdd;
      let stretch = isThird ? stretchFactor : 1;
      
      graphics.fill(255, opacity);
      graphics.push();
      graphics.translate(x, y, ringZ);
      graphics.ellipse(0, 0, circleSize * stretch, circleSize);
      graphics.pop();
    }
  }
  
  graphics.pop();
}

function keyPressed() {
  if (key === ' ') {
    numRings = min(numRings * 2, 200);
    sliders.numRings.value(numRings);
  } else if (keyCode === BACKSPACE) {
    numRings = max(0, numRings - 1);
    sliders.numRings.value(numRings);
  } else if (key === 's') { 
    isExporting = true;  // Trigger high-res export when 's' is pressed
  }
}
