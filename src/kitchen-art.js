// Art bersama untuk ruangan dapur: cahaya, lampu, sisi depan, dan makanan.

const place = (g, art, dx = 0, dy = 0) => { g.save(); g.translate(dx, dy); art(g); g.restore(); };

function applyLight(g, lamps, extra = []) {
  const img = g.getImageData(0, 0, 640, 360), d = img.data;
  const fall = (x, y, lx, ly, r, a) => a / (1 + ((x - lx) ** 2 + ((y - ly) * 0.9) ** 2) / (r * r));
  for (let y = 0; y < 360; y++) for (let x = 0; x < 640; x++) {
    const i = (y * 640 + x) * 4;
    if (!d[i + 3]) continue;
    let L = 0;
    for (const [lx, ly] of lamps) L += fall(x, y, lx, ly, 145, 0.92);
    for (const [lx, ly, r, a] of extra) L += fall(x, y, lx, ly, r, a);
    L *= Math.max(0.28, 1 - 0.62 * ((x - 320) / 320) ** 2 - 0.34 * (Math.max(0, y - 190) / 170) ** 2 - 0.3 * (Math.max(0, 70 - y) / 70) ** 2);
    const q = Math.floor(L * 11 + BAYER[y & 3][x & 3] / 16) / 11;
    d[i] = Math.min(255, d[i] * (0.3 + q * 1.1));
    d[i + 1] = Math.min(255, d[i + 1] * (0.27 + q * 0.92));
    d[i + 2] = Math.min(255, d[i + 2] * (0.37 + q * 0.62));
  }
  g.putImageData(img, 0, 0);
}

function pendant(g, x, y) {
  px(g, x, 0, 1, y - 14, '#17121a');
  px(g, x - 3, y - 15, 7, 5, '#2b2529');
  poly(g, [[x - 7, y - 11], [x + 8, y - 11], [x + 25, y + 5], [x - 24, y + 5]], '#2f4139');
  poly(g, [[x - 7, y - 11], [x - 1, y - 11], [x - 9, y + 5], [x - 24, y + 5]], '#4f6a5a');
  poly(g, [[x + 3, y - 11], [x + 8, y - 11], [x + 25, y + 5], [x + 13, y + 5]], '#1e2c28');
  px(g, x - 24, y + 5, 50, 2, '#c7a776');
  ell(g, x, y + 9, 10, 4, '#ffd98f'); ell(g, x, y + 9, 6, 2, '#fff5cf');
}

function glowLayer(lights) {
  return layer(640, 260, g => {
    for (let y = 0; y < 260; y++) for (let x = 0; x < 640; x++) {
      let v = 0;
      for (const [lx, ly, r] of lights) v = Math.max(v, 1 - Math.hypot(x - lx, (y - ly) * 1.1) / r);
      if (v > 0 && v * 0.62 > (BAYER[y & 3][x & 3] + 1) / 17) px(g, x, y, 1, 1, v > 0.72 ? '#8a5a2c' : '#4a2c1e');
    }
  });
}

function woodShelf(g, x, y, w) {
  px(g, x, y, w, 4, '#7c5338'); px(g, x, y, w, 1, '#a57a54'); px(g, x, y + 4, w, 2, '#2c1d1b');
  px(g, x + 8, y + 5, 3, 7, '#3d281f'); px(g, x + w - 11, y + 5, 3, 7, '#3d281f');
}

function paintCabinetBank(g, x0, x1) {
  const count = 1, width = x1 - x0;
  for (let i = 0; i < count; i++) {
    const x = Math.round(x0 + i * width), w = Math.round(width);
    px(g, x + 3, 302, w - 6, 17, '#3f5a4e'); px(g, x + 3, 302, w - 6, 1, '#5d7a68'); px(g, x + 3, 318, w - 6, 1, '#2a3f35');
    px(g, x + (w >> 1) - 14, 308, 28, 3, '#1f2d27'); px(g, x + (w >> 1) - 14, 308, 28, 2, '#c29a5c'); px(g, x + (w >> 1) - 12, 308, 8, 1, '#ecd08f');
    const door = (w - 8) >> 1;
    [x + 3, x + 5 + door].forEach((dx, side) => {
      px(g, dx, 322, door, 38, '#3f5a4e'); px(g, dx, 322, door, 1, '#5d7a68');
      px(g, dx + 6, 328, door - 12, 32, '#32493f'); px(g, dx + 6, 328, door - 12, 1, '#26382f'); px(g, dx + 6, 329, 1, 31, '#26382f');
      px(g, side ? dx + 3 : dx + door - 6, 340, 3, 7, '#c29a5c');
    });
  }
}

