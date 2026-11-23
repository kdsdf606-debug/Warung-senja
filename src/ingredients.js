// Bahan segar: gambar tiap bahan, kulkas daging, dan rak sayur serta buah.

const FOOD_INFO = {
  ayam: { name: 'AYAM', size: [44, 20], limit: 13, bits: ['#e8bf98', '#f6dcc0', '#b98a66'] },
  kambing: { name: 'KAMBING', size: [44, 18], limit: 13, bits: ['#7d2b2c', '#a8504a', '#ead5c6'] },
  bebek: { name: 'BEBEK', size: [44, 20], limit: 13, bits: ['#a9653f', '#d29a68', '#6f3a2b'] },
  ikan: { name: 'IKAN', size: [54, 18], limit: 15, bits: ['#9fb4bd', '#e6eef0', '#f0c9b8'] },
  udang: { name: 'UDANG', size: [40, 16], limit: 12, bits: ['#e8794a', '#f4ab7f', '#fbe0cc'] },
  cumi: { name: 'CUMI', size: [46, 18], limit: 13, bits: ['#efe4dc', '#c99aa0', '#fff8f2'] },
  kepiting: { name: 'KEPITING', size: [44, 22], limit: 13, bits: ['#c9502f', '#ee8a55', '#fbe6d4'] },
  bawangputih: { name: 'BAWANG PUTIH', size: [18, 16], limit: 8, bits: ['#f4ecdc', '#ddcfb6', '#fffaf0'] },
  tomat: { name: 'TOMAT', size: [20, 17], limit: 8, bits: ['#d2402f', '#ef7a5a', '#f6c04f'] },
  wortel: { name: 'WORTEL', size: [46, 11], limit: 13, bits: ['#e97f2c', '#f6a74f', '#c95f1f'] },
  kentang: { name: 'KENTANG', size: [26, 17], limit: 9, bits: ['#e8d29a', '#f5e6bd', '#b8965c'] },
  kol: { name: 'KOL', size: [30, 23], limit: 10, bits: ['#9cc57a', '#d4e6a8', '#6f9a55'] },
  terong: { name: 'TERONG', size: [46, 15], limit: 13, bits: ['#5b2f6b', '#efe6c8', '#8a55a0'] },
  mangga: { name: 'MANGGA', size: [30, 19], limit: 10, bits: ['#f2b13c', '#fbd66f', '#e07f2c'] },
  jeruk: { name: 'JERUK NIPIS', size: [18, 16], limit: 8, bits: ['#8fbf4a', '#d9ec8e', '#f4f7c8'] },
  nanas: { name: 'NANAS', size: [26, 30], limit: 9, bits: ['#f2c94c', '#fbe58a', '#c98f2c'] },
};
Object.entries(FOOD_INFO).forEach(([type, info]) => { FOOD_SIZE[type] = info.size; PIECE_LIMIT[type] = info.limit; });

