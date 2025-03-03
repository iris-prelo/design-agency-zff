let squares = [
  {
    x: 100,
    y: 100,
    width: 60,
    height: 60,
    speedX: 3,
    speedY: 3
  },
  {
    x: 200,
    y: 200,
    width: 60,
    height: 60,
    speedX: -3,
    speedY: 4
  },
  {
    x: 300,
    y: 300,
    width: 60,
    height: 60,
    speedX: 4,
    speedY: -3
  },
  {
    x: 150,
    y: 150,
    width: 60,
    height: 60,
    speedX: -2,
    speedY: 3
  },
  {
    x: 250,
    y: 250,
    width: 60,
    height: 60,
    speedX: 3,
    speedY: -2
  },
  {
    x: 350,
    y: 150,
    width: 60,
    height: 60,
    speedX: -4,
    speedY: -3
  },
  {
    x: 150,
    y: 350,
    width: 60,
    height: 60,
    speedX: 2,
    speedY: -4
  },
  {
    x: 400,
    y: 400,
    width: 60,
    height: 60,
    speedX: -3,
    speedY: 2
  }
];

let img;
let isAnimationStarted = false;
let targetWidths = [60, 60, 60, 60, 60, 60, 60, 60];  // One for each square
let targetHeights = [60, 60, 60, 60, 60, 60, 60, 60]; // One for each square
let changeTimer = 0;
let transitionSpeed = 0.05;
let scaleFactor = 4; // Increase this for even higher resolution exports
let capture; // Add this with other global variables

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
  
  // Update timer and set new target sizes occasionally
  changeTimer++;
  if (changeTimer > 60) {
    changeTimer = 0;
    for (let i = 0; i < 8; i++) {
      targetWidths[i] = random(30, 200);
      targetHeights[i] = random(30, 200);
    }
  }
  
  // Update and draw each square
  squares.forEach((square, index) => {
    // Update square position
    square.x += square.speedX;
    square.y += square.speedY;
    
    // Smoothly interpolate current size to target size
    square.width = lerp(square.width, targetWidths[index], transitionSpeed);
    square.height = lerp(square.height, targetHeights[index], transitionSpeed);
    
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
    
    // Draw the webcam feed for this square
    image(capture, square.x, square.y, square.width, square.height);
  });
  
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