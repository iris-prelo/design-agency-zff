let numRings = 30;
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
let offset = 0; // Initialwert für den Offset
let animationSpeed = 0.02; // Geschwindigkeit der Animation

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  maxRadius = width * 0.4;
  noStroke();

  let sliderX = 20, textX = 230, sliderXRight = 450;
  let sliderY = windowHeight - 150;

  sliders.maxSize = createSlider(10, 100, maxSize, 1).position(sliderX, sliderY).style('width', '200px');
  sliders.minSize = createSlider(1, 30, minSize, 1).position(sliderX, sliderY + 30).style('width', '200px');
  sliders.circlesPerRing = createSlider(5, 170, circlesPerRing, 1).position(sliderX, sliderY + 60).style('width', '200px');
  sliders.scale = createSlider(0.1, 1, 0.7, 0.01).position(sliderX, sliderY + 90).style('width', '200px');
  sliders.ringSpacing = createSlider(5, 350, 15, 1).position(sliderXRight, height - 80).style('width', '200px');
  sliders.numRings = createSlider(10, 70, numRings, 1).position(sliderXRight, height - 50).style('width', '200px');
  sliders.cycleSpacing = createSlider(1, 10, 1, 1).position(sliderXRight, height - 120).style('width', '200px');
  sliders.cyclesPerRing = createSlider(1, 10, 3, 1).position(sliderXRight, height - 150).style('width', '200px');
  sliders.rotation1 = createSlider(0, 180, 15, 1).position(sliderXRight, height - 180).style('width', '200px');
  sliders.rotation2 = createSlider(0, 180, 15, 1).position(sliderXRight, height - 210).style('width', '200px');

  for (let key in sliders) {
    sliders[key].input(() => { isSliderActive = true; });
  }

  let labels = [
    ["Größter Kreis", textX, sliderY - 15],
    ["Kleinster Kreis", textX, sliderY + 15],
    ["Kreise pro Ring", textX, sliderY + 45],
    ["Skalierung", textX, sliderY + 75],
    ["Abstand der Ringe", sliderXRight + 210, height - 95],
    ["Anzahl der Ringe", sliderXRight + 210, height - 65],
    ["Abstand der Zyklen", sliderXRight + 210, height - 125],
    ["Zyklen pro Ring", sliderXRight + 210, height - 155],
    ["Rotation Gruppe 1 (2,5,8,...)", sliderXRight + 210, height - 185],
    ["Rotation Gruppe 2 (3,6,9,...)", sliderXRight + 210, height - 215]
  ];
  
  labels.forEach(([txt, x, y]) => createP(txt).position(x, y).style('color', 'white'));

  lastMouseX = mouseX;
  lastMouseY = mouseY;
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
  let rotationAngle1 = sliders.rotation1.value();
  let rotationAngle2 = sliders.rotation2.value();

  offset += animationSpeed; // Erhöhe den Offset kontinuierlich
  if (offset > TWO_PI) {
    offset = 0; // Zurücksetzen, um die Animation zyklisch zu halten
  }

  let circleSpacing = 360 / circlesPerRing;

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

    rotateX(camRotX);
    rotateY(camRotY);
    rotateX(PI * 160 / 180);
    rotateY(PI);
  }

  fill(255);

  for (let ringIndex = 0; ringIndex < numRings; ringIndex++) {
    let t = map(ringIndex, 0, numRings, 0, 1);
    let ringZ = -200 + ringIndex * ringSpacing;
    let ringRadius = lerp(maxRadius, minRadius, t);

    let ringSizeFactor = map(ringIndex, 0, numRings, 1, 0.3);
    let adjustedMaxSize = maxSize * ringSizeFactor;
    let adjustedMinSize = minSize * ringSizeFactor;

    let rotationStep = (circlesPerRing / 4) * (PI / 180);
    let ringRotation = 0;

    if ((ringIndex + 1) % 3 === 2) { 
      ringRotation = rotationStep * rotationAngle1 * 0.05;
    } else if ((ringIndex + 1) % 3 === 0) { 
      ringRotation = rotationStep * rotationAngle2* 0.05;
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
    isExporting = true;  
    let fileName = 'high_res_export.png';

    saveCanvas(fileName, 'png');
    isExporting = false;  
  }
}
