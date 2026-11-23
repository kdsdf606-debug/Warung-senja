// POV dari balik meja warung. Versi dengan pembeli ada di src/archive/shop-v1.js.

Object.assign(GLYPHS, {
  Q:'010 101 101 110 011', X:'101 101 010 101 101', Z:'111 001 010 100 111',
  0:'111 101 101 101 111', 1:'010 110 010 010 111', 2:'110 001 010 100 111', 3:'110 001 010 001 110',
  4:'101 101 111 001 001', 5:'111 100 110 001 110', 6:'011 100 110 101 010', 7:'111 001 010 010 010',
  8:'010 101 010 101 010', 9:'010 101 011 001 110',
  '.':'0 0 0 0 1', ',':'00 00 00 01 10', '!':'1 1 1 0 1', '?':'110 001 010 000 010',
  ':':'0 1 0 1 0', '-':'000 000 111 000 000', '<':'001 010 100 010 001', '+':'000 010 111 010 000',
  N:'10001 11001 10101 10011 10001', K:'1001 1010 1100 1010 1001',
});

const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
const textW = (s, z = 1) => [...s].reduce((n, ch) => n + (ch === ' ' ? 3 : GLYPHS[ch].split(' ')[0].length + 1), -1) * z;
function txt(g, s, x, y, c, z = 1) {
  x = Math.round(x); y = Math.round(y);
  for (const ch of s) {
    if (ch === ' ') { x += 3 * z; continue; }
    const rows = GLYPHS[ch].split(' ');
    rows.forEach((row, j) => [...row].forEach((b, i) => { if (b === '1') px(g, x + i * z, y + j * z, z, z, c); }));
    x += (rows[0].length + 1) * z;
  }
}
const txtC = (g, s, cx, y, c, z = 1) => txt(g, s, cx - textW(s, z) / 2, y, c, z);
const inRect = (r, x, y) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;

function layer(w, h, paint) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  paint(c.getContext('2d', { willReadFrequently: true }));
  return c;
}

const OPENING = { x: 94, y: 40, w: 452, h: 134 };
const EXIT = { x: 6, y: 5, w: 52, h: 13 };
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const noise = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const pick = (ramp, v) => ramp[Math.max(0, Math.min(ramp.length - 1, Math.floor(v * ramp.length)))];

const RAMP = {
  teak: ['#3f271f', '#4e3126', '#5f3d2c', '#704a33', '#82593c', '#946a48'],
  ceiling: ['#2c1f20', '#382725', '#46312b', '#543b31'],
  plaster: ['#a58f73', '#b39c7e', '#c0a988', '#cbb593'],
  tile: ['#3f5a53', '#4b6a60', '#587a6d', '#6a8b7a'],
  cream: ['#6f5c4b', '#9a856a', '#c3ac8a', '#ddcaa6', '#efe2c5'],
  steel: ['#2f2c36', '#4b4852', '#706c74', '#9b979b', '#cfc9c4'],
  iron: ['#141218', '#1f1c24', '#2c2830', '#3b3640', '#524c55'],
  clay: ['#4a2a25', '#6e3f30', '#94563c', '#b9734e', '#d69868'],
  rust: ['#47241f', '#6c3429', '#8f4633', '#ad5c41', '#c67a57'],
  moss: ['#26382e', '#34493a', '#456048', '#5d7a56', '#7d9868'],
  stone: ['#37343a', '#4b474c', '#625c5f', '#7b7473', '#958c88'],
  rattan: ['#5b3d26', '#7a5533', '#9a7043', '#b98d59', '#d2aa74'],
};

