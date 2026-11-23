// Area awal Warung Senja. Semua art digambar dari kode pada resolusi 640x360.

const C = {
  ink: '#2a2238', roofBack: '#5a4d66', roofBack2: '#65566f', roofLine: '#4b4058',
  asphalt: '#4a4558', asphalt2: '#544e62', asphalt3: '#403c4e', lane: '#ecd9a4',
  walk: '#bda99a', walk2: '#ad9a8c', walkLine: '#98877e', curb: '#7d6f73', curbLight: '#d2c0ae',
  grass: '#6f9a56', grass2: '#5f8a4f', grass3: '#88af62', path: '#d6b98f', path2: '#c2a47c',
  water: '#5b9aa8', water2: '#77b6ba', water3: '#477f91',
  leaf: '#3f7350', leaf2: '#52905a', leaf3: '#78b566', trunk: '#6b4938',
  glass: '#4f6f8c', glass2: '#6d91a8', glassHi: '#a9cdd2',
  lit: '#ffd27a', lit2: '#ffb65c', litHi: '#fff0b8',
  wood: '#8a5a3c', wood2: '#a8724a', wood3: '#65402f',
  metal: '#8d8c9a', metal2: '#b5b4bd', metal3: '#62606f',
  white: '#f3e8d6', red: '#d8574a', redDark: '#a93f40', teal: '#3f9c94', tealDark: '#2f7775',
  yellow: '#f0bd4f', blue: '#4f7fb5', blueDark: '#3b6191', orange: '#e58a45', pink: '#e49a95',
};

const GLYPHS = {
  A:'010 101 111 101 101', B:'110 101 110 101 110', C:'011 100 100 100 011', D:'110 101 101 101 110',
  E:'111 100 110 100 111', F:'111 100 110 100 100', G:'011 100 101 101 011', H:'101 101 111 101 101',
  I:'111 010 010 010 111', J:'001 001 001 101 010', K:'101 101 110 101 101', L:'100 100 100 100 111',
  M:'10001 11011 10101 10001 10001', N:'1001 1101 1011 1001 1001', O:'010 101 101 101 010',
  P:'110 101 110 100 100', R:'110 101 110 101 101', S:'011 100 010 001 110', T:'111 010 010 010 010',
  U:'101 101 101 101 111', V:'101 101 101 101 010', W:'10001 10001 10101 11011 10001',
  Y:'101 101 010 010 010',
};

