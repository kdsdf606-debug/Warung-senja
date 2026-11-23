// Dapur tiga sisi dengan alat dan bahan yang dipegang langsung.

const LEFT = -1, FRONT = 0, RIGHT = 1;
const TRASH = { x: 566, y: 256 };
const BLENDER_ZONE = { x: 396, y: 136, w: 38, h: 100 };
const BLENDER_BTN = { x: 403, y: 210, w: 22, h: 16 };
const BLEND_COLORS = { banana: '#efdc9c', mangga: '#f2b13c', nanas: '#f4d458', jeruk: '#a9cf58', tomat: '#d9503a', wortel: '#ec8a34', chili: '#b6352c', shallot: '#a65a64', bawangputih: '#eadfc8' };
const BLENDABLE = Object.fromEntries(Object.keys(BLEND_COLORS).map(k => [k + '+', true]));
const BATTER = { x: 228, y: 206 };
const BATTER_ZONE = { x: 194, y: 190, w: 68, h: 34 };
const BATTER_THICK = [0.42, 0.66];
const freshBatter = () => ({ flour: 0, sagu: 0, egg: 0, water: 0, mix: 0 });
const SAGU_ZONE = { x: 339, y: 170, w: 56, h: 53 };
const CRUMB_ZONE = { x: 397, y: 240, w: 36, h: 44 };
const DOUGH_BOARD = { x: 196, y: 224, w: 196, h: 58 };
const DOUGH_FOODS = ['adonan', 'kulit', 'mie'];
const freshBlender = () => ({ parts: [], water: 0, level: 0, result: null, amount: 0, spices: {} });
const VIEW_NAMES = { [LEFT]: 'MEJA RACIK', [FRONT]: 'DEPAN', [RIGHT]: 'KOMPOR' };
const COOK_GOLD = [0.62, 0.92];
const COOK_SLOW = 4; // Makanan di wajan dan panci matang 4x lebih lama dari aslinya.
const EAT_TIME = 120; // Lama pelanggan makan, dalam detik.
const FOOD_SIZE = { chili: [32, 9], shallot: [18, 15], banana: [58, 15], beef: [46, 18] };
const PIECE_LIMIT = { chili: 11, shallot: 8, banana: 17, beef: 13 };
const MIN_CUT_GAP = 4;
const KNIFE_ANGLE = 0;
const SLICE_TRAVEL = 40;
const bladeXAt = x => x;

function playSlice() { sfx('slice'); }

function largestPiece(it) {
  const half = FOOD_SIZE[it.type][0] / 2, edges = [-half, ...it.cuts, half];
  let best = { size: 0, center: 0 };
  for (let i = 0; i < edges.length - 1; i++) {
    const size = edges[i + 1] - edges[i];
    if (size > best.size) best = { size, center: (edges[i] + edges[i + 1]) / 2 };
  }
  return best;
}

