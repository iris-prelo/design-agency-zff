let square = {
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  speedX: 3,
  speedY: 3
};

let eye = {
  x: 0,
  y: 0,
  size: 50  // Adjust this value to change the eye size
};

let img;
let eyeImg;
let isAnimationStarted = false;
let uploadContainer;
let frameBuffer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameBuffer = createGraphics(windowWidth, windowHeight);
  
  colorMode(RGB, 255, 255, 255, 1);
  background(0);
  frameBuffer.background(0);
  imageMode(CENTER);
  frameBuffer.imageMode(CENTER);
  
  // Load the eye image
  loadImage('eye.png', (loadedImg) => {
    eyeImg = loadedImg;
  });
  
  // Hide the canvas initially
  let canvas = document.querySelector('canvas');
  canvas.style.display = 'none';
  
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
  
  uploadContainer.style.display = 'none';
  document.querySelector('canvas').style.display = 'block';
  
  background(0);
  frameBuffer.background(0);
}

function draw() {
  if (!isAnimationStarted) return;
  
  // Clear the background each frame
  background(0);
  
  // Update square position
  square.x += square.speedX;
  square.y += square.speedY;
  
  // Check for collisions and change shape
  // Right edge
  if (square.x + square.width/2 > width) {
    square.x = width - square.width/2;
    square.speedX *= -1;
    square.height = random(square.minSize, square.maxSize);
    square.width = random(square.minSize, square.maxSize);
  }
  
  // Left edge
  if (square.x - square.width/2 < 0) {
    square.x = square.width/2;
    square.speedX *= -1;
    square.height = random(square.minSize, square.maxSize);
    square.width = random(square.minSize, square.maxSize);
  }
  
  // Bottom edge
  if (square.y + square.height/2 > height) {
    square.y = height - square.height/2;
    square.speedY *= -1;
    square.width = random(square.minSize, square.maxSize);
    square.height = random(square.minSize, square.maxSize);
  }
  
  // Top edge
  if (square.y - square.height/2 < 0) {
    square.y = square.height/2;
    square.speedY *= -1;
    square.width = random(square.minSize, square.maxSize);
    square.height = random(square.minSize, square.maxSize);
  }
  
  // Draw the Opernhaus image
  image(img, square.x, square.y, square.width, square.height);
  
  // Update eye position to follow the center of the Opernhaus image
  eye.x = square.x + square.width/2 - eye.size/2;
  eye.y = square.y + square.height/2 - eye.size/2;
  
  // Draw the eye image
  if (eyeImg) {
    image(eyeImg, eye.x, eye.y, eye.size, eye.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let oldBuffer = frameBuffer;
  frameBuffer = createGraphics(windowWidth, windowHeight);
  frameBuffer.background(0);
  frameBuffer.image(oldBuffer, 0, 0);
}