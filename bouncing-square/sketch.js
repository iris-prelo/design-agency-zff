let square = {
  x: 100,        // Initial x position
  y: 100,        // Initial y position
  width: 100,     // Width of the rectangle (starting at minimum)
  height: 100,    // Height of the rectangle (starting at minimum)
  speedX: 3,     // Speed in x direction
  speedY: 3      // Speed in y direction
};

let img; // Variable to store the image

function preload() {
  // Load the opernhaus image
  img = loadImage('opernhaus.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);
  background(0); // Set initial black background
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';
  imageMode(CORNER);
}

function draw() {
  // Update square position
  square.x += square.speedX;
  square.y += square.speedY;
  
  // Check for collisions and change shape
  // Right edge
  if (square.x + square.width > width) {
    square.x = width - square.width; // Correct position
    square.speedX *= -1;
    square.height = random(100, 250);
    square.width = random(100, 250);
  }
  
  // Left edge
  if (square.x < 0) {
    square.x = 0; // Correct position
    square.speedX *= -1;
    square.height = random(100, 250);
    square.width = random(100, 250);
  }
  
  // Bottom edge
  if (square.y + square.height > height) {
    square.y = height - square.height; // Correct position
    square.speedY *= -1;
    square.width = random(100, 250);
    square.height = random(100, 250);
  }
  
  // Top edge
  if (square.y < 0) {
    square.y = 0; // Correct position
    square.speedY *= -1;
    square.width = random(100, 250);
    square.height = random(100, 250);
  }
  
  // Draw the image instead of a rectangle
  image(img, square.x, square.y, square.width, square.height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}