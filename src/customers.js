// Pengacak tampilan pelanggan: tiap bagian wajah dan pakaian dipilih dari daftar.

const LOOK = {
  skin: [['#f3cfa8', '#d9a97f', '#ffe3c4'], ['#e8bb8c', '#c9956a', '#f7d4ac'], ['#d9a273', '#b67f54', '#ecbf92'], ['#c58a5a', '#a06c43', '#dda677'], ['#a86f45', '#845333', '#c68c60'], ['#845233', '#633b24', '#a26d48']],
  hairColor: [['#1f1a1e', '#100d10', '#3d343a', 'HITAM'], ['#3a2620', '#241713', '#5c3d31', 'COKELAT TUA'], ['#6b4228', '#4a2c1a', '#91603c', 'COKELAT'], ['#a8682f', '#7c4a20', '#d0914c', 'KARAMEL'], ['#8f8c90', '#67646a', '#bdbabd', 'UBAN'], ['#7a2f2a', '#54201d', '#a84a3f', 'MERAH BATA'], ['#34425f', '#232e45', '#52658a', 'BIRU GELAP']],
  hair: ['CEPAK', 'PENDEK', 'BELAH TENGAH', 'KERITING', 'GONDRONG', 'BOB', 'PANJANG', 'KUNCIR', 'SANGGUL', 'HIJAB', 'PECI'],
  clothes: ['KAOS', 'KEMEJA', 'BATIK', 'HOODIE', 'JAKET', 'BAJU MELAYU', 'KAOS GARIS'],
  clothColor: [['#8f3a2e', '#6c2a22', '#b85545', 'BATA'], ['#4b6a60', '#34504a', '#6b8f80', 'HIJAU TUA'], ['#34507a', '#25395a', '#5075a6', 'BIRU'], ['#c9912f', '#9c6f20', '#e8b65a', 'KUNYIT'], ['#6c4a78', '#4f3459', '#8f6a9c', 'UNGU'], ['#d8cdb5', '#aca18a', '#f2e9d6', 'KREM'], ['#3a3840', '#26252b', '#5a5862', 'ARANG'], ['#b5683f', '#8a4a2e', '#d68c5e', 'TERAKOTA'], ['#5d8f9a', '#437079', '#83b4bd', 'TOSCA']],
  eyes: ['BULAT', 'SIPIT', 'BESAR', 'MENGANTUK', 'RAMAH', 'TAJAM'],
  nose: ['KECIL', 'SEGITIGA', 'LEBAR', 'MANCUNG', 'BULAT'],
  mouth: ['SENYUM', 'DATAR', 'TERTAWA', 'KECIL', 'MIRING', 'BIBIR PENUH'],
  face: ['OVAL', 'BULAT', 'KOTAK'],
  extra: ['TANPA', 'TANPA', 'TANPA', 'TANPA', 'KACAMATA', 'KUMIS', 'JENGGOT'],
};

