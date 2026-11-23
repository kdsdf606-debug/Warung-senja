// Resep Indonesia dan Malaysia. Langkah masak dibuat otomatis dari bahan, bumbu, dan cara masaknya.

const RECIPE_BOOK = [
  // Indonesia
  ['rendangsapi', 'RENDANG SAPI', 'id', 'pot', 'PADANG, KAYA REMPAH', ['beef+', 'bumbu'], ['santan', 'lengkuas', 'serai', 'kunyit'], ['#3f2118', '#6b3a22', '#a8652f']],
  ['ayamlengkuas', 'AYAM LENGKUAS', 'id', 'wok', 'GURIH DAN HARUM', ['ayam+'], ['lengkuas', 'kunyit', 'ketumbar'], ['#7c4a22', '#c9812f', '#e9c27a']],
  ['miejawa', 'MIE GORENG JAWA', 'id', 'wok', 'MANIS KECAP', ['mie', 'egg', 'kol+'], ['kemiri', 'lada'], ['#5a3320', '#94602f', '#d2a058'], true],
  ['sayurasem', 'SAYUR ASEM', 'id', 'pot', 'SEGAR DAN ASAM', ['tomat+', 'kol+'], ['asam', 'lengkuas', 'salam'], ['#8f6b2c', '#c49a45', '#ead07f']],
  ['rawon', 'RAWON', 'id', 'pot', 'KUAH HITAM JAWA TIMUR', ['beef+', 'bumbu'], ['kemiri', 'serai', 'lengkuas'], ['#1f1614', '#3a2822', '#5f463a']],
  ['opor', 'OPOR AYAM', 'id', 'pot', 'KUAH SANTAN LEMBUT', ['ayam+', 'shallot+'], ['santan', 'ketumbar', 'serai'], ['#c9a765', '#ecd39a', '#fbeecb']],
  ['capcay', 'CAP CAY', 'id', 'wok', 'TUMIS SAYUR UDANG', ['wortel+', 'kol+', 'udang+'], ['lada'], ['#6f8a4a', '#c98a45', '#e8c98a'], true],
  ['ikanbalado', 'IKAN BALADO', 'id', 'wok', 'PEDAS MINANG', ['ikan+', 'bumbu'], ['asam'], ['#7a241c', '#b6382c', '#e0705a']],
  ['tongseng', 'TONGSENG KAMBING', 'id', 'pot', 'MANIS PEDAS SOLO', ['kambing+', 'kol+', 'tomat+'], ['gulamerah', 'ketumbar', 'kunyit'], ['#5a3320', '#8f5a30', '#c99a58']],
  ['terongbalado', 'TERONG BALADO', 'id', 'wok', 'LEMBUT DAN PEDAS', ['terong+', 'bumbu'], ['gula'], ['#4a2438', '#a8382c', '#d9705a']],
  ['bebekgoreng', 'BEBEK GORENG', 'id', 'wok', 'GURIH SAMBAL SURABAYA', ['bebek+', 'bumbu'], ['kunyit', 'ketumbar'], ['#4f2a1a', '#8f5228', '#d09a58']],
  ['gulaikambing', 'GULAI KAMBING', 'id', 'pot', 'KUAH KUNING BEREMPAH', ['kambing+', 'bumbu'], ['santan', 'kunyit', 'ketumbar', 'serai'], ['#a8611f', '#dc9838', '#f4ca6c']],
  ['sopiga', 'SOP IGA', 'id', 'pot', 'BENING DAN HANGAT', ['beef+', 'wortel+', 'kentang+'], ['pala', 'lada'], ['#a88a55', '#d8bd80', '#f2e2b0']],
  ['ricarica', 'AYAM RICA RICA', 'id', 'wok', 'PEDAS MANADO', ['ayam+', 'bumbu', 'tomat+'], ['jahe', 'serai', 'jeruk'], ['#8a2318', '#cf4630', '#ef8a62']],
  ['cumiasam', 'CUMI ASAM MANIS', 'id', 'wok', 'SEGAR DAN LEMBUT', ['cumi+', 'tomat+'], ['asam', 'gula'], ['#a83f2c', '#e0704a', '#f6d2bc']],
  ['udangbalado', 'UDANG BALADO', 'id', 'wok', 'PEDAS GURIH MINANG', ['udang+', 'bumbu'], ['asam', 'bawanggoreng'], ['#8a2a1c', '#d24a30', '#f29a70']],
  ['perkedel', 'PERKEDEL KENTANG', 'id', 'wok', 'GORENG LEMBUT', ['kentang~'], ['lada', 'bawanggoreng'], ['#8a5a26', '#d09a48', '#f0d08a']],
  ['bakwan', 'BAKWAN SAYUR', 'id', 'wok', 'GORENGAN RENYAH', ['wortel~', 'kol~'], ['lada', 'ketumbar'], ['#8a5f26', '#cf9440', '#a8b860']],
  ['martabaktelur', 'MARTABAK TELUR', 'id', 'wok', 'KULIT ISI BAWANG', ['kulit', 'egg', 'shallot+'], ['lada', 'kaldu'], ['#8f5a26', '#dca044', '#f4d488']],
  ['lodeh', 'SAYUR LODEH', 'id', 'pot', 'SANTAN SAYUR JAWA', ['terong+', 'kol+', 'wortel+'], ['santan', 'lengkuas', 'salam'], ['#c0a062', '#e8d09a', '#9fb56a']],
  // Malaysia
  ['nasilemak', 'NASI LEMAK', 'my', 'wok', 'SANTAN DAN SAMBAL', ['rice', 'bumbu', 'egg'], ['santan', 'salam', 'kacang'], ['#b98f50', '#efe3c8', '#c7473a']],
  ['nasikampung', 'NASI KAMPUNG', 'my', 'wok', 'IKAN DAN CILI', ['rice', 'bumbu', 'ikan+'], ['terasi'], ['#6d3f28', '#a9683b', '#d9a05a'], true],
  ['pattaya', 'NASI PATTAYA', 'my', 'wok', 'BERSELIMUT TELUR', ['rice', 'egg', 'ayam+', 'tomat+'], ['lada'], ['#c99a3c', '#f0cf6b', '#fff0b0'], true],
  ['meemamak', 'MEE GORENG MAMAK', 'my', 'wok', 'PEDAS GAYA MAMAK', ['mie', 'egg', 'tomat+', 'kol+'], ['cabe', 'kunyit'], ['#7a3320', '#b9602f', '#e8a258'], true],
  ['kwayteow', 'CHAR KWAY TEOW', 'my', 'wok', 'WANGI API PENANG', ['mie', 'udang+', 'egg'], ['bawanggoreng', 'cabe'], ['#4f2f1c', '#8a5426', '#c98f4a'], true],
  ['asamlaksa', 'ASAM LAKSA', 'my', 'pot', 'KUAH IKAN ASAM', ['mie', 'ikan+', 'bumbu'], ['asam', 'serai', 'lengkuas'], ['#8f4a2c', '#c9743f', '#eab06f']],
  ['currylaksa', 'KARI LAKSA', 'my', 'pot', 'SANTAN PEDAS', ['mie', 'udang+', 'bumbu'], ['santan', 'kunyit', 'serai'], ['#b9662a', '#e39a3f', '#f6cf7c']],
  ['rendangtok', 'RENDANG TOK', 'my', 'pot', 'PERAK, PEKAT', ['beef+', 'bumbu'], ['santan', 'kunyit', 'kayumanis', 'jeruk'], ['#2f1a12', '#54301c', '#8a5430']],
  ['masakmerah', 'AYAM MASAK MERAH', 'my', 'wok', 'TOMAT PEDAS MANIS', ['ayam+', 'bumbu', 'tomat+'], ['gula', 'kayumanis'], ['#7a1f18', '#c23a2e', '#e8735a']],
  ['ayampercik', 'AYAM PERCIK', 'my', 'wok', 'BAKAR SANTAN KELANTAN', ['ayam+', 'shallot+'], ['santan', 'kunyit', 'serai'], ['#8a4f22', '#d08a3a', '#f0c878']],
  ['sambaludang', 'SAMBAL UDANG', 'my', 'wok', 'PEDAS MANIS', ['udang+', 'bumbu'], ['asam', 'gula'], ['#8f2a1f', '#d04f33', '#f09a6a']],
  ['sotongsambal', 'SOTONG SAMBAL', 'my', 'wok', 'CUMI PEDAS', ['cumi+', 'bumbu'], ['asam', 'terasi'], ['#7a241c', '#c2452f', '#f0d2c0']],
  ['asampedas', 'IKAN ASAM PEDAS', 'my', 'pot', 'MELAKA, ASAM PEDAS', ['ikan+', 'bumbu', 'tomat+'], ['asam', 'kunyit'], ['#8f2f1f', '#c9502f', '#ec9460']],
  ['karikepala', 'KARI IKAN', 'my', 'pot', 'KARI TERONG SANTAN', ['ikan+', 'terong+'], ['santan', 'kunyit', 'ketumbar'], ['#a8561f', '#dc8f35', '#f4c46a']],
  ['kariayam', 'KARI AYAM', 'my', 'pot', 'KENTANG DAN SANTAN', ['ayam+', 'kentang+'], ['santan', 'kunyit', 'ketumbar'], ['#b0611f', '#e09a38', '#f6cd72']],
  ['supkambing', 'SUP KAMBING', 'my', 'pot', 'HANGAT BEREMPAH', ['kambing+', 'wortel+', 'kentang+'], ['ketumbar', 'lada', 'pala'], ['#a8854a', '#d6b673', '#f0dca4']],
  ['kurma', 'KURMA DAGING', 'my', 'pot', 'LEMBUT TIDAK PEDAS', ['beef+', 'kentang+'], ['santan', 'ketumbar', 'kayumanis'], ['#b98f50', '#e3c07a', '#f8e4b0']],
  ['murtabak', 'MURTABAK', 'my', 'wok', 'KULIT ISI DAGING', ['kulit', 'egg', 'beef+'], ['kunyit', 'ketumbar'], ['#8a5426', '#d99a3f', '#f2cf7c']],
  ['cucurudang', 'CUCUR UDANG', 'my', 'wok', 'GORENGAN UDANG', ['udang~'], ['kunyit'], ['#7c4a22', '#c9812f', '#efc070']],
  ['ketamlemak', 'KETAM MASAK LEMAK', 'my', 'pot', 'KEPITING SANTAN', ['kepiting+', 'kentang+'], ['santan', 'kunyit', 'serai'], ['#c9702f', '#eeb04f', '#fbdf96']],
  ['ayamberempah', 'AYAM BEREMPAH', 'my', 'wok', 'GORENG SERAI KUNYIT', ['ayam+', 'shallot+'], ['serai', 'kunyit', 'ketumbar'], ['#7a4418', '#c47e2c', '#ecc070']],
  ['ikanbakar', 'IKAN BAKAR', 'my', 'wok', 'SAMBAL ASAM BAKAR', ['ikan+', 'bumbu'], ['kunyit', 'asam', 'santan'], ['#5a2c1a', '#a8542c', '#e09a5c']],
  ['lemakcili', 'LEMAK CILI API', 'my', 'pot', 'NEGERI SEMBILAN', ['ayam+', 'bumbu'], ['santan', 'kunyit'], ['#c98a24', '#efbb3f', '#fbe08a']],
  ['sambaltelur', 'SAMBAL TELUR', 'my', 'wok', 'TELUR SAMBAL MANIS', ['egg', 'bumbu'], ['gula', 'asam'], ['#8f2c1f', '#d4553a', '#f8e2a8']],
  ['supayam', 'SUP AYAM', 'my', 'pot', 'REMPAH KAYU MANIS', ['ayam+', 'wortel+', 'kentang+'], ['lada', 'kayumanis'], ['#b0935a', '#dcc488', '#f4e6b8']],
  ['meerebus', 'MEE REBUS', 'my', 'pot', 'KUAH KENTANG MANIS', ['mie', 'egg', 'kentang+'], ['kacang', 'gula'], ['#a8682a', '#d9983f', '#f0c878']],
  ['meesup', 'MEE SUP', 'my', 'pot', 'KUAH AYAM RINGAN', ['mie', 'ayam+', 'kol+'], ['lada', 'bawanggoreng'], ['#b39a62', '#dfc994', '#f5e8c0']],
  ['nasicina', 'NASI GORENG CINA', 'my', 'wok', 'TELUR DAN UDANG', ['rice', 'egg', 'udang+'], ['lada'], ['#b98a3a', '#e8c468', '#f8e6a8']],
  ['dagingkicap', 'DAGING KICAP', 'my', 'wok', 'MANIS KECAP', ['beef+', 'shallot+'], ['lada', 'gula'], ['#2f1a14', '#5a3222', '#94603a'], true],
  ['pajeri', 'PAJERI NANAS', 'my', 'pot', 'KARI NANAS MANIS', ['nanas+', 'bumbu'], ['santan', 'kayumanis', 'kunyit'], ['#c28a24', '#ecbc42', '#fbe58a']],
];