function ell(g, cx, cy, rx, ry, c) {
  g.fillStyle = c;
  for (let j = -ry; j <= ry; j++) {
    const s = Math.round(rx * Math.sqrt(Math.max(0, 1 - (j / (ry + 0.3)) ** 2)));
    g.fillRect(Math.round(cx - s), Math.round(cy + j), s * 2 + 1, 1);
  }
}
function shadow(g, cx, cy, rx, ry, a = 0.38) { g.globalAlpha = a; ell(g, cx + 3, cy, rx, ry, '#160f18'); g.globalAlpha = 1; }
function poly(g, pts, c) {
  g.fillStyle = c; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
}
function cyl(g, cx, top, rx, ry, h, ramp, cap) {
  for (let i = -rx; i <= rx; i++) {
    const n = i / (rx + 0.5);
    const yo = Math.round(ry * Math.sqrt(1 - n * n));
    const v = 0.66 - n * 0.42 - n * n * 0.3 + (i === -Math.round(rx * 0.45) ? 0.2 : 0);
    px(g, cx + i, top, 1, h + yo, pick(ramp, v));
  }
  if (cap) ell(g, cx, top, rx, ry, cap);
}
function curve(g, x0, y0, x1, y1, x2, y2, c, w = 1) {
  g.fillStyle = c;
  const steps = Math.ceil(Math.hypot(x2 - x0, y2 - y0) * 1.6) + 4;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    g.fillRect(Math.round(u * u * x0 + 2 * u * t * x1 + t * t * x2), Math.round(u * u * y0 + 2 * u * t * y1 + t * t * y2), w, w);
  }
}

// Lapisan luar: kota basah saat senja
function paintOutside(g) {
  const sky = ['#1f2747', '#2a2f58', '#3d3864', '#5a4370', '#7f5278', '#a8637a', '#c87c78'];
  for (let y = 36; y < 128; y++) for (let x = 90; x < 550; x++) {
    const v = (y - 36) / 92 * (sky.length - 1) + BAYER[y % 4][x % 4] / 16 - 0.4;
    px(g, x, y, 1, 1, sky[Math.max(0, Math.min(sky.length - 1, Math.floor(v)))]);
  }
  [[150, 62, 90], [330, 52, 120], [440, 74, 70]].forEach(([x, y, w]) => {
    px(g, x, y, w, 2, '#6a4a74'); px(g, x + 12, y + 2, w - 26, 2, '#7f5278');
  });
  const row = (seed, base, minH, maxH, color, lit) => {
    let x = 86, n = seed;
    while (x < 554) {
      n = (n * 31 + 17) % 101;
      const w = 24 + n % 34, h = minH + (n * 7) % (maxH - minH);
      px(g, x, base - h, w, h, color);
      if (n % 3 === 0) px(g, x + 6, base - h - 6, 8, 6, color);
      if (lit) for (let wy = base - h + 5; wy < base - 5; wy += 7) for (let wx = x + 4; wx < x + w - 5; wx += 7)
        if (noise(wx, wy) > 0.72) px(g, wx, wy, 3, 4, noise(wy, wx) > 0.5 ? '#e9a95f' : '#c9824f');
      x += w;
    }
  };
  row(5, 132, 34, 68, '#4a3a63', false);
  row(23, 134, 22, 52, '#2c2743', true);
  px(g, 90, 130, 460, 7, '#5a5068');
  for (let x = 92; x < 550; x += 14) px(g, x, 130, 1, 7, '#463e56');
  px(g, 90, 137, 460, 2, '#776a7c');
  px(g, 90, 139, 460, 27, '#34344a');
  for (let y = 139; y < 166; y++) for (let x = 90 + (y % 2); x < 550; x += 2) if (noise(x, y) > 0.84) px(g, x, y, 2, 1, '#40405a');
  for (let x = 96; x < 550; x += 38) px(g, x, 152, 20, 1, '#a99f92');
  px(g, 90, 166, 460, 2, '#776a7c');
  px(g, 90, 168, 460, 8, '#5f546c');
  for (let x = 98; x < 550; x += 18) px(g, x, 168, 1, 8, '#4b435a');
  [[176, '#e9a95f'], [262, '#c9824f'], [352, '#e9a95f'], [468, '#e3b06f'], [516, '#c9824f']].forEach(([x, c]) => {
    for (let y = 140; y < 166; y += 2) { const w = 2 + (noise(x, y) * 7 | 0); g.globalAlpha = 0.42 * (1 - (y - 140) / 28); px(g, x - (w >> 1), y, w, 1, c); }
    g.globalAlpha = 1;
  });
  [[176, 92], [468, 88]].forEach(([x, y]) => {
    px(g, x, y, 1, 42, '#17151f'); px(g, x, y, 10, 1, '#17151f'); px(g, x + 8, y + 1, 5, 2, '#ffe2a6');
    for (let r = 14; r > 2; r -= 3) { g.globalAlpha = 0.07; ell(g, x + 10, y + 3, r, r, '#ffc47d'); }
    g.globalAlpha = 1;
  });
}