function seededRandom(seed) {
  let t = seed >>> 0;
  return () => { t = (t + 0x6d2b79f5) >>> 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
}
function randomLook(seed) {
  const rnd = seededRandom(seed), any = list => Math.floor(rnd() * list.length);
  const look = { seed };
  ['skin', 'hairColor', 'hair', 'clothes', 'clothColor', 'eyes', 'nose', 'mouth', 'face', 'extra'].forEach(k => { look[k] = any(LOOK[k]); });
  look.scarf = any(LOOK.clothColor);
  const hair = LOOK.hair[look.hair];
  if (hair === 'HIJAB' && LOOK.extra[look.extra] !== 'KACAMATA') look.extra = 0;
  if (hair === 'PECI' && look.hairColor > 2) look.hairColor = 0;
  return look;
}
function lookText(look) {
  return { rambut: LOOK.hair[look.hair], warna: LOOK.hairColor[look.hairColor][3], baju: LOOK.clothes[look.clothes], bajuWarna: LOOK.clothColor[look.clothColor][3], mata: LOOK.eyes[look.eyes], hidung: LOOK.nose[look.nose], mulut: LOOK.mouth[look.mouth], tambahan: LOOK.extra[look.extra] };
}
const lookCombos = () => ['skin', 'hairColor', 'hair', 'clothes', 'clothColor', 'eyes', 'nose', 'mouth', 'face'].reduce((n, k) => n * LOOK[k].length, 1);

const CHAR_W = 72, CHAR_H = 84, HEAD_TOP = 20, HEAD_H = 33;
function faceHalf(faceType, j) {
  let half = 15;
  if (j < 6) half -= (6 - j) ** 2 * 0.2;
  if (faceType === 0 && j > 20) half -= (j - 20) ** 2 * 0.075;
  if (faceType === 1 && j > 23) half -= (j - 23) ** 2 * 0.1;
  if (faceType === 2 && j > 27) half -= (j - 27) ** 2 * 0.28;
  return Math.max(4, Math.round(half));
}
function mirror(g, cx, dx, y, w, h, c) { px(g, cx - dx - w + 1, y, w, h, c); px(g, cx + dx, y, w, h, c); }

function paintBackHair(g, look, cx) {
  const [c, d, l] = LOOK.hairColor[look.hairColor], style = LOOK.hair[look.hair];
  const strands = (from, to, halfAt) => {
    for (let y = from; y < to; y++) {
      const half = Math.max(2, Math.round(halfAt(y)));
      px(g, cx - half - 1, y, half * 2 + 3, 1, '#120d10');
      for (let i = -half; i <= half; i++) { const n = (i + 40) % 6; px(g, cx + i, y, 1, 1, n === 0 ? d : n === 3 && i < 0 ? l : c); }
    }
  };
  if (style === 'PANJANG') strands(24, 78, y => 19 + Math.sin((y - 24) / 54 * Math.PI) * 3 - Math.max(0, y - 70) ** 2 * 0.2);
  if (style === 'GONDRONG') strands(24, 62, y => 19 - Math.max(0, y - 52) ** 2 * 0.17);
  if (style === 'BOB') strands(24, 56, y => 20 - Math.max(0, y - 46) ** 2 * 0.15);
  if (style === 'KUNCIR') { curve(g, cx + 11, 22, cx + 30, 32, cx + 23, 60, '#120d10', 10); curve(g, cx + 11, 22, cx + 29, 32, cx + 23, 58, c, 7); curve(g, cx + 14, 24, cx + 27, 33, cx + 23, 52, l, 1); }
  if (style === 'SANGGUL') { ell(g, cx, 11, 10, 9, '#120d10'); ell(g, cx, 11, 9, 8, c); ell(g, cx - 3, 8, 4, 2, l); px(g, cx - 8, 15, 16, 1, d); }
}
function paintClothes(g, look, cx) {
  const [c, d, l] = LOOK.clothColor[look.clothColor], type = LOOK.clothes[look.clothes], skin = LOOK.skin[look.skin];
  for (let y = 58; y < CHAR_H; y++) {
    const k = (y - 58) / (CHAR_H - 58), half = Math.round(11 + 24 * Math.min(1, Math.sqrt(k * 1.5)));
    px(g, cx - half - 1, y, half * 2 + 3, 1, '#1c1519');
    for (let i = -half; i <= half; i++) {
      const v = (i + half) / Math.max(1, half * 2);
      let color = v < 0.2 ? l : v > 0.78 ? d : c;
      if (type === 'KAOS GARIS' && (y - 58) % 6 < 2) color = v > 0.78 ? '#b8ad96' : '#efe6d2';
      if (type === 'BATIK') { const a = (i + 60 + (y % 10 < 5 ? 3 : 0)) % 6, b = y % 5; if ((a === 0 && b < 3) || (a === 3 && b === 3)) color = l; if (a === 1 && b === 1) color = '#f0d58d'; if ((a + b) % 7 === 0) color = d; }
      px(g, cx + i, y, 1, 1, color);
    }
  }
  if (type === 'KAOS' || type === 'KAOS GARIS' || type === 'BATIK') { ell(g, cx, 59, 9, 4, d); ell(g, cx, 58, 7, 3, skin[1]); }
  if (type === 'KEMEJA') {
    poly(g, [[cx, 66], [cx - 11, 57], [cx - 7, 54], [cx, 61]], l); poly(g, [[cx, 66], [cx + 11, 57], [cx + 7, 54], [cx, 61]], c);
    px(g, cx, 66, 1, 18, d); [70, 76, 82].forEach(y => px(g, cx + 2, y, 2, 2, '#f2e9d6'));
  }
  if (type === 'HOODIE') {
    ell(g, cx, 60, 17, 7, '#1c1519'); ell(g, cx, 59, 16, 6, d); ell(g, cx, 58, 9, 3, skin[1]);
    mirror(g, cx, 4, 62, 1, 12, '#efe6d2'); poly(g, [[cx - 13, 78], [cx + 13, 78], [cx + 16, 84], [cx - 16, 84]], d);
  }
  if (type === 'JAKET') {
    poly(g, [[cx - 7, 58], [cx + 7, 58], [cx + 5, 84], [cx - 5, 84]], '#efe6d2');
    poly(g, [[cx - 10, 56], [cx - 3, 70], [cx - 7, 84], [cx - 14, 84], [cx - 17, 62]], l); poly(g, [[cx + 10, 56], [cx + 3, 70], [cx + 7, 84], [cx + 14, 84], [cx + 17, 62]], d);
    px(g, cx - 5, 72, 1, 12, '#26232a'); px(g, cx + 5, 72, 1, 12, '#26232a');
  }
  if (type === 'BAJU MELAYU') {
    px(g, cx - 9, 55, 19, 6, '#1c1519'); px(g, cx - 8, 55, 17, 5, l); px(g, cx - 8, 59, 17, 1, d);
    px(g, cx, 60, 1, 24, d); [65, 71, 77].forEach(y => { px(g, cx - 1, y, 3, 2, '#e8c05a'); px(g, cx, y, 1, 1, '#fff2bf'); });
  }
}
function paintHead(g, look, cx) {
  const [skin, shade, light] = LOOK.skin[look.skin];
  px(g, cx - 7, 48, 15, 13, '#1c1519'); px(g, cx - 6, 48, 13, 13, shade); px(g, cx - 6, 48, 8, 11, skin);
  mirror(g, cx, 15, HEAD_TOP + 14, 3, 8, '#1c1519'); mirror(g, cx, 15, HEAD_TOP + 15, 2, 6, shade);
  for (let j = 0; j < HEAD_H; j++) {
    const half = faceHalf(look.face, j), y = HEAD_TOP + j;
    px(g, cx - half - 1, y, half * 2 + 3, 1, '#1c1519');
    for (let i = -half; i <= half; i++) {
      const v = (i + half) / Math.max(1, half * 2);
      px(g, cx + i, y, 1, 1, v > 0.84 ? shade : v < 0.16 && j > 8 ? light : skin);
    }
  }
  px(g, cx - faceHalf(look.face, HEAD_H - 1), HEAD_TOP + HEAD_H, faceHalf(look.face, HEAD_H - 1) * 2 + 1, 1, '#1c1519');
  g.globalAlpha = 0.34; mirror(g, cx, 7, 43, 5, 2, '#d9634f'); g.globalAlpha = 1;
}
function paintEyes(g, look, cx) {
  const type = LOOK.eyes[look.eyes], hair = LOOK.hairColor[look.hairColor][1], y = 37, dx = 6;
  const hijab = LOOK.hair[look.hair] === 'HIJAB';
  const brow = hijab ? '#2a2024' : hair;
  if (type === 'TAJAM') { px(g, cx - dx - 5, y - 6, 3, 1, brow); px(g, cx - dx - 2, y - 5, 3, 2, brow); px(g, cx + dx + 3, y - 6, 3, 1, brow); px(g, cx + dx, y - 5, 3, 2, brow); }
  else if (type === 'RAMAH') { mirror(g, cx, dx, y - 6, 5, 1, brow); mirror(g, cx, dx + 4, y - 5, 1, 1, brow); }
  else mirror(g, cx, dx, y - 5, 5, 2, brow);
  if (type === 'BULAT') { mirror(g, cx, dx, y - 1, 4, 4, '#fff8ee'); mirror(g, cx, dx + 1, y, 2, 3, '#1b1416'); }
  if (type === 'SIPIT') { mirror(g, cx, dx, y + 1, 5, 1, '#1b1416'); mirror(g, cx, dx + 1, y, 3, 1, '#1b1416'); }
  if (type === 'BESAR') { mirror(g, cx, dx, y - 2, 5, 5, '#fff8ee'); mirror(g, cx, dx + 1, y - 1, 3, 4, '#2c1d1a'); px(g, cx - dx - 2, y - 1, 1, 1, '#ffffff'); px(g, cx + dx + 2, y - 1, 1, 1, '#ffffff'); mirror(g, cx, dx, y - 3, 5, 1, '#1b1416'); }
  if (type === 'MENGANTUK') { mirror(g, cx, dx, y, 5, 3, '#fff8ee'); mirror(g, cx, dx + 1, y + 1, 2, 2, '#1b1416'); mirror(g, cx, dx, y - 1, 5, 2, LOOK.skin[look.skin][1]); mirror(g, cx, dx, y, 5, 1, '#1b1416'); }
  if (type === 'RAMAH') { mirror(g, cx, dx, y, 4, 1, '#1b1416'); mirror(g, cx, dx + 3, y + 1, 1, 1, '#1b1416'); px(g, cx - dx, y + 1, 1, 1, '#1b1416'); px(g, cx + dx, y + 1, 1, 1, '#1b1416'); }
  if (type === 'TAJAM') { mirror(g, cx, dx, y, 5, 2, '#fff8ee'); mirror(g, cx, dx + 1, y, 2, 2, '#1b1416'); mirror(g, cx, dx, y - 1, 5, 1, '#1b1416'); }
}
function paintNose(g, look, cx) {
  const type = LOOK.nose[look.nose], [, shade] = LOOK.skin[look.skin], y = 42;
  if (type === 'KECIL') px(g, cx, y + 2, 2, 1, shade);
  if (type === 'SEGITIGA') { px(g, cx + 1, y - 2, 1, 3, shade); px(g, cx - 1, y + 1, 4, 1, shade); }
  if (type === 'LEBAR') { px(g, cx - 3, y + 1, 7, 2, shade); px(g, cx - 3, y, 1, 1, shade); px(g, cx + 3, y, 1, 1, shade); }
  if (type === 'MANCUNG') { px(g, cx + 1, y - 5, 1, 7, shade); px(g, cx, y + 2, 3, 1, shade); px(g, cx, y - 4, 1, 5, LOOK.skin[look.skin][2]); }
  if (type === 'BULAT') { ell(g, cx, y + 1, 3, 2, shade); ell(g, cx - 1, y, 1, 1, LOOK.skin[look.skin][2]); }
}
function paintMouth(g, look, cx) {
  const type = LOOK.mouth[look.mouth], y = 48, lip = look.skin > 3 ? '#4a2520' : '#8a3f38';
  if (type === 'SENYUM') { px(g, cx - 3, y, 7, 1, lip); px(g, cx - 5, y - 1, 2, 1, lip); px(g, cx + 4, y - 1, 2, 1, lip); }
  if (type === 'DATAR') px(g, cx - 3, y, 7, 1, lip);
  if (type === 'TERTAWA') { px(g, cx - 5, y - 1, 11, 1, lip); px(g, cx - 4, y, 9, 3, '#4a1f22'); px(g, cx - 4, y, 9, 1, '#fff8ee'); px(g, cx - 2, y + 2, 5, 1, '#c9564f'); }
  if (type === 'KECIL') { px(g, cx - 1, y, 3, 2, lip); px(g, cx, y, 1, 1, '#c9766a'); }
  if (type === 'MIRING') { px(g, cx - 3, y + 1, 4, 1, lip); px(g, cx + 1, y, 3, 1, lip); px(g, cx + 4, y - 1, 2, 1, lip); }
  if (type === 'BIBIR PENUH') { px(g, cx - 4, y - 1, 9, 2, '#b5514a'); px(g, cx - 3, y + 1, 7, 2, '#cf6f62'); px(g, cx - 4, y + 1, 9, 1, lip); px(g, cx - 1, y + 2, 2, 1, '#eea294'); }
}
function paintFrontHair(g, look, cx) {
  const [c, d, l] = LOOK.hairColor[look.hairColor], style = LOOK.hair[look.hair], top = HEAD_TOP;
  const cap = (rows, line) => {
    for (let j = -4; j < rows; j++) {
      const half = j < 0 ? 12 + j * 2 : Math.min(17, faceHalf(look.face, Math.max(0, j)) + 2), y = top + j;
      px(g, cx - half - 1, y, half * 2 + 3, 1, '#120d10');
      for (let i = -half; i <= half; i++) {
        if (line && j >= line(i)) continue;
        px(g, cx + i, y, 1, 1, (i + j * 2) % 7 === 0 ? d : i < -5 && j < 4 ? l : c);
      }
    }
  };
  const sideCover = (from, to) => {
    for (let y = from; y < to; y++) {
      const w = Math.max(1, Math.round(4 - Math.max(0, y - (to - 7)) * 0.55));
      px(g, cx - 18, y, w + 1, 1, c); px(g, cx - 18, y, 1, 1, l); px(g, cx - 18 + w, y, 1, 1, '#120d10');
      px(g, cx + 18 - w, y, w + 1, 1, c); px(g, cx + 18, y, 1, 1, d); px(g, cx + 18 - w, y, 1, 1, '#120d10');
    }
  };
  if (style === 'CEPAK') cap(8, i => 5 + (Math.abs(i) > 11 ? 3 : 0));
  if (style === 'PENDEK') cap(12, i => 7 + Math.round((i + 15) / 5) % 3 + (i > 4 ? -2 : 1) + (Math.abs(i) > 12 ? 4 : 0));
  if (style === 'BELAH TENGAH') { cap(17, i => 3 + Math.abs(i) * 0.75); px(g, cx, top - 3, 1, 8, d); }
  if (style === 'KERITING') {
    [[-15, 25], [-9, 17], [-1, 14], [8, 16], [15, 24], [-17, 33], [17, 33], [-5, 22], [5, 22], [12, 20], [-12, 21]].forEach(([a, y]) => ell(g, cx + a, y + 1, 7, 6, '#120d10'));
    [[-15, 25], [-9, 17], [-1, 14], [8, 16], [15, 24], [-17, 33], [17, 33], [-5, 22], [5, 22], [12, 20], [-12, 21]].forEach(([a, y], n) => { ell(g, cx + a, y, 6, 5, n % 2 ? c : d); ell(g, cx + a - 2, y - 2, 2, 1, l); });
  }
  if (style === 'GONDRONG') { cap(11, i => 3 + Math.abs(i + 3) * 0.55); sideCover(28, 52); }
  if (style === 'BOB') { cap(11, i => 8 + ((i + 20) % 5 === 0 ? 1 : 0) + (Math.abs(i) > 12 ? 8 : 0)); sideCover(28, 50); }
  if (style === 'PANJANG') { cap(13, i => 4 + Math.abs(i - 4) * 0.5); sideCover(28, 56); }
  if (style === 'KUNCIR') cap(10, i => 5 + Math.abs(i + 4) * 0.28);
  if (style === 'SANGGUL') cap(9, i => 4 + Math.abs(i) * 0.3);
  if (style === 'PECI') {
    sideCover(30, 37);
    px(g, cx - 18, top - 7, 37, 17, '#0d0b0f'); px(g, cx - 17, top - 6, 35, 15, '#25232a'); px(g, cx - 17, top - 6, 35, 1, '#57535c'); px(g, cx - 17, top - 5, 3, 14, '#3a373f');
    px(g, cx - 17, top + 7, 35, 2, '#141217'); for (let x = cx - 15; x < cx + 17; x += 4) px(g, x, top - 4, 1, 10, '#322f37');
  }
}
function paintHijab(g, look, cx) {
  const scarves = [1, 2, 4, 5, 6, 8], [c, d, l] = LOOK.clothColor[scarves[look.scarf % scarves.length]];
  for (let y = 12; y < 82; y++) {
    const up = y < 30 ? 20 * Math.sqrt(Math.max(0, 1 - ((30 - y) / 19) ** 2)) : y < 54 ? 20 : y < 66 ? 20 + (y - 54) * 0.7 : 28.4 * Math.sqrt(Math.max(0, 1 - ((y - 66) / 16) ** 2)), half = Math.round(up);
    if (half < 1) continue;
    const j = y - HEAD_TOP, open = y >= 25 && y < 53 ? Math.max(0, faceHalf(0, Math.max(0, j)) - (y < 29 ? 1 : 0) - (y > 45 ? (y - 45) * 0.8 : 0)) : -1;
    px(g, cx - half - 1, y, 1, 1, '#1c1519'); px(g, cx + half + 1, y, 1, 1, '#1c1519');
    for (let i = -half; i <= half; i++) {
      if (open >= 0 && Math.abs(i) <= open) continue;
      const v = (i + half) / (half * 2);
      px(g, cx + i, y, 1, 1, v < 0.2 ? l : v > 0.76 ? d : c);
    }
  }
  for (let i = -8; i <= 8; i++) px(g, cx + i, 11 + Math.round(Math.abs(i) ** 2 * 0.012), 1, 1, '#1c1519');
  curve(g, cx - 14, 53, cx + 1, 65, cx + 21, 70, d, 2);
  curve(g, cx - 13, 52, cx + 1, 63, cx + 20, 68, l, 1);
  curve(g, cx + 15, 50, cx + 7, 62, cx - 12, 74, d, 1);
}
function paintExtra(g, look, cx) {
  const type = LOOK.extra[look.extra], c = LOOK.hairColor[look.hairColor][0];
  if (type === 'KACAMATA') {
    [-11, 3].forEach(x => { px(g, cx + x, 33, 9, 1, '#2a2024'); px(g, cx + x, 42, 9, 1, '#2a2024'); px(g, cx + x, 33, 1, 10, '#2a2024'); px(g, cx + x + 8, 33, 1, 10, '#2a2024'); g.globalAlpha = 0.18; px(g, cx + x + 1, 34, 7, 8, '#dff4f6'); g.globalAlpha = 1; px(g, cx + x + 2, 35, 2, 1, 'rgba(255,255,255,.8)'); });
    px(g, cx - 2, 36, 5, 1, '#2a2024');
  }
  if (type === 'KUMIS') { px(g, cx - 5, 45, 11, 2, c); px(g, cx - 6, 46, 2, 2, c); px(g, cx + 5, 46, 2, 2, c); }
  if (type === 'JENGGOT') { for (let j = 18; j < HEAD_H + 2; j++) { const half = Math.max(3, faceHalf(look.face, Math.min(j, HEAD_H - 1))), y = HEAD_TOP + j; for (let i = -half; i <= half; i++) { if (j < 30 && Math.abs(i) < 8) continue; if (j < 24 && Math.abs(i) < half - 2) continue; px(g, cx + i, y, 1, 1, (i * 3 + j) % 7 === 0 ? LOOK.hairColor[look.hairColor][2] : c); } } px(g, cx - 5, 45, 11, 1, c); }
}
function paintCustomer(g, look, cx = CHAR_W / 2) {
  const hijab = LOOK.hair[look.hair] === 'HIJAB';
  if (!hijab) paintBackHair(g, look, cx);
  paintClothes(g, look, cx);
  paintHead(g, look, cx);
  if (hijab) paintHijab(g, look, cx);
  paintExtra(g, look, cx);
  paintEyes(g, look, cx);
  paintNose(g, look, cx);
  paintMouth(g, look, cx);
  if (LOOK.extra[look.extra] === 'KACAMATA') paintExtra(g, look, cx);
  if (!hijab) paintFrontHair(g, look, cx);
}
function customerSprite(look) {
  const c = document.createElement('canvas'); c.width = CHAR_W; c.height = CHAR_H;
  const g = c.getContext('2d');
  paintCustomer(g, look);
  return c;
}

// Dua laci uang di lemari bawah meja depan.
const CASH_DRAWERS = [{ x: 8, y: 301, w: 304, h: 56, name: 'KOIN' }, { x: 328, y: 301, w: 304, h: 56, name: 'UANG KERTAS' }];
function paintCashDrawers(g) {
  CASH_DRAWERS.forEach((d, n) => {
    px(g, d.x - 2, d.y - 1, d.w + 4, d.h + 2, '#1a120e');
    for (let y = d.y; y < d.y + d.h; y++) {
      const plank = Math.floor((y - d.y) / 14);
      px(g, d.x, y, d.w, 1, (y - d.y) % 14 === 0 ? '#4a2f20' : pick(['#7c5338', '#744c34', '#6b4631'], noise(plank, n + 2)));
    }
    px(g, d.x, d.y, d.w, 1, '#b08660'); px(g, d.x, d.y + d.h - 2, d.w, 2, '#3a2418');
    [[0, 0], [d.w - 9, 0], [0, d.h - 9], [d.w - 9, d.h - 9]].forEach(([a, b]) => { px(g, d.x + a, d.y + b, 9, 9, '#6d4b22'); px(g, d.x + a + 1, d.y + b + 1, 7, 7, '#c79a4e'); px(g, d.x + a + 1, d.y + b + 1, 6, 1, '#f3d891'); px(g, d.x + a + 4, d.y + b + 4, 1, 1, '#5a3d1e'); });
    const cx = d.x + d.w / 2;
    px(g, cx - 62, d.y + 9, 124, 15, '#5a3d1e'); px(g, cx - 61, d.y + 10, 122, 13, '#e3c98f'); px(g, cx - 61, d.y + 10, 122, 1, '#fff0c4');
    txtC(g, d.name, cx, d.y + 14, '#5a3320');
    px(g, cx - 30, d.y + 33, 60, 8, '#2c1d13'); px(g, cx - 29, d.y + 33, 58, 5, '#c79a4e'); px(g, cx - 29, d.y + 33, 58, 2, '#ffe8aa'); px(g, cx - 34, d.y + 32, 6, 10, '#6d4b22'); px(g, cx + 28, d.y + 32, 6, 10, '#6d4b22');
    if (n === 0) [[-92, 30], [-84, 36], [-98, 38], [86, 32], [94, 38]].forEach(([a, b]) => { ell(g, cx + a, d.y + b, 5, 4, '#7c5a22'); ell(g, cx + a, d.y + b - 1, 4, 3, '#e3bf72'); px(g, cx + a - 2, d.y + b - 2, 2, 1, '#fff2bf'); });
    else [[-104, 30], [84, 31]].forEach(([a, b]) => { px(g, cx + a, d.y + b, 22, 12, '#2f5a42'); px(g, cx + a + 1, d.y + b + 1, 20, 10, '#74a184'); ell(g, cx + a + 11, d.y + b + 6, 3, 3, '#2f5a42'); });
  });
}
function drawMoneyPile(g, x, y) {
  g.globalAlpha = 0.28; ell(g, x + 1, y + 4, 13, 3, '#160f18'); g.globalAlpha = 1;
  [2, 0].forEach((o, n) => { px(g, x - 11 + n, y - 3 + o, 20, 7, '#234634'); px(g, x - 10 + n, y - 3 + o, 18, 6, n ? '#86b394' : '#5f8f72'); });
  ell(g, x - 1, y, 2, 2, '#2f5a42');
  ell(g, x + 9, y + 3, 4, 3, '#7c5a22'); ell(g, x + 9, y + 2, 3, 2, '#e3bf72'); px(g, x + 8, y + 1, 2, 1, '#fff2bf');
}
