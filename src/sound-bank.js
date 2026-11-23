// Bank suara buatan sendiri: setiap suara dirakit dari model fisik sederhana, tanpa file audio.
// Fungsi di sini menggantikan versi lama dengan nama sama, atau menambah suara baru.

function makeSoundBank(k) {
  const { c, out, wet, tone, hiss, modal, ceramic, glass, iron, steel, wood, soft, coin, pluck, rnd } = k;
  const SEATS = [-0.55, -0.2, 0.2, 0.55];

  // Keluaran stereo: benda di kiri terdengar di kiri, di kanan terdengar di kanan.
  const panned = x => {
    if (!c.createStereoPanner) return out;
    const p = c.createStereoPanner(); p.pan.value = x; p.connect(out);
    return p;
  };
  // Gelembung air: nada naik cepat lalu hilang, seperti gelembung sungguhan.
  const bubble = (t, v = 0.03, f = 620, dest = out, send = 0.1) => {
    const d = rnd(0.018, 0.05) * (620 / f) ** 0.5 + 0.012;
    tone(t, f, f * rnd(1.25, 1.6), v, d, 'sine', send, 0.0015, dest);
  };
  const bubbles = (t, n, span, v, low, high, dest = out) => {
    for (let i = 0; i < n; i++) bubble(t + Math.random() ** 1.4 * span, v * rnd(0.45, 1), rnd(low, high), dest);
  };
  const crackle = (t, n, span, v, dest = out) => {
    for (let i = 0; i < n; i++) { const f = rnd(1300, 3400); tone(t + Math.random() * span, f, f * 0.7, v * 0.36 * rnd(0.3, 1), rnd(0.005, 0.014), 'sine', 0.04, 0.001, dest); }
  };
  const scuff = (t, v, f = 520, dest = out) => {
    hiss(t, 'brown', 'bandpass', f, f * 0.62, 1.1, v, 0.05, 0.05, 0.004, dest);
    hiss(t + 0.012, 'pink', 'highpass', 1700, 0, 0.6, v * 0.14, 0.03, 0, 0.003, dest);
  };
  const step = (t, v, dest = out) => { tone(t, 112, 62, v, 0.055, 'sine', 0.05, 0.003, dest); scuff(t + 0.006, v * 0.75, 460, dest); };
  // Benda keramik yang bergetar sebentar sebelum diam di meja.
  const settle = (t, v, p, hit) => {
    let at = t, gap = 0.052, level = v;
    for (let i = 0; i < 4; i++) { hit(at, level, p * rnd(0.985, 1.015)); at += gap; gap *= 0.68; level *= 0.48; }
  };
  const bell = (t, f, v, d, dest = out, send = 0.4) => {
    [[1, 1], [2.42, 0.42], [3.86, 0.22], [5.61, 0.11], [7.43, 0.05]].forEach(([r, a], i) => {
      tone(t, f * r, 0, v * a, d / (1 + i * 0.6), 'sine', send, 0.0012, dest);
      tone(t, f * r * 1.0042, 0, v * a * 0.55, d / (1 + i * 0.7), 'sine', send, 0.0012, dest);
    });
    hiss(t, 'white', 'highpass', 6200, 0, 0.7, v * 0.28, 0.006, 0, 0.001, dest);
  };

  const S = {
    // --- Potong dan bahan ---
    chop: (t, p) => {
      hiss(t, 'white', 'highpass', 5200, 0, 0.8, 0.04, 0.008, 0, 0.001);
      tone(t, 182 * p, 92, 0.2, 0.075, 'sine', 0.05, 0.0015);
      [[372, 0.055, 0.04], [811, 0.028, 0.026], [1490, 0.012, 0.016]].forEach(([f, v, d]) => tone(t + 0.001, f * p, f * p * 0.96, v, d, 'sine', 0.08, 0.001));
      hiss(t, 'pink', 'bandpass', 1050 * p, 620, 1.2, 0.09, 0.022, 0.04, 0.001);
      crackle(t + 0.004, 3, 0.022, 0.018);
    },
    chopSoft: (t, p) => {
      tone(t, 225 * p, 128, 0.07, 0.042, 'sine', 0.04, 0.0015);
      hiss(t, 'pink', 'bandpass', 1500 * p, 900, 1, 0.045, 0.018, 0, 0.001);
    },
    slice: (t, p) => {
      hiss(t, 'white', 'bandpass', 2300 * p, 6200 * p, 3, 0.05, 0.09, 0.03, 0.012);
      crackle(t + 0.012, 4, 0.06, 0.012);
      tone(t + 0.078, 240 * p, 150, 0.035, 0.03, 'sine', 0, 0.0015);
    },
    eggCrack: (t, p) => {
      [0, 0.013, 0.031, 0.04, 0.062].forEach((o, i) => hiss(t + o, 'white', 'bandpass', rnd(2400, 5200), 0, 4.5, 0.075 - i * 0.008, rnd(0.004, 0.009), 0.02, 0.001));
      tone(t, 620 * p, 340, 0.035, 0.018, 'sine', 0, 0.001);
      hiss(t + 0.09, 'pink', 'bandpass', 900, 520, 1.1, 0.03, 0.05, 0, 0.012);
      tone(t + 0.14, 170 * p, 330 * p, 0.075, 0.075, 'sine', 0.08, 0.008);
      bubble(t + 0.19, 0.03, 460 * p);
    },
    // --- Wajan dan panci ---
    wokDrop: (t, p) => {
      iron(t, 0.032, p);
      hiss(t + 0.008, 'white', 'highpass', 4600, 2600, 0.7, 0.075, 0.46, 0.06, 0.006);
      hiss(t + 0.01, 'white', 'bandpass', 2400, 1500, 0.8, 0.035, 0.26, 0.04, 0.012);
      crackle(t + 0.012, 20, 0.5, 0.05);
    },
    potDrop: (t, p) => {
      tone(t, 150 * p, 90, 0.09, 0.06, 'sine', 0.1, 0.002);
      hiss(t, 'pink', 'bandpass', 1900, 620, 0.9, 0.1, 0.13, 0.16, 0.002);
      hiss(t + 0.02, 'white', 'highpass', 3400, 0, 0.6, 0.016, 0.1, 0.1, 0.006);
      bubbles(t + 0.04, 9, 0.24, 0.042, 300, 1150);
    },
    boil: (t, p) => { bubbles(t, 18, 0.65, 0.04, 240 * p, 980 * p); hiss(t, 'brown', 'bandpass', 360, 460, 0.8, 0.08, 0.5, 0.08, 0.12); },
    wokToss: (t, p) => {
      hiss(t, 'pink', 'bandpass', 420, 2100, 0.9, 0.05, 0.14, 0.04, 0.02);
      iron(t + 0.012, 0.022, p);
      soft(t + 0.2, 0.06, p);
      hiss(t + 0.205, 'white', 'highpass', 4100, 2800, 0.7, 0.03, 0.3, 0.05, 0.006);
      crackle(t + 0.21, 10, 0.26, 0.026);
    },
    flipUp: (t, p) => { hiss(t, 'pink', 'bandpass', 620, 2500, 1, 0.055, 0.1, 0.03, 0.012); tone(t, 1180 * p, 720, 0.012, 0.03); },
    fritterLand: (t, p) => { soft(t, 0.075, p); hiss(t + 0.008, 'white', 'highpass', 4400, 2900, 0.7, 0.045, 0.2, 0.04, 0.004); crackle(t + 0.012, 8, 0.2, 0.03); },
    spatulaScoop: (t, p) => { hiss(t, 'white', 'bandpass', 2200, 1100, 2.4, 0.05, 0.06, 0.02, 0.006); modal(t + 0.045, [1240, 2730, 4310], 0.016, 0.07, 0.1, p); },
    foodReady: (t, p) => { pluck(t, 79, 0.021, 0.38, 0.3); pluck(t + 0.075, 84, 0.024, 0.55, 0.34); },
    foodBurning: (t, p) => { crackle(t, 18, 0.5, 0.05); hiss(t, 'pink', 'highpass', 1800, 3600, 0.6, 0.035, 0.42, 0.05, 0.05); tone(t + 0.02, 240, 190, 0.012, 0.3, 'triangle', 0.1, 0.02); },
    ladleScoop: (t, p) => { hiss(t, 'pink', 'bandpass', 1200, 2600, 1, 0.05, 0.09, 0.1, 0.008); bubbles(t + 0.015, 5, 0.09, 0.04, 380, 1050); modal(t, [1740, 3610], 0.008, 0.08, 0.1, p); },

    // --- Air dan wastafel ---
    tapOn: (t, p) => { modal(t, [840, 1910, 3210], 0.024, 0.06, 0.08, p); hiss(t + 0.025, 'white', 'bandpass', 760, 2500, 0.8, 0.05, 0.13, 0.1, 0.02); bubbles(t + 0.04, 5, 0.12, 0.026, 500, 1300); },
    tapOff: (t, p) => { modal(t, [720, 1530, 2760], 0.03, 0.07, 0.08, p); [0.17, 0.38, 0.72].forEach((o, i) => bubble(t + o, 0.038 - i * 0.008, rnd(780, 1120) * p)); },
    plugOut: (t, p) => { tone(t, 160 * p, 680 * p, 0.09, 0.055, 'sine', 0.05, 0.002); bubbles(t + 0.05, 6, 0.3, 0.036, 240, 620); },
    potFull: (t, p) => { tone(t, 620 * p, 1120 * p, 0.018, 0.11, 'sine', 0.16); bubbles(t + 0.06, 4, 0.1, 0.018, 800, 1400); modal(t + 0.13, [1040, 2290], 0.01, 0.16, 0.18, p); },
    potEmpty: (t, p) => { bubbles(t, 7, 0.32, 0.038, 340, 1000); [0.34, 0.5].forEach((o, i) => bubble(t + o, 0.022 - i * 0.006, 1300)); steel(t + 0.3, 0.014, p); },
    overflow: (t, p) => { hiss(t, 'pink', 'bandpass', 760, 2200, 0.8, 0.075, 0.34, 0.14, 0.04); bubbles(t + 0.03, 12, 0.34, 0.034, 340, 1200); },
    dripPlink: (t, p, level = 1) => {
      const v = (level || 1) * 0.032, f = rnd(1050, 1500);
      tone(t, f * 0.72, f * 1.22, v, 0.042, 'sine', 0.42, 0.0012);
      tone(t + 0.024, f * 1.48, f * 1.9, v * 0.32, 0.022, 'sine', 0.42, 0.001);
    },

    // --- Peralatan dapur ---
    gasOn: (t, p) => {
      [0, 0.07, 0.14].forEach((o, i) => { hiss(t + o, 'white', 'bandpass', 3700, 0, 6, 0.085, 0.005, 0.03, 0.001); modal(t + o, [1120], 0.009, 0.018, 0, p * (1 + i * 0.02)); });
      hiss(t + 0.17, 'brown', 'lowpass', 300, 720, 0.8, 0.21, 0.12, 0.06, 0.012);
      hiss(t + 0.18, 'pink', 'bandpass', 620, 980, 0.6, 0.1, 0.34, 0.05, 0.05);
    },
    gasOff: (t, p) => { modal(t, [940, 1800], 0.02, 0.03, 0, p); hiss(t + 0.01, 'pink', 'bandpass', 900, 220, 0.8, 0.055, 0.15, 0.04, 0.004); tone(t + 0.015, 95, 58, 0.035, 0.07); },
    switch: (t, p) => { hiss(t, 'white', 'bandpass', 4200, 0, 3, 0.05, 0.004, 0, 0.001); tone(t, 1500 * p, 760, 0.016, 0.01, 'triangle', 0, 0.001); tone(t + 0.022, 980 * p, 540, 0.012, 0.012, 'triangle', 0.04, 0.001); },
    riceLidOpen: (t, p) => { modal(t, [1460, 2380], 0.012, 0.05, 0.1, p); hiss(t + 0.02, 'white', 'highpass', 3700, 1500, 0.7, 0.045, 0.52, 0.12, 0.05); steel(t + 0.05, 0.016, p * 1.5); },
    riceLidClose: (t, p) => { steel(t, 0.04, p * 1.25); soft(t, 0.055, p); modal(t + 0.055, [2140], 0.012, 0.03, 0.05, p); },
    riceTick: (t, p, level = 1) => { hiss(t, 'white', 'bandpass', 2600, 0, 4, 0.036 * (level || 1), 0.004, 0.2, 0.001); tone(t + 0.003, 720, 420, 0.016 * (level || 1), 0.012, 'triangle', 0.2, 0.001); },
    fridgeOpen: (t, p) => {
      hiss(t, 'brown', 'bandpass', 260, 760, 2.4, 0.16, 0.055, 0.04, 0.005);
      tone(t + 0.03, 92, 160, 0.05, 0.06, 'sine', 0.05, 0.004);
      hiss(t + 0.05, 'white', 'lowpass', 2200, 680, 0.6, 0.042, 0.55, 0.16, 0.08);
      modal(t + 0.035, [410, 930], 0.009, 0.1, 0.1, p);
    },
    cabinetOpen: (t, p) => {
      wood(t, 0.06, p * 0.82);
      for (let i = 0; i < 5; i++) tone(t + 0.03 + i * 0.022, (680 + i * 34) * p, 0, 0.0032, 0.012, 'triangle', 0.14, 0.003);
      wood(t + 0.16, 0.028, p * 0.68);
    },
    binOpen: (t, p) => { modal(t, [940, 2160], 0.016, 0.08, 0.1, p); hiss(t, 'pink', 'bandpass', 1100, 2100, 0.8, 0.024, 0.08, 0.04, 0.012); },
    binClose: (t, p) => { steel(t, 0.05, p * 1.1); tone(t, 100, 58, 0.075, 0.07); soft(t + 0.07, 0.016, p * 1.3); },
    trash: (t, p) => { hiss(t, 'pink', 'bandpass', 640, 260, 0.8, 0.08, 0.13, 0.1, 0.008); tone(t + 0.09, 110 * p, 58, 0.08, 0.09); crackle(t + 0.09, 6, 0.09, 0.02); },

    // --- Keramik, kaca, kayu ---
    plateDown: (t, p) => { wood(t, 0.045, p); settle(t + 0.002, 0.07, p * 0.94, ceramic); },
    ceramicDown: (t, p) => { wood(t, 0.04, p); settle(t + 0.002, 0.06, p * 0.8, ceramic); },
    glassDown: (t, p) => { soft(t, 0.024, p * 1.4); settle(t + 0.001, 0.04, p, glass); },
    plateSlide: (t, p) => { hiss(t, 'pink', 'bandpass', 1500, 720, 1.3, 0.085, 0.26, 0.04, 0.02); settle(t + 0.22, 0.042, p, ceramic); },
    drawerOpen: (t, p) => {
      for (let i = 0; i < 7; i++) tone(t + i * 0.024, rnd(120, 180) * p, 90, 0.022, 0.018, 'triangle', 0.03, 0.002);
      hiss(t, 'brown', 'bandpass', 420, 760, 1.2, 0.11, 0.17, 0.05, 0.02);
      wood(t + 0.17, 0.05, p * 0.86);
      [0, 0.024, 0.052].forEach(o => coin(t + 0.17 + o, 0.01, p * rnd(0.96, 1.05)));
    },
    drawerClose: (t, p) => {
      for (let i = 0; i < 5; i++) tone(t + i * 0.022, rnd(130, 190) * p, 90, 0.022, 0.018, 'triangle', 0.03, 0.002);
      hiss(t, 'brown', 'bandpass', 720, 380, 1.2, 0.1, 0.12, 0.05, 0.012);
      wood(t + 0.115, 0.07, p * 0.7);
      [0.125, 0.15].forEach(o => coin(t + o, 0.009, p * rnd(0.96, 1.05)));
    },
    coinsDown: (t, p) => { let at = t; for (let i = 0; i < 7; i++) { coin(at, 0.018 * 0.86 ** i, p * rnd(0.9, 1.12)); at += rnd(0.024, 0.05) * 0.92 ** i; } },
    page: (t, p) => {
      hiss(t, 'pink', 'bandpass', 1300, 3900, 0.8, 0.045, 0.12, 0.05, 0.03);
      hiss(t + 0.075, 'white', 'bandpass', 3100, 5200, 1.3, 0.018, 0.05, 0.03, 0.006);
      hiss(t + 0.14, 'pink', 'lowpass', 1200, 420, 0.7, 0.03, 0.05, 0.04, 0.004);
    },
    orderBell: t => { bell(t, 1976, 0.043, 0.95); bell(t + 0.145, 1976, 0.02, 0.62); },
    doorChime: t => {
      hiss(t, 'pink', 'bandpass', 520, 340, 1, 0.022, 0.25, 0.1, 0.05);
      [1760, 2093, 2349, 2637, 3136].forEach((f, i) => bell(t + 0.03 + i * rnd(0.055, 0.095), f, 0.013, 1.1, out, 0.6));
    },

    // --- Gerak pemain ---
    turnView: (t, p, dir = 0) => {
      const dest = panned((dir || 0) * 0.34);
      hiss(t, 'pink', 'bandpass', 360, 900, 0.8, 0.032, 0.17, 0.05, 0.05, dest);
      step(t + 0.055, 0.03, dest);
      scuff(t + 0.13, 0.025, 640, dest);
    },

    // --- Pelanggan (arg = nomor kursi) ---
    guestArrive: (t, p, seat = 0) => {
      const dest = panned(SEATS[seat] || 0);
      [0, 0.34, 0.66].forEach((o, i) => step(t + o, 0.02 + i * 0.01, dest));
      hiss(t + 0.82, 'brown', 'bandpass', 520, 300, 2, 0.04, 0.12, 0.08, 0.018, dest);
      wood(t + 0.95, 0.02, 0.8);
    },
    guestLeave: (t, p, seat = 0) => {
      const dest = panned(SEATS[seat] || 0);
      hiss(t, 'brown', 'bandpass', 300, 560, 2, 0.075, 0.13, 0.08, 0.018, dest);
      [0.28, 0.6, 0.93, 1.24].forEach((o, i) => step(t + o, 0.03 - i * 0.006, dest));
    },
    eatSpoon: (t, p, seat = 0) => {
      const dest = panned(SEATS[seat] || 0), f = rnd(0.92, 1.1);
      modal(t, [1510 * f, 3260 * f, 5040 * f], 0.017, 0.055, 0.2, 1, dest);
      if (Math.random() < 0.55) modal(t + rnd(0.09, 0.17), [1660 * f, 3480 * f], 0.011, 0.045, 0.2, 1, dest);
      hiss(t + 0.012, 'pink', 'bandpass', 1500, 900, 1.4, 0.008, 0.035, 0.05, 0.004, dest);
    },
    eatSip: (t, p, seat = 0) => {
      const dest = panned(SEATS[seat] || 0);
      modal(t, [2460, 5100], 0.005, 0.05, 0.2, 1, dest);
      hiss(t + 0.1, 'white', 'bandpass', 2100, 3400, 3, 0.012, 0.14, 0.08, 0.02, dest);
      bubble(t + 0.27, 0.01, 520, dest);
      glass(t + 0.48, 0.008, 1);
    },
    eatDone: (t, p, seat = 0) => {
      const dest = panned(SEATS[seat] || 0);
      modal(t, [1320, 2940, 4620], 0.018, 0.1, 0.22, 1, dest);
      modal(t + 0.05, [1420, 3100], 0.008, 0.06, 0.2, 1, dest);
    },

    // --- Suasana luar dan ruangan ---
    clockTick: (t, p, alt = 0) => {
      const f = alt ? 2380 : 2120;
      hiss(t, 'white', 'bandpass', f, 0, 7, 0.03, 0.0035, 0.16, 0.001);
      tone(t, f * 0.42, f * 0.3, 0.011, 0.009, 'triangle', 0.16, 0.001);
    },
    rainTick: (t, p, x = 0) => {
      const dest = panned(x || 0), f = rnd(1900, 4200);
      tone(t, f, f * 0.92, rnd(0.004, 0.012), rnd(0.008, 0.02), 'sine', 0.4, 0.001, dest);
    },
    gutterDrop: (t, p, x = 0) => {
      const dest = panned(x || 0), f = rnd(420, 780);
      tone(t, f, f * 1.45, 0.018, 0.05, 'sine', 0.5, 0.002, dest);
      tone(t + 0.008, f * 2.64, f * 2.2, 0.0064, 0.022, 'sine', 0.5, 0.001, dest);
    },
    carPass: (t, p, o) => {
      const car = o || { kind: 'car', dir: 1, dur: 8, level: 1 }, dur = car.dur || 8, level = car.level || 1;
      const start = (car.dir || 1) * -0.9, end = (car.dir || 1) * 0.9, bike = car.kind === 'bike', van = car.kind === 'van';
      const master = c.createGain(), lp = c.createBiquadFilter(), pan = c.createStereoPanner ? c.createStereoPanner() : null;
      const peak = (bike ? 0.056 : van ? 0.072 : 0.064) * level, mid = t + dur * 0.5, stop = t + dur;
      master.gain.setValueAtTime(0.0001, t);
      master.gain.exponentialRampToValueAtTime(peak, mid);
      master.gain.exponentialRampToValueAtTime(0.0001, stop);
      lp.type = 'lowpass'; lp.Q.value = 0.5;
      lp.frequency.setValueAtTime(520, t); lp.frequency.exponentialRampToValueAtTime(2200, mid); lp.frequency.exponentialRampToValueAtTime(420, stop);
      master.connect(lp);
      if (pan) { pan.pan.setValueAtTime(start, t); pan.pan.linearRampToValueAtTime(end, stop); lp.connect(pan); pan.connect(out); } else lp.connect(out);
      hiss(t, 'white', 'bandpass', 2600, 0, 0.5, 0.14, dur, 0, dur * 0.45, master);
      hiss(t, 'brown', 'lowpass', bike ? 520 : 230, 0, 0.7, bike ? 0.36 : 0.62, dur, 0, dur * 0.45, master);
      const base = bike ? 96 : van ? 58 : 66, high = base * 1.05, low = base * 0.93;
      [[1, 'sawtooth', bike ? 0.075 : 0.05], [2.02, 'triangle', bike ? 0.05 : 0.022]].forEach(([r, type, v]) => {
        const e = c.createOscillator(), g = c.createGain();
        e.type = type; e.frequency.setValueAtTime(high * r, t); e.frequency.setValueAtTime(high * r, mid - 0.25); e.frequency.exponentialRampToValueAtTime(low * r, mid + 0.25);
        g.gain.setValueAtTime(v, t); e.connect(g); g.connect(master); e.start(t); e.stop(stop + 0.02);
      });
    },
    vendorTek: (t, p, x = 0.5) => {
      // Pedagang keliling mengetuk wajan dari kejauhan.
      const dest = panned(x || 0), hit = (at, f, v) => { tone(at, f, f * 0.94, v, 0.05, 'sine', 0.85, 0.001, dest); tone(at, f * 2.3, f * 2.1, v * 0.34, 0.02, 'sine', 0.85, 0.001, dest); };
      for (let round = 0; round < 3; round++) {
        const at = t + round * 1.45, fade = 1 - round * 0.18;
        [[0, 780, 0.018], [0.2, 780, 0.014], [0.4, 610, 0.019], [0.72, 780, 0.014], [0.86, 610, 0.016]].forEach(([o, f, v]) => hit(at + o, f, v * fade));
      }
    },
    vendorTing: (t, p, x = -0.5) => {
      // Pedagang bakso mengetuk mangkuk dengan sendok.
      const dest = panned(x || 0);
      for (let round = 0; round < 3; round++) [0, 0.22, 0.44, 0.66].forEach((o, i) => bell(t + round * 1.25 + o, i === 3 ? 2093 : 2349, 0.0052 * (1 - round * 0.16), 0.26, dest, 0.85));
    },
    thunder: (t, p, x = 0) => {
      const dest = panned(x || 0);
      hiss(t, 'brown', 'lowpass', 150, 62, 0.7, 0.062, 3.4, 0.5, 0.42, dest);
      hiss(t + 0.32, 'brown', 'bandpass', 110, 58, 0.8, 0.04, 2.2, 0.5, 0.2, dest);
      hiss(t + 1.1, 'pink', 'lowpass', 220, 80, 0.6, 0.018, 1.6, 0.5, 0.3, dest);
    },
  };
  // Desain ulang suara dapur: lembut, hangat, dan nyaman didengar lama.
  Object.assign(S, {
    wokDrop: (t, p) => {
      soft(t, 0.06, p); iron(t + 0.004, 0.012, p);
      hiss(t + 0.012, 'brown', 'lowpass', 520, 220, 0.7, 0.07, 0.26, 0.05, 0.03);
      crackle(t + 0.05, 4, 0.34, 0.035);
    },
    wokToss: (t, p) => {
      hiss(t, 'pink', 'bandpass', 360, 1050, 0.8, 0.04, 0.15, 0.03, 0.03);
      iron(t + 0.012, 0.01, p); soft(t + 0.2, 0.052, p);
      hiss(t + 0.205, 'brown', 'lowpass', 460, 220, 0.7, 0.04, 0.2, 0.04, 0.02);
      crackle(t + 0.22, 3, 0.2, 0.03);
    },
    fritterLand: (t, p) => { soft(t, 0.07, p); hiss(t + 0.008, 'brown', 'lowpass', 480, 220, 0.7, 0.04, 0.16, 0.04, 0.012); crackle(t + 0.03, 2, 0.14, 0.03); },
    foodReady: (t, p) => { pluck(t, 76, 0.018, 0.4, 0.34); pluck(t + 0.09, 81, 0.021, 0.62, 0.38); },
    foodBurning: (t, p) => { crackle(t, 14, 0.55, 0.06); hiss(t, 'pink', 'bandpass', 1500, 2300, 0.7, 0.03, 0.45, 0.05, 0.06); tone(t + 0.02, 196, 174, 0.012, 0.34, 'triangle', 0.1, 0.03); },
    gasOn: (t, p) => {
      [0, 0.1].forEach(o => { tone(t + o, 1050 * p, 720, 0.012, 0.007, 'triangle', 0.03, 0.001); hiss(t + o, 'pink', 'bandpass', 1800, 0, 2, 0.022, 0.005, 0, 0.001); });
      hiss(t + 0.17, 'brown', 'lowpass', 240, 560, 0.7, 0.2, 0.24, 0.08, 0.035);
      tone(t + 0.17, 76, 118, 0.05, 0.2, 'sine', 0.05, 0.03);
    },
    gasOff: (t, p) => { tone(t, 900 * p, 620, 0.009, 0.008, 'triangle', 0, 0.001); hiss(t + 0.008, 'brown', 'lowpass', 480, 180, 0.7, 0.1, 0.18, 0.04, 0.008); },
    radioClick: (t, p) => { tone(t, 920, 520, 0.018, 0.012, 'triangle', 0.08, 0.001); tone(t + 0.035, 610, 420, 0.012, 0.014, 'triangle', 0.08, 0.001); },
    radioTune: (t, p) => {
      S.radioClick(t, p);
      hiss(t + 0.03, 'pink', 'bandpass', 760, 1900, 2.2, 0.024, 0.34, 0.08, 0.05);
      hiss(t + 0.42, 'pink', 'bandpass', 1900, 900, 2.2, 0.018, 0.32, 0.08, 0.03);
      tone(t + 0.26, 660, 880, 0.004, 0.22, 'sine', 0.2, 0.05);
    },
  });
  // Tiap pisau punya bunyi potong sendiri.
  Object.assign(S, {
    chopHeavy: (t, p) => {
      tone(t, 128 * p, 66, 0.25, 0.1, 'sine', 0.06, 0.002);
      [[286, 0.06, 0.05], [640, 0.022, 0.03]].forEach(([f, v, d]) => tone(t + 0.001, f * p, f * p * 0.94, v, d, 'sine', 0.08, 0.001));
      hiss(t, 'pink', 'bandpass', 760 * p, 430, 1.1, 0.1, 0.03, 0.04, 0.001);
    },
    chopFine: (t, p) => {
      tone(t, 236 * p, 136, 0.09, 0.04, 'sine', 0.04, 0.0015);
      hiss(t, 'pink', 'bandpass', 2100 * p, 3200, 2.2, 0.035, 0.035, 0.03, 0.004);
      tone(t + 0.012, 1640 * p, 1420, 0.006, 0.03, 'sine', 0.12, 0.002);
    },
    chopCrisp: (t, p) => {
      tone(t, 206 * p, 118, 0.13, 0.05, 'sine', 0.05, 0.0015);
      [[520, 0.04, 0.026], [1120, 0.018, 0.016]].forEach(([f, v, d]) => tone(t + 0.001, f * p, f * p * 0.95, v, d, 'sine', 0.06, 0.001));
      crackle(t + 0.003, 4, 0.024, 0.03);
    },
  });
  return { S, bubble };
}
