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
  // Clear with slight fade for trail effect
  background(10, 10, 10, 0.1);
  
  // Main light effect
  drawLightEffect();
  
  // Bubble effect
  drawBubble();
  
  // Aura effect
  drawAura();
  
  // Add noise overlay
  drawNoise();
  
  time += 0.01;
}

function drawLightEffect() {
  push();
  translate(width/2, height/2);
  rotate(-PI/4);
  
  // Main gradient - smaller steps for smoother gradient
  let gradientSize = max(width, height) * 2;
  for(let r = gradientSize; r > 0; r -= 5) {
    let alpha = map(r, 0, gradientSize, 0.3, 0);
    
    noStroke();
    fill(
      lerpColor(
        color(255, 255, 255, alpha), 
        color(255, 200, 100, alpha * 0.4),
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
  let t = time * 1.5;
  
  noStroke();
  
  // Base colored shape
  fill(200, 100, 255, 0.3); // Light purple base
  beginShape();
  for(let a = 0; a < TWO_PI; a += 0.05) {
    let xoff = map(cos(a), -1, 1, 0, 3);
    let yoff = map(sin(a), -1, 1, 0, 3);
    let r = bubbleSize + map(noise(xoff, yoff, t), 0, 1, -30, 30);
    let x = r * cos(a);
    let y = r * sin(a);
    curveVertex(x, y);
  }
  endShape(CLOSE);
  
  // Colored gradient overlays
  blendMode(SCREEN); // Use screen blend mode for additive color mixing
  
  // Inner cyan gradient
  for(let r = bubbleSize * 0.8; r > 0; r -= 5) {
    let alpha = map(r, 0, bubbleSize, 0.2, 0);
    fill(0, 255, 255, alpha);
    ellipse(0, 0, r, r);
  }
  
  // Inner purple gradient
  for(let r = bubbleSize * 0.6; r > 0; r -= 5) {
    let alpha = map(r, 0, bubbleSize, 0.2, 0);
    fill(255, 0, 255, alpha);
    ellipse(0, 0, r, r);
  }
  
  // White highlight in center
  for(let r = bubbleSize * 0.4; r > 0; r -= 5) {
    let alpha = map(r, 0, bubbleSize, 0.3, 0);
    fill(255, 255, 255, alpha);
    ellipse(0, 0, r, r);
  }
  
  blendMode(BLEND); // Reset blend mode
  pop();
}

function drawAura() {
  push();
  translate(width/2, height/2);
  
  let auraSize = 200;
  blendMode(SCREEN);
  
  for(let i = 0; i < 8; i++) {
    let t = time + i * 0.3;
    let x = cos(t) * 15;
    let y = sin(t) * 15;
    
    noStroke();
    fill(255, 0, 255, 0.1);
    ellipse(x, y, auraSize, auraSize);
    
    fill(0, 255, 255, 0.1);
    ellipse(x + 5, y - 5, auraSize * 0.9, auraSize * 0.9);
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
      let index = (x + y * width) * 4;
      pixels[index + 3] = noiseVal * 10;
    }
  }
  updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
} 