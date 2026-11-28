
let fragments = [];
let shattered = false;
let shatterTime = 0;

const fragmentCount = 850;
const radius = 110;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Construct the sphere from individual fragments
  for (let i = 0; i < fragmentCount; i++) {
    let y = 1 - (i / (fragmentCount - 1)) * 2;
    let r = sqrt(1 - y * y);
    let theta = i * PI * (3 - sqrt(5));

    let position = createVector(
      cos(theta) * r * radius,
      y * radius,
      sin(theta) * r * radius
    );

    fragments.push({
      origin: position,
      direction: position.copy().normalize(),
      speed: random(60, 180),
      size: random(4, 9),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(8, 11, 18);

  // Lighting
  ambientLight(55, 60, 80);

  directionalLight(
    220, 230, 255,
    -0.5, 0.5, -1
  );

  pointLight(
    120, 160, 255,
    150, -150, 200
  );

  // Responsive sizing
  let scaleFactor = min(width, height) / 440;
  scale(scaleFactor);

  // Rotation and mouse interaction
  rotateY(frameCount * 0.006);
  rotateX(map(mouseY, 0, height, -0.3, 0.3));

  let explosion = 0;

  // Shattering and reconstruction
  if (shattered) {
    let elapsed = (millis() - shatterTime) / 1000;

    if (elapsed < 1) {
      explosion = sin(elapsed * HALF_PI);
    } else if (elapsed < 4) {
      explosion = pow(1 - (elapsed - 1) / 3, 2);
    } else {
      shattered = false;
    }
  }

  // Render each individual fragment
  for (let fragment of fragments) {
    push();

    let position = fragment.origin.copy();

    position.add(
      fragment.direction.copy().mult(
        explosion * fragment.speed
      )
    );

    translate(position.x, position.y, position.z);

    rotateX(fragment.rotation + explosion * 3);
    rotateY(fragment.rotation + explosion * 2);

    // Metallic appearance
    specularMaterial(180, 195, 220);
    shininess(80);

    box(
      fragment.size,
      fragment.size * 0.8,
      fragment.size * 0.45
    );

    pop();
  }
}

// Click to shatter the sphere
function mousePressed() {
  shattered = true;
  shatterTime = millis();
}

// Adjust canvas when the window resizes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
