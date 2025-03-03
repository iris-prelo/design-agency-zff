let capture, scl = 1;
let x, y, xSpeed, ySpeed, rot = 0;
let breite = 800; // Initial height
let videoWidth = 800; // Initial width
let oscillationSpeed = 0.02; // Speed of oscillation
let time = 0; // Time variable for oscillation

function setup() {
    createCanvas(windowWidth, windowHeight);
    capture = createCapture(VIDEO);
    capture.size(600, 600); // Set initial size of the video capture
    capture.hide(); // Hide raw camera
    imageMode(CENTER);
    frameRate(30);

    // Initialize position and speed
    x = random(videoWidth / 2, width - videoWidth / 2);
    y = random(breite / 2, height - breite / 2);
    xSpeed = 2; // Horizontal speed
    ySpeed = 2; // Vertical speed
}

function draw() {
    background(0, 0); // Clear the canvas with a semi-transparent black background

    // Oscillate `breite` (height) and `videoWidth` dynamically
    breite = map(sin(time * 2), -1, 1, 10, windowWidth /4);
    videoWidth = map(cos(time * 2), -1, 1 , 10, windowHeight/4);
    time += oscillationSpeed;

    let videoHeight = capture.height * scl;

    // Update position
    x += xSpeed;
    y += ySpeed;

    // Bounce logic with dynamic width and height
    if (x - videoWidth / 2 <= 0) {
        x = videoWidth / 2; // Keep inside bounds
        xSpeed *= -1;
    } else if (x + videoWidth / 2 >= width) {
        x = width - videoWidth / 2;
        xSpeed *= -1;
    }

    if (y - breite / 2 <= 0) {
        y = breite / 2;
        ySpeed *= -1;
    } else if (y + breite / 2 >= height) {
        y = height - breite / 2;
        ySpeed *= -1;
    }

    // Draw the video with oscillating width and height
    push();
    translate(x, y);
    rotate(radians(rot));
    image(capture, 0, 0, videoWidth * scl, breite * scl); // Use oscillating videoWidth and breite
    pop();
}

function keyPressed() {
    if (key === "s") {
        save("poster.png");
    }
} 