function paintFrontBase(g) {
  px(g, 0, 288, 640, 3, '#b08660'); px(g, 0, 291, 640, 6, '#664230'); px(g, 0, 297, 640, 2, '#1c1416');
  px(g, 0, 299, 640, 61, '#26382f');
  paintCabinetBank(g, 0, 320);
  paintCabinetBank(g, 320, 640);
  px(g, 319, 299, 2, 61, '#1c2a24');
}

function paintServingMat(g) {
  shadow(g, 320, 284, 94, 4, 0.36);
  const top = 228, bottom = 284;
  for (let y = top; y < bottom; y++) {
    const k = (y - top) / (bottom - top - 1), l = Math.round(240 - k * 10), r = Math.round(400 + k * 10);
    for (let x = l; x <= r; x++) {
      const u = (x - l) / (r - l), edge = Math.min(u, 1 - u);
      let color = (x + y) % 2 ? '#6f806d' : '#7a8b76';
      if (edge < 0.1) color = (x + y) % 2 ? '#d8cfb4' : '#c9bfa4';
      if (edge >= 0.1 && edge < 0.122) color = '#465a4c';
      if (edge >= 0.15 && edge < 0.162) color = '#c9bfa4';
      if (y === top) color = '#a8b39b';
      if (y === bottom - 1) color = '#3f5046';
      px(g, x, y, 1, 1, color);
    }
  }
  for (let x = 232; x <= 408; x += 4) px(g, x, 284, 2, 2, '#b5ab90');

  // Alas bundar penanda tempat saji
  ell(g, 320, 256, 39, 14, '#3f5046');
  ell(g, 320, 254, 38, 13, '#9a7450');
  for (let a = 0; a < 6.28; a += 0.018) {
    px(g, 320 + Math.cos(a) * 33, 254 + Math.sin(a) * 11, 1, 1, '#c29a6c');
    px(g, 320 + Math.cos(a) * 24, 254 + Math.sin(a) * 8, 1, 1, '#7f5c40');
    px(g, 320 + Math.cos(a) * 14, 254 + Math.sin(a) * 4.6, 1, 1, '#c29a6c');
  }
}

function paintRecipeBook(g) {
  shadow(g, 119, 279, 69, 4, 0.42);
  trapRows(g, 228, 283, 62, 176, 50, 188, '#4a241f');
  trapRows(g, 225, 278, 66, 118, 56, 118, (k, y) => (y % 2 ? '#e6d9bd' : '#ded0b3'));
  trapRows(g, 225, 278, 118, 171, 118, 181, (k, y) => (y % 2 ? '#f1e7cf' : '#e9dec4'));
  trapRows(g, 278, 281, 56, 118, 54, 118, '#c9b896');
  trapRows(g, 278, 281, 118, 181, 118, 183, '#d7c8a7');
  px(g, 117, 225, 2, 56, '#8f7b63'); px(g, 114, 225, 3, 54, 'rgba(120,96,70,.28)'); px(g, 119, 225, 3, 54, 'rgba(120,96,70,.18)');
  px(g, 73, 233, 32, 2, '#5c2f28');
  for (let i = 0; i < 5; i++) {
    px(g, 71 - i, 241 + i * 7, 39 - (i % 3) * 6, 1, '#7d6b58');
    px(g, 126, 234 + i * 8, 39 + i - (i % 3) * 7, 1, '#7d6b58');
  }
  px(g, 151, 225, 4, 32, '#8f4633'); px(g, 151, 257, 1, 2, '#8f4633'); px(g, 154, 257, 1, 2, '#8f4633');
}

