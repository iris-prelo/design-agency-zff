let params = {
  rings: 6,
  totalCircles: 36,
  baseRadius: 300,
  smallCircleSize: 10,
  perspective: 0.15,
  sideAngle: 0,  // Left-right rotation (-45 to 45 degrees)
  topAngle: 0    // New parameter for top-bottom rotation (-45 to 45 degrees)
};

let sliders = {};

function setup() {
  // Create canvas inside the canvas-container
  let canvas = createCanvas(windowWidth - 200, windowHeight, WEBGL);
  canvas.parent('canvas-container');
  angleMode(DEGREES);
  
  // Create sliders
  createSliderWithLabel('rings', 'Number of Rings', 1, 12, params.rings, 1);
  createSliderWithLabel('totalCircles', 'Circles per Ring', 4, 72, params.totalCircles, 1);
  createSliderWithLabel('baseRadius', 'Base Radius', 50, 500, params.baseRadius, 10);
  createSliderWithLabel('smallCircleSize', 'Circle Size', 2, 20, params.smallCircleSize, 1);
  createSliderWithLabel('perspective', 'Perspective', 0.05, 0.3, params.perspective, 0.01);
  createSliderWithLabel('sideAngle', 'Side Angle', -45, 45, params.sideAngle, 1);
  createSliderWithLabel('topAngle', 'Top Angle', -45, 45, params.topAngle, 1);
}

function createSliderWithLabel(param, labelText, min, max, defaultValue, step) {
  let container = createDiv('');
  container.class('slider-container');
  
  let label = createSpan(labelText + ': ');
  label.class('slider-label');
  label.parent(container);
  
  let valueSpan = createSpan(defaultValue);
  
  sliders[param] = createSlider(min, max, defaultValue, step);
  sliders[param].input(() => {
    params[param] = sliders[param].value();
    valueSpan.html(params[param]);
  });
  
  sliders[param].parent(container);
  valueSpan.parent(container);
  container.parent(select('.controls'));
}

function draw() {
  background(0);  // Black background
  
  // Apply rotations for perspective
  rotateY(params.sideAngle * 0.5);  // Side-to-side rotation
  rotateX(params.topAngle * 0.5);   // Top-to-bottom rotation
  
  // Draw glowing circles
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'white';
  
  // Draw multiple rings of circles
  for (let ring = 0; ring < params.rings; ring++) {
    // Calculate radius for this ring (each ring gets smaller)
    let radius = params.baseRadius * (1 - ring * params.perspective);
    
    // Draw small white circles arranged in a circle
    for (let i = 0; i < params.totalCircles; i++) {
      let angle = map(i, 0, params.totalCircles, 0, 360);
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      
      fill(255);  // White color
      noStroke();
      // Make inner circles slightly smaller
      let currentCircleSize = params.smallCircleSize * (1 - ring * 0.1);
      
      push();
      translate(x, y, 0);
      circle(0, 0, currentCircleSize);
      pop();
    }
  }
}

// Resize canvas when window is resized
function windowResized() {
  resizeCanvas(windowWidth - 200, windowHeight, WEBGL);
}