function playChop(soft = false) { sfx(soft ? 'chopSoft' : 'chop'); }
const TOOL_DEFS = {
  knife: { v: LEFT, home: [526, 142], rest: 0, name: 'PISAU', w: 20, h: 82, ax: 10, ay: 26 },
  pestle: { v: LEFT, home: [468, 258], rest: 0.78, name: 'ULEKAN', w: 16, h: 48, ax: 8, ay: 40 },
  spoon: { v: RIGHT, home: [592, 174], rest: 0, name: 'SENDOK', w: 10, h: 38, ax: 5, ay: 32 },
  kecap: { v: RIGHT, home: [499, 98], rest: 0, name: 'KECAP', w: 22, h: 54, ax: 11, ay: 46, mouth: [0, -44] },
  minyak: { v: RIGHT, home: [532, 98], rest: 0, name: 'MINYAK', w: 22, h: 54, ax: 11, ay: 46, mouth: [0, -44] },
  garam: { v: RIGHT, home: [562, 99], rest: 0, name: 'GARAM', w: 16, h: 30, ax: 8, ay: 24, mouth: [0, -22] },
  spatula: { v: RIGHT, home: [44, 195], rest: 0, name: 'SUTIL', w: 16, h: 64, ax: 8, ay: 54 },
  ladle: { v: RIGHT, home: [72, 153], rest: 0, name: 'CENTONG', w: 18, h: 46, ax: 9, ay: 14, mouth: [-13, 18] },
  spons: { v: RIGHT, home: [160, 240], rest: 0, name: 'SPONS', w: 18, h: 12, ax: 9, ay: 6 },
  lap: { v: RIGHT, home: [558, 140], rest: 0, name: 'LAP', w: 44, h: 52, ax: 22, ay: 2 },
  lap2: { v: LEFT, home: [96, 140], rest: 0, name: 'LAP', w: 44, h: 52, ax: 22, ay: 2 },
  whisk: { v: LEFT, home: [236, 204], rest: 0.55, name: 'KOCOKAN', w: 18, h: 48, ax: 9, ay: 38 },
  batterBowl: { v: LEFT, home: [228, 206], rest: 0, name: 'MANGKUK ADONAN', w: 72, h: 36, ax: 36, ay: 14 },
  pin: { v: LEFT, home: [146, 222], rest: 0, name: 'PENGGILING', w: 72, h: 14, ax: 36, ay: 7 },
  blender: { v: LEFT, home: [414, 170], rest: 0, name: 'BLENDER', w: 36, h: 64, ax: 18, ay: 32 },
  pot: { v: RIGHT, home: [382, 198], rest: 0, name: 'PANCI', w: 104, h: 84, ax: 52, ay: 14 },
  wok: { v: RIGHT, home: [262, 245], rest: 0, name: 'WAJAN', w: 130, h: 86, ax: 65, ay: 32 },
};

function tintLayer(g, w, h) {
  const img = g.getImageData(0, 0, w, h), d = img.data;
  for (let i = 0; i < d.length; i += 4) { d[i] = Math.min(255, d[i] * 0.94); d[i + 1] *= 0.84; d[i + 2] *= 0.7; }
  g.putImageData(img, 0, 0);
}
function makeSprite(w, h, ax, ay, paint) {
  return { c: layer(w, h, g => { paint(g); tintLayer(g, w, h); }), ax, ay };
}
function drawSprite(g, sp, x, y, a = 0) {
  g.save(); g.translate(Math.round(x), Math.round(y)); if (a) g.rotate(a);
  g.drawImage(sp.c, -sp.ax, -sp.ay); g.restore();
}
const rotPoint = (x, y, a, lx, ly) => [x + lx * Math.cos(a) - ly * Math.sin(a), y + lx * Math.sin(a) + ly * Math.cos(a)];

function paintWhole(g, type, cx, cy) {
  if (FOOD_INFO[type]) { paintNewFood(g, type, cx, cy); return; }
  if (type === 'chili') {
    curve(g, cx - 15, cy + 2, cx - 1, cy - 5, cx + 12, cy + 2, '#4a1b1b', 4);
    curve(g, cx - 15, cy, cx - 1, cy - 7, cx + 12, cy, '#b6423a', 3);
    curve(g, cx - 12, cy - 1, cx - 1, cy - 6, cx + 9, cy - 1, '#df7559', 1);
    px(g, cx + 13, cy - 1, 4, 2, '#5d7a56');
  }
  if (type === 'shallot') {
    ell(g, cx, cy + 1, 8, 6, '#5f2f3a'); ell(g, cx - 1, cy, 7, 5, '#93505c'); ell(g, cx - 3, cy - 2, 3, 2, '#c98f8a');
    px(g, cx, cy - 7, 1, 3, '#c7a77a');
  }
  if (type === 'beef') {
    ell(g, cx, cy + 2, 22, 8, '#4f1d22'); ell(g, cx, cy, 22, 8, '#8f2f35'); ell(g, cx - 2, cy - 1, 19, 6, '#b5444a');
    curve(g, cx - 17, cy - 2, cx - 4, cy + 4, cx + 15, cy - 3, '#e9c9bd', 1);
    curve(g, cx - 12, cy + 3, cx + 2, cy - 3, cx + 18, cy + 2, '#dca99f', 1);
    curve(g, cx - 8, cy - 5, cx + 2, cy - 1, cx + 10, cy - 6, '#e9c9bd', 1);
    curve(g, cx + 13, cy - 6, cx + 22, cy - 1, cx + 16, cy + 6, '#f1dfd0', 2);
  }
  if (type === 'banana') {
    curve(g, cx - 27, cy - 2, cx, cy + 9, cx + 26, cy - 3, '#8c6c2e', 6);
    curve(g, cx - 27, cy - 4, cx, cy + 7, cx + 26, cy - 5, '#e2bd5c', 4);
    curve(g, cx - 22, cy - 3, cx, cy + 6, cx + 21, cy - 4, '#f5dc8d', 1);
    px(g, cx - 29, cy - 5, 3, 3, '#4b3a22'); px(g, cx + 26, cy - 6, 3, 3, '#4b3a22');
  }
}

