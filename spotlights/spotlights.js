let numRings = 0; // Start with 0 rings
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
  let canvas = createCanvas(canvasContainer.width, canvasContainer.height, WEBGL);
  canvas.parent('canvas-container');
  resizeCanvas(canvasContainer.width, canvasContainer.height);
  maxRadius = width * 0.4;
  noStroke();

  let slidersContainer = select('#sliders-container');

  sliders.maxSize = createSlider(10, 100, maxSize, 1).parent(slidersContainer);
  sliders.minSize = createSlider(1, 30, minSize, 1).parent(slidersContainer);
  sliders.circlesPerRing = createSlider(5, 70, circlesPerRing, 1).parent(slidersContainer);
  sliders.scale = createSlider(0.1, 1, 0.7, 0.01).parent(slidersContainer);
  sliders.ringSpacing = createSlider(5, 50, 15, 1).parent(slidersContainer);
  sliders.numRings = createSlider(0, 70, numRings, 1).parent(slidersContainer); // Updated to start at 0
  sliders.cycleSpacing = createSlider(1, 10, 1, 1).parent(slidersContainer);
  sliders.cyclesPerRing = createSlider(1, 10, 3, 1).parent(slidersContainer);
  sliders.offset = createSlider(0, TWO_PI, 0, 0.01).parent(slidersContainer);
  sliders.rotation1 = createSlider(0, 180, 15, 1).parent(slidersContainer);
  sliders.rotation2 = createSlider(0, 180, 15, 1).parent(slidersContainer);

  for (let key in sliders) {
    sliders[key].input(() => { isSliderActive = true; });
  }

  let labels = [
    ["Größter Kreis", sliders.maxSize],
    ["Kleinster Kreis", sliders.minSize],
    ["Kreise pro Ring", sliders.circlesPerRing],
    ["Skalierung", sliders.scale],
    ["Abstand der Ringe", sliders.ringSpacing],
    ["Anzahl der Ringe", sliders.numRings],
    ["Abstand der Zyklen", sliders.cycleSpacing],
    ["Zyklen pro Ring", sliders.cyclesPerRing],
    ["Verschiebung des Verlaufs", sliders.offset],
    ["Rotation Gruppe 1 (2,6,10,...)", sliders.rotation1],
    ["Rotation Gruppe 2 (3,7,11,...)", sliders.rotation2]
  ];

  labels.forEach(([txt, slider]) => {
    let label = createP(txt).parent(slidersContainer);
    label.class('slider-label');
    slider.parent(slidersContainer);
  });

  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function windowResized() {
  let canvasContainer = select('#canvas-container');
  resizeCanvas(canvasContainer.width, canvasContainer.height);
  maxRadius = width * 0.4;
}

function mouseReleased() {
  isSliderActive = false;
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

  let circleSpacing = 360 / circlesPerRing;

  scale(scaleFactor); // Die Skalierung bleibt konstant

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

    rotateX(camRotX);
    rotateY(camRotY);
    rotateX(PI * 160 / 180);
    rotateY(PI);
  }

  fill(255);

  for (let ringIndex = numRings - 1; ringIndex >= 0; ringIndex--) {
    let t = map(ringIndex, 0, numRings, 0, 1);
    let ringZ = -200 + ringIndex * ringSpacing;
    let ringRadius = lerp(minRadius, maxRadius, t);

    let ringSizeFactor = map(ringIndex, 0, numRings, 0.3, 1);
    let adjustedMaxSize = maxSize * ringSizeFactor;
    let adjustedMinSize = minSize * ringSizeFactor;

    let rotationStep = (circlesPerRing / 4) * (PI / 180);
    let ringRotation = 0;

    if ((ringIndex + 1) % 4 === 2) { 
      ringRotation = rotationStep * rotationAngle1;
    } else if ((ringIndex + 1) % 4 === 3) { 
      ringRotation = rotationStep * rotationAngle2;
    }

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

// Export-Funktion: Verdoppelt die Auflösung, speichert aber ohne Skalierung der Objekte
function keyPressed() {
  if (key === ' ') {  
    if (numRings === 0) {
      numRings = 1; // Add one ring on the first press
    } else {
      numRings = min(numRings * 2, 70); // Double the number of rings, ensuring it doesn't exceed 70
    }
    sliders.numRings.value(numRings); // Update the slider value
  } else if (keyCode === BACKSPACE) {
    numRings = max(0, numRings - 1); // Decrement the number of rings, ensuring it doesn't go below 0
    sliders.numRings.value(numRings); // Update the slider value
  }
}
