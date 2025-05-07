let t = 0;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  noFill();
  strokeCap(ROUND);
}

function draw() {
  background('#0E0E0E');
  translate(width / 2, height / 2 + sin(t) * 6);
  t += 0.5;

  let pulse = 1 + sin(t) * 0.015;
  let spin = sin(t * 0.5) * 2;

  push();
  rotate(spin);
  scale(pulse);
  drawDigitalStrawberry(t);
  pop();
}

function drawDigitalStrawberry(t) {
  push();

  // Outer geometric wireframe (strawberry shape via bezier)
  stroke('#FF3E5B');
  strokeWeight(2);
  beginShape();
  vertex(0, -80);
  bezierVertex(50, -60, 55, 40, 0, 100);
  bezierVertex(-55, 40, -50, -60, 0, -80);
  endShape(CLOSE);

  // Wireframe grid lines
  strokeWeight(0.5);
  stroke('#FFB6B9');
  for (let y = -60; y <= 90; y += 15) {
    let w = map(y, -60, 100, 10, 50);
    line(-w, y, w, y);
  }

  // Vertical lines
  for (let x = -40; x <= 40; x += 10) {
    let y1 = map(abs(x), 0, 40, -60, 90);
    line(x, -y1, x, y1);
  }

  // Digital seeds (glowing nodes)
  strokeWeight(3);
  for (let a = 0; a < 360; a += 15) {
    let r = map(sin(a * 2 + t), -1, 1, 20, 50);
    let x = cos(a) * r;
    let y = sin(a) * r * 1.2;
    stroke('#FFD6A5');
    point(x, y);
  }

  drawDigitalLeaves(t);
  pop();
}

function drawDigitalLeaves(t) {
  push();
  translate(0, -80);
  rotate(sin(t * 0.6) * 2);

  stroke('#8AFFA7');
  strokeWeight(1.2);
  for (let i = 0; i < 6; i++) {
    push();
    rotate(i * 60);
    ellipse(0, -20, 35, 15);
    pop();
  }

  pop();
}