function drawFood(g, type, x, y) {
  if (FOOD_SIZE[type]) paintWhole(g, type, x, y);
  if (type.endsWith('~')) fritters(g, x, y, false);
  if (type.endsWith('^')) { fritters(g, x, y, false); scatter(g, x, y - 1, 22, 6, 34, ['#d9a44e', '#efc777', '#a8702f'], 7); }
  if (type === 'adonan') { ell(g, x, y + 2, 15, 8, '#b99d6d'); ell(g, x, y, 14, 8, '#f0dfb8'); ell(g, x - 4, y - 3, 6, 3, '#fff7e4'); }
  if (type === 'kulit') { poly(g, [[x - 18, y - 6], [x + 15, y - 8], [x + 19, y + 6], [x - 15, y + 8]], '#b99d6d'); poly(g, [[x - 17, y - 7], [x + 14, y - 9], [x + 18, y + 5], [x - 14, y + 7]], '#f3e4c2'); px(g, x - 11, y - 5, 12, 1, '#fff9ea'); }
  if (type === 'mie') { ell(g, x, y + 2, 16, 7, '#a98a4e'); for (let n = 0; n < 9; n++) curve(g, x - 14, y - 4 + n, x + (n % 2 ? 8 : -8), y - 8 + n * 1.6, x + 14, y - 3 + n, n % 3 ? '#f2d98f' : '#d9b65f', 1); }
  if (type.endsWith('+') && FOOD_INFO[type.slice(0, -1)]) drawChopped(g, type.slice(0, -1), x, y);
  if (type === 'beef+') drawBeefStrips(g, x, y, 15, 6, 0, 0, 2);
  if (type === 'chili+') scatter(g, x, y, 15, 6, 34, ['#a83c32', '#d9674f', '#7a2a26'], 3);
  if (type === 'shallot+') scatter(g, x, y, 13, 6, 30, ['#a65a64', '#d39a93', '#f0d2c7'], 5);
  if (type === 'banana+') for (let i = 0; i < 5; i++) { ell(g, x - 16 + i * 8, y + (i % 2) * 2, 5, 4, '#a98c49'); ell(g, x - 16 + i * 8, y - 1 + (i % 2) * 2, 4, 3, '#f0dfa4'); }
  if (type === 'coated') fritters(g, x, y, false);
  if (type === 'egg') { ell(g, x, y, 6, 7, '#a98a6b'); ell(g, x - 1, y - 1, 5, 5, '#ead9bd'); px(g, x - 3, y - 4, 2, 1, '#fff5e2'); }
  if (type === 'rice') { ell(g, x, y + 2, 15, 7, '#b9ad95'); ell(g, x, y, 14, 7, '#e9dfc8'); scatter(g, x, y, 12, 5, 34, RICE, 2); }
  if (type === 'bumbu') { ell(g, x, y + 1, 13, 6, '#6e2b25'); ell(g, x, y, 12, 5, '#a83c32'); scatter(g, x, y, 10, 4, 22, ['#c7624a', '#6e2b25', '#e08a6f'], 6); }
  if (type === 'cup') miniCup(g, x, y + 6);
}

