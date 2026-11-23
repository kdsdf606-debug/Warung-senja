// Sisi kompor: gambar alat, api, isi wajan, dan suara dapur.

const MAT_ZONE = { x: 486, y: 240, w: 84, h: 44 };
const FLAME_RATE = [0, 1];
const TOSS_TIME = 0.42;
const WOK_HANDLE = { x: 250, y: 262, w: 25, h: 36 };
const POT = { x: 382, top: 198 };
const SINK = { x: 28, y: 226, w: 122, h: 46 };
const TAP = { x: 106, y: 178, w: 62, h: 44 };
const PLUG = { x: 119, y: 255, w: 24, h: 14 };
const FAN_SWITCH = { x: 420, y: 88, w: 26, h: 14 };
const UTENSILS = [{ x: 72, type: 'ladle' }, { x: 102, type: 'sieve' }];

const STIR_PATCHES = [-24, -12, 0, 12, 24];
const freshWok = () => ({ grime: 0, spices: {}, items: [], oil: 0, soy: 0, salt: 0, level: 0, parts: [], pieces: [], stir: 0, toss: 0, patches: STIR_PATCHES.map(() => 0), pushX: 0 });
const freshFritters = () => [[-17, 3], [0, -3], [17, 3]].map(([x, y]) => ({ x, y, seed: x, side: 'a', a: 0, b: 0, flipT: 0, onBlade: false }));

function trapRows(g, y0, y1, l0, r0, l1, r1, color) {
  for (let y = y0; y < y1; y++) {
    const k = (y - y0) / Math.max(1, y1 - y0 - 1), l = Math.round(l0 + (l1 - l0) * k), r = Math.round(r0 + (r1 - r0) * k);
    px(g, l, y, r - l + 1, 1, typeof color === 'function' ? color(k, y) : color);
  }
}

function paintRightRoom(g) {
  paintCounterBase(g);
  paintSpiceDoors(g);

  // Pelat baja di belakang kompor
  px(g, 176, 106, 276, 100, '#6c6a70');
  for (let y = 106; y < 206; y++) for (let x = 176; x < 452; x += 3) if (noise(x, y) > 0.72) px(g, x, y, 3, 1, noise(y, x) > 0.5 ? '#77757b' : '#626067');
  px(g, 174, 106, 2, 100, '#37343a'); px(g, 452, 106, 2, 100, '#37343a');
  [[180, 112], [446, 112], [180, 198], [446, 198]].forEach(([x, y]) => { px(g, x, y, 3, 3, '#3b3840'); px(g, x, y, 1, 1, '#b5b4bd'); });

  // Tudung asap
  px(g, 280, 0, 66, 24, '#46424b'); px(g, 280, 0, 12, 24, '#5b5660'); px(g, 334, 0, 12, 24, '#37343b');
  trapRows(g, 12, 92, 236, 390, 176, 450, (k, y) => {
    const band = y % 13 === 0 ? '#34313a' : k > 0.92 ? '#676269' : '#4b4750';
    return band;
  });
  trapRows(g, 12, 92, 236, 262, 176, 226, '#625d66');
  trapRows(g, 12, 92, 364, 390, 400, 450, '#37343b');
  px(g, 172, 92, 282, 10, '#2c2930'); px(g, 174, 92, 278, 7, '#77727a'); px(g, 174, 92, 278, 1, '#b7b2b4');
  for (let x = 198; x < 424; x += 16) { px(g, x, 95, 9, 2, '#37343b'); }
  px(g, 426, 94, 16, 6, '#26232a'); px(g, 428, 95, 5, 4, '#c29a5c');
  px(g, 268, 102, 92, 3, '#fff0c4'); px(g, 262, 105, 104, 1, '#8b7251');

  // Rel alat
  px(g, 26, 136, 98, 3, '#37343a'); px(g, 26, 136, 98, 1, '#c6c2bf');
  px(g, 43, 138, 3, 4, '#26232a');
  [30, 118].forEach(x => { px(g, x, 132, 4, 9, '#3b3840'); px(g, x, 132, 1, 9, '#a5a2a3'); });

  // Rak bumbu
  woodShelf(g, 484, 102, 136);

  // Kaleng kopi di rak
  g.globalAlpha = 0.18; px(g, 590, 72, 24, 30, '#160f18'); g.globalAlpha = 0.5; px(g, 581, 102, 32, 2, '#2c1d1b'); g.globalAlpha = 1;
  cyl(g, 596, 69, 14, 3, 30, RAMP.rust, '#7b7473');
  ell(g, 596, 69, 12, 2, '#9b979b');
  px(g, 584, 78, 25, 12, '#ddcaa6'); px(g, 602, 78, 7, 12, '#a58f73');
  txt(g, 'KOPI', 588, 82, '#6c3429');

  // Lap tergantung
  px(g, 512, 138, 92, 2, '#a9a5a4'); px(g, 512, 138, 92, 1, '#dad6d1');
  px(g, 590, 138, 4, 5, '#3b3840'); px(g, 590, 138, 1, 5, '#a5a2a3');

  // Kompor
  shadow(g, 320, 289, 158, 5, 0.5);
  trapRows(g, 212, 269, 188, 452, 176, 464, '#17151b');
  trapRows(g, 214, 268, 191, 449, 180, 460, (k, y) => (y < 217 ? '#68636c' : y % 9 === 0 ? '#39353e' : '#34303a'));
  trapRows(g, 268, 289, 176, 464, 172, 468, (k, y) => (y === 268 ? '#9b979b' : y > 285 ? '#151318' : k < 0.3 ? '#3e3a43' : '#2c2930'));
  [[262, 254, 54, 15, 21], [382, 250, 45, 13, 17]].forEach(([cx, cy, rx, ry, cap]) => {
    ell(g, cx, cy + 1, rx, ry, '#141218'); ell(g, cx, cy, rx - 3, ry - 2, '#2a272f'); ell(g, cx, cy, rx - 11, ry - 5, '#1b191f');
    ell(g, cx, cy, cap, 6, '#57525b'); ell(g, cx, cy - 1, cap - 3, 4, '#37333b'); ell(g, cx - 4, cy - 2, 5, 1, '#77727a');
    px(g, cx - rx - 3, cy - 1, rx * 2 + 7, 3, '#0f0e12'); px(g, cx - rx - 3, cy - 1, rx * 2 + 7, 1, '#59545d');
    px(g, cx - 2, cy - ry - 3, 4, ry * 2 + 6, '#0f0e12'); px(g, cx - 2, cy - ry - 3, 1, ry * 2 + 6, '#59545d');
    [-0.72, 0.72].forEach(a => { const x = Math.round(cx + rx * a); px(g, x - 1, cy - ry + 2, 3, ry * 2 - 3, '#0f0e12'); px(g, x - 1, cy - ry + 2, 1, ry * 2 - 3, '#4c4851'); });
  });

  paintSink(g);

  // Tumpukan mangkuk
  shadow(g, 524, 242, 25, 4, 0.4);
  ell(g, 522, 241, 25, 6, '#3f271f'); ell(g, 522, 240, 24, 5, '#8a6240'); ell(g, 522, 239, 18, 3, '#6b4631');

  // Nampan tiga gelas
  shadow(g, 592, 240, 41, 3, 0.4);
  trapRows(g, 224, 240, 556, 628, 551, 633, '#3f271f');
  trapRows(g, 223, 237, 557, 627, 553, 631, (k, y) => (y === 223 ? '#b08660' : y % 4 === 0 ? '#6b4631' : '#7c5338'));

  // Alas kayu dan tumpukan piring
  shadow(g, 530, 284, 48, 4, 0.42);
  trapRows(g, 244, 286, 494, 562, 484, 572, '#3f271f');
  trapRows(g, 243, 283, 495, 561, 486, 570, (k, y) => (y === 243 ? '#c79d70' : y % 7 === 0 ? '#7b5639' : y % 7 === 3 ? '#a47a53' : '#916846'));
  shadow(g, 604, 281, 33, 6, 0.42);
  ell(g, 602, 278, 32, 9, '#3f271f'); ell(g, 602, 277, 31, 8, '#8a6240'); ell(g, 602, 276, 24, 5, '#6b4631');
}

