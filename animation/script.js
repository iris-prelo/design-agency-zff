let numRings = 30; // Number of rings
let circlesPerRing = 40; // Number of circles per ring
let maxRadius; // Maximum width of the top ring
let minRadius = 5; // Minimum width of the bottom ring
let camRotX = 0; // Camera rotation around X
let camRotY = 0; // Camera rotation around Y
let targetRotX = 0; // Target rotation for smooth movement
let targetRotY = 0;
let maxSize = 30; // Maximum size of circles
let minSize = 3; // Minimum size of circles
let maxSlider, minSlider, circlesSlider, ringSpacingSlider, ringsSlider, scaleSlider, cycleSpacingSlider, cyclesPerRingSlider;
let offsetSlider, rotationSlider; // Sliders for gradient offset and ring rotation
let lastMouseX, lastMouseY; // For tracking mouse movement
let isSliderActive = false; // Flag to check if slider is active
let isMousePressedLast = false; // Flag to check mouse status
let isAnimating = false;
let animationProgress = 0;
let animationSpeed = 0.005;
let targetNumRings = 30;
let currentMaxRadius;
let currentCirclesPerRing = 0;
let targetCirclesPerRing = 40;
let isRotating = false;
let rotationProgress = 0;
let rotationSpeed = 0.02;
let finalRotX = PI/3; // Final rotation X
let finalRotY = 0; // Final rotation Y
let initialRotX = PI/3; // Initial rotation X
let initialRotY = -PI/2; // Initial rotation Y (side view)

function setup() {
  // Create canvas inside canvas-container
  let canvas = createCanvas(windowWidth - 300, windowHeight, WEBGL);
  canvas.parent('canvas-container');
  maxRadius = width * 0.4;
  noStroke();

  // Create sliders and add them to their containers
  maxSlider = createSlider(10, 100, maxSize, 1);
  maxSlider.parent('maxSliderContainer');
  maxSlider.input(() => { isSliderActive = true; });

  minSlider = createSlider(1, 30, minSize, 1);
  minSlider.parent('minSliderContainer');
  minSlider.input(() => { isSliderActive = true; });

  circlesSlider = createSlider(5, 40, circlesPerRing, 1);
  circlesSlider.parent('circlesSliderContainer');
  circlesSlider.input(() => { isSliderActive = true; });

  ringsSlider = createSlider(10, 50, numRings, 1);
  ringsSlider.parent('ringsSliderContainer');
  ringsSlider.input(() => { isSliderActive = true; });

  ringSpacingSlider = createSlider(5, 30, 15, 1);
  ringSpacingSlider.parent('ringSpacingSliderContainer');
  ringSpacingSlider.input(() => { isSliderActive = true; });

  cyclesPerRingSlider = createSlider(1, 10, 3, 1);
  cyclesPerRingSlider.parent('cyclesPerRingSliderContainer');
  cyclesPerRingSlider.input(() => { isSliderActive = true; });

  cycleSpacingSlider = createSlider(1, 10, 1, 1);
  cycleSpacingSlider.parent('cycleSpacingSliderContainer');
  cycleSpacingSlider.input(() => { isSliderActive = true; });

  scaleSlider = createSlider(0.1, 1, 0.7, 0.01);
  scaleSlider.parent('scaleSliderContainer');
  scaleSlider.input(() => { isSliderActive = true; });

  offsetSlider = createSlider(0, TWO_PI, 0, 0.01);
  offsetSlider.parent('offsetSliderContainer');
  offsetSlider.input(() => { isSliderActive = true; });

  rotationSlider = createSlider(0, 180, 15, 1);
  rotationSlider.parent('rotationSliderContainer');
  rotationSlider.input(() => { isSliderActive = true; });

  lastMouseX = mouseX;
  lastMouseY = mouseY;

  // Update button listener
  let animateButton = select('#animateButton');
  animateButton.mousePressed(() => {
    isAnimating = true;
    isRotating = false;
    animationProgress = 0;
    targetNumRings = ringsSlider.value();
    targetCirclesPerRing = circlesSlider.value();
    currentMaxRadius = 0;
    currentCirclesPerRing = 0;
    // Set initial rotation for side view
    camRotX = initialRotX;
    camRotY = initialRotY;
    targetRotX = initialRotX;
    targetRotY = initialRotY;
  });
}