function paintCounterBase(g) {
  const img = g.createImageData(640, 360), d = img.data;
  const ramps = { teak: RAMP.teak.map(rgb), plaster: RAMP.plaster.map(rgb) };
  const take = (r, v) => r[Math.max(0, Math.min(r.length - 1, Math.floor(v * r.length)))];
  for (let y = 0; y < 360; y++) for (let x = 0; x < 640; x++) {
    let col;
    if (y < 206) col = take(ramps.plaster, 0.2 + noise(x >> 2, y >> 2) * 0.3 + noise(x, y) * 0.14);
    else {
      const t = (y + 150) / 356, u = (x - 320) / t, plank = Math.floor(u / 52), fu = u / 52 - plank;
      const grain = Math.sin(u * 0.8 + plank * 2.7 + Math.sin(y * 0.05 + plank) * 1.5) * 0.08;
      const val = 0.5 + noise(plank, 3) * 0.24 + grain + (noise(x, y) - 0.5) * 0.06;
      col = fu < 0.025 ? ramps.teak[0] : take(ramps.teak, val);
    }
    const i = (y * 640 + x) * 4;
    d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);

  px(g, 0, 0, 640, 12, '#35251f'); px(g, 0, 12, 640, 2, '#1e1518');
  for (let y = 124, r = 0; y < 206; y += 9, r++) {
    for (let x = -(r % 2) * 11; x < 640; x += 22) {
      px(g, x, y, 21, 8, pick(['#7f8373', '#8b8e7b', '#959781', '#868a78'], noise(x, r)));
      px(g, x, y, 21, 1, '#a5a68f');
    }
    px(g, 0, y + 8, 640, 1, '#55574e');
  }
  px(g, 0, 120, 640, 4, '#5f3f2e'); px(g, 0, 120, 640, 1, '#8a6041');
  px(g, 0, 205, 640, 2, '#2a1c19');

  // Bibir meja dan lemari bawah
  px(g, 0, 288, 640, 3, '#b08660'); px(g, 0, 291, 640, 6, '#664230'); px(g, 0, 297, 640, 2, '#1c1416');
  px(g, 0, 299, 640, 61, '#26382f');
  paintCabinetBank(g, 0, 320);
  paintCabinetBank(g, 320, 640);
  px(g, 319, 299, 2, 61, '#1c2a24');
}

function sourceBowl(g, x, y, kind) {
  shadow(g, x, y + 7, 22, 3, 0.3);
  ell(g, x, y + 4, 22, 7, '#6f5c4b'); ell(g, x, y + 2, 22, 7, '#ddcaa6'); ell(g, x, y + 1, 18, 5, '#8c7c67');
  if (kind === 'flour') { ell(g, x, y, 17, 5, '#f3ead6'); ell(g, x - 3, y - 2, 9, 3, '#fffaf0'); }
  if (kind === 'chili') [[-9, 0], [1, -3], [8, 1]].forEach(([a, b]) => { g.save(); g.translate(x + a, y + b); g.scale(0.62, 0.8); paintWhole(g, 'chili', 0, 0); g.restore(); });
  if (kind === 'shallot') [[-10, 0], [0, -3], [10, 0], [-3, 2]].forEach(([a, b]) => { g.save(); g.translate(x + a, y + b); g.scale(0.68, 0.68); paintWhole(g, 'shallot', 0, 0); g.restore(); });
  if (kind === 'beef') { g.save(); g.translate(x, y - 1); g.scale(0.74, 0.62); paintWhole(g, 'beef', 0, 0); g.restore(); }
  if (kind === 'banana') [[0, -4], [0, -1], [0, 2]].forEach(([a, b]) => { g.save(); g.translate(x + a, y + b); g.scale(0.62, 0.8); paintWhole(g, 'banana', 0, 0); g.restore(); });
}

