// Bumbu di rak dinding: tiap wadah punya bentuk, isi, tutup, nama, dan rasa sendiri.

const JAR_SHAPES = { jar: { rx: 11, h: 26 }, round: { rx: 12, h: 24 }, tall: { rx: 8, h: 28 }, tin: { rx: 11, h: 22 }, clay: { rx: 12, h: 22 }, squat: { rx: 13, h: 18 } };
const JAR_LIDS = { wood: ['#5f3e2a', '#8a5c3c', '#b88a5e'], cork: ['#7d5c3a', '#c49a66', '#e2c08e'], metal: ['#4b4951', '#8d8b90', '#d7d5d3'] };

const spiceRow = (list, v, base, xAt) => list.map(([id, name, taste, c, c2, shape, fill, lid], i) => ({
  id, name, taste, c, c2, shape, fill, lid, v, base, x: xAt(i), ...JAR_SHAPES[shape], rx: Math.min(11, JAR_SHAPES[shape].rx),
}));

const SPICE_COLUMN = i => 26 + i * 26;
const SPICES = [
  // Rak atas: bubuk dan biji.
  ...spiceRow([
    ['lada', 'LADA', 'PEDAS', '#2f2926', '#5a4d44', 'round', 'seeds', 'cork'],
    ['ketumbar', 'KETUMBAR', 'HARUM', '#b89a63', '#d8c08a', 'jar', 'seeds', 'wood'],
    ['pala', 'PALA', 'HANGAT', '#a57c4e', '#6f4a2c', 'clay', 'chunks', 'cloth'],
    ['kemiri', 'KEMIRI', 'GURIH', '#e5d6b4', '#bfa67c', 'jar', 'chunks', 'cork'],
    ['kaldu', 'KALDU', 'GURIH', '#d9b56a', '#f0d893', 'tin', 'powder', 'metal'],
    ['cabe', 'CABE BUBUK', 'PEDAS', '#c23a2e', '#e8734f', 'tall', 'powder', 'metal'],
  ], RIGHT, 46, SPICE_COLUMN),
  // Rak tengah: manis, asam, dan gurih.
  ...spiceRow([
    ['gula', 'GULA', 'MANIS', '#f3ecdc', '#cfc6b4', 'squat', 'crystal', 'metal'],
    ['gulamerah', 'GULA MERAH', 'MANIS', '#6c3429', '#94563a', 'tin', 'chunks', 'metal'],
    ['kayumanis', 'KAYU MANIS', 'MANIS', '#8f5a35', '#b9794a', 'tall', 'sticks', 'cork'],
    ['asam', 'ASAM JAWA', 'SEGAR', '#5b2a20', '#8a4a33', 'round', 'chunks', 'wood'],
    ['terasi', 'TERASI', 'GURIH', '#6f3a2e', '#9a5b47', 'clay', 'powder', 'cloth'],
    ['bawanggoreng', 'BAWANG GORENG', 'GURIH', '#b9803c', '#e0b060', 'jar', 'flakes', 'wood'],
    ['santan', 'SANTAN', 'GURIH', '#f6f0e2', '#e3d8c2', 'tin', 'powder', 'metal'],
    ['kacang', 'KACANG', 'GURIH', '#c89a58', '#9a6f35', 'round', 'chunks', 'wood'],
  ], RIGHT, 83, SPICE_COLUMN),
  // Rak bawah: akar dan daun.
  ...spiceRow([
    ['kunyit', 'KUNYIT', 'HANGAT', '#e0a02f', '#f4cb62', 'round', 'powder', 'wood'],
    ['jahe', 'JAHE', 'HANGAT', '#d7bd7c', '#a98a52', 'clay', 'chunks', 'cloth'],
    ['lengkuas', 'LENGKUAS', 'HARUM', '#d9bd85', '#a88455', 'jar', 'chunks', 'cork'],
    ['serai', 'SERAI', 'SEGAR', '#9aa866', '#c8cf8f', 'tall', 'sticks', 'cork'],
    ['salam', 'DAUN SALAM', 'HARUM', '#5d7a56', '#8aa577', 'jar', 'leaves', 'cork'],
    ['jeruk', 'DAUN JERUK', 'SEGAR', '#4f7350', '#7fa070', 'round', 'leaves', 'wood'],
  ], RIGHT, 120, SPICE_COLUMN),
];
const SPICE_BY_ID = Object.fromEntries(SPICES.map(sp => [sp.id, sp]));