function recipeSteps(r) {
  const steps = [], pot = r.method === 'pot', vessel = pot ? 'PANCI' : 'WAJAN', label = f => FOOD_LABEL[f] || 'BAHAN', added = new Set();
  const add = (key, n, v, spot, text) => { if (!added.has(key)) { added.add(key); steps.push({ key, n, v, spot, text }); } };
  const cut = type => add('cut:' + type, 'IRIS ' + label(type), LEFT, 'board', 'TARUH ' + label(type) + ' DI TALENAN');
  [...r.items].sort((a, b) => (b === 'bumbu') - (a === 'bumbu')).forEach(f => {
    if (f === 'bumbu') {
      add('cutChili', 'IRIS CABAI', LEFT, 'board', 'TARUH CABAI DI TALENAN');
      add('cutShallot', 'IRIS BAWANG', LEFT, 'board', 'TARUH BAWANG DI TALENAN');
      if (pot) {
        add('toCobek', 'KE BLENDER', LEFT, 'blender', 'KUAH BUTUH BUMBU HALUS, BAWA IRISAN KE BLENDER');
        add('ground', 'BLENDER BUMBU', LEFT, 'blender', 'TAHAN TOMBOL BLENDER SAMPAI HALUS');
      } else {
        add('toCobek', 'KE COBEK', LEFT, 'cobek', 'TUMISAN BUTUH BUMBU ULEK, BAWA IRISAN KE COBEK');
        add('ground', 'ULEK BUMBU', LEFT, 'cobek', 'PEGANG ULEKAN, GOSOK DI COBEK');
      }
    } else if (f === 'mie' || f === 'kulit') add('mk:' + f, 'BUAT ' + label(f), LEFT, 'dough', 'BUAT ADONAN KENTAL, GILAS DI TALENAN');
    else if (f.endsWith('~')) { const type = f.slice(0, -1); cut(type); add('bat:' + type, 'BALUR ' + label(type), LEFT, 'board', 'CELUP IRISAN KE MANGKUK ADONAN'); }
    else if (f.endsWith('+')) cut(f.slice(0, -1));
  });
  if (pot) add('boil', 'DIDIHKAN', RIGHT, 'knobR', 'NYALAKAN API KANAN UNTUK PANCI');
  else {
    add('oil', 'TUANG MINYAK', RIGHT, 'minyak', 'ANGKAT MINYAK, TUANG KE WAJAN');
    add('fire', 'NYALAKAN API', RIGHT, 'knobL', 'KLIK TOMBOL API KIRI');
  }
  r.items.forEach(f => add((pot ? 'pin:' : 'in:') + f, label(f) + ' KE ' + vessel, LEFT, 'board', 'BAWA ' + label(f) + ' KE ' + vessel));
  if (r.soy) add('soy', 'KECAP', RIGHT, 'kecap', 'TUANG KECAP SAMPAI ZONA KUNING');
  r.spices.forEach(id => add('sp:' + id, 'TABUR ' + SPICE_BY_ID[id].name, RIGHT, pot ? 'pot' : 'wok', 'AMBIL ' + SPICE_BY_ID[id].name + ' DARI LEMARI'));
  if (pot) {
    add('potSalt', 'TABUR GARAM', RIGHT, 'salt', 'TABUR GARAM DI ATAS PANCI');
    add('simmer', 'REBUS', RIGHT, 'pot', 'TUNGGU KUAH MATANG');
    add('bowlOut', 'SIAPKAN MANGKUK', RIGHT, 'bowls', 'TARUH MANGKUK DI ALAS KAYU');
    add('ladled', 'CIDUK KUAH', RIGHT, 'ladle', 'CELUP CENTONG, TUANG KE MANGKUK');
    add('served', 'SAJIKAN', RIGHT, 'mat', 'BAWA MANGKUK KE TEMPAT SAJI');
  } else {
    add('salt', 'TABUR GARAM', RIGHT, 'salt', 'GOYANGKAN GARAM SAMPAI ZONA KUNING');
    add('cooked', 'MASAK', RIGHT, 'spatula', 'PEGANG SUTIL, ADUK SAMPAI MATANG');
    add('plateOut', 'SIAPKAN PIRING', RIGHT, 'plates', 'TARUH PIRING DI ALAS KAYU');
    add('plated', 'ANGKAT MASAKAN', RIGHT, 'wok', 'PEGANG GAGANG WAJAN, MIRINGKAN KE PIRING');
    add('served', 'SAJIKAN', RIGHT, 'mat', 'BAWA PIRING KE MEJA DEPAN');
  }
  return steps;
}