// Karung goni berisi tepung, bersandar di tembok belakang meja.
function paintFlourSack(g, label = 'TEPUNG', ramp = ['#6f5a3e', '#8a7250', '#a78e64', '#c2a97c', '#d8c397']) {
  const cx = 300, top = 156, base = 222;
  g.globalAlpha = 0.2; ell(g, cx + 8, 190, 37, 35, '#160f18'); g.globalAlpha = 1;
  shadow(g, cx + 3, base, 40, 4, 0.48);
  for (let y = top; y <= base; y++) {
    const k = (y - top) / (base - top);
    let half = Math.round(25 + 10 * Math.sin(Math.min(1, k * 1.12) * Math.PI * 0.62));
    if (k > 0.93) half -= Math.round((k - 0.93) * 62);
    px(g, cx - half - 1, y, half * 2 + 3, 1, '#3a2c20');
    for (let x = -half; x <= half; x++) {
      const v = (x + half) / Math.max(1, half * 2), weave = ((x + y) % 4 === 0 ? -0.09 : (x - y) % 5 === 0 ? 0.06 : 0) + (noise(x + 40, y) - 0.5) * 0.1;
      const shade = 0.82 - v * 0.62 - Math.abs(v - 0.3) * 0.12 + weave - k * 0.08;
      px(g, cx + x, y, 1, 1, ramp[Math.max(0, Math.min(4, Math.floor(shade * 5)))]);
    }
  }
  curve(g, cx - 22, top + 9, cx - 27, top + 34, cx - 20, base - 5, '#7d6648', 1);
  curve(g, cx + 19, top + 10, cx + 28, top + 36, cx + 22, base - 6, '#5f4c35', 1);
  curve(g, cx - 12, top + 5, cx - 7, top + 13, cx - 13, top + 19, '#7d6648', 1);
  curve(g, cx + 12, top + 5, cx + 8, top + 13, cx + 14, top + 18, '#6f5a3e', 1);
  // Bibir karung terlipat dan tepung di dalamnya.
  ell(g, cx, top + 2, 29, 8, '#4a3a2a'); ell(g, cx, top, 28, 7, '#cdb588'); ell(g, cx - 5, top - 2, 17, 3, '#e6d5ae');
  ell(g, cx, top + 1, 23, 5, '#8c7a5e'); ell(g, cx, top, 22, 4, '#f4ecdc'); ell(g, cx - 2, top - 3, 16, 4, '#fbf6ea'); ell(g, cx - 5, top - 5, 8, 2, '#ffffff');
  // Label kain berjahit.
  px(g, cx - 23, top + 22, 46, 27, '#5f4c35'); px(g, cx - 22, top + 22, 44, 26, '#efe6d2'); px(g, cx - 22, top + 22, 44, 1, '#fffaf0');
  for (let i = 0; i < 11; i++) { px(g, cx - 20 + i * 4, top + 24, 2, 1, '#a0523f'); px(g, cx - 20 + i * 4, top + 45, 2, 1, '#a0523f'); }
  txtC(g, label, cx, top + 29, label === 'TEPUNG' ? '#7a3f33' : '#3f5a48');
  [-6, 0, 6].forEach(a => { px(g, cx + a, top + 37, 1, 6, '#b48c3e'); px(g, cx + a - 1, top + 38, 3, 1, '#d7ad5e'); px(g, cx + a - 1, top + 40, 3, 1, '#d7ad5e'); });
  scatter(g, cx + 30, base - 1, 12, 2, 12, ['#fffaf0', '#e9dfc8'], 4);
  scatter(g, cx - 31, base, 7, 1, 6, ['#fffaf0', '#e9dfc8'], 9);
}

