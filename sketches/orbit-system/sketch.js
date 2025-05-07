let centerX, centerY;
let colors;

function setup() {
  createCanvas(800, 800);
  noLoop();
  background('#0d0d0d');
  centerX = width / 2;
  centerY = height / 2;
  colors = ['#FF5F57', '#FFD85F', '#69D2E7', '#FAFAFA'];

  for (let i = 0; i < 200; i++) {
    drawEcho(random(20, 350), random(8, 30), random(colors));
  }

  drawCentralEye();
  drawStaticOverlay();
}

function drawEcho(radius, fragments, col) {
  push();
  translate(centerX, centerY);
  rotate(random(TWO_PI));
  stroke(col + 'AA');
  noFill();
  strokeWeight(random(0.2, 1.2));
  beginShape();
  for (let i = 0; i < fragments; i++) {
    let angle = map(i, 0, fragments, 0, TWO_PI);
    let r = radius + noise(i * 0.2, radius * 0.01) * 50;
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    curveVertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

function drawCentralEye() {
  push();
  translate(centerX, centerY);
  fill('#FAFAFA');
  stroke('#FF5F57');
  strokeWeight(3);
  ellipse(0, 0, 80, 80);

  fill('#0d0d0d');
  noStroke();
  ellipse(0, 0, 25, 25);
  pop();
}

function drawStaticOverlay() {
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4 * 10) {
    if (random() < 0.01) {
      pixels[i] = 255;
      pixels[i+1] = 255;
      pixels[i+2] = 255;
      pixels[i+3] = 20;
    }
  }
  updatePixels();
}
