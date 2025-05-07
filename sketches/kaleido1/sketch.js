let palette = ['#FAF4E5', '#DAB6C4', '#9C89B8', '#6D6875', '#352F44'];

function setup() {
  createCanvas(800, 800);
  noLoop();
  background('#FAF4E5');
  let grid = 10;
  let tileSize = width / grid;

  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      let px = x * tileSize;
      let py = y * tileSize;
      push();
      translate(px + tileSize / 2, py + tileSize / 2);
      rotate(floor(random(4)) * HALF_PI);
      drawComplexTile(tileSize);
      pop();
    }
  }

  // Title
  fill('#352F44');
  textAlign(CENTER);
  textFont('Georgia');
  textSize(24);
  text('Designer’s Mosaic II', width / 2, height - 25);
}

function drawComplexTile(size) {
  let steps = floor(random(3, 6));
  let stepSize = size / steps;
  noFill();

  // Base circle grid
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      let x = -size / 2 + stepSize / 2 + i * stepSize;
      let y = -size / 2 + stepSize / 2 + j * stepSize;
      let r = stepSize * 0.3;
      stroke(random(palette));
      strokeWeight(1);
      ellipse(x, y, r);
    }
  }

  // Central arc with detail
  let arcSize = size * 0.8;
  strokeWeight(2);
  stroke(random(palette));
  arc(0, 0, arcSize, arcSize, 0, PI + QUARTER_PI);

  // Decorative lines
  strokeWeight(0.5);
  for (let i = 0; i < 5; i++) {
    stroke(random(palette));
    let len = size * random(0.2, 0.4);
    let angle = random(TWO_PI);
    let x1 = cos(angle) * len;
    let y1 = sin(angle) * len;
    line(0, 0, x1, y1);
  }

  // Central dot
  fill(random(palette));
  noStroke();
  ellipse(0, 0, 6, 6);
}
