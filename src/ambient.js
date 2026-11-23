// Animasi suasana yang terus berjalan di ketiga meja. Hanya gambar, tidak memengaruhi permainan.

function createAmbient(rooms, outside, info) {
  let t = 0, flameL = 0, flameR = 0, lastDrip = 0;
  const flameLeftGlow = glowLayer([[262, 214, 128]]), flameRightGlow = glowLayer([[382, 214, 118]]), leftGlow = glowLayer([[190, 112, 138], [440, 112, 138]]);

  // Gantungan dipotong dari ruangan supaya bisa bergoyang di depan jalanan.
  const cut = (room, x, y, w, h) => {
    const c = layer(w, h, g => g.drawImage(room, -x, -y));
    room.getContext('2d').clearRect(x, y, w, h);
    return { c, x, y, w, h };
  };
  const hangs = [
    { ...cut(rooms[FRONT], 99, 53, 11, 82), amp: 2.2, speed: 1.05, phase: 0.2 },
    { ...cut(rooms[FRONT], 111, 53, 11, 82), amp: 1.8, speed: 1.2, phase: 1.5 },
    { ...cut(rooms[FRONT], 123, 53, 11, 82), amp: 2.4, speed: 0.94, phase: 2.7 },
    { ...cut(rooms[FRONT], 502, 55, 40, 44), amp: 1.6, speed: 0.8, phase: 0.9 },
  ];
  const gust = () => 0.62 + 0.38 * Math.sin(t * 0.21) * Math.sin(t * 0.37 + 1);

  function drawHang(g, h) {
    for (let j = 0; j < h.h; j++) {
      const k = (j + 1) / h.h, off = Math.round(Math.sin(t * h.speed + h.phase - k * 0.9) * h.amp * gust() * k ** 1.25);
      g.drawImage(h.c, 0, j, h.w, 1, h.x + off, h.y + j, h.w, 1);
    }
  }
  function foliage(g, room, x, y, w, h, amp, speed, phase) {
    for (let j = 0; j < h; j++) {
      const k = 1 - j / h, off = Math.round(Math.sin(t * speed + phase + k * 0.8) * amp * gust() * k * k);
      if (off) g.drawImage(room, x, y + j, w, 1, x + off, y + j, w, 1);
    }
  }
  function drawCloth(g, sp, x, y, phase = 0) {
    const left = Math.round(x) - sp.ax, top = Math.round(y) - sp.ay, h = sp.c.height;
    for (let j = 0; j < h; j++) {
      const k = j / h, off = Math.round(Math.sin(t * 1.15 + phase - k * 2.1) * 1.8 * gust() * k * k);
      g.drawImage(sp.c, 0, j, sp.c.width, 1, left + off, top + j, sp.c.width, 1);
    }
  }
  const utensilSway = i => Math.sin(t * 0.9 + i * 1.7) * 0.022 * gust();

  // Lampu gedung yang menyala dan mati pelan-pelan.
  const cityLights = [];
  {
    const data = outside.getContext('2d').getImageData(90, 58, 460, 76), d = data.data;
    const lit = (x, y) => {
      if (x < 0 || y < 0 || x >= 460 || y >= 76) return false;
      const i = (y * 460 + x) * 4;
      return (d[i] === 0xe9 && d[i + 1] === 0xa9 && d[i + 2] === 0x5f) || (d[i] === 0xc9 && d[i + 1] === 0x82 && d[i + 2] === 0x4f);
    };
    for (let y = 0; y < 76; y++) for (let x = 0; x < 460; x++) {
      if (!lit(x, y) || lit(x - 1, y) || lit(x, y - 1)) continue;
      const n = cityLights.length;
      cityLights.push({ x: x + 90, y: y + 58, period: 18 + noise(n, 4) * 34, phase: noise(n, 9), tv: noise(n, 13) > 0.86, moves: noise(n, 6) > 0.42 });
    }
  }
  function drawCity(g) {
    cityLights.forEach((l, n) => {
      if (l.tv) {
        g.globalAlpha = 0.28 + 0.2 * Math.sin(t * 5.1 + n) * Math.sin(t * 2.3 + n * 2);
        px(g, l.x, l.y, 3, 4, '#9fc6e8');
      } else if (l.moves) {
        const p = (t / l.period + l.phase) % 1;
        const off = p < 0.68 ? 0 : p < 0.72 ? (p - 0.68) / 0.04 : p < 0.96 ? 1 : (1 - p) / 0.04;
        if (off > 0) { g.globalAlpha = off * 0.92; px(g, l.x, l.y, 3, 4, '#2c2743'); }
      }
    });
    g.globalAlpha = 1;
  }
  function drawSky(g) {
    [[0, 56, 74, 3.2], [190, 60, 54, 2.3], [340, 54, 92, 2.7]].forEach(([start, y, w, speed]) => {
      const x = 90 + ((start + t * speed) % 560) - w;
      g.globalAlpha = 0.18; px(g, x, y, w, 2, '#a8809a'); px(g, x + 9, y - 1, w - 24, 1, '#c79aa4'); px(g, x + 14, y + 2, w - 34, 1, '#7f5278');
    });
    g.globalAlpha = 1;
    const k = (t % 84) / 84, x = 84 + k * 480;
    if (k < 0.96) { px(g, x, 59, 2, 1, '#d8d4dc'); if ((t % 1.3) < 0.16) px(g, x + 2, 59, 1, 1, '#ff7a64'); }
  }

  // Kendaraan dan pejalan kaki di jalan basah.
  const COLORS = ['#7a2f2f', '#31556a', '#b9b3a7', '#384538', '#8a6a3a', '#3a3648'];
  const lanes = [{ y: 151, dir: 1, speed: 58, wait: 1.5, list: [] }, { y: 164, dir: -1, speed: 76, wait: 5, list: [] }];
  const people = [];
  let personWait = 1;

  function headBeam(g, front, y) {
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) { g.globalAlpha = 0.17 - i * 0.03; px(g, front + i * 6, y - 1 - (i >> 1), 7, 2 + i, '#c98d4e'); }
    g.globalAlpha = 0.22; px(g, front, 3, 22, 1, '#ffdf9e');
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  }
  function drawVehicle(g, v, lane) {
    g.save(); g.translate(Math.round(v.x), lane.y); g.scale(lane.dir, 1);
    if (v.kind === 'bike') {
      g.globalAlpha = 0.25; px(g, -9, 1, 18, 2, v.color); g.globalAlpha = 1;
      headBeam(g, 10, -4);
      [-7, 7].forEach(x => { px(g, x - 2, -3, 5, 3, '#141218'); px(g, x, -2, 1, 1, '#77727a'); });
      px(g, -6, -6, 12, 3, v.color); px(g, 4, -9, 2, 4, '#2c2830'); px(g, 3, -10, 5, 1, '#524c55');
      px(g, -4, -14, 7, 8, '#2f5f58'); px(g, -3, -14, 2, 7, '#4f8a7e'); px(g, 2, -11, 4, 2, '#2f5f58');
      px(g, -2, -19, 5, 5, '#c9b23f'); px(g, 1, -17, 2, 2, '#1d1c24');
      px(g, 9, -6, 2, 2, '#fff1c0'); px(g, -9, -6, 2, 1, '#e8473a');
    } else {
      const van = v.kind === 'van', half = van ? 19 : 17, roof = van ? -19 : -14;
      g.globalAlpha = 0.25; px(g, -half, 1, half * 2, 3, v.color); g.globalAlpha = 1;
      headBeam(g, half, -6);
      px(g, -half, -9, half * 2, 7, v.color); px(g, -half, -9, half * 2, 1, 'rgba(255,245,225,.32)');
      if (van) { px(g, -half + 1, roof, half * 2 - 7, 11, v.color); px(g, -half + 3, -16, 7, 5, '#c9d4d8'); px(g, -half + 12, -16, 7, 5, '#aebcc4'); px(g, -half + 21, -16, 7, 5, '#c9d4d8'); px(g, -half + 1, roof, half * 2 - 7, 1, 'rgba(255,245,225,.4)'); }
      else { px(g, -9, roof, 18, 6, v.color); px(g, -7, roof + 1, 7, 4, '#20283a'); px(g, 2, roof + 1, 6, 4, '#2b3448'); px(g, -6, roof + 1, 2, 1, '#6f7c92'); }
      [-half + 7, half - 8].forEach(x => { px(g, x - 3, -3, 7, 4, '#121016'); px(g, x - 1, -2, 3, 2, '#6d6a73'); });
      px(g, half - 1, -7, 2, 2, '#fff1c0'); px(g, -half - 1, -7, 2, 2, '#e8473a');
      g.globalAlpha = 0.3; px(g, -half - 1, 2, 2, 2, '#e8473a'); g.globalAlpha = 1;
    }
    g.restore();
  }
  function drawPerson(g, p) {
    const step = Math.floor(t * p.speed * 0.42 + p.seed) % 2, x = Math.round(p.x), y = 138, bob = step;
    g.save(); g.translate(x, y); g.scale(p.dir, 1);
    g.globalAlpha = 0.22; px(g, -4, 0, 8, 1, '#120d18'); g.globalAlpha = 1;
    px(g, -2 + step, -3, 1, 3, '#1b1824'); px(g, 1 - step, -3, 1, 3, '#1b1824');
    px(g, -2, -8 + bob, 4, 5, p.coat); px(g, -2, -8 + bob, 1, 5, 'rgba(255,240,215,.2)');
    px(g, -1, -11 + bob, 3, 3, '#6f4f40');
    px(g, 1, -14 + bob, 1, 7, '#17151f');
    ell(g, 1, -15 + bob, 7, 2, p.umbrella); px(g, -6, -14 + bob, 15, 1, p.umbrella);
    px(g, -3, -17 + bob, 5, 1, 'rgba(255,245,225,.42)');
    g.restore();
  }
  const ripples = Array.from({ length: 12 }, (_, i) => ({ x: 104 + noise(i, 21) * 432, y: 141 + noise(i, 22) * 22, period: 1.5 + noise(i, 23) * 1.8, phase: noise(i, 24) }));
  function drawRipples(g) {
    ripples.forEach(r => {
      const k = (t / r.period + r.phase) % 1, rx = 1 + k * 5;
      g.globalAlpha = 0.34 * (1 - k);
      for (let a = 0; a < 6.28; a += 0.8) px(g, r.x + Math.cos(a) * rx, r.y + Math.sin(a) * rx * 0.34, 1, 1, '#b8c4dc');
    });
    g.globalAlpha = 1;
  }

  function line(g, x0, y0, x1, y1, c) {
    const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)));
    for (let i = 0; i <= n; i++) px(g, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, 1, 1, c);
  }
  function drawClock(g) {
    const whole = Math.floor(t), snap = Math.min(1, (t - whole) * 7), sec = whole + snap, a = sec / 60 * Math.PI * 2 - Math.PI / 2;
    line(g, 606, 82, 606 + Math.cos(a) * 12, 82 + Math.sin(a) * 13.5, '#a33b2f');
    px(g, 605, 81, 3, 3, '#5f2f28'); px(g, 606, 81, 1, 1, '#d8a678');
  }
  function drawRadio(g) {
    const on = typeof Sound !== 'undefined' && Sound.radioPlaying();
    for (let i = 0; i < 6; i++) {
      const wave = Math.abs(Math.sin(t * (1.7 + i * 0.31) + i * 1.4)) * 0.6 + Math.abs(Math.sin(t * 3.1 + i * 2.2)) * 0.4;
      const h = on ? 1 + Math.round(wave * 9) : 1;
      g.globalAlpha = on ? 0.62 : 0.2; px(g, 554 + i * 3, 211 - h, 2, h, h > 7 ? '#ffd98f' : '#d88d42');
    }
    g.globalAlpha = on ? 0.72 + Math.sin(t * 2.4) * 0.18 : 0.18;
    px(g, 578, 191, 8, 2, '#ffbf68'); px(g, 580 + Math.round(Math.sin(t * 0.3) * 2), 190, 1, 4, '#fff0c8');
    g.globalAlpha = 1;
  }

  function drawWindowRain(g) {
    const panes = [[443, 31, 69, 33], [515, 31, 68, 33], [443, 67, 69, 38], [515, 67, 68, 38]];
    g.save(); g.beginPath(); panes.forEach(p => g.rect(...p)); g.clip();
    [[450, 87], [464, 94], [492, 78], [510, 90], [540, 92], [564, 96]].forEach(([x, y], i) => {
      const p = (t / (22 + i * 5) + i * 0.17) % 1;
      if (p > 0.76) { g.globalAlpha = Math.min(1, Math.min(p - 0.76, 1 - p) / 0.03) * 0.9; px(g, x, y, 3, 4, '#231f38'); }
    });
    g.globalAlpha = 0.28;
    for (let i = 0; i < 20; i++) {
      const speed = 118 + noise(i, 31) * 64, y = 26 + (t * speed + noise(i, 32) * 90) % 86, x = 440 + (noise(i, 33) * 160 - (y - 26) * 0.16);
      px(g, x, y, 1, 5, '#c5d0e4');
    }
    for (let i = 0; i < 6; i++) {
      const p = (t / (5 + noise(i, 34) * 6) + noise(i, 35)) % 1, x = 448 + noise(i, 36) * 130 + Math.sin(p * 9 + i) * 1.5, y = 30 + p * p * 78;
      g.globalAlpha = 0.16; px(g, x, y - 8, 1, 8, '#dbe7f4');
      g.globalAlpha = 0.72; px(g, x, y, 2, 2, '#dbe7f4');
    }
    g.restore(); g.globalAlpha = 1;
  }
  function wisp(g, cx, cy, height) {
    for (let n = 0; n < 4; n++) {
      const k = (t * 0.32 + n / 4) % 1, size = 1 + Math.floor(k * 3);
      g.globalAlpha = 0.2 * Math.sin(k * Math.PI);
      px(g, cx + Math.sin(k * 5.2 + n * 1.7) * (1 + k * 5), cy - k * height, size, size, '#f2e8d8');
    }
    g.globalAlpha = 1;
  }

  const dust = { [LEFT]: [], [FRONT]: [], [RIGHT]: [] };
  [LEFT, FRONT, RIGHT].forEach((v, nv) => {
    const lamps = v === FRONT ? [214, 424] : v === LEFT ? [190, 400] : [230, 440];
    for (let i = 0; i < 20; i++) dust[v].push({ x: lamps[i % 2] + (noise(i, 40 + nv) - 0.5) * 150, y: 60 + noise(i, 50 + nv) * 145, seed: noise(i, 60 + nv) * 6.28, speed: 2.5 + noise(i, 70 + nv) * 4 });
  });
  function drawDust(g, v) {
    dust[v].forEach(d => {
      const y = 58 + (d.y - 58 - t * d.speed + 1500) % 150, edge = Math.min(1, Math.min(y - 58, 208 - y) / 24);
      g.globalAlpha = Math.max(0, (0.13 + 0.17 * (0.5 + 0.5 * Math.sin(t * 0.8 + d.seed))) * edge);
      px(g, d.x + Math.sin(t * 0.34 + d.seed) * 9, y, 1, 1, '#ffe9bd');
    });
    g.globalAlpha = 1;
  }
  function drawMoths(g) {
    [[214, 88, 0.2], [424, 88, 2.4]].forEach(([cx, cy, p]) => {
      const x = cx + Math.cos(t * 1.25 + p) * 15 + Math.sin(t * 0.47 + p) * 5, y = cy + Math.sin(t * 1.9 + p) * 5 + Math.sin(t * 0.61) * 2, flap = Math.floor(t * 13 + p) % 2;
      g.globalAlpha = 0.8; px(g, x, y, 1, 1, '#6d5a48');
      px(g, x - 1 - flap, y - (flap ? 0 : 1), 1 + flap, 1, '#eadcc2'); px(g, x + 1, y - (flap ? 0 : 1), 1 + flap, 1, '#eadcc2');
    });
    g.globalAlpha = 1;
  }
  function drawDrip(g, w) {
    if (w.tapOn) return;
    const surface = w.potInSink ? POT_IN_SINK[1] + 3 : w.wokInSink ? 250 : w.sinkWater > 0.02 ? 252 : 256, p = (t % 5.4) / 5.4, x = 111;
    if (p < 0.72) { const grow = Math.floor(p / 0.72 * 3); px(g, x, 198, 2, 1 + grow, '#8fd2e6'); px(g, x, 198, 1, 1, '#e8fbff'); }
    else if (p < 0.8) { const k = (p - 0.72) / 0.08, y = 199 + (surface - 199) * k * k; px(g, x, y, 2, 3, '#a9e2ef'); px(g, x, y, 1, 1, '#f1fdff'); }
    else {
      const k = (p - 0.8) / 0.2, rx = 2 + k * 9;
      g.globalAlpha = 0.65 * (1 - k);
      for (let a = 0; a < 6.28; a += 0.45) px(g, x + Math.cos(a) * rx, surface + Math.sin(a) * rx * 0.34, 1, 1, '#e8fbff');
      g.globalAlpha = 1;
    }
  }
  function drawGlints(g, isAway) {
    [['kecap', 495, 62, 0], ['minyak', 528, 62, 3.1], ['garam', 559, 82, 6.2]].forEach(([id, x, y, delay]) => {
      if (isAway(id)) return;
      const k = ((t + delay) % 9.3) / 1.1;
      if (k >= 1) return;
      g.globalAlpha = 0.6 * Math.sin(k * Math.PI);
      px(g, x, y + k * 26, 1, 7, '#fff7df'); px(g, x + 1, y + k * 26 + 2, 1, 3, '#fff7df');
    });
    g.globalAlpha = 1;
  }

  return {
    update(dt) {
      const lastSecond = Math.floor(t);
      t += dt;
      const now = info();
      if (Math.floor(t) !== lastSecond && now.view === FRONT) sfx('clockTick', Math.floor(t) % 2);
      const dripP = (t % 5.4) / 5.4;
      if (lastDrip < 0.8 && dripP >= 0.8 && now.view === RIGHT && !now.world.tapOn) sfx('dripPlink', 1);
      lastDrip = dripP;
      flameL += ((now.world.flameL > 0 ? 1 : 0) - flameL) * Math.min(1, dt * 7);
      flameR += ((now.world.flameR > 0 ? 1 : 0) - flameR) * Math.min(1, dt * 7);
      lanes.forEach(lane => {
        lane.list.forEach(v => { v.x += lane.dir * lane.speed * dt; });
        lane.list = lane.list.filter(v => v.x > 40 && v.x < 600);
        lane.wait -= dt;
        if (lane.wait <= 0) {
          const roll = Math.random(), kind = roll < 0.42 ? 'bike' : roll < 0.8 ? 'car' : 'van';
          lane.list.push({ kind, x: lane.dir > 0 ? 44 : 596, color: kind === 'van' ? '#3f7f78' : COLORS[Math.floor(Math.random() * COLORS.length)] });
          if (now.view === FRONT) sfx('carPass', { kind, dir: lane.dir, dur: 552 / lane.speed, level: lane.y > 160 ? 1 : 0.72 });
          lane.wait = 4.5 + Math.random() * 8;
        }
      });
      people.forEach(p => { p.x += p.dir * p.speed * dt; });
      for (let i = people.length - 1; i >= 0; i--) if (people[i].x < 70 || people[i].x > 570) people.splice(i, 1);
      personWait -= dt;
      if (personWait <= 0) {
        personWait = 5 + Math.random() * 9;
        if (people.length < 4) {
          const dir = Math.random() < 0.5 ? 1 : -1;
          people.push({ x: dir > 0 ? 74 : 566, dir, speed: 10 + Math.random() * 6, seed: Math.random() * 4, coat: ['#3a3648', '#59453c', '#34493a', '#6c3429'][Math.floor(Math.random() * 4)], umbrella: ['#a83c32', '#31556a', '#c49c47', '#3f7f78', '#d8cfb4'][Math.floor(Math.random() * 5)] });
        }
      }
    },
    street(g) {
      drawSky(g); drawCity(g); people.forEach(p => drawPerson(g, p)); drawRipples(g);
      lanes.forEach(lane => lane.list.forEach(v => drawVehicle(g, v, lane)));
    },
    room(g, v) {
      if (v === FRONT) {
        hangs.forEach(h => drawHang(g, h));
        foliage(g, rooms[FRONT], 190, 234, 34, 17, 1.4, 1.1, 0.4);
        foliage(g, rooms[FRONT], 596, 174, 44, 25, 1.6, 0.92, 1.8);
        drawClock(g); drawRadio(g);
      }
      if (v === LEFT) {
        drawWindowRain(g);
        foliage(g, rooms[LEFT], 458, 83, 26, 14, 1.2, 1, 0.6);
        g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.16 + Math.sin(t * 1.15) * 0.025 + Math.sin(t * 6.3) * 0.008;
        g.drawImage(leftGlow, 0, 0);
        g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      }
      if (v === RIGHT && (flameL > 0.01 || flameR > 0.01)) {
        const flick = n => 0.3 + Math.sin(t * 9.1 + n) * 0.035 + Math.sin(t * 15.7 + n * 2) * 0.025;
        g.globalCompositeOperation = 'lighter';
        if (flameL > 0.01) { g.globalAlpha = flameL * flick(0); g.drawImage(flameLeftGlow, 0, 0); }
        if (flameR > 0.01) { g.globalAlpha = flameR * flick(1.4); g.drawImage(flameRightGlow, 0, 0); }
        g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      }
    },
    air(g, v) {
      const now = info();
      if (v === LEFT && !now.world.riceOpen && now.riceLid <= 0) wisp(g, 62, 208, 26);
      if (v === FRONT) drawMoths(g);
      if (v === RIGHT) { drawDrip(g, now.world); drawGlints(g, now.away); }
      drawDust(g, v);
    },
    drawCloth, utensilSway,
  };
}
