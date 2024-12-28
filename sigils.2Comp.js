// Updated script for rotating all shapes (polygons, circles, lines) together

function makeAddress() {
  let a = "0x";
  for (let i = 0; i < 40; i++) {
    a += Math.floor(Math.random() * 16).toString(16);
  }
  return a;
}

let guardian = true;
let address = makeAddress();

const project = "Sigils 2.0";
console.log(`${project} copyright Matto 2024`);

let background = true;
let invert = false;
let strokeWidth = 1;
let distance = 10;
let backgroundColor = "rgb(25,25,25)";
let strokeColor = "white";

const urlParams = new URLSearchParams(window.location.search);
const urlAddress = urlParams.get("address");
if (urlAddress) {
  const regex = /^0x[0-9a-fA-F]{40}$/;
  if (regex.test(urlAddress)) {
    address = urlAddress;
    console.log(`CUSTOM ADDRESS: ${address}`);
  }
}

let width = 1000;
let height = 1000;
let mid = width / 2;

let hashArray = address.slice(2).split("");
let shapes = hashArray.length;
let points = new Array(shapes);
for (let i = 0; i < shapes; i++) {
  points[i] = [];
}
let spacing = Math.floor((width - distance * 10) / shapes);

let fg = `<g id="foreground"><desc>Foreground shapes and animations.</desc>`;

let pens = [
  `stroke:${strokeColor}; stroke-width:${strokeWidth}px; stroke-opacity:0.1;`,
  `stroke:${strokeColor}; stroke-width:${strokeWidth * 2}px; stroke-opacity:0.05;`,
  `stroke:${strokeColor}; stroke-width:${strokeWidth * 3}px; stroke-opacity:1.0;`,
];

let hue = (parseInt(hashArray[0], 16) / 16) * 360;
let saturation = 60;
let lightness = 50;

setColor(hue, saturation, lightness);

let svgStart = `<?xml version="1.0" encoding="utf-8"?><svg id="${project}" viewBox="0 0 ${width} ${width}" style="background-color:${backgroundColor}; stroke:${strokeColor}; stroke-linecap:round; fill-opacity:0;" xmlns="http://www.w3.org/2000/svg">`;

function setColor(h, s, l) {
  color = `hsl(${h},${s}%,${l}%)`;
}

// Updated inscribe function to handle everything
function inscribe(n, s, r) {
  const groupId = `shape-group-${n}`; // Unique group ID for debugging
  let group = `<g id="${groupId}">`; // Start a new group

  for (let j = 0; j < s; j++) {
    let angle = (j / s) * Math.PI * 2;
    angle -= Math.PI / 2; // Rotate -90 degrees for alignment
    const x = mid + r * Math.cos(angle);
    const y = mid + r * Math.sin(angle);
    points[n].push({ x, y });
  }

  // Build the polygon points string
  const pointsString = points[n].map((pt) => `${pt.x},${pt.y}`).join(' ');

  // Add polygon
  group += `<polygon points="${pointsString}" style="fill:none; stroke:${strokeColor}; stroke-width:3;"></polygon>`;

  // Add circles at intersection points
  points[n].forEach((pt) => {
    group += `<circle cx="${pt.x}" cy="${pt.y}" r="${strokeWidth * 4}" style="fill:${strokeColor}; fill-opacity:0.5;" />`;
  });

  // Add lines from intersection points to center
  points[n].forEach((pt) => {
    group += `<line x1="${pt.x}" y1="${pt.y}" x2="${mid}" y2="${mid}" style="stroke:${strokeColor}; stroke-width:2;" />`;
  });

  // Add animation to the group
  const rotationDuration = r * 0.05; // Rotation duration proportional to radius
  group += `<animateTransform attributeName="transform" type="rotate" from="0 ${mid} ${mid}" to="360 ${mid} ${mid}" dur="${rotationDuration}s" repeatCount="indefinite" />`;

  group += `</g>`; // Close the group
  fg += group; // Add the group to the foreground
}

for (let i = 0; i < shapes; i++) {
  let shape = shapes - i;
  let radius = (spacing * shape) / 2;
  let value = parseInt(hashArray[i], 16);
  let sections = 1 + (value % 16);

  if (sections == 1) {
    console.log(`Nothing drawn for shape ${i}, shifting color.`);
    hue += 22.5;
    setColor(hue, saturation, lightness);
  } else {
    inscribe(i, sections, radius);
  }
}

fg += `</g>`;
updateSVG();

function updateSVG() {
  const existingSVG = document.getElementById(project);
  if (existingSVG) {
    existingSVG.remove();
  }
  const svg = `${svgStart}${fg}</svg>`;
  document.body.insertAdjacentHTML("beforeend", svg);
}
