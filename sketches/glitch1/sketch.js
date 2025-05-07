let helixSteps = [];
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  let height = 250;
  let steps = 60;
  let spacing = (height * 2) / steps;

  for (let i = 0; i <= steps; i++) {
    let y = -height + i * spacing;
    let angle = map(i, 0, steps, 0, TWO_PI * 5);
    let radius = 60;

    let x1 = cos(angle) * radius;
    let z1 = sin(angle) * radius;
    let x2 = cos(angle + PI) * radius;
    let z2 = sin(angle + PI) * radius;

    helixSteps.push({
      y,
      x1, z1,
      x2, z2,
      hueShift: random(360)
    });
  }
}

function draw() {
  setGradientBackground();

  rotateY(t * 0.0015);
  rotateX(sin(t * 0.001) * 0.1);

  ambientLight(150);
  pointLight(360, 100, 100, 0, -200, 400);
  directionalLight(255, 255, 255, 0.2, 0.4, -1);

  for (let p of helixSteps) {
    let hue1 = (p.hueShift + t) % 360;
    let hue2 = (p.hueShift + t + 180) % 360;

    // Strands
    push();
    translate(p.x1, p.y, p.z1);
    fill(hue1, 80, 100, 0.9);
    sphere(8, 12, 12);
    pop();

    push();
    translate(p.x2, p.y, p.z2);
    fill(hue2, 80, 100, 0.9);
    sphere(8, 12, 12);
    pop();

    // Color-blended base pair bridge
    push();
    stroke((hue1 + hue2) / 2, 80, 90, 0.4);
    strokeWeight(2.5);
    line(p.x1, p.y, p.z1, p.x2, p.y, p.z2);
    pop();
  }

  t += 1;
}

function setGradientBackground() {
  push();
  resetMatrix();
  translate(-width / 2, -height / 2, -500);
  for (let y = 0; y < height; y += 4) {
    let h = (t * 0.5 + y) % 360;
    fill(h, 40, 80, 0.12);
    rect(0, y, width, 4);
  }
  pop();
}
