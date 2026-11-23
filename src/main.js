const canvas = document.getElementById('game');
const g = canvas.getContext('2d');
g.imageSmoothingEnabled = false;

const street = layer(640, 360, drawScene);
const WARUNG = { x: 221, y: 101, w: 54, h: 80 };
let mode = 'street', nextMode = null, fade = 0, hoverWarung = false, time = 0, last = performance.now();
const shop = createShop(() => go('street'));
const menu = createMenu(shop, () => { if (mode === 'street') go('shop'); });

function go(to) { if (!nextMode) { nextMode = to; if (to === 'shop') sfx('doorChime'); } }

// Tombol volume: klik untuk penuh, setengah, lalu mati.
const AUDIO_BUTTONS = [{ id: 'music', label: 'MUSIK', x: 392, y: 5, w: 54, h: 13 }, { id: 'sfx', label: 'EFEK', x: 449, y: 5, w: 48, h: 13 }];
const audioButtonAt = (x, y) => AUDIO_BUTTONS.find(b => inRect(b, x, y));
function drawAudioButtons(mx, my) {
  AUDIO_BUTTONS.forEach(b => {
    const hot = inRect(b, mx, my), max = b.id === 'music' ? 0.6 : 1, bars = Math.round((Sound.level(b.id) / max) * 2);
    g.globalAlpha = hot ? 0.92 : 0.66; px(g, b.x, b.y, b.w, b.h, '#1c1519'); g.globalAlpha = 1;
    txt(g, b.label, b.x + 4, b.y + 4, bars ? (hot ? '#ffd98f' : '#efe2c5') : '#7c6b5d');
    for (let i = 0; i < 2; i++) px(g, b.x + b.w - 11 + i * 4, b.y + 8 - i * 3, 3, 2 + i * 3, i < bars ? '#e8b64c' : '#4e3a3c');
  });
}
let pointer = [0, 0];

function toGame(e) {
  const r = canvas.getBoundingClientRect();
  return [(e.clientX - r.left) * 640 / r.width, (e.clientY - r.top) * 360 / r.height];
}

canvas.addEventListener('pointermove', e => {
  const [x, y] = toGame(e);
  pointer = [x, y];
  if (e.pointerType) shop.setTouch(e.pointerType === 'touch');
  if (menu.isOpen()) {
    menu.move(x, y); hoverWarung = false;
    canvas.style.cursor = audioButtonAt(x, y) || menu.clickable(x, y) ? 'pointer' : 'default';
    return;
  }
  if (mode === 'street') {
    hoverWarung = inRect(WARUNG, x, y);
    canvas.style.cursor = hoverWarung || audioButtonAt(x, y) || inRect(MENU_BUTTON, x, y) ? 'pointer' : 'default';
  } else {
    shop.move(x, y);
    canvas.style.cursor = shop.isHolding() ? 'none' : audioButtonAt(x, y) || inRect(MENU_BUTTON, x, y) || shop.clickable(x, y) ? 'pointer' : 'default';
  }
});
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  canvas.setPointerCapture(e.pointerId);
  const [x, y] = toGame(e);
  shop.setTouch(e.pointerType === 'touch');
  Sound.unlock();
  const audioButton = !shop.isHolding() && audioButtonAt(x, y);
  if (audioButton) { Sound.cycle(audioButton.id); return; }
  if (nextMode) return;
  if (menu.isOpen()) { menu.down(x, y); return; }
  if (!shop.isHolding() && inRect(MENU_BUTTON, x, y)) { menu.openPause(); return; }
  if (mode === 'street') { if (inRect(WARUNG, x, y)) go('shop'); }
  else {
    shop.down(x, y);
    if (shop.isHolding()) canvas.style.cursor = 'none';
  }
});
addEventListener('pointerup', () => {
  if (mode !== 'shop' || menu.isOpen()) return;
  shop.up();
  canvas.style.cursor = 'default';
});
addEventListener('pointercancel', () => { if (mode === 'shop') shop.up(); });
addEventListener('blur', () => { if (mode === 'shop') shop.up(); });
addEventListener('keydown', e => {
  Sound.unlock();
  if (e.key === 'Escape' && !nextMode) {
    if (menu.isOpen()) menu.back();
    else { if (mode === 'shop') shop.up(); menu.openPause(); }
    return;
  }
  if (menu.isOpen() || mode !== 'shop' || nextMode) return;
  if (e.key.startsWith('Arrow')) e.preventDefault();
  shop.key(e.key);
});

function drawStreet() {
  g.drawImage(street, 0, 0);
  if (menu.isOpen()) return;
  const label = 'KLIK WARUNG';
  const y = 82 + Math.round(Math.sin(time * 4) * 2), w = textW(label) + 12, x = 248 - w / 2;
  px(g, x, y, w, 12, C.ink); px(g, x + 1, y + 1, w - 2, 10, hoverWarung ? C.yellow : C.white);
  txtC(g, label, 248, y + 4, C.ink);
  for (let i = 0; i < 4; i++) px(g, 245 + i, y + 12 + i, 7 - i * 2, 1, C.ink);
  if (hoverWarung) {
    px(g, WARUNG.x, WARUNG.y + 10, WARUNG.w, 1, C.yellow); px(g, WARUNG.x, WARUNG.y + 67, WARUNG.w, 1, C.yellow);
    px(g, WARUNG.x, WARUNG.y + 10, 1, 57, C.yellow); px(g, WARUNG.x + WARUNG.w - 1, WARUNG.y + 10, 1, 57, C.yellow);
  }
}

function frame(now) {
  const dt = Math.max(0, Math.min((now - last) / 1000, 0.05));
  last = now; time += dt;

  if (nextMode) {
    fade += dt * 4;
    if (fade >= 1) { fade = 1; mode = nextMode; nextMode = null; canvas.style.cursor = 'default'; Sound.setScene(mode); }
  } else fade = Math.max(0, fade - dt * 4);

  Sound.tick(dt);
  menu.update(dt);
  if (mode === 'shop') { if (!menu.isOpen()) shop.update(dt); shop.draw(g); } else drawStreet();
  menu.draw(g);
  if (!menu.isOpen()) {
    const hot = inRect(MENU_BUTTON, pointer[0], pointer[1]);
    g.globalAlpha = hot ? 0.92 : 0.66; px(g, MENU_BUTTON.x, MENU_BUTTON.y, MENU_BUTTON.w, MENU_BUTTON.h, '#1c1519'); g.globalAlpha = 1;
    txtC(g, 'MENU', MENU_BUTTON.x + MENU_BUTTON.w / 2, MENU_BUTTON.y + 4, hot ? '#ffd98f' : '#efe2c5');
  }
  drawAudioButtons(pointer[0], pointer[1]);
  if (fade > 0) { g.globalAlpha = fade; px(g, 0, 0, 640, 360, '#1d1826'); g.globalAlpha = 1; }
  requestAnimationFrame(frame);
}

function fit() {
  const ratio = Math.min(innerWidth / 640, innerHeight / 360);
  const scale = ratio >= 2 ? Math.floor(ratio) : ratio;
  canvas.style.width = 640 * scale + 'px';
  canvas.style.height = 360 * scale + 'px';
}
addEventListener('resize', fit);
fit();
requestAnimationFrame(frame);
