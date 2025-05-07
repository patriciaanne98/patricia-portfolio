let palette = ['#4B1E1E', '#972D07', '#D8A91C', '#F3E0BE', '#6A93D4', '#234', '#2E1503'];
let shards = [];

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  noFill();
  for (let r = 1; r <= 6; r++) {
    let pieces = r * 8;
    let radius = r * 60;

    for (let i = 0; i < pieces; i++) {
      let angle = (360 / pieces) * i;
      let shard = createShard(radius, angle, r);
      shards.push(shard);
    }
  }
}

function draw() {
  background('maroon')
  translate(width / 2, height / 2);

  for (let i = 0; i < shards.length; i++) {
    let glow = sin(frameCount * 0.01 + i) * 60 + 180;
    let c = color(shards[i].baseColor);
    c.setAlpha(glow);
    fill(c);
    stroke(255, 40);
    strokeWeight(0.6);
    beginShape();
    vertex(shards[i].p1.x, shards[i].p1.y);
    vertex(shards[i].p2.x, shards[i].p2.y);
    vertex(shards[i].p3.x, shards[i].p3.y);
    endShape(CLOSE);
  }

  drawHalo();
  drawSignature();
}

function createShard(radius, angle, layer) {
  let inner = radius - 50;
  let outer = radius + random(15, 30);
  let spread = random(10, 25);
  let baseColor = random(palette);

  let p1 = polarToCartesian(inner, angle);
  let p2 = polarToCartesian(outer, angle + spread);
  let p3 = polarToCartesian(inner, angle + spread);

  return { p1, p2, p3, baseColor };
}

function polarToCartesian(r, angle) {
  let x = cos(angle) * r;
  let y = sin(angle) * r;
  return createVector(x, y);
}

function drawHalo() {
  noFill();
  stroke(255, 40);
  strokeWeight(1);
  ellipse(0, 0, 120, 120);
  ellipse(0, 0, 220, 220);
  ellipse(0, 0, 320, 320);
}

function drawSignature() {
  resetMatrix();
  fill('#f3e0be');
  noStroke();
  textFont('Georgia');
  textSize(14);
  textAlign(CENTER);
  text("Sanctum Fragments", width / 2, height - 30);
}
