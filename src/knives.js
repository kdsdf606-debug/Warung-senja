// Empat pisau dapur chef. Tiap pisau punya bahan andalan, kecepatan, dan kerapian sendiri.

const KNIFE_GROUP = {
  beef: 'meat', ayam: 'meat', kambing: 'meat', bebek: 'meat',
  ikan: 'sea', udang: 'sea', cumi: 'sea', kepiting: 'sea',
  chili: 'veg', shallot: 'veg', bawangputih: 'veg', tomat: 'veg', wortel: 'veg', kentang: 'veg', kol: 'veg', terong: 'veg',
  banana: 'fruit', mangga: 'fruit', jeruk: 'fruit', nanas: 'fruit',
};
const KNIFE_LEVELS = {
  best: { speed: 1.7, neat: 1, label: 'SANGAT COCOK' },
  ok: { speed: 1, neat: 0.94, label: 'BISA' },
  bad: { speed: 0.6, neat: 0.5, label: 'KURANG COCOK' },
};
const KNIVES = {
  cleaver: { name: 'GOLOK DAGING', use: 'DAGING', sound: 'chopHeavy', hit: { x: 478, y: 116, w: 33, h: 82 }, fit: { meat: 'best', sea: 'ok', veg: 'bad', fruit: 'bad' } },
  knife: { name: 'PISAU KOKI', use: 'SEMUA BAHAN', sound: 'chop', hit: { x: 511, y: 116, w: 23, h: 82 }, fit: { meat: 'ok', sea: 'ok', veg: 'ok', fruit: 'ok' } },
  fillet: { name: 'PISAU FILET', use: 'IKAN DAN SEAFOOD', sound: 'chopFine', hit: { x: 534, y: 116, w: 19, h: 82 }, fit: { meat: 'ok', sea: 'best', veg: 'bad', fruit: 'bad' } },
  nakiri: { name: 'PISAU NAKIRI', use: 'SAYUR DAN BUAH', sound: 'chopCrisp', hit: { x: 553, y: 116, w: 28, h: 82 }, fit: { meat: 'bad', sea: 'bad', veg: 'best', fruit: 'best' } },
};
const knifeFit = (id, type) => KNIFE_LEVELS[(KNIVES[id] || KNIVES.knife).fit[KNIFE_GROUP[type]] || 'ok'];
const bestKnife = type => Object.keys(KNIVES).find(id => KNIVES[id].fit[KNIFE_GROUP[type]] === 'best') || 'knife';

Object.assign(TOOL_DEFS.knife, { home: [522, 142], name: 'PISAU KOKI - SEMUA BAHAN' });
TOOL_DEFS.cleaver = { v: LEFT, home: [492, 142], rest: 0, name: 'GOLOK DAGING - UNTUK DAGING', w: 30, h: 74, ax: 11, ay: 26 };
TOOL_DEFS.fillet = { v: LEFT, home: [543, 142], rest: 0, name: 'PISAU FILET - IKAN DAN SEAFOOD', w: 14, h: 82, ax: 7, ay: 26 };
TOOL_DEFS.nakiri = { v: LEFT, home: [564, 142], rest: 0, name: 'PISAU NAKIRI - SAYUR DAN BUAH', w: 22, h: 74, ax: 11, ay: 26 };