// Bumbu disimpan di dua lemari bawah meja kompor.
STORES.spiceA = {
  v: RIGHT, title: 'LEMARI BUMBU', door: { x: 8, y: 301, w: 304, h: 56 }, spices: true,
  sections: [
    { label: 'BUBUK DAN BIJI', x: 18, y: 38, cols: 5, cw: 93, ch: 90, items: ['lada', 'ketumbar', 'pala', 'kemiri', 'cabe'] },
    { label: 'GURIH DAN MANIS', x: 18, y: 134, cols: 5, cw: 93, ch: 88, items: ['kaldu', 'gula', 'gulamerah', 'kayumanis', 'santan'] },
  ],
};
STORES.spiceB = {
  v: RIGHT, title: 'LEMARI REMPAH', door: { x: 328, y: 301, w: 304, h: 56 }, spices: true,
  sections: [
    { label: 'AKAR DAN REMPAH', x: 18, y: 38, cols: 5, cw: 93, ch: 90, items: ['kunyit', 'jahe', 'lengkuas', 'serai', 'asam'] },
    { label: 'DAUN DAN PELENGKAP', x: 18, y: 134, cols: 5, cw: 93, ch: 88, items: ['salam', 'jeruk', 'terasi', 'bawanggoreng', 'kacang'] },
  ],
};
const SPICE_STORE = {};
['spiceA', 'spiceB'].forEach(id => STORES[id].sections.forEach(sec => sec.items.forEach(type => { SPICE_STORE[type] = id; STORE_OF[type] = id; STORE_NAMES[type] = SPICE_BY_ID[type].name; })));

function paintSpicePanel(g, id) {
  const { w, h } = STORE_PANEL;
  px(g, 0, 0, w, h, '#241813'); px(g, 2, 2, w - 4, h - 4, '#6b4631'); px(g, 2, 2, w - 4, 1, '#b08660');
  for (let y = 24; y < h - 6; y++) {
    const row = Math.floor((y - 24) / 16);
    px(g, 8, y, w - 16, 1, (y - 24) % 16 === 0 ? '#2a1b16' : pick(['#4a3023', '#44291f', '#3e261c'], noise(row, 5)));
  }
  STORES[id].sections.forEach(sec => {
    const plank = sec.y + 64, wide = sec.cols * sec.cw;
    txt(g, sec.label, sec.x + 4, sec.y - 9, '#ffe9bd');
    g.globalAlpha = 0.35; px(g, sec.x, plank + 5, wide - 4, 3, '#120d10'); g.globalAlpha = 1;
    px(g, sec.x, plank, wide - 4, 5, '#2c1d13'); px(g, sec.x, plank, wide - 4, 4, '#a57a54'); px(g, sec.x, plank, wide - 4, 1, '#d7ad7e');
    sec.items.forEach((type, i) => {
      const spice = SPICE_BY_ID[type], cx = sec.x + i * sec.cw + Math.round((sec.cw - 4) / 2), name = spice.name, tw = textW(name) + 6;
      g.globalAlpha = 0.35; ell(g, cx + 2, plank, 21, 3, '#120d10'); g.globalAlpha = 1;
      g.save(); g.translate(cx, plank); g.scale(1.6, 1.6); paintSpiceJar(g, spice, 0, 0); g.restore();
      px(g, Math.round(cx - tw / 2), plank + 7, tw, 9, '#efe2c5'); px(g, Math.round(cx - tw / 2), plank + 15, tw, 1, '#8f7f68');
      txtC(g, name, cx, plank + 9, '#4a2f22');
    });
  });
}
function paintSpiceDoors(g) {
  ['spiceA', 'spiceB'].forEach((id, n) => {
    const d = STORES[id].door, list = STORES[id].sections.flatMap(sec => sec.items).slice(0, 7);
    px(g, d.x - 2, d.y - 1, d.w + 4, d.h + 2, '#141c18');
    for (let y = d.y; y < d.y + d.h; y++) px(g, d.x, y, d.w, 1, pick(['#46624f', '#3f5a48', '#385141', '#31483a'], (y - d.y) / d.h));
    px(g, d.x, d.y, d.w, 1, '#7f9c82');
    px(g, d.x + 70, d.y + 6, 164, 39, '#1d1512'); px(g, d.x + 72, d.y + 8, 160, 35, '#4a3023');
    px(g, d.x + 72, d.y + 37, 160, 3, '#a57a54'); px(g, d.x + 72, d.y + 37, 160, 1, '#d7ad7e');
    list.forEach((type, i) => { g.save(); g.translate(d.x + 86 + i * 22, d.y + 37); g.scale(0.92, 0.92); paintSpiceJar(g, SPICE_BY_ID[type], 0, 0); g.restore(); });
    g.globalAlpha = 0.16;
    for (let i = 0; i < 3; i++) poly(g, [[d.x + 94 + i * 52, d.y + 8], [d.x + 108 + i * 52, d.y + 8], [d.x + 88 + i * 52, d.y + 43], [d.x + 74 + i * 52, d.y + 43]], '#eaf6f2');
    g.globalAlpha = 1;
    const hx = n ? d.x + 248 : d.x + 248;
    px(g, hx, d.y + 22, 16, 5, '#2c1d13'); px(g, hx + 1, d.y + 22, 14, 3, '#d7ad5e'); px(g, hx + 1, d.y + 22, 14, 1, '#ffe8aa');
    px(g, d.x + 12, d.y + 16, 50, 16, '#efe6d2'); px(g, d.x + 12, d.y + 31, 50, 1, '#8f8368');
    txtC(g, n ? 'REMPAH' : 'BUMBU', d.x + 37, d.y + 22, '#6c3429');
  });
}