function paintShrimp(g, x, y) {
  curve(g, x - 12, y + 3, x, y - 7, x + 12, y + 2, '#8f3f26', 5);
  curve(g, x - 12, y + 2, x, y - 8, x + 12, y + 1, '#e8794a', 3);
  curve(g, x - 9, y, x, y - 7, x + 9, y - 1, '#f8bd96', 1);
  [-6, -1, 4].forEach(a => px(g, x + a, y - 5 + Math.abs(a) * 0.45, 1, 3, '#a84c2c'));
  px(g, x + 12, y, 3, 3, '#c95f38'); px(g, x + 13, y, 1, 1, '#1b1316');
  px(g, x + 14, y - 3, 1, 3, '#f0b28c'); px(g, x - 15, y + 2, 3, 2, '#c9502f');
}
function paintNewFood(g, type, cx, cy) {
  if (type === 'ayam') {
    ell(g, cx - 3, cy + 2, 19, 8, '#9c6f52'); ell(g, cx - 3, cy, 18, 8, '#e8bf98'); ell(g, cx - 8, cy - 3, 9, 3, '#f6dcc0');
    curve(g, cx + 10, cy + 2, cx + 17, cy - 3, cx + 21, cy + 2, '#9c6f52', 6); curve(g, cx + 10, cy + 1, cx + 17, cy - 4, cx + 20, cy + 1, '#d9a982', 4);
    px(g, cx + 20, cy, 3, 3, '#f7efe0'); [-12, -4, 4].forEach(a => px(g, cx + a, cy + 3, 2, 1, '#c9976f'));
  }
  if (type === 'kambing') {
    ell(g, cx, cy + 2, 21, 7, '#3f1719'); ell(g, cx, cy, 21, 7, '#7d2b2c'); ell(g, cx - 2, cy - 1, 17, 5, '#a8504a');
    curve(g, cx - 18, cy - 3, cx, cy - 8, cx + 19, cy - 2, '#f3e6d6', 2);
    curve(g, cx - 13, cy + 2, cx + 1, cy - 2, cx + 15, cy + 3, '#e4c6b6', 1);
    ell(g, cx + 6, cy + 1, 3, 2, '#f3e6d6'); ell(g, cx + 6, cy + 1, 1, 1, '#c9a48f');
  }
  if (type === 'bebek') {
    ell(g, cx - 2, cy + 3, 20, 7, '#3f2118'); ell(g, cx - 2, cy, 20, 8, '#8a4d2e'); ell(g, cx - 6, cy - 2, 12, 4, '#c98450'); ell(g, cx - 9, cy - 4, 5, 1, '#f0c48c');
    curve(g, cx + 13, cy - 2, cx + 19, cy - 8, cx + 21, cy - 2, '#6f3a2b', 4); px(g, cx + 19, cy - 3, 4, 2, '#e8b64c');
  }
  if (type === 'ikan') {
    poly(g, [[cx + 16, cy], [cx + 27, cy - 8], [cx + 24, cy], [cx + 27, cy + 8]], '#4e6472');
    poly(g, [[cx + 17, cy], [cx + 25, cy - 6], [cx + 23, cy], [cx + 25, cy + 6]], '#7f97a4');
    poly(g, [[cx - 8, cy - 7], [cx + 2, cy - 11], [cx + 9, cy - 6]], '#4e6472');
    ell(g, cx - 4, cy, 22, 8, '#3e515d'); ell(g, cx - 4, cy - 1, 21, 7, '#9fb4bd'); ell(g, cx - 5, cy + 3, 16, 3, '#e6eef0');
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) px(g, cx - 6 + i * 4 + j * 2, cy - 4 + j * 3, 2, 1, '#6f8794');
    px(g, cx - 15, cy - 5, 1, 9, '#536a76'); ell(g, cx - 20, cy - 2, 2, 2, '#f7f3e8'); px(g, cx - 20, cy - 2, 1, 1, '#141014');
    px(g, cx - 25, cy + 1, 4, 1, '#536a76');
  }
  if (type === 'udang') { paintShrimp(g, cx - 3, cy - 2); paintShrimp(g, cx + 3, cy + 4); }
  if (type === 'cumi') {
    for (let i = 0; i < 6; i++) curve(g, cx + 6, cy - 3 + i * 1.3, cx + 15, cy - 5 + i * 2.4, cx + 22, cy - 7 + i * 3, i % 2 ? '#c99aa0' : '#e4c1c0', 1);
    poly(g, [[cx - 23, cy], [cx - 8, cy - 8], [cx + 8, cy - 6], [cx + 8, cy + 6], [cx - 8, cy + 8]], '#a97f86');
    poly(g, [[cx - 21, cy], [cx - 8, cy - 7], [cx + 7, cy - 5], [cx + 7, cy + 4], [cx - 8, cy + 6]], '#efe4dc');
    ell(g, cx - 7, cy - 2, 9, 2, '#fff8f2'); [[-12, 2], [-4, 3], [3, 1]].forEach(([a, b]) => px(g, cx + a, cy + b, 2, 1, '#c98a93'));
    ell(g, cx + 8, cy - 2, 2, 2, '#26202a');
  }
  if (type === 'kepiting') {
    [-1, 1].forEach(d => {
      [0, 3, 6].forEach(n => curve(g, cx + d * 11, cy + 2 + n * 0.6, cx + d * 18, cy + n, cx + d * (21 - n * 0.4), cy + 5 + n, '#8f3520', 2));
      curve(g, cx + d * 10, cy - 3, cx + d * 17, cy - 8, cx + d * 15, cy - 11, '#8f3520', 3);
      ell(g, cx + d * 15, cy - 11, 5, 4, '#a83f25'); ell(g, cx + d * 15, cy - 12, 4, 3, '#e8693c'); px(g, cx + d * 15, cy - 13, 1, 4, '#3a1c18');
    });
    ell(g, cx, cy + 2, 15, 9, '#7f2f1e'); ell(g, cx, cy, 15, 8, '#c9502f'); ell(g, cx - 3, cy - 3, 9, 3, '#ee8a55');
    px(g, cx - 5, cy - 8, 2, 3, '#1b1316'); px(g, cx + 4, cy - 8, 2, 3, '#1b1316');
  }
  if (type === 'bawangputih') {
    ell(g, cx, cy + 2, 8, 6, '#a99a80'); ell(g, cx, cy + 1, 8, 6, '#f4ecdc'); curve(g, cx - 3, cy - 4, cx - 5, cy + 2, cx - 2, cy + 6, '#cfc0a6', 1);
    curve(g, cx + 3, cy - 4, cx + 5, cy + 2, cx + 2, cy + 6, '#cfc0a6', 1); px(g, cx - 1, cy - 7, 2, 4, '#d9c8a8'); ell(g, cx - 3, cy - 1, 2, 2, '#fffaf0');
  }
  if (type === 'tomat') {
    ell(g, cx, cy + 2, 9, 7, '#8a2a22'); ell(g, cx, cy + 1, 9, 7, '#d2402f'); ell(g, cx - 3, cy - 1, 4, 3, '#ef7a5a'); px(g, cx - 4, cy - 2, 2, 1, '#ffd3bd');
    [[-3, -6], [3, -6], [0, -7]].forEach(([a, b]) => px(g, cx + a - 1, cy + b, 3, 2, '#4f7350')); px(g, cx, cy - 8, 1, 3, '#6f9a55');
  }
  if (type === 'wortel') {
    for (let i = 0; i < 36; i++) { const half = Math.max(1, Math.round(5 - i * 0.12)); px(g, cx - 14 + i, cy - half, 1, half * 2 + 1, '#a8501a'); px(g, cx - 14 + i, cy - half + 1, 1, half * 2 - 1, i % 7 === 3 ? '#c95f1f' : '#e97f2c'); px(g, cx - 14 + i, cy - half + 1, 1, 1, '#f9bd72'); }
    [[-4, -4], [-1, 0], [-4, 4]].forEach(([a, b]) => curve(g, cx - 14, cy, cx - 19, cy + b, cx - 23 + a * 0, cy + b * 1.2, b ? '#4f7350' : '#6f9a55', 2));
  }
  if (type === 'kentang') {
    ell(g, cx, cy + 2, 12, 7, '#7d6238'); ell(g, cx, cy, 12, 7, '#c9a868'); ell(g, cx - 3, cy - 2, 6, 3, '#e5cc92');
    [[-6, 2], [2, -3], [6, 2], [0, 3]].forEach(([a, b]) => { px(g, cx + a, cy + b, 2, 1, '#7d6238'); px(g, cx + a, cy + b - 1, 1, 1, '#ead8a8'); });
  }
  if (type === 'kol') {
    ell(g, cx, cy + 3, 14, 9, '#4f7350'); ell(g, cx, cy + 1, 14, 10, '#7fae62'); ell(g, cx - 1, cy, 10, 8, '#a9d07f'); ell(g, cx - 2, cy - 2, 6, 5, '#d4e6a8');
    curve(g, cx - 9, cy + 7, cx - 3, cy - 3, cx + 2, cy - 7, '#6f9a55', 1); curve(g, cx + 10, cy + 6, cx + 4, cy, cx - 2, cy - 2, '#6f9a55', 1); px(g, cx - 1, cy - 2, 2, 8, '#eff5cf');
  }
  if (type === 'terong') {
    curve(g, cx - 19, cy + 1, cx, cy + 4, cx + 15, cy - 1, '#2d1636', 12); curve(g, cx - 18, cy, cx, cy + 3, cx + 15, cy - 2, '#5b2f6b', 9);
    curve(g, cx - 14, cy - 2, cx, cy, cx + 12, cy - 4, '#9b6ab0', 2);
    px(g, cx + 14, cy - 6, 6, 9, '#4f7350'); px(g, cx + 14, cy - 5, 2, 7, '#7fa070'); px(g, cx + 20, cy - 3, 3, 2, '#6b5a35');
  }
  if (type === 'mangga') {
    ell(g, cx, cy + 2, 14, 8, '#a8561f'); ell(g, cx, cy, 14, 8, '#f2b13c'); ell(g, cx + 6, cy + 1, 7, 5, '#e07f2c'); ell(g, cx - 6, cy - 2, 7, 4, '#a7bf52');
    ell(g, cx - 5, cy - 3, 3, 1, '#fff0b0'); px(g, cx - 13, cy - 5, 3, 2, '#5d4a2a');
  }
  if (type === 'jeruk') {
    ell(g, cx, cy + 2, 8, 6, '#4f7a2e'); ell(g, cx, cy + 1, 8, 6, '#8fbf4a'); ell(g, cx - 2, cy - 1, 4, 3, '#c6e07a'); px(g, cx - 3, cy - 2, 2, 1, '#f4f7c8');
    px(g, cx, cy - 6, 2, 2, '#5d4a2a'); [[3, 3], [-3, 4], [5, 0]].forEach(([a, b]) => px(g, cx + a, cy + b, 1, 1, '#6c9a3a'));
  }
  if (type === 'nanas') {
    [[-8, -10], [-4, -14], [0, -16], [4, -14], [8, -10]].forEach(([a, b]) => curve(g, cx, cy - 5, cx + a * 0.5, cy + b * 0.7, cx + a, cy + b, a % 8 ? '#6f9a55' : '#3f6b48', 2));
    ell(g, cx, cy + 5, 11, 11, '#8f5f1f'); ell(g, cx, cy + 4, 11, 11, '#d99a35');
    for (let j = -6; j <= 12; j += 4) for (let i = -8; i <= 8; i += 4) {
      const a = i + (((j + 6) / 4) % 2 ? 2 : 0);
      if ((a / 11) ** 2 + ((j - 2) / 10) ** 2 < 1) { px(g, cx + a, cy + j, 2, 1, '#f6d774'); px(g, cx + a + 1, cy + j + 1, 1, 1, '#9a6a24'); }
    }
  }
}
function drawChopped(g, type, x, y) {
  const c = FOOD_INFO[type].bits;
  [[-12, 1], [-5, -3], [3, 2], [10, -2], [-1, 3], [14, 2]].forEach(([a, b], i) => {
    ell(g, x + a, y + b + 1, 5, 3, '#3a2622'); ell(g, x + a, y + b, 4, 3, c[i % 2]); px(g, x + a - 2, y + b - 1, 2, 1, c[2]);
  });
}