function paintPlateStack(g, n, x, base) {
  for (let p = 0; p < n; p++) {
    const y = base - p * 3;
    ell(g, x, y, 27, 7, p % 2 ? '#d9cdb3' : '#e3d8c0');
    for (let i = -28; i <= 28; i++) {
      const edge = Math.round(y + 7.5 * Math.sqrt(Math.max(0, 1 - (i / 29) ** 2)));
      px(g, x + i, edge + 1, 1, 1, '#5f5344');
      px(g, x + i, edge, 1, 1, i < 6 + (p * 7) % 11 ? '#fff7e6' : '#d6caaf');
      px(g, x + i, edge - 1, 1, 1, '#4b6a60');
    }
  }
  if (!n) return;
  const y = base - (n - 1) * 3;
  ell(g, x, y, 26, 6, '#f4ead5'); ell(g, x, y + 1, 18, 4, '#cfc3a8'); ell(g, x, y, 17, 3, '#e9dfc8');
  for (let a = 0; a < 6.28; a += 0.025) px(g, x + Math.cos(a) * 23, y + Math.sin(a) * 5, 1, 1, '#4b6a60');
  px(g, x - 17, y - 4, 10, 1, '#fffaf0');
}

function paintBowlStack(g, n, x, base) {
  for (let i = 0; i < n; i++) paintBowlShell(g, x, base - i * 5);
  if (n) { ell(g, x, base - (n - 1) * 5 - 6, 15, 2, '#b8aa8c'); px(g, x - 13, base - (n - 1) * 5 - 9, 8, 1, '#fffaf0'); }
}

const CLOTH = {
  lap: { mid: '#708270', light: '#88997f', dark: '#566858', edge: '#3c4a40', stripe: '#cfc7ad' },
  lap2: { mid: '#b5683f', light: '#cf8a58', dark: '#8a4a2e', edge: '#5f3220', stripe: '#efdcae' },
};
// Lap terlipat saat dipegang: dua lapis kain, garis tenun, dan rumbai.
function paintFoldedCloth(g, c) {
  poly(g, [[3, 11], [36, 5], [41, 25], [8, 32]], '#1f1a1c');
  poly(g, [[4, 12], [35, 6], [40, 24], [8, 30]], c.dark);
  poly(g, [[2, 7], [36, 1], [40, 20], [6, 27]], '#1f1a1c');
  poly(g, [[3, 8], [35, 2], [39, 19], [7, 25]], c.mid);
  poly(g, [[3, 8], [35, 2], [36, 6], [4, 12]], c.light);
  poly(g, [[5, 15], [37, 9], [37.6, 12], [5.6, 18]], c.stripe);
  poly(g, [[6, 20], [38, 14], [38.4, 15.5], [6.4, 21.5]], c.stripe);
  for (let i = 0; i < 12; i++) px(g, 8 + i * 2.5, 11 - i * 0.46, 1, 1, c.dark);
  poly(g, [[28, 21], [39, 19], [37, 28], [32, 25]], c.light);
  poly(g, [[32, 25], [37, 28], [39, 19]], c.dark);
  for (let i = 0; i < 8; i++) { const k = i / 7; px(g, 3 + k * 3.6, 9 + k * 16, 1, 1, c.stripe); px(g, 1 + k * 3.6, 9 + k * 16, 2, 1, c.edge); }
}

function drawSpillShape(g, p) {
  const k = Math.max(0.25, p.a), kind = p.c === '#2a1a1d' ? 'soy' : p.c === '#d9b95c' ? 'oil' : p.c === '#8fb4ba' ? 'water' : 'crumb';
  const r = Math.max(2, Math.round(p.r * (0.6 + 0.4 * k)));
  if (kind === 'crumb') {
    g.globalAlpha = 0.95 * k;
    for (let i = 0; i < 8; i++) {
      const x = Math.round(p.x + (noise(p.seed, i) - 0.5) * (r * 3.6)), y = Math.round(p.y + (noise(i, p.seed + 3) - 0.5) * (r * 1.7)), w = 1 + (i + p.seed) % 3, h = 1 + (i % 2);
      px(g, x, y + 1, w, h, '#2a1c17'); px(g, x, y, w, h, p.c);
      if (w > 1) px(g, x, y, 1, 1, '#f7ead0');
    }
    g.globalAlpha = 1;
    return;
  }
  const [dark, mid, gloss] = kind === 'soy' ? ['#120a0c', '#2a1a1d', '#927c82'] : kind === 'oil' ? ['#8f6f25', '#d9b95c', '#fff3bd'] : ['#557f89', '#8fb4ba', '#effcff'];
  const lobes = [[0, 0, 1]];
  for (let i = 0; i < 4; i++) {
    const a = noise(p.seed, i + 2) * 6.28;
    lobes.push([Math.cos(a) * r * 1.05, Math.sin(a) * r * 0.45, 0.45 + noise(i, p.seed) * 0.4]);
  }
  g.globalAlpha = (kind === 'water' ? 0.62 : 0.84) * k;
  lobes.forEach(([a, b, s]) => ell(g, Math.round(p.x + a), Math.round(p.y + b + 1), Math.max(1, Math.round(r * s + 1)), Math.max(1, Math.round(r * s * 0.5)), dark));
  lobes.forEach(([a, b, s]) => ell(g, Math.round(p.x + a), Math.round(p.y + b), Math.max(1, Math.round(r * s)), Math.max(1, Math.round(r * s * 0.45)), mid));
  for (let i = 0; i < 3; i++) {
    const a = noise(i + 5, p.seed) * 6.28, d = r + 3 + i * 2;
    px(g, Math.round(p.x + Math.cos(a) * d), Math.round(p.y + Math.sin(a) * d * 0.45), i ? 1 : 2, 1, mid);
  }
  g.globalAlpha = 0.9 * k;
  px(g, p.x - Math.round(r * 0.5), p.y - Math.max(1, Math.round(r * 0.25)), Math.max(2, r - 1), 1, gloss); px(g, p.x + 1, p.y, 1, 1, gloss);
  g.globalAlpha = 1;
}
function drawWokGrime(g, level, x, y) {
  const n = Math.round(level * 26);
  for (let i = 0; i < n; i++) {
    const a = noise(i, 41) * 6.28, r = 0.45 + noise(43, i) * 0.5, bx = Math.round(x + Math.cos(a) * 45 * r), by = Math.round(y + 2 + Math.sin(a) * 11 * r);
    g.globalAlpha = 0.34 + level * 0.3;
    ell(g, bx, by, 2 + (i % 5), 1 + (i % 2), i % 3 ? '#4a3220' : '#6d4a2c');
    if (i % 4 === 0) { g.globalAlpha = 0.6; px(g, bx - 1, by, 2, 1, '#a07a45'); }
  }
  g.globalAlpha = 0.5 * level;
  for (let t = 3.4; t < 6; t += 0.05) px(g, x + Math.cos(t) * 51, y - 2 + Math.sin(t) * 13, 2, 1, '#5a3e26');
  g.globalAlpha = 1;
}
function drawPotGrime(g, level) {
  const cx = POT.x, top = POT.top, n = Math.round(level * 12);
  for (let i = 0; i < n; i++) {
    const x = Math.round(cx - 30 + noise(i, 61) * 60), len = 5 + Math.round(noise(63, i) * 18), start = top + 10 + (i % 3);
    g.globalAlpha = 0.34 + level * 0.3;
    px(g, x, start, 2, len, i % 2 ? '#8a6a3e' : '#5f4a2e'); ell(g, x, start + len, 2, 1, '#5f4a2e');
  }
  for (let j = 0; j < 12; j++) for (let i = -35; i <= 35; i += 2) {
    if (noise(i + 40, j) > level * (1.05 - j * 0.05)) continue;
    const curve = Math.round(10 * Math.sqrt(1 - (i / 36) ** 2));
    g.globalAlpha = 0.5; px(g, cx + i, top + 41 - j + curve, 2, 1, '#242127');
  }
  g.globalAlpha = 1;
}
function drawStoveGrime(g, level) {
  const n = Math.round(level * 22);
  for (let i = 0; i < n; i++) {
    const x = Math.round(196 + noise(i, 71) * 252), y = Math.round(220 + noise(73, i) * 44);
    g.globalAlpha = 0.3 + level * 0.32;
    ell(g, x, y, 2 + (i % 4), 1 + (i % 2), i % 3 ? '#6f5233' : '#8f7240');
    px(g, x + 5, y + (i % 2), 1, 1, '#6f5233');
    if (i % 5 === 0) { g.globalAlpha = 0.6; px(g, x - 1, y - 1, 2, 1, '#c9b078'); }
  }
  g.globalAlpha = 1;
}

