let square = {
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  speedX: 3,
  speedY: 3
};

let img;
let isAnimationStarted = false;
let uploadContainer;
let targetWidth = 100;
let targetHeight = 100;
let changeTimer = 0;
let transitionSpeed = 0.05;
let scaleFactor = 4;

let pathPoints = [];
let currentPoint = 0;
let reachedPoint = true;
let letterScale = 0.4; // Adjust this to change the size of the letters

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);
  background(0);
  imageMode(CORNER);
  
  // Hide the canvas initially
  let canvas = document.querySelector('canvas');
  canvas.style.display = 'none';
  
  // Setup drag and drop handlers
  uploadContainer = document.getElementById('upload-container');
  
  uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContainer.classList.add('dragover');
  });
  
  uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.classList.remove('dragover');
  });
  
  uploadContainer.addEventListener('drop', handleDrop);
  
  // Adjust the scale and positioning to ensure it stays on screen
  letterScale = min(width, height) * 0.0002; // Make scale relative to screen size
  const baseX = width * 0.25;  // Start at 25% of screen width
  const baseY = height * 0.3;  // Start at 30% of screen height
  const w = min(width * 0.15, height * 0.3);  // Letter width
  const h = min(height * 0.4, width * 0.2);   // Letter height
  
  // Points for "Z"
  pathPoints = [
    {x: baseX, y: baseY},                    // Top left
    {x: baseX + w, y: baseY},                // Top right
    {x: baseX, y: baseY + h},                // Bottom left
    {x: baseX + w, y: baseY + h}             // Bottom right
  ];
  
  // Points for first "F"
  pathPoints.push(
    {x: baseX + w * 1.2, y: baseY},          // Top left
    {x: baseX + w * 2.0, y: baseY},          // Top right
    {x: baseX + w * 1.2, y: baseY},          // Back to left
    {x: baseX + w * 1.2, y: baseY + h/2},    // Middle left
    {x: baseX + w * 1.8, y: baseY + h/2},    // Middle right
    {x: baseX + w * 1.2, y: baseY + h/2},    // Back to middle left
    {x: baseX + w * 1.2, y: baseY + h}       // Bottom
  );
  
  // Points for second "F"
  pathPoints.push(
    {x: baseX + w * 2.2, y: baseY},          // Top left
    {x: baseX + w * 3.0, y: baseY},          // Top right
    {x: baseX + w * 2.2, y: baseY},          // Back to left
    {x: baseX + w * 2.2, y: baseY + h/2},    // Middle left
    {x: baseX + w * 2.8, y: baseY + h/2},    // Middle right
    {x: baseX + w * 2.2, y: baseY + h/2},    // Back to middle left
    {x: baseX + w * 2.2, y: baseY + h}       // Bottom
  );
}

function handleDrop(e) {
  e.preventDefault();
  uploadContainer.classList.remove('dragover');
  
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    loadImage(URL.createObjectURL(file), startAnimation);
  }
}

function startAnimation(loadedImg) {
  img = loadedImg;
  isAnimationStarted = true;
  
  // Hide upload container and show canvas
  uploadContainer.style.display = 'none';
  document.querySelector('canvas').style.display = 'block';
  
  // Reset background
  background(0);
}

function draw() {
  if (!isAnimationStarted) return;
  
  // Move towards the current target point
  if (reachedPoint) {
    currentPoint = (currentPoint + 1) % pathPoints.length;
    reachedPoint = false;
  }
  
  let targetPoint = pathPoints[currentPoint];
  let dx = targetPoint.x - square.x;
  let dy = targetPoint.y - square.y;
  let distance = sqrt(dx * dx + dy * dy);
  
  if (distance < 5) {
    reachedPoint = true;
  } else {
    let angle = atan2(dy, dx);
    let speed = 5;
    square.x += cos(angle) * speed;
    square.y += sin(angle) * speed;
  }
  
  // Draw the image
  image(img, square.x, square.y, square.width, square.height);
  
  // Check for spacebar press to save high-res image
  if (keyIsPressed && key === ' ') {
    // Create a high-resolution graphics buffer
    let exportCanvas = createGraphics(width * scaleFactor, height * scaleFactor);
    exportCanvas.imageMode(CORNER);
    
    // Scale everything up
    exportCanvas.scale(scaleFactor);
    
    // Draw black background
    exportCanvas.background(0);
    
    // Get the current canvas content and draw it to the export canvas
    exportCanvas.drawingContext.drawImage(canvas, 0, 0, width, height);
    
    // Save the high-res image with timestamp
    let timestamp = year() + nf(month(), 2) + nf(day(), 2) + "_" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
    saveCanvas(exportCanvas, 'bouncing_image_' + timestamp, 'png');
    
    // Clean up
    exportCanvas.remove();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}