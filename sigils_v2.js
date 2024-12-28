function makeAddress() {
  let a = "0x";
  for (let i = 0; i < 40; i++) {
    a += Math.floor(Math.random() * 16).toString(16);
  }
  return a;
}

let guardian = true;
// let address = "0xF8d9056db2C2189155bc25A30269dc5dDeD15d46"; // will be added by solidity script
let address  = makeAddress(); // randomizer for testing

const project = "Sigils 2.0";
console.log(`${project} copyright Matto 2024`);
console.log(
  "URL PARAMETERS IN HTML MODE: address=0x..., background=bool, simplify=bool, signature=bool, invert=bool, stroke-width=positive-number, distance=number"
);
console.log(`DEFAULT ADDRESS: ${address}`);
let background = true;
let invert = false;
let simplify = false;
let still = false;
let strokeWidth = 1;
let distance = 10;
let showSignature = false;
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

const urlStill = urlParams.get("still");
if (urlStill == "true") {
  still = true;
}

const urlBackground = urlParams.get("background");
if (urlBackground == "false") {
  background = false;
}
console.log(`BACKGROUND MODE: ${background}`);

const urlStroke = urlParams.get("stroke-wdith");
if (urlStroke) {
  strokeWidth = urlStroke;
}
const urlStrokeWidth = urlParams.get("stroke-width");
if (urlStrokeWidth) {
  if (!isNaN(urlStrokeWidth)) {
    strokeWidth = urlStrokeWidth;
  }
}
console.log(`STROKE WIDTH: ${strokeWidth}`);
const urlSignature = urlParams.get("signature");
if (urlSignature == "false") {
  showSignature = false;
}
console.log(`SIGNATURE: ${showSignature}`);

const urlSimplify = urlParams.get("simplify");
if (urlSimplify == "true") {
  simplify = true;
}
console.log(`SIMPLIFY: ${simplify}`);

const urlInvert = urlParams.get("invert");
if (urlInvert == "true") {
  invert = true;
  backgroundColor = "rgb(230,230,230)";
  strokeColor = "black";
  console.log("INVERT MODE: true");
} else {
  backgroundColor = "rgb(25,25,25)";
  strokeColor = "white";
  console.log("INVERT MODE: false");
}

const urlDistance = urlParams.get("distance");
if (urlDistance) {
  if (!isNaN(urlDistance)) {
    distance = parseInt(urlDistance) * 10;
  }
}
console.log(`DISTANCE: ${distance / 10}`);

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
let bg = `<g id="background"><desc>Background Color</desc>`;
let mg1 = `<g id="midground-1"><desc>Midground circles at nodes, stroke-width = 1x.</desc>`;
let mg2 = `<g id="midground-2"><desc>Midground concentric circles and lines at center, stroke-width = 2x.</desc>`;
let fg = `<g id="foreground"><desc>Foreground shapes, stroke-width = 3x.</desc>`;
let svg, svgStill;
let shapeGroups = new Array(shapes);

let pens = [
  `stroke:${strokeColor}; stroke-width:${
    strokeWidth * 1
  }px; stroke-opacity:0.1;`,
  `stroke:${strokeColor}; stroke-width:${
    strokeWidth * 2
  }px; stroke-opacity:0.05;`,
  `stroke:${strokeColor}; stroke-width:${
    strokeWidth * 3
  }px; stroke-opacity:1.0;`,
];

let hue = (parseInt(hashArray[0], 16) / 16) * 360;
console.log(`STARTING HUE: ${hue}`);
let saturation = 60;
let lightness = 50;
let color;
setColor(hue, saturation, lightness);

let svgStart = `<?xml version="1.0" encoding="utf-8"?><svg id="${project}" viewBox="0 0 ${width} ${width}" style="background-color:${backgroundColor}; stroke:${strokeColor}; stroke-linecap:round; fill-opacity:0;" xmlns="http://www.w3.org/2000/svg">`;
let sig = signature();

function setColor(h, s, l) {
  color = `hsl(${h},${s}%,${l}%)`;
}