RECIPE_BOOK.forEach(([id, name, region, method, note, items, spices, art, soy]) => {
  const r = { name, note, region, method, items, spices, art, soy: !!soy, auto: true, wok: method === 'wok' ? items : [] };
  if (method === 'pot') { r.soup = items; SOUP_COLORS[id] = art; }
  r.steps = recipeSteps(r);
  RECIPES[id] = r;
  DISH_NAMES[id] = name;
});

// Sup dan soto memakai bumbu halus dari blender, sama seperti masakan berkuah lain.
RECIPES.soto.steps.forEach(st => {
  if (st.key === 'toCobek') Object.assign(st, { n: 'KE BLENDER', spot: 'blender', text: 'KUAH BUTUH BUMBU HALUS, BAWA IRISAN KE BLENDER' });
  if (st.key === 'ground') Object.assign(st, { n: 'BLENDER BUMBU', spot: 'blender', text: 'TAHAN TOMBOL BLENDER SAMPAI HALUS' });
  if (st.key === 'potBumbu') Object.assign(st, { spot: 'blender', text: 'ANGKAT BLENDER, TUANG BUMBU KE PANCI' });
});

// Minuman segar dari blender.
const DRINK_BY_NAME = {};
[
  ['jusmangga', 'mangga', 'MANIS DAN SEGAR'],
  ['jusnanas', 'nanas', 'ASAM MANIS TROPIS'],
  ['juspisang', 'banana', 'KENTAL DAN LEMBUT'],
  ['jusjeruk', 'jeruk', 'ASAM PENGHILANG HAUS'],
  ['juswortel', 'wortel', 'MANIS DAN SEHAT'],
  ['justomat', 'tomat', 'SEGAR SEDIKIT ASAM'],
].forEach(([id, fruit, note]) => {
  const label = FOOD_LABEL[fruit], name = 'JUS ' + label;
  RECIPES[id] = {
    name, note, drink: fruit, wok: [], steps: [
      { key: 'cut:' + fruit, n: 'IRIS ' + label, v: LEFT, spot: 'board', text: 'TARUH ' + label + ' DI TALENAN' },
      { key: 'blIn', n: 'KE BLENDER', v: LEFT, spot: 'blender', text: 'BAWA IRISAN KE BLENDER' },
      { key: 'blWater', n: 'TAMBAH AIR', v: LEFT, spot: 'blender', text: 'BAWA GELAS AIR, TAHAN DI ATAS BLENDER' },
      { key: 'blend', n: 'BLENDER', v: LEFT, spot: 'blender', text: 'TAHAN TOMBOL BLENDER SAMPAI HALUS' },
      { key: 'jPour', n: 'TUANG KE GELAS', v: LEFT, spot: 'blender', text: 'ANGKAT BLENDER, TUANG KE GELAS' },
      { key: 'served', n: 'SAJIKAN', v: FRONT, spot: 'plate', text: 'TARUH JUS DI TEMPAT SAJI' },
    ],
  };
  DISH_NAMES[id] = name;
  DRINK_BY_NAME[name] = id;
});