// Lapisan dalam: dinding, meja, dan barang
function paintShell(g) {
  const img = g.createImageData(640, 360), d = img.data;
  const ramps = Object.fromEntries(Object.entries(RAMP).map(([k, r]) => [k, r.map(rgb)]));
  const ramp = (name, v) => ramps[name][Math.max(0, Math.min(ramps[name].length - 1, Math.floor(v * ramps[name].length)))];
  for (let y = 0; y < 360; y++) for (let x = 0; x < 640; x++) {
    const dx = x + 0.5 - 320, dy = y + 0.5 - 120, ax = Math.abs(dx) / 242, ay = dy > 0 ? dy / 70 : -dy / 94;
    let col;
    if (ax < 1 && ay < 1) col = ramp('plaster', 0.3 + noise(x >> 1, y >> 1) * 0.3);
    else if (ax > ay) {
      const h = dy / ax, depth = 40 / ax;
      if (h > 18) {
        const row = Math.floor((h - 18) / 9), cell = depth + (row % 2) * 0.5, fc = cell - Math.floor(cell), fr = ((h - 18) / 9) - row;
        col = fc < 0.1 || fr < 0.12 ? ramps.tile[0] : ramp('tile', 0.3 + noise(Math.floor(cell), row) * 0.7);
      } else if (h > 12) col = ramp('teak', 0.55 + (h > 15 ? -0.3 : 0));
      else col = ramp('plaster', 0.2 + noise(x >> 2, y >> 2) * 0.28 + noise(x, y) * 0.16);
    } else if (dy > 0) {
      const t = ay, u = dx / t, v = 1 / t, plank = Math.floor(u / 38), fu = u / 38 - plank;
      const grain = Math.sin(u * 0.85 + plank * 2.7 + Math.sin(v * 5 + plank) * 1.5) * 0.08;
      const knot = Math.sin(u * 0.27 + plank * 5 + Math.sin(v * 3 + plank * 2)) * 0.05;
      const val = 0.42 + noise(plank, 3) * 0.26 + grain + knot + (noise(x, y) - 0.5) * 0.07;
      col = fu < 0.035 ? ramps.teak[0] : ramp('teak', val);
    } else {
      const u = dx / ay, plank = Math.floor(u / 34), fu = u / 34 - plank;
      col = fu < 0.07 ? ramps.ceiling[0] : ramp('ceiling', 0.3 + noise(plank, 8) * 0.6 + (noise(x, y) - 0.5) * 0.1);
    }
    const i = (y * 640 + x) * 4;
    d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);

}

const ART = {};

ART.frame = g => {
  px(g, 78, 26, 484, 7, '#3a2822'); px(g, 78, 33, 484, 1, '#20161a');
  px(g, 86, 36, 468, 142, '#4e3428'); px(g, 88, 38, 464, 2, '#6b4835');
  px(g, 90, 36, 4, 140, '#5f3f2e'); px(g, 546, 36, 4, 140, '#5f3f2e');
  g.clearRect(OPENING.x, OPENING.y, OPENING.w, OPENING.h);
  for (let y = 40; y < 52; y++) px(g, 94, y, 452, 1, y % 3 === 0 ? '#2f2c36' : y < 45 ? '#6a666e' : '#4b4852');
  px(g, 94, 52, 452, 1, '#1b171f');

};

ART.ledge = g => {
  px(g, 78, 174, 484, 9, '#7c5338');
  for (let x = 80; x < 560; x += 4) if (noise(x, 2) > 0.45) px(g, x, 174 + (noise(x, 1) * 8 | 0), 3 + (noise(x, 5) * 18 | 0), 1, '#6b4631');
  px(g, 78, 174, 484, 1, '#a57a54'); px(g, 78, 183, 484, 7, '#3d281f'); px(g, 78, 190, 484, 1, '#21161a');

};

ART.shelfLeft = g => {
  poly(g, [[0, 88], [66, 84], [66, 88], [0, 96]], '#6b4631');
  poly(g, [[0, 96], [66, 88], [66, 90], [0, 100]], '#2c1d1b');
  [[12, 58, 11, 'clay'], [36, 62, 9, 'cream'], [55, 66, 7, 'rust']].forEach(([x, y, r, name]) => {
    cyl(g, x, y, r, 3, 90 - y - (x < 20 ? 0 : 2), RAMP[name], RAMP[name][4]); ell(g, x, y, r - 2, 1, RAMP[name][1]);
  });
  poly(g, [[0, 134], [70, 124], [70, 128], [0, 142]], '#6b4631');
  poly(g, [[0, 142], [70, 128], [70, 130], [0, 146]], '#2c1d1b');
  for (let i = 0; i < 4; i++) { const x = 8 + i * 15; cyl(g, x, 112 - i, 6, 2, 16, RAMP.steel, RAMP.steel[3]); px(g, x + 6, 117 - i, 3, 5, RAMP.steel[1]); }

};

