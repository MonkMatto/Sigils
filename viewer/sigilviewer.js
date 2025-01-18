const project = "Guardian Sigils";
const version = "5.0";
console.log(`${project} ${version} copyright Matto 2025`);
console.log(
    "URL PARAMETERS IN HTML MODE: address=0x...; bools: mono, fundamental, signature, invert, ghost, ether-style, still; numbers: stroke-width, distance"
  );

let address;//  = tokenData.address;
let traits;// = tokenData.traits;
let guardian;// = ToF(traits[0]);
let mono;// = ToF(traits[1]);
let invert;// = ToF(traits[2]);
let fundamental;// = ToF(traits[3]);
let ghost;// = ToF(traits[4]);
let etherStyle;// = ToF(traits[5]);
let distance;// = traits[6];
// if (distance > 10 ) {
//   distance = - distance / 10;
// }

let strokeWidth;
let customStroke = false;
let still = false;
let showSignature = false;
let backgroundColor = "rgb(25,25,25)";
let strokeColor = "white";

const urlParams = new URLSearchParams(window.location.search);
const urlAddress = urlParams.get("address");
if (urlAddress) {
  const regex = /^0x[0-9a-fA-F]{40}$/;
  if (regex.test(urlAddress)) {
    address = urlAddress;
    // console.log(`CUSTOM ADDRESS: ${address}`);
  }
}

const urlGuardian = urlParams.get("guardian");
if (urlGuardian == "true") {
  guardian = true;
}

const urlStill = urlParams.get("still");
if (urlStill == "true") {
  still = true;
}

const urlGhost = urlParams.get("ghost");  
if (urlGhost == "true") {
  ghost = true;
}
// console.log(`GHOST MODE: ${ghost}`);

const urlMono = urlParams.get("mono");
if (urlMono == "true") {
  mono = true;
}
// console.log(`MONO MODE: ${mono}`);

const urlEtherStyle = urlParams.get("ether-style");
if (urlEtherStyle == "true") {
  etherStyle = true;
}
// console.log(`ETHER STYLE: ${etherStyle}`);

const urlStrokeWidth = urlParams.get("stroke-width");
if (urlStrokeWidth) {
  if (!isNaN(urlStrokeWidth)) {
    strokeWidth = urlStrokeWidth;
    customStroke = true;
    // console.log(`CUSTOM STROKE WIDTH: ${strokeWidth}`);
  }
}

const urlSignature = urlParams.get("signature");
if (urlSignature == "true") {
  showSignature = true;
}

const urlfundamental = urlParams.get("fundamental");
if (urlfundamental == "true") {
  fundamental = true;
}
// console.log(`FUNDAMENTAL: ${fundamental}`);

const urlInvert = urlParams.get("invert");
if (urlInvert == "true") {
  invert = true;
} else if (urlInvert == "false") {
  invert = false;
}
// console.log(`INVERT: ${invert}`);

const urlDistance = urlParams.get("distance");
if (urlDistance) {
  if (!isNaN(urlDistance) && urlDistance < 11) {
    distance = parseInt(urlDistance);
  }
}
// console.log(`DISTANCE: ${distance}`);

let width = 1000;
let height = 1000;
let mid = width / 2;
if (!customStroke) {
  strokeWidth = Math.round(10 * (1.1 - (distance / 10))) / 10;
  // console.log(`STROKE WIDTH: ${strokeWidth}`);
}
if (invert) {
  backgroundColor = "rgb(230,230,230)";
  strokeColor = "black";
  // console.log("INVERT MODE: true");
} 
let hashArray = address.slice(2).split("");
let shapes = hashArray.length;
let points = new Array(shapes);
for (let i = 0; i < shapes; i++) {
  points[i] = [];
}
let spacing = Math.floor((width - (distance + 1) * 90) / shapes);
let bg = `<g id="background"><desc>Background Color</desc>`;
let mg1 = `<g id="midground-1"><desc>Midground circles at nodes, stroke-width = 1x.</desc>`;
let mg2 = `<g id="midground-2"><desc>Midground concentric circles and lines at center, stroke-width = 2x.</desc>`;
let fg = `<g id="foreground"><desc>Foreground shapes, stroke-width = 3x.</desc>`;
let svgAnima, svgStill;
let shapeGroups = new Array(shapes);

let ss = "stroke:";
let sws = "stroke-width:";
let sos = "stroke-opacity:";
let fos = "fill-opacity:";

let pens = [
  `${ss}${strokeColor}; ${sws}${strokeWidth * 1}px; ${sos}0.1;`,
  `${ss}${strokeColor}; ${sws}${strokeWidth * 2}px; ${sos}0.075;`,
  `${ss}${strokeColor}; ${sws}${strokeWidth * 3}px; ${sos}1.0;`,
];

if (ghost) {
  pens = [
    `${ss}${strokeColor}; ${sws}${strokeWidth * 1}px; ${sos}.5;`,
    `${ss}${strokeColor}; ${sws}${strokeWidth * 2}px; ${sos}0.075;`,
    `${ss}${strokeColor}; ${sws}${strokeWidth * 3}px; ${sos}0.1;`,
  ];
}

let hue = (parseInt(hashArray[0], 16) / 16) * 360;
console.log(`STARTING HUE: ${hue}`);
let saturation = 60;
let lightness = 50;
let color;
setColor(hue, saturation, lightness);

let svgStart = `<?xml version="1.0" encoding="utf-8"?><svg id="${project}" viewBox="0 0 ${width} ${width}" style="background-color:${backgroundColor}; ${ss}${strokeColor}; stroke-linecap:round; ${fos}0;" xmlns="http://www.w3.org/2000/svg">`;
let sig = signature();