function jarHalf(sp, j) {
  const k = j / Math.max(1, sp.h - 1), r = sp.rx;
  if (sp.shape === 'round') return Math.max(5, Math.round(r * Math.sqrt(Math.max(0.2, 1 - ((k - 0.58) / 0.66) ** 2))));
  if (sp.shape === 'tall') return j < 6 ? Math.max(3, r - 4 + Math.floor(j * 0.7)) : r;
  if (sp.shape === 'clay') return Math.round(r * (0.7 + 0.3 * Math.sin(Math.PI * k)));
  if (sp.shape === 'jar') return j < 3 ? r - 3 : j >= sp.h - 1 ? r - 1 : r;
  return j >= sp.h - 1 ? r - 1 : r;
}
function spicePixel(sp, i, j) {
  const a = i + 30, n = noise(a, j + 7);
  if (sp.fill === 'seeds') return (a + j * 2) % 3 === 0 ? sp.c2 : sp.c;
  if (sp.fill === 'leaves') return (a + j) % 5 < 2 ? sp.c2 : n > 0.82 ? '#2c4a34' : sp.c;
  if (sp.fill === 'sticks') return a % 3 === 0 ? sp.c2 : a % 3 === 2 && n > 0.5 ? '#2a1a17' : sp.c;
  if (sp.fill === 'chunks') return ((a >> 1) + (j >> 1)) % 2 ? sp.c : sp.c2;
  if (sp.fill === 'flakes') return noise(a * 3, j) > 0.55 ? sp.c2 : sp.c;
  if (sp.fill === 'crystal') return n > 0.8 ? '#ffffff' : n < 0.25 ? sp.c2 : sp.c;
  return n > 0.7 ? sp.c2 : sp.c;
}
function paintSpiceJar(g, sp, x = sp.x, base = sp.base) {
  const top = base - sp.h, opaque = sp.shape === 'tin' || sp.shape === 'clay';
  for (let j = 0; j < sp.h; j++) {
    const half = jarHalf(sp, j), y = top + j;
    px(g, x - half - 1, y, half * 2 + 3, 1, '#231a1c');
    for (let i = -half; i <= half; i++) {
      const v = (i + half) / Math.max(1, half * 2);
      let color;
      if (sp.shape === 'tin') color = j > 3 && j < 7 || j > sp.h - 5 ? '#c5c2bf' : v < 0.22 ? '#ece8e2' : v < 0.68 ? '#9d9a9e' : '#5f5d66';
      else if (sp.shape === 'clay') color = j < 4 ? '#c98a62' : v < 0.24 ? '#c97e58' : v < 0.68 ? '#9c5a3e' : '#693a2b';
      else color = j < 4 ? '#8fa19f' : spicePixel(sp, i, j);
      px(g, x + i, y, 1, 1, color);
    }
    if (!opaque && j >= 2 && j < sp.h - 2) {
      px(g, x - half + 1, y, 2, 1, 'rgba(240,248,245,.5)');
      px(g, x + half - 1, y, 2, 1, 'rgba(25,18,24,.34)');
    }
  }
  if (opaque) {
    // Jendela label menampilkan isi kaleng atau gentong.
    const w = sp.rx - 2, y0 = top + 8, h = Math.min(9, sp.h - 12);
    px(g, x - w - 1, y0 - 1, w * 2 + 3, h + 2, '#efe2c5');
    for (let j = 0; j < h; j++) for (let i = -w + 1; i < w; i++) px(g, x + i, y0 + j, 1, 1, spicePixel(sp, i, j));
  } else {
    px(g, x - Math.min(5, sp.rx - 2), top + Math.round(sp.h * 0.5), Math.min(5, sp.rx - 2) * 2 + 1, 1, 'rgba(255,245,225,.42)');
  }
  const lidHalf = jarHalf(sp, 0) + 1;
  if (sp.lid === 'cloth') {
    px(g, x - lidHalf - 1, top - 3, lidHalf * 2 + 3, 5, '#2b2024');
    px(g, x - lidHalf, top - 3, lidHalf * 2 + 1, 4, sp.c2); px(g, x - lidHalf, top - 3, lidHalf * 2 + 1, 1, '#efe2c5');
    px(g, x - lidHalf, top + 2, lidHalf * 2 + 1, 1, '#b9483a'); px(g, x + lidHalf - 2, top + 3, 2, 3, '#b9483a');
  } else {
    const [dark, mid, light] = JAR_LIDS[sp.lid] || JAR_LIDS.wood, tall = sp.lid === 'cork' ? 5 : 4;
    px(g, x - lidHalf - 1, top - tall + 1, lidHalf * 2 + 3, tall + 1, '#231a1c');
    px(g, x - lidHalf, top - tall + 1, lidHalf * 2 + 1, tall, mid);
    px(g, x - lidHalf, top - tall + 1, lidHalf * 2 + 1, 1, light); px(g, x + lidHalf - 2, top - tall + 2, 3, tall - 1, dark);
    if (sp.lid === 'metal') for (let i = -lidHalf + 2; i < lidHalf; i += 2) px(g, x + i, top - 1, 1, 1, dark);
  }
}

