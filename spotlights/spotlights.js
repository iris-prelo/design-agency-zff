let numRings = 5; // Start with some rings to avoid an empty screen
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

function setup() {
  let canvasContainer = select('#canvas-container');
  if (!canvasContainer) {
    console.error('Canvas container not found');
    return;
  }

  let canvas = createCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight, WEBGL);
  console.log('Canvas created with dimensions:', canvas.width, canvas.height);
  canvas.parent('canvas-container');
  resizeCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight);
  maxRadius = width * 0.4;
  noStroke();

  let slidersContainer = select('#sliders-container');
  if (!slidersContainer) {
    console.error('Sliders container not found');
    return;
  }

  sliders.maxSize = createSlider(10, 100, maxSize, 1).parent(slidersContainer);
  sliders.minSize = createSlider(1, 30, minSize, 1).parent(slidersContainer);
  sliders.circlesPerRing = createSlider(5, 70, circlesPerRing, 1).parent(slidersContainer);
  sliders.scale = createSlider(0.1, 1, 0.7, 0.01).parent(slidersContainer);
  sliders.ringSpacing = createSlider(5, 50, 15, 1).parent(slidersContainer);
  sliders.numRings = createSlider(0, 70, numRings, 1).parent(slidersContainer);
  sliders.cycleSpacing = createSlider(1, 10, 1, 1).parent(slidersContainer);
  sliders.cyclesPerRing = createSlider(1, 10, 3, 1).parent(slidersContainer);
  sliders.offset = createSlider(0, TWO_PI, 0, 0.01).parent(slidersContainer);
  sliders.rotation1 = createSlider(0, 180, 15, 1).parent(slidersContainer);
  sliders.rotation2 = createSlider(0, 180, 15, 1).parent(slidersContainer);

  // Add labels for sliders
  createP('Max Size').parent(slidersContainer);
  sliders.maxSize.parent(slidersContainer);
  createP('Min Size').parent(slidersContainer);
  sliders.minSize.parent(slidersContainer);
  createP('Circles Per Ring').parent(slidersContainer);
  sliders.circlesPerRing.parent(slidersContainer);
  createP('Scale').parent(slidersContainer);
  sliders.scale.parent(slidersContainer);
  createP('Ring Spacing').parent(slidersContainer);
  sliders.ringSpacing.parent(slidersContainer);
  createP('Number of Rings').parent(slidersContainer);
  sliders.numRings.parent(slidersContainer);
  createP('Cycle Spacing').parent(slidersContainer);
  sliders.cycleSpacing.parent(slidersContainer);
  createP('Cycles Per Ring').parent(slidersContainer);
  sliders.cyclesPerRing.parent(slidersContainer);
  createP('Offset').parent(slidersContainer);
  sliders.offset.parent(slidersContainer);
  createP('Rotation 1').parent(slidersContainer);
  sliders.rotation1.parent(slidersContainer);
  createP('Rotation 2').parent(slidersContainer);
  sliders.rotation2.parent(slidersContainer);

  lastMouseX = mouseX;
  lastMouseY = mouseY;
  console.log('Setup complete');
}

function windowResized() {
  let canvasContainer = select('#canvas-container');
  resizeCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight);
  maxRadius = width * 0.4;
}