function signature() {
  let s = `<g id="signature" style="stroke:${strokeColor}; stroke-width:${
    strokeWidth * 3
  }px; stroke-opacity:1; stroke-linecap:round; fill-opacity:0;" ><desc>Signature, stroke-width = 3x.</desc>`;
  s += `<polyline points="924,956 920,956 920,860 940,872 960,860 960,956 956,956" />`;
  s += `<polyline points="928,902 940,872 952,902" stroke-linejoin="bevel" />`;
  s += L(934, 888, 946, 888);
  s += L(920, 902, 960, 902);
  s += L(932, 902, 932, 927);
  s += L(948, 902, 948, 927);
  s += C(940, 940, 15);
  s += `</g>`;
  return s;
}

for (let i = 0; i < shapes; i++) { 
  shapeGroups[i] = `<g id="shape${i}">`;
  let shape = shapes - i;

  let radius = (spacing * shape) / 2;
  let value = parseInt(hashArray[i], 16);
  let sections = 1 + (value % 16);

  mg2 += C(mid, mid, radius, `${pens[1]}`);
  shapeGroups[i] += C(mid, mid, radius, `${pens[1]}`);

  if (sections == 1) {
    console.log(`Nothing drawn for shape ${i}, shifting color.`);
    hue += 22.5;
    setColor(hue, saturation, lightness);
  } else if (sections == 2) {
    console.log(`Drawing a single circle for shape ${i}.`);
    points[i].push({ mid, mid });
    if (guardian) {
      fg += MC(mid, mid, radius, 4, `${pens[2]}`);
      shapeGroups[i] += MC(mid, mid, radius, 4, `${pens[2]}`);
    }
  } else {
    console.log(`Drawing ${sections} sections for shape ${i}.`);
    inscribe(i, sections, radius);

    // draw the lines
    if (guardian) {
      let polygon = `<polygon points="`;
      for (let j = 0; j < sections; j++) {
        polygon += `${points[i][j].x},${points[i][j].y} `;

        if (!simplify) {
          // concentric circles at inscription points
          mg1 += CC(
            points[i][j].x,
            points[i][j].y,
            strokeWidth * 4,
            3,
            `${pens[0]}`
          ); // add circles

          shapeGroups[i] += CC(
            points[i][j].x,
            points[i][j].y,
            strokeWidth * 4,
            3,
            `${pens[0]}`
          ); // add circles

          // lines from inscription points to center
          mg2 += L(points[i][j].x, points[i][j].y, mid, mid, `${pens[1]}`);

          shapeGroups[i] += L(points[i][j].x, points[i][j].y, mid, mid, `${pens[1]}`);
        }
        if (j == 0) {
          fg += L(
            points[i][j].x,
            points[i][j].y,
            points[i][sections - 1].x,
            points[i][sections - 1].y,
            `${pens[2]}`
          );

          shapeGroups[i] += L(
            points[i][j].x,
            points[i][j].y,
            points[i][sections - 1].x,
            points[i][sections - 1].y,
            `${pens[2]}`
          );
        } else {
          fg += L(
            points[i][j].x,
            points[i][j].y,
            points[i][j - 1].x,
            points[i][j - 1].y,
            `${pens[2]}`
          );

          shapeGroups[i] += L(
            points[i][j].x,
            points[i][j].y,
            points[i][j - 1].x,
            points[i][j - 1].y,
            `${pens[2]}` 
          );
        }
      }
      bg += `${polygon}" style="stroke-opacity:0; fill-opacity:.075; fill:${color};" />`;
      if (background) {
        shapeGroups[i] += `${polygon}" style="stroke-opacity:0; fill-opacity:.075; fill:${color};" />`;
      }
    }
    // add circles
    let dist = Math.sqrt(
      Math.pow(points[i][0].x - points[i][1].x, 2) +
        Math.pow(points[i][0].y - points[i][1].y, 2)
    );
    for (let j = 0; j < sections; j++) {
      // radiating color
      bg += C(
        points[i][j].x,
        points[i][j].y,
        dist,
        `stroke-opacity:0; fill-opacity:.02; fill:${color};`
      );
      if (background) {
        shapeGroups[i] += C(
          points[i][j].x,
          points[i][j].y,
          dist,
          `stroke-opacity:0; fill-opacity:.02; fill:${color};`
        );
      }
    }
  }

// Add animation to the group
  const rotationDuration = radius * 0.05; // Rotation duration proportional to radius
  let startDeg = 0;
  let endDeg = 360;
  if (sections % 2 == 0) {
    startDeg = 360;
    endDeg = 0;
  }
  shapeGroups[i] += `<animateTransform attributeName="transform" type="rotate" from="${startDeg} ${mid} ${mid}" to="${endDeg} ${mid} ${mid}" dur="${rotationDuration}s" repeatCount="indefinite" />`;
  shapeGroups[i] += "</g>";
}