function setColor(h, s, l) {
  color = `hsl(${h},${s}%,${l}%)`;
}

function signature() {
  let s = `<g id="signature" style="${ss}${strokeColor}; ${sws}${strokeWidth * 3}px; ${sos}1; stroke-linecap:round; ${fos}0;" ><desc>Signature, stroke-width = 3x.</desc>`;
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
    // console.log(`Drawing ${sections} sections for shape ${i}.`);
    inscribe(i, sections, radius);

    // draw the lines
    if (guardian) {
      let tempStr;
      let polygon = `<polygon points="`;
      for (let j = 0; j < sections; j++) {
        polygon += `${points[i][j].x},${points[i][j].y} `;

        if (!fundamental) {
          // concentric circles at inscription points
          if (!etherStyle) {
            tempStr = CC(
              points[i][j].x,
              points[i][j].y,
              strokeWidth * 4,
              3,
              `${pens[0]}`
            ); // add circles
          } else {
            let dist = ((40 - i) * strokeWidth) / 2.5;
            // tangent lines
            let angle1 = Math.atan2(points[i][j].y - mid, points[i][j].x - mid);
            let x1 = points[i][j].x + dist * Math.cos(angle1 + Math.PI / 2);
            let y1 = points[i][j].y + dist * Math.sin(angle1 + Math.PI / 2);
            let x2 = points[i][j].x + dist * Math.cos(angle1 - Math.PI / 2);
            let y2 = points[i][j].y + dist * Math.sin(angle1 - Math.PI / 2);
            // perpendicular lines
            let angle2 = Math.atan2(points[i][j].y - mid, points[i][j].x - mid);
            let x3 = points[i][j].x + 2 * dist * Math.cos(angle2 + Math.PI);
            let y3 = points[i][j].y + 2 * dist * Math.sin(angle2 + Math.PI);
            let x4 = points[i][j].x + 2 * dist * Math.cos(angle2);
            let y4 = points[i][j].y + 2 * dist * Math.sin(angle2);
            tempStr = L(
              x3,
              y3,
              x4,
              y4,
              `${pens[0]}`
            );
            // draw a polygon with the four points
            tempStr += `<polygon points="${x1},${y1} ${x3},${y3} ${x2},${y2} ${x4},${y4}" style="${pens[0]}" />`;
          }

          mg1 += tempStr;
          shapeGroups[i] += tempStr;

          // lines from inscription points to center
          tempStr = L(points[i][j].x, points[i][j].y, mid, mid, `${pens[1]}`);
          mg2 += tempStr;
          shapeGroups[i] += tempStr;
        }
        if (j == 0) {
          tempStr = L(
            points[i][j].x,
            points[i][j].y,
            points[i][sections - 1].x,
            points[i][sections - 1].y,
            `${pens[2]}`
          );
          fg += tempStr;
          shapeGroups[i] += tempStr;

        } else {
          tempStr = L(
            points[i][j].x,
            points[i][j].y,
            points[i][j - 1].x,
            points[i][j - 1].y,
            `${pens[2]}`
          );
          fg += tempStr;
          shapeGroups[i] += tempStr;
        }
      }
      tempStr = `${polygon}" style="${sos}0; ${fos}.075; fill:${color};" />`;
      bg += tempStr;
      if (!mono) {
        shapeGroups[i] += tempStr;
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
        `${sos}0; ${fos}.02; fill:${color};`
      );
      if (!mono) {
        shapeGroups[i] += C(
          points[i][j].x,
          points[i][j].y,
          dist,
          `${sos}0; ${fos}.02; fill:${color};`
        );
      }
    }
  }

  const rotationDuration = radius * 0.2; 
  let startDeg = 0;
  let endDeg = 360;
  if ((sections + i) % 2 == 0) {
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

function updateSVG() {
  const existingSVG = document.getElementById(project);
  if (existingSVG) {
    existingSVG.remove();
  }
  svgAnima = svgStart;
  svgStill = svgStart;
  if (!mono) {
    svgStill += `${bg}${mg1}${mg2}${fg}`;
  } else {
    svgStill += `${mg1}${mg2}${fg}`;
  }
  for (let i = 0; i < shapes; i++) {
    svgAnima += shapeGroups[i];
  }
  if (showSignature) {
    svgStill += `${sig}</svg>`;
    svgAnima += `${sig}</svg>`;
  } else {
    svgStill += "</svg>";
    svgAnima += "</svg>";
  }
  if (still) {
    document.body.insertAdjacentHTML("beforeend", svgStill);
  } else {
    document.body.insertAdjacentHTML("beforeend", svgAnima);
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

function ToF(value) {
  return value == 1 ? true : false;
}

document.addEventListener("keydown", (event) => {
  const k = event.key.toUpperCase();
  if (k === "A" || k === "S" || k === "P") {
    let bkStr = mono ? "_mono" : "";
    let name = `${project}_${address}${bkStr}`;
    if (k === "A") {
      saveStrings([svgAnima], `${name}_ANIMA`, "svg");
    } else if (k === "S") {
      saveStrings([svgStill], `${name}_STILL`, "svg");
    } else if (k === "P") {
      saveStrings([svgStill], `${name}_BITMA`, "png");
    }
  } else if (k === "H") {
    showSignature = !showSignature;
    updateSVG();
  }
});

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



// function rplc(s, o, n) {
//   return s.split(o).join(n);
// }