function draw() {
  background(0);

  maxSize = sliders.maxSize.value();
  minSize = sliders.minSize.value();
  circlesPerRing = sliders.circlesPerRing.value();
  let ringSpacing = sliders.ringSpacing.value();
  numRings = sliders.numRings.value();
  let scaleFactor = sliders.scale.value();
  let cycleSpacing = sliders.cycleSpacing.value();
  let cyclesPerRing = sliders.cyclesPerRing.value();
  let offset = sliders.offset.value();
  let rotationAngle1 = sliders.rotation1.value();
  let rotationAngle2 = sliders.rotation2.value();

  scale(scaleFactor);

  if (!isExporting) {
    if (mouseIsPressed && !isSliderActive) {
      let deltaX = mouseX - lastMouseX;
      let deltaY = mouseY - lastMouseY;
      targetRotX += deltaY * 0.01;
      targetRotY += deltaX * 0.01;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }
    camRotX = lerp(camRotX, targetRotX, 0.1);
    camRotY = lerp(camRotY, targetRotY, 0.1);
    rotateX(camRotX);    function setup() {
      let canvasContainer = select('#canvas-container');
      if (!canvasContainer) {
        console.error('Canvas container not found');
        return;
      }
    
      let canvas = createCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight, WEBGL);
      console.log('Canvas created with dimensions:', canvas.width, canvas.height);
      canvas.parent('canvas-container');
      resizeCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight);
      maxRadius = width * 0.4;
      noStroke();
    
      let slidersContainer = select('#sliders-container');
      if (!slidersContainer) {
        console.error('Sliders container not found');
        return;
      }
    
      sliders.maxSize = createSlider(10, 100, maxSize, 1).parent(slidersContainer);
      sliders.minSize = createSlider(1, 30, minSize, 1).parent(slidersContainer);
      sliders.circlesPerRing = createSlider(5, 70, circlesPerRing, 1).parent(slidersContainer);
      sliders.scale = createSlider(0.1, 1, 0.7, 0.01).parent(slidersContainer);
      sliders.ringSpacing = createSlider(5, 50, 15, 1).parent(slidersContainer);
      sliders.numRings = createSlider(0, 70, numRings, 1).parent(slidersContainer);
      sliders.cycleSpacing = createSlider(1, 10, 1, 1).parent(slidersContainer);
      sliders.cyclesPerRing = createSlider(1, 10, 3, 1).parent(slidersContainer);
      sliders.offset = createSlider(0, TWO_PI, 0, 0.01).parent(slidersContainer);
      sliders.rotation1 = createSlider(0, 180, 15, 1).parent(slidersContainer);
      sliders.rotation2 = createSlider(0, 180, 15, 1).parent(slidersContainer);
      sliders.distortion = createSlider(0.5, 2, 1, 0.01).parent(slidersContainer); // New slider for distortion
    
      // Add labels for sliders
      createP('Max Size').parent(slidersContainer);
      sliders.maxSize.parent(slidersContainer);
      createP('Min Size').parent(slidersContainer);
      sliders.minSize.parent(slidersContainer);
      createP('Circles Per Ring').parent(slidersContainer);
      sliders.circlesPerRing.parent(slidersContainer);
      createP('Scale').parent(slidersContainer);
      sliders.scale.parent(slidersContainer);
      createP('Ring Spacing').parent(slidersContainer);
      sliders.ringSpacing.parent(slidersContainer);
      createP('Number of Rings').parent(slidersContainer);
      sliders.numRings.parent(slidersContainer);
      createP('Cycle Spacing').parent(slidersContainer);
      sliders.cycleSpacing.parent(slidersContainer);
      createP('Cycles Per Ring').parent(slidersContainer);
      sliders.cyclesPerRing.parent(slidersContainer);
      createP('Offset').parent(slidersContainer);
      sliders.offset.parent(slidersContainer);
      createP('Rotation 1').parent(slidersContainer);
      sliders.rotation1.parent(slidersContainer);
      createP('Rotation 2').parent(slidersContainer);
      sliders.rotation2.parent(slidersContainer);
      createP('Distortion').parent(slidersContainer); // Label for distortion slider
      sliders.distortion.parent(slidersContainer);
    
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      console.log('Setup complete');
    }
    rotateY(camRotY);
  }

  fill(255);

  for (let ringIndex = numRings - 1; ringIndex >= 0; ringIndex--) {
    let ringZ = -200 + ringIndex * ringSpacing;
    let ringRadius = lerp(minRadius, maxRadius, ringIndex / numRings);
    let adjustedMaxSize = maxSize * (ringIndex / numRings);
    let adjustedMinSize = minSize * (ringIndex / numRings);

    let ringRotation = ((ringIndex + 1) % 4 === 2) ? rotationAngle1 : 
                       ((ringIndex + 1) % 4 === 3) ? rotationAngle2 : 0;

    for (let circleIndex = 0; circleIndex < circlesPerRing; circleIndex++) {
      let baseAngle = map(circleIndex, 0, circlesPerRing, 0, TWO_PI);
      let rotatedAngle = baseAngle + ringRotation;
      let x = cos(rotatedAngle) * ringRadius;
      let y = sin(rotatedAngle) * ringRadius;
      let circleSize = lerp(adjustedMinSize, adjustedMaxSize, (1 + sin(baseAngle * cyclesPerRing + offset)) / 2);
      push();
      translate(x, y, ringZ);
      ellipse(0, 0, circleSize, circleSize);
      pop();
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    numRings = min(numRings * 2, 70);
    sliders.numRings.value(numRings);
  } else if (keyCode === BACKSPACE) {
    numRings = max(0, numRings - 1);
    sliders.numRings.value(numRings);
  }
}