function paintCrumbJar(g) {
  const cx = 415, top = 250, h = 28;
  shadow(g, cx + 2, top + h + 4, 18, 3, 0.45);
  for (let j = 0; j <= h; j++) {
    px(g, cx - 16, top + j, 33, 1, '#3f5358');
    for (let i = -15; i <= 15; i++) {
      const n = noise(i + 40, j + 3), v = (i + 15) / 30;
      px(g, cx + i, top + j, 1, 1, j < 6 ? (v < 0.2 ? '#e8f2ef' : '#9fb2b0') : n > 0.68 ? '#efc777' : n < 0.25 ? '#a8702f' : v > 0.75 ? '#b98438' : '#d9a44e');
    }
    px(g, cx - 14, top + j, 2, 1, 'rgba(255,255,255,.55)');
  }
  for (let i = -15; i <= 15; i++) px(g, cx + i, top + h + Math.round(3 * Math.sqrt(1 - (i / 16) ** 2)), 1, 1, '#3f5358');
  ell(g, cx, top, 17, 5, '#3f5358'); ell(g, cx, top - 1, 16, 4, '#eaf4f1'); ell(g, cx, top, 13, 3, '#8f6a34'); scatter(g, cx, top, 11, 2, 26, ['#efc777', '#d9a44e', '#a8702f'], 5);
  px(g, cx - 11, top + 11, 22, 11, '#efe6d2'); px(g, cx - 11, top + 21, 22, 1, '#8f8368'); txtC(g, 'ROTI', cx, top + 14, '#7a3f33');
}
function paintLeftRoom(g) {
  paintCounterBase(g);
  // Rak atas

  // Jendela kecil
  px(g, 438, 26, 150, 84, '#3a2822');
  for (let y = 31; y < 105; y++) px(g, 443, y, 140, 1, pick(['#2a2f58', '#3d3864', '#5a4370', '#7f5278', '#a8637a'], (y - 31) / 74));
  px(g, 443, 80, 42, 25, '#2c2743'); px(g, 482, 70, 50, 35, '#231f38'); px(g, 530, 84, 53, 21, '#2c2743');
  [[450, 87], [464, 94], [492, 78], [510, 90], [540, 92], [564, 96]].forEach(([x, y]) => px(g, x, y, 3, 4, '#e9a95f'));
  px(g, 512, 31, 3, 74, '#3a2822'); px(g, 443, 64, 140, 3, '#3a2822');
  px(g, 432, 110, 162, 5, '#7c5338'); px(g, 432, 110, 162, 1, '#a57a54');
  cyl(g, 470, 98, 8, 2, 11, RAMP.clay, '#34493a');
  [[-6, -8], [0, -12], [6, -8], [9, -2], [-9, -2]].forEach(([a, b]) => ell(g, 470 + a, 96 + b, 3, 2, a % 2 ? '#5d7a56' : '#456048'));

  // Rel magnet pisau
  px(g, 478, 138, 104, 8, '#1d1a20'); px(g, 479, 139, 102, 6, '#3b3840'); px(g, 479, 139, 102, 1, '#77737a'); px(g, 479, 144, 102, 1, '#29262d');
  [483, 575].forEach(x => { px(g, x, 141, 3, 3, '#17151b'); px(g, x, 141, 1, 1, '#c6c2bf'); });

  // Rak bahan
  paintFlourSack(g);
  g.save(); g.translate(367, 222); g.scale(0.74, 0.74); g.translate(-300, -222);
  paintFlourSack(g, 'SAGU', ['#55634f', '#6f7f64', '#8c9a7c', '#a9b594', '#c5cfae']);
  g.restore();
  paintCrumbJar(g);

  place(g, ART.riceCooker, -58, 16);
  place(g, ART.eggs, 66, -70);

  // Talenan
  shadow(g, 296, 280, 104, 7, 0.42);
  poly(g, [[204, 226], [384, 226], [396, 284], [192, 284]], '#4a2f22');
  poly(g, [[204, 224], [384, 224], [395, 280], [193, 280]], '#8f6a49');
  for (let i = 0; i < 8; i++) px(g, 200 - i, 230 + i * 7, 190 + i * 2, 1, i % 2 ? '#7f5c40' : '#9a7450');
  poly(g, [[204, 224], [384, 224], [385, 226], [203, 226]], '#ad8660');

  // Cobek
  shadow(g, 472, 270, 38, 8, 0.42);
  cyl(g, 470, 250, 36, 14, 10, RAMP.stone, '#7b7473');
  ell(g, 470, 250, 30, 10, '#4b474c'); ell(g, 470, 252, 24, 7, '#37343a');

  // Lubang sampah tertanam di meja.
  ell(g, TRASH.x, TRASH.y + 2, 40, 15, '#2a1c17');
  ell(g, TRASH.x, TRASH.y, 38, 14, '#6d6b70'); ell(g, TRASH.x, TRASH.y - 1, 37, 13, '#b9b7b8');
  for (let a = 3.3; a < 6.1; a += 0.03) px(g, TRASH.x + Math.cos(a) * 35, TRASH.y - 1 + Math.sin(a) * 12, 2, 1, '#f1efea');
  ell(g, TRASH.x, TRASH.y, 32, 10, '#3a383e'); ell(g, TRASH.x, TRASH.y + 2, 30, 8, '#0e0d11');
  scatter(g, TRASH.x + 2, TRASH.y + 4, 19, 3, 16, ['#3d4a32', '#4f3a26', '#5a3028'], 6);

  // Gantungan lap meja racik.
  px(g, 66, 136, 60, 3, '#37343a'); px(g, 66, 136, 60, 1, '#c6c2bf');
  [69, 120].forEach(x => { px(g, x, 132, 4, 9, '#3b3840'); px(g, x, 132, 1, 9, '#a5a2a3'); });

  paintBlenderBase(g);
  paintStoreDoors(g);
}