// Pintu lemari di bawah meja racik membuka kulkas dan rak bahan.
const STORE_PANEL = { x: 70, y: 70, w: 500, h: 226 };
const STORES = {
  cold: {
    title: 'KULKAS DAGING', door: { x: 8, y: 301, w: 304, h: 56 },
    sections: [
      { label: 'DAGING DARAT', x: 18, y: 38, cols: 4, cw: 116, ch: 80, items: ['beef', 'ayam', 'kambing', 'bebek'] },
      { label: 'HASIL LAUT', x: 18, y: 134, cols: 4, cw: 116, ch: 80, items: ['ikan', 'udang', 'cumi', 'kepiting'] },
    ],
  },
  fresh: {
    title: 'RAK SAYUR DAN BUAH', door: { x: 328, y: 301, w: 304, h: 56 },
    sections: [
      { label: 'SAYURAN', x: 14, y: 38, cols: 4, cw: 78, ch: 88, items: ['chili', 'shallot', 'bawangputih', 'tomat', 'wortel', 'kentang', 'kol', 'terong'] },
      { label: 'BUAH', x: 344, y: 38, cols: 2, cw: 72, ch: 88, items: ['banana', 'mangga', 'jeruk', 'nanas'] },
    ],
  },
};
const STORE_NAMES = { beef: 'DAGING SAPI', chili: 'CABAI', shallot: 'BAWANG MERAH', banana: 'PISANG', ...Object.fromEntries(Object.entries(FOOD_INFO).map(([k, v]) => [k, v.name])) };
const STORE_OF = {};
Object.entries(STORES).forEach(([id, st]) => st.sections.forEach(sec => sec.items.forEach(type => { STORE_OF[type] = id; })));
const storeCells = id => STORES[id].sections.flatMap(sec => sec.items.map((type, i) => ({
  type, x: STORE_PANEL.x + sec.x + (i % sec.cols) * sec.cw, y: STORE_PANEL.y + sec.y + Math.floor(i / sec.cols) * sec.ch, w: sec.cw - 4, h: sec.ch - 4,
})));
const storeCellAt = (id, x, y) => storeCells(id).find(c => inRect(c, x, y));
const storeDoorAt = (x, y, v = LEFT) => Object.keys(STORES).find(id => (STORES[id].v === undefined ? LEFT : STORES[id].v) === v && inRect(STORES[id].door, x, y));