// Isi bumbu disimpan sebagai { id: jumlah } pada wajan, panci, piring, mangkuk, atau gelas.
function spiceEntries(map) {
  return Object.entries(map || {}).filter(([id, n]) => SPICE_BY_ID[id] && n > 0.02).sort((a, b) => b[1] - a[1]);
}
function tasteText(map) {
  const sums = {};
  spiceEntries(map).forEach(([id, n]) => { const t = SPICE_BY_ID[id].taste; sums[t] = (sums[t] || 0) + n; });
  return Object.entries(sums).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => t).join(' + ');
}
function spiceNames(map, limit = 3) {
  const list = spiceEntries(map), names = list.slice(0, limit).map(([id]) => SPICE_BY_ID[id].name);
  return names.join(', ') + (list.length > limit ? ' +' + (list.length - limit) : '');
}
function mergeSpices(into, from) {
  if (!from || !from.spices) return;
  into.spices = into.spices || {};
  Object.entries(from.spices).forEach(([id, n]) => { into.spices[id] = Math.max(into.spices[id] || 0, n); });
}
function cleanSpices(host) {
  if (!host) return;
  const raw = host.spices && typeof host.spices === 'object' ? host.spices : {};
  host.spices = {};
  Object.entries(raw).forEach(([id, n]) => { if (SPICE_BY_ID[id] && Number.isFinite(n)) host.spices[id] = Math.max(0, Math.min(1, n)); });
}
function drawSpiceSpecks(g, map, x, y, rx, ry) {
  spiceEntries(map).forEach(([id, n], i) => {
    const count = 2 + Math.round(n * 9);
    for (let j = 0; j < count; j++) {
      const a = noise(i + 3, j) * 6.28, r = Math.sqrt(noise(j, i + 9));
      px(g, Math.round(x + Math.cos(a) * rx * r), Math.round(y + Math.sin(a) * ry * r), 1, 1, SPICE_BY_ID[id].c);
    }
  });
}
