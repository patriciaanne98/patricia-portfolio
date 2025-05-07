let branches = [];
let surrealParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  background(280, 20, 95); // dream mist pink
  strokeWeight(2);
  noCursor();

  branches.push(new Branch(width / 2, height, -HALF_PI, 80, 0));

  // Floating dream particles
  for (let i = 0; i < 80; i++) {
    surrealParticles.push({
      x: random(width),
      y: random(height),
      r: random(1, 4),
      speed: random(0.1, 0.4),
      hueOffset: random(360)
    });
  }
}

function draw() {
  drawSurrealMist();     // 🌫 shifting dream gradient
  drawSurrealParticles(); // 🫧 floating thoughts
  drawGlowAura();        // ✨ bonsai breath

  for (let b of branches) {
    b.update();
    b.display();
  }

  if (frameCount % 30 === 0 && branches.length < 200) {
    let newBranches = [];
    for (let b of branches) {
      if (!b.hasBranched && b.len > 10) {
        newBranches.push(b.branch(random(PI / 8, PI / 4)));
        newBranches.push(b.branch(-random(PI / 8, PI / 4)));
        b.hasBranched = true;
      }
    }
    branches = branches.concat(newBranches);
  }
}

class Branch {
  constructor(x, y, angle, len, depth) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.len = len;
    this.depth = depth;
    this.hasBranched = false;
  }

  update() {
    this.endX = this.x + cos(this.angle + sin(frameCount * 0.005 + this.depth)) * this.len;
    this.endY = this.y + sin(this.angle + sin(frameCount * 0.005 + this.depth)) * this.len;
  }

  display() {
    strokeWeight(map(this.len, 5, 80, 0.6, 3.5));
    stroke((this.depth * 10 + frameCount) % 360, 40, 40 + this.depth * 5, 0.7);
    line(this.x, this.y, this.endX, this.endY);

    // Glowing surreal leaf
    if (this.len < 15) {
      noStroke();
      fill((frameCount * 1.5 + this.depth * 20) % 360, 60, 100, 0.6);
      ellipse(this.endX, this.endY, 10 + sin(frameCount * 0.1 + this.depth) * 3);
    }
  }

  branch(offset) {
    let newLen = this.len * random(0.6, 0.8);
    return new Branch(this.endX, this.endY, this.angle + offset, newLen, this.depth + 1);
  }
}

// 🌫 Pastel mist background shifting subtly
function drawSurrealMist() {
  noStroke();
  let hueShift = (frameCount * 0.1) % 360;
  for (let r = width * 1.5; r > 0; r -= 10) {
    fill((hueShift + r) % 360, 20, 95, 0.01);
    ellipse(width / 2, height / 1.2, r, r * 0.6);
  }
}

// ✨ Breathing glow aura
function drawGlowAura() {
  noStroke();
  for (let i = 0; i < 10; i++) {
    fill(60, 20, 100, 0.015);
    ellipse(width / 2, height, width * 1.1 - i * 20, height * 0.5 - i * 10);
  }
}

// 🫧 Floating dream particles
function drawSurrealParticles() {
  for (let p of surrealParticles) {
    fill((frameCount + p.hueOffset) % 360, 30, 100, 0.1);
    noStroke();
    ellipse(p.x, p.y, p.r);
    p.y -= p.speed;
    if (p.y < -10) {
      p.y = height + random(50);
      p.x = random(width);
    }
  }
}