function paintColdPanel(g) {
  const { w, h } = STORE_PANEL;
  px(g, 0, 0, w, h, '#20262c'); px(g, 2, 2, w - 4, h - 4, '#8c98a0'); px(g, 2, 2, w - 4, 1, '#dbe4e6');
  px(g, 8, 24, w - 16, h - 32, '#2f4048');
  for (let y = 24; y < h - 8; y++) px(g, 8, y, w - 16, 1, pick(['#6f8d98', '#587480', '#466069', '#3a515a'], (y - 24) / (h - 32)));
  px(g, 8, 24, w - 16, 3, '#eafcff'); px(g, 8, 27, w - 16, 1, '#a9dbe6');
  for (let i = 0; i < 90; i++) px(g, 10 + noise(i, 4) * (w - 20), 28 + noise(i, 8) ** 3 * 16, 2, 1, 'rgba(235,250,252,.55)');
  STORES.cold.sections.forEach(sec => {
    txt(g, sec.label, sec.x + 4, sec.y - 9, '#eafcff');
    px(g, sec.x, sec.y + sec.ch - 6, sec.cols * sec.cw - 4, 3, '#c7d2d6'); px(g, sec.x, sec.y + sec.ch - 3, sec.cols * sec.cw - 4, 1, '#1d2a30');
    sec.items.forEach((type, i) => {
      const x = sec.x + i * sec.cw, cx = x + (sec.cw - 4) / 2, y = sec.y + 12, sea = sec.label === 'HASIL LAUT';
      px(g, x + 3, y + 8, sec.cw - 10, 46, '#1d2a30'); px(g, x + 4, y + 8, sec.cw - 12, 44, '#b6c2c7'); px(g, x + 4, y + 8, sec.cw - 12, 1, '#f1f7f7');
      px(g, x + 8, y + 12, sec.cw - 20, 36, sea ? '#d9f0f4' : '#e8dcc6');
      if (sea) for (let n = 0; n < 90; n++) px(g, x + 8 + noise(n, i + 2) * (sec.cw - 22), y + 12 + noise(i + 5, n) * 34, 2, 2, n % 3 ? '#f8ffff' : '#a9d6e0');
      else for (let n = 0; n < 5; n++) px(g, x + 8, y + 18 + n * 6, sec.cw - 20, 1, '#d4c5aa');
      paintWhole(g, type, Math.round(cx), y + 30);
      const nameW = textW(STORE_NAMES[type]) + 6;
      px(g, Math.round(cx - nameW / 2), sec.y + 65, nameW, 9, '#f4efe2'); px(g, Math.round(cx - nameW / 2), sec.y + 73, nameW, 1, '#6f7c82');
      txtC(g, STORE_NAMES[type], cx, sec.y + 67, '#24404a');
    });
  });
}
function paintFreshPanel(g) {
  const { w, h } = STORE_PANEL;
  px(g, 0, 0, w, h, '#2a1c17'); px(g, 2, 2, w - 4, h - 4, '#7c5338'); px(g, 2, 2, w - 4, 1, '#c79d70');
  for (let y = 24; y < h - 6; y++) px(g, 8, y, w - 16, 1, (y - 24) % 22 === 0 ? '#2c1d1b' : pick(['#5b3d2c', '#523626', '#4a3023'], noise(3, Math.floor((y - 24) / 22))));
  px(g, 336, 24, 3, h - 30, '#2c1d1b');
  STORES.fresh.sections.forEach(sec => {
    txt(g, sec.label, sec.x + 4, sec.y - 9, '#ffe9bd');
    const fruit = sec.label === 'BUAH';
    sec.items.forEach((type, i) => {
      const x = sec.x + (i % sec.cols) * sec.cw, y = sec.y + Math.floor(i / sec.cols) * sec.ch, cw = sec.cw - 4, cx = Math.round(x + cw / 2), base = y + 36;
      g.globalAlpha = 0.35; ell(g, cx, y + 68, cw / 2, 4, '#120d10'); g.globalAlpha = 1;
      if (fruit) { ell(g, cx, y + 46, cw / 2 - 1, 23, '#4a3019'); ell(g, cx, y + 44, cw / 2 - 2, 22, '#a97c42'); ell(g, cx, y + 40, cw / 2 - 6, 17, '#3d2815'); }
      else { px(g, x + 3, y + 12, cw - 6, 56, '#3d2815'); px(g, x + 4, y + 13, cw - 8, 54, '#6a4629'); px(g, x + 4, y + 13, cw - 8, 2, '#8a6240'); }
      const [fw] = FOOD_SIZE[type];
      if (fw < 34) { paintWhole(g, type, cx - 11, base - 9); paintWhole(g, type, cx + 11, base - 9); paintWhole(g, type, cx - 11, base + 8); paintWhole(g, type, cx + 11, base + 8); }
      else { paintWhole(g, type, cx, base - 9); paintWhole(g, type, cx, base + 9); }
      paintWhole(g, type, cx, base);
      if (fruit) { for (let a = 0.25; a < 2.9; a += 0.08) px(g, cx + Math.cos(a) * (cw / 2 - 2), y + 45 + Math.sin(a) * 21, 2, 2, a * 9 % 2 > 1 ? '#c99a58' : '#8a5f32'); }
      else [0, 11].forEach(n => { px(g, x + 3, y + 55 + n, cw - 6, 7, '#2c1d13'); px(g, x + 4, y + 55 + n, cw - 8, 6, n ? '#a97c52' : '#c0925f'); px(g, x + 4, y + 55 + n, cw - 8, 1, '#e0bd8e'); });
      px(g, cx - textW(STORE_NAMES[type]) / 2 - 3, y + 70, textW(STORE_NAMES[type]) + 6, 9, '#efe2c5');
      txtC(g, STORE_NAMES[type], cx, y + 72, '#4a2f22');
    });
  });
}
function paintStoreDoors(g) {
  // Pintu kulkas baja.
  const a = STORES.cold.door;
  px(g, a.x - 2, a.y - 1, a.w + 4, a.h + 2, '#14171b');
  for (let y = a.y; y < a.y + a.h; y++) px(g, a.x, y, a.w, 1, pick(['#7f8b92', '#737f87', '#68747c', '#5c6870'], (y - a.y) / a.h));
  px(g, a.x, a.y, a.w, 1, '#d8e2e5');
  px(g, a.x + 72, a.y + 8, 160, 34, '#1d2a30');
  for (let y = 0; y < 32; y++) px(g, a.x + 73, a.y + 9 + y, 158, 1, pick(['#d9f3f7', '#a9dbe6', '#6f9eab', '#4d7884'], y / 32));
  [[92, 28], [122, 24], [160, 28], [198, 22]].forEach(([x, n], i) => { g.save(); g.translate(a.x + x, a.y + n); g.scale(0.55, 0.55); paintWhole(g, ['beef', 'ayam', 'ikan', 'udang'][i], 0, 0); g.restore(); });
  for (let i = 0; i < 40; i++) px(g, a.x + 74 + noise(i, 3) * 154, a.y + 10 + noise(5, i) ** 2 * 26, 3, 1, 'rgba(245,253,255,.6)');
  px(g, a.x + 248, a.y + 8, 6, 40, '#262b31'); px(g, a.x + 249, a.y + 9, 4, 38, '#c7d0d3'); px(g, a.x + 249, a.y + 9, 1, 38, '#f6fafa');
  px(g, a.x + 12, a.y + 16, 48, 16, '#efe6d2'); px(g, a.x + 12, a.y + 31, 48, 1, '#8f8368'); txtC(g, 'DAGING', a.x + 36, a.y + 22, '#3f5a64');

  // Pintu rak kayu berkisi.
  const b = STORES.fresh.door;
  px(g, b.x - 2, b.y - 1, b.w + 4, b.h + 2, '#1a1411');
  px(g, b.x, b.y, b.w, b.h, '#6f8a5f'); px(g, b.x, b.y, b.w, 1, '#a9c08e'); px(g, b.x, b.y + b.h - 2, b.w, 2, '#3f5240');
  px(g, b.x + 72, b.y + 8, 160, 34, '#2c1d13');
  [[92, 'tomat'], [120, 'wortel'], [152, 'kol'], [182, 'mangga'], [210, 'jeruk']].forEach(([x, type]) => { g.save(); g.translate(b.x + x, b.y + 25); g.scale(0.62, 0.62); paintWhole(g, type, 0, 0); g.restore(); });
  for (let i = 0; i < 4; i++) { px(g, b.x + 72, b.y + 10 + i * 8, 160, 3, '#8a6a42'); px(g, b.x + 72, b.y + 10 + i * 8, 160, 1, '#c9a673'); }
  px(g, b.x + 248, b.y + 22, 16, 5, '#2c1d13'); px(g, b.x + 249, b.y + 22, 14, 3, '#d7ad5e'); px(g, b.x + 249, b.y + 22, 14, 1, '#ffe8aa');
  px(g, b.x + 12, b.y + 16, 50, 16, '#efe6d2'); px(g, b.x + 12, b.y + 31, 50, 1, '#8f8368'); txtC(g, 'SAYUR', b.x + 37, b.y + 19, '#46604a'); txtC(g, 'BUAH', b.x + 37, b.y + 25, '#a8561f');
}
