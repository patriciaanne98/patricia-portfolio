const BASES = {
  A: { name: "Adenine", pair: "T", hue: 219, sides: 3, color: "#2458ae" },
  T: { name: "Thymine", pair: "A", hue: 37, sides: 4, color: "#c58c32" },
  G: { name: "Guanine", pair: "C", hue: 165, sides: 6, color: "#237f73" },
  C: { name: "Cytosine", pair: "G", hue: 350, sides: 4, color: "#a34c58" }
};

let fasta;
let sequence = "";
let counts = { A: 0, T: 0, G: 0, C: 0 };
let percentages = {};
let gcContent = 0;
let dataError = false;

let evolution = 0;
let sequencePosition = 0;
let hovered = null;
let centers = [];
let faces = [];
let scaleFactor = 1;

const PAIRS = 27;

// LOAD REAL DNA DATA

function preload() {
  fasta = loadStrings(
    "./data/human-hbb.txt",
    () => {},
    () => { dataError = true; }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  frameRate(45);

  if (fasta) {
    sequence = fasta
      .filter(line => !line.startsWith(">"))
      .join("")
      .toUpperCase()
      .replace(/\s/g, "");
  }

  if (
    sequence.length !== 1608 ||
    !/^[ATGC]+$/.test(sequence)
  ) {
    dataError = true;
    return;
  }

  for (let base of sequence) {
    counts[base]++;
  }

  for (let base of Object.keys(BASES)) {
    percentages[base] =
      counts[base] / sequence.length * 100;
  }

  gcContent = percentages.G + percentages.C;
}

// MAIN ANIMATION

function draw() {
  drawBackground();

  if (dataError) {
    fill("#343c46");
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text("Unable to load the expected HBB DNA sequence.",
      width / 2, height / 2);
    return;
  }

  let dt = min(deltaTime, 50) / 1000;

  if (!hovered) {
    evolution += dt;
    sequencePosition += dt / 5;
  }

  scaleFactor = min(
  width / 520,
  height / 460
) * 0.85;

  buildArchitecture();
  drawShadow();
  renderArchitecture();
  detectHover();
  drawDataPanel();
  drawSequence();

  if (hovered) {
    drawTooltip();
  }
}

// BACKGROUND

function drawBackground() {
  let ctx = drawingContext;

  let gradient = ctx.createRadialGradient(
    width * 0.35,
    height * 0.25,
    0,
    width * 0.5,
    height * 0.5,
    max(width, height) * 0.85
  );

  gradient.addColorStop(0, "#faf9f5");
  gradient.addColorStop(0.6, "#deded8");
  gradient.addColorStop(1, "#aeb5bc");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// 3D PERSPECTIVE

function project(x, y, z) {
  let tilt =
    -0.48 +
    0.2 * sin(evolution * 0.12);

  let rx = x * cos(tilt) - y * sin(tilt);
  let ry = x * sin(tilt) + y * cos(tilt);

  let perspective = 1 + z / 650;

  return {
    x: width * 0.5 + rx * scaleFactor * perspective,
    y: height * 0.48 + ry * scaleFactor * perspective,
    z: z
  };
}

// DATA-DRIVEN GEOMETRY

function buildArchitecture() {
  centers = [];
  faces = [];

  let t = evolution;
  let offset = floor(sequencePosition) % sequence.length;

  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < PAIRS; i++) {

      let u = i / (PAIRS - 1);
      let index = (offset + i) % sequence.length;

      let referenceBase = sequence[index];

      let base = j === 0
        ? referenceBase
        : BASES[referenceBase].pair;

      let data = BASES[base];

      let twist =
        5.8 +
        1.5 * sin(t * 0.091) +
        0.7 * sin(t * 0.057);

      let angle =
        u * PI * twist +
        t * 0.28 +
        j * PI;

      let spread =
        noise(u * 3, t * 0.12) *
        sin(u * PI);

      let radius = 49 + spread * 55;

      let x =
        cos(angle) * radius +
        (j === 0 ? -1 : 1) * spread * 48 +
        24 * sin(u * 6 + t * 0.21);

      let y =
        (u - 0.5) * 340 +
        12 * sin(u * 9 + t * 0.2);

      let z = sin(angle) * radius;

      let center = project(x, y, z);

      centers.push({
        p: center,
        base: base,
        index: index,
        strand: j
      });

      let size =
        17 +
        7 * sin(u * 8 + t * 0.3 + j);

      let vertices = [];

      for (let k = 0; k < data.sides; k++) {
        let q =
          k * TWO_PI / data.sides +
          angle * 0.65;

        vertices.push(
          project(
            x + cos(q) * size,
            y + sin(q) * size * 0.85,
            z + cos(q + angle) * size * 0.65
          )
        );
      }

      let peak = project(
        x + 7 * sin(t * 0.3 + u * 10),
        y - 4,
        z + 18 + 8 * sin(t * 0.4 + u * 13)
      );

      for (let k = 0; k < data.sides; k++) {
        let points = [
          vertices[k],
          vertices[(k + 1) % data.sides],
          peak
        ];

        faces.push({
          points: points,
          z: points.reduce((sum, p) => sum + p.z, 0) / 3,
          hue: data.hue,
          lightness:
            32 + 23 * (0.5 + 0.5 * sin(k * 2.1 + angle))
        });
      }

      // Connect neighboring nucleotides

      if (i > 0) {
        let previous = centers[centers.length - 2].p;

        faces.push({
          line: true,
          points: [previous, center],
          z: (previous.z + center.z) / 2
        });
      }
    }
  }

  // Connect complementary base pairs

  for (let i = 0; i < PAIRS; i++) {
    let a = centers[i].p;
    let b = centers[PAIRS + i].p;

    let connection =
      noise(i * 0.15, t * 0.18);

    faces.push({
      line: true,
      pair: true,
      opacity: constrain(
        map(connection, 0.3, 0.7, 0, 0.8),
        0,
        0.8
      ),
      points: [a, b],
      z: (a.z + b.z) / 2
    });
  }
}