function paintCondimentTray(g) {
  shadow(g, 320, 225, 54, 3, 0.36);
  trapRows(g, 212, 225, 272, 368, 268, 372, '#3f271f');
  trapRows(g, 211, 222, 273, 367, 270, 370, (k, y) => (y === 211 ? '#b08660' : y % 3 === 0 ? '#6b4631' : '#7c5338'));

  cyl(g, 286, 198, 9, 3, 18, ['#5a221f', '#7c2f28', '#a03f33', '#c25b48', '#e08a6f'], '#b5b4bd');
  ell(g, 286, 198, 6, 1, '#6e6c78');
  const soy = ['#150e12', '#25171a', '#352225', '#4c3234', '#7a5a56'];
  cyl(g, 306, 200, 6, 2, 16, soy);
  px(g, 304, 190, 5, 10, soy[2]); px(g, 305, 190, 1, 10, soy[4]); px(g, 303, 187, 7, 3, '#a54e38');
  px(g, 301, 205, 11, 6, '#ded0b1'); px(g, 303, 207, 7, 1, '#8c3a2e');
  cyl(g, 326, 203, 7, 2, 13, RAMP.cream, '#3f2720');
  for (let i = -4; i <= 4; i += 2) px(g, 326 + i, 192 + Math.abs(i), 1, 11 - Math.abs(i), '#d9bd8a');
  cyl(g, 343, 202, 6, 2, 14, ['#8e9694', '#b6bdbb', '#d9dcd6', '#f1eee4', '#fffaf0']);
  px(g, 337, 196, 13, 6, '#6e6c78'); px(g, 337, 196, 13, 1, '#d7d4d0');
  [340, 343, 346].forEach(x => px(g, x, 198, 1, 1, '#1b171f'));
  px(g, 353, 200, 15, 16, '#a97f58'); px(g, 353, 200, 15, 1, '#d2ab7e'); px(g, 356, 197, 9, 4, '#fff8ea'); px(g, 358, 195, 5, 3, '#f2ead9');
}

function paintFrontMug(g) {
  shadow(g, 434, 263, 22, 4, 0.36);
  ell(g, 432, 260, 21, 6, '#4e3126'); ell(g, 432, 258, 20, 5, '#946a48'); ell(g, 432, 258, 15, 3, '#7c5338');
  cyl(g, 432, 231, 14, 4, 25, RAMP.cream, '#efe2c5');
  ell(g, 432, 231, 13, 3, '#3f5a53'); ell(g, 432, 232, 11, 2, '#2a1a17'); ell(g, 429, 231, 4, 1, '#6a4634');
  curve(g, 446, 238, 459, 243, 446, 252, '#6f5c4b', 4); curve(g, 446, 237, 457, 242, 446, 250, '#d8c6a4', 2);
}

function paintCashBox(g) {
  shadow(g, 536, 276, 54, 4, 0.42);
  trapRows(g, 228, 258, 494, 578, 486, 586, (k, y) => (y === 228 ? '#b08660' : y % 8 === 0 ? '#5f3d2c' : y % 8 === 4 ? '#744c35' : '#6b4631'));
  px(g, 486, 258, 101, 3, '#a57a54'); px(g, 486, 261, 101, 13, '#49301f'); px(g, 486, 273, 101, 2, '#24170f');
  [[486, 258], [581, 258], [486, 268], [581, 268]].forEach(([x, y]) => { px(g, x, y, 6, 6, '#8e6a32'); px(g, x, y, 5, 1, '#e3bf72'); });
  px(g, 529, 254, 15, 12, '#6d4b22'); px(g, 530, 255, 13, 10, '#d0aa64'); px(g, 530, 255, 13, 1, '#f3d891'); px(g, 535, 258, 3, 4, '#2c1d1b');
  px(g, 516, 239, 42, 3, '#2f1e15'); px(g, 516, 239, 42, 1, '#1a100b');
}

function paintFrontPlant(g) {
  shadow(g, 208, 270, 15, 3, 0.36);
  cyl(g, 206, 251, 12, 3, 17, RAMP.clay, '#3f2720');
  [[-9, -2], [-6, -9], [0, -13], [7, -8], [10, -2], [1, -5], [-3, -3]].forEach(([a, b], i) => {
    ell(g, 206 + a, 249 + b, 4, 3, i % 2 ? '#456048' : '#5d7a56'); px(g, 205 + a, 248 + b, 2, 1, '#88a374');
  });
}