function paintSink(g) {
  shadow(g, 93, 281, 80, 4, 0.45);
  trapRows(g, 218, 280, 20, 169, 13, 172, '#3a2a22');
  trapRows(g, 219, 276, 21, 168, 15, 171, (k, y) => (y < 221 ? '#fff8e8' : y % 9 === 0 ? '#ddd3bd' : '#efe6d2'));
  trapRows(g, 276, 280, 15, 171, 14, 172, (k, y) => (y === 276 ? '#fff4dd' : '#a99c84'));

  // Bak keramik besar, muat wajan dan panci.
  poly(g, [[31, 225], [143, 225], [151, 274], [23, 274]], '#6f6555');
  poly(g, [[33, 227], [141, 227], [149, 272], [25, 272]], '#bdb4a0');
  trapRows(g, 227, 246, 33, 141, 44, 130, k => pick(['#7f7868', '#958d7b', '#aaa28f', '#bbb29e'], k));
  poly(g, [[33, 227], [44, 246], [36, 272], [25, 272]], '#9d9482');
  poly(g, [[141, 227], [130, 246], [138, 272], [149, 272]], '#ddd3be');
  poly(g, [[44, 246], [130, 246], [138, 271], [36, 271]], '#cfc6b1');
  px(g, 45, 246, 85, 1, '#8f8775');
  for (let i = 0; i < 34; i++) px(g, 42 + noise(i, 3) * 90, 248 + noise(5, i) * 21, 2, 1, 'rgba(255,255,255,.28)');
  trapRows(g, 272, 276, 25, 149, 23, 151, (k, y) => (y === 272 ? '#8f8675' : y === 273 ? '#fffaf0' : '#efe6d2'));

  // Saluran pembuangan di sudut depan.
  ell(g, 130, 262, 9, 4, '#6f6555'); ell(g, 130, 262, 8, 3, '#b9b7b8'); ell(g, 130, 262, 5, 2, '#17161b');
  px(g, 125, 262, 11, 1, '#77757b'); px(g, 130, 260, 1, 5, '#77757b');

  // Lubang pelimpah dan alas spons.
  ell(g, 87, 232, 5, 1, '#6f6555'); [-3, 0, 3].forEach(a => px(g, 87 + a, 232, 1, 1, '#25242a'));
  ell(g, 160, 247, 10, 4, '#6f6555'); ell(g, 160, 246, 9, 3, '#a9c0b5'); ell(g, 160, 245, 6, 2, '#7f9a90');

  // Keran kuningan tinggi, cukup untuk panci di bawahnya.
  ell(g, 147, 221, 11, 3, '#5a3d1e'); ell(g, 147, 220, 10, 2, '#d7ad5e'); px(g, 141, 219, 5, 1, '#ffe8aa');
  px(g, 143, 204, 9, 16, '#3a2614'); px(g, 144, 204, 7, 16, '#b98a3c'); px(g, 144, 204, 2, 16, '#f0d183');
  curve(g, 147, 206, 150, 170, 112, 186, '#3a2614', 6); curve(g, 147, 205, 150, 170, 112, 186, '#b98a3c', 4); curve(g, 145, 204, 147, 173, 114, 184, '#f6dd9a', 1);
  px(g, 107, 186, 10, 11, '#3a2614'); px(g, 108, 186, 8, 10, '#b98a3c'); px(g, 108, 186, 2, 10, '#f6dd9a');
  px(g, 106, 195, 12, 3, '#3a2614'); px(g, 107, 195, 10, 2, '#d7ad5e'); px(g, 109, 197, 6, 1, '#2a2118');
}

function paintPot(g, cx = POT.x, top = POT.top) {
  const rx = 36, ry = 10, h = 52;
  [-1, 1].forEach(side => {
    const x = side < 0 ? cx - rx - 11 : cx + rx - 1;
    px(g, x, top + 12, 13, 12, '#141218'); px(g, x + 1, top + 13, 11, 3, '#4b4852'); px(g, x + 1, top + 16, 11, 5, '#242128');
    px(g, side < 0 ? x + 3 : x + 1, top + 17, 8, 3, '#141218');
    px(g, side < 0 ? x + 10 : x, top + 13, 3, 10, '#b5b4bd');
  });
  cyl(g, cx, top, rx, ry, h, ['#25242b', '#3d3c44', '#57565e', '#74737a', '#96959a']);
  for (let i = -rx; i <= rx; i++) {
    const curve = Math.round(ry * Math.sqrt(1 - (i / (rx + 0.5)) ** 2));
    px(g, cx + i, top + 8 + curve, 1, 1, '#2d2c33');
    px(g, cx + i, top + 9 + curve, 1, 1, '#9b9a9d');
    px(g, cx + i, top + h - 5 + curve, 1, 1, '#2d2c33');
  }
  px(g, cx - 22, top + 12, 3, h - 8, 'rgba(255,255,255,.2)'); px(g, cx - 16, top + 14, 1, h - 16, 'rgba(255,255,255,.1)');
  ell(g, cx, top, rx, ry, '#2a2830'); ell(g, cx, top - 1, rx, ry - 1, '#a5a3a3'); ell(g, cx, top, rx - 3, ry - 2, '#2e2c33');
  ell(g, cx, top + 2, rx - 5, ry - 4, '#403e46');
}

