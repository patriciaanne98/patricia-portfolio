let leftHemisphere = [];
let rightHemisphere = [];
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  let rows = 10;
  let cols = 6;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let angle = map(i, 0, rows, -PI / 2, PI / 2);
      let y = sin(angle) * 100;
      let z = cos(angle) * 60 + random(-10, 10);
      let xOffset = cos(map(j, 0, cols, -PI / 2, PI / 2)) * 50;

      leftHemisphere.push({
        x: -xOffset,
        y,
        z,
        size: random(6, 10),
        hue: random(360),
        offset: random(1000)
      });

      rightHemisphere.push({
        x: xOffset,
        y,
        z,
        size: random(6, 10),
        hue: random(360),
        offset: random(1000)
      });
    }
  }
}

function draw() {
  drawGradientBackground();

  rotateY(t * 0.0012);
  rotateX(sin(t * 0.001) * 0.15);

  ambientLight(160);
  pointLight(360, 100, 100, 0, -200, 400);

  renderBrain(leftHemisphere, true);
  renderBrain(rightHemisphere, false);

  t += 1;
}

function renderBrain(hemisphere, flip) {
  for (let n of hemisphere) {
    push();
    let wiggle = sin(t * 0.005 + n.offset) * 3;
    translate(
      n.x + wiggle,
      n.y + sin(t * 0.002 + n.offset) * 2,
      n.z + cos(t * 0.0015 + n.offset) * 3
    );
    fill((n.hue + t * 0.4) % 360, 80, 100, 0.85);
    sphere(n.size, 10, 10);
    pop();
  }
}

function drawGradientBackground() {
  push();
  resetMatrix();
  translate(-width / 2, -height / 2, -600);
  for (let y = 0; y < height; y += 5) {
    let h = (t + y * 0.4) % 360;
    fill(h, 40, 80, 0.08);
    rect(0, y, width, 5);
  }
  pop();
}