function paintTool(id, g) {
  if (id !== 'knife' && KNIVES[id]) { paintKnifeRack(id, g); return; }
  if (paintRightTool(id, g)) return;
  if (id === 'knife') {
    g.save(); g.translate(0, 82); g.scale(1, -1);
    const edge = 7, bladeEnd = 54;
    for (let y = 0; y < bladeEnd; y++) {
      const t = (y + 1) / bladeEnd, width = Math.max(1, Math.round(1 + 7 * Math.min(1, t / 0.62) ** 1.15));
      px(g, edge - 1, y, 1, 1, '#34323b');
      for (let c = 0; c < width; c++) {
        let color = '#a9adb4';
        if (c >= 2 && (y + c * 3) % 43 < 5) color = '#d9dcde';
        if (c === width - 2 && width > 3) color = '#858893';
        if (c === 1) color = '#d7d6d3';
        if (c === 0) color = '#fffaf0';
        if (c === width - 1 && width > 1) color = '#5d5f6b';
        px(g, edge + c, y, 1, 1, color);
      }
      px(g, edge + width, y, 1, 1, '#2b2a33');
    }

    // Penyangga baja
    px(g, 6, 54, 11, 4, '#2b2a33'); px(g, 7, 54, 9, 3, '#8f929b'); px(g, 7, 54, 9, 1, '#e4e3df'); px(g, 7, 56, 9, 1, '#62646f');

    // Gagang kayu walnut
    for (let y = 58; y < 82; y++) {
      const left = 7, right = 15;
      px(g, left - 1, y, right - left + 3, 1, '#21171a');
      for (let x = left; x <= right; x++) {
        const c = (x - left) / Math.max(1, right - left);
        let color = c < 0.2 ? '#9a6e4f' : c < 0.68 ? '#6f4733' : '#4b3027';
        if (c >= 0.2 && c < 0.68 && Math.sin(y * 0.9 + x * 1.7) > 0.72) color = '#5d3b2b';
        px(g, x, y, 1, 1, color);
      }
    }
    px(g, 6, 81, 11, 1, '#17100f');
    [62, 72].forEach(y => { px(g, 10, y, 3, 3, '#6d4b22'); px(g, 10, y, 2, 2, '#d7ad5e'); px(g, 10, y, 1, 1, '#ffe8aa'); });
    g.restore();
  }
  if (id === 'pestle') {
    curve(g, 8, 2, 8, 20, 8, 34, '#37343a', 8); curve(g, 8, 2, 7, 20, 7, 33, '#7b7473', 5); curve(g, 6, 3, 6, 18, 6, 30, '#958c88', 1);
    ell(g, 8, 39, 7, 6, '#4b474c'); ell(g, 7, 38, 5, 4, '#7b7473');
  }
  if (id === 'spoon') {
    px(g, 4, 0, 2, 24, '#6f6c75'); px(g, 4, 0, 1, 24, '#cfc9c4');
    ell(g, 5, 30, 4, 6, '#55535d'); ell(g, 5, 29, 3, 5, '#bdb9b6');
  }
}