function paintRightTool(id, g) {
  if (id === 'kecap' || id === 'minyak') {
    const body = id === 'kecap' ? ['#150e12', '#25171a', '#352225', '#4c3234', '#7a5a56'] : ['#6a4a1d', '#926d2c', '#ba9140', '#d9b662', '#f1dc95'];
    cyl(g, 11, 22, 9, 3, 26, body);
    for (let y = 5; y < 22; y++) { const w = y < 15 ? 3 : 3 + Math.round((y - 15) * 0.85); px(g, 11 - w, y, w * 2 + 1, 1, body[2]); px(g, 11 - w, y, 1, 1, body[1]); px(g, 11 - w + 1, y, 1, 1, body[4]); px(g, 11 + w, y, 1, 1, body[0]); }
    px(g, 7, 0, 9, 5, '#1b171f'); px(g, 8, 0, 7, 4, id === 'kecap' ? '#a54e38' : '#587a6d'); px(g, 8, 0, 2, 4, id === 'kecap' ? '#d07a58' : '#83a58e');
    px(g, 2, 27, 18, 15, '#ded0b1'); px(g, 2, 27, 18, 1, '#f1e7d0'); px(g, 2, 41, 18, 1, '#8f7f68');
    px(g, 5, 30, 12, 5, id === 'kecap' ? '#8c3a2e' : '#4b6a60'); px(g, 7, 32, 8, 1, '#f1e7d0'); px(g, 6, 37, 10, 1, '#6d5c4b'); px(g, 8, 39, 6, 1, '#8f7f68');
    px(g, 4, 24, 2, 21, 'rgba(255,245,225,.32)');
    return true;
  }
  if (id === 'garam') {
    px(g, 2, 9, 12, 19, '#3b3840'); px(g, 3, 10, 10, 17, '#a6b3b5'); px(g, 3, 15, 10, 12, '#f5efe2'); px(g, 3, 15, 10, 1, '#ffffff');
    for (let i = 0; i < 8; i++) px(g, 4 + (i * 3) % 8, 17 + (i * 5) % 9, 1, 1, '#d7d0c2');
    px(g, 4, 10, 1, 16, 'rgba(255,255,255,.65)');
    px(g, 2, 2, 12, 8, '#26232a'); px(g, 3, 2, 10, 7, '#9d9ca3'); px(g, 3, 2, 10, 1, '#dedcda'); px(g, 3, 8, 10, 1, '#5e5c66');
    [[5, 4], [8, 3], [11, 4], [7, 6], [10, 6]].forEach(([x, y]) => px(g, x, y, 1, 1, '#1b171f'));
    return true;
  }
  if (id === 'spatula') {
    for (let y = 0; y < 34; y++) { px(g, 6, y, 5, 1, '#21171a'); px(g, 7, y, 3, 1, y % 7 === 3 ? '#6b4631' : '#7c5338'); px(g, 7, y, 1, 1, '#b08660'); }
    px(g, 6, 12, 5, 2, '#c29a5c');
    px(g, 7, 34, 3, 9, '#44414a'); px(g, 8, 34, 1, 9, '#c8c5c3');
    for (let y = 43; y < 64; y++) {
      const half = Math.min(7, 2 + Math.round((y - 43) * 0.6));
      px(g, 8 - half - 1, y, half * 2 + 3, 1, '#26232a'); px(g, 8 - half, y, half * 2 + 1, 1, '#b6b3b1'); px(g, 8 - half, y, 2, 1, '#eeeae3'); px(g, 8 + half - 1, y, 2, 1, '#77747c');
    }
    [4, 8, 12].forEach(x => px(g, x, 51, 1, 9, '#3b3840'));
    return true;
  }
  if (id === 'spons') {
    px(g, 1, 1, 16, 10, '#3f3a22'); px(g, 2, 2, 14, 4, '#3f7a4c'); px(g, 2, 6, 14, 4, '#e9c94f');
    px(g, 2, 2, 14, 1, '#6fae72'); [[4, 7], [8, 8], [12, 7], [6, 9], [11, 9]].forEach(([x, y]) => px(g, x, y, 1, 1, '#b48f2c'));
    return true;
  }
  if (id === 'lap' || id === 'lap2') {
    const c = CLOTH[id];
    for (let y = 2; y < 50; y++) {
      const wave = Math.round(Math.sin((y + 138) * 0.2) * 1.2), stripe = (y - 2) % 11 < 2;
      px(g, 2 + wave, y, 40, 1, stripe ? c.stripe : c.mid);
      px(g, 2 + wave, y, 4, 1, c.light); px(g, 38 + wave, y, 4, 1, c.dark);
    }
    px(g, 2, 49, 40, 2, c.edge);
    for (let x = 3; x < 42; x += 3) px(g, x, 51, 1, 1, c.stripe);
    return true;
  }
  if (id === 'pot') { paintPot(g, 52, 14); return true; }
  if (id === 'blender') { paintBlenderJar(g); return true; }
  if (id === 'pin') {
    [[0, 11], [61, 11]].forEach(([x, w]) => { px(g, x, 4, w, 6, '#2c1d16'); px(g, x + 1, 5, w - 2, 2, '#b98a5e'); px(g, x + 1, 7, w - 2, 2, '#7c5338'); });
    for (let y = 0; y < 14; y++) { const v = y / 13; px(g, 10, y, 52, 1, y === 0 || y === 13 ? '#2c1d16' : v < 0.28 ? '#f0d3a2' : v < 0.62 ? '#d8ad78' : '#a97c52'); }
    for (let x = 16; x < 58; x += 9) px(g, x, 3 + (x % 3), 4, 1, '#c2925f');
    return true;
  }
  if (id === 'whisk') {
    for (let y = 0; y < 20; y++) { px(g, 6, y, 6, 1, '#21171a'); px(g, 7, y, 4, 1, y % 6 === 2 ? '#6b4631' : '#8a5f3e'); px(g, 7, y, 1, 1, '#c09468'); }
    px(g, 6, 20, 6, 4, '#26232a'); px(g, 7, 20, 4, 3, '#c8c5c3'); px(g, 7, 20, 1, 3, '#f4f2ee');
    [[8, '#77757b'], [5, '#c8c5c3'], [2, '#f2efe9']].forEach(([rx, color]) => {
      for (let a = 0; a < 6.28; a += 0.035) px(g, 9 + Math.cos(a) * rx, 34 + Math.sin(a) * 12, 1, 1, color);
    });
    return true;
  }
  if (id === 'batterBowl') {
    for (let j = 0; j <= 18; j++) {
      const half = Math.round(33 * Math.sqrt(Math.max(0, 1 - (j / 19) ** 2)));
      px(g, 36 - half - 1, 14 + j, half * 2 + 3, 1, '#34251f');
      for (let i = -half; i <= half; i++) {
        const v = (i + half) / Math.max(1, half * 2);
        px(g, 36 + i, 14 + j, 1, 1, v < 0.14 ? '#f7eedb' : v < 0.46 ? '#dcc9a3' : v < 0.78 ? '#b8a07a' : '#8a7458');
      }
    }
    for (let i = -28; i <= 28; i++) px(g, 36 + i, 20 + Math.round(9 * Math.sqrt(1 - (i / 29) ** 2)), 1, 1, '#4b6a60');
    ell(g, 36, 14, 34, 11, '#34251f'); ell(g, 36, 13, 33, 10, '#f4ead5'); ell(g, 36, 14, 29, 8, '#8f7c62'); ell(g, 37, 16, 24, 5, '#a8967a');
    for (let a = 3.3; a < 5.2; a += 0.03) px(g, 36 + Math.cos(a) * 31, 13 + Math.sin(a) * 9, 1, 1, '#ffffff');
    return true;
  }
  if (id === 'ladle') { paintUtensil('ladle', g); return true; }
  if (id === 'wok') {
    const cx = 65, rimY = 28;
    for (let j = 0; j <= 25; j++) {
      const r = Math.round(59 * Math.sqrt(1 - (j / 26) ** 2));
      for (let i = -r; i <= r; i++) px(g, cx + i, rimY + j, 1, 1, pick(['#0f0d12', '#1b1820', '#292530', '#3a3540', '#4f4955'], 0.7 - (i / 59) * 0.5 - j / 54));
    }
    ell(g, cx, rimY, 59, 18, '#16141a'); ell(g, cx, rimY - 1, 58, 17, '#8a858b'); ell(g, cx, rimY, 56, 15, '#111014');
    ell(g, cx, rimY + 3, 48, 12, '#1f1c24'); ell(g, cx - 2, rimY + 4, 37, 8, '#2a2730'); ell(g, cx - 6, rimY + 5, 22, 4, '#34303a'); ell(g, cx - 20, rimY - 4, 18, 2, '#514c56');
    for (let a = 3.5; a < 5.4; a += 0.02) px(g, cx + Math.cos(a) * 57, rimY - 1 + Math.sin(a) * 16, 2, 1, '#cfcac6');

    for (let y = 45; y < 85; y++) {
      const wood = y >= 59, k = (y - 59) / 25;
      let half = wood ? Math.round(4 + k * 2) : 3;
      if (y >= 83) half -= y - 82;
      px(g, cx - half - 1, y, half * 2 + 3, 1, '#141116');
      for (let i = -half; i <= half; i++) {
        const v = (i + half) / Math.max(1, half * 2);
        let color = wood ? (v < 0.24 ? '#b98a60' : v < 0.66 ? '#744a33' : '#472c23') : (v < 0.28 ? '#e0dcd6' : v < 0.66 ? '#8d8a90' : '#4b4852');
        if (wood && v >= 0.24 && v < 0.66 && (y + i * 2) % 7 === 0) color = '#5d3b2b';
        px(g, cx + i, y, 1, 1, color);
      }
    }
    px(g, cx - 8, 44, 17, 9, '#141116'); px(g, cx - 7, 45, 15, 7, '#77747b'); px(g, cx - 7, 45, 15, 1, '#d6d2cc');
    [cx - 5, cx + 4].forEach(x => { px(g, x, 48, 2, 2, '#26232a'); px(g, x, 48, 1, 1, '#eeeae3'); });
    px(g, cx - 5, 58, 11, 2, '#6d4b22'); px(g, cx - 4, 58, 9, 1, '#e3bf72');
    return true;
  }
  return false;
}

