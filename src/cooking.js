// Logika memasak: pegang barang, target taruh, panduan, takaran, dan penilaian hasil.

GLYPHS['/'] = '001 001 010 100 100';

const BOARD = { x: 196, y: 224, w: 196, h: 58 };
const SERVE_ZONE = { x: 270, y: 228, w: 100, h: 54 };
const WOK_ZONE = { x: 204, y: 222, w: 118, h: 46 };
const COBEK_ZONE = { x: 432, y: 232, w: 78, h: 48 };
const BOARD_SLOTS = [[244, 252], [296, 252], [348, 252]];
const SEASON_ZONE = [0.55, 0.85];
const WATER_ZONE = [0.74, 0.96];
const MIN_AMOUNT = 0.35;
const SEASON_DONE = SEASON_ZONE[0];
const SPICE_DONE = 0.15;
const JUICE_WATER = 0.55;
const STARTER_RECIPES = ['kopi', 'pisang', 'daging', 'sup', 'nasi'];
const TUT_DONE = 8;
const RADIO = { x: 546, y: 184, w: 50, h: 36 };
const SAVE_KEY = 'warung-senja-save';
const SAVE_VERSION = 1;
const MAX_COOK_PARTS = 6;
const MAX_PLATES = 9;
const MAX_BOWLS = 4;
const DISH_NAMES = { pisang: 'PISANG GORENG', nasi: 'NASI GORENG', daging: 'TUMIS DAGING', telur: 'TELUR GORENG', gorengan: 'GORENGAN', krispi: 'GORENGAN KRISPI', mie: 'MIE GORENG', martabak: 'MARTABAK', tumis: 'TUMISAN', sup: 'SUP DAGING', soto: 'SOTO DAGING', kuah: 'KUAH CAMPUR' };
const BOWL_STACK = { x: 498, y: 208, w: 48, h: 32 };
const FOOD_LABEL = { chili: 'CABAI', 'chili+': 'CABAI', shallot: 'BAWANG', 'shallot+': 'BAWANG', banana: 'PISANG', 'banana+': 'PISANG', coated: 'PISANG', beef: 'DAGING', 'beef+': 'DAGING', egg: 'TELUR', rice: 'NASI', bumbu: 'BUMBU' };
Object.entries(FOOD_INFO).forEach(([type, info]) => { FOOD_LABEL[type] = info.name; FOOD_LABEL[type + '+'] = info.name; });
Object.keys(FOOD_SIZE).forEach(type => { FOOD_LABEL[type + '~'] = FOOD_LABEL[type] || 'BAHAN'; FOOD_LABEL[type + '^'] = FOOD_LABEL[type] || 'BAHAN'; });
Object.assign(FOOD_LABEL, { adonan: 'ADONAN', kulit: 'KULIT', mie: 'MIE' });
const STATUS_COLOR = { raw: '#d8c8aa', half: '#f0c36a', done: '#9fdc9a', over: '#e58a6b' };
const COMBOS = [
  [['nasi', 'telur', 'daging'], 'NASI GORENG SPESIAL'], [['putih', 'telur', 'daging'], 'NASI KOMPLIT'],
  [['nasi', 'telur'], 'NASI GORENG TELUR'], [['nasi', 'daging'], 'NASI GORENG DAGING'], [['nasi', 'sambal'], 'NASI GORENG PEDAS'],
  [['putih', 'soto'], 'NASI SOTO'], [['putih', 'sup'], 'NASI SUP'], [['soto', 'telur'], 'SOTO TELUR'], [['sup', 'telur'], 'SUP TELUR'],
  [['putih', 'telur'], 'NASI TELUR'], [['putih', 'daging'], 'NASI DAGING'], [['putih', 'pisang'], 'NASI PISANG'],
  [['putih', 'sambal'], 'NASI SAMBAL'], [['putih', 'tumis'], 'NASI TUMIS'], [['telur', 'sambal'], 'TELUR SAMBAL'],
  [['daging', 'sambal'], 'DAGING SAMBAL'], [['pisang', 'sambal'], 'PISANG SAMBAL'],
];
const PLATE_SLOTS = [[0, -3], [-13, 0], [13, 0], [-6, -6], [7, -6], [0, 3]];
const RICE_LID = { x: 26, y: 190, w: 74, h: 18 };
const POT_OPENING = { x: 346, y: 186, w: 72, h: 76 };
const WOK_STEP = { bumbu: 'bumbuIn', egg: 'eggIn', rice: 'riceIn', coated: 'inWok', 'beef+': 'beefIn' };
const WOK_IN_SINK = [87, 246];
const POT_IN_SINK = [90, 208];
const POT_OVERFLOW_AFTER = 5;
const RESET_BUTTON = { x: 180, y: 266, w: 66, h: 15 };
const CUP_HOMES = [[568, 232], [592, 232], [616, 232]];
const OLD_CUP_HOMES = [[578, 258], [598, 258], [618, 258]];
const DELIVER_BUTTON = { x: 284, y: 285, w: 72, h: 14 };
const COUNTER = { [LEFT]: { x: 18, y: 216, w: 604, h: 66 }, [FRONT]: { x: 38, y: 208, w: 564, h: 76 }, [RIGHT]: { x: 18, y: 216, w: 604, h: 68 } };

const SPOTS = {
  [LEFT]: {
    knife: { name: 'PISAU KOKI', x: 511, y: 116, w: 23, h: 82 }, rice: { name: 'NASI', x: 26, y: 200, w: 74, h: 58 },
    eggs: { name: 'TELUR', x: 112, y: 244, w: 72, h: 38 }, chili: { name: 'BUKA RAK SAYUR DAN BUAH', ...STORES.fresh.door },
    shallot: { name: 'BUKA RAK SAYUR DAN BUAH', ...STORES.fresh.door }, banana: { name: 'BUKA RAK SAYUR DAN BUAH', ...STORES.fresh.door },
    flour: { name: 'KARUNG TEPUNG', x: 264, y: 150, w: 72, h: 73 }, beef: { name: 'BUKA KULKAS DAGING', ...STORES.cold.door }, board: { name: 'TALENAN', ...BOARD },
    cobek: { name: 'COBEK', ...COBEK_ZONE },
    blender: { name: 'BLENDER', ...BLENDER_ZONE }, sagu: { name: 'AMBIL TEPUNG SAGU', ...SAGU_ZONE }, crumb: { name: 'TOPLES TEPUNG ROTI', ...CRUMB_ZONE }, dough: { name: 'TALENAN', ...DOUGH_BOARD }, pin: { name: 'PENGGILING', x: 108, y: 213, w: 76, h: 18 },
    bin: { name: 'TEMPAT SAMPAH', x: TRASH.x - 42, y: TRASH.y - 20, w: 84, h: 40 },
  },
  [FRONT]: {
    book: { name: 'BUKU RESEP', x: 50, y: 222, w: 140, h: 62 }, plate: { name: 'TEMPAT SAJI', ...SERVE_ZONE },
    mug: { name: 'KOPI PANAS', x: 414, y: 222, w: 48, h: 44 }, caddy: { name: 'NAMPAN BUMBU', x: 270, y: 186, w: 100, h: 38 },
    plant: { name: 'POT KECIL', x: 192, y: 232, w: 30, h: 40 },
    tin: { name: 'TOPLES KERUPUK', x: 30, y: 173, w: 46, h: 46 }, radio: { name: 'RADIO TUA', x: 548, y: 186, w: 46, h: 32 }, bunga: { name: 'BUNGA', x: 602, y: 178, w: 38, h: 40 },
    seat1: { name: 'TEMPAT PELANGGAN 1', x: 120, y: 150, w: 60, h: 36 }, seat2: { name: 'TEMPAT PELANGGAN 2', x: 233, y: 150, w: 60, h: 36 },
    seat3: { name: 'TEMPAT PELANGGAN 3', x: 347, y: 150, w: 60, h: 36 }, seat4: { name: 'TEMPAT PELANGGAN 4', x: 460, y: 150, w: 60, h: 36 },
  },
  [RIGHT]: {
    wok: { name: 'WAJAN', ...WOK_ZONE }, pot: { name: 'PANCI', x: 336, y: 186, w: 92, h: 74 }, ladle: { name: 'CENTONG', x: 62, y: 139, w: 20, h: 46 },
    knobL: { name: 'API KIRI', x: 280, y: 268, w: 42, h: 20 }, knobR: { name: 'API KANAN', x: 322, y: 268, w: 42, h: 20 },
    kecap: { name: 'KECAP', x: 488, y: 52, w: 23, h: 51 }, minyak: { name: 'MINYAK', x: 521, y: 52, w: 23, h: 51 },
    salt: { name: 'GARAM', x: 554, y: 76, w: 16, h: 27 }, spatula: { name: 'SUTIL', x: 34, y: 138, w: 20, h: 70 },
    plates: { name: 'TUMPUKAN PIRING', x: 572, y: 236, w: 62, h: 48 }, bowls: { name: 'MANGKUK', x: 498, y: 208, w: 48, h: 32 }, cups: { name: 'NAMPAN GELAS', x: 552, y: 210, w: 82, h: 28 },
    sink: { name: 'WASTAFEL', ...SINK },
    coffee: { name: 'KALENG KOPI', x: 581, y: 64, w: 34, h: 38 }, spoon: { name: 'SENDOK', x: 580, y: 138, w: 26, h: 46 }, mat: { name: 'ALAS PIRING', x: 486, y: 240, w: 84, h: 44 },
    hood: { name: 'LAMPU TUDUNG', x: 172, y: 12, w: 282, h: 92 },
  },
};

const RECIPES = {
  kopi: {
    name: 'KOPI TUBRUK', note: 'HANGAT DAN PEKAT', wok: [], steps: [
      { key: 'cup', n: 'GELAS', v: RIGHT, spot: 'cups', text: 'AMBIL GELAS, TARUH DI ALAS KAYU' },
      { key: 'powder', n: 'KOPI BUBUK', v: RIGHT, spot: 'spoon', text: 'CELUP SENDOK KE KALENG DI RAK, BAWA KE GELAS' },
      { key: 'boil', n: 'DIDIHKAN AIR', v: RIGHT, spot: 'knobR', text: 'NYALAKAN API KANAN UNTUK PANCI' },
      { key: 'pour', n: 'SEDUH', v: RIGHT, spot: 'ladle', text: 'CELUP CENTONG KE PANCI, TUANG KE CANGKIR' },
      { key: 'served', n: 'SAJIKAN', v: FRONT, spot: 'plate', text: 'TARUH KOPI DI TEMPAT SAJI' },
    ],
  },
  pisang: {
    name: 'PISANG GORENG', note: 'RENYAH DI LUAR', wok: ['coated'], steps: [
      { key: 'cutBanana', n: 'IRIS PISANG', v: LEFT, spot: 'banana', text: 'TARUH PISANG DI TALENAN' },
      { key: 'coat', n: 'BALUR TEPUNG', v: LEFT, spot: 'board', text: 'BAWA IRISAN KE MANGKUK TEPUNG' },
      { key: 'oil', n: 'TUANG MINYAK', v: RIGHT, spot: 'minyak', text: 'ANGKAT MINYAK, TUANG KE WAJAN' },
      { key: 'fire', n: 'NYALAKAN API', v: RIGHT, spot: 'knobL', text: 'KLIK ATAU GESER TOMBOL API KIRI' },
      { key: 'inWok', n: 'MASUK WAJAN', v: LEFT, spot: 'board', text: 'BAWA PISANG BERTEPUNG KE WAJAN' },
      { key: 'cooked', n: 'GORENG', v: RIGHT, spot: 'spatula', text: 'SELIP SUTIL KE BAWAH PISANG' },
      { key: 'plateOut', n: 'SIAPKAN PIRING', v: RIGHT, spot: 'plates', text: 'TARUH PIRING DI ALAS KAYU' },
      { key: 'plated', n: 'ANGKAT MASAKAN', v: RIGHT, spot: 'wok', text: 'PEGANG GAGANG WAJAN, MIRINGKAN KE PIRING' },
      { key: 'served', n: 'SAJIKAN', v: RIGHT, spot: 'mat', text: 'BAWA PIRING KE MEJA DEPAN' },
    ],
  },
  nasi: {
    name: 'NASI GORENG', note: 'BUMBU ULEK SENDIRI', wok: ['bumbu', 'egg', 'rice'], steps: [
      { key: 'cutChili', n: 'IRIS CABAI', v: LEFT, spot: 'chili', text: 'TARUH CABAI DI TALENAN' },
      { key: 'cutShallot', n: 'IRIS BAWANG', v: LEFT, spot: 'shallot', text: 'TARUH BAWANG DI TALENAN' },
      { key: 'toCobek', n: 'KE COBEK', v: LEFT, spot: 'board', text: 'PINDAHKAN IRISAN KE COBEK' },
      { key: 'ground', n: 'ULEK BUMBU', v: LEFT, spot: 'cobek', text: 'PEGANG ULEKAN, GOSOK DI COBEK' },
      { key: 'oil', n: 'TUANG MINYAK', v: RIGHT, spot: 'minyak', text: 'ANGKAT MINYAK, TUANG KE WAJAN' },
      { key: 'fire', n: 'NYALAKAN API', v: RIGHT, spot: 'knobL', text: 'KLIK ATAU GESER TOMBOL API KIRI' },
      { key: 'bumbuIn', n: 'TUMIS BUMBU', v: LEFT, spot: 'cobek', text: 'AMBIL BUMBU DARI COBEK KE WAJAN' },
      { key: 'eggIn', n: 'TELUR', v: LEFT, spot: 'eggs', text: 'AMBIL TELUR, PECAHKAN DI WAJAN' },
      { key: 'riceIn', n: 'NASI', v: LEFT, spot: 'rice', text: 'AMBIL NASI, MASUKKAN KE WAJAN' },
      { key: 'soy', n: 'KECAP', v: RIGHT, spot: 'kecap', text: 'TUANG KECAP SAMPAI ZONA KUNING' },
      { key: 'salt', n: 'TABUR GARAM', v: RIGHT, spot: 'salt', text: 'GOYANGKAN GARAM SAMPAI ZONA KUNING' },
      { key: 'cooked', n: 'ADUK', v: RIGHT, spot: 'spatula', text: 'PEGANG SUTIL, ADUK SAMPAI MATANG' },
      { key: 'plateOut', n: 'SIAPKAN PIRING', v: RIGHT, spot: 'plates', text: 'TARUH PIRING DI ALAS KAYU' },
      { key: 'plated', n: 'ANGKAT MASAKAN', v: RIGHT, spot: 'wok', text: 'PEGANG GAGANG WAJAN, MIRINGKAN KE PIRING' },
      { key: 'served', n: 'SAJIKAN', v: RIGHT, spot: 'mat', text: 'BAWA PIRING KE MEJA DEPAN' },
    ],
  },
  daging: {
    name: 'TUMIS DAGING', note: 'SAPI KECAP GURIH', wok: ['beef+'], steps: [
      { key: 'cutBeef', n: 'IRIS DAGING', v: LEFT, spot: 'beef', text: 'TARUH DAGING DI TALENAN' },
      { key: 'oil', n: 'TUANG MINYAK', v: RIGHT, spot: 'minyak', text: 'ANGKAT MINYAK, TUANG KE WAJAN' },
      { key: 'fire', n: 'NYALAKAN API', v: RIGHT, spot: 'knobL', text: 'KLIK ATAU GESER TOMBOL API KIRI' },
      { key: 'beefIn', n: 'MASUK WAJAN', v: LEFT, spot: 'board', text: 'BAWA IRISAN DAGING KE WAJAN' },
      { key: 'soy', n: 'KECAP', v: RIGHT, spot: 'kecap', text: 'TUANG KECAP SAMPAI ZONA KUNING' },
      { key: 'salt', n: 'TABUR GARAM', v: RIGHT, spot: 'salt', text: 'GOYANGKAN GARAM SAMPAI ZONA KUNING' },
      { key: 'cooked', n: 'TUMIS', v: RIGHT, spot: 'spatula', text: 'PEGANG SUTIL, ADUK SAMPAI MATANG' },
      { key: 'plateOut', n: 'SIAPKAN PIRING', v: RIGHT, spot: 'plates', text: 'TARUH PIRING DI ALAS KAYU' },
      { key: 'plated', n: 'ANGKAT MASAKAN', v: RIGHT, spot: 'wok', text: 'PEGANG GAGANG WAJAN, MIRINGKAN KE PIRING' },
      { key: 'served', n: 'SAJIKAN', v: RIGHT, spot: 'mat', text: 'BAWA PIRING KE MEJA DEPAN' },
    ],
  },
  sup: {
    name: 'SUP DAGING', note: 'KUAH BENING HANGAT', wok: [], soup: ['beef+', 'shallot+'], steps: [
      { key: 'cutBeef', n: 'IRIS DAGING', v: LEFT, spot: 'beef', text: 'TARUH DAGING DI TALENAN' },
      { key: 'cutShallot', n: 'IRIS BAWANG', v: LEFT, spot: 'shallot', text: 'TARUH BAWANG DI TALENAN' },
      { key: 'potBeef', n: 'DAGING KE PANCI', v: LEFT, spot: 'board', text: 'BAWA IRISAN DAGING KE PANCI' },
      { key: 'potShallot', n: 'BAWANG KE PANCI', v: LEFT, spot: 'board', text: 'BAWA IRISAN BAWANG KE PANCI' },
      { key: 'boil', n: 'DIDIHKAN', v: RIGHT, spot: 'knobR', text: 'NYALAKAN API KANAN UNTUK PANCI' },
      { key: 'potSalt', n: 'TABUR GARAM', v: RIGHT, spot: 'salt', text: 'TABUR GARAM DI ATAS PANCI' },
      { key: 'simmer', n: 'REBUS', v: RIGHT, spot: 'pot', text: 'TUNGGU KUAH MATANG' },
      { key: 'bowlOut', n: 'SIAPKAN MANGKUK', v: RIGHT, spot: 'bowls', text: 'TARUH MANGKUK DI ALAS KAYU' },
      { key: 'ladled', n: 'CIDUK KUAH', v: RIGHT, spot: 'ladle', text: 'CELUP CENTONG, TUANG KE MANGKUK' },
      { key: 'served', n: 'SAJIKAN', v: RIGHT, spot: 'mat', text: 'BAWA MANGKUK KE TEMPAT SAJI' },
    ],
  },
  soto: {
    name: 'SOTO DAGING', note: 'KUAH REMPAH PEDAS', wok: [], soup: ['beef+', 'bumbu'], steps: [
      { key: 'cutBeef', n: 'IRIS DAGING', v: LEFT, spot: 'beef', text: 'TARUH DAGING DI TALENAN' },
      { key: 'cutChili', n: 'IRIS CABAI', v: LEFT, spot: 'chili', text: 'TARUH CABAI DI TALENAN' },
      { key: 'cutShallot', n: 'IRIS BAWANG', v: LEFT, spot: 'shallot', text: 'TARUH BAWANG DI TALENAN' },
      { key: 'toCobek', n: 'KE COBEK', v: LEFT, spot: 'board', text: 'PINDAHKAN CABAI DAN BAWANG KE COBEK' },
      { key: 'ground', n: 'ULEK BUMBU', v: LEFT, spot: 'cobek', text: 'PEGANG ULEKAN, GOSOK DI COBEK' },
      { key: 'potBeef', n: 'DAGING KE PANCI', v: LEFT, spot: 'board', text: 'BAWA IRISAN DAGING KE PANCI' },
      { key: 'potBumbu', n: 'BUMBU KE PANCI', v: LEFT, spot: 'cobek', text: 'BAWA BUMBU DARI COBEK KE PANCI' },
      { key: 'boil', n: 'DIDIHKAN', v: RIGHT, spot: 'knobR', text: 'NYALAKAN API KANAN UNTUK PANCI' },
      { key: 'potSalt', n: 'TABUR GARAM', v: RIGHT, spot: 'salt', text: 'TABUR GARAM DI ATAS PANCI' },
      { key: 'simmer', n: 'REBUS', v: RIGHT, spot: 'pot', text: 'TUNGGU KUAH MATANG' },
      { key: 'bowlOut', n: 'SIAPKAN MANGKUK', v: RIGHT, spot: 'bowls', text: 'TARUH MANGKUK DI ALAS KAYU' },
      { key: 'ladled', n: 'CIDUK KUAH', v: RIGHT, spot: 'ladle', text: 'CELUP CENTONG, TUANG KE MANGKUK' },
      { key: 'served', n: 'SAJIKAN', v: RIGHT, spot: 'mat', text: 'BAWA MANGKUK KE TEMPAT SAJI' },
    ],
  },
};
const BOOK_ROWS = Object.keys(RECIPES).map((id, i) => ({ id, x: 196, y: 106 + i * 26, w: 248, h: 24 }));

const closeness = (value, low, high) => {
  const miss = value < low ? low - value : value > high ? value - high : 0;
  return Math.max(0.25, 1 - miss / 0.35);
};
const average = list => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 1);