ART.wallRight = g => {
  ell(g, 606, 82, 19, 21, '#3a2822'); ell(g, 606, 82, 16, 18, '#ddcaa6');
  px(g, 606, 70, 1, 12, '#2c2830'); px(g, 606, 82, 8, 1, '#2c2830'); px(g, 605, 81, 3, 3, '#7a3f33');
  poly(g, [[575, 118], [604, 112], [604, 158], [575, 158]], '#d9c6a4');
  poly(g, [[575, 118], [604, 112], [604, 122], [575, 128]], '#8f4633');
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) px(g, 579 + i * 6, 133 + j * 6 - i, 3, 2, '#7d6b58');

};

ART.hanging = g => {
  [[100, '#8f4633', 5], [112, '#b58a45', 4], [124, '#4b6a60', 6]].forEach(([x, c, n]) => {
    px(g, x + 4, 40, 1, 12, '#1b171f');
    for (let j = 0; j < n; j++) {
      const y = 52 + j * 13 + (x % 3);
      px(g, x, y, 9, 12, c); px(g, x, y, 2, 12, 'rgba(255,240,210,.22)'); px(g, x + 2, y + 4, 5, 3, '#e6d6b6'); px(g, x, y + 11, 9, 1, '#1b171f');
    }
  });
  px(g, 524, 40, 1, 14, '#1b171f');
  [[510, 3], [516, -1], [523, 0], [530, 3]].forEach(([x, o], i) => {
    curve(g, 524, 54, x - 3, 66 + o, x + i, 90 + o, '#6d5a2c', 5);
    curve(g, 524, 54, x - 3, 65 + o, x + i + 1, 88 + o, '#c49c47', 3);
  });

};

ART.ledgeItems = g => {
  shadow(g, 133, 176, 22, 3);
  px(g, 113, 134, 40, 41, '#7b7473'); px(g, 115, 142, 36, 31, '#54606a');
  [[122, 165], [134, 167], [145, 163], [128, 156], [141, 153], [121, 149], [147, 149]].forEach(([x, y]) => { ell(g, x, y, 6, 5, '#bda077'); ell(g, x - 1, y - 1, 4, 3, '#dcc597'); });
  px(g, 116, 143, 3, 28, 'rgba(235,240,235,.3)'); px(g, 111, 132, 44, 6, '#9b979b'); px(g, 111, 132, 44, 1, '#cfc9c4'); px(g, 111, 138, 44, 1, '#3b3640');
  [[176, 18, 'rust'], [194, 13, 'cream']].forEach(([x, h, n], i) => { shadow(g, x, 176, 8, 2); cyl(g, x, 174 - h - i, 8, 3, h, RAMP[n], RAMP[n][3]); ell(g, x, 174 - h - i, 5, 1, RAMP[n][1]); });

  shadow(g, 500, 176, 15, 3);
  cyl(g, 500, 156, 13, 4, 18, RAMP.clay, '#3a2a24');
  [[-12, -10, 'leaf'], [-3, -23, 'dark'], [8, -18, 'leaf'], [15, -6, 'dark'], [-20, 1, 'dark'], [21, 5, 'leaf']].forEach(([a, b, t]) => {
    curve(g, 500, 156, 500 + a * 0.4, 156 + b, 500 + a, 156 + b * 0.4, '#34493a');
    ell(g, 500 + a, 154 + b * 0.5, 5, 3, t === 'leaf' ? '#5d7a56' : '#34493a');
  });
  curve(g, 511, 156, 522, 160, 520, 180, '#34493a');
  [[519, 166], [522, 174], [518, 181]].forEach(([x, y]) => ell(g, x, y, 3, 2, '#456048'));
  shadow(g, 450, 176, 24, 3);
  px(g, 428, 146, 44, 29, '#4e3126'); px(g, 428, 146, 44, 2, '#82593c'); px(g, 432, 151, 21, 19, '#2c1d1b');
  for (let y = 152; y < 169; y += 2) px(g, 433, y, 19, 1, '#524036');
  ell(g, 462, 157, 4, 4, '#c3ac8a'); ell(g, 462, 167, 2, 2, '#82593c'); px(g, 437, 124, 1, 22, '#2f2c36');

};

