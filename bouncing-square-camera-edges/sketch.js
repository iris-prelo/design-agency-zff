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
let targetWidth = 100;
let targetHeight = 100;
let transitionSpeed = 0.05;
let scaleFactor = 4; // Increase this for even higher resolution exports
let capture; // Add this with other global variables
let justCollided = false;  // Add this flag to prevent multiple size changes

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);
  background(0);
  imageMode(CORNER);
  
  // Initialize webcam
  capture = createCapture(VIDEO);
  capture.hide(); // Hide the default video element
  
  // Wait for webcam to be ready
  capture.elt.onloadeddata = () => {
    console.log('Webcam ready!');
    isAnimationStarted = true;
  };
  
  // Show canvas immediately
  let canvas = document.querySelector('canvas');
  canvas.style.display = 'block';
}

function draw() {
  if (!isAnimationStarted || !capture.loadedmetadata) {
    console.log('Waiting for animation to start...');
    console.log('isAnimationStarted:', isAnimationStarted);
    console.log('capture.loadedmetadata:', capture.loadedmetadata);
    return;
  }
  
  let collision = false;  // Track if a collision happened this frame
  
  // Update square position
  square.x += square.speedX;
  square.y += square.speedY;
  
  // Check for collisions
  // Right edge
  if (square.x + square.width > width) {
    square.x = width - square.width;
    square.speedX *= -1;
    collision = true;
  }
  
  // Left edge
  if (square.x < 0) {
    square.x = 0;
    square.speedX *= -1;
    collision = true;
  }
  
  // Bottom edge
  if (square.y + square.height > height) {
    square.y = height - square.height;
    square.speedY *= -1;
    collision = true;
  }
  
  // Top edge
  if (square.y < 0) {
    square.y = 0;
    square.speedY *= -1;
    collision = true;
  }
  
  // Only change size if there's a collision and we haven't just collided
  if (collision && !justCollided) {
    targetWidth = random(50, 400);
    targetHeight = random(50, 400);
    justCollided = true;
  } else if (!collision) {
    justCollided = false;
  }
  
  // Smoothly interpolate current size to target size
  square.width = lerp(square.width, targetWidth, transitionSpeed);
  square.height = lerp(square.height, targetHeight, transitionSpeed);
  
  // Draw the webcam feed
  image(capture, square.x, square.y, square.width, square.height);
  
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