function createShop(onExit) {
  const outside = layer(640, 360, paintOutside);
  const LIGHTS = {
    [LEFT]: { lamps: [[190, 210], [440, 210]], extra: [] },
    [FRONT]: { lamps: [[214, 100], [424, 100]], extra: [[160, 335, 150, 0.42], [480, 335, 150, 0.42]] },
    [RIGHT]: { lamps: [[230, 200], [430, 200]], extra: [] },
  };
  const makeRoom = (paint, v) => layer(640, 360, g => {
    paint(g); applyLight(g, LIGHTS[v].lamps, LIGHTS[v].extra);
    if (v === FRONT) { pendant(g, 214, 72); pendant(g, 424, 72); }
  });
  const rooms = { [LEFT]: makeRoom(paintLeftRoom, LEFT), [FRONT]: makeRoom(paintFrontRoom, FRONT), [RIGHT]: makeRoom(paintRightRoom, RIGHT) };
  const frontGlow = glowLayer([[214, 84, 88], [424, 84, 88]]);
  const hoodGlow = glowLayer([[314, 128, 112]]);
  const ambient = createAmbient(rooms, outside, () => ({ world: s.world, riceLid: s.riceLid, away, view: s.view }));
  const jarSprites = Object.fromEntries(SPICES.map(sp => [sp.id, makeSprite(30, 40, 15, 22, g => paintSpiceJar(g, sp, 15, 34))]));
  const storeArt = {
    cold: layer(STORE_PANEL.w, STORE_PANEL.h, paintColdPanel), fresh: layer(STORE_PANEL.w, STORE_PANEL.h, paintFreshPanel),
    spiceA: layer(STORE_PANEL.w, STORE_PANEL.h, g => paintSpicePanel(g, 'spiceA')), spiceB: layer(STORE_PANEL.w, STORE_PANEL.h, g => paintSpicePanel(g, 'spiceB')),
  };
  const utensilSprites = UTENSILS.map(u => makeSprite(18, 46, 9, 0, g => paintUtensil(u.type, g)));
  const sprites = Object.fromEntries(Object.entries(TOOL_DEFS).map(([id, t]) => [id, makeSprite(t.w, t.h, t.ax, t.ay, g => paintTool(id, g))]));
  sprites.knifeTop = makeSprite(14, 94, 7, 62, paintKnifeTop);
  ['cleaver', 'fillet', 'nakiri'].forEach(id => { sprites[id + 'Top'] = makeSprite(16, 94, 7, 62, g => paintKnifeHeld(id, g)); });
  const plateStacks = Array.from({ length: MAX_PLATES + 1 }, (_, n) => makeSprite(70, 64, 35, 50, g => paintPlateStack(g, n, 35, 50)));
  const bowlStacks = Array.from({ length: MAX_BOWLS + 1 }, (_, n) => makeSprite(60, 60, 30, 46, g => paintBowlStack(g, n, 30, 46)));
  sprites.spatulaHeld = makeSprite(80, 70, 18, 14, paintSpatulaHeld);
  sprites.ladleHeld = makeSprite(40, 64, 20, 28, paintLadleHeld);
  sprites.lapHeld = makeSprite(44, 34, 21, 16, g => paintFoldedCloth(g, CLOTH.lap));
  sprites.lap2Held = makeSprite(44, 34, 21, 16, g => paintFoldedCloth(g, CLOTH.lap2));
  const foodSprites = Object.fromEntries(Object.entries(FOOD_SIZE).map(([type, [w, h]]) => {
    const W = w + 8, H = h + 12;
    return [type, { c: layer(W, H, c => { paintWhole(c, type, W >> 1, H >> 1); tintLayer(c, W, H); }), w: W, h: H }];
  }));
  const rain = Array.from({ length: 70 }, (_, i) => ({ x: OPENING.x + noise(i, 1) * OPENING.w, y: OPENING.y + noise(i, 2) * OPENING.h, v: 150 + noise(i, 3) * 90 }));
  const steam = [], bits = [];
  const freshCups = () => CUP_HOMES.map(([x, y], id) => ({ kind: 'cup', id, v: RIGHT, x, y, powder: false, water: 0, spices: {} }));
  const freshWorld = () => ({
    board: [], scores: [], cutNeat: [], cobek: { items: [], parts: [], ground: 0 }, wok: freshWok(), potHeat: 0, pot: { parts: [], level: 0, salt: 0, spices: {} }, ladle: 0, ladleKind: 'water',
    flameL: 0, flameR: 0, boiledOnce: false, riceOpen: false, spills: [], sink: [], tapOn: false, fan: false, sinkWater: 0, sinkDirt: 0, plug: false, guests: [null, null, null, null], cash: [], money: 0, moneyL: 0, moneyR: 0, dough: null, batterSpot: { v: LEFT, x: 228, y: 206 }, batter: freshBatter(), blender: freshBlender(), potWater: 1, potInSink: false, wokInSink: false, wokGrime: 0, potGrime: 0, stoveGrime: 0, things: freshCups(), spoonLoaded: false, done: {},
  });
  const s = {
    view: FRONT, cam: 0, t: 0, spawn: 0, mouse: [320, 180], hand: null, tilt: 0, world: freshWorld(), recipe: null, book: false,
    made: 0, result: null, nudge: '', nudgeT: 0, edge: 0, edgeLock: false, pourT: 0, chopDip: 0, shake: 0, knob: null, stream: null,
    meter: null, pouredBowl: null, saveT: 0, savedText: '', savedFlash: 0, best: {}, confirmReset: 0, pouredCup: null, slide: null, samples: [], carryY: 0, downRun: 0, flying: {}, hoodLight: true, riceLid: 0, binLid: 0, store: null, storeShown: 'cold', storeK: 0, wash: 0, wokWash: 0, edgeDir: 0, edgeWait: 0.3, touch: false, radioTag: null, guestT: 6, unlocked: [...STARTER_RECIPES], buyArm: null, tut: 0, tutBase: 0, tutSeen: {}, guestSprites: {}, drawerK: [0, 0], drawerOpen: [false, false], mixTurn: 0, blending: false, flameTag: null, foam: 0, potFullT: 0, potFilling: false, potHold: 0, lapRub: 0, haze: 0, spatterT: 0, smokeT: 0, smokeWarned: false, fanSpin: 0, swing: UTENSILS.map(() => ({ a: 0, v: 0 })),
  };
  const BOOK_TABS = [];
  const BOOK_PREV = { x: 262, y: 262, w: 22, h: 12 }, BOOK_NEXT = { x: 356, y: 262, w: 22, h: 12 };
  const isOpen = id => s.unlocked.includes(id);
  const unlockCost = id => Math.ceil(guestPrice(id) * 3 / 5000) * 5000;
  const bookList = () => {
    const ids = Object.keys(RECIPES);
    return [...ids.filter(isOpen), ...ids.filter(id => !isOpen(id)).sort((a, b) => unlockCost(a) - unlockCost(b))];
  };
  function buyRecipe(id) {
    const w = s.world, cost = unlockCost(id);
    if (w.money < cost) { s.buyArm = null; nudge('UANG BELUM CUKUP'); sfx('switch'); return; }
    if (s.buyArm !== id) { s.buyArm = id; sfx('page'); return; }
    const fromLeft = Math.min(w.moneyL, cost);
    w.money -= cost; w.moneyL -= fromLeft; w.moneyR = Math.max(0, w.moneyR - (cost - fromLeft));
    s.unlocked.push(id); s.buyArm = null; s.savedFlash = 1.6;
    nudge('RESEP BARU: ' + RECIPES[id].name); sfx('cashIn');
    saveGame();
  }
  // Tutorial pembuka: tiap langkah selesai saat pemain benar-benar melakukannya.
  const TUT = [
    { t: 'SELAMAT DATANG DI WARUNG SENJA', a: 'KAMU MEMASAK, MELAYANI PELANGGAN,', b: 'DAN MENGUMPULKAN UANG UNTUK MEMBUKA RESEP BARU.', next: 'LANJUT' },
    { t: 'PINDAH MEJA', a: 'KLIK PANAH DI TEPI LAYAR.', b: 'KIRI UNTUK MERACIK, KANAN UNTUK KOMPOR DAN WASTAFEL.' },
    { t: 'PEGANG DAN PINDAHKAN', a: 'TAHAN KLIK PADA GELAS, SERET KE TEMPAT LAIN,', b: 'LALU LEPAS. SEMUA BARANG DIPINDAH DENGAN CARA INI.' },
    { t: 'BUKU RESEP', a: 'KEMBALI KE MEJA DEPAN,', b: 'LALU KLIK BUKU RESEP YANG TERBUKA.' },
    { t: 'PILIH MENU', a: 'KLIK KOPI TUBRUK UNTUK MULAI MEMASAK.', b: 'RESEP LAIN BISA DIBUKA DENGAN UANG NANTI.' },
    { t: 'IKUTI PANDUAN', a: 'PANAH KUNING MENUNJUK BENDA YANG DIPAKAI.', b: 'TEKS DI BAWAH LAYAR MENJELASKAN CARANYA.', next: 'MENGERTI' },
    { t: 'BUAT PESANAN PERTAMA', a: 'SELESAIKAN KOPI SAMPAI DISAJIKAN.', b: 'BINGUNG? LIHAT TEKS DI BAWAH LAYAR.' },
    { t: 'WARUNG SIAP BUKA', a: 'TARUH MAKANAN DI DEPAN PELANGGAN. SETELAH MAKAN,', b: 'AMBIL UANG, MASUKKAN KE LACI, LALU CUCI PIRINGNYA.', next: 'BUKA WARUNG' },
  ];
  const TUT_CARD = { x: 150, y: 20, w: 340, h: 48 };
  const TUT_SKIP = { x: 158, y: 53, w: 46, h: 12 };
  const tutNext = () => { const label = TUT[s.tut] && TUT[s.tut].next; if (!label) return null; const w = textW(label) + 14; return { x: TUT_CARD.x + TUT_CARD.w - w - 8, y: 53, w, h: 12 }; };
  const tutGo = n => { s.tut = n; if (n === 6) s.tutBase = s.made; sfx('ticket'); };
  function updateTutorial() {
    if (s.tut >= TUT_DONE) return;
    s.tutSeen[s.view] = true;
    if (s.tut === 1 && s.tutSeen[LEFT] && s.tutSeen[RIGHT]) tutGo(2);
    else if (s.tut === 2 && !s.hand && cups().some(cup => !atHome(cup))) tutGo(3);
    else if (s.tut === 3 && (s.book || s.recipe)) { s.bookPage = 0; tutGo(s.recipe ? 5 : 4); }
    else if (s.tut === 4) { if (s.recipe) tutGo(5); else if (!s.book) s.tut = 3; }
    else if (s.tut === 6 && s.made > s.tutBase) tutGo(7);
  }
  function tutTarget() {
    if (s.tut === 1) return { v: s.tutSeen[LEFT] ? RIGHT : LEFT };
    if (s.tut === 2) { const cup = cups().find(c => atHome(c)); return cup ? { v: cup.v, r: thingRect(cup) } : null; }
    if (s.tut === 3) return { v: FRONT, r: SPOTS[FRONT].book };
    return null;
  }
  function tutClick(x, y) {
    if (s.tut >= TUT_DONE || s.result) return false;
    if (inRect(TUT_SKIP, x, y)) { s.tut = TUT_DONE; sfx('page'); return true; }
    const next = tutNext();
    if (next && inRect(next, x, y)) { tutGo(s.tut + 1); return true; }
    return false;
  }
  function drawTutorial(g) {
    if (s.tut >= TUT_DONE || s.result) return;
    const c = TUT[s.tut], r = TUT_CARD, [mx, my] = s.mouse, button = (b, label, main) => {
      const hot = inRect(b, mx, my);
      px(g, b.x, b.y, b.w, b.h, '#2c1d1b'); px(g, b.x + 1, b.y + 1, b.w - 2, b.h - 2, main ? (hot ? '#e8b64c' : '#587a6d') : hot ? '#d9b77a' : '#e6d9bd');
      txtC(g, label, b.x + b.w / 2, b.y + 4, main ? (hot ? '#2a1a17' : '#fff6e2') : '#5c2f28');
    };
    g.globalAlpha = 0.3; px(g, r.x + 3, r.y + 3, r.w, r.h, '#120d14'); g.globalAlpha = 1;
    px(g, r.x, r.y, r.w, r.h, '#2c1d1b'); px(g, r.x + 2, r.y + 2, r.w - 4, r.h - 4, '#efe3c8'); px(g, r.x + 2, r.y + 2, r.w - 4, 1, '#fff6e2');
    txt(g, c.t, r.x + 9, r.y + 7, '#8f3a2e');
    for (let i = 0; i < TUT_DONE; i++) px(g, r.x + r.w - 12 - (TUT_DONE - 1 - i) * 7, r.y + 8, 5, 3, i < s.tut ? '#587a6d' : i === s.tut ? '#c9772f' : '#cdbd9d');
    txt(g, c.a, r.x + 9, r.y + 17, '#3a2822'); txt(g, c.b, r.x + 9, r.y + 25, '#3a2822');
    button(TUT_SKIP, 'LEWATI', false);
    const next = tutNext(); if (next) button(next, c.next, true);
  }
  const TUT_REPLAY = { x: 180, y: 79, w: 54, h: 13 };

  const bookPages = () => Math.max(1, Math.ceil(bookList().length / 6));
  const bookRows = () => bookList().slice((s.bookPage || 0) * 6, (s.bookPage || 0) * 6 + 6).map((id, i) => ({ id, x: 196, y: 106 + i * 26, w: 248, h: 24 }));
  const turnLeft = { x: 0, y: 140, w: 26, h: 80 }, turnRight = { x: 614, y: 140, w: 26, h: 80 };
  const turn = d => { const v = Math.max(LEFT, Math.min(RIGHT, s.view + d)); if (v !== s.view) { s.view = v; s.pourT = 0; s.store = null; sfx('turnView', d); } };
  const holding = id => !!s.hand && s.hand.tool === id;
  const holdingKnife = () => !!s.hand && !!KNIVES[s.hand.tool];
  const away = id => holding(id) || !!s.flying[id] || (id === 'wok' && s.world.wokInSink) || (id === 'pot' && s.world.potInSink);
  const nudge = text => { s.nudge = text; s.nudgeT = 1.8; };
  const toolHit = (id, x, y) => {
    const t = TOOL_DEFS[id], [hx, hy] = t.home;
    if (id === 'wok') return s.world.wokInSink ? inRect({ x: 28, y: 224, w: 118, h: 48 }, x, y) && !inRect(PLUG, x, y) : inRect(WOK_ZONE, x, y) || inRect(WOK_HANDLE, x, y);
    if (id === 'blender' || id === 'batterBowl') return false;
    if (id === 'pot') return s.world.potInSink ? inRect({ x: 44, y: 223, w: 92, h: 48 }, x, y) && !inRect(PLUG, x, y) : inRect(SPOTS[RIGHT].pot, x, y);
    if (KNIVES[id]) return inRect(KNIVES[id].hit, x, y);
    const pad = id === 'spoon' || id === 'pestle' ? 10 : 2;
    const lean = Math.sin(t.rest) * (t.ay / 2);
    return x >= hx + lean - t.w / 2 - pad && x <= hx + lean + t.w / 2 + pad && y >= hy - t.ay && y <= hy + (t.h - t.ay);
  };
  const itemBox = it => { const [w, h] = FOOD_SIZE[it.type]; return { x: it.x - w / 2 - 3, y: it.y - h / 2 - 5, w: w + 6, h: h + 10 }; };
  const isChopped = it => largestPiece(it).size <= PIECE_LIMIT[it.type];
  const foodOf = it => (it.coated ? 'coated' : it.battered ? it.type + (it.crumb ? '^' : '~') : isChopped(it) ? it.type + '+' : it.type);
  // Status tiap bahan: tingkat goreng dan rebus disimpan terpisah dan ikut ke mana pun bahan dipindah.
  const cookOf = o => (o.item ? o.item.cook : o.cook) || null;
  const cookVal = (o, how) => (cookOf(o) || {})[how] || 0;
  const setCook = (o, how, value) => {
    const host = o.item || o;
    host.cook = host.cook || { goreng: 0, rebus: 0 };
    host.cook[how] = Math.max(0, Math.min(1, value));
  };
  const bumbuStyle = parts => { const part = (parts || []).find(p => p.food === 'bumbu'); return part && part.cook ? part.cook.style || null : null; };
  const bumbuCook = style => ({ goreng: 0, rebus: 0, style });
  const entryFood = o => (o.item ? foodOf(o.item) : o.food);
  const foodLabel = o => FOOD_LABEL[entryFood(o)] || 'BAHAN';
  const statusOf = o => {
    const f = entryFood(o), how = cookVal(o, 'rebus') > cookVal(o, 'goreng') ? 'rebus' : 'goreng', v = cookVal(o, how);
    if (v > COOK_GOLD[1]) return { text: 'KELAMAAN', tone: 'over' };
    if (v >= COOK_GOLD[0]) return { text: how === 'rebus' ? 'DIREBUS' : 'DIGORENG', tone: 'done' };
    if (v > 0.02) return { text: 'SETENGAH', tone: 'half' };
    return { text: o.beaten ? 'DIKOCOK' : o.cracked ? 'DIPECAH' : o.item && o.item.crumb ? 'BERPANIR' : o.item && o.item.sagu ? 'TEPUNG SAGU' : f === 'coated' || f.endsWith('~') ? 'BERTEPUNG' : f === 'bumbu' ? (cookOf(o) && cookOf(o).style === 'halus' ? 'DIHALUSKAN' : 'DIULEK') : f === 'rice' ? 'BELUM GORENG' : f.endsWith('+') ? 'DIIRIS' : 'MENTAH', tone: 'raw' };
  };
  const entryText = o => foodLabel(o) + ' - ' + statusOf(o).text;
  const newPart = (food, item, cook) => { const part = { food, item: item || null }; if (!item && cook) part.cook = cook; return part; };
  const handFrom = part => ({ beaten: part.beaten, cracked: part.cracked, food: part.food, item: part.item || undefined, cuts: part.item ? part.item.cuts : undefined, cook: part.item ? undefined : part.cook });
  const withCookTint = (g, o, paint) => {
    const how = cookVal(o, 'rebus') > cookVal(o, 'goreng') ? 'rebus' : 'goreng', v = cookVal(o, how);
    if (v < COOK_GOLD[0]) { paint(); return; }
    g.save(); g.filter = how === 'rebus' ? 'saturate(.55) brightness(1.08)' : 'sepia(.7) saturate(1.3) brightness(.78)'; paint(); g.restore();
  };
  const burst = (x, y, colors, n = 6, up = 40) => {
    for (let i = 0; i < n; i++) bits.push({ v: s.view, x, y, vx: (Math.random() - 0.5) * 50, vy: -Math.random() * up, g: 170, life: 0.45 + Math.random() * 0.3, c: colors[i % colors.length] });
  };
  const wokAllCooked = wok => wok.parts.length > 0 && wok.parts.every(p => cookVal(p, 'goreng') >= COOK_GOLD[0]);
  function cookWokParts(dt, rate) {
    const wok = s.world.wok;
    if (!wok.parts.length) { wok.level = 0; return; }
    const pieceLevel = wok.pieces.length ? average(wok.pieces.map(p => (p.a + p.b) / 2)) : 0;
    const fresh = wok.pieces.length ? 1 : wok.patches.filter(age => age < 1.1).length / wok.patches.length;
    const gain = (dt * rate * Math.max(0.12, fresh)) / 6.5;
    wok.parts.forEach(part => {
      if (part.food === 'coated' && wok.pieces.length) setCook(part, 'goreng', pieceLevel);
      else if (gain > 0) setCook(part, 'goreng', cookVal(part, 'goreng') + gain);
    });
    wok.level = average(wok.parts.map(part => cookVal(part, 'goreng')));
  }
  const dishId = wok => {
    const need = s.recipe ? RECIPES[s.recipe].wok : [];
    if (need.length && need.every(f => wok.items.includes(f))) return s.recipe;
    if (wok.items.includes('kulit') && wok.items.includes('egg')) return 'martabak';
    if (wok.items.includes('mie')) return 'mie';
    if (wok.items.some(f => f.endsWith('^'))) return 'krispi';
    if (wok.items.some(f => f.endsWith('~'))) return 'gorengan';
    if (wok.items.includes('coated')) return 'pisang';
    if (wok.items.includes('beef+')) return 'daging';
    if (wok.items.includes('rice')) return 'nasi';
    if (wok.items.length === 1 && wok.items[0] === 'egg') return 'telur';
    return 'tumis';
  };
  const wokPosition = () => {
    const offset = s.hand && s.hand.offset ? s.hand.offset : [0, 0];
    return [s.mouse[0] + offset[0], s.mouse[1] + offset[1]];
  };
  const wokNearBurner = () => {
    const [x, y] = wokPosition();
    return Math.abs(x - TOOL_DEFS.wok.home[0]) < 44 && Math.abs(y - TOOL_DEFS.wok.home[1]) < 34;
  };

  const overWokForSalt = (x, y) => inRect({ x: WOK_ZONE.x, y: WOK_ZONE.y - 52, w: WOK_ZONE.w, h: WOK_ZONE.h + 52 }, x, y);
  const overPotForSalt = (x, y) => inRect({ x: 344, y: 120, w: 76, h: 130 }, x, y);
  const saltY = y => y + (Math.min(y, overPotForSalt(s.mouse[0], y) ? 166 : 224) - y) * Math.min(1, -s.tilt / Math.PI);

  function jarTarget(x, y) {
    const w = s.world;
    const near = w.things.filter(t => t.v === s.view && ['cup', 'plate', 'bowl'].includes(t.kind) && Math.abs(x - t.x) < 26 && y > t.y - 70 && y < t.y + 12).sort((a, b) => b.y - a.y)[0];
    if (near) {
      const cup = near.kind === 'cup';
      return { host: near, x: near.x, y: cup ? near.y - 16 : near.y - 3, ready: cup ? !cupDirty(near) : plateCount(near) > 0, empty: cup ? 'GELAS KOTOR, CUCI DULU' : near.kind === 'bowl' ? 'MANGKUK MASIH KOSONG' : 'PIRING MASIH KOSONG' };
    }
    if (s.view === LEFT && inRect({ x: 392, y: 86, w: 46, h: 140 }, x, y)) return { host: w.blender, x: 414, y: 142, ready: w.blender.parts.length > 0 || !!w.blender.result, empty: 'MASUKKAN BAHAN KE BLENDER DULU' };
    if (s.view !== RIGHT) return null;
    if (!w.wokInSink && overWokForSalt(x, y)) return { host: w.wok, x: 262, y: 246, ready: w.wok.items.length > 0, empty: 'MASUKKAN BAHAN KE WAJAN DULU' };
    if (!w.potInSink && overPotForSalt(x, y)) return { host: w.pot, x: POT.x, y: POT.top + 3, ready: w.pot.parts.length > 0, empty: 'MASUKKAN BAHAN KE PANCI DULU' };
    return null;
  }
  const jarY = y => {
    const spot = jarTarget(s.mouse[0], y);
    return spot ? y + (Math.min(y, spot.y - 34) - y) * Math.min(1, -s.tilt / Math.PI) : y;
  };
  const cups = () => s.world.things.filter(t => t.kind === 'cup');
  const atHome = cup => CUP_HOMES[cup.id][0] === cup.x && CUP_HOMES[cup.id][1] === cup.y && cup.v === RIGHT;
  const inServe = t => t.v === FRONT && inRect(SERVE_ZONE, t.x, t.y - 4);
  // Isi gelas: air saja tetap bening, baru jadi kopi kalau ada bubuknya.
  const CUP_SINK = [[58, 258], [84, 263], [108, 256]];
  const cupDirty = cup => !!cup.dirty && cup.water <= 0 && !cup.powder;
  // Aturan kotor: air bersih dan bahan utuh tidak mengotori, sisa makanan dan minuman mengotori.
  const cupHasResidue = cup => !!(cup.powder || (cup.juice && cup.water > 0) || spiceEntries(cup.spices).length);
  const cupServable = cup => cup.water >= 0.6 && !!(cup.powder || cup.juice);
  const partLeavesMess = p => {
    const food = entryFood(p);
    if (p.cracked || p.beaten || cookVal(p, 'goreng') > 0.02 || cookVal(p, 'rebus') > 0.02) return true;
    if (p.item && p.item.cuts && p.item.cuts.length) return true;
    return food !== 'egg' && !FOOD_SIZE[food];
  };
  const holderMessy = t => !!t.dish || (t.fill || 0) > 0 || (t.sides || []).length > 0 || spiceEntries(t.spices).length > 0 || (t.parts || []).some(partLeavesMess);
  const cupToSink = cup => { cup.v = RIGHT; [cup.x, cup.y] = CUP_SINK[cup.id]; cup.water = 0; cup.powder = false; cup.spices = {}; cup.juice = null; cup.dirty = true; cup.used = false; };
  const isKopi = cup => cup.powder && cup.water >= 0.6 && !cup.cold;
  // Gelas yang dipegang di bawah keran menampung air dingin.
  const cupUnderTap = () => s.view === RIGHT && s.world.tapOn && !!s.hand && s.hand.food === 'cup' && Math.abs(s.mouse[0] - 111) < 22 && s.mouse[1] >= 214 && s.mouse[1] <= 262;
  const cupFill = cup => (cup.juice && cup.water > 0 ? cup.juice.c : cup.powder
    ? (cup.water >= 0.6 ? '#2a1a17' : cup.water > 0 ? '#5f4032' : '#5a3a2d')
    : (cup.water >= 0.6 ? '#b9d8dc' : cup.water > 0 ? '#8fb4ba' : null));
  const thingRect = t => {
    if (t.kind === 'cup') return { x: t.x - 12, y: t.y - 21, w: 28, h: 27 };
    if (t.kind === 'plate') return { x: t.x - 29, y: t.y - 13, w: 58, h: 25 };
    if (t.kind === 'bowl') return { x: t.x - 24, y: t.y - 15, w: 48, h: 25 };
    if (t.item) { const b = itemBox(t.item); return { x: t.x - b.w / 2, y: t.y - b.h / 2, w: b.w, h: b.h }; }
    return { x: t.x - 17, y: t.y - 11, w: 34, h: 22 };
  };
  const thingName = t => {
    if (t.kind === 'cup') {
      if (t.juice && t.water > 0) return t.juice.name + (t.water < 0.6 ? ' SEDIKIT' : '');
      const top = spiceEntries(t.spices)[0], extra = top ? SPICE_BY_ID[top[0]].name : '';
      if (t.powder) return t.water >= 0.6 ? (t.cold ? 'KOPI DINGIN' : 'KOPI') + (extra ? ' ' + extra : '') : (t.water > 0 ? 'KOPI KENTAL' : 'GELAS ISI BUBUK') + (extra ? ' + ' + extra : '');
      if (t.water >= 0.6) return extra ? 'AIR ' + extra : t.cold ? 'AIR KERAN' : 'AIR PANAS';
      return (t.water > 0 ? 'AIR SEDIKIT' : t.dirty ? 'GELAS KOTOR' : 'GELAS') + (extra ? ' + ' + extra : '');
    }
    if ((t.kind === 'plate' || t.kind === 'bowl') && t.dirty) return t.kind === 'plate' ? 'PIRING KOTOR' : 'MANGKUK KOTOR';
    if (t.kind === 'plate' || t.kind === 'bowl') { const taste = tasteText(t.spices); return plateName(t) + (taste ? ' - ' + taste : ''); }
    return entryText(t);
  };
  const blockedRects = v => (v === LEFT
    ? ['rice', 'eggs', 'cobek', 'bin', 'blender', 'flour', 'sagu', 'crumb', 'pin'].map(k => SPOTS[LEFT][k])
    : v === FRONT ? ['book', 'plant', 'mug', 'caddy', 'tin', 'radio', 'bunga'].map(k => SPOTS[FRONT][k])
      : [{ x: 172, y: 206, w: 300, h: 84 }, { x: 150, y: 230, w: 22, h: 24 }, SPOTS[RIGHT].plates, BOWL_STACK, SPOTS[RIGHT].cups]);
  function freeSpot(v, x, y, self) {
    const area = COUNTER[v], w = s.world;
    const clampX = n => Math.max(area.x, Math.min(area.x + area.w, n)), clampY = n => Math.max(area.y, Math.min(area.y + area.h, n));
    const wide = self === 'batterBowl', padX = wide ? 34 : 6, padY = wide ? 14 : 4;
    const open = (px0, py0) => !blockedRects(v).some(r => inRect({ x: r.x - padX, y: r.y - padY, w: r.w + padX * 2, h: r.h + padY * 2 }, px0, py0))
      && !w.things.some(t => t !== self && t.v === v && Math.abs(t.x - px0) < (wide ? 48 : 25) && Math.abs(t.y - py0) < (wide ? 25 : 15))
      && (wide || v !== BATTER.v || !inRect({ x: BATTER_ZONE.x - 8, y: BATTER_ZONE.y - 6, w: BATTER_ZONE.w + 16, h: BATTER_ZONE.h + 12 }, px0, py0))
      && !(v === LEFT && w.board.some(b => Math.abs(b.x - px0) < 30 && Math.abs(b.y - py0) < 16));
    const startX = clampX(x), startY = clampY(y);
    if (open(startX, startY)) return [Math.round(startX), Math.round(startY)];
    for (let radius = 6; radius <= 420; radius += 6) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2, nx = clampX(startX + Math.cos(a) * radius), ny = clampY(startY + Math.sin(a) * radius * 0.45);
        if (open(nx, ny)) return [Math.round(nx), Math.round(ny)];
      }
    }
    return [Math.round(startX), Math.round(startY)];
  }
  function putThing(t, x, y, exact = false) {
    const w = s.world;
    t.v = s.view;
    const spot = exact ? [x, y] : freeSpot(s.view, x, y, t);
    t.x = spot[0]; t.y = spot[1];
    if (t.item) { t.item.x = t.x; t.item.y = t.y; }
    if (!w.things.includes(t)) w.things.push(t);
    return t;
  }
  const spotFree = (x, y, self) => !s.world.things.some(t => t !== self && t.v === s.view && Math.abs(t.x - x) < 20 && Math.abs(t.y - y) < 12);
  const plateCount = p => (p.dish ? 1 : 0) + (p.sides || []).length + (p.parts || []).length;
  const comboName = p => {
    const tokens = new Set([...(p.dish ? [p.dish.id] : []), ...(p.sides || [])]);
    (p.parts || []).forEach(part => {
      const fried = cookVal(part, 'goreng') >= COOK_GOLD[0];
      if (part.food === 'rice') tokens.add(fried ? 'nasi' : 'putih');
      if (part.food === 'bumbu') tokens.add('sambal');
      if (fried && part.food === 'egg') tokens.add('telur');
      if (fried && part.food === 'beef+') tokens.add('daging');
      if (fried && part.food === 'coated') tokens.add('pisang');
    });
    const match = COMBOS.find(([need]) => need.every(token => tokens.has(token)));
    return match ? match[1] : '';
  };
  const plateName = p => comboName(p) || (p.dish ? DISH_NAMES[p.dish.id] : plateCount(p) ? (p.kind === 'bowl' ? 'MANGKUK ISI ' : 'PIRING ISI ') + plateCount(p) : p.kind === 'bowl' ? 'MANGKUK' : 'PIRING');
  const plateAt = (x, y) => [...s.world.things].reverse().find(t => t.kind === 'plate' && t.v === s.view && inRect(thingRect(t), x, y));
  const containerAt = (x, y) => [...s.world.things].reverse().find(t => (t.kind === 'plate' || t.kind === 'bowl') && !t.dirty && t.v === s.view && inRect(thingRect(t), x, y));
  const bowls = () => s.world.things.filter(t => t.kind === 'bowl');
  const potNeeds = () => (s.recipe && RECIPES[s.recipe].soup) || null;
  const potFoods = () => s.world.pot.parts.map(p => p.food);
  const potAllCooked = () => s.world.pot.parts.length > 0 && s.world.pot.parts.every(p => cookVal(p, 'rebus') >= COOK_GOLD[0]);
  const soupId = () => { const need = potNeeds(), foods = potFoods(); if (need && need.every(f => foods.includes(f))) return s.recipe; if (foods.includes('beef+') && foods.includes('bumbu')) return 'soto'; return foods.includes('beef+') ? 'sup' : 'kuah'; };
  const inPlateCenter = (p, x, y) => ((x - p.x) / 17) ** 2 + ((y - p.y) / 7) ** 2 <= 1;
  const servablePlate = t => (t.kind === 'plate' && (t.dish || comboName(t))) || (t.kind === 'bowl' && t.dish && t.fill >= 0.6);
  function announcePlate(p) {
    const name = comboName(p);
    if (name && name !== p.lastName) {
      nudge('JADI ' + name + '!');
      sfx('combo');
      burst(p.x, p.y - 8, ['#ffe2a6', '#f5eddb', '#e8b64c'], 10, 44);
    }
    p.lastName = name;
  }
  function addToPlate(p, f, item, x, y, cook) {
    p.parts = p.parts || []; p.sides = p.sides || [];
    if (plateCount(p) >= MAX_COOK_PARTS) { nudge('PIRING PENUH, BAHAN DITARUH DI MEJA'); putThing({ kind: 'food', ...newPart(f, item, cook) }, x, y + 16); return; }
    p.parts.push(newPart(f, item, cook));
    if (p.kind === 'bowl' && f === 'egg' && !cook) { p.parts[p.parts.length - 1].cracked = true; sfx('eggCrack'); burst(p.x, p.y - 6, ['#fff8ea', '#e8a93c'], 5, 20); nudge('TELUR DIPECAH, BAWA MANGKUK KE WAJAN'); return; }
    sfx('foodPlate');
    announcePlate(p);
  }
  function drawPlateFull(g, p, x, y) {
    if (p.kind === 'bowl') drawBowl(g, p, x, y, s.t); else plateArt(g, x, y, p.dish || null);
    let slot = p.dish ? 1 : 0;
    if (p.kind === 'bowl') y -= 6;
    (p.sides || []).forEach(id => { const [a, b] = PLATE_SLOTS[slot++ % 6]; drawDishBit(g, id, x + a, y + b); });
    (p.parts || []).forEach(part => {
      const [a, b] = PLATE_SLOTS[slot++ % 6];
      g.save(); g.translate(Math.round(x + a), Math.round(y + b)); g.scale(0.5, 0.5); withCookTint(g, part, () => { if (part.food === 'egg' && (part.cracked || part.beaten)) paintCrackedEgg(g, 0, 0, part.beaten); else drawFood(g, part.food, 0, 0); }); g.restore();
    });
    drawSpiceSpecks(g, p.spices, x, y - 2, p.kind === 'bowl' ? 12 : 16, p.kind === 'bowl' ? 2 : 4);
    if (p.dirty) {
      scatter(g, x, p.kind === 'bowl' ? y - 1 : y, p.kind === 'bowl' ? 12 : 16, p.kind === 'bowl' ? 2 : 4, 16, ['#8a5a30', '#6d4a2c', '#b98a4e'], 6);
      g.globalAlpha = 0.5; curve(g, x - 10, y + 1, x, y - 3, x + 11, y, '#a87a4a', 1); g.globalAlpha = 1;
    }
  }

  const seatRect = i => ({ x: CUSTOMER_SEATS[i] - 44, y: 96, w: 88, h: 96 });
  const guestPrice = id => 5000 + RECIPES[id].steps.length * 1000;
  const money = n => 'RP ' + Math.round(n).toLocaleString('id-ID');
  const guestWants = id => s.world.guests.some(p => p && ['arrive', 'think', 'wait'].includes(p.state) && p.order === id);
  const drinkOf = t => (t.kind === 'cup' && t.juice && t.water >= 0.6 ? DRINK_BY_NAME[t.juice.name] || null : null);
  const dishIdOf = t => (t.kind === 'cup' ? (isKopi(t) ? 'kopi' : drinkOf(t)) : t.dish ? t.dish.id : null);
  const guestWantsThing = t => { const id = dishIdOf(t); return !!id && guestWants(id); };
  const bubbleRect = i => {
    const p = s.world.guests[i], name = p ? RECIPES[p.order].name : '', w = Math.max(44, textW(name) + 32);
    return { x: Math.round(CUSTOMER_SEATS[i] - w / 2), y: 72, w, h: 23 };
  };
  const cashAt = (x, y) => s.world.cash.find(m => inRect({ x: CUSTOMER_SEATS[m.seat] + 24, y: 168, w: 34, h: 20 }, x, y));
  const drawerAt = (x, y) => CASH_DRAWERS.findIndex(d => inRect(d, x, y));
  function guestSprite(p) {
    if (!s.guestSprites[p.seed]) {
      const raw = customerSprite(randomLook(p.seed));
      s.guestSprites[p.seed] = layer(CHAR_W, CHAR_H, g => { g.drawImage(raw, 0, 0); tintLayer(g, CHAR_W, CHAR_H); });
    }
    return s.guestSprites[p.seed];
  }
  function drawGuests(g) {
    s.world.guests.forEach((p, i) => {
      if (!p) return;
      const k = p.state === 'arrive' ? 1 - Math.min(1, p.t / 0.7) : p.state === 'leave' ? Math.min(1, p.t / 0.7) : 0;
      const bob = p.state === 'eat' ? Math.round(Math.abs(Math.sin(s.t * 6 + i)) * 2) : Math.round(Math.sin(s.t * 1.4 + i * 2) * 0.6);
      g.drawImage(guestSprite(p), CUSTOMER_SEATS[i] - CHAR_W / 2, 100 + bob + Math.round(k * k * 84));
    });
  }
  function drawOrderIcon(g, id, x, y) {
    const r = RECIPES[id];
    if (id === 'kopi' || r.drink) { g.save(); g.translate(x, y + 8); g.scale(0.62, 0.62); miniCup(g, 0, 0, r.drink ? BLEND_COLORS[r.drink] : '#2a1a17'); g.restore(); }
    else if (r.soup) { g.save(); g.translate(x, y + 2); g.scale(0.5, 0.5); drawBowl(g, { dish: { id }, fill: 1 }, 0, 0); g.restore(); }
    else { ell(g, x, y + 2, 12, 4, '#d8ccb2'); drawDishBit(g, id, x, y); }
  }
  function drawGuestUI(g) {
    const w = s.world;
    w.guests.forEach((p, i) => {
      if (!p) return;
      const cx = CUSTOMER_SEATS[i];
      if (p.state === 'think') {
        px(g, cx - 16, 80, 32, 15, '#1c1519'); px(g, cx - 15, 81, 30, 13, '#f4ead5');
        for (let n = 0; n < 3; n++) px(g, cx - 7 + n * 6, 86 - (Math.floor(s.t * 3) % 3 === n ? 1 : 0), 3, 3, '#5c2f28');
      }
      if (p.state === 'wait') {
        const r = bubbleRect(i), on = s.recipe === p.order, hot = inRect(r, s.mouse[0], s.mouse[1]), name = RECIPES[p.order].name;
        px(g, r.x - 1, r.y - 1, r.w + 2, r.h + 2, on ? '#e8b64c' : '#1c1519');
        px(g, r.x, r.y, r.w, r.h, hot ? '#fff6dc' : '#f4ead5'); px(g, r.x, r.y, r.w, 1, '#fffaf0');
        for (let n = 0; n < 4; n++) px(g, cx - 4 + n, r.y + r.h + n, 9 - n * 2, 1, on ? '#e8b64c' : '#f4ead5');
        drawOrderIcon(g, p.order, r.x + 14, r.y + 10);
        txt(g, name, r.x + 28, r.y + 5, '#3a2822');
        txt(g, money(guestPrice(p.order)), r.x + 28, r.y + 13, '#7a5a42');
      }
      if (p.state === 'eat') {
        for (let n = 0; n < 3; n++) drawStar(g, cx - 15 + n * 10, 84, n < p.stars);
        const bar = Math.min(1, p.t / EAT_TIME);
        px(g, cx - 17, 96, 34, 3, '#1c1519'); px(g, cx - 16, 97, Math.round(32 * bar), 1, '#9fdc9a');
      }
    });
    w.cash.forEach(m => drawMoneyPile(g, CUSTOMER_SEATS[m.seat] + 40, 178));
  }
  function drawDrawers(g) {
    const w = s.world;
    CASH_DRAWERS.forEach((d, n) => {
      const k = s.drawerK[n], cx = d.x + d.w / 2, amount = n ? w.moneyR : w.moneyL;
      if (k <= 0.01) { txtC(g, money(amount), cx, d.y + 46, '#ffe9bd'); return; }
      // Laci terbuka: bagian dalam terlihat, muka laci turun ke depan.
      const inner = Math.round(40 * k), lip = d.y + inner;
      px(g, d.x - 2, d.y - 1, d.w + 4, d.h + 2, '#120c0a');
      px(g, d.x + 4, d.y, d.w - 8, inner + 1, '#2a1b15');
      px(g, d.x + 4, d.y, d.w - 8, 3, '#120c0a');
      px(g, d.x + 4, d.y, 2, inner + 1, '#5a3d2a'); px(g, d.x + d.w - 6, d.y, 2, inner + 1, '#3a2418');
      const rooms = n ? 2 : 4, roomW = (d.w - 20) / rooms;
      for (let r = 0; r < rooms; r++) {
        const rx = Math.round(d.x + 10 + r * roomW), rw = Math.round(roomW) - 4;
        if (inner > 8) { px(g, rx, d.y + 4, rw, inner - 6, '#4a3226'); px(g, rx, d.y + 4, rw, 1, '#1a120e'); px(g, rx, d.y + inner - 3, rw, 1, '#6b4b36'); }
      }
      if (inner > 14) {
        const count = amount > 0 ? Math.min(30, Math.ceil(amount / 2500)) : 0;
        for (let c0 = 0; c0 < count; c0++) {
          const r = c0 % rooms, rx = d.x + 10 + r * roomW, a = Math.round(rx + 12 + noise(c0, n + 3) * (roomW - 28)), b = Math.round(d.y + 10 + noise(n + 7, c0) * Math.max(1, inner - 18));
          if (n === 0) { ell(g, a, b + 1, 5, 3, '#7c5a22'); ell(g, a, b, 4, 3, c0 % 3 ? '#e3bf72' : '#c9ccd0'); px(g, a - 2, b - 1, 2, 1, '#fff2bf'); }
          else { px(g, a - 13, b - 4, 26, 10, '#234634'); px(g, a - 12, b - 4, 24, 9, c0 % 2 ? '#86b394' : '#5f8f72'); px(g, a - 10, b - 2, 20, 5, c0 % 2 ? '#74a184' : '#527f64'); ell(g, a, b, 2, 2, '#2f5a42'); }
        }
      }
      const faceH = d.y + d.h - lip;
      px(g, d.x - 2, lip - 1, d.w + 4, faceH + 2, '#1a120e');
      for (let y = lip; y < d.y + d.h; y++) px(g, d.x, y, d.w, 1, y === lip ? '#d0a878' : y % 5 === 0 ? '#6b4631' : '#845a3c');
      [d.x, d.x + d.w - 7].forEach(x => { px(g, x, lip, 7, faceH, '#6d4b22'); px(g, x + 1, lip + 1, 5, Math.max(1, faceH - 2), '#c79a4e'); });
      if (faceH >= 12) {
        txt(g, d.name, d.x + 14, lip + Math.round(faceH / 2) - 2, '#ffe9bd');
        const text = money(amount); txt(g, text, d.x + d.w - 14 - textW(text), lip + Math.round(faceH / 2) - 2, '#ffe9bd');
        px(g, cx - 24, lip + Math.round(faceH / 2) - 2, 48, 5, '#2c1d13'); px(g, cx - 23, lip + Math.round(faceH / 2) - 2, 46, 3, '#d7ad5e'); px(g, cx - 23, lip + Math.round(faceH / 2) - 2, 46, 1, '#ffe8aa');
      }
    });
  }
  function serveGuest(i, item) {
    const w = s.world, p = w.guests[i];
    if (!p || p.state !== 'wait') return false;
    const id = dishIdOf(item);
    if (id !== p.order) { nudge('PESANANNYA ' + RECIPES[p.order].name); return false; }
    if (item.kind === 'bowl' && item.fill < 0.6) { nudge('KUAHNYA MASIH KURANG'); return false; }
    item.v = FRONT; item.x = CUSTOMER_SEATS[i]; item.y = item.kind === 'cup' ? 184 : 180; item.atSeat = i;
    if (!w.things.includes(item)) w.things.push(item);
    const made = finishDish(item, id);
    p.state = 'eat'; p.t = 0; p.stars = made.stars;
    p.pay = guestPrice(id) + (made.stars === 3 ? 2000 : made.stars === 2 ? 1000 : 0);
    burst(item.x, item.y - 8, ['#ffe2a6', '#f5eddb', '#e8b64c'], 10, 42);
    sfx('stars', made.stars);
    nudge(made.stars === 3 ? 'PELANGGAN SUKA SEKALI!' : made.stars === 2 ? 'ENAK, KATA PELANGGAN' : 'LUMAYAN, KATA PELANGGAN');
    return true;
  }
  function updateGuests(dt) {
    const w = s.world;
    w.guests.forEach((p, i) => {
      if (!p) return;
      p.t += dt;
      if (p.state === 'arrive' && p.t >= 0.7) { p.state = 'think'; p.t = 0; }
      else if (p.state === 'think' && p.t >= 1.4) { p.state = 'wait'; p.t = 0; sfx('orderBell'); if (s.view !== FRONT) nudge('ADA PESANAN BARU DI DEPAN'); }
      else if (p.state === 'eat' && p.t < EAT_TIME) {
        p.biteT = (p.biteT === undefined ? 1.2 : p.biteT) - dt;
        if (p.biteT <= 0) {
          const item = w.things.find(q => q.atSeat === i), drink = item && item.kind === 'cup';
          p.biteT = drink ? 8 + Math.random() * 8 : 2.6 + Math.random() * 4.6;
          sfx(drink ? 'eatSip' : 'eatSpoon', i);
        }
      } else if (p.state === 'eat') {
        const t = w.things.find(q => q.atSeat === i);
        if (t) {
          t.dirty = true; t.spices = {};
          if (t.kind === 'cup') { t.water = 0; t.powder = false; t.juice = null; t.used = false; }
          else { t.dish = null; t.parts = []; t.sides = []; t.lastName = ''; if (t.kind === 'bowl') t.fill = 0; }
        }
        w.cash.push({ seat: i, amount: p.pay });
        p.state = 'leave'; p.t = 0; sfx('eatDone', i); sfx('coinsDown'); sfx('guestLeave', i);
      } else if (p.state === 'leave' && p.t >= 0.7) w.guests[i] = null;
    });
    if (!s.recipe && !s.result && !s.book) { const next = w.guests.find(p => p && p.state === 'wait'); if (next) { s.recipe = next.order; syncDone(); } }
    if (s.tut >= TUT_DONE) s.guestT -= dt;
    if (s.guestT <= 0) {
      s.guestT = 32 + Math.random() * 24;
      const open = w.guests.map((p, i) => i).filter(i => !w.guests[i] && !w.things.some(t => t.atSeat === i) && !w.cash.some(m => m.seat === i));
      const waiting = w.guests.filter(p => p && ['arrive', 'think', 'wait'].includes(p.state)).length;
      if (open.length && waiting < 3) {
        const seat = open[Math.floor(Math.random() * open.length)], ids = s.unlocked;
        w.guests[seat] = { seed: Math.floor(Math.random() * 1e9), order: s.made === 0 && !w.guests.some(Boolean) ? 'kopi' : ids[Math.floor(Math.random() * ids.length)], state: 'arrive', t: 0, stars: 0, pay: 0 };
        sfx('guestArrive', seat);
      } else s.guestT = 8;
    }
    const carrying = s.hand && s.hand.money !== undefined;
    CASH_DRAWERS.forEach((d, n) => {
      const want = s.drawerOpen[n] || (carrying && s.view === FRONT && inRect({ x: d.x, y: d.y - 16, w: d.w, h: d.h + 16 }, s.mouse[0], s.mouse[1])) ? 1 : 0;
      s.drawerK[n] += Math.max(-dt / 0.14, Math.min(dt / 0.14, want - s.drawerK[n]));
    });
  }
  const addDirty = kind => { s.world.sink.push(kind === 'bowl' ? 'bowl' : 'plate'); };
  // Sisa tumpukan dihitung dari barang yang sedang dipakai, jadi piring dan mangkuk tidak bisa hilang atau bertambah.
  const stackLeft = kind => {
    const w = s.world, max = kind === 'bowl' ? MAX_BOWLS : MAX_PLATES;
    const held = s.hand && (kind === 'bowl' ? s.hand.food === 'bowl' : s.hand.food === 'plateEmpty' || s.hand.food === 'plateReady') ? 1 : 0;
    return Math.max(0, max - w.things.filter(t => t.kind === kind).length - w.sink.filter(k => k === kind).length - held);
  };
  function addSpill(v, x, y, c) {
    const list = s.world.spills, area = COUNTER[v];
    if (list.length >= 18) return;
    list.push({ v, x: Math.round(Math.max(area.x + 6, Math.min(area.x + area.w - 6, x))), y: Math.round(Math.max(area.y + 3, Math.min(area.y + area.h - 3, y))), r: 3 + Math.floor(Math.random() * 4), c, a: 1, seed: Math.floor(Math.random() * 50) });
  }
  const spillNearWok = c => { const side = Math.random() < 0.5 ? -1 : 1; addSpill(RIGHT, 262 + side * (46 + Math.random() * 26), 236 + Math.random() * 28, c); };
  function drawSpills(g, v) {
    s.world.spills.filter(p => p.v === v).forEach(p => drawSpillShape(g, p));
  }
  function sinkSurface() {
    const l = Math.min(1, s.world.sinkWater / 0.9), mix = (a, b) => Math.round(a + (b - a) * l);
    return { back: mix(246, 230), front: 271, bl: mix(44, 35), br: mix(130, 139), fl: mix(36, 27), fr: mix(138, 147) };
  }
  function drawSink(g) {
    const w = s.world;
    if (w.plug) {
      ell(g, 130, 262, 8, 3, '#141318'); ell(g, 130, 261, 7, 3, '#3f3d45'); ell(g, 128, 260, 3, 1, '#6d6a73');
      px(g, 129, 258, 3, 3, '#c9c7c6');
      for (let i = 0; i <= 10; i++) { const k = i / 10; px(g, 130 + 13 * k, 258 - 24 * k + Math.sin(k * Math.PI) * 2, 1, 1, i % 2 ? '#d8d6d3' : '#77757b'); }
    } else {
      ell(g, 143, 244, 5, 3, '#141318'); ell(g, 143, 243, 4, 2, '#3f3d45'); px(g, 142, 240, 3, 2, '#c9c7c6');
      for (let i = 0; i <= 6; i++) px(g, 143, 234 + i, 1, 1, i % 2 ? '#d8d6d3' : '#77757b');
    }
    w.sink.slice(-6).forEach((kind, i) => {
      const x = 66 + i * 3, y = 258 - i * 3;
      if (kind === 'bowl') { ell(g, x, y, 16, 7, '#7f705e'); ell(g, x, y - 2, 15, 6, '#d9cdb3'); ell(g, x, y - 2, 10, 3, '#a58c63'); }
      else { ell(g, x, y, 20, 6, '#7f705e'); ell(g, x, y - 1, 19, 5, '#e2d7bf'); ell(g, x, y - 1, 12, 3, '#c9b88f'); }
      scatter(g, x, y - 2, 11, 3, 8, ['#8a5a30', '#6d4a2c', '#b98a4e'], i + 4);
    });
    drawSinkWater(g);
    // Gagang keran berputar saat dibuka.
    const a = w.tapOn ? 0.9 : 0, hx = 161, hy = 211;
    px(g, 151, hy - 1, hx - 151, 3, '#3a2614'); px(g, 151, hy - 1, hx - 151, 2, '#d7ad5e');
    for (let i = -6; i <= 6; i++) { px(g, hx + Math.cos(a) * i - 1, hy + Math.sin(a) * i * 0.6 - 1, 3, 3, '#3a2614'); }
    for (let i = -5; i <= 5; i++) { px(g, hx + Math.cos(a) * i, hy + Math.sin(a) * i * 0.6, 2, 1, '#f0d183'); }
    ell(g, hx, hy, 2, 2, w.tapOn ? '#5fc1dc' : '#c9574a');
  }
  function drawPotOverflow(g, age) {
    // Air melimpah sebagai lapisan tipis yang mengikuti lengkung badan panci.
    const cx = POT_IN_SINK[0], rim = POT_IN_SINK[1], flow = Math.min(1, age / 0.45);
    for (let i = -35; i <= 35; i++) {
      const edge = Math.sqrt(Math.max(0, 1 - (i / 37) ** 2)), top = rim + Math.round(edge * 10);
      const wave = Math.sin(i * 0.42 + s.t * 2.4) * 2 + Math.sin(i * 0.17 - s.t * 1.3) * 2;
      const len = Math.max(2, Math.round((47 + wave) * flow));
      g.globalAlpha = 0.2 + edge * 0.14; px(g, cx + i, top, 1, len, '#9bdcec');
      g.globalAlpha = 0.72; px(g, cx + i, top + len - 1, 1, 1, '#d8f6fb');
      if (i % 3 === 0) {
        const speed = 34 + noise(i + 40, 3) * 26, y = (s.t * speed + noise(3, i + 40) * 60) % Math.max(4, len);
        g.globalAlpha = 0.62; px(g, cx + i, top + Math.round(y), 1, 3 + (i & 2), '#effcff');
      }
    }
    g.globalAlpha = 0.95;
    for (let i = -35; i <= 35; i++) px(g, cx + i, rim + Math.round(Math.sqrt(Math.max(0, 1 - (i / 37) ** 2)) * 10), 1, 1, Math.sin(i * 0.7 + s.t * 7) > 0.2 ? '#ffffff' : '#b9eaf3');
    if (flow >= 1) {
      g.globalAlpha = 0.85;
      for (let n = 0; n < 9; n++) {
        const k = (s.t * 2.6 + n * 0.37) % 1, a = 0.25 + (n / 8) * 2.65;
        px(g, cx + Math.cos(a) * (38 + k * 9), 258 + Math.sin(a) * (10 + k * 3) - Math.sin(k * Math.PI) * 4, 1, 1, '#f4feff');
      }
    }
    g.globalAlpha = 1;
  }
  function drawSinkWater(g) {
    const w = s.world, p = sinkSurface(), level = w.sinkWater, dirt = w.sinkDirt || 0;
    if (level > 0.005) {
      const body = dirt > 0.45 ? '#8f8a6a' : dirt > 0.15 ? '#6f9f9f' : '#58aac8';
      g.globalAlpha = Math.min(0.68, 0.3 + level * 0.5);
      poly(g, [[p.bl, p.back], [p.br, p.back], [p.fr, p.front], [p.fl, p.front]], body);
      g.globalAlpha = 0.85; px(g, p.bl, p.back, p.br - p.bl + 1, 1, '#d8f4f8');
      g.globalAlpha = 0.5;
      for (let i = 0; i < 5; i++) {
        const y = Math.round(p.back + 3 + ((s.t * 3 + i * 4.3) % Math.max(4, p.front - p.back - 4)));
        const x = 46 + (noise(i, 7) * 66) + Math.sin(s.t * 1.7 + i) * 5;
        px(g, x, y, 8 + (i % 3) * 4, 1, '#e8fbff');
      }
      g.globalAlpha = 1;
      if (!w.plug && !w.tapOn) {
        for (let n = 0; n < 3; n++) for (let t = 0; t < 1; t += 0.1) {
          const ang = s.t * 7 + n * 2.09 + t * 3.4, r = 2 + t * 9;
          g.globalAlpha = 0.75 * (1 - t); px(g, 130 + Math.cos(ang) * r, 262 + Math.sin(ang) * r * 0.42, 1, 1, '#eafcff');
        }
        g.globalAlpha = 1;
      }
    }
  }
  function drawTapWater(g) {
    const w = s.world, p = sinkSurface(), level = w.sinkWater;
    const mid = (p.back + p.front) / 2;
    if (level > 0.05 && (w.potInSink || w.wokInSink)) {
      // Riak air melingkari alat yang berdiri di bak.
      const cx = w.potInSink ? POT_IN_SINK[0] : WOK_IN_SINK[0], rx = w.potInSink ? 38 : 47, ry = w.potInSink ? 10 : 12;
      const cy = (w.potInSink ? 260 : 253) - Math.round(level * 10);
      g.globalAlpha = 0.75;
      for (let a = 0.05; a < Math.PI - 0.05; a += 0.035) px(g, cx + Math.cos(a) * (rx + Math.sin(s.t * 3 + a * 5)), cy + Math.sin(a) * ry, 2, 1, Math.sin(a * 9 + s.t * 2) > 0.3 ? '#effcff' : '#a9dfea');
      g.globalAlpha = 1;
    }
    if (w.tapOn) {
      const end = cupUnderTap() ? s.mouse[1] - 12 : w.potInSink ? POT_IN_SINK[1] + 3 : w.wokInSink ? 250 : level > 0.02 ? Math.round(mid) : 256;
      for (let y = 198; y < end; y++) { const x = 110 + Math.round(Math.sin(y * 0.4 + s.t * 24) * 0.7); px(g, x, y, 3, 1, y % 5 === 0 ? '#e8fbff' : '#8fd2e6'); }
      const r = 6 + Math.round((s.t * 7) % 7);
      g.globalAlpha = 0.75; ell(g, 111, end, 7, 2, '#e6faff'); g.globalAlpha = 0.28; ell(g, 111, end, r + 5, Math.max(2, Math.round(r * 0.45)), '#e6faff'); g.globalAlpha = 1;
      for (let i = 0; i < 4; i++) { const k = (s.t * 4 + i * 0.27) % 1; px(g, 111 + Math.cos(i * 1.9) * k * 12, end - Math.sin(k * Math.PI) * 6, 1, 1, '#f4feff'); }
    }
    if (w.potInSink && w.tapOn && w.potWater >= 1) {
      if (s.potFullT < POT_OVERFLOW_AFTER) {
        // Lima titik menghitung waktu sebelum air meluap.
        const lit = Math.min(5, Math.floor(s.potFullT));
        for (let i = 0; i < 5; i++) { px(g, 56 + i * 9, 192, 7, 3, '#1c1519'); px(g, 57 + i * 9, 193, 5, 1, i < lit ? (lit >= 4 ? '#e8693c' : '#e8b64c') : '#5a4a42'); }
      } else drawPotOverflow(g, s.potFullT - POT_OVERFLOW_AFTER);
    }
    if (s.foam > 0) {
      for (let i = 0; i < 18; i++) {
        const fx = 87 + (noise(i, 2) - 0.5) * 98 + Math.sin(s.t * 3 + i) * 2, fy = p.back + 3 + noise(3, i) * Math.max(6, p.front - p.back - 6);
        g.globalAlpha = Math.min(0.9, s.foam); ell(g, fx, fy, 2 + (i % 3), 1 + (i % 2), '#f8fdff'); g.globalAlpha = 1;
      }
    }
  }
  function drawFanControl(g) {
    const w = s.world, r = FAN_SWITCH;
    if (w.fan) for (let x = 198; x < 424; x += 16) { px(g, x + (Math.floor(s.fanSpin * 3) % 3) * 3, 95, 3, 2, '#c7c2c4'); }
    px(g, r.x, r.y, r.w, r.h, '#17151b'); px(g, r.x + 1, r.y + 1, r.w - 2, r.h - 2, '#3b3840');
    const cx = r.x + 7, cy = r.y + 7;
    for (let i = 0; i < 3; i++) { const a = s.fanSpin + i * 2.09; px(g, cx + Math.cos(a) * 3 - 1, cy + Math.sin(a) * 3 - 1, 2, 2, w.fan ? '#d8e6e8' : '#77727a'); }
    px(g, cx, cy, 1, 1, '#17151b');
    px(g, r.x + 16, r.y + 4, 6, 6, '#17151b'); px(g, r.x + 17, r.y + 5, 4, 4, w.fan ? '#74e08a' : '#7a3a34'); if (w.fan) px(g, r.x + 17, r.y + 5, 2, 1, '#d7ffdf');
  }
  function washTarget() {
    const w = s.world;
    if (w.wokInSink) return 'wok';
    return w.things.find(t => t.v === RIGHT && ['cup', 'plate', 'bowl'].includes(t.kind) && inRect(SINK, t.x, t.y)) || (w.sink.length ? 'pile' : null);
  }
  function scrub(x, y, moved) {
    const w = s.world;
    if (!w.tapOn && w.sinkWater < 0.1) { nudge('BUKA KERAN ATAU ISI AIR DULU'); return; }
    const t = washTarget();
    if (!t) { if (s.nudgeT <= 0) nudge('TIDAK ADA YANG PERLU DICUCI'); return; }
    if (t === 'wok') {
      const gain = (Math.min(moved, 16) / 260) * (w.sinkWater >= 0.3 ? 1.4 : 1);
      s.wash = Math.min(1, s.wash + gain); s.foam = 1;
      w.wokGrime = Math.max(0, w.wokGrime - gain);
      if (Math.random() < 0.3) burst(x, y, ['#f8fdff', '#c9eff6', '#8a6a3e'], 2, 22);
      s.meter = { v: RIGHT, x: 90, y: 212, value: s.wash, zone: null, t: 0.4 };
      if (s.wash < 1) return;
      s.wash = 0;
      if (w.sinkWater > 0.02) w.sinkDirt = Math.min(1, (w.sinkDirt || 0) + 0.25);
      w.wok = freshWok(); w.wokGrime = 0; w.wokInSink = false;
      s.flying.wok = { x: WOK_IN_SINK[0], y: WOK_IN_SINK[1], a: 0, t: 0 };
      burst(WOK_IN_SINK[0], WOK_IN_SINK[1] - 8, ['#ffffff', '#ffe2a6', '#c9eff6'], 12, 46);
      nudge('WAJAN BERSIH, KEMBALI KE KOMPOR');
      sfx('cleanSparkle');
      return;
    }
    if (t !== 'pile' && t.kind !== 'cup' && plateCount(t)) { nudge(t.kind === 'bowl' ? 'KOSONGKAN MANGKUK DULU' : 'KOSONGKAN PIRING DULU'); return; }
    s.wash = Math.min(1, s.wash + (Math.min(moved, 16) / 220) * (w.sinkWater >= 0.3 ? 1.4 : 1));
    s.foam = 1;
    if (Math.random() < 0.3) burst(x, y, ['#f8fdff', '#c9eff6'], 2, 22);
    s.meter = { v: RIGHT, x: 90, y: 212, value: s.wash, zone: null, t: 0.4 };
    if (s.wash < 1) return;
    s.wash = 0;
    if (w.sinkWater > 0.02) w.sinkDirt = Math.min(1, (w.sinkDirt || 0) + 0.2);
    if (t === 'pile') { w.sink.pop(); nudge('BERSIH, KEMBALI KE RAK'); }
    else if (t.kind === 'cup') { t.water = 0; t.powder = false; t.spices = {}; t.juice = null; t.dirty = false; t.used = false; t.v = RIGHT; [t.x, t.y] = CUP_HOMES[t.id]; nudge('GELAS BERSIH, KEMBALI KE NAMPAN'); }
    else { w.things.splice(w.things.indexOf(t), 1); nudge(t.kind === 'bowl' ? 'MANGKUK BERSIH, KEMBALI KE RAK' : 'PIRING BERSIH, KEMBALI KE RAK'); }
    sfx('cleanSparkle');
  }
  function wipe(x, y, moved) {
    const list = s.world.spills;
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      if (p.v !== s.view || Math.abs(p.x - x) > p.r + 12 || Math.abs(p.y - y) > p.r + 8) continue;
      p.a -= Math.min(moved, 16) / 55;
      if (p.a <= 0) { list.splice(i, 1); burst(p.x, p.y, ['#f5eddb', '#cfc7ad'], 3, 16); sfx('wipeDone'); if (!list.length) nudge('DAPUR KINCLONG!'); }
    }
    if (s.view !== RIGHT) return;
    const w = s.world, key = inRect(WOK_ZONE, x, y) ? (w.wok.items.length || w.wokInSink ? null : 'wokGrime') : !w.potInSink && inRect(SPOTS[RIGHT].pot, x, y) ? 'potGrime' : inRect({ x: 176, y: 214, w: 292, h: 74 }, x, y) ? 'stoveGrime' : null;
    if (!key || w[key] <= 0) return;
    w[key] = Math.max(0, w[key] - Math.min(moved, 16) / 420);
    if (Math.random() < 0.2) burst(x, y, ['#f5eddb', '#8a6a3e'], 1, 14);
    if (w[key] === 0) { nudge({ wokGrime: 'WAJAN', potGrime: 'PANCI', stoveGrime: 'KOMPOR' }[key] + ' BERSIH'); sfx('wipeDone'); }
  }
  const dirtyWord = level => (level > 0.7 ? ' KOTOR' : level > 0.35 ? ' AGAK KOTOR' : '');
  // Adonan: tepung, telur, dan air diaduk sampai rata, lalu dipakai membalut irisan.
  function syncBatterSpot() {
    const p = s.world.batterSpot;
    BATTER.v = p.v; BATTER.x = p.x; BATTER.y = p.y;
    BATTER_ZONE.x = p.x - 34; BATTER_ZONE.y = p.y - 16;
    TOOL_DEFS.batterBowl.v = p.v; TOOL_DEFS.batterBowl.home = [p.x, p.y];
    TOOL_DEFS.whisk.v = p.v; TOOL_DEFS.whisk.home = [p.x + 8, p.y - 2];
  }
  const atBatter = (x, y) => s.view === BATTER.v && inRect(BATTER_ZONE, x, y);
  const batterThick = b => (b.flour + b.water > 0 ? b.flour / (b.flour + b.water) : 0);
  const batterReady = b => b.mix >= 1 && b.flour > 0 && b.water > 0;
  const eggOnly = b => b.egg > 0 && !b.flour && !b.water;
  const eggReady = b => eggOnly(b) && b.mix >= 1;
  const batterWord = b => { const t = batterThick(b); return t < BATTER_THICK[0] ? 'ENCER' : t > BATTER_THICK[1] ? 'KENTAL' : 'PAS'; };
  const batterName = b => {
    if (!b.flour && !b.water && !b.egg) return 'MANGKUK ADONAN';
    if (eggOnly(b)) return b.mix >= 1 ? 'TELUR KOCOK' : 'TELUR PECAH';
    if (batterReady(b)) return 'ADONAN ' + (b.sagu > 0 ? 'SAGU ' : '') + batterWord(b) + (b.egg ? ' TELUR' : '');
    if (!b.flour) return 'MANGKUK, BELUM ADA TEPUNG';
    if (!b.water) return 'MANGKUK, BELUM ADA AIR';
    return 'ADONAN BELUM RATA';
  };
  const batterChanged = b => { b.mix = Math.min(b.mix, 0.55); s.meter = { v: BATTER.v, x: BATTER.x, y: Math.max(26, BATTER.y - 30), value: batterThick(b), zone: BATTER_THICK, t: 0.7 }; };
  function drawBatterContents(g, b) {
    const total = b.flour + b.water;
    if (!total && !b.egg) return;
    const k = Math.min(1, b.mix), fill = Math.min(1, total / 1.2), rx = Math.round(15 + 12 * fill), ry = Math.max(2, Math.round(3 + 3 * fill)), y0 = 3 - Math.round(fill * 2);
    if (!total && k >= 0.6) {
      const er = 13 + b.egg * 4;
      ell(g, 0, 4, er, 4, '#c9962f'); ell(g, 0, 3, er - 1, 3, '#f2c94f'); ell(g, -4, 2, Math.round(er * 0.5), 1, '#fff0a8');
      for (let a = 0; a < 4.2; a += 0.14) px(g, Math.cos(a + s.mixTurn) * (3 + a * 2), 3 + Math.sin(a + s.mixTurn) * (1 + a * 0.5), 1, 1, '#d9a53a');
      return;
    }
    if (total) {
      const thick = batterThick(b), base = thick > BATTER_THICK[1] ? '#ead5a2' : thick < BATTER_THICK[0] ? '#f3e7c9' : '#f0dca8';
      ell(g, 0, y0 + 1, rx, ry, k > 0.4 ? '#c9ae78' : b.water > b.flour ? '#7fa7ae' : '#cfc3ac');
      ell(g, 0, y0, rx - 1, Math.max(1, ry - 1), k > 0.4 ? base : b.water > 0 && !b.flour ? '#a9d5de' : '#f6efe0');
      if (b.water > 0 && b.flour > 0 && k < 0.5) { g.globalAlpha = 0.6 * (1 - k * 2); ell(g, 7, y0 + 1, Math.round(rx * 0.55), Math.max(1, ry - 2), '#9fd0da'); g.globalAlpha = 1; }
      if (b.flour > 0 && k < 1) scatter(g, 0, y0, rx - 4, Math.max(1, ry - 2), Math.round(22 * (1 - k)) + 1, ['#fffaf0', '#d9c9a6', '#c4b28d'], 6);
      if (k > 0.2) for (let n = 0; n < 2; n++) for (let a = 0; a < 4.4; a += 0.1) {
        const r = (0.25 + n * 0.3 + a * 0.06) * rx, ang = a + s.mixTurn + n * 2;
        px(g, Math.cos(ang) * r, y0 + Math.sin(ang) * r * 0.3, 1, 1, '#d4b878');
      }
    }
    if (b.egg && k < 0.6) for (let n = 0; n < b.egg; n++) { const ex = -9 + n * 15, ey = y0 - 1 + n; ell(g, ex, ey, 6, 3, '#fff8ea'); ell(g, ex, ey, 3, 2, '#e8a93c'); px(g, ex - 1, ey - 1, 1, 1, '#ffe9a8'); }
    else if (b.egg && total) scatter(g, 0, y0, rx - 5, Math.max(1, ry - 2), 8, ['#efc768'], 3);
  }
  function drawDough(g) {
    const d = s.world.dough;
    if (!d) return;
    const cx = d.x, cy = 252;
    g.save(); g.translate(cx, cy); g.scale(0.8, 1); g.translate(-cx, -cy);
    if (d.stage === 'adonan') {
      const k = d.roll, rx = Math.round(13 + k * 19), ry = Math.max(3, Math.round(8 - k * 2));
      g.globalAlpha = 0.28; ell(g, cx + 2, cy + 4, rx + 1, ry, '#160f18'); g.globalAlpha = 1;
      ell(g, cx, cy + 1 + Math.round(k), rx, ry, '#b99d6d'); ell(g, cx, cy - 1 + Math.round(k * 2), rx - 1, Math.max(2, ry - 1), '#f0dfb8'); ell(g, cx - Math.round(rx * 0.3), cy - 3 + Math.round(k * 2), Math.round(rx * 0.4), Math.max(1, ry - 4), '#fff7e4');
    } else if (d.stage === 'kulit') {
      poly(g, [[cx - 33, cy - 7], [cx + 30, cy - 9], [cx + 35, cy + 7], [cx - 29, cy + 9]], '#b99d6d');
      poly(g, [[cx - 32, cy - 8], [cx + 29, cy - 10], [cx + 34, cy + 6], [cx - 28, cy + 8]], '#f3e4c2');
      px(g, cx - 25, cy - 6, 34, 1, '#fff9ea');
      const lines = Math.floor(d.cut * 10);
      for (let n = 0; n < lines; n++) px(g, cx - 27 + n * 6, cy - 7, 1, 14, '#b99d6d');
    } else {
      g.globalAlpha = 0.28; ell(g, cx + 2, cy + 5, 25, 5, '#160f18'); g.globalAlpha = 1;
      ell(g, cx, cy + 3, 25, 7, '#b99a58');
      for (let n = 0; n < 13; n++) curve(g, cx - 24, cy - 3 + n * 0.8, cx + (n % 2 ? 11 : -11), cy - 8 + n * 1.3, cx + 24, cy - 2 + n * 0.7, n % 3 ? '#f2d98f' : '#d9b65f', 1);
    }
    g.restore();
  }
  function drawBatterBowl(g, x, y, a) {
    g.save(); g.translate(Math.round(x), Math.round(y)); if (a) g.rotate(a);
    g.drawImage(sprites.batterBowl.c, -sprites.batterBowl.ax, -sprites.batterBowl.ay);
    drawBatterContents(g, s.world.batter);
    g.restore();
  }
  function drawBatter(g) {
    if (!holding('batterBowl')) {
      const fly = s.flying.batterBowl, k = fly ? 1 - (1 - fly.t) ** 3 : 1;
      if (!fly) { g.globalAlpha = 0.42; ell(g, BATTER.x + 3, BATTER.y + 18, 30, 4, '#160f18'); g.globalAlpha = 1; }
      drawBatterBowl(g, fly ? fly.x + (BATTER.x - fly.x) * k : BATTER.x, fly ? fly.y + (BATTER.y - fly.y) * k - Math.sin(k * Math.PI) * 5 : BATTER.y, fly ? fly.a * (1 - k) : 0);
    }
    if (!holding('batterBowl') && !s.flying.batterBowl) drawTool(g, 'whisk');
  }
  const markEgg = (list, from) => {
    const last = list[list.length - 1];
    if (last && last.food === 'egg' && (from.cracked || from.beaten)) { last.cracked = !!from.cracked; last.beaten = !!from.beaten; }
  };
  function pourParts(holder, into, x, y) {
    const w = s.world, target = into === addToWok ? w.wok : w.pot;
    holder.parts.splice(0).forEach(part => {
      const before = target.parts.length;
      into(part.food, part.item, x, y, part.cook);
      if (target.parts.length > before) { markEgg(target.parts, part); if (part.beaten && into === addToWok) w.wok.stir = Math.max(w.wok.stir, 100); }
    });
    mergeSpices(target, holder);
    if (!plateCount(holder)) holder.spices = {};
    holder.lastName = comboName(holder);
  }
  function pourBatter(dt) {
    const w = s.world, b = w.batter, eggs = eggOnly(b), beaten = eggReady(b);
    if (!eggs && !batterReady(b)) { s.pourT = 0; return 0; }
    const [bx, by] = wokPosition(), tx = bx - 26, ty = by + 8;
    const holder = w.things.filter(t => !t.dirty && t.v === s.view && (t.kind === 'plate' || t.kind === 'bowl') && Math.abs(tx - t.x) < 30 && ty > t.y - 62 && ty < t.y + 12).sort((p, q) => q.y - p.y)[0];
    const overWok = s.view === RIGHT && !w.wokInSink && overWokForSalt(tx, ty), overPot = s.view === RIGHT && !w.potInSink && overPotForSalt(tx, ty);
    if (!holder && !overWok && !overPot) { s.pourT = 0; return 0; }
    if (s.tilt < -0.5) {
      const [mx, my] = rotPoint(bx, by, s.tilt, -33, 0), end = holder ? holder.y - 4 : overWok ? 246 : POT.top + 3;
      s.stream = { v: s.view, x: mx, y: my, endY: Math.max(my + 3, end), c: beaten ? '#f2c94f' : eggs ? '#fbf1d8' : '#f0dca8' };
      s.pourT += dt;
      if (s.pourT > 0.5) {
        const food = eggs ? 'egg' : 'adonan', count = eggs ? b.egg : 1;
        for (let n = 0; n < count; n++) {
          const flag = { cracked: eggs && !beaten, beaten };
          if (holder) { addToPlate(holder, food, null, holder.x, holder.y, null); if (eggs) markEgg(holder.parts, flag); }
          else if (overWok) { addToWok(food, null, 262, 240, null); if (eggs) markEgg(w.wok.parts, flag); if (beaten) w.wok.stir = Math.max(w.wok.stir, 100); }
          else { addToPot(food, null, POT.x, POT.top, null); if (eggs) markEgg(w.pot.parts, flag); }
        }
        w.batter = freshBatter(); s.pourT = 0;
        nudge(beaten ? 'TELUR KOCOK DITUANG' : eggs ? 'TELUR DITUANG' : 'ADONAN DITUANG');
      }
    }
    return -0.85;
  }
  function dipInBatter(hand) {
    const b = s.world.batter;
    if (!hand.item || !hand.food || !hand.food.endsWith('+') || !batterReady(b)) return;
    if (hand.food === 'banana+') { hand.item.coated = true; hand.food = 'coated'; mark('coat'); }
    else { hand.item.battered = true; hand.food = hand.item.type + '~'; }
    hand.item.crust = batterWord(b); hand.item.sagu = b.sagu > 0;
    const total = b.flour + b.water, keep = Math.max(0, 1 - 0.2 / total);
    b.flour *= keep; b.water *= keep; b.sagu *= keep;
    burst(BATTER.x, BATTER.y - 4, ['#f0dca8', '#fffaf0'], 8, 28);
    sfx('dip');
    nudge(FOOD_LABEL[hand.food] + ' TERBALUR ADONAN ' + hand.item.crust);
    if (b.flour + b.water < 0.08) s.world.batter = freshBatter();
  }

  // Blender: bahan dan air menjadi jus, atau cabai dan bawang menjadi sambal.
  function blendResult(b) {
    const foods = [...new Set(b.parts.map(p => p.food.replace('+', '')))];
    if (!foods.length) return null;
    if (foods.some(f => ['chili', 'shallot', 'bawangputih'].includes(f))) return { kind: 'sambal', name: 'BUMBU HALUS', c: '#a83c32' };
    const rgbList = foods.map(f => rgb(BLEND_COLORS[f]));
    const mix = [0, 1, 2].map(n => Math.round(average(rgbList.map(col => col[n]))));
    const color = '#' + mix.map(n => n.toString(16).padStart(2, '0')).join('');
    return { kind: 'juice', name: foods.length > 1 ? 'JUS CAMPUR' : 'JUS ' + FOOD_LABEL[foods[0]], c: color };
  }
  function addToBlender(f, hand, x, y) {
    const w = s.world, b = w.blender, loose = () => putThing({ kind: 'food', ...newPart(f, hand.item, hand.cook) }, x, y + 44);
    if (FOOD_SIZE[f] && BLEND_COLORS[f]) { nudge('IRIS DULU SEBELUM DIBLENDER'); loose(); return; }
    if (!BLENDABLE[f]) { nudge('BAHAN INI TIDAK BISA DIBLENDER'); loose(); return; }
    if (b.result || b.level > 0) { nudge('KOSONGKAN BLENDER DULU'); loose(); return; }
    if (b.parts.length >= 4) { nudge('BLENDER PENUH'); loose(); return; }
    b.parts.push(newPart(f, hand.item, hand.cook));
    burst(414, 150, [BLEND_COLORS[f.replace('+', '')], '#fff6e2'], 5, 24);
    sfx('dropBlender');
    if (blendResult(b).kind === 'juice' && b.water < JUICE_WATER) nudge('TAMBAH AIR, LALU TAHAN TOMBOL');
    else nudge('TAHAN TOMBOL UNTUK MEMBLENDER');
  }
  function drawBlenderContents(g, b) {
    const preview = b.result || (b.parts.length ? blendResult(b) : null), k = b.result ? 1 : b.level;
    const fill = b.result ? b.amount : Math.min(1, b.water + b.parts.length * 0.16);
    const rows = Math.round(46 * Math.min(1, fill));
    for (let n = 0; n < rows; n++) {
      const y = 26 - n, half = Math.max(2, Math.round(14 - (5 * (y + 24)) / 52) - 1);
      if (k > 0.02 && preview) { g.globalAlpha = 0.45 + k * 0.5; px(g, -half, y, half * 2 + 1, 1, preview.c); }
      if (k < 1 && b.water > 0 && n < Math.round(46 * b.water)) { g.globalAlpha = 0.45 * (1 - k); px(g, -half, y, half * 2 + 1, 1, '#8fd2e6'); }
    }
    g.globalAlpha = 1;
    if (!b.result) b.parts.forEach((part, i) => {
      const spin = s.blending ? s.t * 24 : 0, a = i * 2.3 + spin, r = s.blending ? 6 * (1 - k) : 5;
      const cx = Math.round(Math.cos(a) * r), cy = Math.round(20 - i * 6 + Math.sin(a) * 2), col = BLEND_COLORS[part.food.replace('+', '')] || '#d8c8aa';
      const size = Math.max(1, Math.round(5 * (1 - k * 0.8)));
      ell(g, cx, cy + 1, size, Math.max(1, size - 1), '#3a2622'); ell(g, cx, cy, size, Math.max(1, size - 1), col); px(g, cx - 2, cy - 1, 2, 1, '#fff6e2');
    });
    drawSpiceSpecks(g, b.spices, 0, 26 - Math.max(2, rows - 2), 7, 1);
    if (rows > 3 && k > 0.5) { g.globalAlpha = 0.7; const y = 26 - rows, half = Math.max(2, Math.round(14 - (5 * (y + 24)) / 52) - 1); px(g, -half, y, half * 2 + 1, 1, '#fff6e2'); g.globalAlpha = 1; }
  }
  function drawBlenderJar(g, x, y, a) {
    g.save(); g.translate(Math.round(x), Math.round(y)); if (a) g.rotate(a);
    drawBlenderContents(g, s.world.blender);
    g.drawImage(sprites.blender.c, -sprites.blender.ax, -sprites.blender.ay);
    g.restore();
  }
  function drawBlender(g) {
    const b = s.world.blender, ready = b.parts.length > 0, [hx, hy] = TOOL_DEFS.blender.home, on = s.blending;
    const r = BLENDER_BTN, dip = on ? 1 : 0;
    px(g, r.x + 3, r.y + 3 + dip, r.w - 6, r.h - 6, '#141218'); px(g, r.x + 4, r.y + 3 + dip, r.w - 8, r.h - 8, on ? '#e8693c' : ready ? '#f0b33c' : '#6d6a73');
    px(g, r.x + 5, r.y + 4 + dip, r.w - 10, 1, on ? '#ffd9a8' : ready ? '#ffeab0' : '#9b98a0');
    if (holding('blender')) return;
    const fly = s.flying.blender, k = fly ? 1 - (1 - fly.t) ** 3 : 1;
    const jitter = on ? Math.round(Math.sin(s.t * 70)) : 0;
    const x = fly ? fly.x + (hx - fly.x) * k : hx + jitter, y = fly ? fly.y + (hy - fly.y) * k - Math.sin(k * Math.PI) * 5 : hy + (on ? Math.round(Math.cos(s.t * 83) * 0.6) : 0);
    drawBlenderJar(g, x, y, fly ? fly.a * (1 - k) : 0);
    if (on && !b.result) { px(g, 389, 140, 3, 1, '#ffe9bd'); px(g, 437, 146, 3, 1, '#ffe9bd'); px(g, 388, 156, 2, 1, '#ffe9bd'); px(g, 438, 162, 2, 1, '#ffe9bd'); }
  }
  function pourBlender(dt) {
    const w = s.world, b = w.blender, r = b.result, [jx, jy] = wokPosition(), tx = jx - 32, ty = jy + 4;
    const hasStuff = b.parts.length || b.water > 0 || b.result;
    const near = kinds => w.things.filter(t => (t.kind === 'cup' || !t.dirty) && t.v === s.view && kinds.includes(t.kind) && Math.abs(tx - t.x) < 24 && ty > t.y - 62 && ty < t.y + 8).sort((p, q) => q.y - p.y)[0];
    const pouring = target => { const [mx, my] = rotPoint(jx, jy, s.tilt, -17, -28); s.stream = { v: s.view, x: mx, y: my, endY: Math.max(my + 3, target), c: r ? r.c : '#8fd2e6' }; };
    if (s.view === LEFT && hasStuff && Math.abs(jx - TRASH.x) < 62 && jy > 150 && jy < 290) {
      if (s.tilt < -0.8) { pouring(TRASH.y); s.pourT += dt; if (s.pourT > 0.55) { w.blender = freshBlender(); s.pourT = 0; nudge('ISI BLENDER DIBUANG'); burst(TRASH.x, TRASH.y - 2, ['#d9b95c', '#e9dfc8'], 8, 30); } }
      return -1.25;
    }
    if (!r) { s.pourT = 0; return 0; }
    if (r.kind === 'juice') {
      const cup = near(['cup']);
      if (!cup) { s.pourT = 0; return 0; }
      if (cupDirty(cup)) { nudge('GELAS KOTOR, CUCI DULU'); return 0; }
      if (cup.powder || (cup.water > 0 && cup.juice && cup.juice.name !== r.name)) { nudge('GELAS HARUS KOSONG DULU'); return 0; }
      if (s.tilt < -0.8 && cup.water < 1) {
        const used = Math.min(b.amount, dt / 1.1);
        cup.juice = { name: r.name, c: r.c }; cup.cold = true;
        cup.water = Math.min(1, cup.water + used * 0.95); b.amount -= used;
        mergeSpices(cup, b); pouring(cup.y - 16);
        s.meter = { v: s.view, x: cup.x, y: Math.max(26, cup.y - 47), value: cup.water, zone: WATER_ZONE, t: 0.25 };
        if (b.amount <= 0.01) { w.blender = freshBlender(); nudge('JADI ' + r.name + '!'); sfx('pourDone'); }
      }
      return -1.25;
    }
    const holder = near(['plate', 'bowl']), overWok = s.view === RIGHT && !w.wokInSink && overWokForSalt(tx, ty), overPot = s.view === RIGHT && !w.potInSink && overPotForSalt(tx, ty);
    if (!holder && !overWok && !overPot) { s.pourT = 0; return 0; }
    if (s.tilt < -0.8) {
      pouring(holder ? holder.y - 4 : overWok ? 246 : POT.top + 3); s.pourT += dt;
      if (s.pourT > 0.5) {
        const spiced = { spices: b.spices };
        if (holder) { addToPlate(holder, 'bumbu', null, holder.x, holder.y, bumbuCook('halus')); mergeSpices(holder, spiced); }
        else if (overWok) { addToWok('bumbu', null, 262, 240, bumbuCook('halus')); mergeSpices(w.wok, spiced); }
        else { addToPot('bumbu', null, POT.x, POT.top, bumbuCook('halus')); mergeSpices(w.pot, spiced); }
        w.blender = freshBlender(); s.pourT = 0; nudge('BUMBU HALUS DITUANG');
      }
    }
    return -1.25;
  }

  function checkServed() {
    const w = s.world;
    if (!s.recipe || guestWants(s.recipe)) return;
    if (RECIPES[s.recipe].soup) { if (bowls().some(b => b.dish && b.dish.id === s.recipe && b.fill >= 0.6 && inServe(b))) mark('served'); return; }
    if (RECIPES[s.recipe].drink) { if (w.done.jPour && cups().some(cup => inServe(cup) && drinkOf(cup) === s.recipe)) mark('served'); return; }
    if (s.recipe === 'kopi') { if (w.done.pour && cups().some(cup => inServe(cup) && isKopi(cup))) mark('served'); return; }
    if (w.things.some(t => t.kind === 'plate' && t.dish && t.dish.id === s.recipe && inServe(t))) mark('served');
  }
  function syncDone() {
    // Langkah selalu dibaca dari kondisi nyata, jadi yang sudah dikerjakan tidak diminta lagi.
    const w = s.world, recipe = RECIPES[s.recipe], need = recipe.wok;
    const holders = w.things.filter(t => t.kind === 'plate' || t.kind === 'bowl');
    const parts = [...w.wok.parts, ...w.pot.parts, ...w.cobek.parts, ...w.blender.parts, ...holders.flatMap(t => t.parts || [])];
    const all = [...w.board, ...w.things.filter(t => t.item).map(t => t.item), ...parts.map(p => p.item).filter(Boolean)];
    const foods = [...w.things.filter(t => t.kind === 'food').map(t => t.food), ...parts.map(p => p.food)];
    const chopped = type => foods.includes(type + '+') || all.some(it => it.type === type && isChopped(it));
    const hasBumbu = foods.includes('bumbu') || w.cobek.ground >= 1 || !!(w.blender.result && w.blender.result.kind === 'sambal');
    const coated = foods.includes('coated') || all.some(it => it.coated);
    const cooked = need.length > 0 && need.every(f => w.wok.items.includes(f)) && wokAllCooked(w.wok);
    const entries = [...parts, ...w.things.filter(t => t.kind === 'food'), ...w.board.map(item => ({ item }))];
    const alreadyFried = need.length > 0 && need.every(f => entries.some(o => entryFood(o) === f && cookVal(o, 'goreng') >= COOK_GOLD[0]));
    const served = !guestWants(s.recipe) && (recipe.soup ? bowls().some(b => b.dish && b.dish.id === s.recipe && b.fill >= 0.6 && inServe(b))
      : recipe.drink ? cups().some(cup => inServe(cup) && drinkOf(cup) === s.recipe)
      : s.recipe === 'kopi' ? cups().some(cup => inServe(cup) && isKopi(cup))
        : w.things.some(t => t.kind === 'plate' && t.dish && t.dish.id === s.recipe && inServe(t)));
    const facts = {
      cup: cups().some(cup => (!atHome(cup) && !cupDirty(cup)) || cup.powder), powder: cups().some(cup => cup.powder), boil: w.potHeat >= 1 || cups().some(cup => cup.water > 0 && !cup.cold), pour: cups().some(isKopi),
      cutBeef: chopped('beef'), beefIn: w.wok.items.includes('beef+'),
      cutBanana: chopped('banana') || coated, coat: coated, cutChili: chopped('chili') || hasBumbu, cutShallot: chopped('shallot') || hasBumbu,
      toCobek: w.cobek.items.length >= 2 || ['chili+', 'shallot+'].every(f => w.blender.parts.some(p => p.food === f)) || hasBumbu, ground: hasBumbu, oil: alreadyFried || w.wok.oil >= MIN_AMOUNT, fire: alreadyFried || w.flameL > 0, inWok: w.wok.items.includes('coated'),
      bumbuIn: w.wok.items.includes('bumbu'), eggIn: w.wok.items.includes('egg'), riceIn: w.wok.items.includes('rice'), soy: w.wok.soy >= SEASON_DONE, salt: w.wok.salt >= SEASON_DONE,
      cooked, plateOut: w.things.some(t => t.kind === 'plate' && t.v === RIGHT),
      plated: w.things.some(t => t.kind === 'plate' && t.dish && t.dish.id === s.recipe),
      potBeef: w.pot.parts.some(p => p.food === 'beef+'), potShallot: w.pot.parts.some(p => p.food === 'shallot+'), potBumbu: w.pot.parts.some(p => p.food === 'bumbu'),
      potSalt: w.pot.salt >= SEASON_DONE, simmer: (recipe.soup || []).every(f => potFoods().includes(f)) && potAllCooked(), bowlOut: bowls().length > 0,
      ladled: bowls().some(b => b.dish && b.dish.id === s.recipe && b.fill >= 0.6), served,
    };
    recipe.steps.forEach(st => {
      const [kind, val] = st.key.split(':');
      if (!val) return;
      const dipped = foods.includes(val + '~') || foods.includes(val + '^') || all.some(it => it.type === val && (it.battered || it.coated));
      if (kind === 'cut') facts[st.key] = chopped(val) || dipped;
      if (kind === 'bat') facts[st.key] = dipped;
      if (kind === 'mk') facts[st.key] = foods.includes(val) || (!!w.dough && w.dough.stage === val);
      if (kind === 'in') facts[st.key] = w.wok.items.includes(val);
      if (kind === 'pin') facts[st.key] = potFoods().includes(val);
      if (kind === 'sp') facts[st.key] = ((recipe.soup ? w.pot : w.wok).spices[val] || 0) >= SPICE_DONE;
    });
    if (recipe.drink) {
      const fruit = recipe.drink + '+', made = !!(w.blender.result && w.blender.result.name === recipe.name), poured = cups().some(cup => drinkOf(cup) === s.recipe);
      facts.blIn = w.blender.parts.some(p => p.food === fruit) || made || poured;
      facts.blWater = w.blender.water >= JUICE_WATER || made || poured;
      facts.blend = made || poured;
      facts.jPour = cups().some(cup => drinkOf(cup) === s.recipe && (cup.water >= WATER_ZONE[0] || !made));
      facts['cut:' + recipe.drink] = facts['cut:' + recipe.drink] || facts.blIn;
    }
    // Kalau masakan sudah jadi, semua langkah sebelumnya otomatis dianggap selesai.
    let finishedUpTo = -1;
    recipe.steps.forEach((st, i) => { if (['pour', 'jPour', 'plated', 'ladled', 'served'].includes(st.key) && facts[st.key]) finishedUpTo = i; });
    w.done = {};
    recipe.steps.forEach((st, i) => { if (i <= finishedUpTo || facts[st.key]) w.done[st.key] = true; });
    if (recipe.steps.every(st => w.done[st.key])) finishDish();
  }
  function deliver() {
    const w = s.world;
    w.things.filter(t => servablePlate(t) && inServe(t) && !guestWantsThing(t)).forEach(t => addDirty(t.kind));
    w.things = w.things.filter(t => !(servablePlate(t) && inServe(t) && !guestWantsThing(t)));
    cups().forEach(cup => {
      if (inServe(cup) && cupServable(cup) && !guestWantsThing(cup)) cupToSink(cup);
    });
    burst(320, 244, ['#ffe2a6', '#f5eddb'], 8, 40); sfx('serveBell');
    s.savedFlash = 1.6; saveGame();
  }
  const canDeliver = () => s.view === FRONT && !s.hand && !s.result && s.world.things.some(t => inServe(t) && !guestWantsThing(t) && (servablePlate(t) || (t.kind === 'cup' && cupServable(t))));

  function finishDish(host = null, hostId = null) {
    const w = s.world, id = hostId || s.recipe, recipe = RECIPES[id], isHost = t => (host ? t === host : inServe(t));
    const dish = w.things.find(t => t.kind === 'plate' && t.dish && t.dish.id === id && isHost(t));
    const f = dish ? dish.dish.final : {};
    let rows;
    if (id === 'kopi') {
      const cup = cups().filter(t => isHost(t) && isKopi(t)).sort((a, b) => b.water - a.water)[0];
      rows = [['TAKARAN AIR', closeness(cup ? cup.water : 0, WATER_ZONE[0], WATER_ZONE[1])]];
    }
    const drinkCup = recipe.drink ? cups().filter(t => isHost(t) && drinkOf(t) === id).sort((a, b) => b.water - a.water)[0] : null;
    if (recipe.drink) rows = [['IRISAN', average(w.cutNeat)], ['TAKARAN', closeness(drinkCup ? drinkCup.water : 0, WATER_ZONE[0], WATER_ZONE[1])]];
    if (id === 'pisang') rows = [['IRISAN', average(w.cutNeat)], ['KEMATANGAN', closeness(f.level, COOK_GOLD[0], COOK_GOLD[1])], ['DUA SISI', f.balance]];
    if (id === 'nasi') rows = [['IRISAN', average(w.cutNeat)], ['BUMBU', average([closeness(f.soy, ...SEASON_ZONE), closeness(f.salt, ...SEASON_ZONE)])], ['KEMATANGAN', closeness(f.level, COOK_GOLD[0], COOK_GOLD[1])]];
    if (id === 'daging') rows = [['IRISAN', average(w.cutNeat)], ['BUMBU', average([closeness(f.soy, ...SEASON_ZONE), closeness(f.salt, ...SEASON_ZONE)])], ['KEMATANGAN', closeness(f.level, COOK_GOLD[0], COOK_GOLD[1])]];
    if (recipe.soup) {
      const bowl = bowls().find(b => b.dish && b.dish.id === id && isHost(b)), soup = bowl ? bowl.dish.final : {};
      rows = [['IRISAN', average(w.cutNeat)], ['GARAM', closeness(soup.salt, ...SEASON_ZONE)], ['KEMATANGAN', closeness(soup.level, COOK_GOLD[0], COOK_GOLD[1])], ['TAKARAN KUAH', closeness(bowl ? bowl.fill : 0, WATER_ZONE[0], WATER_ZONE[1])]];
    }
    if (recipe.auto) {
      const host = recipe.soup ? bowls().find(b => b.dish && b.dish.id === id && isHost(b)) : dish;
      const spiced = average(recipe.spices.map(sp => closeness(((host && host.spices) || {})[sp] || 0, 0.15, 0.9)));
      if (recipe.soup) rows.push(['REMPAH', spiced]);
      else {
        const seasoning = [closeness(f.salt, ...SEASON_ZONE), spiced];
        if (recipe.soy) seasoning.push(closeness(f.soy, ...SEASON_ZONE));
        rows = [['IRISAN', average(w.cutNeat)], ['BUMBU', average(seasoning)], ['KEMATANGAN', closeness(f.level, COOK_GOLD[0], COOK_GOLD[1])]];
        if (f.crust !== null && f.crust !== undefined) rows.push(['LAPISAN', f.crust]);
      }
    }
    // Tumisan terbaik memakai bumbu ulek, masakan berkuah memakai bumbu halus.
    const bumbuFinal = recipe.soup ? (bowls().find(b => b.dish && b.dish.id === id && isHost(b)) || { dish: { final: {} } }).dish.final : f;
    const usesBumbu = (recipe.items || [...(recipe.wok || []), ...(recipe.soup || [])]).includes('bumbu');
    const wrongTool = usesBumbu && !!bumbuFinal.style && bumbuFinal.style !== (recipe.soup ? 'halus' : 'ulek');
    if (usesBumbu && bumbuFinal.style) rows.push(['TEKSTUR BUMBU', wrongTool ? 0.5 : 1]);
    const score = average(rows.map(r => r[1])), rawStars = score >= 0.86 ? 3 : score >= 0.62 ? 2 : 1, stars = wrongTool ? Math.min(2, rawStars) : rawStars;
    const flavored = recipe.drink ? drinkCup : id === 'kopi' ? cups().filter(t => isHost(t) && isKopi(t)).sort((a, b) => b.water - a.water)[0] : recipe.soup ? bowls().find(b => b.dish && b.dish.id === id && isHost(b)) : dish;
    const taste = flavored ? tasteText(flavored.spices) : '', spiceList = flavored ? spiceNames(flavored.spices) : '';
    if (host) {
      if (s.recipe === id) { w.cutNeat = []; w.done = {}; s.recipe = null; }
      s.made++; s.best[id] = Math.max(s.best[id] || 0, stars); s.savedFlash = 1.6;
      return { stars, taste };
    }
    // Hidangan yang dinilai langsung diantar, supaya tidak terhitung lagi di pesanan berikutnya.
    if (recipe.drink) { if (drinkCup) cupToSink(drinkCup); }
    else if (id === 'kopi') {
      const cup = cups().filter(t => isHost(t) && isKopi(t)).sort((a, b) => b.water - a.water)[0];
      if (cup) cupToSink(cup);
    } else {
      const out = recipe.soup ? bowls().find(b => b.dish && b.dish.id === id && isHost(b)) : dish;
      if (out) { w.things.splice(w.things.indexOf(out), 1); addDirty(out.kind); }
    }
    w.cutNeat = []; w.done = {};
    s.made++;
    s.best[id] = Math.max(s.best[id] || 0, stars);
    s.savedFlash = 1.6;
    s.result = { name: recipe.name, taste, spiceList, rows, stars, title: stars === 3 ? 'SEMPURNA!' : stars === 2 ? 'ENAK!' : 'LUMAYAN', t: 0 };
    s.recipe = null;
    sfx('stars', stars);
  }
  function mark(key) {
    const w = s.world;
    if (w.done[key]) return;
    w.done[key] = true;
    if (s.recipe && RECIPES[s.recipe].steps.every(st => w.done[st.key])) finishDish();
  }
  const currentStep = () => (s.recipe ? RECIPES[s.recipe].steps.find(st => !s.world.done[st.key]) : null);

  function locate(food) {
    const w = s.world, board = w.board.find(it => foodOf(it) === food);
    if (board) return { v: LEFT, r: itemBox(board) };
    const thing = w.things.find(t => t.kind === 'food' && (t.item ? foodOf(t.item) : t.food) === food)
      || w.things.find(t => (t.kind === 'plate' || t.kind === 'bowl') && (t.parts || []).some(p => p.food === food));
    return thing ? { v: thing.v, r: thingRect(thing) } : null;
  }
  // Panduan adonan: panah pindah ke benda yang harus dipakai pada tiap tahap.
  const doughStep = () => {
    const step = currentStep();
    if (!step || !step.key.includes(':')) return null;
    const [kind, val] = step.key.split(':');
    return kind === 'mk' || kind === 'bat' ? { kind, val } : null;
  };
  const batterWaterCap = () => {
    const d = doughStep(), flour = s.world.batter.flour;
    return !d ? Infinity : flour * (d.kind === 'mk' ? 0.42 : 0.85);
  };
  const plainWaterCup = cup => !cupDirty(cup) && cup.water > 0 && !cup.powder && !cup.juice;
  function batterGuide(want) {
    const w = s.world, b = w.batter, needFlour = want === 'KENTAL' ? 0.6 : 0.3, bowl = { v: BATTER.v, r: BATTER_ZONE };
    if (batterReady(b) && (!want || batterWord(b) === want)) return null;
    const wet = b.water > 0 && batterThick(b) <= (want === 'KENTAL' ? BATTER_THICK[1] : BATTER_THICK[0]);
    if (wet && b.flour >= 1.2) return { ...bowl, text: 'TERLALU ENCER, ANGKAT MANGKUK KE TEMPAT SAMPAH' };
    if (wet) return { v: LEFT, spot: 'flour', text: 'TERLALU ENCER, TAMBAH TEPUNG DARI KARUNG' };
    if (b.flour < needFlour) return { v: LEFT, spot: 'flour', text: '1/4 SERET TEPUNG DARI KARUNG KE MANGKUK' + (needFlour > 0.3 ? ', ' + Math.ceil((needFlour - b.flour) / 0.3 - 0.01) + ' KALI' : '') };
    if (!b.water) {
      const filled = cups().find(plainWaterCup);
      if (filled) return { v: filled.v, r: thingRect(filled), text: '2/4 BAWA GELAS AIR, TAHAN DI ATAS MANGKUK' };
      const empty = cups().find(cup => !cupDirty(cup) && !cup.water && !cup.powder);
      if (!empty) return { v: RIGHT, spot: 'sink', text: 'SEMUA GELAS KOTOR, CUCI DI WASTAFEL' };
      if (!w.tapOn) return { v: RIGHT, r: TAP, text: '2/4 BUKA KERAN UNTUK AMBIL AIR' };
      return { v: empty.v, r: thingRect(empty), text: '2/4 AMBIL GELAS, TAHAN DI BAWAH KERAN' };
    }
    return { ...bowl, text: '3/4 PEGANG KOCOKAN, ADUK DI MANGKUK' };
  }
  function waterCupGuide() {
    const w = s.world, filled = cups().find(plainWaterCup);
    if (filled) return { v: filled.v, r: thingRect(filled), text: 'BAWA GELAS AIR, TAHAN DI ATAS BLENDER' };
    const empty = cups().find(cup => !cupDirty(cup) && !cup.water && !cup.powder);
    if (!empty) return { v: RIGHT, spot: 'sink', text: 'SEMUA GELAS KOTOR, CUCI DI WASTAFEL' };
    if (!w.tapOn) return { v: RIGHT, r: TAP, text: 'BUKA KERAN UNTUK AMBIL AIR' };
    return { v: empty.v, r: thingRect(empty), text: 'AMBIL GELAS, TAHAN DI BAWAH KERAN' };
  }
  function drinkHandHint() {
    const r = s.recipe && RECIPES[s.recipe], hand = s.hand, w = s.world;
    if (!r || !r.drink || !hand) return '';
    const key = (currentStep() || {}).key;
    if (key === 'blWater' && hand.food === 'cup' && hand.cup) {
      const cup = hand.cup;
      if (cup.powder || cup.juice) return 'GELAS INI BUKAN AIR, TARUH DULU';
      if (cupDirty(cup)) return 'GELAS KOTOR, CUCI DULU';
      if (cup.water >= 0.3) return s.view === LEFT ? 'TAHAN GELAS DI ATAS BLENDER SAMPAI ZONA KUNING' : 'BAWA GELAS KE BLENDER DI SISI KIRI';
      if (!w.tapOn) return 'TARUH GELAS, BUKA KERAN DULU';
      return s.view === RIGHT ? 'TAHAN GELAS DI BAWAH KERAN SAMPAI TERISI' : 'BAWA GELAS KE KERAN DI SISI KANAN';
    }
    if (key === 'jPour' && hand.tool === 'blender') return s.view === RIGHT ? 'BAWA KE ATAS GELAS, BLENDER AKAN MIRING' : 'BAWA BLENDER KE GELAS DI SISI KANAN';
    return '';
  }
  function knifeHint() {
    const id = s.hand && s.hand.tool;
    if (!KNIVES[id] || s.view !== LEFT) return '';
    const it = itemUnderBlade(s.mouse[0], s.mouse[1]) || s.world.board.find(b => !isChopped(b));
    if (!it) return KNIVES[id].name + ' - ANDALAN: ' + KNIVES[id].use;
    return KNIVES[id].name + ': ' + knifeFit(id, it.type).label + ' UNTUK ' + FOOD_LABEL[it.type];
  }
  function doughHandHint() {
    const d = doughStep(), hand = s.hand, w = s.world;
    if (!d || !hand) return '';
    const b = w.batter;
    if (hand.scoop) return s.view === BATTER.v ? 'LEPAS TEPUNG DI ATAS MANGKUK' : 'BAWA TEPUNG KE MANGKUK ADONAN';
    if (hand.food === 'cup' && hand.cup) {
      const cup = hand.cup;
      if (cup.powder || cup.juice) return 'GELAS INI BUKAN AIR, TARUH DULU';
      if (cupDirty(cup)) return 'GELAS KOTOR, CUCI DULU';
      if (!b.flour) return 'MASUKKAN TEPUNG DULU, TARUH GELASNYA';
      if (b.water >= batterWaterCap()) return 'AIR SUDAH CUKUP, TARUH GELAS LALU KOCOK';
      if (cup.water >= 0.3) {
        if (s.view !== BATTER.v) return 'BAWA GELAS KE SISI ' + (BATTER.v < s.view ? 'KIRI' : 'KANAN') + ', KE ATAS MANGKUK';
        return 'TAHAN GELAS DI ATAS MANGKUK SAMPAI AIR CUKUP';
      }
      if (!w.tapOn) return 'TARUH GELAS, BUKA KERAN DULU';
      if (s.view !== RIGHT) return 'BAWA GELAS KE KERAN DI SISI KANAN';
      return 'TAHAN GELAS DI BAWAH KERAN SAMPAI TERISI';
    }
    if (hand.tool === 'whisk') {
      if (batterReady(b)) return 'SUDAH RATA, LEPAS KOCOKAN';
      if (!b.flour || !b.water) return 'BELUM ADA ' + (!b.flour ? 'TEPUNG' : 'AIR') + ', LEPAS KOCOKAN';
      return 'ADUK MELINGKAR DI MANGKUK SAMPAI RATA';
    }
    if (hand.tool === 'batterBowl' && d.kind === 'mk' && batterReady(b) && batterWord(b) === 'KENTAL' && !w.dough) return 'LEPAS MANGKUK DI ATAS TALENAN';
    if (hand.tool === 'pin') return w.dough && w.dough.stage === 'adonan' ? 'GOSOK BOLAK-BALIK DI ATAS ADONAN' : 'BELUM ADA ADONAN DI TALENAN';
    if (KNIVES[hand.tool] && w.dough && w.dough.stage === 'kulit' && d.val === 'mie') return 'GERAKKAN PISAU NAIK TURUN DI ATAS KULIT';
    return '';
  }
  function nextAction() {
    const step = currentStep(), w = s.world;
    if (!step) return null;
    const cut = (type, name) => {
      if (w.board.some(b => b.type === type && !isChopped(b))) { const pick = bestKnife(type); return { v: LEFT, r: KNIVES[pick].hit, text: 'AMBIL ' + KNIVES[pick].name + ', IRIS ' + name + ' MAJU-MUNDUR' }; }
      const boardFull = !BOARD_SLOTS.some(([sx]) => !w.board.some(b => Math.abs(b.x - sx) < 8) && !(w.dough && Math.abs(w.dough.x - sx) < 8));
      if (boardFull) {
        const ready = w.board.find(isChopped);
        if (ready) return { v: LEFT, r: itemBox(ready), text: 'TALENAN PENUH, PINDAHKAN IRISAN INI KE MEJA' };
        if (w.dough) return { v: LEFT, r: doughRect(w.dough), text: 'TALENAN PENUH, PINDAHKAN ADONAN KE MEJA' };
      }
      const loose = locate(type);
      if (loose) return { ...loose, text: 'TARUH ' + name + ' DI TALENAN' };
      if (s.store === STORE_OF[type]) return { v: LEFT, r: storeCells(s.store).find(c => c.type === type), text: 'AMBIL ' + name + ', TARUH DI TALENAN' };
      return { v: LEFT, r: STORES[STORE_OF[type]].door, text: 'BUKA ' + STORES[STORE_OF[type]].title + ' DI BAWAH MEJA' };
    };
    if (step.key.includes(':')) {
      const [kind, val] = step.key.split(':'), soup = !!RECIPES[s.recipe].soup, label = FOOD_LABEL[val] || 'BAHAN';
      if (kind === 'cut') return cut(val, label);
      if (kind === 'bat') {
        const at = locate(val + '+');
        const making = batterGuide(null);
        if (making) return making;
        return at ? { ...at, text: '4/4 SERET ' + label + ' KE MANGKUK ADONAN' } : { v: BATTER.v, r: BATTER_ZONE, text: step.text };
      }
      if (kind === 'mk') {
        if (w.dough && w.dough.stage === 'adonan') return { v: LEFT, spot: 'pin', text: 'AMBIL PENGGILING, GOSOK DI ATAS ADONAN' };
        if (w.dough && w.dough.stage === 'kulit' && val === 'mie') return { v: LEFT, spot: 'knife', text: 'AMBIL PISAU, IRIS KULIT JADI MIE' };
        if (w.dough) return { v: LEFT, r: doughRect(w.dough), text: 'PINDAHKAN ' + FOOD_LABEL[w.dough.stage] + ' DARI TALENAN DULU' };
        const mixing = batterGuide('KENTAL');
        if (mixing) return mixing;
        if (doughSlot(BATTER.x) === null) return { v: LEFT, r: DOUGH_BOARD, text: 'KOSONGKAN SATU TEMPAT DI TALENAN' };
        return { v: BATTER.v, r: BATTER_ZONE, text: '4/4 ANGKAT MANGKUK, LEPAS DI TALENAN' };
      }
      if (kind === 'in' || kind === 'pin') {
        const where = kind === 'in' ? 'WAJAN' : 'PANCI';
        if (kind === 'in' && w.wokInSink) return { v: RIGHT, spot: 'sink', text: 'BAWA WAJAN KEMBALI KE KOMPOR' };
        if (kind === 'pin' && (w.potInSink || w.potWater < 0.3)) return { v: RIGHT, spot: w.potInSink ? 'sink' : 'pot', text: w.potInSink ? 'BAWA PANCI KEMBALI KE KOMPOR' : 'TARUH PANCI DI WASTAFEL UNTUK DIISI' };
        const at = locate(val);
        if (at) return { ...at, text: 'BAWA ' + label + ' KE ' + where };
        if (val === 'bumbu') {
          if (w.blender.result && w.blender.result.kind === 'sambal') return { v: LEFT, r: BLENDER_ZONE, text: 'ANGKAT BLENDER, TUANG BUMBU KE ' + where };
          return { v: LEFT, spot: 'cobek', text: 'AMBIL BUMBU DARI COBEK KE ' + where };
        }
        if (val === 'egg') return eggOnly(w.batter) ? { v: BATTER.v, r: BATTER_ZONE, text: 'ANGKAT MANGKUK, TUANG TELUR KE ' + where } : { v: LEFT, spot: 'eggs', text: 'AMBIL TELUR, MASUKKAN KE ' + where };
        if (val === 'rice') return { v: LEFT, spot: 'rice', text: w.riceOpen ? 'AMBIL NASI, MASUKKAN KE ' + where : 'KLIK TEMPAT NASI UNTUK MEMBUKA' };
        if (w.dough && w.dough.stage === val) return { v: LEFT, r: DOUGH_BOARD, text: 'BAWA ' + label + ' KE ' + where };
        return step;
      }
      if (kind === 'sp') {
        const spice = SPICE_BY_ID[val];
        return { v: RIGHT, r: STORES[SPICE_STORE[val]].door, text: 'AMBIL ' + spice.name + ', TABUR KE ' + (soup ? 'PANCI' : 'WAJAN') };
      }
    }
    if (step.key === 'ground') {
      if (w.blender.parts.length) return { v: LEFT, r: BLENDER_BTN, text: 'TAHAN TOMBOL BLENDER SAMPAI HALUS' };
      if (w.cobek.items.length) return { v: LEFT, spot: 'cobek', text: 'PEGANG ULEKAN, GOSOK DI COBEK' };
    }
    if (RECIPES[s.recipe].drink) {
      if (step.key === 'blIn') { const at = locate(RECIPES[s.recipe].drink + '+'); if (at) return { ...at, text: step.text }; }
      if (step.key === 'blWater') return waterCupGuide();
      if (step.key === 'blend') return { v: LEFT, r: BLENDER_BTN, text: step.text };
      if (step.key === 'jPour') return { v: LEFT, r: BLENDER_ZONE, text: step.text };
    }
    if (step.key === 'cutBeef') return cut('beef', 'DAGING');
    if (step.key === 'cutBanana') return cut('banana', 'PISANG');
    if (step.key === 'cutChili') return cut('chili', 'CABAI');
    if (step.key === 'cutShallot') return cut('shallot', 'BAWANG');
    if (step.key === 'coat') { const at = locate('banana+'); if (at) return { ...at, text: step.text }; }
    if (step.key === 'toCobek') {
      const inTool = f => (RECIPES[s.recipe].soup ? w.blender.parts.some(p => p.food === f) : w.cobek.items.includes(f));
      const need = ['chili+', 'shallot+'].find(f => !inTool(f)), at = need && locate(need);
      if (at) return { ...at, text: step.text };
    }
    if ((step.key === 'bumbuIn' || step.key === 'potBumbu') && w.blender.result && w.blender.result.kind === 'sambal') return { v: LEFT, r: BLENDER_ZONE, text: 'ANGKAT BLENDER, TUANG BUMBU KE ' + (step.key === 'potBumbu' ? 'PANCI' : 'WAJAN') };
    if (step.key === 'potBeef') { const at = locate('beef+'); if (at) return { ...at, text: step.text }; }
    if (step.key === 'potShallot') { const at = locate('shallot+'); if (at) return { ...at, text: step.text }; }
    if (step.key === 'potBumbu') { const at = locate('bumbu'); if (at) return { ...at, text: step.text }; }
    if (step.key === 'simmer' && w.flameR === 0) return { v: RIGHT, spot: 'knobR', text: 'NYALAKAN API KANAN LAGI' };
    if (step.key === 'riceIn') {
      const at = locate('rice');
      if (at) return { ...at, text: step.text };
      if (!w.riceOpen) return { v: LEFT, spot: 'rice', text: 'KLIK TEMPAT NASI UNTUK MEMBUKA' };
    }
    if (step.key === 'beefIn') { const at = locate('beef+'); if (at) return { ...at, text: step.text }; }
    if (step.key === 'inWok') { const at = locate('coated'); if (at) return { ...at, text: step.text }; }
    if (step.key === 'bumbuIn') { const at = locate('bumbu'); if (at) return { ...at, text: step.text }; }
    if (w.wokInSink && ['oil', 'fire', 'inWok', 'bumbuIn', 'eggIn', 'riceIn', 'beefIn', 'soy', 'salt', 'cooked', 'plated'].includes(step.key)) return { v: RIGHT, spot: 'sink', text: 'CUCI WAJAN ATAU BAWA KEMBALI KE KOMPOR' };
    if (w.potInSink && ['boil', 'pour', 'potBeef', 'potShallot', 'potBumbu', 'potSalt', 'simmer', 'ladled'].includes(step.key)) return { v: RIGHT, spot: 'sink', text: w.potWater >= 1 ? 'ANGKAT PANCI KEMBALI KE KOMPOR' : w.tapOn ? 'TUNGGU PANCI TERISI' : 'BUKA KERAN UNTUK MENGISI PANCI' };
    if (w.potWater < 0.3 && ['boil', 'pour', 'potBeef', 'potShallot', 'potBumbu', 'potSalt', 'simmer', 'ladled'].includes(step.key)) return { v: RIGHT, spot: 'pot', text: 'TARUH PANCI DI WASTAFEL UNTUK DIISI' };
    if (step.key === 'cup' && !cups().some(cup => !cupDirty(cup))) return { v: RIGHT, spot: 'sink', text: 'SEMUA GELAS KOTOR, CUCI DI WASTAFEL' };
    if (step.key === 'plateOut' && !stackLeft('plate')) return { v: RIGHT, spot: 'sink', text: 'PIRING HABIS, CUCI DI WASTAFEL' };
    if (step.key === 'bowlOut' && !stackLeft('bowl')) return { v: RIGHT, spot: 'sink', text: 'MANGKUK HABIS, CUCI DI WASTAFEL' };
    if (step.key === 'boil' && w.flameR > 0) return { v: RIGHT, spot: 'pot', text: 'TUNGGU AIR MENDIDIH' };
    if (step.key === 'pour' && w.pot.parts.length) return { v: RIGHT, spot: 'pot', text: 'KELUARKAN BAHAN DARI PANCI DULU' };
    if (step.key === 'cooked') {
      if (w.flameL === 0) return { v: RIGHT, spot: 'knobL', text: 'NYALAKAN API KIRI LAGI' };
      if (s.slide) return { v: RIGHT, spot: 'wok', text: 'DORONG TERUS KE BAWAH PISANG' };
      if (w.wok.pieces.some(p => p.onBlade)) return { v: RIGHT, spot: 'wok', text: 'LEMPAR CEPAT KE ATAS UNTUK MEMBALIK' };
      if (holding('spatula')) return { v: RIGHT, spot: 'wok', text: w.wok.pieces.length ? 'SELIPKAN SUTIL DARI BAWAH PISANG' : 'ADUK KE SELURUH WAJAN' };
      return { v: RIGHT, spot: 'spatula', text: w.wok.pieces.length ? 'AMBIL SUTIL UNTUK MEMBALIK PISANG' : 'AMBIL SUTIL, ADUK KE SELURUH WAJAN' };
    }
    if (step.key === 'served') {
      const ready = RECIPES[s.recipe].soup ? bowls().find(b => b.dish && b.fill >= 0.6) : RECIPES[s.recipe].drink ? cups().find(cup => drinkOf(cup) === s.recipe) : step.spot === 'plate' ? cups().find(isKopi) : w.things.find(t => t.kind === 'plate' && t.dish);
      const wanted = s.world.guests.findIndex(p => p && p.state === 'wait' && p.order === s.recipe);
      if (wanted >= 0 && (!ready || ready.v === FRONT)) return { v: FRONT, r: seatRect(wanted), text: 'TARUH DI DEPAN PELANGGAN' };
      if (ready) return { v: ready.v, r: thingRect(ready), text: step.text };
      return { v: FRONT, spot: 'plate', text: step.text };
    }
    return step;
  }

  function targetsFor(hand) {
    if (!hand) return [];
    const L = spot => ({ v: LEFT, r: SPOTS[LEFT][spot] }), R = spot => ({ v: RIGHT, r: SPOTS[RIGHT][spot] }), F = { v: FRONT, r: SERVE_ZONE };
    const w = s.world, placed = cups().map(cup => ({ v: cup.v, r: thingRect(cup) }));
    if (hand.money !== undefined) return CASH_DRAWERS.map(d => ({ v: FRONT, r: d }));
    if (hand.scoop) return [{ v: BATTER.v, r: BATTER_ZONE }];
    if (hand.spice) return [R('wok'), R('pot'), ...w.things.filter(t => t.kind === 'cup' || t.kind === 'plate' || t.kind === 'bowl').map(t => ({ v: t.v, r: thingRect(t) }))];
    if (hand.tool === 'pot') return [R('sink')];
    if (hand.tool === 'spons') return w.sink.length || w.things.some(t => t.v === RIGHT && inRect(SINK, t.x, t.y)) ? [R('sink')] : [];
    if (KNIVES[hand.tool]) return w.board.some(b => !isChopped(b)) ? [L('board')] : [];
    if (hand.tool === 'pestle') return w.cobek.items.length >= 2 && w.cobek.ground < 1 ? [L('cobek')] : [];
    if (hand.tool === 'spoon') return w.spoonLoaded ? cups().filter(cup => !cup.powder).map(cup => ({ v: cup.v, r: thingRect(cup) })) : [R('coffee')];
    if (['kecap', 'minyak', 'garam', 'spatula'].includes(hand.tool)) return [R('wok')];
    if (hand.tool === 'ladle') return w.ladle > 0 ? (w.ladleKind === 'soup' ? bowls() : cups()).map(t => ({ v: t.v, r: thingRect(t) })) : w.potHeat >= 1 ? [R('pot')] : [];
    if (hand.food === 'bowl') return hand.bowl && hand.bowl.dish ? [F] : hand.bowl && (hand.bowl.parts || []).length ? [R('wok'), R('pot'), R('mat'), F] : hand.bowl && plateCount(hand.bowl) ? [R('mat'), F] : [R('mat'), F, { v: RIGHT, r: BOWL_STACK }];
    if (hand.tool === 'wok') return w.wok.items.length ? [...w.things.filter(t => t.kind === 'plate' && t.v === RIGHT && plateCount(t) < MAX_COOK_PARTS).map(t => ({ v: RIGHT, r: thingRect(t) })), L('bin')] : [R('sink')];
    if (hand.tool === 'whisk') return ((w.batter.flour > 0 && w.batter.water > 0) || eggOnly(w.batter)) && w.batter.mix < 1 ? [{ v: BATTER.v, r: BATTER_ZONE }] : [];
    if (hand.tool === 'pin') return w.dough && w.dough.stage === 'adonan' ? [{ v: LEFT, r: doughRect(w.dough) }] : [];
    if (hand.tool === 'batterBowl' && (eggOnly(w.batter) || (batterReady(w.batter) && batterWord(w.batter) !== 'KENTAL'))) return [R('wok'), R('pot'), ...w.things.filter(t => t.kind === 'plate' || t.kind === 'bowl').map(t => ({ v: t.v, r: thingRect(t) })), L('bin')];
    if (hand.tool === 'batterBowl') return batterReady(w.batter) && batterWord(w.batter) === 'KENTAL' && !w.dough ? [L('board'), L('bin')] : [L('bin')];
    if (hand.tool === 'blender') {
      const r = w.blender.result;
      if (r && r.kind === 'juice') return cups().map(t => ({ v: t.v, r: thingRect(t) }));
      if (r) return [R('wok'), R('pot'), ...w.things.filter(t => t.kind === 'plate' || t.kind === 'bowl').map(t => ({ v: t.v, r: thingRect(t) }))];
      return [L('bin')];
    }
    if (hand.tool) return [];
    const f = hand.food;
    const cookers = [R('wok'), R('pot'), ...w.things.filter(t => t.kind === 'plate' || t.kind === 'bowl').map(t => ({ v: t.v, r: thingRect(t) }))];
    if (BLENDABLE[f]) cookers.push(L('blender'));
    if (f === 'egg' && !hand.cook) cookers.push({ v: BATTER.v, r: BATTER_ZONE });
    if (f.endsWith('~') || (f === 'coated' && hand.item && !hand.item.crumb)) cookers.push(L('crumb'));
    if (DOUGH_FOODS.includes(f) && !w.dough) cookers.push(L('board'));
    if (f.endsWith('+') && hand.item && batterReady(w.batter)) cookers.push({ v: BATTER.v, r: BATTER_ZONE });
    if (FOOD_SIZE[f]) return [L('board'), ...cookers];
    if (f === 'banana+') return [L('flour'), ...cookers];
    if (f === 'chili+' || f === 'shallot+') return [L('cobek'), ...cookers];
    if (f.endsWith('+') || f.endsWith('~') || f.endsWith('^') || DOUGH_FOODS.includes(f) || ['coated', 'bumbu', 'egg', 'rice'].includes(f)) return cookers;
    if (f === 'cup') return (hand.cup && hand.cup.dirty) || w.tapOn ? [R('sink'), F] : [F];
    if (f === 'plateEmpty') return hand.plate && hand.plate.parts && hand.plate.parts.length ? [R('wok'), R('pot'), R('mat')] : hand.plate && plateCount(hand.plate) ? [R('mat')] : [R('mat'), R('plates')];
    if (f === 'plateReady') return [F];
    return placed.slice(0, 0);
  }

  function setFlame(key, level) {
    const w = s.world;
    if (w[key] === level) return;
    w[key] = level; sfx(level ? 'gasOn' : 'gasOff');
    s.flameTag = { x: key === 'flameL' ? 292 : 352, text: (key === 'flameL' ? 'API KIRI: ' : 'API KANAN: ') + FLAME_NAMES[level], level, t: 1.3 };
    if (key === 'flameL' && level > 0) mark('fire');
  }
  const doughRect = d => ({ x: d.x - 29, y: 234, w: 58, h: 36 });
  function doughSlot(x) {
    const w = s.world, free = BOARD_SLOTS.filter(([sx]) => !w.board.some(b => Math.abs(b.x - sx) < 8));
    if (!free.length) return null;
    free.sort((a, b) => Math.abs(a[0] - x) - Math.abs(b[0] - x));
    return free[0][0];
  }
  function placeOnBoard(it, x, y) {
    const w = s.world;
    const free = BOARD_SLOTS.filter(([sx]) => !w.board.some(b => b !== it && Math.abs(b.x - sx) < 8) && !(w.dough && Math.abs(w.dough.x - sx) < 8));
    if (!free.length) return false;
    free.sort((a, b) => Math.abs(a[0] - x) - Math.abs(b[0] - x));
    it.x = free[0][0]; it.y = free[0][1];
    if (!w.board.includes(it)) w.board.push(it);
    return true;
  }
  function cutItem(it, cutX) {
    const w = s.world, half = FOOD_SIZE[it.type][0] / 2;
    const rel = Math.round(Math.max(-half + 3, Math.min(half - 3, cutX - it.x)));
    if (it.cuts.some(c => Math.abs(c - rel) < MIN_CUT_GAP)) { nudge('GESER PISAU SEDIKIT'); return; }
    it.cuts.push(rel); it.cuts.sort((a, b) => a - b);
    it.born = it.born || {}; it.born[rel] = s.t;
    const usedKnife = s.hand && KNIVES[s.hand.tool] ? s.hand.tool : 'knife';
    it.knifeSum = (it.knifeSum || 0) + knifeFit(usedKnife, it.type).neat; it.knifeCuts = (it.knifeCuts || 0) + 1;
    s.shake = usedKnife === 'cleaver' ? 0.11 : 0.07; s.chopDip = 0.09; sfx(KNIVES[usedKnife].sound);
    w.scores.push({ x: it.x + rel + 1, y: it.y + FOOD_SIZE[it.type][1] / 2 + 2, h: 2 + Math.floor(Math.random() * 3) });
    if (w.scores.length > 28) w.scores.shift();
    const colors = FOOD_INFO[it.type] ? FOOD_INFO[it.type].bits : it.type === 'beef' ? ['#c75b5a', '#e7c9ba'] : it.type === 'banana' ? ['#f5dc8d', '#fff5e2'] : it.type === 'chili' ? ['#d9674f', '#f0c040'] : ['#d39a93', '#fff0ea'];
    burst(it.x + rel, it.y, colors, 5, 34);
    if (Math.random() < 0.2) addSpill(LEFT, it.x + rel + (Math.random() - 0.5) * 30, it.y + 18, colors[0]);
    if (isChopped(it)) {
      const edges = [-half, ...it.cuts, half], sizes = edges.slice(1).map((e, i) => e - edges[i]);
      const spread = (Math.max(...sizes) - Math.min(...sizes)) / average(sizes);
      w.cutNeat.push(Math.max(0.3, Math.min(1, 1.25 - spread * 0.6) * (it.knifeSum / it.knifeCuts)));
      burst(it.x, it.y - 2, colors, 9, 46);
      if (it.type === 'beef') mark('cutBeef');
      if (it.type === 'banana') mark('cutBanana');
      if (it.type === 'chili') mark('cutChili');
      if (it.type === 'shallot') mark('cutShallot');
    }
  }
  function itemUnderBlade(x, y) {
    return [...s.world.board].reverse().find(it => {
      if (isChopped(it) || it.y < y - 60 || it.y > y - 8) return false;
      return Math.abs(bladeXAt(x, y, it.y) - it.x) <= FOOD_SIZE[it.type][0] / 2 + 1;
    });
  }

  const bladeInWok = (x, y) => ((x - 262) / 56) ** 2 + ((y - 244) / 20) ** 2 <= 1;
  function placePiece(p, x, y) {
    const wok = s.world.wok;
    let nx = Math.max(-34, Math.min(34, x - 262)), ny = Math.max(-7, Math.min(7, y - 244));
    for (const other of wok.pieces) {
      if (other === p || Math.abs(other.x - nx) >= 18 || Math.abs(other.y - ny) >= 9) continue;
      nx = other.x + (nx >= other.x ? 19 : -19);
      if (Math.abs(nx) > 34) nx = other.x + (nx > 0 ? -19 : 19);
    }
    p.x = Math.max(-34, Math.min(34, nx)); p.y = ny;
  }
  function launchPiece(p, x, y, speed, sideSpeed) {
    const strength = Math.min(1, (speed - 170) / 430), vz = 125 + strength * 95, ground = 244 + p.y;
    p.x = Math.max(-34, Math.min(34, x - 262));
    p.onBlade = false;
    p.air = { z: Math.max(2, ground - (y - 5)), vz, vx: Math.max(-46, Math.min(46, sideSpeed * 0.18)), spin: 0, T: Math.max(0.34, (2 * vz) / 520), turned: false, bounced: false };
    burst(x, y - 5, ['#e9ac55', '#f5eddb', '#e0bd63'], 7, 58);
    sfx('flipUp');
  }
  function updateAirPieces(dt) {
    const wok = s.world.wok;
    for (const p of wok.pieces) {
      const a = p.air;
      if (!a) continue;
      a.vz -= 520 * dt; a.z += a.vz * dt; a.spin = Math.min(a.bounced ? 1 : 0.98, a.spin + dt / a.T);
      p.x = Math.max(-36, Math.min(36, p.x + a.vx * dt));
      if (!a.turned && a.spin >= 0.5) { p.side = p.side === 'a' ? 'b' : 'a'; a.turned = true; }
      if (a.z > 0 || a.vz >= 0) continue;
      if (!a.turned) { p.side = p.side === 'a' ? 'b' : 'a'; a.turned = true; }
      if (!a.bounced && a.vz < -55) {
        a.bounced = true; a.spin = 1; a.z = 0; a.vz = -a.vz * 0.2; a.vx *= 0.3; p.landT = 0.1;
        if (s.view === RIGHT) burst(262 + p.x, 244 + p.y, ['#e0bd63', '#fff0c4', '#e9ac55'], 8, 42);
        sfx('fritterLand');
        s.shake = 0.05;
      } else { p.air = null; p.landT = 0.08; placePiece(p, 262 + p.x, 244 + p.y); }
    }
  }
  function useSpatula(x, y, dx, dy) {
    const wok = s.world.wok;
    if (!wok.items.length) return;
    s.samples.push({ t: s.t, x, y });
    while (s.samples.length > 2 && s.t - s.samples[0].t > 0.11) s.samples.shift();
    if (wok.pieces.length) {
      const carried = !s.slide && wok.pieces.find(p => p.onBlade);
      if (carried) {
        const first = s.samples[0], span = Math.max(0.016, s.t - first.t), vy = (y - first.y) / span, vx = (x - first.x) / span;
        if (dy > 0) s.downRun += dy; else if (dy < 0) s.downRun = 0;
        if (vy < -170 && first.y - y >= 8 && s.carryY - y >= 6) { launchPiece(carried, x, y, -vy, vx); s.samples = []; s.downRun = 0; return; }
        if (s.downRun >= 15 && bladeInWok(x, y)) { placePiece(carried, x, y - 4); carried.onBlade = false; carried.landT = 0.08; s.downRun = 0; sfx('softPlace'); }
        return;
      }
      if (s.slide) {
        const p = s.slide.p, py = 244 + p.y, px0 = 262 + p.x;
        if (Math.abs(x - px0) > 18 || y > py + 21 || y < py - 10) { p.onBlade = false; s.slide = null; return; }
        s.slide.under = Math.max(0, Math.min(1, (py + 17 - y) / 14));
        if (s.slide.under <= 0.02 && dy > 0) { p.onBlade = false; s.slide = null; return; }
        if (s.slide.under >= 1) { s.slide = null; s.carryY = y; s.downRun = 0; sfx('spatulaScoop'); }
        return;
      }
      if (dy >= 0) return;
      const near = wok.pieces.filter(p => !p.air && p.flipT <= 0 && Math.abs(x - (262 + p.x)) <= 14 && y >= 244 + p.y + 5 && y <= 244 + p.y + 19)
        .sort((a, b) => Math.abs(x - 262 - a.x) - Math.abs(x - 262 - b.x))[0];
      if (near) { near.onBlade = true; s.slide = { p: near, under: Math.max(0, Math.min(1, (244 + near.y + 17 - y) / 14)) }; }
      return;
    }
    if (!bladeInWok(x, y)) return;
    const moved = Math.min(Math.hypot(dx, dy), 18);
    if (moved <= 0) return;
    wok.stir += moved;
    wok.pushX = Math.max(-5, Math.min(5, (x - 262) * 0.14));
    STIR_PATCHES.forEach((patch, i) => { if (Math.abs(x - (262 + patch)) <= 10) wok.patches[i] = 0; });
    if (Math.random() < 0.18) burst(x, y, ['#a9683b', '#e9dfc8'], 1, 26);
  }

  function takeFromWok() {
    const w = s.world, part = w.wok.parts.pop();
    if (!part) return false;
    w.wok.items = [...new Set(w.wok.parts.map(p => p.food))];
    if (part.food === 'coated' && !w.wok.items.includes('coated')) w.wok.pieces = [];
    if (!w.wok.parts.length) { w.wok.level = 0; w.wok.stir = 0; w.wok.spices = {}; }
    if (WOK_STEP[part.food] && !w.wok.items.includes(part.food)) delete w.done[WOK_STEP[part.food]];
    s.hand = handFrom(part);
    sfx('pickFood');
    return true;
  }
  function takeFromPot(x, y) {
    const w = s.world, part = w.pot.parts.pop();
    if (!part) return false;
    if (!w.pot.parts.length) { w.pot.level = 0; w.pot.salt = 0; w.pot.spices = {}; }
    const potStep = { 'beef+': 'potBeef', 'shallot+': 'potShallot', bumbu: 'potBumbu' }[part.food];
    if (potStep && !w.pot.parts.some(p => p.food === part.food)) delete w.done[potStep];
    delete w.done.simmer;
    s.hand = handFrom(part); s.hand.fromPot = [x, y];
    sfx('pickWet');
    return true;
  }
  function addToWok(f, item, x, y, cook) {
    const w = s.world;
    if (w.wokInSink) { nudge('WAJAN MASIH DI WASTAFEL'); putThing({ kind: 'food', ...newPart(f, item, cook) }, x, y + 40); return; }
    if (w.wok.parts.length >= MAX_COOK_PARTS) { nudge('WAJAN PENUH, BAHAN DITARUH DI MEJA'); putThing({ kind: 'food', ...newPart(f, item, cook) }, x, y); return; }
    const added = newPart(f, item, cook);
    w.wok.parts.push(added);
    w.wok.items = [...new Set(w.wok.parts.map(p => p.food))];
    if (f === 'coated') {
      if (!w.wok.pieces.length) w.wok.pieces = freshFritters();
      const mixed = average(w.wok.parts.filter(p => p.food === 'coated').map(p => cookVal(p, 'goreng')));
      w.wok.pieces.forEach(p => { p.a = mixed; p.b = mixed; });
    }
    if (WOK_STEP[f]) mark(WOK_STEP[f]);
    if (f === 'egg') { burst(262, 240, ['#f7efe0', '#e8b64c', '#a98a6b'], 7); sfx('eggCrack'); }
    else sfx('wokDrop');
    burst(262, 240, ['#f5eddb', '#e0bd63'], 5, 44);
    if (w.wok.oil < MIN_AMOUNT) nudge('MASUK! TAMBAH MINYAK AGAR TIDAK LENGKET');
  }
  function addToPot(f, item, x, y, cook) {
    const w = s.world;
    if (w.potInSink) { nudge('PANCI MASIH DI WASTAFEL'); putThing({ kind: 'food', ...newPart(f, item, cook) }, x, y + 40); return; }
    if (w.pot.parts.length >= MAX_COOK_PARTS) { nudge('PANCI PENUH, BAHAN DITARUH DI MEJA'); putThing({ kind: 'food', ...newPart(f, item, cook) }, x, y); return; }
    w.pot.parts.push(newPart(f, item, cook));
    if (f === 'beef+') mark('potBeef');
    if (f === 'shallot+') mark('potShallot');
    if (f === 'bumbu') mark('potBumbu');
    burst(POT.x, POT.top + 2, ['#d3e7e3', '#f4fbf8'], 8, 38);
    sfx('potDrop');
    if (w.flameR === 0) nudge('MASUK! NYALAKAN API KANAN UNTUK MEREBUS');
  }

  function grab(x, y) {
    const w = s.world;
    if (s.view === FRONT) {
      const bubble = w.guests.findIndex((p, i) => p && p.state === 'wait' && inRect(bubbleRect(i), x, y));
      if (bubble >= 0) { s.recipe = w.guests[bubble].order; syncDone(); nudge('MASAK ' + RECIPES[s.recipe].name); sfx('ticket'); return true; }
      const pile = cashAt(x, y);
      if (pile) { w.cash.splice(w.cash.indexOf(pile), 1); s.hand = { money: pile.amount, pile }; sfx('coinsPick'); return true; }
      const drawer = drawerAt(x, y);
      if (drawer >= 0) { s.drawerOpen[drawer] = !s.drawerOpen[drawer]; sfx(s.drawerOpen[drawer] ? 'drawerOpen' : 'drawerClose'); return true; }
    }
    const touched = [...w.things].reverse().filter(t => t.v === s.view && inRect(thingRect(t), x, y));
    const t = touched.find(q => q.kind !== 'plate') || touched[0];
    if (t) {
      if (t.atSeat !== undefined && w.guests[t.atSeat] && w.guests[t.atSeat].state === 'eat') { nudge('PELANGGAN SEDANG MAKAN'); return true; }
      delete t.atSeat;
      const eggBowl = t.kind === 'bowl' && (t.parts || []).length && t.parts.every(p => p.cracked || p.beaten);
      if ((t.kind === 'plate' || t.kind === 'bowl') && (t.parts || []).length && inPlateCenter(t, x, y) && !eggBowl) {
        const part = t.parts.pop();
        s.hand = handFrom(part);
        t.lastName = comboName(t);
        if (!plateCount(t)) t.spices = {};
        sfx('pickFood');
        return true;
      }
      w.things.splice(w.things.indexOf(t), 1);
      if (t.kind === 'cup') s.hand = { food: 'cup', cup: t };
      else if (t.kind === 'bowl') s.hand = { food: 'bowl', bowl: t };
      else if (t.kind === 'plate') {
        const riders = cups().filter(cup => cup.v === t.v && Math.abs(cup.x - t.x) < 18 && Math.abs(cup.y - t.y) < 11);
        w.things = w.things.filter(q => !riders.includes(q));
        s.hand = { food: t.dish ? 'plateReady' : 'plateEmpty', plate: t, dish: t.dish, riders };
      } else s.hand = t.item ? { food: foodOf(t.item), item: t.item, cuts: t.item.cuts } : { food: t.food, cook: t.cook, cracked: t.cracked, beaten: t.beaten };
      sfx(t.kind === 'cup' ? 'glassPick' : t.kind === 'plate' ? 'platePick' : t.kind === 'bowl' ? 'ceramicPick' : 'pickFood');
      return true;
    }
    if (s.view === LEFT && inRect(COBEK_ZONE, x, y) && w.cobek.ground >= 1) {
      s.hand = { food: 'bumbu', cook: bumbuCook('ulek') }; w.cobek = { items: [], parts: [], ground: 0 }; return true;
    }
    if (s.view === LEFT && inRect(COBEK_ZONE, x, y) && w.cobek.ground === 0 && w.cobek.items.length && x < 464) {
      const part = w.cobek.parts.pop();
      w.cobek.items = w.cobek.items.filter(f => f !== part.food);
      s.hand = { food: part.food, item: part.item, cuts: part.item ? part.item.cuts : [] };
      return true;
    }
    if (s.view === LEFT) {
      for (let i = w.board.length - 1; i >= 0; i--) {
        const it = w.board[i];
        if (inRect(itemBox(it), x, y)) {
          w.board.splice(i, 1);
          s.hand = { food: foodOf(it), item: it, cuts: it.cuts };
          return true;
        }
      }
    }
    if (s.view === RIGHT && w.wok.parts.length && inRect(WOK_ZONE, x, y) && !inRect(WOK_HANDLE, x, y)) return takeFromWok();
    if (s.view === RIGHT && !w.potInSink && w.pot.parts.length && inRect(POT_OPENING, x, y)) return takeFromPot(x, y);
    if (s.view === LEFT && w.dough && inRect(doughRect(w.dough), x, y)) {
      s.hand = { food: w.dough.stage }; w.dough = null; sfx('doughLift');
      return true;
    }
    if (s.view === LEFT && inRect(SAGU_ZONE, x, y)) {
      s.hand = { scoop: true, sagu: true }; s.tilt = 0;
      burst(x, 176, ['#ffffff', '#e4e9dc'], 4, 18); sfx('flourScoop');
      return true;
    }
    if (s.view === BATTER.v && toolHit('whisk', x, y) && !s.flying.batterBowl) {
      delete s.flying.whisk; s.hand = { tool: 'whisk' }; s.tilt = 0; sfx('whiskPick');
      return true;
    }
    if (atBatter(x, y)) {
      delete s.flying.batterBowl;
      s.hand = { tool: 'batterBowl', offset: [BATTER.x - x, BATTER.y - y] }; s.tilt = 0; s.pourT = 0;
      sfx('ceramicPick');
      return true;
    }
    if (s.view === LEFT && inRect(SPOTS[LEFT].flour, x, y)) {
      s.hand = { scoop: true }; s.tilt = 0;
      burst(x, 158, ['#fffaf0', '#e9dfc8'], 4, 18); sfx('flourScoop');
      return true;
    }
    if (s.view === LEFT && inRect(BLENDER_BTN, x, y)) {
      const b = w.blender;
      if (b.result) nudge('SUDAH HALUS, ANGKAT TEKO BLENDER');
      else if (!b.parts.length) nudge('MASUKKAN BAHAN YANG SUDAH DIIRIS');
      else if (blendResult(b).kind === 'juice' && b.water < JUICE_WATER) nudge('TAMBAH AIR SAMPAI ZONA KUNING');
      else s.blending = true;
      return true;
    }
    if (s.view === LEFT && inRect(BLENDER_ZONE, x, y) && y < BLENDER_BTN.y - 6) {
      const b = w.blender;
      if (b.parts.length && b.level === 0) { const part = b.parts.pop(); s.hand = handFrom(part); sfx('pickFood'); return true; }
      if (b.result || b.level > 0 || b.water > 0) {
        delete s.flying.blender; s.hand = { tool: 'blender', offset: [TOOL_DEFS.blender.home[0] - x, TOOL_DEFS.blender.home[1] - y] };
        s.tilt = 0; s.pourT = 0; sfx('toolPick', 'blender');
        return true;
      }
      nudge('MASUKKAN BAHAN YANG SUDAH DIIRIS');
      return true;
    }
    for (const [id, t] of Object.entries(TOOL_DEFS)) {
      if (t.v !== s.view || !toolHit(id, x, y)) continue;
      delete s.flying[id];
      s.hand = { tool: id };
      if (id === 'wok' || id === 'pot') s.hand.offset = [t.home[0] - x, t.home[1] - y];
      if (id === 'pot') s.potHold = 0;
      if (id === 'pot' && w.potInSink) { s.hand.offset = [POT_IN_SINK[0] - x, POT_IN_SINK[1] - y]; w.potInSink = false; s.potFullT = 0; }
      if (id === 'wok' && w.wokInSink) { s.hand.offset = [WOK_IN_SINK[0] - x, WOK_IN_SINK[1] - y]; w.wokInSink = false; }
      s.tilt = 0; s.slide = null; s.samples = []; s.downRun = 0; sfx('toolPick', id);
      return true;
    }
    if (s.view === RIGHT) {
      const spiceDoor = storeDoorAt(x, y, RIGHT);
      if (spiceDoor) { s.store = spiceDoor; s.storeShown = spiceDoor; sfx('cabinetOpen'); return true; }
      if (inRect(PLUG, x, y)) { w.plug = !w.plug; sfx(w.plug ? 'plugIn' : 'plugOut'); return true; }
      if (inRect(TAP, x, y)) { w.tapOn = !w.tapOn; sfx(w.tapOn ? 'tapOn' : 'tapOff'); return true; }
      if (inRect(FAN_SWITCH, x, y)) { w.fan = !w.fan; sfx('switch'); return true; }
      for (const [spot, key] of [['knobL', 'flameL'], ['knobR', 'flameR']]) {
        if (inRect(SPOTS[RIGHT][spot], x, y)) { s.knob = { key, x0: x, level0: w[key], moved: false }; return true; }
      }
      if (inRect(BOWL_STACK, x, y)) {
        if (!stackLeft('bowl')) { nudge('MANGKUK HABIS, CUCI DI WASTAFEL'); return true; }
        s.hand = { food: 'bowl' }; sfx('ceramicPick'); return true;
      }
      if (inRect(SPOTS[RIGHT].plates, x, y)) {
        if (!stackLeft('plate')) { nudge('PIRING HABIS, CUCI DI WASTAFEL'); return true; }
        s.hand = { food: 'plateEmpty' }; sfx('platePick'); return true;
      }
      for (let i = 0; i < UTENSILS.length; i++) {
        if (Math.abs(x - UTENSILS[i].x) <= 10 && y >= 136 && y <= 188) { s.swing[i].v += x < UTENSILS[i].x ? 3.4 : -3.4; sfx('utensil', i); return true; }
      }
      if (inRect(SPOTS[RIGHT].hood, x, y)) { s.hoodLight = !s.hoodLight; sfx('switch'); return true; }
    }
    if (s.view === LEFT) {
      const door = storeDoorAt(x, y);
      if (door) { s.store = door; s.storeShown = door; sfx(door === 'cold' ? 'fridgeOpen' : 'cabinetOpen'); return true; }
      if (w.riceOpen && inRect(RICE_LID, x, y)) { w.riceOpen = false; sfx('riceLidClose'); return true; }
      if (inRect(SPOTS[LEFT].rice, x, y)) {
        if (!w.riceOpen) { w.riceOpen = true; sfx('riceLidOpen'); return true; }
        s.hand = { food: 'rice', source: 'rice' };
        sfx('riceScoop');
        return true;
      }
      const sources = { eggs: 'egg' };
      for (const [spot, food] of Object.entries(sources)) if (inRect(SPOTS[LEFT][spot], x, y)) { s.hand = { food, source: spot }; return true; }
    }
    return false;
  }

  function releaseTool(hand) {
    const w = s.world, t = TOOL_DEFS[hand.tool];
    if (hand.tool === 'ladle') {
      w.ladle = 0;
      const bowl = s.pouredBowl;
      if (bowl) {
        mergeSpices(bowl, w.pot);
        if (bowl.fill >= 0.6) { w.pot = { parts: [], level: 0, salt: 0, spices: {} }; mark('ladled'); checkServed(); }
        else nudge('KUAHNYA MASIH KURANG, AMBIL LAGI');
      }
      s.pouredBowl = null;
      const cup = s.pouredCup;
      if (cup && cup.water > 0 && !w.done.pour) {
        if (isKopi(cup)) { mark('pour'); checkServed(); }
        else if (cup.powder && cup.cold) nudge('KOPI BUTUH AIR PANAS, BUANG DULU');
        else if (cup.powder) nudge('KOPINYA MASIH KENTAL, TAMBAH AIR');
        else if (s.recipe === 'kopi') nudge('BARU AIR PANAS, TAMBAHKAN KOPI');
      }
      s.pouredCup = null;
    }
    if (hand.tool === 'spoon') w.spoonLoaded = false;
    if (hand.tool === 'spatula') {
      if (s.slide) { s.slide.p.onBlade = false; s.slide = null; }
      const carried = w.wok.pieces.find(p => p.onBlade);
      if (carried) {
        if (s.view === RIGHT && bladeInWok(s.mouse[0], s.mouse[1])) placePiece(carried, s.mouse[0], s.mouse[1] - 4);
        carried.onBlade = false; carried.landT = 0.08;
      }
      s.samples = [];
    }
    if (hand.tool === 'batterBowl') {
      const bx = s.mouse[0] + hand.offset[0], by = s.mouse[1] + hand.offset[1], b = w.batter;
      // Adonan kental yang dibawa ke talenan langsung dituang untuk digilas.
      const toBoard = s.view === LEFT && b.flour > 0 && inRect(DOUGH_BOARD, bx, by) && Math.hypot(bx - BATTER.x, by - BATTER.y) > 10;
      if (toBoard) {
        const slot = w.dough ? null : doughSlot(bx);
        if (w.dough) nudge('TALENAN MASIH TERPAKAI');
        else if (slot === null) nudge('TALENAN PENUH');
        else if (!batterReady(b)) nudge('ADUK ADONAN SAMPAI RATA DULU');
        else if (batterWord(b) !== 'KENTAL') nudge('ADONAN HARUS KENTAL UNTUK DIGILAS');
        else {
          w.dough = { stage: 'adonan', roll: 0, cut: 0, x: slot }; w.batter = freshBatter();
          burst(slot, 248, ['#f0dfb8', '#fffaf0'], 8, 26); sfx('doughPlop');
          nudge('PEGANG PENGGILING, GILAS DI TALENAN');
        }
      }
      const toTrash = s.view === LEFT && Math.abs(bx - TRASH.x) < 42 && by > 222 && by < 290;
      if (!toBoard && !toTrash) {
        const backHome = s.view === LEFT && Math.abs(bx - 228) < 30 && Math.abs(by - 206) < 24;
        const [nx, ny] = backHome ? [228, 206] : freeSpot(s.view, bx, Math.max(216, by), 'batterBowl');
        w.batterSpot = { v: s.view, x: nx, y: backHome ? ny : Math.min(262, ny) };
        syncBatterSpot();
      }
      if (s.view === BATTER.v) s.flying.batterBowl = { x: bx, y: by, a: s.tilt, t: 0 };
      sfx('toolDown', 'batterBowl');
      return;
    }
    if (hand.tool === 'pot' && s.view === RIGHT) {
      const px0 = s.mouse[0] + hand.offset[0], py0 = s.mouse[1] + hand.offset[1];
      if (Math.abs(px0 - 92) < 66 && py0 > 130 && py0 < 262) {
        if (w.wokInSink) nudge('WAJAN MASIH DI BAK');
        else {
          w.potInSink = true; s.potFullT = 0;
          nudge(w.potWater >= 1 ? 'PANCI SUDAH PENUH' : w.tapOn ? 'PANCI SEDANG DIISI' : 'BUKA KERAN UNTUK MENGISI PANCI');
          sfx('metalDown');
          return;
        }
      }
    }
    if (hand.tool === 'wok' && s.view === RIGHT) {
      const wx = s.mouse[0] + hand.offset[0], wy = s.mouse[1] + hand.offset[1];
      if (Math.abs(wx - WOK_IN_SINK[0]) < 66 && wy > 190 && wy < 300) {
        if (w.wok.items.length) nudge('KOSONGKAN WAJAN DULU');
        else if (w.potInSink) nudge('PANCI MASIH DI BAK');
        else { w.wokInSink = true; nudge(w.tapOn || w.sinkWater >= 0.1 ? 'GOSOK WAJAN PAKAI SPONS' : 'BUKA KERAN, LALU GOSOK PAKAI SPONS'); sfx('metalDown'); return; }
      }
    }
    if (s.view === t.v && hand.tool !== 'spatula') {
      const [x, y] = hand.tool === 'wok' || hand.tool === 'pot' || hand.tool === 'blender' || hand.tool === 'batterBowl' ? [s.mouse[0] + hand.offset[0], s.mouse[1] + hand.offset[1]] : hand.tool === 'garam' ? [s.mouse[0], saltY(s.mouse[1])] : s.mouse;
      s.flying[hand.tool] = { x, y, a: s.tilt, t: 0 };
    }
    sfx('toolDown', hand.tool);
  }

  function drop(x, y) {
    const hand = s.hand, w = s.world;
    if (hand && hand.tool) releaseTool(hand);
    const jarTilt = s.tilt, jarDropY = hand && hand.spice ? jarY(y) : y;
    s.hand = null; s.tilt = 0; s.pourT = 0;
    if (hand && hand.money !== undefined) {
      const box = s.view === FRONT ? drawerAt(x, y) : -1;
      if (box >= 0) {
        w.money += hand.money; if (box) w.moneyR += hand.money; else w.moneyL += hand.money;
        sfx('cashIn');
        nudge('+' + money(hand.money)); s.savedFlash = 1.2;
      } else w.cash.push(hand.pile);
      return;
    }
    if (hand && hand.scoop) {
      const b = w.batter;
      if (atBatter(x, y)) {
        b.flour = Math.min(1.2, b.flour + 0.3); if (hand.sagu) b.sagu = Math.min(b.flour, b.sagu + 0.3); batterChanged(b);
        burst(BATTER.x, BATTER.y - 4, ['#fffaf0', '#e9dfc8'], 9, 26); sfx('flourPour');
        if (!doughStep()) nudge(b.water > 0 ? 'ADUK PAKAI KOCOKAN' : 'TAMBAH TELUR DAN AIR PAKAI GELAS');
      } else sfx('softPlace');
      return;
    }
    if (hand && hand.spice) {
      if (SPICE_BY_ID[hand.spice].v === s.view) s.flying['jar:' + hand.spice] = { x, y: jarDropY, a: jarTilt, t: 0 };
      sfx('jarDown');
      return;
    }
    if (!hand || !hand.food) return;
    const f = hand.food, overBin = s.view === LEFT && inRect(SPOTS[LEFT].bin, x, y);

    if (f === 'cup') {
      const cup = hand.cup;
      if (s.view === FRONT) { const seat = CUSTOMER_SEATS.findIndex((_, n) => inRect(seatRect(n), x, y)); if (seat >= 0 && serveGuest(seat, cup)) return; }
      if (cupDirty(cup) && s.view === RIGHT && inRect(SINK, x, y)) { cupToSink(cup); w.things.push(cup); sfx('glassDown'); return; }
      if (overBin || (s.view === RIGHT && inRect(SPOTS[RIGHT].cups, x, y))) {
        if (overBin) { const hadWater = cup.water > 0; if (cupHasResidue(cup) || cup.used) cup.dirty = true; cup.water = 0; cup.powder = false; cup.spices = {}; cup.juice = null; cup.used = false; if (cup.dirty) nudge('ISI DIBUANG, GELAS MASUK WASTAFEL'); else if (hadWater) nudge('AIR DIBUANG, GELAS TETAP BERSIH'); }
        if (cupDirty(cup)) { cupToSink(cup); if (!overBin) nudge('GELAS KOTOR MASUK WASTAFEL'); }
        else { cup.v = RIGHT; [cup.x, cup.y] = CUP_HOMES[cup.id]; }
        w.things.push(cup);
        sfx('glassDown');
        return;
      }
      const saucer = plateAt(x, y);
      if (saucer && !cups().some(other => other.v === saucer.v && Math.abs(other.x - saucer.x) < 18 && Math.abs(other.y - saucer.y) < 11)) {
        putThing(cup, saucer.x, saucer.y + 4, true);
        sfx('glassDown'); mark('cup'); checkServed();
        return;
      }
      if (s.view === FRONT && inRect(SERVE_ZONE, x, y) && spotFree(320, 261, cup)) putThing(cup, 320, 261, true);
      else putThing(cup, x, y + 6);
      sfx('glassDown');
      mark('cup'); checkServed();
      return;
    }

    if (f === 'bowl') {
      const bowl = hand.bowl || { kind: 'bowl', dish: null, fill: 0, parts: [], sides: [] };
      if (s.view === FRONT && hand.bowl) { const seat = CUSTOMER_SEATS.findIndex((_, n) => inRect(seatRect(n), x, y)); if (seat >= 0 && serveGuest(seat, bowl)) return; }
      if (bowl.dirty && s.view === RIGHT && inRect(SINK, x, y)) { addDirty('bowl'); sfx('ceramicDown'); return; }
      if (bowl.dirty && s.view === RIGHT && inRect(BOWL_STACK, x, y)) nudge('MANGKUK KOTOR, BAWA KE WASTAFEL');
      if (!bowl.dirty && !plateCount(bowl) && s.view === RIGHT && inRect(BOWL_STACK, x, y)) { sfx('ceramicDown'); return; }
      if (s.view === RIGHT && !bowl.dish && (bowl.parts || []).length && (inRect(WOK_ZONE, x, y) || inRect(SPOTS[RIGHT].pot, x, y))) {
        const messy = holderMessy(bowl);
        pourParts(bowl, inRect(WOK_ZONE, x, y) ? addToWok : addToPot, x, y);
        if (messy) addDirty('bowl');
        sfx('ceramicDown'); nudge(messy ? 'ISI DITUANG, MANGKUK MASUK CUCIAN' : 'ISI DITUANG, MANGKUK TETAP BERSIH');
        return;
      }
      if (overBin) { if (holderMessy(bowl) || bowl.dirty) { nudge('ISI DIBUANG, MANGKUK MASUK CUCIAN'); addDirty('bowl'); } else if (plateCount(bowl)) nudge('ISI DIBUANG, MANGKUK TETAP BERSIH'); burst(TRASH.x, TRASH.y - 2, ['#dbb873', '#f0e6d0'], 5, 26); return; }
      if (s.view === RIGHT && inRect(MAT_ZONE, x, y) && spotFree(528, 262, bowl)) putThing(bowl, 528, 262, true);
      else if (s.view === FRONT && inRect(SERVE_ZONE, x, y) && spotFree(320, 254, bowl)) putThing(bowl, 320, 254, true);
      else putThing(bowl, x, y);
      sfx('ceramicDown');
      mark('bowlOut'); checkServed();
      return;
    }
    if (f === 'plateEmpty' || f === 'plateReady') {
      const plate = hand.plate || { kind: 'plate', dish: hand.dish || null, parts: [], sides: [] };
      const riders = hand.riders || [];
      plate.parts = plate.parts || []; plate.sides = plate.sides || [];
      const seatRiders = () => riders.forEach(cup => { cup.v = plate.v; cup.x = plate.x; cup.y = plate.y + 4; w.things.push(cup); });
      if (s.view === FRONT && hand.plate && !riders.length) { const seat = CUSTOMER_SEATS.findIndex((_, n) => inRect(seatRect(n), x, y)); if (seat >= 0 && serveGuest(seat, plate)) return; }
      if (plate.dirty && s.view === RIGHT && inRect(SINK, x, y)) { addDirty('plate'); riders.forEach(cup => { cupToSink(cup); w.things.push(cup); }); sfx('plateDown'); return; }
      if (plate.dirty && s.view === RIGHT && inRect(SPOTS[RIGHT].plates, x, y)) nudge('PIRING KOTOR, BAWA KE WASTAFEL');
      if (!plate.dirty && !plateCount(plate) && !riders.length && s.view === RIGHT && inRect(SPOTS[RIGHT].plates, x, y)) { sfx('plateDown'); return; }
      if (overBin) {
        if (holderMessy(plate) || plate.dirty) { nudge('ISI DIBUANG, PIRING MASUK CUCIAN'); addDirty('plate'); }
        else if (plateCount(plate)) nudge('ISI DIBUANG, PIRING TETAP BERSIH');
        riders.forEach(cup => { cup.v = RIGHT; [cup.x, cup.y] = CUP_HOMES[cup.id]; w.things.push(cup); });
        burst(TRASH.x, TRASH.y - 2, ['#b5b4bd', '#f0e6d0'], 5, 26);
        return;
      }
      if (s.view === RIGHT && plate.parts.length && (inRect(WOK_ZONE, x, y) || inRect(SPOTS[RIGHT].pot, x, y))) {
        const messy = holderMessy(plate);
        pourParts(plate, inRect(WOK_ZONE, x, y) ? addToWok : addToPot, x, y);
        if (messy) {
          addDirty('plate'); nudge('ISI DITUANG, PIRING MASUK CUCIAN');
          riders.forEach(cup => putThing(cup, 528, 262));
          return;
        }
        putThing(plate, 528, 262);
        seatRiders();
        return;
      }
      if (s.view === RIGHT && inRect(MAT_ZONE, x, y) && spotFree(528, 262, plate)) putThing(plate, 528, 262, true);
      else if (s.view === FRONT && inRect(SERVE_ZONE, x, y) && spotFree(320, 254, plate)) putThing(plate, 320, 254, true);
      else putThing(plate, x, y);
      seatRiders();
      sfx('plateDown');
      if (plate.v === RIGHT) mark('plateOut');
      checkServed();
      return;
    }

    if (s.view === LEFT && inRect(DOUGH_BOARD, x, y) && DOUGH_FOODS.includes(f) && !hand.cook) {
      const slot = w.dough ? null : doughSlot(x);
      if (slot === null) { nudge(w.dough ? 'TALENAN MASIH TERPAKAI' : 'TALENAN PENUH'); putThing({ kind: 'food', ...newPart(f, hand.item, hand.cook) }, x, y); return; }
      w.dough = { stage: f, roll: f === 'adonan' ? 0 : 1, cut: 0, x: slot }; sfx('doughPlop');
      return;
    }
    if (atBatter(x, y) && f === 'egg' && !hand.cook) {
      if (w.batter.egg >= 2) { nudge('TELUR SUDAH CUKUP'); putThing({ kind: 'food', ...newPart(f, hand.item, hand.cook) }, x, y + 40); return; }
      w.batter.egg++; w.batter.mix = Math.min(w.batter.mix, 0.55);
      if (eggOnly(w.batter)) nudge('ANGKAT MANGKUK KE WAJAN, ATAU KOCOK DULU');
      burst(BATTER.x, BATTER.y - 4, ['#fff8ea', '#e8a93c', '#a98a6b'], 7, 22); sfx('eggCrack');
      return;
    }
    if (s.view === LEFT && inRect(BLENDER_ZONE, x, y)) { addToBlender(f, hand, x, y); return; }
    if (FOOD_SIZE[f] && !hand.item && s.view === LEFT && storeDoorAt(x, y)) { sfx('softPlace'); return; }
    if (hand.source && s.view === LEFT && inRect(SPOTS[LEFT][hand.source], x, y)) return;
    if (overBin) { burst(TRASH.x, TRASH.y - 2, ['#7d9868', '#a98a6b'], 6, 28); sfx('trash'); return; }
    const targetPlate = containerAt(x, y);
    if (targetPlate) { addToPlate(targetPlate, f, hand.item, x, y, hand.cook); if (hand.beaten || hand.cracked) markEgg(targetPlate.parts, hand); return; }
    const looseThing = () => ({ kind: 'food', ...newPart(f, hand.item, hand.cook), ...(hand.cracked ? { cracked: true } : {}), ...(hand.beaten ? { beaten: true } : {}) });

    if (s.view === LEFT && inRect(BOARD, x, y) && (FOOD_SIZE[f] || hand.item)) {
      const it = hand.item || { type: f, cuts: [] };
      if (placeOnBoard(it, x, y)) { sfx('foodBoard'); return; }
      nudge('TALENAN PENUH, BAHAN DITARUH DI MEJA');
      putThing({ kind: 'food', food: f, item: it }, x, y);
      return;
    }
    if (s.view === LEFT && inRect(COBEK_ZONE, x, y) && (f === 'chili+' || f === 'shallot+')) {
      if (w.cobek.items.includes(f) || w.cobek.ground > 0) { nudge('BAHAN INI SUDAH ADA DI COBEK'); putThing(looseThing(), x, y); return; }
      w.cobek.items.push(f); w.cobek.parts.push({ food: f, item: hand.item || null });
      burst(470, 250, ['#a83c32', '#d39a93']); sfx('cobekDrop');
      if (w.cobek.items.length >= 2) mark('toCobek');
      return;
    }
    if (s.view === RIGHT && inRect(WOK_ZONE, x, y)) { addToWok(f, hand.item, x, y, hand.cook); markEgg(w.wok.parts, hand); return; }
    if (s.view === RIGHT && hand.fromPot && inRect(SPOTS[RIGHT].pot, x, y) && Math.hypot(x - hand.fromPot[0], y - hand.fromPot[1]) < 8) {
      // Klik singkat: bahan diangkat ke piring atau mangkuk kosong, kalau tidak ada ke meja.
      const holder = w.things.find(t => t.v === RIGHT && !t.dirty && !t.dish && (t.kind === 'plate' || t.kind === 'bowl') && plateCount(t) < MAX_COOK_PARTS);
      if (holder) { addToPlate(holder, f, hand.item, holder.x, holder.y, hand.cook); markEgg(holder.parts, hand); }
      else { putThing(looseThing(), 470, 250); sfx('softPlace'); }
      nudge(foodLabel(hand) + ' DIANGKAT DARI PANCI');
      return;
    }
    if (s.view === RIGHT && inRect(SPOTS[RIGHT].pot, x, y)) { addToPot(f, hand.item, x, y, hand.cook); markEgg(w.pot.parts, hand); return; }
    putThing(looseThing(), x, y);
    sfx('softPlace');
  }

  function handleMotion(x, y, dx, dy) {
    const w = s.world;
    const rubbed = Math.hypot(dx, dy);
    if (rubbed > 0 && s.hand) {
      const tool = s.hand.tool;
      if (tool === 'spatula' && s.view === RIGHT && bladeInWok(x, y) && w.wok.items.length) Sound.rub('stir', rubbed);
      if (tool === 'pestle' && s.view === LEFT && inRect(COBEK_ZONE, x, y) && w.cobek.items.length >= 2) Sound.rub('grind', rubbed);
      if (tool === 'whisk' && atBatter(x, y) && (w.batter.flour > 0 || w.batter.egg > 0)) Sound.rub('whisk', rubbed);
      if ((tool === 'lap' || tool === 'lap2') && (w.spills.some(p => p.v === s.view && Math.abs(p.x - x) < p.r + 12 && Math.abs(p.y - y) < p.r + 8) || (s.view === RIGHT && inRect({ x: 176, y: 186, w: 292, h: 102 }, x, y)))) Sound.rub('rub', rubbed);
      if (tool === 'spons' && s.view === RIGHT && inRect(SINK, x, y)) Sound.rub('scrub', rubbed);
      if (tool === 'pin' && s.view === LEFT && w.dough && w.dough.stage === 'adonan' && inRect({ x: w.dough.x - 44, y: 226, w: 88, h: 54 }, x, y)) Sound.rub('roll', rubbed);
      if ((tool === 'garam' || s.hand.spice) && s.tilt < -2.4) Sound.rub('shake', rubbed);
    }
    if (holding('spons') && s.view === RIGHT && inRect(SINK, x, y) && rubbed > 0) scrub(x, y, rubbed);
    if (holding('pin') && s.view === LEFT && inRect(DOUGH_BOARD, x, y) && rubbed > 0) {
      const d = w.dough;
      if (!d) { if (s.nudgeT <= 0) nudge('BELUM ADA ADONAN DI TALENAN'); }
      else if (d.stage === 'adonan' && inRect({ x: d.x - 44, y: 226, w: 88, h: 54 }, x, y)) {
        d.roll = Math.min(1, d.roll + Math.min(rubbed, 14) / 230);
        s.meter = { v: LEFT, x: d.x, y: 228, value: d.roll, zone: null, t: 0.4 };
        if (Math.random() < 0.2) burst(x, y, ['#fffaf0', '#efe6d2'], 1, 14);
        if (d.roll >= 1) { d.stage = 'kulit'; nudge('JADI KULIT, IRIS UNTUK MIE ATAU LANGSUNG AMBIL'); sfx('doughDone'); }
      }
    }
    if (holdingKnife() && s.view === LEFT && w.dough && w.dough.stage === 'kulit' && Math.abs(x - w.dough.x) < 30 && y > 260 && y < 312 && dy) {
      const d = w.dough, before = Math.floor(d.cut * 10);
      d.cut = Math.min(1, d.cut + Math.min(Math.abs(dy), 12) / 150);
      if (Math.floor(d.cut * 10) > before) playSlice();
      s.meter = { v: LEFT, x: d.x, y: 228, value: d.cut, zone: null, t: 0.4 };
      if (d.cut >= 1) { d.stage = 'mie'; nudge('JADI MIE, BAWA KE WAJAN ATAU PANCI'); sfx('doughDone'); }
    }
    if (holding('whisk') && atBatter(x, y) && rubbed > 0) {
      const b = w.batter;
      if (!eggOnly(b) && (!b.flour || !b.water)) { if (s.nudgeT <= 0) nudge(!b.flour ? 'MASUKKAN TEPUNG ATAU TELUR' : 'TAMBAH AIR PAKAI GELAS'); }
      else if (b.mix < 1) {
        const was = b.mix;
        b.mix = Math.min(1, b.mix + Math.min(rubbed, 16) / 340); s.mixTurn += Math.min(rubbed, 16) * 0.05;
        s.meter = { v: BATTER.v, x: BATTER.x, y: Math.max(26, BATTER.y - 30), value: b.mix, zone: null, t: 0.4 };
        if (Math.random() < 0.2) burst(x, y, ['#f0dca8', '#fffaf0'], 1, 16);
        if (was < 1 && b.mix >= 1) { nudge(eggOnly(b) ? 'TELUR KOCOK SIAP, TUANG KE WAJAN' : 'ADONAN ' + batterWord(b) + ', CELUP IRISAN BAHAN'); sfx('mixDone'); }
      }
    }
    if ((holding('lap') || holding('lap2')) && rubbed > 0) { s.lapRub = 1; wipe(x, y, rubbed); }
    if (holdingKnife() && s.view === LEFT) {
      const it = itemUnderBlade(x, y);
      if (it && dy && itemUnderBlade(x - dx, y - dy) === it) {
        const rel = Math.round(bladeXAt(x, y, it.y) - it.x), direction = Math.sign(dy);
        if (!it.slice || Math.abs(it.slice.rel - rel) > 2) it.slice = { rel, depth: 0, direction: 0 };
        const at = it.slice.rel;
        if (it.slice.direction && it.slice.direction !== direction) playSlice();
        it.slice.direction = direction;
        if (it.cuts.some(c => Math.abs(c - at) < MIN_CUT_GAP)) nudge('GESER PISAU SEDIKIT');
        else {
          it.slice.depth += (Math.min(Math.abs(dy), 12) / SLICE_TRAVEL) * knifeFit(s.hand.tool, it.type).speed;
          if (Math.random() < 0.3) burst(it.x + at, it.y, FOOD_INFO[it.type] ? [FOOD_INFO[it.type].bits[0]] : it.type === 'beef' ? ['#c75b5a'] : it.type === 'banana' ? ['#fff5e2'] : it.type === 'chili' ? ['#d9674f'] : ['#f0d2c7'], 1, 12);
          if (it.slice.depth >= 1) { it.slice = null; cutItem(it, it.x + at); }
        }
      }
    }
    if (holding('pestle') && s.view === LEFT && inRect(COBEK_ZONE, x, y)) {
      if (w.cobek.items.length < 2) { if (Math.hypot(dx, dy) > 3) nudge('MASUKKAN CABAI DAN BAWANG DULU'); }
      else if (w.cobek.ground < 1) {
        w.cobek.ground = Math.min(1, w.cobek.ground + Math.min(Math.hypot(dx, dy), 18) / 420);
        if (Math.random() < 0.25) burst(x, y, ['#a83c32', '#c7624a'], 1, 14);
        s.meter = { v: LEFT, x: 470, y: 222, value: w.cobek.ground, zone: null, t: 0.4 };
        if (w.cobek.ground >= 1) { mark('ground'); sfx('mixDone'); }
      }
    }
    if (holding('spatula') && s.view === RIGHT) useSpatula(x, y, dx, dy);
    if (holding('wok') && s.view === RIGHT && wokNearBurner() && dy < -5 && w.wok.toss <= 0 && w.wok.items.length) {
      w.wok.toss = TOSS_TIME; w.wok.patches = w.wok.patches.map(() => 0);
      if (Math.random() < 0.3) spillNearWok('#b98a4e');
      w.wok.pieces.forEach(flipPiece);
      if (!w.wok.pieces.length) w.wok.stir += 26;
      burst(x, y - 8, w.wok.pieces.length ? ['#e9ac55', '#f5eddb'] : ['#a9683b', '#e9dfc8'], 7, 56);
      sfx('wokToss');
    }
    if (s.hand.spice && s.tilt < -2.4 && Math.hypot(dx, dy) > 0) {
      const spot = jarTarget(x, y), sp = SPICE_BY_ID[s.hand.spice];
      if (!spot) return;
      if (!spot.ready) { nudge(spot.empty); return; }
      spot.host.spices = spot.host.spices || {};
      spot.host.spices[sp.id] = Math.min(1, (spot.host.spices[sp.id] || 0) + Math.min(Math.hypot(dx, dy), 14) / 260);
      const [mx, my] = rotPoint(x, jarY(y), s.tilt, 0, 12 - sp.h), fall = Math.max(4, spot.y - my), life = (-34 + Math.sqrt(34 * 34 + 2 * 260 * fall)) / 260;
      for (let i = 0; i < 2; i++) if (Math.random() < 0.8) bits.push({ v: s.view, x: mx + (Math.random() - 0.5) * 8, y: my, vx: (Math.random() - 0.5) * 16, vy: 34, g: 260, life, c: sp.c });
      s.meter = { v: s.view, x: spot.x, y: Math.max(26, spot.y - 46), value: spot.host.spices[sp.id], zone: [SPICE_DONE, 0.9], t: 0.4 };
      return;
    }
    if (holding('garam') && !w.potInSink && s.view === RIGHT && overPotForSalt(x, y) && s.tilt < -2.4 && Math.hypot(dx, dy) > 0) {
      if (!w.pot.parts.length) { nudge('MASUKKAN BAHAN KE PANCI DULU'); return; }
      w.pot.salt = Math.min(1, w.pot.salt + Math.min(Math.hypot(dx, dy), 14) / 300);
      const [mx, my] = rotPoint(x, saltY(y), s.tilt, ...TOOL_DEFS.garam.mouth), fall = Math.max(4, POT.top + 3 - my), life = (-34 + Math.sqrt(34 * 34 + 2 * 260 * fall)) / 260;
      for (let i = 0; i < 2; i++) if (Math.random() < 0.8) bits.push({ v: RIGHT, x: mx + (Math.random() - 0.5) * 8, y: my, vx: (Math.random() - 0.5) * 16, vy: 34, g: 260, life, c: '#f6f0e3' });
      s.meter = { v: RIGHT, x: POT.x, y: 164, value: w.pot.salt, zone: SEASON_ZONE, t: 0.4 };
      if (w.pot.salt >= SEASON_DONE) mark('potSalt');
    }
    if (holding('garam') && !w.wokInSink && s.view === RIGHT && overWokForSalt(x, y) && s.tilt < -2.4 && Math.hypot(dx, dy) > 0) {
      if (!w.wok.items.length) { nudge('MASUKKAN BAHAN KE WAJAN DULU'); return; }
      w.wok.salt = Math.min(1, w.wok.salt + Math.min(Math.hypot(dx, dy), 14) / 300);
      const [mx, my] = rotPoint(x, saltY(y), s.tilt, ...TOOL_DEFS.garam.mouth);
      const fall = Math.max(4, 248 - my), life = (-34 + Math.sqrt(34 * 34 + 2 * 260 * fall)) / 260;
      for (let i = 0; i < 2; i++) if (Math.random() < 0.8) bits.push({ v: RIGHT, x: mx + (Math.random() - 0.5) * 8, y: my, vx: (Math.random() - 0.5) * 16, vy: 34, g: 260, life, c: '#f6f0e3' });
      s.meter = { v: RIGHT, x: 262, y: 208, value: w.wok.salt, zone: SEASON_ZONE, t: 0.4 };
      if (w.wok.salt >= SEASON_DONE) mark('salt');
    }
  }

  function updateHand(dt) {
    const w = s.world, [x, y] = s.mouse, hand = s.hand;
    let target = 0;
    s.stream = null;
    if (!hand) { s.tilt = 0; return; }
    if (hand.spice) { s.tilt += ((jarTarget(x, y) ? -Math.PI : 0) - s.tilt) * Math.min(1, dt * 11); return; }
    if (hand.food === 'banana+' && s.view === LEFT && inRect(SPOTS[LEFT].flour, x, y)) {
      hand.food = 'coated'; hand.item.coated = true; burst(x, y - 3, ['#fffaf0', '#e9dfc8'], 10, 34); mark('coat'); sfx('flourCoat');
    }
    if (hand.tool === 'spoon') {
      if (s.view === RIGHT && inRect(SPOTS[RIGHT].coffee, x, y) && !w.spoonLoaded) { w.spoonLoaded = true; burst(x, y, ['#5a3a2d'], 3, 12); }
      if (w.spoonLoaded) {
        const cup = cups().find(t => t.v === s.view && !t.powder && Math.abs(x - t.x) < 18 && y > t.y - 32 && y < t.y + 10);
        if (cup && cupDirty(cup)) nudge('GELAS KOTOR, CUCI DULU');
        else if (cup) { w.spoonLoaded = false; cup.powder = true; burst(cup.x, cup.y - 16, ['#5a3a2d', '#3a2520'], 7, 12); mark('cup'); mark('powder'); }
      }
    }
    if ((hand.tool === 'kecap' || hand.tool === 'minyak') && !w.wokInSink && s.view === RIGHT && inRect({ x: WOK_ZONE.x - 10, y: WOK_ZONE.y - 44, w: WOK_ZONE.w + 66, h: WOK_ZONE.h + 40 }, x, y)) {
      target = -2.05;
      if (s.tilt < -1.3) {
        const key = hand.tool === 'kecap' ? 'soy' : 'oil';
        const [mx, my] = rotPoint(x, y, s.tilt, ...TOOL_DEFS[hand.tool].mouth);
        if (Math.abs(mx - 262) > 50) nudge('ARAHKAN MULUT BOTOL KE WAJAN');
        else if (key === 'soy' && !w.wok.items.length) nudge('MASUKKAN BAHAN KE WAJAN DULU');
        else {
          w.wok[key] = Math.min(1, w.wok[key] + dt / 1.25);
          if (Math.random() < dt * 0.7) spillNearWok(key === 'soy' ? '#2a1a1d' : '#d9b95c');
          s.stream = { v: RIGHT, x: mx, y: my, endY: Math.max(my + 3, 246), c: hand.tool === 'kecap' ? '#2a1a1d' : '#e0bd63' };
          s.meter = { v: RIGHT, x: 262, y: 208, value: w.wok[key], zone: key === 'soy' ? SEASON_ZONE : null, t: 0.25 };
          if (w.wok[key] >= (key === 'soy' ? SEASON_DONE : MIN_AMOUNT)) mark(key);
        }
      }
    }
    if (hand.tool === 'garam' && s.view === RIGHT && ((!w.wokInSink && overWokForSalt(x, y)) || (!w.potInSink && overPotForSalt(x, y)))) target = -Math.PI;
    if (hand.tool === 'ladle') {
      const bowlX = x, bowlY = y + 20;
      if (s.view === RIGHT && w.ladle < 1 && Math.abs(bowlX - POT.x) < 29 && bowlY > 188 && bowlY < 224) {
        if (w.potInSink) nudge('PANCI MASIH DI WASTAFEL');
        else if (w.potWater < 0.3) nudge('PANCI KOSONG, ISI AIR DI KERAN');
        else if (w.potHeat < 1) nudge('AIRNYA BELUM MENDIDIH');
        else if (w.pot.parts.length && !potAllCooked()) nudge(foodLabel(w.pot.parts.find(p => cookVal(p, 'rebus') < COOK_GOLD[0])) + ' BELUM MATANG');
        else if (potNeeds() && w.pot.parts.length && w.pot.salt < SEASON_DONE) nudge('TABUR GARAM SAMPAI ZONA KUNING');
        else if (s.recipe && RECIPES[s.recipe].auto && soupId() === s.recipe && RECIPES[s.recipe].steps.some(st => st.key.startsWith('sp:') && !w.done[st.key])) nudge('KURANG: ' + RECIPES[s.recipe].steps.find(st => st.key.startsWith('sp:') && !w.done[st.key]).n);
        else { w.ladleKind = w.pot.parts.length ? 'soup' : 'water'; w.ladle = 1; burst(bowlX, POT.top + 2, ['#d3e7e3', '#f4fbf8'], 6, 34); sfx('ladleScoop'); }
      }
      if (w.ladle > 0) {
        const nearBowls = bowls().filter(t => !t.dirty && t.v === s.view && Math.abs(bowlX - 19 - t.x) < 24 && bowlY > t.y - 58 && bowlY < t.y + 4);
        const fits = t => !t.dish || t.dish.id === soupId();
        const bowl = nearBowls.find(fits) || nearBowls[0];
        if (bowl && w.ladleKind !== 'soup') nudge('INI AIR BIASA, MASAK KUAH DULU');
        else if (bowl && !fits(bowl)) nudge('MANGKUK INI SUDAH ISI MENU LAIN');
        else if (bowl) {
          target = 0.55;
          if (s.tilt > 0.35) {
            const used = Math.min(w.ladle, dt / 0.8);
            w.ladle -= used; s.pouredBowl = bowl;
            if (!bowl.dish) bowl.dish = { id: soupId(), level: w.pot.level, final: { level: w.pot.level, salt: w.pot.salt, style: bumbuStyle(w.pot.parts) } };
            bowl.fill = Math.min(1, (bowl.fill || 0) + used * 0.85);
            const [mx, my] = rotPoint(x, y, s.tilt, ...TOOL_DEFS.ladle.mouth), color = (SOUP_COLORS[bowl.dish.id] || SOUP_COLORS.kuah)[1];
            s.stream = { v: s.view, x: mx, y: my, endY: Math.max(my + 3, bowl.y - 6), c: color };
            s.meter = { v: s.view, x: bowl.x, y: Math.max(26, bowl.y - 36), value: bowl.fill, zone: WATER_ZONE, t: 0.25 };
          }
        }
      }
      if (w.ladle > 0 && w.ladleKind !== 'soup' && s.view === LEFT && Math.abs(bowlX - 19 - 414) < 24 && bowlY > 76 && bowlY < 216 && !w.blender.result && w.blender.level === 0) {
        target = 0.55;
        if (s.tilt > 0.35) {
          const used = Math.min(w.ladle, dt / 0.8), [mx, my] = rotPoint(x, y, s.tilt, ...TOOL_DEFS.ladle.mouth);
          w.ladle -= used; w.blender.water = Math.min(0.6, w.blender.water + used * 0.4);
          s.stream = { v: LEFT, x: mx, y: my, endY: Math.max(my + 3, 166), c: '#d5e3e6' };
        }
      }
      const cup = w.ladle > 0 && w.ladleKind !== 'soup' ? cups().find(t => t.v === s.view && Math.abs(bowlX - 19 - t.x) < 22 && bowlY > t.y - 64 && bowlY < t.y + 2) : null;
      if (cup && cupDirty(cup)) nudge('GELAS KOTOR, CUCI DULU');
      else if (cup) {
        target = 0.55;
        if (s.tilt > 0.35) {
          const used = Math.min(w.ladle, dt / 0.8);
          w.ladle -= used; s.pouredCup = cup;
          if (cup.water <= 0) { cup.cold = false; cup.juice = null; }
          cup.water = Math.min(1, cup.water + used * 0.85);
          const [mx, my] = rotPoint(x, y, s.tilt, ...TOOL_DEFS.ladle.mouth);
          s.stream = { v: s.view, x: mx, y: my, endY: Math.max(my + 3, cup.y - 14), c: '#d5e3e6' };
          s.meter = { v: s.view, x: cup.x, y: Math.max(26, cup.y - 47), value: cup.water, zone: WATER_ZONE, t: 0.25 };
          if (cup.water >= 1 && Math.random() < 0.4) { burst(cup.x, cup.y - 14, ['#d5e3e6'], 1, 16); if (Math.random() < 0.2) addSpill(cup.v, cup.x + 14, cup.y + 2, '#8fb4ba'); }
        }
      }
    }
    if (hand.food && hand.food.endsWith('+') && atBatter(x, y)) dipInBatter(hand);
    if (s.view === LEFT && hand.food && hand.item && inRect(CRUMB_ZONE, x, y)) {
      if (hand.food.endsWith('~') || (hand.food === 'coated' && !hand.item.crumb)) {
        hand.item.crumb = true;
        if (hand.food !== 'coated') hand.food = hand.item.type + '^';
        burst(415, 250, ['#efc777', '#d9a44e', '#a8702f'], 10, 30); sfx('crumbs');
        nudge(FOOD_LABEL[hand.food] + ' BERLAPIS TEPUNG ROTI');
      } else if (hand.food.endsWith('+') && s.nudgeT <= 0) nudge('CELUP ADONAN DULU');
    }
    if (hand.food === 'cup' && s.view === BATTER.v && Math.abs(x - BATTER.x) < 34 && y > BATTER.y - 86 && y < BATTER.y - 10 && hand.cup.water > 0 && !hand.cup.powder && !hand.cup.juice && w.batter.water < Math.min(1.2, batterWaterCap())) {
      const b = w.batter, cap = Math.min(1.2, batterWaterCap()), used = Math.min(hand.cup.water, dt / 2.4, (cap - b.water) / 0.7);
      hand.cup.water -= used; if (hand.cup.water <= 0.001) hand.cup.water = 0;
      b.water = Math.min(cap, b.water + used * 0.7); batterChanged(b);
      if (b.water >= cap - 0.001 && cap < 1.2) nudge('AIR CUKUP, SEKARANG KOCOK');
      s.stream = { v: s.view, x: x - 2, y: y - 8, endY: Math.max(y - 4, BATTER.y), c: '#d5e3e6' };
    }
    if (hand.tool === 'batterBowl') {
      const [bx, by] = wokPosition();
      if (s.view === LEFT && Math.abs(bx - TRASH.x) < 42 && by > 222 && by < 290) {
        target = -0.85;
        if (s.tilt < -0.55) {
          s.pourT += dt;
          if (s.pourT > 0.55) { w.batter = freshBatter(); s.pourT = 0; nudge('ADONAN DIBUANG'); burst(TRASH.x, TRASH.y - 2, ['#f0dca8', '#fffaf0'], 10, 30); }
        }
      } else target = pourBatter(dt);
    }
    if (hand.tool === 'blender') target = pourBlender(dt);
    if (hand.food === 'cup' && s.view === LEFT && Math.abs(x - 414) < 26 && y > 76 && y < 202 && hand.cup.water > 0 && !hand.cup.powder && !hand.cup.juice && !w.blender.result && w.blender.level === 0 && w.blender.water < 0.6) {
      const used = Math.min(hand.cup.water, dt / 0.8);
      hand.cup.water -= used; w.blender.water = Math.min(0.6, w.blender.water + used * 0.65);
      s.meter = { v: LEFT, x: 414, y: 124, value: w.blender.water / 0.6, zone: [JUICE_WATER / 0.6, 1], t: 0.3 };
      s.stream = { v: LEFT, x: x - 2, y: y - 8, endY: Math.max(y - 4, 162), c: '#d5e3e6' };
      if (hand.cup.water <= 0.001) hand.cup.water = 0;
    }
    if (cupUnderTap()) {
      const cup = hand.cup;
      if (cupDirty(cup)) { if (s.nudgeT <= 0) nudge('TARUH DI BAK, CUCI PAKAI SPONS'); }
      else if (cup.water < 1) {
        if (cup.water <= 0) cup.juice = null;
        cup.cold = true;
        cup.water = Math.min(1, cup.water + dt / 1.7);
        if (cup.powder && s.recipe === 'kopi' && s.nudgeT <= 0) nudge('KOPI BUTUH AIR PANAS DARI PANCI');
        if (cup.water >= 1) sfx('glassFull');
      } else if (Math.random() < 0.5) burst(x + 8, y - 12, ['#e8fbff', '#8fd2e6'], 1, 16);
      s.meter = { v: RIGHT, x, y: Math.max(26, y - 34), value: cup.water, zone: WATER_ZONE, t: 0.25 };
    }
    if (hand.tool === 'pot') {
      const [potX, potY] = wokPosition();
      const overSink = s.view === RIGHT && Math.abs(potX - 92) < 66 && potY > 130 && potY < 262;
      if (!overSink) s.potHold = 0;
      if (overSink) {
        if (w.tapOn) {
          // Keran menyala: panci diisi air dingin.
          if (w.potWater < 1) {
            w.potWater = Math.min(1, w.potWater + dt / 2);
            w.potHeat = Math.max(0, w.potHeat - dt * 0.6);
            s.meter = { v: RIGHT, x: potX, y: Math.max(26, potY - 24), value: w.potWater, zone: null, t: 0.3 };
            if (w.potWater >= 1) { nudge('PANCI PENUH'); sfx('potFull'); }
          }
        } else if (w.potWater > 0 && (s.potHold += dt) <= 0.55) {
          if (s.nudgeT <= 0) nudge('LEPAS UNTUK TARUH, TAHAN UNTUK TUANG');
        } else if (w.potWater > 0) {
          if (w.pot.parts.length) nudge('KELUARKAN BAHAN DARI PANCI DULU');
          else {
            target = -1.15;
            if (s.tilt < -0.7) {
              const used = Math.min(w.potWater, dt / 1.2);
              w.potWater -= used;
              w.sinkWater = Math.min(0.9, w.sinkWater + used * 0.6);
              const [mx, my] = rotPoint(potX, potY, s.tilt, -36, 0);
              s.stream = { v: RIGHT, x: mx, y: my, endY: Math.max(my + 4, sinkSurface().back + 12), c: '#bfe3ea' };
              if (Math.random() < 0.5) burst(mx, s.stream.endY, ['#e8fbff', '#8fd2e6'], 1, 24);
              if (w.potWater <= 0.001) { w.potWater = 0; w.potHeat = 0; w.pot.salt = 0; w.pot.spices = {}; w.boiledOnce = false; nudge('PANCI KOSONG'); sfx('potEmpty'); }
            }
          }
        }
      }
    }
    if (hand.tool === 'wok') {
      const [wokX, wokY] = wokPosition();
      const plate = w.things.find(t => t.kind === 'plate' && !t.dirty && t.v === RIGHT && plateCount(t) < MAX_COOK_PARTS && Math.abs(wokX - t.x) < 74 && wokY - t.y > -84 && wokY - t.y < 42);
      const overMat = s.view === RIGHT && (plate || inRect({ x: MAT_ZONE.x - 72, y: MAT_ZONE.y - 72, w: MAT_ZONE.w + 122, h: MAT_ZONE.h + 84 }, wokX, wokY));
      const overBin = s.view === LEFT && Math.abs(wokX - TRASH.x) < 66 && wokY > 170 && wokY < 300;
      if (overBin && w.wok.items.length) {
        target = 0.62; s.pourT += dt;
        if (s.pourT > 0.55) { burst(TRASH.x, TRASH.y - 2, ['#a9683b', '#e9dfc8'], 12, 34); w.wok = freshWok(); s.pourT = 0; nudge('ISI WAJAN DIBUANG'); }
      } else if (overMat && w.wok.items.length) {
        const id = dishId(w.wok);
        if (!plate) nudge('TARUH PIRING DI ALAS KAYU DULU');
        else if (!wokAllCooked(w.wok)) nudge(foodLabel(w.wok.parts.find(p => cookVal(p, 'goreng') < COOK_GOLD[0])) + ' BELUM MATANG');
        else if (s.recipe && id === s.recipe && RECIPES[s.recipe].steps.some(st => st.key !== 'plated' && st.key !== 'served' && !w.done[st.key])) nudge('KURANG: ' + RECIPES[s.recipe].steps.find(st => st.key !== 'plated' && st.key !== 'served' && !w.done[st.key]).n);
        else {
          target = 0.62; s.pourT += dt;
          if (s.pourT > 0.45) {
            const balance = w.wok.pieces.length ? average(w.wok.pieces.map(p => Math.max(0.25, 1 - Math.abs(p.a - p.b) * 1.6))) : 1;
            const crusts = w.wok.parts.filter(p => p.item && p.item.crust).map(p => (p.item.crust === 'PAS' ? 1 : 0.7));
            const made = { id, level: w.wok.level, final: { level: w.wok.level, balance, soy: w.wok.soy, salt: w.wok.salt, crust: crusts.length ? average(crusts) : null, style: bumbuStyle(w.wok.parts) } };
            plate.sides = plate.sides || []; plate.parts = plate.parts || [];
            if (!plate.dish) plate.dish = made;
            else if (id === s.recipe && plate.dish.id !== id) { plate.sides.push(plate.dish.id); plate.dish = made; }
            else plate.sides.push(id);
            announcePlate(plate);
            burst(plate.x, plate.y - 4, id === 'pisang' ? ['#c9812f', '#e9ac55'] : FRIED, 12, 34);
            sfx('plateSlide');
            mergeSpices(plate, w.wok);
            w.wok = freshWok(); s.pourT = 0; if (!s.recipe || id === s.recipe) mark('plated');
          }
        }
      } else s.pourT = 0;
    }
    s.tilt += (target - s.tilt) * Math.min(1, dt * 11);
  }

  function drawTrashLid(g) {
    // Tutup baja berengsel di belakang, terbuka saat barang dibawa mendekat.
    const k = s.binLid, cx = TRASH.x, y = Math.round(TRASH.y - 1 - k * 13), ry = Math.max(2, Math.round(10 - k * 7));
    if (k > 0.05) { g.globalAlpha = 0.3 * k; ell(g, cx, TRASH.y - 9, 30, 2, '#120d10'); g.globalAlpha = 1; }
    ell(g, cx, y + 1, 32, ry + 1, '#37353b'); ell(g, cx, y, 31, ry, '#9c9a9e');
    ell(g, cx - 2, y - 1, 26, Math.max(1, ry - 2), '#c9c7c6'); ell(g, cx - 9, y - Math.max(1, ry - 4), 12, 1, '#f4f2ee');
    if (k < 0.45) {
      const iy = y - 3;
      px(g, cx - 5, iy, 11, 1, '#4b494f'); px(g, cx - 2, iy - 1, 5, 1, '#4b494f');
      px(g, cx - 4, iy + 2, 9, 5, '#4b494f'); [-2, 0, 2].forEach(a => px(g, cx + a, iy + 3, 1, 3, '#c9c7c6'));
      px(g, cx - 4, y + ry - 2, 9, 2, '#26252a'); px(g, cx - 3, y + ry - 2, 7, 1, '#e4e2de');
    }
    [-13, 13].forEach(a => { px(g, cx + a - 3, TRASH.y - 13, 6, 3, '#26252a'); px(g, cx + a - 2, TRASH.y - 13, 4, 1, '#d8d6d3'); });
  }
  function drawRiceCooker(g) {
    const k = s.riceLid;
    if (k <= 0) return;
    const cx = 62, lidY = Math.round(216 - 16 * k), lidR = Math.round(9 + 3 * k);
    ell(g, cx, 218, 34, 10, '#c9b595'); ell(g, cx, 218, 31, 8, '#716e74');
    ell(g, cx, 219, 28, 6, '#e9e1cf'); scatter(g, cx, 219, 26, 5, 70, RICE, 5);
    px(g, cx - 7, 207, 14, 4, '#3b3640'); px(g, cx - 6, 207, 12, 1, '#77727a');
    ell(g, cx, lidY + 1, 33, lidR, '#6f5f4c');
    ell(g, cx, lidY, 32, lidR, k > 0.5 ? '#a99479' : '#c3ac8a');
    ell(g, cx, lidY - 1, 27, Math.max(3, lidR - 3), k > 0.5 ? '#8d8b90' : '#efe2c5');
    if (k > 0.5) {
      ell(g, cx - 7, lidY - 3, 11, 2, '#aeacb0'); ell(g, cx, lidY, 3, 2, '#3b3640');
      px(g, cx - 8, 209, 16, 4, '#3b3640'); px(g, cx - 7, 209, 14, 1, '#77727a');
    }
  }

  function drawBoardItem(g, it) {
    if (it.coated || it.battered) { fritters(g, it.x, it.y, false); if (it.crumb) scatter(g, it.x, it.y - 1, 22, 6, 34, ['#d9a44e', '#efc777', '#a8702f'], 7); return; }
    const sp = foodSprites[it.type], top = Math.round(it.y - sp.h / 2), left = Math.round(it.x - sp.w / 2);
    g.globalAlpha = 0.28; ell(g, it.x + 2, it.y + FOOD_SIZE[it.type][1] / 2, FOOD_SIZE[it.type][0] / 2, 2, '#160f18'); g.globalAlpha = 1;
    const edges = [0, ...it.cuts.map(c => Math.round(c + sp.w / 2)), sp.w], born = it.born || {};
    const gaps = it.cuts.map(c => {
      const age = born[c] === undefined ? 9 : s.t - born[c];
      return (isChopped(it) ? 3 : 2) + 4 * Math.exp(-age * 12) * Math.cos(age * 26);
    });
    let offset = -gaps.reduce((a, b) => a + b, 0) / 2;
    for (let i = 0; i < edges.length - 1; i++) {
      const sx = edges[i], sw = edges[i + 1] - sx;
      if (sw > 0) g.drawImage(sp.c, sx, 0, sw, sp.h, Math.round(left + sx + offset), top + (isChopped(it) ? (i % 2) : 0), sw, sp.h);
      offset += gaps[i] || 0;
    }
  }
  function drawCutGuide(g) {
    const [x, y] = s.mouse;
    for (const it of s.world.board) {
      if (isChopped(it)) continue;
      const [iw, ih] = FOOD_SIZE[it.type], top = it.y - ih / 2 - 3;
      const piece = largestPiece(it), tip = Math.round(it.x + piece.center), bob = Math.round(Math.sin(s.t * 6));
      for (let i = 0; i < 3; i++) px(g, tip - 2 + i, top - 5 + i + bob, 5 - i * 2, 1, '#ffe2a6');
      const whole = iw - PIECE_LIMIT[it.type], done = Math.max(0, Math.min(1, (iw - piece.size) / whole));
      const barX = Math.round(it.x - iw / 2), barY = Math.round(it.y + ih / 2 + 5);
      px(g, barX, barY, iw, 2, '#2c1d1b'); px(g, barX, barY, Math.round(iw * done), 2, '#e8b64c');
      if (it.slice && it.slice.depth > 0) px(g, Math.round(it.x + it.slice.rel), Math.round(it.y - ih / 2 - 1), 1, Math.max(1, Math.round((ih + 2) * Math.min(1, it.slice.depth))), '#2a1a17');
      if (itemUnderBlade(x, y) === it) { g.globalAlpha = 0.6; px(g, Math.round(bladeXAt(x, y, it.y)), Math.round(it.y - ih / 2 - 1), 1, ih + 2, '#fff5cf'); g.globalAlpha = 1; }
    }
  }
  function drawGauge(g, x, y, value) {
    const w = 88, bx = x - w / 2;
    px(g, bx - 2, y - 2, w + 4, 9, '#1c1519'); px(g, bx, y, w, 5, '#4e3126');
    px(g, bx + w * COOK_GOLD[0], y, w * (COOK_GOLD[1] - COOK_GOLD[0]), 5, '#e8b64c');
    px(g, bx, y + 2, w * value, 1, '#fff5cf'); px(g, bx + w * value - 1, y - 2, 2, 9, '#f3e8d6');
  }
  function drawMeter(g, m) {
    const w = 72, x = Math.round(m.x - w / 2), y = m.y;
    px(g, x - 2, y - 2, w + 4, 8, '#1c1519'); px(g, x, y, w, 4, '#4e3126');
    if (m.zone) px(g, x + w * m.zone[0], y, w * (m.zone[1] - m.zone[0]), 4, '#e8b64c');
    px(g, x, y + 1, Math.round(w * m.value), 2, m.zone ? '#fff5cf' : '#e8b64c');
    if (m.zone) px(g, x + w * m.value - 1, y - 2, 2, 8, '#f3e8d6');
  }
  function drawCookList(g, cx, bottom, parts, taste = '') {
    if (!parts.length) return;
    const rows = [];
    parts.forEach(part => {
      const name = foodLabel(part), st = statusOf(part), same = rows.find(r => r.name === name && r.text === st.text);
      if (same) same.n++; else rows.push({ name, text: st.text, tone: st.tone, n: 1 });
    });
    if (taste) rows.push({ name: 'RASA', text: taste, tone: 'half', n: 1 });
    const labelOf = r => r.name + (r.n > 1 ? ' X' + r.n : '');
    const w = Math.max(...rows.map(r => textW(labelOf(r)) + textW(r.text))) + 16, h = rows.length * 8 + 4;
    const x = Math.round(cx - w / 2), y = bottom - h;
    g.globalAlpha = 0.82; px(g, x, y, w, h, '#1c1519'); g.globalAlpha = 1;
    rows.forEach((r, i) => {
      const ry = y + 3 + i * 8;
      txt(g, labelOf(r), x + 4, ry, '#efe2c5');
      txt(g, r.text, x + w - 4 - textW(r.text), ry, STATUS_COLOR[r.tone]);
    });
  }
  function drawFlipHints(g) {
    s.world.wok.pieces.forEach(p => {
      if (p.onBlade || p.flipT > 0) return;
      const x = Math.round(262 + p.x), y = Math.round(244 + p.y - 12), under = p.side === 'a' ? p.b : p.a, top = p[p.side];
      const bar = (by, value) => {
        px(g, x - 8, by, 16, 2, '#1c1519');
        px(g, x - 8, by, Math.round(16 * value), 2, value > COOK_GOLD[1] ? '#a85a3f' : value >= COOK_GOLD[0] ? '#e8b64c' : '#c9d0a0');
      };
      bar(y, top); bar(y + 3, under);
      if (under >= COOK_GOLD[0] && top < COOK_GOLD[0]) {
        const ay = y - 5 + Math.round(Math.sin(s.t * 7));
        px(g, x, ay - 1, 1, 1, '#fff0b8'); px(g, x - 1, ay, 3, 1, '#ffe2a6'); px(g, x - 2, ay + 1, 5, 1, '#ffd36f');
      }
    });
  }
  function drawArrow(g, r) {
    const bob = Math.round(Math.sin(s.t * 4.5) * 2), ax = Math.round(r.x + r.w / 2), ay = Math.max(16, r.y - 8) + bob;
    px(g, ax - 6, ay - 1, 12, 1, '#7a4f2c');
    for (let i = 0; i < 5; i++) px(g, ax - 5 + i, ay + i, 10 - i * 2, 1, '#ffe2a6');
  }
  function drawTargets(g, v) {
    const pos = s.hand && s.hand.tool === 'wok' ? wokPosition() : s.hand && s.hand.tool === 'ladle' ? [s.mouse[0], s.mouse[1] + 20] : s.mouse;
    targetsFor(s.hand).filter(t => t.v === v).forEach(({ r }) => {
      const hot = inRect(r, pos[0], pos[1]), c = hot ? '#fff6cf' : '#ffd36f', len = hot ? 10 : 8, w = 2;
      const x0 = r.x - 2, y0 = r.y - 2, x1 = r.x + r.w + 1, y1 = r.y + r.h + 1;
      g.globalAlpha = hot ? 0.16 : 0.07; px(g, r.x, r.y, r.w, r.h, '#ffe2a6');
      g.globalAlpha = hot ? 1 : 0.8 + Math.sin(s.t * 5) * 0.2;
      [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(([x, y, a, b]) => {
        px(g, a > 0 ? x : x - len + 1, b > 0 ? y : y - w + 1, len, w, c);
        px(g, a > 0 ? x : x - w + 1, b > 0 ? y : y - len + 1, w, len, c);
      });
      g.globalAlpha = 1;
    });
  }
  function drawPotAll(g, x, y, a, scale = 1) {
    const w = s.world;
    g.save(); g.translate(Math.round(x), Math.round(y)); if (a) g.rotate(a); if (scale !== 1) g.scale(scale, scale); g.translate(-POT.x, -POT.top);
    drawSprite(g, sprites.pot, POT.x, POT.top);
    drawPotGrime(g, w.potGrime);
    drawPotWater(g, w.potHeat, s.t, w.potWater);
    drawPotParts(g, w.pot, s.t);
    if (w.potWater > 0.05) drawSpiceSpecks(g, w.pot.spices, POT.x, POT.top + 3, 24, 3);
    g.restore();
  }
  function drawTool(g, id) {
    const t = TOOL_DEFS[id], fly = s.flying[id];
    if (holding(id)) return;
    if (id === 'wok' && s.world.wokInSink) {
      g.save(); g.translate(WOK_IN_SINK[0], WOK_IN_SINK[1]);
      drawSprite(g, sprites.wok, 0, 0); drawWokContents(g, s.world.wok, 0, -1);
      g.restore();
      return;
    }
    let x = t.home[0], y = t.home[1], a = t.rest;
    if (fly) {
      const k = 1 - (1 - fly.t) ** 3;
      x = fly.x + (x - fly.x) * k; y = fly.y + (y - fly.y) * k - Math.sin(k * Math.PI) * 5; a = fly.a + (a - fly.a) * k;
    }
    if ((id === 'lap' || id === 'lap2') && !fly) ambient.drawCloth(g, sprites[id], x, y, id === 'lap' ? 0 : 1.9);
    else drawSprite(g, sprites[id], x, y, a);
    if (id === 'wok') { g.save(); g.translate(Math.round(x), Math.round(y)); if (a) g.rotate(a); drawWokContents(g, s.world.wok, 0, -1); g.restore(); }
  }

  function drawThing(g, t) {
    if (t.kind === 'cup') {
      g.globalAlpha = 0.28; ell(g, t.x + 2, t.y + 1, 11, 2, '#160f18'); g.globalAlpha = 1;
      miniCup(g, t.x, t.y, cupFill(t));
      if (t.dirty && !t.water && !t.powder) { px(g, t.x - 6, t.y - 4, 12, 1, '#6d4a2c'); px(g, t.x - 5, t.y - 3, 3, 1, '#8a6a3e'); px(g, t.x + 2, t.y - 7, 3, 1, '#8a6a3e'); }
      drawSpiceSpecks(g, t.spices, t.x, t.y - (t.water >= 0.6 ? 15 : t.water > 0 ? 9 : 3), 5, 1);
      return;
    }
    if (t.kind === 'bowl') { g.globalAlpha = 0.28; ell(g, t.x + 2, t.y + 8, 21, 3, '#160f18'); g.globalAlpha = 1; drawPlateFull(g, t, t.x, t.y); return; }
    if (t.kind === 'plate') { g.globalAlpha = 0.28; ell(g, t.x + 2, t.y + 8, 27, 4, '#160f18'); g.globalAlpha = 1; drawPlateFull(g, t, t.x, t.y); return; }
    g.globalAlpha = 0.26; ell(g, t.x + 2, t.y + 6, 15, 3, '#160f18'); g.globalAlpha = 1;
    withCookTint(g, t, () => {
      if (t.item) { t.item.x = t.x; t.item.y = t.y; drawBoardItem(g, t.item); }
      else if (t.food === 'egg' && (t.cracked || t.beaten)) paintCrackedEgg(g, t.x, t.y, t.beaten);
      else drawFood(g, t.food, t.x, t.y);
    });
  }

  function overlay(g, v) {
    const w = s.world;
    drawSpills(g, v);
    if (v === RIGHT) SPICES.filter(sp => s.flying['jar:' + sp.id]).forEach(sp => {
      // Toples terbang masuk kembali ke lemarinya.
      const fly = s.flying['jar:' + sp.id], door = STORES[SPICE_STORE[sp.id]].door, k = 1 - (1 - fly.t) ** 3;
      const hx = door.x + door.w / 2, hy = door.y + 18;
      drawSprite(g, jarSprites[sp.id], fly.x + (hx - fly.x) * k, fly.y + (hy - fly.y) * k - Math.sin(k * Math.PI) * 5, fly.a * (1 - k));
    });
    if (v === LEFT) {
      g.globalAlpha = 0.34; w.scores.forEach(c => px(g, c.x, c.y, 1, c.h, '#4a2f22')); g.globalAlpha = 1;
      drawRiceCooker(g);
      drawTrashLid(g);
      w.board.forEach(it => withCookTint(g, { item: it }, () => drawBoardItem(g, it)));
      if (holdingKnife()) drawCutGuide(g);
      if (w.cobek.items.length) {
        const k = w.cobek.ground;
        if (k > 0.5) { ell(g, 470, 252, 21, 6, '#8f3a2e'); scatter(g, 470, 252, 19, 5, 34, k >= 1 ? ['#a83c32', '#8f3a2e'] : ['#a83c32', '#6e2b25', '#d9674f'], 8); }
        else w.cobek.items.forEach((f, i) => drawFood(g, f, 462 + i * 16, 251));
      }
      Object.keys(KNIVES).forEach(id => {
        if (away(id)) return;
        const t = TOOL_DEFS[id];
        g.globalAlpha = 0.2; px(g, t.home[0] - t.ax + 4, t.home[1] - t.ay + 4, t.w - 2, t.h - 2, '#160f18'); g.globalAlpha = 1;
      });
      [...Object.keys(KNIVES), 'pestle', 'lap2'].forEach(id => drawTool(g, id));
      drawBlender(g);
      drawDough(g);
      if (!away('pin')) { g.globalAlpha = 0.34; ell(g, 148, 230, 36, 3, '#160f18'); g.globalAlpha = 1; }
      drawTool(g, 'pin');
    }
    if (v === RIGHT) {
      drawStoveGrime(g, w.stoveGrime);
      drawSink(g);
      drawSprite(g, bowlStacks[stackLeft('bowl')], 522, 236);
      drawSprite(g, plateStacks[stackLeft('plate')], 602, 272);
      UTENSILS.forEach((u, i) => { if (u.type !== 'ladle') drawSprite(g, utensilSprites[i], u.x, 139, s.swing[i].a + ambient.utensilSway(i)); });
      drawTool(g, 'ladle');
      drawTool(g, 'spoon');
      if (s.hoodLight) {
        g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.42; g.drawImage(hoodGlow, 0, 0);
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      } else { g.globalAlpha = 0.2; px(g, 0, 0, 640, 360, '#120d18'); g.globalAlpha = 1; }
      drawFanControl(g);
      drawKnob(g, 306, 278, w.flameL, -1); drawKnob(g, 338, 278, w.flameR, 1);
      drawTool(g, 'spatula');
      // Bayangan menempelkan botol ke papan rak dan dinding.
      [['kecap', 490, 19, 52], ['minyak', 523, 19, 52], ['garam', 556, 12, 77]].forEach(([id, x, width, top]) => {
        if (away(id)) return;
        g.globalAlpha = 0.18; px(g, x + 4, top + 3, width, 102 - top - 3, '#160f18');
        g.globalAlpha = 0.5; px(g, x - 1, 102, width + 3, 2, '#2c1d1b'); g.globalAlpha = 1;
      });
      ['kecap', 'minyak', 'garam', 'spons', 'lap'].forEach(id => drawTool(g, id));
      if (away('wok')) drawFlameRing(g, 262, 254, 24, w.flameL, s.t);
      drawTool(g, 'wok');
      if (!away('wok')) drawFlameRing(g, 262, 258, 34, w.flameL, s.t, true, 14);
      if (away('pot')) drawFlameRing(g, 382, 254, 22, w.flameR, s.t);
      if (w.potInSink) drawPotAll(g, POT_IN_SINK[0], POT_IN_SINK[1], 0);
      else if (!holding('pot')) {
        const fly = s.flying.pot, k = fly ? 1 - (1 - fly.t) ** 3 : 1;
        const px0 = fly ? fly.x + (POT.x - fly.x) * k : POT.x, py0 = fly ? fly.y + (POT.top - fly.y) * k - Math.sin(k * Math.PI) * 5 : POT.top;
        if (!fly) { g.globalAlpha = 0.5; ell(g, POT.x + 2, POT.top + 60, 39, 6, '#120d10'); g.globalAlpha = 1; }
        drawPotAll(g, px0, py0, fly ? fly.a * (1 - k) : 0);
      }
      if (!away('pot')) drawFlameRing(g, 382, 258, 32, w.flameR, s.t, true);
      if (w.wok.items.length && !holding('wok')) { drawGauge(g, 262, 212, w.wok.level); drawCookList(g, 262, 208, w.wok.parts, tasteText(w.wok.spices)); }
      if (holding('spatula')) drawFlipHints(g);
      if (away('pot')) { /* panci sedang tidak di kompor */ } else if (w.flameR > 0 && w.potHeat < 1) drawGauge(g, 382, 176, w.potHeat);
      else if (w.pot.parts.length) drawGauge(g, 382, 176, w.pot.level);
      if (!away('pot')) drawCookList(g, 382, 172, w.pot.parts, tasteText(w.pot.spices));
      if (s.flameTag) {
        const tag = s.flameTag, tw = textW(tag.text) + 12, tx = Math.round(tag.x - tw / 2);
        g.globalAlpha = Math.min(1, tag.t * 3) * 0.92; px(g, tx, 252, tw, 13, '#1c1519'); px(g, tx, 264, tw, 1, FLAME_COLORS[tag.level]);
        txt(g, tag.text, tx + 6, 256, tag.level ? FLAME_COLORS[1] : '#d8c8aa'); g.globalAlpha = 1;
      }
    }
    if (v === FRONT) { drawDrawers(g); drawGuestUI(g); }
    if (v === BATTER.v) drawBatter(g);
    w.things.filter(t => t.v === v).sort((a, b) => a.y - b.y).forEach(t => drawThing(g, t));
    if (v === RIGHT) drawTapWater(g);
    if (s.meter && s.meter.v === v) drawMeter(g, s.meter);
    drawTargets(g, v);
    if (v === (STORES[s.storeShown].v === undefined ? LEFT : STORES[s.storeShown].v) && s.storeK > 0.01) drawStore(g);
    if (!s.hand && !s.result && !s.book) {
      const act = nextAction();
      if (act && act.v === v) drawArrow(g, act.r || SPOTS[v][act.spot]);
      if (!s.recipe && v === FRONT) drawArrow(g, SPOTS[FRONT].book);
      const guide = tutTarget();
      if (guide && guide.r && guide.v === v && s.tut !== 3) drawArrow(g, guide.r);
    }
  }

  function drawStore(g) {
    const k = 1 - (1 - s.storeK) ** 3, p = STORE_PANEL, id = s.storeShown, y = Math.round(p.y + (1 - k) * 230);
    g.globalAlpha = 0.5 * k; px(g, 0, 0, 640, 360, '#120d14'); g.globalAlpha = 1;
    g.save(); g.beginPath(); g.rect(0, 0, 640, 298); g.clip();
    g.globalAlpha = 0.4; px(g, p.x + 4, y + 5, p.w, p.h, '#0d0a0e'); g.globalAlpha = 1;
    g.drawImage(storeArt[id], p.x, y);
    txtC(g, STORES[id].title, 320, y + 10, id === 'cold' ? '#16333c' : '#ffe9bd', 2);
    txtC(g, 'KLIK DI LUAR UNTUK MENUTUP', 496, y + 13, id === 'cold' ? '#26424c' : '#e0c79a');
    if (k > 0.98) {
      const hot = storeCellAt(id, s.mouse[0], s.mouse[1]);
      if (hot) {
        g.globalAlpha = 0.16; px(g, hot.x, hot.y, hot.w, hot.h, '#ffe2a6'); g.globalAlpha = 1;
        px(g, hot.x, hot.y, hot.w, 2, '#ffd36f'); px(g, hot.x, hot.y + hot.h - 2, hot.w, 2, '#ffd36f');
        px(g, hot.x, hot.y, 2, hot.h, '#ffd36f'); px(g, hot.x + hot.w - 2, hot.y, 2, hot.h, '#ffd36f');
      }
    }
    g.restore();
  }

  function drawHandItem(g) {
    const hand = s.hand, [x, y] = s.mouse;
    if (!hand) return;
    if (hand.spice) {
      g.globalAlpha = 0.22; ell(g, x + 5, y + 16, 11, 3, '#160f18'); g.globalAlpha = 1;
      drawSprite(g, jarSprites[hand.spice], x, jarY(y), s.tilt);
      return;
    }
    if (KNIVES[hand.tool]) {
      const dip = s.chopDip > 0 ? 1 : 0;
      g.globalAlpha = 0.24; px(g, x + 3, y - 54 + dip, 3, 58, '#160f18'); px(g, x + 3, y + 4 + dip, 7, 27, '#160f18'); g.globalAlpha = 1;
      drawSprite(g, sprites[hand.tool + 'Top'], x, y + dip);
      return;
    }
    if (hand.tool === 'wok') {
      const [wokX, wokY] = wokPosition();
      drawSprite(g, sprites.wok, wokX, wokY, s.tilt);
      g.save(); g.translate(Math.round(wokX), Math.round(wokY)); g.rotate(s.tilt); drawWokContents(g, s.world.wok, 0, -1); g.restore();
      return;
    }
    if (hand.tool === 'pot') { const [potX, potY] = wokPosition(); drawPotAll(g, potX, potY, s.tilt); return; }
    if (hand.money !== undefined) { drawMoneyPile(g, x, y); txtC(g, money(hand.money), x, y - 14, '#ffe9bd'); return; }
    if (hand.scoop) {
      g.globalAlpha = 0.22; ell(g, x + 3, y + 12, 13, 3, '#160f18'); g.globalAlpha = 1;
      px(g, x + 9, y - 3, 13, 4, '#26232a'); px(g, x + 10, y - 2, 12, 2, '#8a5f3e');
      ell(g, x, y + 2, 12, 7, '#3b3840'); ell(g, x, y, 11, 6, '#c8c5c3'); ell(g, x, y - 1, 9, 4, '#f6efe0'); ell(g, x - 2, y - 3, 6, 2, '#ffffff');
      return;
    }
    if (hand.tool === 'batterBowl') { const [bowlX, bowlY] = wokPosition(); drawBatterBowl(g, bowlX, bowlY, s.tilt); return; }
    if (hand.tool === 'blender') { const [jarX, jarY0] = wokPosition(); drawBlenderJar(g, jarX, jarY0, s.tilt); return; }
    if (hand.tool === 'ladle') {
      const fill = s.world.ladle, soup = s.world.ladleKind === 'soup';
      g.globalAlpha = 0.22; ell(g, x + 3, y + 34, 14, 3, '#160f18'); g.globalAlpha = 1;
      drawSprite(g, sprites.ladleHeld, x, y, s.tilt);
      if (fill > 0) {
        g.save(); g.translate(Math.round(x), Math.round(y)); g.rotate(s.tilt);
        const rx = Math.max(3, Math.round(11 * Math.sqrt(fill))), ry = Math.max(1, Math.round(3.6 * Math.sqrt(fill)));
        ell(g, 0, 19, rx, ry, soup ? '#b9832f' : '#5f9fb2'); ell(g, -1, 18, Math.max(2, rx - 1), Math.max(1, ry - 1), soup ? '#dcae5c' : '#9fd8e2');
        px(g, -Math.round(rx * 0.55), 17, Math.max(2, Math.round(rx * 0.6)), 1, '#f6fdff');
        g.restore();
      }
      return;
    }
    if (hand.tool === 'lap' || hand.tool === 'lap2') {
      g.globalAlpha = 0.24; ell(g, x + 3, y + 15, 18, 3, '#160f18'); g.globalAlpha = 1;
      drawSprite(g, sprites[hand.tool + 'Held'], x, y, Math.sin(s.t * 20) * 0.09 * s.lapRub - 0.05);
      return;
    }
    if (hand.tool === 'spatula') {
      const wok = s.world.wok, carried = !s.slide && wok.pieces.find(p => p.onBlade);
      g.globalAlpha = 0.26; ell(g, x + 3, y + 8, 15, 3, '#120d10'); g.globalAlpha = 1;
      drawSprite(g, sprites.spatulaHeld, x, y);
      if (s.slide) {
        const p = s.slide.p;
        drawFritterPiece(g, p, 262 + p.x, 244 + p.y - Math.round(s.slide.under * 3));
      }
      if (carried) drawFritterPiece(g, carried, x, y - 5);
      return;
    }
    if (hand.tool) {
      g.globalAlpha = 0.22; ell(g, x + 5, y + 16, 11, 3, '#160f18'); g.globalAlpha = 1;
      drawSprite(g, sprites[hand.tool], x, hand.tool === 'garam' ? saltY(y) : y, s.tilt);
      if (hand.tool === 'spoon' && s.world.spoonLoaded) ell(g, x, y - 3, 3, 3, '#3a2520');
      return;
    }
    if (hand.food === 'bowl') { drawPlateFull(g, hand.bowl || { kind: 'bowl', fill: 0 }, x, y); return; }
    if (hand.food === 'plateEmpty' || hand.food === 'plateReady') {
      drawPlateFull(g, hand.plate || { dish: hand.dish || null }, x, y);
      (hand.riders || []).forEach(cup => miniCup(g, x, y + 4, cupFill(cup)));
      return;
    }
    if (hand.food === 'cup') { miniCup(g, x, y + 6, cupFill(hand.cup)); return; }
    withCookTint(g, hand, () => {
      if (hand.item && hand.item.coated) fritters(g, x, y, false);
      else if (FOOD_SIZE[hand.food] && hand.cuts && hand.cuts.length) drawBoardItem(g, { type: hand.food, x, y, cuts: hand.cuts, born: hand.item && hand.item.born });
      else if (hand.food === 'egg' && (hand.cracked || hand.beaten)) paintCrackedEgg(g, x, y, hand.beaten);
      else drawFood(g, hand.food, x, y);
    });
  }

  function drawBook(g) {
    g.globalAlpha = 0.58; px(g, 0, 0, 640, 360, '#120d14'); g.globalAlpha = 1;
    px(g, 160, 62, 320, 236, '#2c1d1b'); px(g, 164, 66, 312, 228, '#5c2f28');
    px(g, 172, 72, 148, 216, '#e6d9bd'); px(g, 320, 72, 148, 216, '#f0e5cc'); px(g, 319, 72, 2, 216, '#9a856a');
    for (let y = 72; y < 288; y += 2) { px(g, 317, y, 2, 1, '#cdbf9f'); px(g, 321, y + 1, 2, 1, '#d9ccb0'); }
    txtC(g, 'BUKU RESEP', 320, 84, '#5c2f28', 2);
    BOOK_TABS.forEach(t => {
      const on = (s.bookTab || 'awal') === t.id, hot = inRect(t, s.mouse[0], s.mouse[1]);
      px(g, t.x, t.y, t.w, t.h, on ? '#5c2f28' : hot ? '#d9b77a' : '#d2c29f');
      txtC(g, t.n, t.x + t.w / 2, t.y + 4, on ? '#fff0d0' : '#5c2f28');
    });
    px(g, 196, 103, 248, 1, '#5c2f28');
    bookRows().forEach(r => {
      const m = RECIPES[r.id], over = inRect(r, s.mouse[0], s.mouse[1]);
      if (over) px(g, r.x, r.y, r.w, r.h, '#d9b77a');
      px(g, r.x, r.y + r.h - 1, r.w, 1, '#c7b896');
      if (m.auto && m.soup) { g.save(); g.translate(r.x + 22, r.y + 14); g.scale(0.62, 0.62); drawBowl(g, { dish: { id: r.id }, fill: 1 }, 0, 0); g.restore(); }
      else if (m.auto) { g.save(); g.translate(r.x + 22, r.y + 12); g.scale(1.3, 1.3); drawDishBit(g, r.id, 0, 0); g.restore(); }
      if (r.id === 'kopi') miniCup(g, r.x + 22, r.y + 22);
      if (m.drink) miniCup(g, r.x + 22, r.y + 22, BLEND_COLORS[m.drink]);
      if (r.id === 'sup' || r.id === 'soto') { g.save(); g.translate(r.x + 22, r.y + 14); g.scale(0.62, 0.62); drawBowl(g, { dish: { id: r.id }, fill: 1 }, 0, 0); g.restore(); }
      if (r.id === 'pisang') { g.save(); g.translate(r.x + 22, r.y + 12); g.scale(0.68, 0.68); fritters(g, 0, 0, true); g.restore(); }
      if (r.id === 'nasi') friedRice(g, r.x + 22, r.y + 12, 15, 7);
      if (r.id === 'daging') { ell(g, r.x + 22, r.y + 14, 16, 6, '#efe5cf'); drawBeefStrips(g, r.x + 22, r.y + 11, 12, 3, 0.75, 1, 6); }
      const open = isOpen(r.id), cost = unlockCost(r.id), can = s.world.money >= cost;
      if (open) for (let i = 0; i < 3; i++) drawStar(g, r.x + 216 + i * 10, r.y + 7, i < (s.best[r.id] || 0));
      else {
        g.globalAlpha = 0.58; px(g, r.x + 2, r.y + 1, 42, r.h - 3, over ? '#d9b77a' : '#ecdfc6'); g.globalAlpha = 1;
        const lx = r.x + 230, ly = r.y + 6, c = can ? '#587a6d' : '#8a7660';
        px(g, lx + 2, ly, 5, 1, c); px(g, lx + 1, ly + 1, 1, 3, c); px(g, lx + 7, ly + 1, 1, 3, c); px(g, lx, ly + 4, 9, 7, c); px(g, lx + 4, ly + 6, 1, 3, '#efe3c8');
      }
      txt(g, m.name, r.x + 48, r.y + 3, open ? '#3a2822' : '#8a7660', 2);
      txt(g, open ? m.note + ' - ' + m.steps.length + ' LANGKAH' : s.buyArm === r.id ? 'KLIK LAGI UNTUK MEMBELI' : (can ? 'BUKA RESEP ' : 'BUTUH ') + money(cost), r.x + 48, r.y + 15, open ? '#7a5a42' : s.buyArm === r.id ? '#a83c32' : can ? '#3f6a55' : '#7a5a42');
    });
    const pages = bookPages(), page = s.bookPage || 0;
    [[BOOK_PREV, '<', page > 0], [BOOK_NEXT, '>', page < pages - 1]].forEach(([r, mark, on]) => {
      px(g, r.x, r.y, r.w, r.h, on ? (inRect(r, s.mouse[0], s.mouse[1]) ? '#d9b77a' : '#5c2f28') : '#d8cbae');
      if (mark === '<') for (let i = 0; i < 4; i++) px(g, r.x + 8 + i, r.y + 6 - i, 1, i * 2 + 1, on ? '#fff0d0' : '#b7a98c');
      else for (let i = 0; i < 4; i++) px(g, r.x + 14 - i, r.y + 6 - i, 1, i * 2 + 1, on ? '#fff0d0' : '#b7a98c');
    });
    txtC(g, 'HAL ' + (page + 1) + '/' + pages, 320, 266, '#5c2f28');
    txtC(g, 'KLIK DI LUAR BUKU UNTUK MENUTUP', 320, 279, '#9a856a');
    const made = 'TERSAJI ' + s.made; txt(g, made, 458 - textW(made), 271, '#5c2f28');
    const cash = 'UANG ' + money(s.world.money); txt(g, cash, 458 - textW(cash), 84, '#3f6a55');
    const hotTut = inRect(TUT_REPLAY, s.mouse[0], s.mouse[1]);
    px(g, TUT_REPLAY.x, TUT_REPLAY.y, TUT_REPLAY.w, TUT_REPLAY.h, '#5c2f28'); px(g, TUT_REPLAY.x + 1, TUT_REPLAY.y + 1, TUT_REPLAY.w - 2, TUT_REPLAY.h - 2, hotTut ? '#d9b77a' : '#e6d9bd');
    txtC(g, 'TUTORIAL', TUT_REPLAY.x + TUT_REPLAY.w / 2, TUT_REPLAY.y + 4, '#5c2f28');
    const hotReset = inRect(RESET_BUTTON, s.mouse[0], s.mouse[1]), confirming = s.confirmReset > 0;
    px(g, RESET_BUTTON.x, RESET_BUTTON.y, RESET_BUTTON.w, RESET_BUTTON.h, '#5c2f28');
    px(g, RESET_BUTTON.x + 1, RESET_BUTTON.y + 1, RESET_BUTTON.w - 2, RESET_BUTTON.h - 2, confirming ? '#a83c32' : hotReset ? '#d9b77a' : '#e6d9bd');
    txtC(g, confirming ? 'YAKIN?' : 'MULAI BARU', RESET_BUTTON.x + RESET_BUTTON.w / 2, RESET_BUTTON.y + 5, confirming ? '#fff6e2' : '#5c2f28');
  }

  function drawStar(g, x, y, on) {
    const c = on ? '#f3c04f' : '#6f5a48', hi = on ? '#fff0b8' : '#826b57';
    [[4, 0, 1], [3, 1, 3], [3, 2, 3], [0, 3, 9], [1, 4, 7], [2, 5, 5], [2, 6, 5], [1, 7, 3], [5, 7, 3], [1, 8, 2], [6, 8, 2]].forEach(([a, b, w]) => px(g, x + a, y + b, w, 1, c));
    px(g, x + 3, y + 3, 2, 1, hi);
  }
  function drawResult(g) {
    const r = s.result, pop = Math.min(1, r.t / 0.18), h = 58 + r.rows.length * 15 + (r.taste ? 20 : 0), w = 236, x = 202, y = Math.round(44 - (1 - pop) * 10);
    g.globalAlpha = 0.34 * pop; px(g, 0, 0, 640, 360, '#120d14'); g.globalAlpha = pop;
    px(g, x + 3, y + 4, w, h, '#120d14');
    px(g, x, y, w, h, '#2c1d1b'); px(g, x + 2, y + 2, w - 4, h - 4, '#efe3c8'); px(g, x + 2, y + 2, w - 4, 1, '#fff6e2');
    txtC(g, r.name, 320, y + 9, '#5c2f28');
    txtC(g, r.title, 320, y + 18, '#8f3a2e', 2);
    for (let i = 0; i < 3; i++) drawStar(g, 302 + i * 13, y + 34, i < r.stars && r.t > 0.2 + i * 0.12);
    r.rows.forEach(([label, value], i) => {
      const ry = y + 50 + i * 15;
      txt(g, label, x + 16, ry + 1, '#3a2822');
      px(g, x + 96, ry, 104, 7, '#3a2822'); px(g, x + 97, ry + 1, 102, 5, '#cdbd9d');
      const shown = Math.min(value, Math.max(0, (r.t - 0.1) * 2.2));
      px(g, x + 97, ry + 1, Math.round(102 * shown), 5, value >= 0.86 ? '#587a6d' : value >= 0.62 ? '#c9912f' : '#a85a3f');
      txt(g, Math.round(value * 100) + '', x + 206, ry + 1, '#3a2822');
    });
    if (r.taste) {
      const ty = y + 50 + r.rows.length * 15;
      txtC(g, 'RASA ' + r.taste, 320, ty, '#8f3a2e');
      txtC(g, r.spiceList, 320, ty + 9, '#5c4a3a');
    }
    txtC(g, 'KLIK UNTUK LANJUT', 320, y + h - 10, '#7a5a42');
    g.globalAlpha = 1;
  }

  function hoverName(x, y) {
    if (s.view === FRONT && !s.hand && inRect(RADIO, x, y)) { const info = Sound.radioInfo(); return info.on ? 'RADIO: ' + info.name + ', KLIK UNTUK GANTI' : 'RADIO MATI, KLIK UNTUK MENYALAKAN'; }
    if (s.hand || s.book || s.result || Math.abs(s.view - s.cam) > 0.05) return null;
    if (s.store) { const cell = storeCellAt(s.store, x, y); return cell ? 'AMBIL ' + STORE_NAMES[cell.type] + (SPICE_BY_ID[cell.type] ? ' - ' + SPICE_BY_ID[cell.type].taste : '') : null; }
    if (s.view === FRONT) {
      const bubble = s.world.guests.findIndex((p, i) => p && p.state === 'wait' && inRect(bubbleRect(i), x, y));
      if (bubble >= 0) return 'MASAK ' + RECIPES[s.world.guests[bubble].order].name;
      const pile = cashAt(x, y);
      if (pile) return 'AMBIL ' + money(pile.amount);
      const box = drawerAt(x, y);
      if (box >= 0) return (s.drawerOpen[box] ? 'TUTUP LACI ' : 'BUKA LACI ') + CASH_DRAWERS[box].name;
    }
    const thing = [...s.world.things].reverse().find(t => t.v === s.view && inRect(thingRect(t), x, y));
    if (thing && (thing.kind === 'plate' || thing.kind === 'bowl') && (thing.parts || []).length && inPlateCenter(thing, x, y)) return entryText(thing.parts[thing.parts.length - 1]);
    if (thing) return thingName(thing);
    if (s.view === RIGHT && s.world.wok.parts.length && inRect(WOK_ZONE, x, y) && !inRect(WOK_HANDLE, x, y)) return 'AMBIL ' + entryText(s.world.wok.parts[s.world.wok.parts.length - 1]);
    if (s.view === RIGHT && s.world.pot.parts.length && inRect(POT_OPENING, x, y)) return 'AMBIL ' + entryText(s.world.pot.parts[s.world.pot.parts.length - 1]);
    if (s.view === LEFT) { const it = s.world.board.find(b => inRect(itemBox(b), x, y)); if (it) return entryText({ item: it }); }
    if (s.view === BATTER.v && toolHit('whisk', x, y)) return 'KOCOKAN';
    if (atBatter(x, y)) return batterName(s.world.batter);
    if (s.view === LEFT && inRect(SPOTS[LEFT].flour, x, y)) return 'AMBIL TEPUNG';
    if (s.view === LEFT && s.world.dough && inRect(doughRect(s.world.dough), x, y)) return 'AMBIL ' + FOOD_LABEL[s.world.dough.stage];
    if (s.view === LEFT && inRect(BLENDER_BTN, x, y)) return 'TAHAN UNTUK MEMBLENDER';
    if (s.view === LEFT && inRect(BLENDER_ZONE, x, y)) {
      const b = s.world.blender;
      if (b.result) return 'ANGKAT ' + b.result.name;
      if (b.level > 0) return 'BLENDER SETENGAH HALUS';
      if (b.parts.length) return 'AMBIL ' + entryText(b.parts[b.parts.length - 1]);
      return b.water > 0 ? 'BLENDER ISI AIR' : 'BLENDER KOSONG';
    }
    for (const [id, t] of Object.entries(TOOL_DEFS)) if (t.v === s.view && toolHit(id, x, y)) return t.name + (id === 'wok' ? dirtyWord(s.world.wokGrime) : id === 'pot' ? (s.world.potWater < 0.05 ? ' KOSONG' : dirtyWord(s.world.potGrime)) : '');
    if (s.view === LEFT && s.world.riceOpen && inRect(RICE_LID, x, y)) return 'TUTUP TEMPAT NASI';
    if (s.view === LEFT && inRect(SPOTS[LEFT].rice, x, y)) return s.world.riceOpen ? 'AMBIL NASI' : 'BUKA TEMPAT NASI';
    if (s.view === RIGHT && inRect(BOWL_STACK, x, y)) { const n = stackLeft('bowl'); return n ? 'MANGKUK ' + n + '/' + MAX_BOWLS : 'MANGKUK HABIS'; }
    if (s.view === RIGHT && inRect(SPOTS[RIGHT].plates, x, y)) { const n = stackLeft('plate'); return n ? 'PIRING ' + n + '/' + MAX_PLATES : 'PIRING HABIS'; }
    if (s.view === RIGHT && inRect(SPOTS[RIGHT].pot, x, y)) return 'PANCI' + dirtyWord(s.world.potGrime);
    if (s.view === RIGHT && inRect(SPOTS[RIGHT].knobL, x, y)) return 'API KIRI: ' + FLAME_NAMES[s.world.flameL];
    if (s.view === RIGHT && inRect(SPOTS[RIGHT].knobR, x, y)) return 'API KANAN: ' + FLAME_NAMES[s.world.flameR];
    if (s.view === RIGHT && storeDoorAt(x, y, RIGHT)) return 'BUKA ' + STORES[storeDoorAt(x, y, RIGHT)].title;
    if (s.view === RIGHT && inRect(PLUG, x, y)) return s.world.plug ? 'LEPAS SUMBAT' : 'PASANG SUMBAT';
    if (s.view === RIGHT && inRect(TAP, x, y)) return s.world.tapOn ? 'TUTUP KERAN' : 'BUKA KERAN';
    if (s.view === RIGHT && inRect(FAN_SWITCH, x, y)) return s.world.fan ? 'MATIKAN KIPAS' : 'NYALAKAN KIPAS';
    if (s.view === RIGHT && inRect(SINK, x, y) && s.world.sink.length) return 'CUCIAN ' + s.world.sink.length + ', PAKAI SPONS';
    const hit = Object.values(SPOTS[s.view]).find(r => inRect(r, x, y));
    return hit ? hit.name : null;
  }

  function drawHud(g) {
    const act = nextAction(), [mx, my] = s.mouse, over = inRect(EXIT, mx, my);
    g.globalAlpha = over ? 0.92 : 0.62; px(g, EXIT.x, EXIT.y, EXIT.w, EXIT.h, '#1c1519'); g.globalAlpha = 1;
    txtC(g, '< KELUAR', EXIT.x + EXIT.w / 2, EXIT.y + 4, over ? '#ffd98f' : '#d8c8aa');
    if (s.savedFlash > 0) {
      g.globalAlpha = Math.min(1, s.savedFlash) * 0.8; px(g, 62, 5, 48, 13, '#1c1519');
      txt(g, 'TERSIMPAN', 66, 9, '#b9d6b4'); g.globalAlpha = 1;
    }
    const cashText = money(s.world.money), cashW = textW(cashText) + 14;
    g.globalAlpha = 0.72; px(g, 634 - cashW, 5, cashW, 13, '#1c1519'); g.globalAlpha = 1;
    txt(g, cashText, 641 - cashW, 9, '#ffe2a6');
    const name = VIEW_NAMES[s.view], nw = textW(name) + 34, nx = 320 - nw / 2;
    g.globalAlpha = 0.62; px(g, nx, 5, nw, 13, '#1c1519'); g.globalAlpha = 1;
    [LEFT, FRONT, RIGHT].forEach((v, i) => px(g, nx + 6 + i * 4, 10, 2, 3, v === s.view ? '#ffd98f' : '#6f5c4b'));
    txt(g, name, nx + 24, 9, '#efe2c5');

    const targets = targetsFor(s.hand), here = targets.some(t => t.v === s.view);
    const tutWant = !s.hand && tutTarget();
    const wantView = tutWant ? tutWant.v : s.hand ? (targets.length && !here ? targets[0].v : s.view) : act ? act.v : s.view;
    const pulseSide = Math.sign(wantView - s.view);
    const chevron = (r, dir) => {
      const hot = inRect(r, mx, my), pulse = pulseSide === dir && Math.sin(s.t * 5) > -0.2;
      const cx = r.x + r.w / 2, cy = r.y + r.h / 2 + 4;
      g.globalAlpha = hot || pulse ? 0.9 : 0.4;
      for (let i = 0; i < 10; i++) { const o = Math.abs(i - 5); px(g, cx + (dir < 0 ? o - 3 : 3 - o), cy + i - 5, 3, 1, hot || pulse ? '#ffe2a6' : '#efe2c5'); }
      g.globalAlpha = 1;
    };
    if (s.view > LEFT) chevron(turnLeft, -1);
    if (s.view < RIGHT) chevron(turnRight, 1);

    if (s.recipe) {
      const r = RECIPES[s.recipe], w = 124, x = s.view === RIGHT ? 6 : 510, y = 24, h = 32, count = r.steps.filter(st => s.world.done[st.key]).length;
      g.globalAlpha = 0.25; px(g, x + 2, y + 2, w, h, '#120d14'); g.globalAlpha = 1;
      px(g, x, y, w, h, '#e6d9bd'); px(g, x, y, w, 1, '#f5ecd8'); px(g, x + w / 2 - 7, y - 3, 14, 6, 'rgba(200,180,130,.75)');
      txt(g, r.name, x + 6, y + 6, '#5c2f28');
      const label = (count + 1) + '/' + r.steps.length; txt(g, label, x + w - 6 - textW(label), y + 6, '#7a5a42');
      const pip = (w - 12) / r.steps.length;
      r.steps.forEach((st, i) => px(g, x + 6 + i * pip, y + 15, Math.max(2, Math.floor(pip) - 1), 3, s.world.done[st.key] ? '#587a6d' : st.key === (currentStep() || {}).key ? '#c9772f' : '#c2b292'));
      txt(g, (currentStep() || { n: '' }).n, x + 6, y + 22, '#3a2822');
    }

    if (s.radioTag && s.view === FRONT) {
      const tag = s.radioTag, tw = textW(tag.text) + 12, tx = Math.min(634 - tw, 571 - tw / 2);
      g.globalAlpha = Math.min(1, tag.t * 3) * 0.92; px(g, tx, 170, tw, 13, '#1c1519'); px(g, tx, 182, tw, 1, '#e8b64c');
      txt(g, tag.text, tx + 6, 174, '#ffe2a6'); g.globalAlpha = 1;
    }
    if (s.hand && s.edgeDir) {
      const side = s.edgeDir > 0 ? 633 : 3, full = 64, fill = Math.round(full * Math.min(1, s.edge / s.edgeWait));
      g.globalAlpha = 0.72; px(g, side, 148, 4, full, '#1c1519'); g.globalAlpha = 1;
      px(g, side + 1, 148 + full - fill, 2, fill, '#ffd98f');
    }
    let label = s.nudgeT > 0 ? s.nudge : '';
    if (!label) label = doughHandHint() || drinkHandHint() || knifeHint();
    if (!label && s.hand && s.hand.spice) label = s.view === FRONT || s.view === RIGHT || targets.some(t => t.v === s.view) ? 'BAWA KE MASAKAN, GOYANGKAN UNTUK MENABUR' : 'BAWA KE SISI KANAN';
    if (!label && s.hand && targets.length && !here) label = 'BAWA KE SISI ' + (targets[0].v < s.view ? 'KIRI' : targets[0].v > s.view ? 'KANAN' : 'INI');
    if (!label && act) label = act.v !== s.view && !s.hand ? 'TENGOK KE ' + (act.v < s.view ? 'KIRI' : 'KANAN') : act.text;
    if (label) {
      const tw = textW(label) + 20, tx = 320 - tw / 2, warn = s.nudgeT > 0;
      g.globalAlpha = 0.86; px(g, tx, 343, tw, 13, warn ? '#3a1c18' : '#1c1519'); g.globalAlpha = 1;
      px(g, tx, 355, tw, 1, warn ? '#d9674f' : '#c7a776');
      txtC(g, label, 320, 347, '#ffe9bd');
    }
    if (canDeliver()) {
      const r = DELIVER_BUTTON, hot = inRect(r, mx, my);
      px(g, r.x, r.y, r.w, r.h, '#1c1519'); px(g, r.x + 1, r.y + 1, r.w - 2, r.h - 2, hot ? '#e8b64c' : '#587a6d');
      txtC(g, 'ANTAR', r.x + r.w / 2, r.y + 4, hot ? '#2a1a17' : '#fff6e2');
    }
    if (s.hand && s.hand.spice) {
      const sp = SPICE_BY_ID[s.hand.spice], text = sp.name + ' - ' + sp.taste, w = textW(text) + 10, x = Math.max(4, Math.min(636 - w, mx - w / 2)), y = Math.max(22, my - 40);
      g.globalAlpha = 0.86; px(g, x, y, w, 11, '#1c1519'); g.globalAlpha = 1;
      txt(g, text, x + 5, y + 3, '#efe2c5');
    }
    if (s.hand && FOOD_LABEL[s.hand.food]) {
      const st = statusOf(s.hand), name = foodLabel(s.hand) + ' - ', w = textW(name) + textW(st.text) + 10, x = Math.max(4, Math.min(636 - w, mx - w / 2)), y = Math.max(22, my - 30);
      g.globalAlpha = 0.86; px(g, x, y, w, 11, '#1c1519'); g.globalAlpha = 1;
      txt(g, name, x + 5, y + 3, '#efe2c5'); txt(g, st.text, x + 5 + textW(name), y + 3, STATUS_COLOR[st.tone]);
    }
    const hover = hoverName(mx, my);
    if (hover) {
      const w = textW(hover) + 14, x = Math.max(4, Math.min(636 - w, mx - w / 2)), y = Math.max(22, my - 20);
      g.globalAlpha = 0.86; px(g, x, y, w, 13, '#1c1519'); g.globalAlpha = 1;
      px(g, x, y + 12, w, 1, '#c7a776');
      txt(g, hover, x + 7, y + 4, '#efe2c5');
    }
  }

  const saveText = () => JSON.stringify({ version: SAVE_VERSION, world: s.world, recipe: s.recipe, made: s.made, best: s.best, view: s.view, hoodLight: s.hoodLight, unlocked: s.unlocked, tut: s.tut });
  function clearMoment() {
    s.hand = null; s.knob = null; s.slide = null; s.flying = {}; s.result = null; s.book = false; s.store = null; s.storeK = 0; s.stream = null; s.meter = null;
    s.buyArm = null; s.blending = false; s.haze = 0; s.pourT = 0; s.edge = 0; s.edgeDir = 0; s.edgeLock = false; s.radioTag = null; s.tutSeen = {}; s.potFullT = 0; s.potFilling = false;
    s.drawerOpen = [false, false]; s.drawerK = [0, 0]; s.flameTag = null; s.pouredBowl = null; s.pouredCup = null; s.confirmReset = 0; s.savedText = '';
    steam.length = 0; bits.length = 0;
    Sound.stopShop();
  }
  function saveGame() {
    if (s.hand || s.knob || s.slide) return;
    try {
      const text = saveText();
      if (text === s.savedText) return;
      localStorage.setItem(SAVE_KEY, text);
      s.savedText = text;
    } catch (e) { /* game tetap jalan walau penyimpanan browser tidak tersedia */ }
  }
  function cleanItem(it) {
    if (!it || !FOOD_SIZE[it.type] || !Array.isArray(it.cuts)) return null;
    delete it.born; delete it.slice;
    return it;
  }
  function loadGame() {
    let data;
    try { data = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { return; }
    if (!data || data.version !== SAVE_VERSION || !data.world || !Array.isArray(data.world.things)) return;
    try {
      const w = Object.assign(freshWorld(), data.world);
      w.wok = Object.assign(freshWok(), data.world.wok);
      if (!Array.isArray(data.world.wok && data.world.wok.parts)) w.wok.parts = w.wok.items.map(food => ({ food, item: null }));
      w.wok.parts.forEach(part => { if (part.item) cleanItem(part.item); if (!cookOf(part) && w.wok.level > 0) setCook(part, 'goreng', w.wok.level); });
      w.pot = Object.assign({ parts: [], level: 0, salt: 0, spices: {} }, data.world.pot);
      cleanSpices(w.wok); cleanSpices(w.pot);
      w.pot.parts.forEach(part => { if (part.item) cleanItem(part.item); if (!cookOf(part) && w.pot.level > 0) setCook(part, 'rebus', w.pot.level); });
      w.wok.toss = 0; w.wok.pushX = 0; w.wok.patches = STIR_PATCHES.map(() => 0);
      w.wok.pieces.forEach(p => {
        if (p.air && !p.air.turned) p.side = p.side === 'a' ? 'b' : 'a';
        p.air = null; p.onBlade = false; p.flipT = 0; p.landT = 0;
      });
      w.flameL = 0; w.flameR = 0; w.ladle = 0; w.ladleKind = 'water'; w.spoonLoaded = false; w.boiledOnce = w.potHeat >= 1;
      w.riceOpen = w.riceOpen === true; s.riceLid = w.riceOpen ? 1 : 0;
      w.tapOn = false; w.fan = false; w.plug = w.plug === true;
      w.potWater = Number.isFinite(w.potWater) ? Math.max(0, Math.min(1, w.potWater)) : 1;
      w.batterSpot = w.batterSpot && [LEFT, FRONT, RIGHT].includes(w.batterSpot.v) && Number.isFinite(w.batterSpot.x) && Number.isFinite(w.batterSpot.y) ? w.batterSpot : { v: LEFT, x: 228, y: 206 };
      w.guests = [0, 1, 2, 3].map(i => { const p = Array.isArray(w.guests) ? w.guests[i] : null; return p && RECIPES[p.order] && Number.isFinite(p.seed) && ['arrive', 'think', 'wait', 'eat', 'leave'].includes(p.state) ? { ...p, t: Number.isFinite(p.t) ? p.t : 0 } : null; });
      w.cash = Array.isArray(w.cash) ? w.cash.filter(m => m && CUSTOMER_SEATS[m.seat] !== undefined && Number.isFinite(m.amount)) : [];
      ['money', 'moneyL', 'moneyR'].forEach(k => { if (!Number.isFinite(w[k])) w[k] = 0; });
      w.batter = Object.assign(freshBatter(), w.batter);
      w.dough = w.dough && DOUGH_FOODS.includes(w.dough.stage) ? { stage: w.dough.stage, roll: Number.isFinite(w.dough.roll) ? w.dough.roll : 0, cut: Number.isFinite(w.dough.cut) ? w.dough.cut : 0, x: BOARD_SLOTS.some(([sx]) => sx === w.dough.x) ? w.dough.x : (BOARD_SLOTS.find(([sx]) => !(w.board || []).some(b => Math.abs(b.x - sx) < 8)) || BOARD_SLOTS[1])[0] } : null;
      ['flour', 'sagu', 'egg', 'water', 'mix'].forEach(k => { if (!Number.isFinite(w.batter[k])) w.batter[k] = 0; });
      w.blender = Object.assign(freshBlender(), w.blender);
      w.blender.parts = Array.isArray(w.blender.parts) ? w.blender.parts.filter(p => p && BLENDABLE[p.food]) : [];
      w.blender.parts.forEach(part => { if (part.item) cleanItem(part.item); });
      cleanSpices(w.blender);
      w.wokInSink = w.wokInSink === true && !w.wok.items.length;
      w.potInSink = w.potInSink === true && !w.wokInSink;
      ['wokGrime', 'potGrime', 'stoveGrime'].forEach(k => { w[k] = Number.isFinite(w[k]) ? Math.max(0, Math.min(1, w[k])) : 0; });
      w.sinkWater = Number.isFinite(w.sinkWater) ? Math.max(0, Math.min(0.9, w.sinkWater)) : 0;
      w.sinkDirt = Number.isFinite(w.sinkDirt) ? Math.max(0, Math.min(1, w.sinkDirt)) : 0;
      w.sink = Array.isArray(w.sink) ? w.sink.filter(k => k === 'plate' || k === 'bowl').slice(0, MAX_PLATES + MAX_BOWLS) : [];
      w.spills = Array.isArray(w.spills) ? w.spills.filter(p => p && [LEFT, FRONT, RIGHT].includes(p.v) && Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.a)).slice(0, 18) : [];
      w.board = (w.board || []).map(cleanItem).filter(Boolean);
      w.scores = Array.isArray(w.scores) ? w.scores : [];
      w.cutNeat = Array.isArray(w.cutNeat) ? w.cutNeat : [];
      w.done = w.done && typeof w.done === 'object' ? w.done : {};
      w.cobek = Object.assign({ items: [], parts: [], ground: 0 }, w.cobek);
      w.cobek.parts.forEach(part => { if (part.item) cleanItem(part.item); });
      const seenCups = new Set();
      w.things.forEach(t => { if (t.kind !== 'food') cleanSpices(t); if (t.kind === 'cup') t.used = cupHasResidue(t); });
      w.things = w.things.filter(t => {
        if (![LEFT, FRONT, RIGHT].includes(t.v) || !Number.isFinite(t.x) || !Number.isFinite(t.y)) return false;
        if (t.kind === 'cup') { if (!CUP_HOMES[t.id] || seenCups.has(t.id)) return false; seenCups.add(t.id); return true; }
        if (t.kind === 'bowl') {
          t.parts = Array.isArray(t.parts) ? t.parts : []; t.sides = []; t.fill = Number.isFinite(t.fill) ? t.fill : 0;
          t.parts.forEach(part => { if (part.item) cleanItem(part.item); });
          return !t.dish || !!DISH_NAMES[t.dish.id];
        }
        if (t.kind === 'plate') {
          t.parts = Array.isArray(t.parts) ? t.parts : []; t.sides = Array.isArray(t.sides) ? t.sides.filter(id => DISH_NAMES[id]) : [];
          t.parts.forEach(part => { if (part.item) cleanItem(part.item); });
          return !t.dish || !!DISH_NAMES[t.dish.id];
        }
        if (t.kind !== 'food') return false;
        if (t.item) return !!cleanItem(t.item);
        return true;
      });
      // Gelas yang masih di nampan lama ikut pindah ke meja kanan.
      w.things.forEach(t => {
        if (t.kind !== 'cup' || t.v !== LEFT || t.x !== OLD_CUP_HOMES[t.id][0] || t.y !== OLD_CUP_HOMES[t.id][1]) return;
        t.v = RIGHT; [t.x, t.y] = CUP_HOMES[t.id];
      });
      freshCups().forEach(cup => { if (!seenCups.has(cup.id)) w.things.push(cup); });
      w.things.forEach(t => { if (t.kind === 'cup' && cupDirty(t) && t.v === RIGHT && CUP_HOMES[t.id][0] === t.x && CUP_HOMES[t.id][1] === t.y) cupToSink(t); });
      s.world = w;
      s.recipe = RECIPES[data.recipe] ? data.recipe : null;
      s.made = Number.isFinite(data.made) ? data.made : 0;
      s.best = data.best && typeof data.best === 'object' ? data.best : {};
      s.view = [LEFT, FRONT, RIGHT].includes(data.view) ? data.view : FRONT;
      s.cam = s.view;
      s.hoodLight = data.hoodLight !== false;
      const hasProgress = s.recipe || s.made > 0 || w.board.length || w.wok.items.length || w.pot.parts.length || w.things.some(t => t.kind !== 'cup' || !CUP_HOMES[t.id] || t.v !== RIGHT || t.x !== CUP_HOMES[t.id][0]);
      const opened = new Set(STARTER_RECIPES);
      (Array.isArray(data.unlocked) ? data.unlocked : []).forEach(id => { if (RECIPES[id]) opened.add(id); });
      Object.keys(s.best).forEach(id => { if (RECIPES[id] && s.best[id] > 0) opened.add(id); });
      if (s.recipe) opened.add(s.recipe);
      w.guests.forEach(p => { if (p) opened.add(p.order); });
      s.unlocked = [...opened];
      s.tut = Number.isFinite(data.tut) ? Math.max(0, Math.min(TUT_DONE, data.tut)) : hasProgress ? TUT_DONE : 0;
      s.tutBase = s.made;
      if (hasProgress) nudge('PROGRES DILANJUTKAN, API DIMATIKAN');
      s.nudgeT = hasProgress ? 3.5 : 0;
      return true;
    } catch (e) { s.world = freshWorld(); s.recipe = null; return false; }
  }
  function resetGame() {
    s.world = freshWorld(); s.recipe = null; s.made = 0; s.best = {}; s.flying = {}; s.haze = 0; s.result = null; s.book = false; s.confirmReset = 0; s.savedText = ''; s.unlocked = [...STARTER_RECIPES]; s.buyArm = null; s.tut = 0; s.tutBase = 0; s.tutSeen = {};
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* penyimpanan tidak tersedia */ }
    syncBatterSpot();
    setSizzle(0); nudge('PERMAINAN DIMULAI BARU');
  }
  loadGame();
  syncBatterSpot();
  addEventListener('pagehide', saveGame);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });

  return {
    update(dt) {
      s.saveT += dt; s.savedFlash = Math.max(0, s.savedFlash - dt); s.confirmReset = Math.max(0, s.confirmReset - dt);
      if (s.saveT >= 1) { s.saveT = 0; saveGame(); }
      s.t += dt; s.spawn += dt;
      s.cam += (s.view - s.cam) * Math.min(1, dt * 9);
      if (Math.abs(s.view - s.cam) < 0.002) s.cam = s.view;
      s.nudgeT = Math.max(0, s.nudgeT - dt); s.chopDip = Math.max(0, s.chopDip - dt); s.shake = Math.max(0, s.shake - dt);
      if (s.result) s.result.t += dt;
      if (s.meter) { s.meter.t -= dt; if (s.meter.t <= 0) s.meter = null; }
      for (const id of Object.keys(s.flying)) { s.flying[id].t += dt / 0.17; if (s.flying[id].t >= 1) delete s.flying[id]; }
      const w = s.world;
      const wokHeated = !holding('wok') || (s.view === RIGHT && wokNearBurner());
      const wokRate = wokHeated && w.wok.items.length ? FLAME_RATE[w.flameL] : 0;
      updateAirPieces(dt);
      cookWok(w.wok, dt, wokRate / COOK_SLOW);
      cookWokParts(dt, wokRate / COOK_SLOW);
      const potCooking = w.flameR > 0 && !away('pot') && w.potWater >= 0.3;
      if (potCooking) {
        w.potHeat = Math.min(1, w.potHeat + (dt * FLAME_RATE[w.flameR]) / 6.4);
        if (w.potHeat >= 1) { mark('boil'); if (!w.boiledOnce) { w.boiledOnce = true; sfx('boil'); } }
      }
      if (potCooking && w.potHeat >= 0.6) w.pot.parts.forEach(part => setCook(part, 'rebus', cookVal(part, 'rebus') + (dt * FLAME_RATE[w.flameR]) / (10 * COOK_SLOW)));
      w.pot.level = w.pot.parts.length ? average(w.pot.parts.map(part => cookVal(part, 'rebus'))) : 0;
      Sound.fry(wokHeated && w.flameL > 0 && !w.wokInSink, w.wok.oil, w.wok.items.length);
      Sound.fire(w.flameL > 0 || w.flameR > 0 ? (s.view === RIGHT ? 1 : 0.32) : 0);
      s.storeK += Math.max(-dt / 0.14, Math.min(dt / 0.2, (s.store ? 1 : 0) - s.storeK));
      s.riceLid += Math.max(-dt / 0.16, Math.min(dt / 0.16, (w.riceOpen ? 1 : 0) - s.riceLid));
      const carried = s.hand && (s.hand.food || s.hand.tool === 'wok' || s.hand.tool === 'blender' || s.hand.tool === 'batterBowl'), [binX, binY] = s.hand && (s.hand.tool === 'wok' || s.hand.tool === 'blender' || s.hand.tool === 'batterBowl') ? wokPosition() : s.mouse;
      const binWanted = s.view === LEFT && carried && Math.abs(binX - TRASH.x) < 62 && binY > 200 && binY < 300 ? 1 : 0, binBefore = s.binLid;
      s.binLid += Math.max(-dt / 0.14, Math.min(dt / 0.12, binWanted - s.binLid));
      if (binBefore === 0 && s.binLid > 0) sfx('binOpen');
      if (binBefore > 0 && s.binLid === 0) sfx('binClose');
      s.swing.forEach(u => { u.v += (-u.a * 42 - u.v * 2.4) * dt; u.a += u.v * dt; });
      updateHand(dt);
      s.foam = Math.max(0, s.foam - dt * 1.4);
      updateGuests(dt);
      updateTutorial();
      [...cups(), ...(s.hand && s.hand.cup ? [s.hand.cup] : []), ...((s.hand && s.hand.riders) || [])].forEach(cup => {
        if (cupHasResidue(cup)) cup.used = true;
        else if (cup.used) { cup.used = false; cup.dirty = true; cup.juice = null; }
      });
      if (s.blending && s.view !== LEFT) s.blending = false;
      if (s.blending) {
        const b = w.blender;
        b.level = Math.min(1, b.level + dt / 2.4);
        s.shake = Math.max(s.shake, 0.03);
        if (b.level >= 1) {
          const made = blendResult(b);
          b.result = made; b.amount = Math.min(1, b.parts.length * 0.25 + b.water); b.parts = []; b.water = 0; s.blending = false;
          nudge(made.name + ' SUDAH HALUS, ANGKAT TEKONYA');
          sfx('blendDone');
        }
      }
      setNoiseLoop('blend', s.blending ? 0.05 : 0, 'bandpass', 680);
      if (s.radioTag) { s.radioTag.t -= dt; if (s.radioTag.t <= 0) s.radioTag = null; }
      if (s.flameTag) { s.flameTag.t -= dt; if (s.flameTag.t <= 0) s.flameTag = null; }
      s.lapRub = Math.max(0, s.lapRub - dt * 4);
      // Alat masak kotor sangat lamban: sekitar 40 menit api menyala, kompor sekitar 60 menit.
      if (wokRate > 0) w.wokGrime = Math.min(1, w.wokGrime + dt / 2400);
      if (w.flameR > 0 && w.pot.parts.length) w.potGrime = Math.min(1, w.potGrime + dt / 2400);
      if (wokRate > 0 || (w.flameR > 0 && w.pot.parts.length)) w.stoveGrime = Math.min(1, w.stoveGrime + dt / 3600);
      w.wok.grime = w.wokGrime;
      // Air bak naik dari keran; tanpa sumbat air terus mengalir ke saluran.
      // Panci di bak menampung air keran; setelah penuh 5 detik, airnya meluap ke bak.
      const cupCatching = cupUnderTap() && s.hand.cup.water < 1 && !cupDirty(s.hand.cup);
      if (w.potInSink && w.tapOn && !cupCatching) {
        if (w.potWater < 1) {
          w.potWater = Math.min(1, w.potWater + dt / 3);
          w.potHeat = Math.max(0, w.potHeat - dt * 0.5);
          s.potFullT = 0; s.potFilling = true;
          s.meter = { v: RIGHT, x: POT_IN_SINK[0] - 8, y: 188, value: w.potWater, zone: null, t: 0.3 };
          if (w.potWater >= 1) { nudge('PANCI PENUH, ANGKAT ATAU TUTUP KERAN'); sfx('potFull'); }
        } else {
          const before = s.potFullT;
          // Hitungan 5 detik hanya untuk panci yang baru saja terisi penuh.
          s.potFullT = (s.potFilling ? s.potFullT : Math.max(s.potFullT, POT_OVERFLOW_AFTER)) + dt;
          if (before < POT_OVERFLOW_AFTER && s.potFullT >= POT_OVERFLOW_AFTER) { nudge('AIR PANCI MELUAP KE BAK'); sfx('overflow'); }
        }
      } else { s.potFullT = 0; s.potFilling = false; }
      if (w.tapOn && !cupCatching && (!w.potInSink || s.potFullT >= POT_OVERFLOW_AFTER)) { w.sinkWater += dt / 4.5; w.sinkDirt = Math.max(0, w.sinkDirt - dt * 0.08); }
      if (!w.plug) w.sinkWater -= dt * Math.max(0.06, w.sinkWater * 1.6);
      w.sinkWater = Math.max(0, Math.min(0.9, w.sinkWater));
      if (w.sinkWater <= 0) w.sinkDirt = 0;
      setNoiseLoop('drain', !w.plug && !w.tapOn && w.sinkWater > 0.03 && s.view === RIGHT ? 0.018 : 0, 'lowpass', 760);
      if (w.fan) s.fanSpin += dt * 16;
      Sound.setView(s.view);
      Sound.setPour(s.hand && (s.hand.tool === 'kecap' || s.hand.tool === 'minyak') ? 'thick' : 'water');
      Sound.loop('pour', s.stream ? 1 : 0);
      Sound.loop('fridge', s.store === 'cold' ? 1 : 0);
      Sound.loop('boil', w.potHeat >= 1 && w.flameR > 0 && w.potWater > 0.05 && !away('pot') ? 1 : 0);
      Sound.loop('murmur', Math.min(0.75, w.guests.filter(Boolean).length * 0.22));
      setNoiseLoop('fan', w.fan ? 0.022 : 0, 'lowpass', 420);
      setNoiseLoop('tap', w.tapOn && s.view === RIGHT ? 0.02 : 0, 'bandpass', 2100);
      if (wokRate > 0) { s.spatterT += dt; if (s.spatterT > 5) { s.spatterT = 0; if (w.wok.oil > 0.2) spillNearWok('#d9b95c'); } }
      // Masakan yang mulai gosong berasap; kipas tudung menyedotnya.
      const hottest = wokRate > 0 && w.wok.parts.length ? Math.max(...w.wok.parts.map(p => cookVal(p, 'goreng'))) : 0;
      const smoke = Math.max(0, Math.min(1, (hottest - 0.74) / 0.2));
      // Penanda suara saat masakan matang dan saat mulai gosong.
      const wokDone = wokRate > 0 && wokAllCooked(w.wok), potDone = w.flameR > 0 && !away('pot') && potAllCooked(), burning = hottest >= COOK_GOLD[1];
      if ((wokDone && s.soundWok === false) || (potDone && s.soundPot === false)) sfx('foodReady');
      if (burning && s.soundBurn === false) sfx('foodBurning');
      s.soundWok = wokDone; s.soundPot = potDone; s.soundBurn = burning;
      s.smokeT += dt * smoke * 16;
      while (s.smokeT >= 1) { s.smokeT -= 1; steam.push({ v: RIGHT, x: 262 + (Math.random() - 0.5) * 52, y: 238, age: 0, life: 1.8 + Math.random() * 1.2, seed: Math.random() * 6, smoke: true }); }
      s.haze = Math.max(0, Math.min(0.6, s.haze + (w.fan ? 0 : smoke * dt * 0.08) - dt * (w.fan ? 0.32 : 0.012)));
      if (smoke > 0.35 && !w.fan && !s.smokeWarned) { s.smokeWarned = true; nudge('BERASAP! NYALAKAN KIPAS DI TUDUNG'); }
      if (smoke === 0 && s.haze < 0.02) s.smokeWarned = false;
      if (s.recipe && (!s.hand || s.hand.tool || s.hand.spice || s.hand.scoop || s.hand.money !== undefined)) syncDone();

      const [mx] = s.mouse;
      if (s.hand) {
        // Tahan barang di tepi layar: pindah meja, lalu pindah lagi tiap 1 detik.
        const zone = s.touch ? 38 : 22, side = mx < zone ? -1 : mx > 640 - zone ? 1 : 0, next = s.view + side;
        const dir = side && next >= LEFT && next <= RIGHT ? side : 0;
        s.edgeDir = dir;
        if (!dir) { s.edge = 0; s.edgeLock = false; }
        else {
          s.edgeWait = s.edgeLock ? 1 : 0.3; s.edge += dt;
          if (s.edge >= s.edgeWait) { turn(dir); s.edge = 0; s.edgeLock = true; }
        }
      } else { s.edge = 0; s.edgeLock = false; s.edgeDir = 0; }

      ambient.update(dt);
      rain.forEach(r => {
        r.y += r.v * dt; r.x -= r.v * 0.16 * dt;
        if (r.y > OPENING.y + OPENING.h) { r.y = OPENING.y + 12; r.x = OPENING.x + Math.random() * (OPENING.w + 24); }
      });
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i]; b.life -= dt; b.vy += b.g * dt; b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.life <= 0) bits.splice(i, 1);
      }
      if (s.spawn > 0.13) {
        s.spawn = 0;
        const src = [[FRONT, 432, 226, 10]];
        if (w.riceOpen) src.push([LEFT, 62, 214, 40], [LEFT, 62, 214, 40]);
        if (w.flameL > 0 && w.wok.items.length && !holding('wok')) src.push([RIGHT, 262, 240, 44], [RIGHT, 262, 240, 44]);
        if (w.potHeat >= 1 && w.potWater > 0.05 && !away('pot')) src.push([RIGHT, POT.x, POT.top - 2, 48], [RIGHT, POT.x, POT.top - 2, 48]);
        cups().filter(cup => cup.water >= 0.6 && !cup.cold).forEach(cup => src.push([cup.v, cup.x, cup.y - 22, 8]));
        const [v, x, y, spread] = src[Math.floor(Math.random() * src.length)];
        steam.push({ v, x: x + (Math.random() - 0.5) * spread, y, age: 0, life: 1.5 + Math.random(), seed: Math.random() * 6 });
      }
      steam.forEach(p => {
        p.age += dt; p.y -= (p.smoke ? 24 : 15) * dt;
        if (!w.fan || p.v !== RIGHT || p.x < 170 || p.x > 460) return;
        p.x += (314 - p.x) * dt * 1.9; p.y -= 34 * dt;
        if (p.y < 104) p.age = p.life + 1;
      });
      for (let i = steam.length - 1; i >= 0; i--) if (steam[i].age > steam[i].life) steam.splice(i, 1);
    },

    draw(g) {
      for (const v of [LEFT, FRONT, RIGHT]) {
        const ox = Math.round((v - s.cam) * 640);
        if (Math.abs(ox) >= 640) continue;
        g.save(); g.translate(ox, v === LEFT && s.shake > 0 ? 1 : 0);
        if (v === FRONT) {
          g.drawImage(outside, 0, 0);
          ambient.street(g);
          g.globalAlpha = 0.42; rain.forEach(r => { if (r.y > 52) px(g, r.x, r.y, 1, 6, '#b8c4dc'); }); g.globalAlpha = 1;
          drawGuests(g);
        }
        g.drawImage(rooms[v], 0, 0);
        ambient.room(g, v);
        if (v === FRONT) {
          g.globalCompositeOperation = 'lighter';
          g.globalAlpha = 0.5 + Math.sin(s.t * 1.3) * 0.025 + Math.sin(s.t * 7.1) * 0.012;
          g.drawImage(frontGlow, 0, 0);
          g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        }
        overlay(g, v);
        steam.filter(p => p.v === v).forEach(p => {
          const k = Math.min(1, p.age / p.life), size = (p.smoke ? 3 : 1) + Math.floor(k * (p.smoke ? 6 : 3));
          g.globalAlpha = (p.smoke ? 0.5 : 0.34) * Math.sin(k * Math.PI);
          px(g, p.x + Math.sin(p.age * 2.2 + p.seed) * (2 + k * 5), p.y, size, size, p.smoke ? '#6b6670' : '#efe5d6');
        });
        g.globalAlpha = 1;
        if (s.storeK <= 0.01) ambient.air(g, v);
        if (v === RIGHT && s.haze > 0.01) { g.globalAlpha = s.haze * 0.55; px(g, 0, 0, 640, 360, '#8a8588'); g.globalAlpha = 1; }
        if (s.stream && s.stream.v === v) drawStream(g, s.stream, s.t);
        bits.filter(b => b.v === v).forEach(b => px(g, b.x, b.y, 2, 2, b.c));
        g.restore();
      }
      drawHandItem(g);
      const stoveX = Math.round((RIGHT - s.cam) * 640);
      if (Math.abs(stoveX) < 640) {
        g.save(); g.translate(stoveX, 0);
        s.world.wok.pieces.forEach(p => { if (p.air) drawFritterPiece(g, p, 262 + p.x, 244 + p.y); });
        g.restore();
      }
      drawHud(g);
      if (s.result) drawResult(g);
      if (s.book) drawBook(g);
      drawTutorial(g);
    },

    move(x, y) {
      const [ox, oy] = s.mouse;
      s.mouse = [x, y];
      if (s.knob) {
        const steps = Math.round((x - s.knob.x0) / 12);
        if (steps) s.knob.moved = true;
        setFlame(s.knob.key, Math.max(0, Math.min(1, s.knob.level0 + steps)));
        return;
      }
      if (s.hand) handleMotion(x, y, x - ox, y - oy);
    },
    clickable(x, y) {
      if (s.result) return true;
      if (s.tut < TUT_DONE && (inRect(TUT_SKIP, x, y) || (tutNext() && inRect(tutNext(), x, y)))) return true;
      if (s.book) return bookRows().some(r => inRect(r, x, y)) || BOOK_TABS.some(t => inRect(t, x, y)) || inRect(BOOK_PREV, x, y) || inRect(BOOK_NEXT, x, y) || inRect(RESET_BUTTON, x, y) || inRect(TUT_REPLAY, x, y);
      if (s.hand || s.store) return true;
      if (inRect(EXIT, x, y) || (s.view > LEFT && inRect(turnLeft, x, y)) || (s.view < RIGHT && inRect(turnRight, x, y))) return true;
      if (canDeliver() && inRect(DELIVER_BUTTON, x, y)) return true;
      if (s.world.things.some(t => t.v === s.view && inRect(thingRect(t), x, y))) return true;
      if (s.view === FRONT) return inRect(RADIO, x, y) || inRect(SPOTS[FRONT].book, x, y) || !!cashAt(x, y) || drawerAt(x, y) >= 0 || s.world.guests.some((p, i) => p && p.state === 'wait' && inRect(bubbleRect(i), x, y));
      return !!hoverName(x, y) && !(s.view === LEFT && inRect(BOARD, x, y) && !s.world.board.some(b => inRect(itemBox(b), x, y)) && !(s.world.dough && inRect(doughRect(s.world.dough), x, y)));
    },
    down(x, y) {
      s.mouse = [x, y];
      if (tutClick(x, y)) return;
      if (s.result) { if (s.result.t > 0.25) s.result = null; return; }
      if (s.book) {
        if (inRect(TUT_REPLAY, x, y)) { s.book = false; s.buyArm = null; s.tut = 0; s.tutSeen = {}; sfx('page'); return; }
        if (inRect(RESET_BUTTON, x, y)) {
          if (s.confirmReset > 0) resetGame(); else s.confirmReset = 3;
          return;
        }
        const tab = BOOK_TABS.find(t => inRect(t, x, y));
        if (tab) { s.bookTab = tab.id; s.bookPage = 0; sfx('page'); return; }
        if (inRect(BOOK_PREV, x, y)) { s.buyArm = null; s.bookPage = Math.max(0, (s.bookPage || 0) - 1); return; }
        if (inRect(BOOK_NEXT, x, y)) { s.buyArm = null; s.bookPage = Math.min(bookPages() - 1, (s.bookPage || 0) + 1); return; }
        const row = bookRows().find(r => inRect(r, x, y));
        if (row && !isOpen(row.id)) { buyRecipe(row.id); return; }
        s.buyArm = null;
        if (row) { s.recipe = row.id; s.book = false; syncDone(); }
        else if (!inRect({ x: 160, y: 62, w: 320, h: 236 }, x, y)) s.book = false;
        return;
      }
      if (s.store) {
        const cell = storeCellAt(s.store, x, y);
        if (cell && s.storeK > 0.6) { s.hand = STORES[s.store].spices ? { spice: cell.type } : { food: cell.type }; if (s.hand.spice) { delete s.flying['jar:' + cell.type]; s.tilt = 0; } s.storeK = 0; sfx('pickFood'); }
        s.store = null;
        return;
      }
      if (inRect(EXIT, x, y)) { setSizzle(0); setNoiseLoop('fan', 0); setNoiseLoop('tap', 0); setNoiseLoop('drain', 0); setNoiseLoop('blend', 0); Sound.stopShop(); saveGame(); onExit(); return; }
      if (s.view > LEFT && inRect(turnLeft, x, y)) { turn(-1); return; }
      if (s.view < RIGHT && inRect(turnRight, x, y)) { turn(1); return; }
      if (s.view === FRONT && inRect(SPOTS[FRONT].book, x, y)) { s.book = true; return; }
      if (s.view === FRONT && inRect(RADIO, x, y) && !s.world.things.some(t => t.v === FRONT && inRect(thingRect(t), x, y))) {
        const info = Sound.radioNext();
        s.radioTag = { text: info.on ? 'RADIO ' + (info.index + 1) + '/' + info.total + ' - ' + info.name : 'RADIO MATI', t: 2.6 };
        return;
      }
      if (canDeliver() && inRect(DELIVER_BUTTON, x, y)) { deliver(); return; }
      grab(x, y);
    },
    isHolding() { return !!s.hand; },
    hasSave() { try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); return !!(d && d.version === SAVE_VERSION && d.world); } catch (e) { return false; } },
    summary() { return { money: s.world.money, made: s.made, recipes: s.unlocked.length }; },
    exportSave() { return saveText(); },
    importSave(text) {
      let data;
      try { data = JSON.parse(text); } catch (e) { return false; }
      if (!data || data.version !== SAVE_VERSION || !data.world || !Array.isArray(data.world.things)) return false;
      const before = saveText();
      try {
        localStorage.setItem(SAVE_KEY, text);
        clearMoment();
        if (!loadGame()) throw new Error('rusak');
        syncBatterSpot(); s.cam = s.view; saveGame();
        return true;
      } catch (e) {
        try { localStorage.setItem(SAVE_KEY, before); } catch (err) { /* penyimpanan tidak tersedia */ }
        loadGame(); syncBatterSpot();
        return false;
      }
    },
    newGame() { clearMoment(); resetGame(); s.view = FRONT; s.cam = FRONT; s.guestT = 6; s.nudgeT = 0; saveGame(); },
    setTouch(on) { s.touch = !!on; },
    up() {
      s.blending = false;
      if (s.knob) {
        if (!s.knob.moved) setFlame(s.knob.key, s.knob.level0 ? 0 : 1);
        s.knob = null;
        return;
      }
      if (s.hand) drop(s.mouse[0], s.mouse[1]);
    },
    key(k) {
      if (k === 'Escape') { s.store = null; s.book = false; if (s.result && s.result.t > 0.25) s.result = null; return; }
      if (s.book || s.result) return;
      if (k === 'a' || k === 'A' || k === 'ArrowLeft') turn(-1);
      if (k === 'd' || k === 'D' || k === 'ArrowRight') turn(1);
    },
    debug() { return s; },
    guideText() { const act = nextAction(); return doughHandHint() || drinkHandHint() || knifeHint() || (act ? act.text : ''); },
  };
}
