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
  
  // Update square position
  square.x += square.speedX;
  square.y += square.speedY;
  
  // Update timer and set new target sizes occasionally
  changeTimer++;
  if (changeTimer > 60) { // Change every 60 frames (about 1 second)
    changeTimer = 0;
    targetWidth = random(50, 400);
    targetHeight = random(50, 400);
  }
  
  // Smoothly interpolate current size to target size
  square.width = lerp(square.width, targetWidth, transitionSpeed);
  square.height = lerp(square.height, targetHeight, transitionSpeed);
  
  // Check for collisions
  // Right edge
  if (square.x + square.width > width) {
    square.x = width - square.width;
    square.speedX *= -1;
  }
  
  // Left edge
  if (square.x < 0) {
    square.x = 0;
    square.speedX *= -1;
  }
  
  // Bottom edge
  if (square.y + square.height > height) {
    square.y = height - square.height;
    square.speedY *= -1;
  }
  
  // Top edge
  if (square.y < 0) {
    square.y = 0;
    square.speedY *= -1;
  }
  
  // Draw the image
  image(img, square.x, square.y, square.width, square.height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}