// Empat tempat pelanggan di bibir jendela.
const CUSTOMER_SEATS = [150, 263, 377, 490];
function paintCustomerSeats(g) {
  CUSTOMER_SEATS.forEach(x => {
    ell(g, x, 179, 31, 4, '#3d281f'); ell(g, x, 178, 30, 3, '#b99a68');
    for (let i = -27; i <= 27; i += 3) px(g, x + i, 177 + (i % 2 ? 1 : 0), 2, 2, i % 6 === 0 ? '#8a6a42' : '#d7bd8a');
    ell(g, x, 178, 14, 2, '#e8d9b8'); ell(g, x, 178, 11, 1, '#c9b48c');
  });
}
function paintInnerDecor(g) {
  const at = (dx, dy, paint) => { g.save(); g.translate(dx, dy); paint(); g.restore(); };
  // Toples kerupuk.
  at(-80, 41, () => {
    shadow(g, 133, 176, 22, 3);
    px(g, 113, 134, 40, 41, '#7b7473'); px(g, 115, 142, 36, 31, '#54606a');
    [[122, 165], [134, 167], [145, 163], [128, 156], [141, 153], [121, 149], [147, 149]].forEach(([x, y]) => { ell(g, x, y, 6, 5, '#bda077'); ell(g, x - 1, y - 1, 4, 3, '#dcc597'); });
    px(g, 116, 143, 3, 28, 'rgba(235,240,235,.3)'); px(g, 111, 132, 44, 6, '#9b979b'); px(g, 111, 132, 44, 1, '#cfc9c4'); px(g, 111, 138, 44, 1, '#3b3640');
  });
  // Dua kaleng kecil di sebelahnya.
  at(-84, 42, () => {
    [[176, 18, 'rust'], [194, 13, 'cream']].forEach(([x, h, n], i) => { shadow(g, x, 176, 8, 2); cyl(g, x, 174 - h - i, 8, 3, h, RAMP[n], RAMP[n][3]); ell(g, x, 174 - h - i, 5, 1, RAMP[n][1]); });
  });
  // Radio tua.
  at(120, 42, () => {
    shadow(g, 450, 176, 24, 3);
    px(g, 428, 146, 44, 29, '#4e3126'); px(g, 428, 146, 44, 2, '#82593c'); px(g, 432, 151, 21, 19, '#2c1d1b');
    for (let y = 152; y < 169; y += 2) px(g, 433, y, 19, 1, '#524036');
    ell(g, 462, 157, 4, 4, '#c3ac8a'); ell(g, 462, 167, 2, 2, '#82593c'); px(g, 437, 124, 1, 22, '#2f2c36');
  });
  // Bunga pot.
  at(122, 42, () => {
    shadow(g, 500, 176, 15, 3);
    cyl(g, 500, 156, 13, 4, 18, RAMP.clay, '#3a2a24');
    [[-12, -10, 'leaf'], [-3, -23, 'dark'], [8, -18, 'leaf'], [15, -6, 'dark'], [-20, 1, 'dark'], [21, 5, 'leaf']].forEach(([a, b, t]) => {
      curve(g, 500, 156, 500 + a * 0.4, 156 + b, 500 + a, 156 + b * 0.4, '#34493a');
      ell(g, 500 + a, 154 + b * 0.5, 5, 3, t === 'leaf' ? '#5d7a56' : '#34493a');
    });
  });
}

function paintFrontRoom(g) {
  paintShell(g);
  ['frame', 'ledge', 'shelfLeft', 'wallRight', 'hanging'].forEach(k => ART[k](g));
  paintCustomerSeats(g);
  paintFrontBase(g);
  paintInnerDecor(g);
  paintCondimentTray(g);
  paintServingMat(g);
  paintRecipeBook(g);
  paintFrontPlant(g);
  paintFrontMug(g);
  paintCashDrawers(g);
}

function scatter(g, cx, cy, rx, ry, count, colors, seed = 1) {
  for (let i = 0; i < count; i++) {
    const a = noise(i, seed) * 6.28, r = Math.sqrt(noise(seed, i + 3));
    px(g, cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, 2, 1, colors[i % colors.length]);
  }
}
const RICE = ['#e9dfc8', '#d7cbb1', '#f5eddb'];
const FRIED = ['#8e5532', '#a9683b', '#6f3f28', '#c08a5c', '#a83c32', '#5d7a56'];

