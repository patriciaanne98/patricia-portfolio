let bodyPoints = [];
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Base human shape using cylindrical layering
  for (let y = -150; y <= 100; y += 10) {
    let r = map(abs(y), 0, 150, 30, 10);
    for (let a = 0; a < TWO_PI; a += PI / 10) {
      let x = cos(a) * r;
      let z = sin(a) * r;
      bodyPoints.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        offset: random(1000),
        hue: random([180, 200, 220, 260, 300])
      });
    }
  }

  // Add glitchy, spherical head cloud
  for (let i = 0; i < 50; i++) {
    let theta = random(TWO_PI);
    let phi = random(PI);
    let r = 25;
    let x = r * sin(phi) * cos(theta);
    let y = r * sin(phi) * sin(theta) - 180;
    let z = r * cos(phi);
    bodyPoints.push({
      baseX: x,
      baseY: y,
      baseZ: z,
      offset: random(1000),
      hue: random([200, 260, 320])
    });
  }
}

function draw() {
  background(250, 10, 95); // clean digital white

  rotateY(t * 0.002);
  rotateX(sin(t * 0.0015) * 0.2);

  ambientLight(180);
  pointLight(255, 255, 255, 0, -200, 400);
  directionalLight(255, 255, 255, 0.2, 0.5, -1);

  for (let p of bodyPoints) {
    push();

    // Fractal distortion
    let fx = sin(t * 0.01 + p.offset) * 10;
    let fy = cos(t * 0.015 + p.offset) * 7;
    let fz = sin(t * 0.008 + p.offset * 0.7) * 5;

    // Glitch flicker
    let glitch = random() < 0.02 ? random(-10, 10) : 0;

    translate(
      p.baseX + fx + glitch,
      p.baseY + fy,
      p.baseZ + fz
    );

    fill((p.hue + t) % 360, 60 + sin(p.offset + t * 0.02) * 30, 100, 0.85);
    sphere(4 + sin(t * 0.01 + p.offset) * 0.8, 10, 10);
    pop();
  }

  drawLissajousTrails();

  t += 1;
}

function drawLissajousTrails() {
  push();
  rotateY(t * 0.002);
  stroke(220, 40, 80, 0.25);
  noFill();

  for (let i = -2; i <= 2; i++) {
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let x = 100 * sin(3 * a + t * 0.01);
      let y = 100 * sin(4 * a + t * 0.01 + i);
      let z = 40 * sin(a + i);
      vertex(x, y, z);
    }
    endShape();
  }
  pop();
}