bg += "</g>";
mg1 += "</g>";
mg2 += "</g>";
fg += "</g>";
updateSVG();
// }

function updateSVG() {
  const existingSVG = document.getElementById(project);
  if (existingSVG) {
    existingSVG.remove();
  }
  svg = svgStart;
  svgStill = svgStart;
  if (background) {
    svgStill += `${bg}${mg1}${mg2}${fg}`;
  } else {
    svgStill += `${mg1}${mg2}${fg}`;
  }
  for (let i = 0; i < shapes; i++) {
    svg += shapeGroups[i];
  }
  if (showSignature) {
    svgStill += `${sig}</svg>`;
    svg += `${sig}</svg>`;
  } else {
    svgStill += "</svg>";
    svg += "</svg>";
  }
  if (still) {
    document.body.insertAdjacentHTML("beforeend", svgStill);
  } else {
    document.body.insertAdjacentHTML("beforeend", svg);
  }
}

function inscribe(n, s, r) {
  for (let j = 0; j < s; j++) {
    let angle = (j / s) * Math.PI * 2;
    angle -= Math.PI / 2; // change the angle by rotating -90 degress
    const x = mid + r * Math.cos(angle);
    const y = mid + r * Math.sin(angle);
    points[n].push({ x, y });
  }
}

function C(x, y, r, s = "") {
  if (r < 0) {
    r = 0;
  }
  let c = `<circle cx="${x}" cy="${y}" r="${r}" `;
  s == "" ? (c += "/>") : (c += `style="${s}" />`);
  return c;
}

function FC(x, y, r, s = "") {
  let fc = `<g style="${s}"><desc>Filled Circle</desc>`;
  let reduce = strokeWidth * 0.9;
  for (let i = r; i > 0; i -= reduce) {
    fc += C(x, y, i);
  }
  fc += "</g>";
  return fc;
}

function MC(x, y, r, c, s = "") {
  let mc = `<g style="${s}"><desc>Multiple Circles</desc>`;
  let reduce = strokeWidth * 0.9;
  for (let i = 0; i < c; i++) {
    mc += C(x, y, r);
    r -= reduce;
  }
  mc += "</g>";
  return mc;
}

function CC(x, y, r, c, s = "") {
  let cc = `<g style="${s}"><desc>Concentric Circles</desc>`;
  for (let i = 1; i < c; i++) {
    cc += C(x, y, r * i);
  }
  cc += "</g>";
  return cc;
}

function L(x0, y0, x1, y1, s = "") {
  let l = `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" `;
  s == "" ? (l += "/>") : (l += `style="${s}" />`);
  return l;
}

