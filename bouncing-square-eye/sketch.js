let square = {
  x: 100,
  y: 100,
  width: 200,  
  height: 200,  
  speedX: 3,
  speedY: 3,
  minSize: 150,  
  maxSize: 250   
};

let eye = {
  x: 0,
  y: 0,
  width: 0,   
  height: 0,  
  scale: 0.8,  // Scale for the frame size
  imageScale: 3  // Scale for the eye image size
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
    let aspectRatio = eyeImg.width / eyeImg.height;
    eye.height = 150;
    eye.width = eye.height * aspectRatio;
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
  
  // Update square position
  square.x = Math.round(square.x + square.speedX);
  square.y = Math.round(square.y + square.speedY);
  
  // Check for collisions and change shape
  // Right edge
  if (square.x + square.width/2 > width) {
    square.x = Math.round(width - square.width/2);
    square.speedX *= -1;
    square.height = Math.round(random(square.minSize, square.maxSize));
    square.width = Math.round(random(square.minSize, square.maxSize));
  }
  
  // Left edge
  if (square.x - square.width/2 < 0) {
    square.x = Math.round(square.width/2);
    square.speedX *= -1;
    square.height = Math.round(random(square.minSize, square.maxSize));
    square.width = Math.round(random(square.minSize, square.maxSize));
  }
  
  // Bottom edge
  if (square.y + square.height/2 > height) {
    square.y = Math.round(height - square.height/2);
    square.speedY *= -1;
    square.width = Math.round(random(square.minSize, square.maxSize));
    square.height = Math.round(random(square.minSize, square.maxSize));
  }
  
  // Top edge
  if (square.y - square.height/2 < 0) {
    square.y = Math.round(square.height/2);
    square.speedY *= -1;
    square.width = Math.round(random(square.minSize, square.maxSize));
    square.height = Math.round(random(square.minSize, square.maxSize));
  }
  
  // Draw the frame effect to the buffer
  frameBuffer.image(img, square.x, square.y, square.width, square.height);
  
  // Draw the buffer to the main canvas
  image(frameBuffer, width/2, height/2, width, height);
  
  if (eyeImg) {
    let maskWidth = eye.width * eye.scale;
    let scaledWidth = eye.width * eye.imageScale;
    let scaledHeight = eye.height * eye.imageScale;
    
    // Always use the exact center of the square
    let centerX = Math.round(square.x);  // Round to prevent sub-pixel rendering
    let centerY = Math.round(square.y);  // Round to prevent sub-pixel rendering
    
    // Create circular mask at the center
    push();
    fill(0);
    noStroke();
    circle(centerX, centerY, maskWidth);
    pop();
    
    // Draw the eye image at exactly the same center point
    image(eyeImg, centerX, centerY, scaledWidth, scaledHeight);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let oldBuffer = frameBuffer;
  frameBuffer = createGraphics(windowWidth, windowHeight);
  frameBuffer.background(0);
  frameBuffer.imageMode(CENTER);  // Make sure buffer uses same image mode
  
  // Ensure square stays within bounds after resize
  square.x = Math.round(constrain(square.x, square.width/2, width - square.width/2));
  square.y = Math.round(constrain(square.y, square.height/2, height - square.height/2));
  
  // Copy old buffer to new one
  frameBuffer.image(oldBuffer, width/2, height/2, width, height);
}