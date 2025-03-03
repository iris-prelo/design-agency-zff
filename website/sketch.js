let params = {
  rings: 6,
  totalCircles: 36,
  baseRadius: 300,
  smallCircleSize: 10,
  perspective: 0.15,
  sideAngle: 0,    // Will now have a larger range
  topAngle: 0,     // Will now have a larger range
  ringSpacing: 0.15,
  glowIntensity: 20,
  zDepth: 0  // Will now range from negative to positive
};

let sliders = {};
let canvas;

function setup() {
  canvas = createCanvas(windowWidth - 180, windowHeight, WEBGL);
  canvas.parent('canvas-container');
  angleMode(DEGREES);
  
  // Create sliders
  createSliderWithLabel('rings', 'Number of Rings', 1, 30, params.rings, 1);
  createSliderWithLabel('totalCircles', 'Circles per Ring', 4, 72, params.totalCircles, 1);
  createSliderWithLabel('baseRadius', 'Base Radius', 50, 500, params.baseRadius, 10);
  createSliderWithLabel('smallCircleSize', 'Circle Size', 2, 20, params.smallCircleSize, 1);
  createSliderWithLabel('perspective', 'Perspective', 0.05, 0.3, params.perspective, 0.01);
  createSliderWithLabel('ringSpacing', 'Ring Spacing', 0.05, 0.3, params.ringSpacing, 0.01);
  createSliderWithLabel('glowIntensity', 'Glow', 0, 100, params.glowIntensity, 1);  // Increased max value to 100
  createSliderWithLabel('zDepth', 'Z Depth', -2000, 2000, params.zDepth, 10);  // Changed range to include negative values
  createSliderWithLabel('sideAngle', 'Side Angle', -180, 180, params.sideAngle, 1);  // Increased from -45/45 to -180/180
  createSliderWithLabel('topAngle', 'Top Angle', -180, 180, params.topAngle, 1);     // Increased from -45/45 to -180/180
  
  // Create screenshot button
  let screenshotBtn = createButton('Screenshot');
  screenshotBtn.class('screenshot-btn');
  screenshotBtn.parent(select('.controls'));
  screenshotBtn.mousePressed(takeHighResScreenshot);
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

function drawCircleWithGlow(x, y, z, size, intensity) {
  push();
  translate(x, y, z);  // Added z translation
  
  // Draw multiple layers of circles with decreasing opacity
  for (let i = 0; i < 6; i++) {
    let alpha = map(i, 0, 6, 255, 0);
    let glowSize = size + (i * (intensity / 5));
    
    fill(255, alpha);
    circle(0, 0, glowSize);
  }
  
  // Draw the main circle on top
  fill(255);
  circle(0, 0, size);
  pop();
}

function takeHighResScreenshot() {
  let scaleFactor = 4;
  let tempCanvas = createGraphics(width * scaleFactor, height * scaleFactor, WEBGL);
  
  tempCanvas.angleMode(DEGREES);
  tempCanvas.background(0);
  
  tempCanvas.rotateY(params.sideAngle * 0.5);
  tempCanvas.rotateX(params.topAngle * 0.5);
  
  tempCanvas.noStroke();
  
  for (let ring = params.rings - 1; ring >= 0; ring--) {
    let radius = (params.baseRadius * scaleFactor) * (1 - ring * params.ringSpacing);
    let zPos = -ring * params.zDepth * scaleFactor;  // Scale Z position for high-res
    
    for (let i = 0; i < params.totalCircles; i++) {
      let angle = map(i, 0, params.totalCircles, 0, 360);
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      
      let currentCircleSize = (params.smallCircleSize * scaleFactor) * (1 - ring * params.perspective);
      
      tempCanvas.push();
      tempCanvas.translate(x, y, zPos);
      
      // Draw glow layers for screenshot
      for (let j = 0; j < 6; j++) {
        let alpha = map(j, 0, 6, 255, 0);
        let glowSize = currentCircleSize + (j * (params.glowIntensity * scaleFactor / 5));
        
        tempCanvas.fill(255, alpha);
        tempCanvas.circle(0, 0, glowSize);
      }
      
      // Draw main circle
      tempCanvas.fill(255);
      tempCanvas.circle(0, 0, currentCircleSize);
      
      tempCanvas.pop();
    }
  }
  
  save(tempCanvas, 'circles-tunnel-HD.png');
  tempCanvas.remove();
}

function draw() {
  background(0);
  
  rotateY(params.sideAngle * 0.5);
  rotateX(params.topAngle * 0.5);
  
  noStroke();
  
  // Draw rings from outer to inner
  for (let ring = params.rings - 1; ring >= 0; ring--) {
    let radius = params.baseRadius * (1 - ring * params.ringSpacing);
    let zPos = -ring * params.zDepth;  // Calculate Z position based on ring number
    
    for (let i = 0; i < params.totalCircles; i++) {
      let angle = map(i, 0, params.totalCircles, 0, 360);
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      
      let currentCircleSize = params.smallCircleSize * (1 - ring * params.perspective);
      
      drawCircleWithGlow(x, y, zPos, currentCircleSize, params.glowIntensity);
    }
  }
}

// Resize canvas when window is resized
function windowResized() {
  resizeCanvas(windowWidth - 180, windowHeight, WEBGL);
}