document.addEventListener("keydown", (event) => {
  const k = event.key.toUpperCase();
  if (k === "S") {
    let name = background
      ? `Sigils_${address}`
      : `Sigils_NOBKG_${address}`;
    saveStrings([svg], name, "svg");
  } else if (k === "P") {
    let name = background
      ? `Sigils_${address}`
      : `Sigils_NOBKG_${address}`;
    saveStrings([svg], name, "png");
  } else if (k === "H") {
    showSignature = !showSignature;
    updateSVG();
  } else if (k === "B") {
    background = !background;
    updateSVG();
  } else if (k === "I") {
    let b = "black";
    let w = "white";
    let d = "rgb(25,25,25)";
    let l = "rgb(230,230,230)";
    let fgI = fg;
    let mgI1 = mg1;
    let mgI2 = mg2;
    let svgSI = svgStart;
    let sigI = sig;
    if (invert) {
      invert = false;
      fgI = rplc(fgI, b, w);
      mgI1 = rplc(mgI1, b, w);
      mgI2 = rplc(mgI2, b, w);
      sigI = rplc(sigI, b, w);
      svgSI = rplc(svgSI, l, d);
    } else {
      invert = true;
      fgI = rplc(fgI, w, b);
      mgI1 = rplc(mgI1, w, b);
      mgI2 = rplc(mgI2, w, b);
      sigI = rplc(sigI, w, b);
      svgSI = rplc(svgSI, d, l);
    }
    svgStart = svgSI;
    mg1 = mgI1;
    mg2 = mgI2;
    fg = fgI;
    sig = sigI;
    updateSVG();
  }
});

function rplc(s, o, n) {
  return s.split(o).join(n);
}

function saveStrings(content, name, extension) {
  if (extension === "png") {
    let mult = 6;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width * mult;
    canvas.height = height * mult;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width * mult, height * mult);
    const img = new Image();
    img.onload = () => { 
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${name}.${extension}`;
        link.click();
      });
    };
    img.src = `data:image/svg+xml;base64,${btoa(content)}`;
    return;
  }
  const blob = new Blob(content, { type: "image/svg+xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name}.${extension}`;
  link.click();
}


// p5
// function keyPressed() {
//   const k = key.toUpperCase();
//   if (k === "S") {
//     let name = background ? `Sigils-background_${address}` : `Sigils_${address}`;
//     saveStrings([svg], name, "svg");
//   } else if (k === "H") {
//     showSignature = !showSignature;
//     updateSVG();
//   } else if (k === "P") {
//     background = !background;
//     updateSVG();
//   } else if (k === "I") {
//     let url = new URL(window.location.href);
//     let params = url.searchParams;
//     let invert = params.get("invert");
//     if (invert == "true") {
//       params.delete("invert");
//     } else {
//       params.set("invert", "true");
//     }
//     url.search = params.toString();
//     window.history.pushState({}, "", url);
//     location.reload();
//   }
//   return false;
// }


// function makeSeed(input) {
//   let s = 1;
//   for (let i = 0; i < (input.length - 2) / 2; i++) {
//     let v = parseInt(input.slice(2 + i * 2, 4 + i * 2), 16);
//     s = ((s * v) % 999999999999) + 1
//   }
//   return s;
// }

// function makeHashPairs(input) {
//   let pairs = [];
//   for (let i = 2; i < input.length; i += 2) {
//     pairs.push(parseInt(input.slice(i, i + 2), 16));
//   }
//   return pairs;
// }

// function getValue() {
//   let v = hashArray[hashArray.length - 1];
//   hashArray.pop();
//   return v;
// }

// function R(min, max) {
//   const range = max - min + 1;
//   const v = (seed % range) + min;
//   newSeed();
//   return Math.floor(v);
// }

// function RR() {
//   return R(1,100)/100;
// }

// function newSeed() {
//   nonce++;
//   seed = ((seed * 35932678341237) + nonce) % 999999999999 + 1
// }

// function selectByProbs(list, randomValue) {
//   const totalWeight = list.reduce(function(acc, item, index) {
//     return acc + (1 / (index + 2));
//   }, 0);
//   const threshold = totalWeight * randomValue;
//   let currentSum = 0;
//   for (let i = 0; i < list.length; i++) {
//     currentSum += 1 / (i + 2);
//     if (currentSum >= threshold) {
//       return list[i];
//     }
//   }
//   return list[list.length - 1];
// }