let blooms = [];
let interactiveBloom;

const bloomPalette = [
  '#B5EAEA', '#EDF6E5', '#FFBCBC', '#FFC8A2',
  '#F38BA0', '#BAFFB4', '#B28DFF', '#FFD6E8',
  '#D0E7FF', '#FFFB96', '#FFAC81', '#A0E7E5',
  '#FFB3C6', '#D9ED92', '#CDB4DB'
];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');
  noFill();

  for (let i = 0; i < 30; i++) {
    blooms.push(new Bloom(random(width), random(height)));
  }

  interactiveBloom = new Bloom(width / 2, height / 2);
  interactiveBloom.radius = 90;
  interactiveBloom.speed = 0; // stays with cursor
}

function draw() {
  background(14, 17, 20, 20);

  for (let bloom of blooms) {
    bloom.update();
    bloom.display();
  }

  interactiveBloom.follow(mouseX, mouseY);
  interactiveBloom.display();
}

function mousePressed() {
  let newBloom = new Bloom(mouseX, mouseY);
  newBloom.radius = random(30, 70);
  newBloom.color = color(random(bloomPalette) + 'CC'); // Add transparency
  blooms.push(newBloom);
}

class Bloom {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = random(20, 80);
    this.offset = random(1000);
    this.color = color(random(bloomPalette) + 'CC');
    this.speed = random(0.5, 1.2);
  }

  follow(x, y) {
    let target = createVector(x, y);
    this.pos.lerp(target, 0.05);
  }

  update() {
    let t = frameCount * 0.01 + this.offset;
    this.pos.x += sin(t * 0.3) * this.speed * 0.5;
    this.pos.y += cos(t * 0.2) * this.speed * 0.5;

    // wrap around screen
    if (this.pos.x > width + this.radius) this.pos.x = -this.radius;
    if (this.pos.x < -this.radius) this.pos.x = width + this.radius;
    if (this.pos.y > height + this.radius) this.pos.y = -this.radius;
    if (this.pos.y < -this.radius) this.pos.y = height + this.radius;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(this.color);
    strokeWeight(1.2);
    let petals = floor(random(5, 8));
    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / 100) {
      let r = this.radius + sin(a * petals + frameCount * 0.02 + this.offset) * 10;
      let x = cos(a) * r;
      let y = sin(a) * r;
      curveVertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
