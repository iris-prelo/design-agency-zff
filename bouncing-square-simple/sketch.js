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
  
  // Check for collisions and change shape
  // Right edge
  if (square.x + square.width > width) {
    square.x = width - square.width;
    square.speedX *= -1;
    square.height = random(100, 250);
    square.width = random(100, 250);
  }
  
  // Left edge
  if (square.x < 0) {
    square.x = 0;
    square.speedX *= -1;
    square.height = random(100, 250);
    square.width = random(100, 250);
  }
  
  // Bottom edge
  if (square.y + square.height > height) {
    square.y = height - square.height;
    square.speedY *= -1;
    square.width = random(100, 250);
    square.height = random(100, 250);
  }
  
  // Top edge
  if (square.y < 0) {
    square.y = 0;
    square.speedY *= -1;
    square.width = random(100, 250);
    square.height = random(100, 250);
  }
  
  // Draw the image
  image(img, square.x, square.y, square.width, square.height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}