// RENDER ARCHITECTURAL SURFACES

function renderArchitecture() {
  let ctx = drawingContext;

  faces.sort((a, b) => a.z - b.z);

  for (let face of faces) {
    let p = face.points;

    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);

    for (let point of p.slice(1)) {
      ctx.lineTo(point.x, point.y);
    }

    if (face.line) {
      ctx.strokeStyle = face.pair
        ? `rgba(89,102,116,${face.opacity})`
        : "#526170";

      ctx.lineWidth =
        (face.pair ? 1.2 : 3) * scaleFactor;

      ctx.stroke();
      continue;
    }

    ctx.closePath();

    let gradient = ctx.createLinearGradient(
      p[0].x,
      p[0].y,
      p[2].x + 0.01,
      p[2].y + 0.01
    );

    let h = face.hue;
    let l = face.lightness;

    gradient.addColorStop(
      0, `hsl(${h},55%,${l - 9}%)`
    );

    gradient.addColorStop(
      0.4, `hsl(${h},64%,${l + 18}%)`
    );

    gradient.addColorStop(
      1, `hsl(${h + 12},35%,${l + 4}%)`
    );

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "#ffffff88";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
}

// FLOATING SHADOW

function drawShadow() {
  let ctx = drawingContext;

  ctx.save();
  ctx.translate(width * 0.5, height * 0.87);
  ctx.scale(1, 0.14);

  let radius = 160 * scaleFactor;

  let shadow = ctx.createRadialGradient(
    0, 0, 0,
    0, 0, radius
  );

  shadow.addColorStop(0, "#343b4840");
  shadow.addColorStop(1, "#343b4800");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, TWO_PI);
  ctx.fill();

  ctx.restore();
}

// REAL NUCLEOTIDE STATISTICS

function drawDataPanel() {
  let x = 24;
  let y = 24;

  noStroke();
  textAlign(LEFT, TOP);
  textFont("Arial");

  fill("#68717a");
  textSize(10);
  text("HUMAN DNA / HBB", x, y);

  fill("#343c46");
  textSize(24);
  text(sequence.length.toLocaleString() + " bp", x, y + 18);
}

// EVOLVING DNA SEQUENCE

function drawSequence() {
  let bases = ["A", "T", "G", "C"];

  let spacing = min(110, width / 4);
  let startX = width / 2 - spacing * 1.5;
  let y = height - 26;

  textFont("Arial");
  textSize(width < 400 ? 10 : 12);
  textAlign(CENTER, CENTER);
  noStroke();

  bases.forEach((base, i) => {
    let x = startX + i * spacing;

    fill(BASES[base].color);
    circle(x - 29, y, 6);

    fill("#343c46");
    text(
      base + " · " + percentages[base].toFixed(1) + "%",
      x + 6,
      y
    );
  });
}

// HOVER DETECTION

function detectHover() {
  hovered = null;

  if (
    mouseX < 0 || mouseX > width ||
    mouseY < 0 || mouseY > height
  ) return;

  let distance = max(10, 22 * scaleFactor);

  for (let item of centers) {
    let d = dist(
      mouseX,
      mouseY,
      item.p.x,
      item.p.y
    );

    if (d < distance) {
      distance = d;
      hovered = item;
    }
  }
}

// INTERACTIVE NUCLEOTIDE INFORMATION

function drawTooltip() {
  let item = hovered;
  let base = item.base;
  let data = BASES[base];

  // Complementary strand statistics are derived
  // from the corresponding reference bases.

  let statisticsBase =
    item.strand === 0 ? base : data.pair;

  let count = counts[statisticsBase];
  let percentage = percentages[statisticsBase];

  let boxWidth = 158;
  let boxHeight = 128;

  let x = item.p.x + 25;
  let y = item.p.y - 65;

  if (x + boxWidth > width - 10) {
    x = item.p.x - boxWidth - 25;
  }

  x = constrain(x, 8, max(8, width - boxWidth - 8));
  y = constrain(y, 8, max(8, height - boxHeight - 8));

  stroke("#596674");
  strokeWeight(0.8);
  line(
    item.p.x,
    item.p.y,
    x + boxWidth / 2,
    y + boxHeight / 2
  );

  noStroke();
  fill(248, 248, 244, 245);
  rect(x, y, boxWidth, boxHeight, 3);

  textAlign(LEFT, TOP);
  textFont("monospace");

  fill(data.color);
  textSize(10);
  text("NUCLEOTIDE / " + base, x + 12, y + 10);

  fill("#29323b");
  textSize(16);
  text(data.name, x + 12, y + 26);

  textSize(21);
  text(percentage.toFixed(1) + "%", x + 12, y + 47);

  textSize(10);
  text(count + " occurrences", x + 12, y + 73);
  text("Complement: " + data.pair, x + 12, y + 87);
  text("Position: " + (item.index + 1), x + 12, y + 101);

  textSize(8);
  text(
    item.strand === 0 ? "REFERENCE" : "COMPLEMENTARY",
    x + 12, y + 115
  );
}

// INTERACTION

function mousePressed() {
  evolution += 3;
  sequencePosition += 10;
  hovered = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  hovered = null;
}