function paintNoodles(g, x, y, rx, ry) {
  ell(g, x, y + 1, rx, ry, '#8a6130'); ell(g, x, y, rx - 1, Math.max(1, ry - 1), '#c9933f');
  for (let n = 0; n < 7; n++) curve(g, x - rx + 3, y - ry + 2 + n * (ry / 3.4), x + (n % 2 ? 7 : -7), y - ry + n * (ry / 2.6), x + rx - 3, y - ry + 3 + n * (ry / 3.6), n % 3 ? '#e8bd62' : '#a8702f', 1);
}
function paintMartabak(g, x, y, w, h) {
  poly(g, [[x - w, y - h + 1], [x + w - 2, y - h - 1], [x + w, y + h - 1], [x - w + 2, y + h + 1]], '#7c4a22');
  poly(g, [[x - w + 1, y - h], [x + w - 3, y - h - 2], [x + w - 1, y + h - 3], [x - w + 3, y + h - 1]], '#d99a3f');
  px(g, x - 1, y - h, 2, h * 2, '#8a5426'); px(g, x - w + 3, y, w * 2 - 6, 1, '#8a5426');
  scatter(g, x, y - 1, w - 4, h - 2, 12, ['#f2cf7c', '#7d9868', '#a8652a'], 5);
}
function paintBlenderBase(g) {
  g.save(); g.translate(0, -34);
  shadow(g, 416, 272, 23, 4, 0.45);
  trapRows(g, 235, 271, 399, 429, 395, 433, '#1d2522');
  trapRows(g, 236, 269, 400, 428, 396, 432, (k, y) => (y === 236 ? '#c7dccb' : y > 265 ? '#3c554a' : y % 11 === 0 ? '#5f8272' : '#6f9482'));
  for (let y = 237; y < 268; y++) { const k = (y - 236) / 33; px(g, Math.round(398 - k * 2) + 2, y, 3, 1, '#a9c9b4'); px(g, Math.round(428 + k * 3) - 4, y, 4, 1, '#44614f'); }
  px(g, 399, 236, 30, 3, '#26232a'); px(g, 400, 236, 28, 1, '#b5b4bd');
  px(g, 402, 243, 24, 18, '#1d2522'); px(g, 403, 244, 22, 16, '#39473f');
  px(g, 398, 270, 7, 2, '#141218'); px(g, 423, 270, 7, 2, '#141218');
  g.restore();
}
function paintBlenderJar(g) {
  poly(g, [[5, 8], [0, 5], [5, 13]], '#26303a');
  curve(g, 30, 14, 37, 26, 28, 42, '#1f2526', 5); curve(g, 30, 14, 36, 26, 28, 42, '#5f8272', 3);
  for (let j = 0; j <= 52; j++) {
    const half = Math.round(14 - (5 * j) / 52), y = 8 + j;
    g.globalAlpha = 0.16; px(g, 18 - half, y, half * 2 + 1, 1, '#dcf2f1'); g.globalAlpha = 1;
    px(g, 18 - half - 1, y, 1, 1, '#51646a'); px(g, 18 + half + 1, y, 1, 1, '#3f5358');
    g.globalAlpha = 0.62; px(g, 18 - half + 1, y, 2, 1, '#ffffff'); g.globalAlpha = 0.24; px(g, 18 + half - 3, y, 1, 1, '#ffffff'); g.globalAlpha = 1;
  }
  [18, 28, 38, 48].forEach(y => px(g, 24, y, 5, 1, 'rgba(255,255,255,.65)'));
  px(g, 3, 3, 30, 6, '#1d2522'); px(g, 4, 3, 28, 4, '#5f8272'); px(g, 4, 3, 28, 1, '#c7dccb');
  px(g, 13, 0, 10, 4, '#1d2522'); px(g, 14, 0, 8, 3, '#7fa08e');
  px(g, 8, 60, 21, 4, '#1d2522'); px(g, 9, 60, 19, 3, '#a9a7ab'); px(g, 9, 60, 19, 1, '#f0eeea');
  px(g, 12, 57, 13, 1, '#d8d6d3'); px(g, 17, 55, 3, 5, '#77757b');
}

// Centong saat dipegang: gagang kayu, leher baja, dan kepala dalam berbibir tuang.
function paintLadleHeld(g) {
  curve(g, 27, 3, 25, 20, 22, 36, '#1f171a', 6); curve(g, 27, 3, 25, 20, 22, 36, '#7c5338', 4); curve(g, 26, 3, 24, 19, 22, 28, '#c09468', 1);
  ell(g, 27, 3, 3, 3, '#1f171a'); ell(g, 27, 3, 2, 2, '#9a6d48'); px(g, 27, 3, 1, 1, '#1f171a');
  px(g, 21, 25, 8, 4, '#26232a'); px(g, 22, 25, 6, 3, '#d7ad5e'); px(g, 22, 25, 2, 1, '#ffe8aa');
  curve(g, 24, 29, 23, 36, 22, 43, '#26232a', 4); curve(g, 24, 29, 23, 36, 22, 43, '#c8c5c3', 2);
  for (let j = 0; j <= 14; j++) {
    const half = Math.round(16 * Math.sqrt(Math.max(0, 1 - (j / 15) ** 2)));
    px(g, 20 - half - 1, 46 + j, half * 2 + 3, 1, '#211e25');
    for (let i = -half; i <= half; i++) {
      const v = (i + half) / Math.max(1, half * 2);
      px(g, 20 + i, 46 + j, 1, 1, v < 0.16 ? '#f2efe9' : v < 0.42 ? '#c6c3c1' : v < 0.74 ? '#8f8c92' : '#55525b');
    }
  }
  poly(g, [[7, 42], [0, 46], [7, 50]], '#211e25'); poly(g, [[7, 43], [2, 46], [7, 49]], '#d8d5d1');
  ell(g, 20, 46, 16, 6, '#211e25'); ell(g, 20, 45, 15, 5, '#ece9e4'); ell(g, 20, 46, 12, 4, '#37343c'); ell(g, 22, 47, 8, 2, '#4b4852');
  for (let a = 3.4; a < 5.2; a += 0.06) px(g, 20 + Math.cos(a) * 14, 45 + Math.sin(a) * 4.5, 1, 1, '#ffffff');
}

function paintUtensil(type, g) {
  px(g, 8, 0, 2, 4, '#26232a');
  for (let y = 4; y < 27; y++) { px(g, 7, y, 4, 1, '#21171a'); px(g, 8, y, 2, 1, '#7c5338'); px(g, 8, y, 1, 1, '#b08660'); }
  if (type === 'ladle') { ell(g, 9, 35, 8, 7, '#26232a'); ell(g, 9, 34, 7, 6, '#aaa7a6'); ell(g, 7, 32, 3, 2, '#e8e3dc'); }
  if (type === 'sieve') {
    ell(g, 9, 35, 9, 8, '#26232a'); ell(g, 9, 35, 7, 6, '#67656f');
    for (let j = -5; j <= 5; j += 2) px(g, 3, 35 + j, 13, 1, '#a09ea5');
    for (let i = -6; i <= 6; i += 3) px(g, 9 + i, 30, 1, 11, '#8a8891');
  }
}

const FLAME_NAMES = ['MATI', 'NYALA'];
const FLAME_COLORS = ['#7a3a34', '#74e08a'];

