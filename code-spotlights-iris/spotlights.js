let numRings = 30;
let circlesPerRing = 60;
let maxRadius;
let minRadius = 5;
let camRotX = 0, camRotY = 0;
let maxSize = 30, minSize = 3;
let sliders = {};
let isExporting = false;
let offset = 0;
let animationSpeed = 0.02;

function setup() {
  let canvas = createCanvas(windowWidth - 250, windowHeight, WEBGL);
  canvas.position(250, 0);
  maxRadius = width * 0.4;
  noStroke();

  let sidebar = createDiv('').id('sidebar');
  sidebar.style('position', 'fixed');
  sidebar.style('left', '0');
  sidebar.style('top', '0');
  sidebar.style('width', '250px');
  sidebar.style('height', '100%');
  sidebar.style('background', '#333');
  sidebar.style('padding', '15px');
  sidebar.style('color', 'white');
  sidebar.style('overflow-y', 'auto');

  function addSlider(name, min, max, value, step) {
    let label = createP(name).parent(sidebar);
    label.style('color', 'white');
    sliders[name] = createSlider(min, max, value, step).parent(sidebar).style('width', '100%');
  }

  addSlider("Größter Kreis", 10, 100, maxSize, 1);
  addSlider("Kleinster Kreis", 1, 30, minSize, 1);
  addSlider("Kreise pro Ring", 5, 170, circlesPerRing, 1);
  addSlider("Skalierung", 0.1, 1, 0.7, 0.01);
  addSlider("Abstand der Ringe", 5, 350, 15, 1);
  addSlider("Anzahl der Ringe", 0, 70, numRings, 1);
  addSlider("Abstand der Zyklen", 1, 10, 1, 1);
  addSlider("Zyklen pro Ring", 1, 10, 3, 1);
  addSlider("Rotation Gruppe 1", 0, 180, 15, 1);
  addSlider("Rotation Gruppe 2", 0, 180, 15, 1);
  addSlider("Globale Rotation", 0, 180, 15, 1);
  addSlider("Rotation X", 0, 360, 160, 1);
  addSlider("Rotation Y", 0, 360, 180, 1);
}

function drawScene() {
  background(0);

  maxSize = sliders["Größter Kreis"].value();
  minSize = sliders["Kleinster Kreis"].value();
  circlesPerRing = sliders["Kreise pro Ring"].value();
  let ringSpacing = sliders["Abstand der Ringe"].value();
  numRings = sliders["Anzahl der Ringe"].value();
  let scaleFactor = sliders["Skalierung"].value();
  let cyclesPerRing = sliders["Zyklen pro Ring"].value();
  let rotationAngle1 = sliders["Rotation Gruppe 1"].value();
  let rotationAngle2 = sliders["Rotation Gruppe 2"].value();
  let globalRotation = sliders["Globale Rotation"].value();
  let rotX = radians(sliders["Rotation X"].value());
  let rotY = radians(sliders["Rotation Y"].value());

  offset += animationSpeed;
  if (offset > TWO_PI) offset = 0;

  scale(scaleFactor);
  rotateX(rotX);
  rotateY(rotY);

  fill(255);
  for (let ringIndex = 0; ringIndex < numRings; ringIndex++) {
    let t = map(ringIndex, 0, numRings, 0, 1);
    let ringZ = -200 + ringIndex * ringSpacing;
    let ringRadius = lerp(maxRadius, minRadius, t);
    let ringSizeFactor = map(ringIndex, 0, numRings, 1, 0.3);
    let adjustedMaxSize = maxSize * ringSizeFactor;
    let adjustedMinSize = minSize * ringSizeFactor;
    let rotationStep = (circlesPerRing / 4) * (PI / 180);
    let ringRotation = rotationStep * (globalRotation * 0.05);

    if ((ringIndex + 1) % 3 === 2) {
      ringRotation += rotationStep * rotationAngle1 * 0.05;
    } else if ((ringIndex + 1) % 3 === 0) {
      ringRotation += rotationStep * rotationAngle2 * 0.05;
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

function draw() {
  drawScene();
}

function keyPressed() {
  if (key === ' ') {
    isExporting = true;
    let originalWidth = width;
    let originalHeight = height;
    resizeCanvas(originalWidth * 4, originalHeight * 4);
    drawScene();
    saveCanvas('high_res_screenshot', 'png');
    resizeCanvas(originalWidth, originalHeight);
    isExporting = false;
  }
}