function drawScene(ctx) {
  ctx.imageSmoothingEnabled = false;
  let seed = 20261122;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const shade = (x, y, w, h, c, a) => { ctx.globalAlpha = a; R(x, y, w, h, c); ctx.globalAlpha = 1; };

  const textWidth = s => [...s].reduce((n, ch) => n + (ch === ' ' ? 3 : GLYPHS[ch].split(' ')[0].length + 1), -1);
  function text(s, x, y, c) {
    for (const ch of s) {
      if (ch === ' ') { x += 3; continue; }
      const rows = GLYPHS[ch].split(' ');
      rows.forEach((row, j) => [...row].forEach((b, i) => { if (b === '1') R(x + i, y + j, 1, 1, c); }));
      x += rows[0].length + 1;
    }
  }
  function sign(x, y, w, h, bg, fg, s) {
    R(x, y, w, h, C.ink); R(x + 1, y + 1, w - 2, h - 2, bg); R(x + 1, y + 1, w - 2, 1, 'rgba(255,255,255,.28)');
    text(s, x + Math.floor((w - textWidth(s)) / 2), y + Math.floor((h - 5) / 2), fg);
  }

  function win(x, y, w, h, lit) {
    R(x - 1, y - 1, w + 2, h + 2, C.ink);
    R(x, y, w, h, lit ? C.lit : C.glass);
    R(x, y + h - 2, w, 2, lit ? C.lit2 : '#435f7a');
    if (lit) R(x + 1, y + 1, Math.max(1, w - 3), 1, C.litHi);
    else { R(x + 1, y + 1, 2, 1, C.glassHi); R(x + 1, y + 2, 1, 1, C.glassHi); R(x + w - 3, y + h - 4, 2, 1, C.glass2); }
    if (w > 7) R(x + (w >> 1), y, 1, h, C.ink);
    R(x - 2, y + h + 1, w + 4, 1, C.curbLight);
  }
  function shutter(x, y, w, h) {
    R(x, y, w, h, C.ink); R(x + 1, y + 1, w - 2, h - 1, C.metal);
    for (let j = y + 2; j < y + h; j += 2) R(x + 1, j, w - 2, 1, C.metal3);
    R(x + (w >> 1) - 2, y + h - 3, 4, 1, C.ink);
  }
  function awning(x, y, w, h, a, b) {
    R(x, y, w, h + 2, C.ink);
    for (let i = 0; i < w - 2; i++) R(x + 1 + i, y + 1, 1, h - 1, (i >> 2) % 2 ? b : a);
    for (let i = 0; i < w - 2; i += 4) R(x + 1 + i, y + h, 3, 1, (i >> 2) % 2 ? b : a);
    R(x + 1, y + 1, w - 2, 1, 'rgba(255,255,255,.35)');
  }
  function block(x, w, h, wall, trim, roof) {
    const top = 168 - h;
    R(x, top - 13, w, 14, C.ink); R(x + 1, top - 12, w - 2, 11, roof);
    for (let i = x + 4; i < x + w - 2; i += 8) R(i, top - 10 + (i % 3), 2, 1, 'rgba(0,0,0,.14)');
    R(x + 1, top - 12, w - 2, 1, 'rgba(255,255,255,.18)');
    R(x, top, w, h, C.ink); R(x + 1, top + 1, w - 2, h - 1, wall);
    R(x + 1, top + 1, w - 2, 3, trim); R(x + 1, top + 4, w - 2, 1, 'rgba(0,0,0,.2)');
    R(x + w - 4, top + 5, 3, h - 5, 'rgba(0,0,0,.1)');
    R(x + 1, 165, w - 2, 3, C.curb);
  }
  function tank(x, y) {
    R(x, y + 11, 15, 3, C.metal3); R(x + 1, y + 13, 1, 4, C.ink); R(x + 13, y + 13, 1, 4, C.ink);
    R(x + 2, y, 11, 12, C.ink); R(x + 1, y + 2, 13, 9, C.ink); R(x + 3, y + 1, 9, 10, C.blue); R(x + 2, y + 3, 11, 7, C.blue);
    R(x + 3, y + 3, 2, 5, '#79a4cf'); R(x + 11, y + 3, 2, 7, C.blueDark);
  }
  function ac(x, y) {
    R(x, y, 13, 9, C.ink); R(x + 1, y + 1, 11, 7, C.metal2);
    R(x + 2, y + 2, 6, 5, C.metal3); R(x + 4, y + 3, 2, 3, C.metal); R(x + 9, y + 2, 2, 1, C.metal3); R(x + 9, y + 4, 2, 1, C.metal3);
  }
  function plant(x, y, pot = C.orange) {
    R(x + 1, y + 6, 6, 5, C.ink); R(x + 2, y + 6, 4, 4, pot);
    R(x, y + 2, 8, 4, C.leaf); R(x + 2, y, 4, 7, C.leaf); R(x + 1, y + 2, 3, 2, C.leaf2); R(x + 3, y, 2, 2, C.leaf3); R(x + 6, y + 3, 1, 1, C.leaf3);
  }
  function lamp(x, base) {
    R(x, base - 2, 5, 2, C.ink); R(x + 2, base - 44, 1, 43, C.ink); R(x + 3, base - 44, 1, 43, C.metal3);
    R(x + 2, base - 46, 11, 2, C.ink); R(x + 10, base - 44, 6, 3, C.ink); R(x + 11, base - 43, 4, 2, C.litHi);
  }
  function glow(cx, cy, rx, ry, a) {
    for (let y = cy - ry; y <= cy + ry; y++) for (let x = cx - rx; x <= cx + rx; x++) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (d > 1) continue;
      if (d > 0.55 && (x + y) % 2) continue;
      shade(x, y, 1, 1, C.lit, d < 0.3 ? a * 1.5 : a);
    }
  }
  function tree(x, y, big = 1) {
    const r = 12 * big | 0;
    shade(x - r, y + 10, r * 2 + 2, 5, C.ink, 0.25);
    R(x - 2, y, 5, 13, C.ink); R(x - 1, y, 3, 12, C.trunk);
    const blob = (bx, by, br, c) => {
      for (let j = -br; j <= br; j++) { const span = Math.floor(Math.sqrt(br * br - j * j)); R(bx - span, by + j, span * 2 + 1, 1, c); }
    };
    [[0, -9, r + 1], [-r + 3, -3, r - 3], [r - 3, -3, r - 3]].forEach(([a, b, s]) => blob(x + a, y + b, s + 1, C.ink));
    [[0, -9, r + 1], [-r + 3, -3, r - 3], [r - 3, -3, r - 3]].forEach(([a, b, s]) => blob(x + a, y + b, s, C.leaf));
    blob(x - 2, y - 11, r - 3, C.leaf2); blob(x - 5, y - 14, r - 8 > 1 ? r - 8 : 2, C.leaf3);
  }
  function bench(x, y) {
    shade(x, y + 9, 25, 2, C.ink, 0.25);
    R(x, y, 24, 9, C.ink); R(x + 1, y + 1, 22, 2, C.wood2); R(x + 1, y + 4, 22, 2, C.wood); R(x + 3, y + 7, 2, 3, C.ink); R(x + 19, y + 7, 2, 3, C.ink);
  }

  // Langit senja
  const sky = ['#54458a', '#6f4f92', '#925a92', '#b9668c', '#dc7a7c', '#f3996c', '#fbbd72', '#fdd68c'];
  sky.forEach((c, i) => {
    const y = i * 18;
    R(0, y, 640, i === sky.length - 1 ? 168 - y : 18, c);
    if (i) for (let x = 0; x < 640; x += 2) { R(x + (y % 4 ? 1 : 0), y - 1, 1, 1, c); R(x + 1, y + 1, 1, 1, sky[i - 1]); }
  });

  // Matahari di atas warung
  for (let j = -22; j <= 22; j++) {
    const span = Math.floor(Math.sqrt(22 * 22 - j * j));
    R(304 - span, 82 + j, span * 2 + 1, 1, j < -8 ? '#ffe9a8' : '#fff3c4');
  }
  [[92, 2], [98, 2], [103, 1]].forEach(([y, h]) => R(278, y, 52, h, '#fbbd72'));

  // Awan
  [[196, 34, 54], [340, 52, 70], [372, 22, 38], [120, 60, 34], [470, 42, 46]].forEach(([x, y, w]) => {
    R(x, y, w, 4, '#f8b394'); R(x + 7, y - 3, w - 18, 3, '#ffd0a8'); R(x + 12, y + 4, w - 8, 2, '#d9828a');
  });

  // Siluet kota jauh
  for (const [base, color, minH, maxH] of [[168, '#b56a86', 34, 72], [168, '#8d5a84', 18, 46]]) {
    for (let x = -6; x < 640;) {
      const w = 16 + (rnd() * 26 | 0), h = minH + (rnd() * (maxH - minH) | 0);
      R(x, base - h, w, h, color);
      if (color === '#8d5a84') for (let wy = base - h + 4; wy < base - 4; wy += 6)
        for (let wx = x + 3; wx < x + w - 3; wx += 5) if (rnd() > 0.72) R(wx, wy, 2, 2, C.lit2);
      x += w;
    }
  }

  // Tanah
  R(0, 168, 640, 32, C.walk);
  for (let x = 0; x < 640; x += 16) R(x, 168, 1, 32, C.walkLine);
  for (let y = 176; y < 200; y += 8) R(0, y, 640, 1, C.walk2);
  R(0, 197, 640, 2, C.curbLight); R(0, 199, 640, 2, C.curb);

  R(0, 201, 640, 63, C.asphalt);
  for (let i = 0; i < 900; i++) R(rnd() * 640 | 0, 201 + rnd() * 63 | 0, 1, 1, rnd() > 0.5 ? C.asphalt2 : C.asphalt3);
  for (let x = 6; x < 640; x += 34) if (x < 292 || x > 356) R(x, 232, 18, 2, C.lane);
  for (let y = 205; y < 261; y += 8) R(296, y, 56, 4, C.white);
  [[108, 216], [470, 246]].forEach(([x, y]) => { R(x, y, 12, 8, C.ink); R(x + 1, y + 1, 10, 6, C.metal3); R(x + 3, y + 3, 6, 1, C.ink); });
  shade(0, 201, 640, 4, C.ink, 0.15);

  R(0, 263, 640, 2, C.curb); R(0, 265, 640, 2, C.curbLight);
  R(0, 267, 640, 21, C.walk);
  for (let x = 8; x < 640; x += 16) R(x, 267, 1, 21, C.walkLine);
  R(0, 277, 640, 1, C.walk2);

  R(0, 288, 640, 72, C.grass); R(0, 288, 640, 2, C.leaf);
  for (let i = 0; i < 520; i++) {
    const x = rnd() * 640 | 0, y = 291 + rnd() * 69 | 0;
    R(x, y, rnd() > 0.6 ? 2 : 1, 1, rnd() > 0.5 ? C.grass2 : C.grass3);
  }
  R(312, 288, 24, 72, C.path); R(312, 288, 2, 72, C.path2); R(334, 288, 2, 72, C.path2);
  R(90, 326, 222, 16, C.path); R(90, 326, 222, 2, C.path2); R(90, 340, 222, 2, C.path2);
  for (let y = 294; y < 360; y += 11) R(320 + (y % 5), y, 5, 2, C.path2);

  // Kolam taman
  const pond = [[438, 306, 110, 4], [428, 310, 130, 6], [420, 316, 148, 28], [428, 344, 132, 6], [440, 350, 106, 4]];
  pond.forEach(([x, y, w, h]) => R(x - 2, y - 2, w + 4, h + 4, C.path2));
  pond.forEach(([x, y, w, h]) => R(x, y, w, h, C.water));
  R(420, 316, 148, 3, C.water3); R(428, 310, 130, 3, C.water3);
  [[446, 326, 16], [486, 336, 22], [520, 322, 12], [452, 345, 12]].forEach(([x, y, w]) => R(x, y, w, 1, C.water2));
  [[468, 322], [530, 340]].forEach(([x, y]) => { R(x, y, 10, 5, C.leaf); R(x + 2, y + 1, 5, 1, C.leaf3); R(x + 7, y + 2, 3, 1, C.water); });
  R(473, 320, 3, 3, C.pink); R(474, 319, 1, 1, C.white);

  // Bangunan: kos
  block(0, 88, 132, '#c9866f', '#9f5f58', '#7e6673');
  for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) {
    const y = 48 + j * 25;
    if (j < 3) win(9 + i * 26, y, 16, 14, (i * 3 + j * 5) % 4 === 1);
    if (j < 3) { R(7 + i * 26, y + 16, 20, 1, C.ink); for (let k = 0; k < 20; k += 3) R(7 + i * 26 + k, y + 16, 1, 4, C.ink); R(7 + i * 26, y + 20, 20, 1, C.ink); }
  }
  sign(25, 124, 38, 11, C.white, C.redDark, 'KOS');
  R(34, 141, 20, 27, C.ink); R(35, 142, 18, 26, C.wood); R(44, 142, 1, 26, C.wood3); R(41, 154, 2, 2, C.yellow); R(46, 154, 2, 2, C.yellow);
  win(9, 145, 15, 12, false); win(65, 145, 15, 12, true);
  tank(10, 11); ac(62, 15);

  // Apotek
  block(88, 72, 94, '#e8d7bd', C.teal, '#6f6a7b');
  win(97, 88, 22, 17, false); win(129, 88, 22, 17, true);
  sign(95, 113, 58, 13, C.teal, C.white, 'APOTEK');
  R(146, 77, 11, 11, C.ink); R(147, 78, 9, 9, C.white); R(150, 79, 3, 7, C.teal); R(148, 81, 7, 3, C.teal);
  awning(92, 127, 64, 7, C.teal, C.white);
  win(97, 139, 18, 18, true); R(121, 138, 22, 30, C.ink); R(122, 139, 20, 29, C.glass); R(124, 141, 3, 1, C.glassHi); R(131, 139, 1, 29, C.ink); win(147, 142, 8, 15, true);
  ac(133, 62);

  // Fotokopi
  block(160, 64, 72, '#7fa6b3', '#58798f', '#7e6673');
  win(169, 106, 16, 13, true); win(199, 106, 16, 13, false);
  sign(165, 123, 54, 11, C.yellow, C.ink, 'FOTOKOPI');
  shutter(166, 137, 52, 31);
  R(166, 137, 52, 5, C.ink); R(167, 138, 50, 3, C.metal2);
  tank(196, 73);

  // Lahan kosong untuk upgrade
  R(272, 126, 64, 42, '#8c7a5f');
  for (let i = 0; i < 90; i++) R(272 + rnd() * 64 | 0, 130 + rnd() * 36 | 0, 2, 1, rnd() > 0.5 ? '#7a6a55' : '#a18d6d');
  R(272, 112, 64, 18, C.ink); R(273, 113, 62, 16, '#9b8f89');
  for (let y = 116; y < 129; y += 4) R(273, y, 62, 1, '#7c716f');
  for (let x = 277; x < 335; x += 12) R(x + (x % 8 ? 4 : 0), 113, 1, 16, '#7c716f');
  shade(273, 113, 18, 16, C.leaf, 0.75);
  [[276, 158], [298, 150], [318, 160], [288, 138], [326, 143]].forEach(([x, y]) => { R(x, y, 1, 4, C.leaf2); R(x - 1, y + 1, 1, 3, C.leaf); R(x + 1, y + 2, 2, 1, C.leaf3); });
  R(304, 139, 16, 7, C.ink); R(305, 140, 14, 5, C.metal); R(306, 140, 12, 1, C.metal2);
  for (let x = 274; x < 336; x += 7) { R(x, 158, 2, 12, C.ink); R(x, 158, 1, 11, C.wood2); }
  R(272, 161, 64, 2, C.wood3); R(272, 166, 64, 1, C.wood3);
  R(301, 149, 2, 18, C.ink); sign(287, 137, 31, 12, C.white, C.red, 'DISEWA');

  // Laundry
  block(336, 80, 80, '#e4a96d', '#c9774e', '#6f6a7b');
  win(346, 98, 18, 14, false); win(388, 98, 18, 14, true);
  sign(344, 117, 64, 12, C.blue, C.white, 'LAUNDRY');
  awning(340, 130, 72, 6, C.blue, C.white);
  R(344, 141, 64, 27, C.ink); R(345, 142, 62, 26, C.lit);
  for (let i = 0; i < 4; i++) { const x = 348 + i * 14; R(x, 149, 12, 19, C.ink); R(x + 1, 150, 10, 17, C.white); R(x + 3, 154, 6, 8, C.ink); R(x + 4, 155, 4, 6, C.glass2); R(x + 2, 151, 3, 1, C.metal); }
  ac(389, 74);

  // Toko
  block(416, 96, 66, '#d9c6e0', '#9a7ea8', '#7e6673');
  sign(425, 106, 78, 13, C.red, C.white, 'TOKO MAKMUR');
  awning(420, 121, 88, 7, C.red, C.yellow);
  R(424, 133, 80, 35, C.ink); R(425, 134, 78, 34, C.lit);
  for (let s = 0; s < 3; s++) {
    R(426, 142 + s * 9, 76, 1, C.wood3);
    for (let x = 427; x < 501; x += 4) { const pal = [C.red, C.blue, C.teal, C.yellow, C.pink, C.orange]; const h = 3 + (x + s) % 3; R(x, 142 + s * 9 - h, 3, h, pal[(x * 3 + s * 5) % 6]); }
  }
  R(458, 134, 14, 34, C.ink); R(459, 135, 12, 33, C.glass); R(461, 137, 3, 1, C.glassHi);
  tank(474, 83);

  // Gedung kantor
  block(512, 128, 150, '#6a7f9c', '#4e607f', '#5f5a70');
  for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) win(521 + i * 23, 30 + j * 15, 15, 9, (i * 7 + j * 11) % 5 === 2);
  R(512, 134, 128, 34, C.ink); R(513, 135, 126, 33, '#c8bfb7'); R(513, 135, 126, 3, '#8c8894');
  for (let x = 520; x < 632; x += 18) { R(x, 141, 14, 27, C.ink); R(x + 1, 142, 12, 26, x === 574 ? C.lit : C.glass); R(x + 2, 143, 3, 1, C.glassHi); }
  sign(548, 123, 58, 10, C.ink, C.lit, 'KANTOR');
  R(588, 0, 1, 15, C.ink); R(586, 8, 5, 1, C.ink);

  // WARUNG KITA
  R(221, 111, 54, 16, C.ink); R(222, 112, 52, 14, '#b95d49');
  for (let x = 224; x < 272; x += 3) { R(x, 112, 1, 14, '#8f4440'); R(x + 1, 112, 1, 14, '#d0755a'); }
  R(222, 112, 52, 1, '#e8a071');
  R(258, 101, 5, 11, C.ink); R(259, 101, 3, 10, C.metal);
  R(224, 126, 48, 42, C.ink); R(225, 127, 46, 41, '#f0dfb7');
  for (let y = 147; y < 165; y += 3) R(225, y, 46, 1, '#d9c295');
  sign(227, 128, 42, 9, C.wood3, C.yellow, 'WARUNG');
  awning(222, 137, 52, 6, C.red, C.white);
  R(228, 146, 28, 13, C.ink); R(229, 147, 26, 12, C.lit);
  R(229, 147, 26, 1, C.litHi); R(231, 150, 22, 1, C.wood3);
  [[232, C.red], [237, C.teal], [242, C.yellow], [248, C.orange]].forEach(([x, c]) => { R(x, 147, 3, 3, c); R(x, 147, 1, 1, C.white); });
  R(236, 154, 8, 4, C.metal2); R(237, 153, 6, 1, C.metal); R(248, 153, 4, 5, C.wood3);
  R(226, 158, 32, 3, C.ink); R(227, 158, 30, 2, C.wood2); R(228, 161, 28, 7, C.wood); R(228, 161, 28, 1, C.wood3);
  for (let x = 233; x < 256; x += 6) R(x, 162, 1, 6, C.wood3);
  R(260, 145, 10, 23, C.ink); R(261, 146, 8, 22, C.wood2); R(262, 148, 6, 7, C.lit); R(267, 158, 1, 2, C.yellow);

  // Glow dan detail depan warung
  glow(248, 178, 34, 13, 0.16);
  plant(214, 158); plant(274, 158, C.teal);
  R(217, 170, 7, 11, C.ink); R(218, 171, 5, 8, C.tealDark); text('M', 218, 172, C.white);
  [[234, 175], [252, 175]].forEach(([x, y]) => { shade(x - 1, y + 7, 10, 2, C.ink, 0.3); R(x, y, 8, 3, C.ink); R(x + 1, y, 6, 2, C.red); R(x + 1, y + 3, 1, 5, C.ink); R(x + 6, y + 3, 1, 5, C.ink); });
  for (let x = 208; x <= 288; x += 8) {
    const y = 112 + Math.round(10 - ((x - 248) / 40) ** 2 * 10);
    R(x, y, 8, 1, C.ink); R(x + 3, y + 1, 2, 2, x % 16 ? C.litHi : C.lit2);
  }

  // Bayangan bangunan di trotoar
  shade(0, 168, 224, 5, C.ink, 0.16); shade(272, 168, 368, 5, C.ink, 0.16);

  // Perabot jalan
  lamp(174, 197); lamp(390, 197); lamp(590, 197);
  glow(188, 190, 16, 8, 0.1); glow(404, 190, 16, 8, 0.1); glow(604, 190, 16, 8, 0.1);
  R(70, 186, 9, 11, C.ink); R(71, 187, 7, 9, C.tealDark); R(70, 185, 9, 2, C.metal3);
  plant(16, 174); plant(150, 169, C.teal); plant(504, 170); plant(426, 170, C.red);

  // Halte bus
  R(146, 270, 76, 3, C.ink); R(147, 271, 74, 1, C.metal2);
  R(148, 273, 2, 13, C.ink); R(218, 273, 2, 13, C.ink);
  R(151, 273, 66, 8, C.glass); shade(151, 273, 66, 8, C.glassHi, 0.25);
  R(160, 282, 44, 2, C.wood); R(162, 284, 1, 3, C.ink); R(201, 284, 1, 3, C.ink);
  sign(166, 263, 36, 8, C.blue, C.white, 'HALTE');

  // Taman
  [[32, 318, 1.3], [78, 346, 1], [146, 310, 1.15], [226, 318, 1], [378, 322, 1.2], [594, 318, 1.35], [612, 350, 1]].forEach(([x, y, s]) => tree(x, y, s));
  bench(238, 310); bench(382, 342); bench(106, 346);
  lamp(292, 318); glow(306, 312, 15, 8, 0.1);
  [[20, 348, C.pink], [176, 344, C.yellow], [264, 348, C.white], [404, 302, C.pink], [576, 348, C.yellow], [350, 354, C.white]].forEach(([x, y, c]) => {
    for (let i = 0; i < 5; i++) { const a = x + (i * 7) % 13, b = y + (i * 4) % 7; R(a, b, 1, 1, c); R(a, b + 1, 1, 1, C.leaf); }
  });

  // Warna senja
  ctx.globalCompositeOperation = 'soft-light';
  const dusk = ctx.createLinearGradient(0, 0, 640, 360);
  dusk.addColorStop(0, '#ff9e62'); dusk.addColorStop(1, '#6a5aa0');
  ctx.fillStyle = dusk; ctx.fillRect(0, 0, 640, 360);
  ctx.globalCompositeOperation = 'source-over';
}