function mouseReleased() {
  isSliderActive = false;
}

function draw() {
  background(0);

  // Update build-up animation
  if (isAnimating) {
    animationProgress += animationSpeed;
    
    let eased = 1 - Math.pow(1 - animationProgress, 3);
    
    numRings = Math.ceil(map(eased, 0, 1, 1, targetNumRings));
    currentMaxRadius = map(eased, 0, 1, 0, width * 0.4);
    currentCirclesPerRing = Math.ceil(map(eased, 0, 1, 4, targetCirclesPerRing));
    
    if (animationProgress >= 1) {
      isAnimating = false;
      isRotating = true;
      rotationProgress = 0;
      numRings = targetNumRings;
      currentMaxRadius = width * 0.4;
      currentCirclesPerRing = targetCirclesPerRing;
    }
  } else {
    numRings = ringsSlider.value();
    currentMaxRadius = width * 0.4;
    currentCirclesPerRing = circlesSlider.value();
  }

  // Update rotation animation
  if (isRotating) {
    rotationProgress += rotationSpeed;
    let eased = 1 - Math.pow(1 - rotationProgress, 3);
    
    // Interpolate from initial to final rotation
    camRotX = lerp(initialRotX, finalRotX, eased);
    camRotY = lerp(initialRotY, finalRotY, eased);

    if (rotationProgress >= 1) {
      isRotating = false;
      // Set the target rotation to match the final rotation
      targetRotX = finalRotX;
      targetRotY = finalRotY;
    }
  } else if (!isAnimating) {
    if (mouseIsPressed && !isSliderActive) {
      let deltaX = mouseX - lastMouseX;
      let deltaY = mouseY - lastMouseY;

      targetRotX += deltaY * 0.01;
      targetRotY += deltaX * 0.01;
    }
    
    camRotX = lerp(camRotX, targetRotX, 0.1);
    camRotY = lerp(camRotY, targetRotY, 0.1);
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY;

  // Get slider values
  maxSize = maxSlider.value();
  minSize = minSlider.value();
  let ringSpacing = ringSpacingSlider.value();
  let scaleFactor = scaleSlider.value();
  let cycleSpacing = cycleSpacingSlider.value();
  let cyclesPerRing = cyclesPerRingSlider.value();
  let offset = offsetSlider.value();
  let rotationAngle = rotationSlider.value();

  scale(scaleFactor);

  // Apply rotations
  rotateX(camRotX);
  rotateY(camRotY);

  fill(255);

  // Draw the rings
  for (let ringIndex = numRings - 1; ringIndex >= 0; ringIndex--) {
    let t = map(ringIndex, 0, numRings, 0, 1);
    let ringZ = -200 + ringIndex * ringSpacing;
    let ringRadius = lerp(currentMaxRadius, minRadius, t);

    let ringSizeFactor = map(ringIndex, 0, numRings, 1, 0.3);
    let adjustedMaxSize = maxSize * ringSizeFactor;
    let adjustedMinSize = minSize * ringSizeFactor;

    for (let circleIndex = 0; circleIndex < currentCirclesPerRing; circleIndex++) {
      let angle = map(circleIndex, 0, currentCirclesPerRing, 0, TWO_PI);
      
      let phaseShift = ringIndex * 0.2;
      let circleSize = lerp(adjustedMinSize, adjustedMaxSize, 
        (1 + sin(angle * cyclesPerRing + offset + phaseShift)) / 2);

      let x = cos(angle) * ringRadius;
      let y = sin(angle) * ringRadius;

      push();
      translate(x, y, ringZ);
      ellipse(0, 0, circleSize, circleSize);
      pop();
    }
  }
}

// Add this function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth - 300, windowHeight);
  maxRadius = width * 0.4;
} 