function drawKnob(g, x, y, level, side = 1) {
  ell(g, x, y + 1, 10, 8, '#121015'); ell(g, x, y, 9, 7, '#6f6b73'); ell(g, x, y - 1, 7, 5, '#b4b0ae'); ell(g, x - 2, y - 2, 3, 2, '#e4e0da');
  // Jarum hanya punya dua posisi: mati ke atas, nyala ke samping.
  const angle = level ? 0 : -Math.PI / 2;
  for (let r = 1; r <= 6; r++) px(g, Math.round(x + Math.cos(angle) * r), Math.round(y - 1 + Math.sin(angle) * r * 0.78), 2, 2, level ? '#b5412f' : '#26232a');
  px(g, x, y - 1, 2, 2, '#26232a');
  const lx = x + side * 15 - (side < 0 ? 3 : 0);
  px(g, lx - 1, y - 2, 6, 6, '#141218'); px(g, lx, y - 1, 4, 4, FLAME_COLORS[level ? 1 : 0]);
  if (level) px(g, lx, y - 1, 2, 1, '#e4ffe9');
}

function drawFlameRing(g, cx, cy, rx, level, t, frontOnly = false, gap = 0) {
  if (!level) return;
  const count = 24;
  g.globalAlpha = 0.16; ell(g, cx, cy, rx + 9, Math.round((rx + 5) * 0.32), '#4f9be0'); g.globalAlpha = 1;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * rx * 0.3;
    if (frontOnly && (Math.sin(a) < 0.05 || Math.abs(x - cx) < gap)) continue;
    const h = 5 + Math.round((Math.sin(t * 15 + i * 2.3) + 1) * 1.5);
    px(g, x, y - h, 2, h, '#2f73bd');
    px(g, x, y - Math.max(1, h - 1), 1, Math.max(1, h - 2), '#7dc2e8');
    px(g, x, y - Math.ceil(h * 0.45), 2, Math.ceil(h * 0.45), '#a9e3f4');
    px(g, x, y, 2, 1, '#d7f1f4');
  }
}

function friedBrown(v) {
  return v < 0.18 ? ['#a8987f', '#e9dfc8', '#f7f0df'] : v < 0.42 ? ['#a98450', '#dcb876', '#efd69c'] : v < 0.8 ? ['#7c4a22', '#c9812f', '#eab35d'] : ['#4f2f1c', '#8a5426', '#ad7437'];
}

function drawFritterPiece(g, p, x, y) {
  const air = p.air, z = air ? Math.round(air.z) : 0;
  const hop = p.flipT > 0 ? Math.round(Math.sin(Math.PI * (p.flipT / 0.32)) * 11) : 0;
  const [dark, mid, light] = friedBrown(p[p.side]), py = y - hop - z;
  let squash = p.flipT > 0.1 && p.flipT < 0.22 ? 2 : 6;
  if (air) squash = Math.max(1, Math.round(6 * Math.abs(Math.cos(Math.PI * air.spin))));
  if (p.landT > 0) squash = 4;
  if (z > 1) { g.globalAlpha = Math.max(0.12, 0.34 - z * 0.006); ell(g, x, y + 3, Math.max(6, 11 - Math.round(z * 0.12)), 2, '#120d10'); g.globalAlpha = 1; }
  ell(g, x, py + 1, p.landT > 0 ? 14 : 12, squash, dark); ell(g, x - 1, py, p.landT > 0 ? 12 : 10, Math.max(1, squash - 2), mid);
  if (squash > 2) scatter(g, x, py, 8, Math.max(1, squash - 3), 12, [light, dark], 7 + Math.round(p.seed || 0));
}

function drawBeefStrips(g, x, y, rx, ry, level, soy, seed) {
  const colors = level < 0.2 ? ['#a83c42', '#c75b5a', '#7f2b31'] : level < 0.55 ? ['#8d4c3b', '#ad7054', '#70372d'] : level <= 0.92 ? ['#633724', '#83533a', '#46271d'] : ['#3b2219', '#55311f', '#2a1812'];
  const count = Math.max(8, Math.round(rx * 1.05));
  for (let i = 0; i < count; i++) {
    const a = noise(i, seed) * 6.28, r = Math.sqrt(noise(seed + 2, i)), sx = x + Math.cos(a) * rx * r, sy = y + Math.sin(a) * ry * r;
    const w = 4 + Math.floor(noise(i, seed + 5) * 4), slope = noise(i, seed + 7) > 0.5 ? 1 : -1;
    px(g, sx - 1, sy + 1, w + 1, 2, '#2a1713');
    px(g, sx, sy, Math.ceil(w / 2), 2, colors[i % 3]); px(g, sx + Math.ceil(w / 2), sy + slope, Math.floor(w / 2), 2, colors[(i + 1) % 3]);
    if (soy > 0.3 && i % 2 === 0) px(g, sx + 1, sy, 2, 1, '#b98b63');
    else if (level < 0.2 && i % 3 === 0) px(g, sx + 1, sy, 2, 1, '#e7c9ba');
  }
}

function drawWokContents(g, wok, x, y) {
  const lift = wok.toss > 0 ? Math.round(Math.sin(Math.PI * (1 - wok.toss / TOSS_TIME)) * 15) : 0;
  if (wok.grime > 0.02) drawWokGrime(g, wok.grime, x, y);
  if (wok.oil > 0) {
    g.globalAlpha = 0.42 * wok.oil; ell(g, x, y + 2, Math.round(16 + 24 * wok.oil), Math.round(4 + 7 * wok.oil), '#c9a24a');
    g.globalAlpha = 0.5 * wok.oil; ell(g, x - 9, y - 1, Math.round(10 * wok.oil) + 1, 1, '#f3df9d'); g.globalAlpha = 1;
  }
  if (wok.items.includes('bumbu') && !wok.items.includes('rice')) {
    ell(g, x, y + 1, 24, 7, '#7a2f27'); scatter(g, x, y, 22, 6, 46, ['#c7624a', '#6e2b25', '#e08a6f'], 5);
  }
  const riceX = x + Math.round(wok.pushX || 0);
  if (wok.items.includes('rice')) {
    const seed = 3 + Math.floor(wok.stir / 26), browned = wok.soy > 0.3 || wok.level > 0.35;
    ell(g, riceX, y + 2 - lift, 33, 10, browned ? '#6d3f28' : '#c8bda6');
    ell(g, riceX - 1, y - lift, 30, 8, browned ? '#955b36' : '#e4dac3');
    scatter(g, riceX, y - lift, 30, 8, 150, browned ? FRIED : RICE, seed);
    if (wok.items.includes('bumbu')) scatter(g, riceX, y - lift, 24, 6, 24, ['#a83c32', '#c7624a'], seed + 2);
    wok.patches.forEach((age, i) => {
      if (age < 1.1) return;
      const px0 = riceX + STIR_PATCHES[i];
      g.globalAlpha = Math.min(0.42, (age - 1.1) * 0.5); ell(g, px0, y - lift, 6, 4, '#3d2118'); g.globalAlpha = 1;
    });
  }
  if (wok.items.includes('beef+')) {
    drawBeefStrips(g, riceX, y - lift, 30, 8, wok.level, wok.soy, 3 + Math.floor(wok.stir / 26));
    wok.patches.forEach((age, i) => {
      if (age < 1.1) return;
      g.globalAlpha = Math.min(0.42, (age - 1.1) * 0.5); ell(g, riceX + STIR_PATCHES[i], y - lift, 6, 4, '#2c1610'); g.globalAlpha = 1;
    });
  }
  if (wok.items.includes('egg')) {
    if (wok.stir > 90) scatter(g, riceX, y - lift, 26, 7, 22, ['#f2dc8e', '#fff3c8', '#e6bc55'], 11 + Math.floor(wok.stir / 26));
    else { const c = wok.level > 0.25 ? '#efe0b4' : '#f8f1e2'; ell(g, riceX + 12, y - 3 - lift, 10, 5, '#c9bda2'); ell(g, riceX + 12, y - 4 - lift, 9, 4, c); ell(g, riceX + 13, y - 4 - lift, 3, 2, '#e8b64c'); px(g, riceX + 12, y - 5 - lift, 1, 1, '#fff2b8'); }
  }
  const shaped = ['bumbu', 'egg', 'rice', 'beef+', 'coated'];
  (wok.parts || []).filter(part => !shaped.includes(part.food)).forEach((part, i) => {
    const a = i * 2.4 + 0.5, px0 = riceX + Math.round(Math.cos(a) * (8 + i * 4)), py0 = y + Math.round(Math.sin(a) * 4) - lift;
    g.save(); g.translate(px0, py0); g.scale(0.62, 0.62); drawFood(g, part.food, 0, 0); g.restore();
    if (wok.level > 0.25) { g.globalAlpha = Math.min(0.5, wok.level * 0.5); ell(g, px0, py0, 11, 4, '#4a2a1d'); g.globalAlpha = 1; }
  });
  wok.pieces.forEach(p => { if (!p.onBlade && !p.air) drawFritterPiece(g, p, x + p.x, y + p.y - lift); });
  drawSpiceSpecks(g, wok.spices, riceX, y - lift, 28, 7);
}

