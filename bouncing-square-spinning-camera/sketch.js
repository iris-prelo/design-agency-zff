let square = {
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  speedX: 3,
  speedY: 3,
  rotation: 0,          // Current rotation angle
  targetRotation: 0,    // Target rotation angle
  rotationSpeed: 0.02   // Reduced from 0.05 to 0.02 for slower rotation
};

let img;
let capture;
let isAnimationStarted = false;
let uploadContainer;
let targetWidth = 100;
let targetHeight = 100;
let changeTimer = 0;
let transitionSpeed = 0.05;
let scaleFactor = 4; // Add scale factor for high-res exports
let screenshotCount = 0;  // Add counter for naming screenshots
let useWebcam = false;  // Flag to determine which input to use

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);
  background(0);
  imageMode(CORNER);
  
  // Initialize webcam
  capture = createCapture(VIDEO);
  capture.hide();
  
  // Wait for webcam to be ready
  capture.elt.onloadeddata = () => {
    console.log('Webcam ready!');
    isAnimationStarted = true;
  };
  
  // Show canvas immediately
  let canvas = document.querySelector('canvas');
  canvas.style.display = 'block';
  
  // Hide the upload container since we're using webcam
  uploadContainer = document.getElementById('upload-container');
  if (uploadContainer) {
    uploadContainer.style.display = 'none';
  }
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
  canvas.style.display = 'block';
  
  // Reset background
  background(0);
}

function draw() {
  if (!isAnimationStarted || !capture.loadedmetadata) {
    console.log('Waiting for webcam...');
    return;
  }
  
  // Update square position
  square.x += square.speedX;
  square.y += square.speedY;
  
  // Update timer and set new target sizes occasionally
  changeTimer++;
  if (changeTimer > 60) {
    changeTimer = 0;
    targetWidth = random(50, 400);
    targetHeight = random(50, 400);
    square.targetRotation += random(PI/2, TWO_PI);
  }
  
  // Smoothly interpolate current size and rotation to target values
  square.width = lerp(square.width, targetWidth, transitionSpeed);
  square.height = lerp(square.height, targetHeight, transitionSpeed);
  square.rotation = lerp(square.rotation, square.targetRotation, square.rotationSpeed);
  
  // Check for collisions
  if (square.x + square.width > width) {
    square.x = width - square.width;
    square.speedX *= -1;
  }
  if (square.x < 0) {
    square.x = 0;
    square.speedX *= -1;
  }
  if (square.y + square.height > height) {
    square.y = height - square.height;
    square.speedY *= -1;
  }
  if (square.y < 0) {
    square.y = 0;
    square.speedY *= -1;
  }
  
  // Draw the webcam feed with rotation
  push();
  translate(square.x + square.width/2, square.y + square.height/2);
  rotate(square.rotation);
  image(capture, -square.width/2, -square.height/2, square.width, square.height);
  pop();
  
  // Check for spacebar press to save high-res image
  if (keyIsPressed && key === ' ') {
    let exportCanvas = createGraphics(width * scaleFactor, height * scaleFactor);
    exportCanvas.imageMode(CORNER);
    exportCanvas.scale(scaleFactor);
    exportCanvas.background(0);
    exportCanvas.drawingContext.drawImage(canvas, 0, 0, width, height);
    
    let timestamp = year() + nf(month(), 2) + nf(day(), 2) + "_" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
    saveCanvas(exportCanvas, 'bouncing_webcam_' + timestamp, 'png');
    
    exportCanvas.remove();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}