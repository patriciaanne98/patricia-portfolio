let t = 0;
let waves = [];

function setup() {
  createCanvas(1000, 600);
  noFill();
  for (let i = 0; i < 6; i++) {
    waves.push(new CreativeWave(i));
  }
}

function draw() {
  background(245, 245, 245, 30); // trailing effect

  translate(0, height / 2);
  for (let wave of waves) {
    wave.update();
    wave.display();
  }

  t += 0.01;
}

class CreativeWave {
  constructor(index) {
    this.index = index;
    this.amp = random(30, 80);
    this.freq = random(0.01, 0.03);
    this.color = color(
      180 + sin(index) * 75,
      100 + cos(index * 2) * 120,
      255 - index * 30,
      100
    );
    this.offset = random(1000);
    this.strokeW = random(1.5, 3);
  }

  update() {
    this.offset += 0.005;
  }

  display() {
    stroke(this.color);
    strokeWeight(this.strokeW);
    beginShape();
    for (let x = 0; x < width; x += 5) {
      let y = sin(x * this.freq + t + this.offset) * this.amp;
      y += noise(x * 0.01, this.offset * 2) * 30 - 15; // jitter
      curveVertex(x, y + sin(this.index + t) * 20);
    }
    endShape();

    // Particle splashes
    for (let i = 0; i < 5; i++) {
      let x = random(width);
      let y = sin(x * this.freq + t + this.offset) * this.amp;
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 40);
      noStroke();
      ellipse(x, y + random(-10, 10), random(2, 5));
    }
  }
}
