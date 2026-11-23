// Menu judul dan menu jeda: lanjutkan, simpan, muat, dan game baru.

const MENU_BUTTON = { x: 500, y: 5, w: 40, h: 13 };

function createMenu(shop, onPlay) {
  const SLOTS = [1, 2, 3], slotKey = n => 'warung-senja-slot-' + n;
  const BTN = { x: 244, w: 152, h: 24, gap: 29 }, ROW = { x: 170, y: 126, w: 300, h: 40, gap: 46 };
  const BACK = { x: 270, y: 272, w: 100, h: 20 };
  let screen = 'title', home = 'title', armed = null, note = '', noteT = 0, mouse = [0, 0], time = 0;

  const readSlot = n => {
    try {
      const slot = JSON.parse(localStorage.getItem(slotKey(n)));
      const data = slot && typeof slot.data === 'string' ? JSON.parse(slot.data) : null;
      return data && data.world && Array.isArray(data.world.things) ? slot : null;
    } catch (e) { return null; }
  };
  const anySlot = () => SLOTS.some(n => readSlot(n));
  const say = text => { note = text; noteT = 2.4; };
  const go = next => { screen = next; armed = null; sfx('page'); };
  const play = () => { screen = null; armed = null; onPlay(); };

  function writeSlot(n) {
    try {
      localStorage.setItem(slotKey(n), JSON.stringify({ savedAt: Date.now(), ...shop.summary(), data: shop.exportSave() }));
      armed = null; say('TERSIMPAN DI SLOT ' + n); sfx('cleanSparkle');
    } catch (e) { say('GAGAL MENYIMPAN, MEMORI BROWSER PENUH'); }
  }
  function loadSlot(n) {
    const slot = readSlot(n);
    if (!slot || !shop.importSave(slot.data)) { armed = null; say('SLOT INI TIDAK BISA DIMUAT'); return; }
    sfx('doorChime'); play();
  }
  const items = () => {
    if (screen === 'title') return [...(shop.hasSave() ? [['LANJUTKAN', 'play']] : []), ['GAME BARU', 'new'], ['MUAT', 'load']];
    if (screen === 'pause') return [['LANJUTKAN', 'play'], ['SIMPAN', 'save'], ['MUAT', 'load'], ['GAME BARU', 'new']];
    if (screen === 'new') return [['YA, MULAI BARU', 'confirmNew'], ['BATAL', 'back']];
    return [];
  };
  const buttons = () => {
    const list = items(), top = screen === 'new' ? 190 : screen === 'title' ? 178 : 132;
    return list.map(([label, id], i) => ({ label, id, x: BTN.x, y: top + i * BTN.gap, w: BTN.w, h: BTN.h }));
  };
  const rows = () => SLOTS.map((n, i) => ({ n, x: ROW.x, y: ROW.y + i * ROW.gap, w: ROW.w, h: ROW.h }));
  const onSlots = () => screen === 'save' || screen === 'load';

  function press(id) {
    if (id === 'play') { sfx('page'); play(); }
    else if (id === 'save') go('save');
    else if (id === 'load') { if (anySlot()) go('load'); else { say('BELUM ADA SIMPANAN'); sfx('switch'); } }
    else if (id === 'new') { if (home === 'title' && !shop.hasSave()) { shop.newGame(); sfx('doorChime'); play(); } else go('new'); }
    else if (id === 'confirmNew') { shop.newGame(); sfx('doorChime'); play(); }
    else if (id === 'back') go(home);
  }
  function pressSlot(n) {
    const slot = readSlot(n);
    if (screen === 'save') {
      if (slot && armed !== n) { armed = n; sfx('switch'); return; }
      writeSlot(n);
      return;
    }
    if (!slot) { say('SLOT INI KOSONG'); sfx('switch'); return; }
    if (shop.hasSave() && armed !== n) { armed = n; sfx('switch'); return; }
    loadSlot(n);
  }

  const panel = (x, y, w, h) => {
    g2(x + 4, y + 5, w, h, '#120d14', 0.45);
    px(ctx, x, y, w, h, '#2c1d1b'); px(ctx, x + 3, y + 3, w - 6, h - 6, '#5c2f28'); px(ctx, x + 7, y + 7, w - 14, h - 14, '#efe3c8'); px(ctx, x + 7, y + 7, w - 14, 1, '#fff6e2');
  };
  let ctx = null;
  const g2 = (x, y, w, h, c, a) => { ctx.globalAlpha = a; px(ctx, x, y, w, h, c); ctx.globalAlpha = 1; };
  function drawButton(b, dim) {
    const hot = !dim && inRect(b, mouse[0], mouse[1]);
    px(ctx, b.x, b.y + 2, b.w, b.h, '#1c1519');
    px(ctx, b.x, b.y, b.w, b.h, '#2c1d1b');
    px(ctx, b.x + 2, b.y + 2, b.w - 4, b.h - 4, dim ? '#8a7660' : hot ? '#e8b64c' : '#587a6d');
    px(ctx, b.x + 2, b.y + 2, b.w - 4, 1, dim ? '#9d8a72' : hot ? '#ffe2a6' : '#7d9a88');
    txtC(ctx, b.label, b.x + b.w / 2, b.y + 8, hot ? '#2a1a17' : '#fff6e2', 2 > textW(b.label) / 60 ? 2 : 1);
  }
  function drawLogo(y) {
    const title = 'WARUNG SENJA', z = 4, w = textW(title, z), x = 320 - w / 2;
    txt(ctx, title, x + 2, y + 3, '#1c1519', z);
    txt(ctx, title, x, y, '#ffd98f', z);
    const glow = Math.round(Math.sin(time * 1.6) * 8);
    px(ctx, 320 - 70 - glow, y + 27, 140 + glow * 2, 1, '#e8b64c');
    txtC(ctx, 'MASAK PELAN, HATI TENANG', 320, y + 34, '#efe2c5');
  }
  function when(ms) {
    const d = new Date(ms), two = v => String(v).padStart(2, '0');
    return two(d.getDate()) + '/' + two(d.getMonth() + 1) + ' ' + two(d.getHours()) + ':' + two(d.getMinutes());
  }
  function drawSlots() {
    const saving = screen === 'save';
    panel(150, 72, 340, 232);
    txtC(ctx, saving ? 'SIMPAN GAME' : 'MUAT GAME', 320, 88, '#5c2f28', 2);
    txtC(ctx, saving ? 'PILIH SLOT UNTUK MENYIMPAN' : 'PILIH SIMPANAN', 320, 110, '#7a5a42');
    rows().forEach(r => {
      const slot = readSlot(r.n), hot = inRect(r, mouse[0], mouse[1]) && (saving || slot), sure = armed === r.n;
      px(ctx, r.x, r.y, r.w, r.h, '#2c1d1b');
      px(ctx, r.x + 2, r.y + 2, r.w - 4, r.h - 4, sure ? '#e8b64c' : hot ? '#e7cf9b' : slot ? '#f7efdc' : '#d9ccb0');
      txt(ctx, 'SLOT ' + r.n, r.x + 10, r.y + 8, '#5c2f28', 2);
      if (sure) txt(ctx, saving ? 'KLIK LAGI UNTUK MENIMPA' : 'KLIK LAGI UNTUK MEMUAT', r.x + 10, r.y + 26, '#5c2010');
      else if (slot) {
        txt(ctx, 'RP ' + Math.round(slot.money || 0).toLocaleString('id-ID') + ' - ' + (slot.made || 0) + ' TERSAJI - ' + (slot.recipes || 0) + ' RESEP', r.x + 10, r.y + 26, '#3a2822');
        const stamp = when(slot.savedAt); txt(ctx, stamp, r.x + r.w - 10 - textW(stamp), r.y + 9, '#7a5a42');
      } else txt(ctx, 'KOSONG', r.x + 10, r.y + 26, '#7a6a55');
    });
    drawButton({ ...BACK, label: 'KEMBALI' });
  }

  return {
    isOpen: () => !!screen,
    openPause() { home = 'pause'; screen = 'pause'; armed = null; sfx('page'); Sound.stopShop(); },
    update(dt) { time += dt; noteT = Math.max(0, noteT - dt); },
    move(x, y) { mouse = [x, y]; },
    clickable(x, y) {
      if (onSlots()) return inRect(BACK, x, y) || rows().some(r => inRect(r, x, y) && (screen === 'save' || readSlot(r.n)));
      return buttons().some(b => inRect(b, x, y));
    },
    down(x, y) {
      mouse = [x, y];
      if (onSlots()) {
        if (inRect(BACK, x, y)) { go(home); return; }
        const row = rows().find(r => inRect(r, x, y));
        if (row) pressSlot(row.n); else armed = null;
        return;
      }
      const b = buttons().find(q => inRect(q, x, y));
      if (b) press(b.id);
    },
    back() {
      if (!screen) return;
      if (screen === 'pause') { sfx('page'); play(); }
      else if (screen !== 'title') go(home);
    },
    draw(g) {
      if (!screen) return;
      ctx = g;
      g2(0, 0, 640, 360, '#120d18', screen === 'title' ? 0.62 : 0.6);
      if (screen === 'title') { g2(0, 70, 640, 62, '#120d18', 0.5); px(g, 0, 70, 640, 1, '#8a6a3e'); px(g, 0, 131, 640, 1, '#8a6a3e'); drawLogo(84); buttons().forEach(b => drawButton(b, b.id === 'load' && !anySlot())); }
      if (screen === 'pause') { panel(204, 62, 232, 214); txtC(ctx, 'MENU', 320, 86, '#5c2f28', 3); buttons().forEach(b => drawButton(b, b.id === 'load' && !anySlot())); }
      if (screen === 'new') {
        panel(176, 96, 288, 164);
        txtC(ctx, 'MULAI GAME BARU?', 320, 118, '#5c2f28', 2);
        txtC(ctx, 'PROGRES YANG SEDANG BERJALAN AKAN HILANG.', 320, 142, '#3a2822');
        txtC(ctx, 'SIMPANAN DI SLOT 1 SAMPAI 3 TETAP AMAN.', 320, 154, '#587a6d');
        buttons().forEach(b => drawButton(b));
      }
      if (onSlots()) drawSlots();
      if (noteT > 0) {
        const w = textW(note) + 20, x = 320 - w / 2;
        g.globalAlpha = Math.min(1, noteT * 3) * 0.94; px(g, x, 324, w, 15, '#1c1519'); px(g, x, 338, w, 1, '#e8b64c');
        txtC(g, note, 320, 329, '#ffe9bd'); g.globalAlpha = 1;
      }
    },
  };
}
