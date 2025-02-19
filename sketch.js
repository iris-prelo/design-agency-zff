let noiseScale = 0.02;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 1);
  background(10, 10, 10);
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';
}

function draw() {
  // Lighter background
  background(245, 245, 245, 0.1);
  
  // Main light effect
  drawLightEffect();
  
  // Bubble effect
  drawBubble();
  
  // Aura effect
  drawAura();
  
  // Add noise overlay
  drawNoise();
  
  time += 0.005; // Slower overall movement
}

function drawLightEffect() {
  push();
  translate(width/2, height/2);
  rotate(-PI/4);
  
  let gradientSize = max(width, height) * 1.5;
  for(let r = gradientSize; r > 0; r -= 5) {
    let alpha = map(r, 0, gradientSize, 0.1, 0);
    
    noStroke();
    fill(
      lerpColor(
        color(255, 255, 255, alpha), 
        color(255, 200, 255, alpha * 0.4),
        r/gradientSize
      )
    );
    
    ellipse(0, 0, r, r);
  }
  pop();
}

function drawBubble() {
  push();
  translate(width/2, height/2);
  
  let bubbleSize = 300;
  let t = time * 0.5;
  
  noStroke();
  blendMode(SCREEN);
  
  // Outer iridescent layers
  for(let r = bubbleSize; r > bubbleSize * 0.4; r -= 4) {
    let progress = (r - bubbleSize * 0.4) / (bubbleSize * 0.6);
    let alpha = map(r, bubbleSize, bubbleSize * 0.4, 0.1, 0.15);
    
    if (progress > 0.8) {
      fill(255, 100, 150, alpha); // Pink
    } else if (progress > 0.6) {
      fill(255, 200, 100, alpha); // Orange/Yellow
    } else if (progress > 0.4) {
      fill(100, 255, 200, alpha); // Turquoise
    } else if (progress > 0.2) {
      fill(150, 100, 255, alpha); // Purple
    } else {
      fill(255, 150, 255, alpha); // Light pink
    }
    
    ellipse(0, 0, r, r);
  }
  
  // White center with gradient fade
  for(let r = bubbleSize * 0.5; r > 0; r -= 3) {
    let alpha = map(r, bubbleSize * 0.5, 0, 0.15, 0);
    fill(255, 255, 255, alpha);
    ellipse(0, 0, r, r);
  }
  
  // Extra bright center
  for(let r = bubbleSize * 0.2; r > 0; r -= 3) {
    let alpha = map(r, bubbleSize * 0.2, 0, 0.2, 0);
    fill(255, 255, 255, alpha);
    ellipse(0, 0, r, r);
  }
  
  blendMode(BLEND);
  pop();
}

function drawAura() {
  push();
  translate(width/2, height/2);
  
  let auraSize = 250;
  blendMode(SCREEN);
  
  // Softer aura effect with more colors
  for(let i = 0; i < 12; i++) {
    let t = time * 0.3 + i * 0.2;
    let x = cos(t) * (auraSize * 0.05);
    let y = sin(t) * (auraSize * 0.05);
    
    noStroke();
    
    fill(255, 100, 150, 0.05);
    ellipse(x, y, auraSize, auraSize);
    
    fill(100, 255, 200, 0.05);
    ellipse(x + (auraSize * 0.01), y - (auraSize * 0.01), auraSize * 0.95, auraSize * 0.95);
    
    fill(150, 100, 255, 0.05);
    ellipse(x - (auraSize * 0.01), y + (auraSize * 0.01), auraSize * 0.9, auraSize * 0.9);
  }
  
  blendMode(BLEND);
  pop();
}

function drawNoise() {
  if (frameCount % 2 !== 0) return;
  
  loadPixels();
  for(let x = 0; x < width; x += 4) {
    for(let y = 0; y < height; y += 4) {
      let noiseVal = noise(x * noiseScale, y * noiseScale, time);
      let index = 4 * (y * width + x);
      // Only set pixel if within bounds
      if (index < pixels.length - 4) {
        pixels[index + 3] = noiseVal * 10;
      }
    }
  }
  updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
} 