ART.riceCooker = g => {
  shadow(g, 122, 228, 39, 10);
  cyl(g, 120, 202, 35, 11, 24, RAMP.cream, '#ddcaa6');
  ell(g, 120, 200, 31, 9, '#c3ac8a'); ell(g, 118, 198, 27, 7, '#efe2c5'); ell(g, 120, 196, 5, 2, '#3b3640'); px(g, 118, 192, 5, 3, '#524c55');
  for (let i = -34; i <= 34; i++) px(g, 120 + i, 214 + Math.round(11 * Math.sqrt(1 - (i / 35) ** 2)), 1, 2, '#587a6d');
  px(g, 113, 228, 13, 5, '#4b4852'); px(g, 115, 229, 3, 2, '#d69868');

};

ART.coffeeTin = g => {
  shadow(g, 191, 226, 18, 6);
  cyl(g, 188, 192, 16, 5, 32, RAMP.rust, '#7b7473');
  ell(g, 188, 192, 13, 3, '#9b979b');
  for (let i = -15; i <= 15; i++) px(g, 188 + i, 204 + Math.round(5 * Math.sqrt(1 - (i / 16) ** 2)), 1, 12, i < 7 ? '#ddcaa6' : '#a58f73');
  px(g, 180, 212, 15, 2, '#6c3429');

};

ART.cups = g => {
  [[232, 222, 11], [255, 219, 10], [244, 208, 10]].forEach(([x, y, r], i) => {
    shadow(g, x, y + 6, r + 2, 3, i === 2 ? 0 : 0.3);
    cyl(g, x, y - 12, r, 3, 15, RAMP.cream, '#efe2c5'); ell(g, x, y - 12, r - 2, 2, '#3f5a53');
    curve(g, x + r, y - 8, x + r + 7, y - 4, x + r, y, '#9a856a', 2);
  });

};

ART.bananas = g => {
  shadow(g, 372, 228, 39, 8);
  ell(g, 372, 216, 36, 14, RAMP.rattan[1]);
  for (let j = 0; j < 13; j++) for (let i = -35; i < 35; i += 4) {
    const yy = 214 + j, limit = 36 * Math.sqrt(Math.max(0, 1 - ((yy - 216) / 15) ** 2));
    if (Math.abs(i) < limit && yy > 216) px(g, 372 + i + (j % 2) * 2, yy, 3, 1, pick(RAMP.rattan, 0.42 + noise(i, j) * 0.5));
  }
  ell(g, 372, 210, 33, 9, RAMP.rattan[0]);
  [[346, 202, 370, 192, 392, 207], [350, 208, 374, 199, 398, 212], [346, 213, 372, 205, 396, 216]].forEach(([a, b, c, e, f, h]) => {
    curve(g, a, b + 2, c, e + 2, f, h + 2, '#8c6c2e', 7); curve(g, a + 1, b, c, e, f, h, '#d9b558', 5); curve(g, a + 5, b, c, e, f - 5, h - 1, '#efd27a', 1);
  });

};

ART.board = g => {
  shadow(g, 126, 300, 92, 38);
  poly(g, [[66, 250], [188, 246], [214, 322], [34, 328]], '#3f271f');
  poly(g, [[66, 246], [188, 242], [214, 317], [34, 323]], '#a0754c');
  for (let i = 0; i < 9; i++) { const k = i / 9; curve(g, 62 + k * 6, 252 + i * 7, 120, 250 + i * 7.3, 192 + k * 18, 248 + i * 7.5, i % 2 ? '#8e6540' : '#b4875b'); }
  poly(g, [[68, 246], [188, 242], [189, 245], [67, 249]], '#c29a6c');
};

ART.knife = g => {
  poly(g, [[86, 305], [150, 276], [158, 282], [101, 313]], '#3b3640');
  poly(g, [[86, 303], [150, 274], [157, 279], [100, 310]], '#b6b1ae'); poly(g, [[86, 303], [150, 274], [151, 275], [88, 304]], '#e8e2da');
  curve(g, 151, 278, 170, 268, 188, 259, '#2c1d1b', 6); curve(g, 152, 276, 170, 266, 187, 257, '#5a3628', 4);
};