// Gambar pisau saat tergantung di rel.
function paintKnifeRack(id, g) {
  if (id === 'cleaver') {
    for (let y = 0; y < 22; y++) { px(g, 7, y, 8, 1, '#17110f'); px(g, 8, y, 6, 1, y % 5 === 2 ? '#3a2d30' : '#2c2226'); px(g, 8, y, 1, 1, '#5b4a4e'); }
    [5, 15].forEach(y => { px(g, 10, y, 2, 2, '#d7ad5e'); px(g, 10, y, 1, 1, '#ffe8aa'); });
    px(g, 6, 22, 10, 3, '#26232a'); px(g, 7, 22, 8, 2, '#a6a8ae'); px(g, 7, 22, 8, 1, '#e8e6e0');
    for (let y = 25; y < 72; y++) {
      const cut = y > 68 ? y - 68 : 0;
      px(g, 2, y, 26 - cut, 1, '#26232a');
      for (let x = 3; x < 27 - cut; x++) {
        const k = (x - 3) / 23;
        px(g, x, y, 1, 1, k > 0.86 ? '#f6f3ea' : k > 0.74 ? '#c9ccd1' : (x * 2 + y) % 31 < 4 ? '#a9adb3' : k < 0.12 ? '#6d7079' : '#8f939b');
      }
    }
    ell(g, 21, 31, 2, 2, '#2a2428'); px(g, 20, 30, 1, 1, '#55525a');
    return;
  }
  if (id === 'fillet') {
    for (let y = 0; y < 23; y++) { const half = y < 2 || y > 20 ? 3 : 4; px(g, 7 - half, y, half * 2, 1, '#14312d'); px(g, 8 - half, y, half * 2 - 2, 1, y % 4 === 1 ? '#2f6a60' : '#3c8074'); px(g, 8 - half, y, 1, 1, '#79b7a8'); }
    px(g, 3, 23, 8, 3, '#26232a'); px(g, 4, 23, 6, 2, '#b4b6bc'); px(g, 4, 23, 6, 1, '#efece6');
    for (let y = 26; y < 82; y++) {
      const k = (y - 26) / 55, width = Math.max(1, Math.round(5 * (1 - k) ** 0.75)), bend = Math.round(Math.sin(k * Math.PI) * 1.4), left = 5 + bend;
      px(g, left - 1, y, width + 2, 1, '#2b2a33');
      for (let c = 0; c < width; c++) px(g, left + c, y, 1, 1, c === width - 1 ? '#fbf7ee' : c === 0 ? '#7e828c' : '#c2c5ca');
    }
    return;
  }
  if (id === 'nakiri') {
    for (let y = 0; y < 19; y++) { px(g, 7, y, 8, 1, '#6a5234'); px(g, 8, y, 6, 1, y % 6 === 3 ? '#c9ae80' : '#dcc598'); px(g, 8, y, 2, 1, '#f1e2bf'); px(g, 13, y, 1, 1, '#a88c60'); }
    px(g, 6, 19, 10, 6, '#120d10'); px(g, 7, 20, 8, 4, '#2c2226'); px(g, 8, 20, 2, 3, '#51454a');
    for (let y = 25; y < 72; y++) {
      px(g, 2, y, 18, 1, '#26232a');
      for (let x = 3; x < 19; x++) {
        const dark = x < 9, dimple = dark && (x * 7 + y * 3) % 11 === 0;
        px(g, x, y, 1, 1, x > 16 ? '#fbf7ee' : x > 14 ? '#c7cacf' : dark ? (dimple ? '#4a4850' : '#34323a') : (x + y) % 23 < 3 ? '#b4b7bd' : '#989ca4');
      }
    }
    px(g, 2, 71, 18, 1, '#26232a');
  }
}

// Gambar pisau dari atas saat dipegang untuk mengiris.
function paintKnifeHeld(id, g) {
  const look = {
    cleaver: { top: 14, thick: () => 4, handle: ['#5b4a4e', '#2c2226', '#17110f'], collar: '#a6a8ae' },
    fillet: { top: 0, thick: t => Math.max(1, Math.round(2 * Math.min(1, t / 0.8))), handle: ['#79b7a8', '#3c8074', '#1f4a43'], collar: '#b4b6bc' },
    nakiri: { top: 8, thick: () => 3, handle: ['#f1e2bf', '#d8c094', '#a88c60'], collar: '#2c2226' },
  }[id];
  for (let y = look.top; y < 58; y++) {
    const t = (y - look.top + 1) / (58 - look.top), thick = look.thick(t);
    px(g, 5, y, thick + 2, 1, '#2b2a33');
    for (let c = 0; c < thick; c++) px(g, 6 + c, y, 1, 1, c === 0 ? '#fbf7ee' : c === 1 ? '#b9bcc2' : '#747883');
  }
  px(g, 4, 58, 8, 5, '#26232a'); px(g, 5, 58, 6, 4, look.collar); px(g, 5, 58, 6, 1, id === 'nakiri' ? '#51454a' : '#e8e6e0');
  for (let y = 63; y < 93; y++) {
    const k = (y - 63) / 29, half = Math.round((id === 'cleaver' ? 3.2 : 2.5) + 1.3 * Math.sin(Math.PI * Math.min(1, k * 0.92))) - (y > 90 ? 1 : 0);
    px(g, 7 - half - 1, y, half * 2 + 3, 1, '#1b1316');
    for (let i = -half; i <= half; i++) {
      const v = (i + half) / Math.max(1, half * 2);
      px(g, 7 + i, y, 1, 1, v < 0.25 ? look.handle[0] : v < 0.68 ? look.handle[1] : look.handle[2]);
    }
  }
  px(g, 5, 93, 5, 1, '#1b1316');
}