function cookWok(wok, dt, rate) {
  wok.toss = Math.max(0, wok.toss - dt);
  wok.pushX = (wok.pushX || 0) * Math.exp(-dt * 5);
  wok.pieces.forEach(p => {
    p.flipT = Math.max(0, p.flipT - dt);
    p.landT = Math.max(0, (p.landT || 0) - dt);
    if (rate > 0 && p.flipT <= 0 && !p.onBlade && !p.air) { const down = p.side === 'a' ? 'b' : 'a'; p[down] = Math.min(1, p[down] + (dt * rate) / 3.6); }
  });
  if (wok.pieces.length) wok.level = wok.pieces.reduce((n, p) => n + (p.a + p.b) / 2, 0) / wok.pieces.length;
  else if (wok.items.length) {
    wok.patches = wok.patches.map(age => age + dt);
    if (rate > 0) {
      const fresh = wok.patches.filter(age => age < 1.1).length / wok.patches.length;
      wok.level = Math.min(1, wok.level + (dt * rate * Math.max(0.12, fresh)) / 6.5);
    }
  }
}

function flipPiece(p) {
  if (p.flipT > 0 || p.air) return false;
  p.side = p.side === 'a' ? 'b' : 'a'; p.flipT = 0.32;
  return true;
}

function paintAutoDish(g, x, y, colors) {
  ell(g, x, y + 1, 19, 6, colors[0]); ell(g, x - 1, y, 17, 5, colors[1]);
  scatter(g, x, y - 1, 16, 4, 42, colors, 8);
  px(g, x + 8, y - 4, 4, 1, '#7d9868'); px(g, x - 10, y - 3, 3, 1, '#7d9868');
}
function drawDishBit(g, id, x, y) {
  g.save(); g.translate(x, y); g.scale(0.56, 0.56);
  if (RECIPES[id] && RECIPES[id].auto) paintAutoDish(g, 0, 0, RECIPES[id].art);
  if (id === 'mie') paintNoodles(g, 0, 0, 17, 7);
  if (id === 'martabak') paintMartabak(g, 0, 0, 15, 7);
  if (id === 'krispi') { fritters(g, 0, 0, true); scatter(g, 0, -1, 20, 6, 24, ['#efc777', '#a8702f'], 7); }
  if (id === 'pisang' || id === 'gorengan') fritters(g, 0, 0, true);
  if (id === 'nasi') friedRice(g, 0, 0, 20, 7);
  if (id === 'daging') { ell(g, 0, 1, 18, 6, '#4a2a1d'); drawBeefStrips(g, 0, -1, 16, 5, 0.75, 1, 6); }
  if (id === 'telur') { ell(g, 0, 1, 15, 7, '#d3c8ae'); ell(g, -1, 0, 14, 6, '#fbf4e5'); ell(g, 1, -1, 5, 3, '#e8a93c'); px(g, -1, -3, 3, 1, '#ffe39a'); }
  if (id === 'tumis') { ell(g, 0, 1, 18, 6, '#5c3a26'); scatter(g, 0, 0, 16, 5, 50, ['#a9683b', '#c7624a', '#7d9868', '#e9dfc8'], 9); }
  g.restore();
}

function plateArt(g, x, y, dish) {
  ell(g, x, y + 2, 28, 9, '#7f705e'); ell(g, x, y, 27, 8, '#f0e6d0'); ell(g, x, y + 1, 19, 5, '#d8ccb2'); ell(g, x, y, 18, 4, '#e9dfc8');
  for (let a = 0; a < 6.28; a += 0.04) px(g, x + Math.cos(a) * 24, y + Math.sin(a) * 6.5, 1, 1, '#4b6a60');
  if (!dish) return;
  if (dish.id === 'mie') paintNoodles(g, x, y - 3, 20, 7);
  else if (dish.id === 'martabak') paintMartabak(g, x, y - 3, 17, 7);
  else if (dish.id === 'krispi') { fritters(g, x, y - 3, true); scatter(g, x, y - 4, 22, 6, 30, ['#efc777', '#a8702f'], 7); }
  else if (dish.id === 'pisang' || dish.id === 'gorengan') fritters(g, x, y - 3, true);
  else if (dish.id === 'telur') {
    ell(g, x, y - 1, 17, 6, '#d3c8ae'); ell(g, x - 1, y - 2, 16, 5, '#fbf4e5'); ell(g, x + 1, y - 3, 5, 3, '#e8a93c'); px(g, x - 1, y - 5, 3, 1, '#ffe39a');
  } else if (dish.id === 'tumis') {
    ell(g, x, y - 1, 18, 5, '#5c3a26');
    scatter(g, x, y - 3, 16, 4, 58, ['#a9683b', '#c7624a', '#7d9868', '#e9dfc8', '#6f3f28'], 9);
  } else if (dish.id === 'daging') {
    ell(g, x, y - 1, 18, 5, '#4a2a1d');
    drawBeefStrips(g, x, y - 3, 16, 4, dish.level || 0.75, 1, 6);
    px(g, x + 12, y - 7, 4, 1, '#7d9868'); px(g, x - 9, y - 6, 4, 1, '#7d9868'); px(g, x + 1, y - 8, 2, 2, '#c7624a');
  } else if (RECIPES[dish.id] && RECIPES[dish.id].auto) {
    paintAutoDish(g, x, y - 3, RECIPES[dish.id].art);
  } else {
    friedRice(g, x, y - 3, 21, 7);
    ell(g, x - 1, y - 8, 9, 4, '#d9d0bb'); ell(g, x - 1, y - 9, 8, 3, '#f7efe0'); ell(g, x, y - 9, 2, 1, '#e8b64c');
    px(g, x + 16, y - 1, 4, 2, '#7d9868'); px(g, x - 20, y - 2, 4, 2, '#a83c32');
  }
}

function drawStream(g, st, t) {
  for (let y = st.y; y < st.endY; y++) {
    const x = st.x + Math.sin(y * 0.28 + t * 18) * Math.min(1.4, (y - st.y) * 0.05);
    px(g, x, y, 2, 1, st.c);
  }
  g.globalAlpha = 0.65; ell(g, st.x, st.endY, 4 + Math.round(Math.sin(t * 20) + 1), 1, st.c); g.globalAlpha = 1;
}

function setSizzle(level) { if (level <= 0) Sound.fry(false, 0, 0); }
function setNoiseLoop(id, level) { Sound.loop(id, level > 0 ? 1 : 0); }

function paintKnifeTop(g) {
  for (let y = 0; y < 58; y++) {
    const t = (y + 1) / 58, thick = 1 + Math.round(2 * Math.min(1, t / 0.7));
    px(g, 5, y, thick + 2, 1, '#2b2a33');
    for (let c = 0; c < thick; c++) px(g, 6 + c, y, 1, 1, c === 0 ? '#fbf7ee' : c === 1 ? '#b9bcc2' : '#747883');
  }
  px(g, 4, 58, 7, 5, '#26232a'); px(g, 5, 58, 5, 4, '#92959e'); px(g, 5, 58, 5, 1, '#e8e6e0'); px(g, 5, 61, 5, 1, '#5e606b');
  for (let y = 63; y < 93; y++) {
    const k = (y - 63) / 29, half = Math.round(2.5 + 1.7 * Math.sin(Math.PI * Math.min(1, k * 0.92))) - (y > 90 ? 1 : 0);
    px(g, 7 - half - 1, y, half * 2 + 3, 1, '#1b1316');
    for (let i = -half; i <= half; i++) {
      const v = (i + half) / Math.max(1, half * 2);
      let color = v < 0.25 ? '#a87a57' : v < 0.68 ? '#744a33' : '#4a2f25';
      if (i === 0 && y % 5 === 1) color = '#5d3b2b';
      px(g, 7 + i, y, 1, 1, color);
    }
  }
  px(g, 5, 93, 5, 1, '#1b1316');
}