ART.chili = g => {
  [[92, 268, 104, 256, 124, 262], [105, 276, 118, 266, 136, 270], [78, 280, 92, 271, 106, 281]].forEach(([a, b, c, e, f, h]) => {
    curve(g, a, b + 2, c, e + 2, f, h + 2, '#4a1b1b', 4); curve(g, a, b, c, e, f, h, '#a83c32', 3); curve(g, a + 2, b, c, e, f - 3, h - 1, '#d9674f', 1); px(g, f + 2, h, 4, 2, '#5d7a56');
  });
};

ART.shallot = g => {
  [[164, 288, 9], [181, 297, 8], [160, 303, 7]].forEach(([x, y, r]) => {
    shadow(g, x, y + r - 2, r, 3, 0.3); ell(g, x, y, r, r - 1, '#7a3b4a'); ell(g, x - 2, y - 2, r - 3, r - 3, '#a65a64'); px(g, x - 4, y - 4, 2, 2, '#d39a93'); px(g, x, y - r - 2, 1, 3, '#c7a77a');
  });
};

ART.scallion = g => {
  for (let i = 0; i < 4; i++) curve(g, 60 + i * 3, 312 - i, 96, 304 + i * 2, 134 + i * 4, 316 - i, i % 2 ? '#5d7a56' : '#7d9868', 2);

};

ART.cobek = g => {
  shadow(g, 282, 262, 36, 15);
  cyl(g, 280, 246, 34, 14, 8, RAMP.stone, '#7b7473');
  ell(g, 280, 246, 28, 10, '#4b474c'); ell(g, 280, 248, 22, 7, '#8f3a2e');
  for (let i = 0; i < 26; i++) px(g, 262 + noise(i, 1) * 36, 243 + noise(i, 2) * 10, 2, 1, noise(i, 3) > 0.5 ? '#c7624a' : '#6e2b25');
  curve(g, 283, 247, 298, 232, 316, 220, '#37343a', 8); curve(g, 283, 245, 298, 230, 315, 218, '#7b7473', 5); curve(g, 287, 241, 300, 229, 314, 218, '#958c88', 1);

};

ART.mat = g => {
  shadow(g, 340, 333, 92, 20);
  poly(g, [[262, 306], [414, 303], [438, 352], [244, 358]], '#6f7f6c');
  for (let i = 0; i < 6; i++) curve(g, 260 - i * 3, 310 + i * 8, 345, 308 + i * 8, 418 + i * 4, 307 + i * 8, i === 0 || i === 5 ? '#e1d6bd' : '#8d9b84');
  poly(g, [[262, 306], [414, 303], [415, 306], [261, 309]], '#a8b39b');
  shadow(g, 326, 331, 50, 15, 0.32);
  ell(g, 324, 326, 48, 17, '#8c7c67'); ell(g, 324, 323, 47, 16, '#efe5cf'); ell(g, 324, 324, 35, 11, '#d7cbb1'); ell(g, 322, 322, 34, 10, '#e9dfc8');
  for (let a = 0; a < 6.28; a += 0.018) px(g, 324 + Math.cos(a) * 45, 323 + Math.sin(a) * 15, 1, 1, '#4b6a60');

};

ART.mug = g => {
  shadow(g, 402, 326, 20, 6);
  cyl(g, 398, 292, 17, 6, 30, RAMP.cream, '#efe2c5');
  ell(g, 398, 292, 15, 5, '#3f5a53'); ell(g, 398, 293, 13, 4, '#2a1a17'); ell(g, 395, 292, 6, 1, '#5a3a2d');
  curve(g, 415, 300, 430, 305, 415, 316, '#6f5c4b', 4); curve(g, 415, 299, 428, 304, 415, 314, '#c3ac8a', 2);

};

ART.bottles = g => {
  [[412, 182, 'sauce'], [428, 188, 'oil']].forEach(([x, top, type]) => {
    shadow(g, x + 2, 233, 9, 3);
    const body = type === 'sauce' ? ['#1b1216', '#2a1a1d', '#3b2526', '#54383a', '#755350'] : ['#6b4b1f', '#8f6b2c', '#b48c3e', '#d1ad5c', '#ead181'];
    cyl(g, x, top + 18, 8, 3, 30, body); px(g, x - 3, top + 3, 7, 16, body[2]); px(g, x - 2, top + 3, 2, 15, body[4]); px(g, x - 4, top, 9, 4, type === 'sauce' ? '#94563c' : '#587a6d');
    px(g, x - 7, top + 28, 15, 11, '#d7c8a7'); px(g, x - 4, top + 31, 9, 2, '#7a3f33'); px(g, x - 3, top + 35, 7, 1, '#7d6b58');
  });

};

