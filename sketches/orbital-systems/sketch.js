
import * as satellite from "https://esm.sh/satellite.js@6.0.1";

// CANVAS
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

let width, height, radius, cx, cy;
let yaw = 0.4;
let pitch = -0.15;
let dragging = false;
let mouseX = -100;
let mouseY = -100;
let satellites = [];

const categories = {
  stations: {
    label: "Space Stations",
    color: "#ffffff"
  },
  starlink: {
    label: "Starlink",
    color: "#51dfb3"
  },
  navigation: {
    label: "Navigation",
    color: "#e6bc64"
  },
  weather: {
    label: "Weather",
    color: "#b69bff"
  },
  geostationary: {
    label: "Geostationary",
    color: "#65cfff"
  },
  other: {
    label: "Other Satellites",
    color: "#8499b5"
  }
};

const categoryIDs = {};

let viewingMode = "all";
let visibleSatellites = [];
let showPaths = true;

const activeCategories = new Set(
  Object.keys(categories)
);

async function loadCategories() {
  const files = {
    stations: "./data/stations.json",
    navigation: "./data/navigation.json",
    weather: "./data/weather.json",
    geostationary: "./data/communications.json"
  };

  await Promise.all(
    Object.entries(files).map(async ([key, path]) => {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Cannot load ${path}`);
      }

      const data = await response.json();

      categoryIDs[key] = new Set(
        data.map(record =>
          String(record.NORAD_CAT_ID)
        )
      );
    })
  );

  console.log("Satellite categories loaded!");
}

function getCategory(record) {
  const id = String(record.NORAD_CAT_ID);
  const name = String(record.OBJECT_NAME || "")
    .toUpperCase();

  if (categoryIDs.stations?.has(id)) {
    return "stations";
  }

  if (name.startsWith("STARLINK")) {
    return "starlink";
  }

  if (categoryIDs.navigation?.has(id)) {
    return "navigation";
  }

  if (categoryIDs.weather?.has(id)) {
    return "weather";
  }

  if (categoryIDs.geostationary?.has(id)) {
    return "geostationary";
  }

  return "other";
}

let selected = null;
let lockedSatellite = null;
let status = "Loading orbital data...";

// RESIZE
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  radius = Math.min(width, height) * 0.32;
  cx = width / 2;
  cy = height / 2;
}

window.addEventListener("resize", resize);
resize();

// STAR FIELD
const stars = Array.from({ length: 250 }, () => ({
  x: Math.random(),
  y: Math.random(),
  size: Math.random() * 1.2 + 0.2,
  opacity: Math.random() * 0.7 + 0.2
}));

// STYLIZED CONTINENT OUTLINES
const continents = [
  [
    [-168, 65], [-140, 70], [-125, 55],
    [-123, 40], [-105, 24], [-96, 18],
    [-83, 22], [-80, 32], [-65, 47],
    [-60, 57], [-85, 72], [-120, 75]
  ],
  [
    [-81, 12], [-62, 10], [-49, -2],
    [-35, -7], [-48, -28], [-66, -55],
    [-74, -42], [-80, -15]
  ],
  [
    [-17, 36], [5, 37], [32, 31],
    [44, 12], [51, 10], [40, -15],
    [27, -35], [16, -35], [2, -20],
    [-12, 5]
  ],
  [
    [-10, 36], [-10, 58], [20, 71],
    [60, 74], [100, 77], [150, 65],
    [177, 63], [153, 46], [130, 33],
    [122, 20], [105, 10], [100, 1],
    [78, 8], [67, 24], [48, 30],
    [35, 43], [15, 40]
  ],
  [
    [113, -22], [130, -12], [145, -16],
    [153, -28], [146, -39], [120, -35]
  ],
  [
    [-53, 60], [-28, 68], [-20, 81],
    [-49, 84], [-65, 76]
  ],
  [
    [45, -13], [51, -17],
    [47, -26], [43, -22]
  ]
];

function insidePolygon(x, y, polygon) {
  let inside = false;

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const a = polygon[i];
    const b = polygon[j];

    if (
      (a[1] > y) !== (b[1] > y) &&
      x < (b[0] - a[0]) * (y - a[1]) /
      (b[1] - a[1]) + a[0]
    ) {
      inside = !inside;
    }
  }

  return inside;
}

// GEOGRAPHIC COORDINATES
function geographicPoint(lat, lon, distance = 1) {
  return [
    distance * Math.cos(lat) * Math.sin(lon),
    -distance * Math.sin(lat),
    distance * Math.cos(lat) * Math.cos(lon)
  ];
}

// GENERATE DOTTED CONTINENTS
const land = [];

for (let lat = -85; lat <= 85; lat += 1.5) {
  const step = 1.5 / Math.max(
    0.2,
    Math.cos(lat * Math.PI / 180)
  );

  for (let lon = -180; lon < 180; lon += step) {
    if (
      continents.some(polygon =>
        insidePolygon(lon, lat, polygon)
      )
    ) {
      land.push({
        point: geographicPoint(
          lat * Math.PI / 180,
          lon * Math.PI / 180
        ),
        brightness: Math.random()
      });
    }
  }
}

// ROTATE AND PROJECT 3D COORDINATES
function project(point) {
  const [x, y, z] = point;

  const X = x * Math.cos(yaw) + z * Math.sin(yaw);
  const Z = -x * Math.sin(yaw) + z * Math.cos(yaw);

  const Y = y * Math.cos(pitch) - Z * Math.sin(pitch);
  const depth = y * Math.sin(pitch) + Z * Math.cos(pitch);

  return {
    x: cx + X * radius,
    y: cy + Y * radius,
    z: depth
  };
}



function updateVisibleSatellites() {

  if (viewingMode === "all") {
    visibleSatellites = satellites;
    return;
  }

  if (viewingMode === "category") {
    visibleSatellites = satellites.filter(sat =>
      activeCategories.has(sat.category)
    );
    return;
  }

  const limits = {
    stations: 8,
    starlink: 30,
    navigation: 15,
    weather: 10,
    geostationary: 12,
    other: 25
  };

  visibleSatellites = Object.entries(limits)
    .flatMap(([category, limit]) => {

      const group = satellites.filter(
        sat => sat.category === category
      );

      const count = Math.min(limit, group.length);

      return Array.from({ length: count }, (_, i) =>
        group[Math.floor(i * group.length / count)]
      );

    });
}

// LOAD REAL SATELLITE DATA
async function loadSatellites() {
  try {
     await loadCategories();

    const response = await fetch("./satellites.json");

    if (!response.ok) {
      throw new Error("Unable to load satellite data");
    }

    const data = await response.json();

    const colors = [
      "#6de6ff",
      "#91aaff",
      "#ffd381",
      "#8affc1"
    ];

    satellites = data.flatMap((record, index) => {
      try {
        const satrec = satellite.json2satrec(record);

        return [{
          name: record.OBJECT_NAME,
          id: record.NORAD_CAT_ID,
          epoch: record.EPOCH,
          inclination: Number(record.INCLINATION),
          period: 1440 / Number(record.MEAN_MOTION),
          satrec,
          category: getCategory(record),
color: categories[getCategory(record)].color,
          orbit: [],
          position: null,
          altitude: 0,
          velocity: 0
        }];
      } catch {
        return [];
      }
    });

    if (!satellites.length) {
      throw new Error("No valid satellite records");
    }

    status = "PUBLIC ORBITAL DATA";

updateVisibleSatellites();
updatePositions();
updateOrbits();

  } catch (error) {
    status = error.message;
    console.error(error);
  }
}

// CONVERT EARTH-FIXED COORDINATES


function earthFixedPoint(position, gmst) {
  const ecf = satellite.eciToEcf(position, gmst);

  const earthRadius = 6378.137;

  return [
    ecf.y / earthRadius,
    -ecf.z / earthRadius,
    ecf.x / earthRadius
  ];
}


// CALCULATE REAL SATELLITE POSITIONS
function updatePositions() {
  const now = new Date();
  const gmst = satellite.gstime(now);

 visibleSatellites.forEach(sat => {
    sat.position = null;

    try {
      const result = satellite.propagate(sat.satrec, now);

      if (!result?.position || !result?.velocity) return;

      const geo = satellite.eciToGeodetic(
        result.position,
        gmst
      );

      sat.position = earthFixedPoint(
        result.position,
        gmst
      );

      sat.altitude = geo.height;

      sat.velocity = Math.hypot(
        result.velocity.x,
        result.velocity.y,
        result.velocity.z
      );
    } catch {
      // Skip invalid orbital predictions.
    }
  });
}

// CALCULATE ORBITAL TRAJECTORIES
function updateOrbits() {
  const now = new Date();
  const gmst = satellite.gstime(now);

 const orbitLimit =
  viewingMode === "all" ? 250 :
  viewingMode === "category" ? 60 : 20;

const count = Math.min(
  orbitLimit,
  visibleSatellites.length
);

const featured = Array.from(
  { length: count },
  (_, i) => visibleSatellites[
    Math.floor(i * visibleSatellites.length / count)
  ]
);

const orbitTargets = selected
  ? [...new Set([...featured, selected])]
  : featured;

satellites.forEach(sat => {
  sat.orbit = [];
});

orbitTargets.forEach(sat => {

    for (let i = 0; i <= 120; i++) {
      const date = new Date(
        now.getTime() +
        sat.period * 60000 * i / 120
      );

      try {
        const result = satellite.propagate(
          sat.satrec,
          date
        );

        sat.orbit.push(
          result?.position
            ? earthFixedPoint(result.position, gmst)
            : null
        );
      } catch {
        sat.orbit.push(null);
      }
    }
  });
}

// DRAW STARS
function drawStars() {
  stars.forEach(star => {
    ctx.fillStyle =
      `rgba(190,218,255,${star.opacity})`;

    ctx.beginPath();

    ctx.arc(
      star.x * width,
      star.y * height,
      star.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });
}

// DRAW ORBITAL PATHS
function drawOrbits(front) {
 visibleSatellites.forEach(sat => {
    ctx.strokeStyle = sat.color;

    ctx.globalAlpha =
      selected === sat ? 0.95 : 0.15;

    ctx.lineWidth =
      selected === sat ? 1.8 : 0.65;

    ctx.beginPath();

    let drawing = false;

    sat.orbit.forEach(point => {
      if (!point) {
        drawing = false;
        return;
      }

      const p = project(point);

      if ((p.z > 0) === front) {
        if (drawing) {
          ctx.lineTo(p.x, p.y);
        } else {
          ctx.moveTo(p.x, p.y);
        }

        drawing = true;
      } else {
        drawing = false;
      }
    });

    ctx.stroke();
  });

  ctx.globalAlpha = 1;
}

// DRAW DIGITAL EARTH
function drawEarth() {
  const glow = ctx.createRadialGradient(
    cx, cy, radius * 0.85,
    cx, cy, radius * 1.23
  );

  glow.addColorStop(0, "#1a72db00");
  glow.addColorStop(0.43, "#4bbaff66");
  glow.addColorStop(1, "#1a72db00");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.23, 0, Math.PI * 2);
  ctx.fill();

  const ocean = ctx.createRadialGradient(
    cx - radius * 0.35,
    cy - radius * 0.45,
    radius * 0.03,
    cx, cy, radius
  );

  ocean.addColorStop(0, "#237cb1");
  ocean.addColorStop(0.65, "#0b3e76");
  ocean.addColorStop(1, "#071d3e");

  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Dotted land
  land.forEach(dot => {
    const p = project(dot.point);

    if (p.z <= 0) return;

    const light = 0.3 + p.z * 0.7;

    ctx.fillStyle = `rgba(
      ${70 + dot.brightness * 65},
      ${155 + dot.brightness * 70},
      ${130 + dot.brightness * 45},
      ${light}
    )`;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      Math.max(0.5, radius * 0.009),
      0,
      Math.PI * 2
    );

    ctx.fill();
  });

  // Latitude lines
  ctx.strokeStyle = "#7ac9ff25";
  ctx.lineWidth = 0.6;

  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath();

    let drawing = false;

    for (let lon = 0; lon <= 360; lon += 2) {
      const p = project(
        geographicPoint(
          lat * Math.PI / 180,
          lon * Math.PI / 180
        )
      );

      if (p.z > 0) {
        drawing
          ? ctx.lineTo(p.x, p.y)
          : ctx.moveTo(p.x, p.y);

        drawing = true;
      } else {
        drawing = false;
      }
    }

    ctx.stroke();
  }

  ctx.strokeStyle = "#72ccff88";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// DRAW REAL SATELLITES
function drawSatellites() {
  selected = lockedSatellite;
  let nearest = 18;

  visibleSatellites.forEach(sat => {
    if (!sat.position) return;

    const p = project(sat.position);

    // Hide satellites behind Earth.
    if (
      p.z < 0 &&
      Math.hypot(p.x - cx, p.y - cy) < radius
    ) return;

    const distance = Math.hypot(
      p.x - mouseX,
      p.y - mouseY
    );

    if (!lockedSatellite && distance < nearest) {
      nearest = distance;
      selected = sat;
    }

    
ctx.save();
ctx.translate(p.x, p.y);

ctx.fillStyle = sat.color;

const isDenseView = visibleSatellites.length > 500;

ctx.globalAlpha = isDenseView ? 0.75 : 0.95;

ctx.shadowColor = sat.color;
ctx.shadowBlur = isDenseView ? 0 : 5;

ctx.beginPath();

ctx.arc(
  0,
  0,
  isDenseView ? 1.1 : 2.2,
  0,
  Math.PI * 2
);

ctx.fill();
ctx.restore();

  });
}

// SATELLITE INFORMATION
function drawInformation() {
  ctx.font = "10px monospace";
  ctx.fillStyle = "#c7e6ff";

  ctx.fillText("ORBITAL SYSTEMS", 20, 25);

  ctx.fillStyle = "#64d7b1";
  ctx.fillText(status, 20, 43);

  ctx.fillStyle = "#80a9c9";

  const tracked = visibleSatellites.filter(
  sat => sat.position
).length;

  ctx.fillText(
    `DISPLAYING: ${tracked} / ${satellites.length}`,
    20,
    height - 48
  );

  ctx.fillText(
    "SGP4 / PREDICTED POSITIONS",
    20,
    height - 32
  );

  ctx.fillText(
    "SOURCE: CELESTRAK",
    20,
    height - 16
  );

  if (!selected) return;

  const p = project(selected.position);

  ctx.strokeStyle = selected.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
  ctx.stroke();

  const panelWidth = Math.min(220, width - 20);
  const panelHeight = 160;

  const x = Math.max(
    10,
    Math.min(p.x + 20, width - panelWidth - 10)
  );

  const y = Math.max(
    55,
    Math.min(p.y - 50, height - panelHeight - 60)
  );

  ctx.fillStyle = "#071426ee";
  ctx.fillRect(x, y, panelWidth, panelHeight);

  ctx.strokeStyle = "#36566e";
  ctx.strokeRect(x, y, panelWidth, panelHeight);

  ctx.fillStyle = selected.color;
  ctx.font = "bold 11px monospace";

  ctx.fillText(
    selected.name,
    x + 12,
    y + 20,
    panelWidth - 24
  );

  ctx.font = "10px monospace";
  ctx.fillStyle = "#b5d3e8";

  const details = [
    `Category: ${categories[selected.category].label}`,
    `NORAD ID: ${selected.id}`,
    `Altitude: ${selected.altitude.toFixed(1)} km`,
    `Velocity: ${selected.velocity.toFixed(2)} km/s`,
    `Inclination: ${selected.inclination.toFixed(2)}°`,
    `Period: ${selected.period.toFixed(1)} min`,
    `Epoch: ${String(selected.epoch).slice(0, 10)}`
  ];

  details.forEach((line, index) => {
    ctx.fillText(
      line,
      x + 12,
      y + 38 + index * 16,
      panelWidth - 24
    );
  });
}

// MOUSE INTERACTION


let clickStartX = 0;
let clickStartY = 0;

canvas.addEventListener("pointerdown", event => {
  clickStartX = event.clientX;
  clickStartY = event.clientY;
});

canvas.addEventListener("pointerup", event => {

  const movement = Math.hypot(
    event.clientX - clickStartX,
    event.clientY - clickStartY
  );

  if (movement > 5) return;

  if (lockedSatellite) {
    lockedSatellite = null;
    selected = null;
  } else if (selected) {
    lockedSatellite = selected;
  }

});

canvas.style.touchAction = "none";

canvas.addEventListener("pointermove", event => {
  const rect = canvas.getBoundingClientRect();

  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;

  if (dragging) {
    yaw += event.movementX * 0.008;
    pitch += event.movementY * 0.008;

    pitch = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, pitch)
    );
  }
});

canvas.addEventListener("pointerdown", event => {
  dragging = true;
  canvas.setPointerCapture(event.pointerId);
  canvas.style.cursor = "grabbing";
});

function stopDragging() {
  dragging = false;
  canvas.style.cursor = "grab";
}

canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);

canvas.addEventListener("pointerleave", () => {
  mouseX = -100;
  mouseY = -100;
});


 // VIEW MODE AND CATEGORY FILTERS

const viewModeSelect = document.getElementById("view-mode");

const categoryFilters = document.getElementById("category-filters");

const categoryCheckboxes = categoryFilters.querySelectorAll(
  'input[type="checkbox"]'
);

function refreshView() {

  selected = null;
    lockedSatellite = null;

  activeCategories.clear();

  categoryCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      activeCategories.add(checkbox.value);
    }
  });

  updateVisibleSatellites();
  updatePositions();
  updateOrbits();
}

// SWITCH VIEWING MODES
viewModeSelect.addEventListener("change", () => {

  viewingMode = viewModeSelect.value;

  categoryFilters.hidden = viewingMode !== "category";

  refreshView();
});

// FILTER SATELLITE CATEGORIES
categoryCheckboxes.forEach(checkbox => {

  checkbox.addEventListener("change", () => {
    refreshView();
  });

});


// ANIMATION
let lastPositionUpdate = 0;
let lastOrbitUpdate = 0;


let previousSelected = null;

function animate(time) {
  ctx.fillStyle = "#030915";
  ctx.fillRect(0, 0, width, height);

  if (!dragging && !selected) {
    yaw += 0.002;
  }

  const updateInterval =
  visibleSatellites.length > 1000 ? 5000 : 1000;

if (time - lastPositionUpdate > updateInterval) {
    updatePositions();
    lastPositionUpdate = time;
  }

  if (time - lastOrbitUpdate > 60000) {
    updateOrbits();
    lastOrbitUpdate = time;
  }

 drawStars();
drawOrbits(false);
drawEarth();
drawOrbits(true);
drawSatellites();

if (selected !== previousSelected) {
  updateOrbits();
  previousSelected = selected;
}

drawInformation();

  requestAnimationFrame(animate);
}

loadSatellites();
requestAnimationFrame(animate);