function drawPotWater(g, heat, t, level = 1) {
  const cx = POT.x, cy = POT.top + 3 + Math.round((1 - level) * 3);
  if (level <= 0.01) { ell(g, cx, POT.top + 5, 27, 3, '#55535b'); ell(g, cx - 7, POT.top + 4, 11, 1, '#77757d'); return; }
  const rx = Math.round(20 + 10 * level), ry = Math.max(2, Math.round(2 + 3 * level));
  ell(g, cx, cy, rx, ry, heat >= 1 ? '#8cabb0' : '#708e96');
  ell(g, cx - 6, cy - 1, Math.round(rx * 0.6), Math.max(1, ry - 3), heat >= 1 ? '#b1cbca' : '#8cabb0');
  if (heat <= 0.3) return;
  const count = Math.round((3 + heat * 15) * level), speed = 1.2 + heat * 2.6;
  for (let i = 0; i < count; i++) {
    const phase = (t * speed + noise(i, 4) * 3) % 1, a = noise(i, 1) * 6.28, r = Math.sqrt(noise(i, 2));
    const x = cx + Math.cos(a + Math.floor(t * speed + noise(i, 4) * 3)) * (rx - 4) * r, y = cy + Math.sin(a) * Math.max(1, ry - 1) * r - phase;
    const size = phase > 0.65 ? 2 : 1;
    px(g, x, y, size, size, phase > 0.85 ? '#f4fbf8' : '#d3e7e3');
  }
}

function paintSpatulaHeld(g) {
  curve(g, 38, 30, 56, 45, 76, 61, '#21171a', 7);
  curve(g, 39, 31, 57, 46, 76, 61, '#70482f', 5);
  curve(g, 40, 31, 58, 45, 75, 60, '#b08660', 1);
  curve(g, 47, 39, 54, 45, 61, 50, '#5c3a29', 1);
  curve(g, 35, 28, 39, 31, 43, 35, '#6d4b22', 6); curve(g, 36, 28, 39, 31, 42, 34, '#d7ad5e', 3);
  curve(g, 26, 20, 31, 24, 37, 29, '#26232a', 4); curve(g, 27, 20, 32, 24, 37, 28, '#c7c3bf', 2);

  const cx = 18, cy = 14, ux = -0.78, uy = -0.62, vx = 0.62, vy = -0.78;
  for (let y = 0; y < 34; y++) for (let x = 0; x < 42; x++) {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy, u = dx * ux + dy * uy, v = dx * vx + dy * vy;
    const half = 9.4 - Math.max(0, -u - 3) * 0.32, front = 12.5 - (Math.abs(v) > 6.5 ? (Math.abs(v) - 6.5) * 0.7 : 0);
    if (u > front + 1 || u < -13 || Math.abs(v) > half + 1) continue;
    if (u > front || u < -12 || Math.abs(v) > half) { px(g, x, y, 1, 1, '#25222a'); continue; }
    let color = v > 4 ? '#eeeae3' : v > -3 ? '#bdb9b6' : '#8f8c95';
    if (u > front - 2) color = '#fff8ec';
    if (u < 7 && u > -8 && [-4.5, 0, 4.5].some(slot => Math.abs(v - slot) < 0.7)) color = '#2f2c34';
    px(g, x, y, 1, 1, color);
  }
}

function paintBowlShell(g, x, y) {
  for (let j = 0; j <= 12; j++) {
    const half = Math.round(21 * Math.sqrt(Math.max(0, 1 - (j / 13) ** 2)));
    for (let i = -half; i <= half; i++) {
      const n = i / (half + 1);
      px(g, x + i, y - 6 + j, 1, 1, pick(['#77684f', '#a08d6e', '#cdb992', '#e8d9b8', '#f7eed8'], 0.68 - n * 0.42 - n * n * 0.25 - j / 60));
    }
  }
  px(g, x - 8, y + 6, 17, 2, '#6c5d48'); px(g, x - 7, y + 6, 11, 1, '#b5a27f');
  ell(g, x, y - 6, 22, 6, '#6c5d48'); ell(g, x, y - 7, 21, 5, '#f4ead3');
  for (let a = 0; a < 6.28; a += 0.025) px(g, x + Math.cos(a) * 20, y - 7 + Math.sin(a) * 4.6, 1, 1, '#4b6a60');
  ell(g, x, y - 6, 17, 3, '#cdbf9f');
}

const SOUP_COLORS = { sup: ['#b98f50', '#dbb873', '#f0d99b'], soto: ['#bb7422', '#df9f35', '#f4cc68'], kuah: ['#8f6b45', '#b28b5e', '#d4b184'] };
function drawBowl(g, bowl, x, y, t = 0) {
  paintBowlShell(g, x, y);
  const fill = bowl.fill || 0;
  if (fill <= 0 || !bowl.dish) return;
  const [dark, mid, light] = SOUP_COLORS[bowl.dish.id] || SOUP_COLORS.kuah, rx = Math.round(9 + fill * 8), ry = Math.max(1, Math.round(1 + fill * 2));
  ell(g, x, y - 5, rx, ry, dark); ell(g, x, y - 6, Math.max(2, rx - 1), Math.max(1, ry - 1), mid);
  px(g, x - rx + 3, y - 7, Math.max(2, rx - 3), 1, light);
  if (fill >= 0.45) {
    drawBeefStrips(g, x - 2, y - 6, Math.max(5, rx - 6), 1, 0.75, 0, 4);
    px(g, x + 8, y - 7, 3, 1, '#7d9868'); px(g, x - 10, y - 5, 3, 1, '#7d9868');
    if (bowl.dish.id === 'soto') { px(g, x + 4, y - 5, 3, 1, '#c7473a'); ell(g, x - 7, y - 7, 2, 1, '#fff2c8'); }
    else px(g, x + 4, y - 5, 3, 1, '#d39a93');
  }
}

function paintCrackedEgg(g, x, y, beaten) {
  if (beaten) { ell(g, x, y + 1, 13, 6, '#c9962f'); ell(g, x, y, 12, 5, '#f2c94f'); ell(g, x - 3, y - 2, 5, 1, '#fff0a8'); return; }
  ell(g, x, y + 1, 13, 6, '#c9bda2'); ell(g, x, y, 12, 5, '#fbf4e5'); ell(g, x + 1, y - 1, 5, 3, '#c98a24'); ell(g, x + 1, y - 2, 4, 2, '#f0b53c'); px(g, x - 1, y - 3, 2, 1, '#ffe9a8');
}
function drawPotParts(g, pot, t) {
  const cx = POT.x, cy = POT.top + 3;
  if (!pot.parts.length) return;
  g.globalAlpha = 0.2 + pot.level * 0.42; ell(g, cx, cy, 30, 5, '#b77b3e'); g.globalAlpha = 1;
  pot.parts.forEach((part, i) => {
    const a = i * 2.25 + t * 0.35, x = cx + Math.round(Math.cos(a) * (6 + (i % 3) * 7)), y = cy + Math.round(Math.sin(a) * 2 + Math.sin(t * 2.6 + i));
    g.save(); g.translate(x, y); g.scale(0.42, 0.42); if (part.food === 'egg' && (part.cracked || part.beaten)) paintCrackedEgg(g, 0, 0, part.beaten); else drawFood(g, part.food, 0, 0); g.restore();
  });
}