function miniCup(g, x, y, fill) {
  const height = 20, top = y - height, clear = fill === '#b9d8dc' || fill === '#8fb4ba',
    juice = !!fill && !clear && !['#2a1a17', '#5f4032', '#5a3a2d'].includes(fill),
    level = fill === '#2a1a17' || fill === '#b9d8dc' || juice ? 0.84 : fill === '#5f4032' || fill === '#8fb4ba' ? 0.48 : fill ? 0.16 : 0;
  const halfAt = j => {
    const k = j / height;
    let half = Math.round(9 - k * 2.4);
    if (j >= height - 1) half -= 2; else if (j >= height - 2) half -= 1;
    return half;
  };
  const liquidTop = level ? Math.round(top + 2 + (height - 4) * (1 - level)) : y + 1;
  for (let j = 1; j <= height; j++) {
    const row = top + j, half = halfAt(j), wet = row >= liquidTop && j < height - 1;
    g.globalAlpha = wet ? (clear ? 0.55 : 1) : 0.34;
    px(g, x - half, row, half * 2 + 1, 1, wet ? fill : '#d8ebe7');
    g.globalAlpha = 1;
    if (wet && clear) { px(g, x - half + 1, row, 2, 1, '#e4f4f3'); px(g, x + half - 2, row, 2, 1, '#7fa5ab'); }
    else if (wet && juice) { px(g, x - half + 1, row, 2, 1, 'rgba(255,255,235,.55)'); px(g, x + half - 2, row, 2, 1, 'rgba(40,20,15,.35)'); }
    else if (wet) { px(g, x - half + 1, row, 2, 1, fill === '#2a1a17' ? '#57382b' : '#8a6248'); px(g, x + half - 2, row, 2, 1, '#1b100e'); }
    px(g, x - half - 1, row, 1, 1, '#50656a'); px(g, x + half + 1, row, 1, 1, '#3f5358');
  }
  if (level) { ell(g, x, liquidTop, halfAt(liquidTop - top) - 1, 1, clear ? '#dff2f2' : juice ? 'rgba(255,255,235,.65)' : fill === '#2a1a17' ? '#6d4633' : '#94694c'); px(g, x - 3, liquidTop, 3, 1, clear || juice ? '#ffffff' : '#c79b72'); }
  for (let j = 3; j < height - 4; j++) px(g, x - halfAt(j) + 1, top + j, 1, 1, 'rgba(255,255,255,.72)');
  for (let j = 6; j < height - 7; j++) px(g, x + halfAt(j) - 2, top + j, 1, 1, 'rgba(255,255,255,.3)');
  ell(g, x, y, 6, 2, '#5a6f73'); ell(g, x, y - 1, 5, 1, '#c9dfdc');
  ell(g, x, top, 10, 3, '#50656a'); ell(g, x, top, 9, 2, '#e5f3ef'); ell(g, x, top, 7, 1, juice ? fill : level >= 0.8 && !clear ? '#4a2f24' : clear && level >= 0.8 ? '#b9d8dc' : '#8ea6a7');
  px(g, x - 6, top - 1, 4, 1, '#ffffff');
}

function miniBowl(g, x, y, colors) {
  ell(g, x, y, 17, 8, '#6e3f30'); ell(g, x, y - 2, 16, 6, '#94563c'); ell(g, x, y - 3, 13, 4, '#3f2720');
  if (colors) scatter(g, x, y - 3, 12, 3, 46, colors, 4);
}
function friedRice(g, x, y, rx = 32, ry = 11) {
  ell(g, x, y, rx, ry, '#6f3f28'); ell(g, x - 1, y - 2, rx - 3, ry - 2, '#9b6038');
  scatter(g, x, y - 1, rx - 3, ry - 2, 130, FRIED, 2);
}
function fritters(g, x, y, gold) {
  [[-15, 2], [0, -3], [15, 2]].forEach(([a, b], i) => {
    ell(g, x + a, y + b, 11, 6, gold ? '#7c4a22' : '#b8a78a');
    ell(g, x + a - 1, y + b - 1, 9, 4, gold ? '#c9812f' : '#e9dfc8');
    scatter(g, x + a, y + b - 1, 8, 3, 12, gold ? ['#e9ac55', '#a8652a'] : ['#f5eddb', '#d7cbb1'], i + 7);
  });
}