ART.stove = g => {
  shadow(g, 532, 314, 106, 12, 0.45);
  poly(g, [[448, 206], [610, 206], [642, 298], [428, 302]], '#17151c');
  poly(g, [[452, 208], [606, 208], [638, 290], [434, 294]], '#3b3640');
  poly(g, [[452, 208], [606, 208], [607, 211], [451, 211]], '#625c64');
  poly(g, [[428, 302], [642, 298], [642, 320], [428, 323]], '#24212a');
  poly(g, [[428, 302], [642, 298], [642, 300], [428, 304]], '#7b7473');
  [[468, 311], [530, 310], [592, 309]].forEach(([x, y], i) => {
    ell(g, x, y, 8, 6, '#141218'); ell(g, x, y - 1, 7, 5, i === 2 ? '#524c55' : '#9b979b'); px(g, x - 1, y - 5, 2, 6, '#2c2830');
  });
  ell(g, 490, 254, 44, 18, '#17151c'); ell(g, 490, 253, 28, 10, '#2c2830');
  ell(g, 578, 238, 34, 14, '#17151c'); ell(g, 578, 237, 21, 8, '#2c2830');

};

ART.wok = g => {
  shadow(g, 492, 268, 50, 11, 0.5);
  for (let j = 0; j <= 22; j++) {
    const s = Math.round(58 * Math.sqrt(1 - (j / 23) ** 2));
    for (let i = -s; i <= s; i++) px(g, 490 + i, 240 + j, 1, 1, pick(RAMP.iron, 0.72 - (i / 58) * 0.45 - j / 60));
  }
  ell(g, 490, 240, 58, 18, '#625c64'); ell(g, 490, 241, 55, 16, '#141218');
  ell(g, 490, 244, 44, 12, '#24212a'); ell(g, 482, 240, 30, 6, '#34303a'); ell(g, 472, 237, 13, 2, '#524c55');
  curve(g, 433, 240, 412, 258, 398, 270, '#141218', 7); curve(g, 433, 238, 412, 256, 399, 268, '#5f3d2c', 4); curve(g, 431, 238, 412, 254, 401, 265, '#946a48', 1);

};

ART.kettle = g => {
  shadow(g, 580, 247, 28, 7, 0.45);
  for (let j = 0; j <= 30; j++) {
    const k = j / 30, r = Math.round(24 * Math.sqrt(Math.max(0.12, 1 - (1 - k) ** 2)));
    for (let i = -r; i <= r; i++) px(g, 580 + i, 212 + j, 1, 1, pick(RAMP.steel, 0.66 - (i / (r + 1)) * 0.46 - (i / (r + 1)) ** 2 * 0.25));
  }
  ell(g, 580, 242, 23, 6, '#4b4852'); ell(g, 580, 239, 23, 5, '#9b979b');
  ell(g, 580, 212, 10, 3, '#cfc9c4'); ell(g, 580, 209, 3, 2, '#2c1d1b');
  curve(g, 558, 226, 544, 222, 538, 207, '#4b4852', 5); curve(g, 558, 224, 545, 220, 539, 206, '#b1acab', 2);
  curve(g, 562, 212, 580, 183, 599, 212, '#1b171f', 4); curve(g, 563, 211, 580, 184, 598, 211, '#5f3d2c', 2);
  ell(g, 571, 225, 3, 7, '#e0dad2');

};

ART.eggs = g => {
  shadow(g, 86, 342, 36, 9);
  cyl(g, 80, 330, 34, 9, 14, RAMP.clay, '#6e3f30'); ell(g, 80, 330, 29, 7, '#3f2720');
  [[62, 327], [75, 325], [89, 327], [100, 331], [69, 333], [84, 334]].forEach(([x, y]) => { ell(g, x, y, 8, 6, '#a98a6b'); ell(g, x - 1, y - 1, 6, 4, '#ead9bd'); px(g, x - 3, y - 3, 2, 1, '#fff5e2'); });
};
