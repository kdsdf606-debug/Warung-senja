// Semua suara Warung Senja dibuat dari sintesis: tidak ada file audio atau sound pack.

const Sound = (() => {
  const SAVE = 'warung-senja-audio';
  const volumes = { music: 0.6, sfx: 1, radio: 0 };
  try { Object.assign(volumes, JSON.parse(localStorage.getItem(SAVE)) || {}); } catch (e) { /* pakai bawaan */ }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const mtof = m => 440 * 2 ** ((m - 69) / 12);

  // Kit suara bisa dipakai saat bermain dan saat diuji secara offline.
  function makeKit(c, out, wet) {
    const sr = c.sampleRate;
    const fill = (sec, fn) => { const b = c.createBuffer(1, Math.floor(sr * sec), sr), d = b.getChannelData(0); fn(d); return b; };
    const white = fill(2, d => { let soft = 0; for (let i = 0; i < d.length; i++) { soft += ((Math.random() * 2 - 1) - soft) * 0.52; d[i] = soft * 1.45; } });
    const pink = fill(3, d => { let a = 0, b = 0, e = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; a = 0.99765 * a + w * 0.099; b = 0.963 * b + w * 0.2965; e = 0.57 * e + w * 1.0527; d[i] = (a + b + e + w * 0.1848) * 0.2; } });
    const brown = fill(3, d => { let l = 0; for (let i = 0; i < d.length; i++) { l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; } });
    const NOISE = { white, pink, brown };
    const amp = (t, v, a, d, send = 0, dest = out) => {
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
      g.connect(dest);
      if (send && wet) { const s = c.createGain(); s.gain.value = send; g.connect(s); s.connect(wet); }
      return g;
    };
    const tone = (t, f, to, v, d, type = 'sine', send = 0, a = 0.004, dest = out) => {
      const o = c.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f, t);
      if (to && to !== f) o.frequency.exponentialRampToValueAtTime(to, t + a + d);
      o.connect(amp(t, v, a, d, send, dest)); o.start(t); o.stop(t + a + d + 0.03);
    };
    const hiss = (t, kind, ftype0, f0, to0, q0, v, d, send = 0, a = 0.003, dest = out) => {
      // Desis tinggi diubah jadi desis hangat supaya tidak ada suara yang menusuk telinga.
      const bright = ftype0 === 'highpass', ftype = bright ? 'bandpass' : ftype0, q = bright ? Math.min(q0, 0.8) : q0;
      const f = Math.min(bright ? f0 * 0.62 : f0, 4200), to = to0 ? Math.min(bright ? to0 * 0.62 : to0, 4200) : to0;
      const s = c.createBufferSource(), fl = c.createBiquadFilter();
      s.buffer = NOISE[kind]; s.loop = true; fl.type = ftype; fl.Q.value = q;
      fl.frequency.setValueAtTime(f, t);
      if (to && to !== f) fl.frequency.exponentialRampToValueAtTime(to, t + a + d);
      s.connect(fl); fl.connect(amp(t, v, a, d, send, dest));
      s.start(t, Math.random() * 1.5); s.stop(t + a + d + 0.03);
    };
    const modal = (t, freqs, v, d, send = 0.12, p = 1, dest = out) => freqs.forEach((f, i) => { if (f * p <= 6400) tone(t, f * p, 0, v / (1 + i * 1.2), d / (1 + i * 0.55), 'sine', send, 0.003, dest); });

    // Bahan: tiap benda punya nada dan peluruhan sendiri.
    const ceramic = (t, v = 0.07, p = 1) => { modal(t, [1380, 2710, 4230, 6120], v, 0.11, 0.1, p); hiss(t, 'white', 'bandpass', 3000, 0, 1, v * 0.5, 0.012); tone(t, 210 * p, 120, v * 0.8, 0.04); };
    const glass = (t, v = 0.05, p = 1) => { modal(t, [2480, 5120, 7340], v, 0.2, 0.18, p); hiss(t, 'white', 'highpass', 5200, 0, 0.7, v * 0.3, 0.008); };
    const iron = (t, v = 0.09, p = 1) => { modal(t, [262, 618, 1187, 1893, 2710], v, 0.34, 0.14, p); tone(t, 120 * p, 62, v * 1.2, 0.09); hiss(t, 'pink', 'bandpass', 1500, 0, 0.8, v * 0.4, 0.02); };
    const steel = (t, v = 0.08, p = 1) => { modal(t, [412, 987, 1640, 2480], v, 0.26, 0.14, p); tone(t, 150 * p, 80, v, 0.07); };
    const wood = (t, v = 0.1, p = 1) => { tone(t, 215 * p, 118, v, 0.05); tone(t, 520 * p, 340, v * 0.35, 0.025); hiss(t, 'pink', 'bandpass', 1250 * p, 0, 1.1, v * 0.42, 0.016); };
    const soft = (t, v = 0.07, p = 1) => { tone(t, 150 * p, 92, v, 0.05); hiss(t, 'pink', 'lowpass', 900, 300, 0.7, v * 0.5, 0.035); };
    const coin = (t, v = 0.022, p = 1) => modal(t, [3920, 5470, 7810, 9320], v, 0.17, 0.2, p);
    const water = (t, v = 0.05, p = 1) => { tone(t, 280 * p, 720 * p, v, 0.055); tone(t + 0.03, 420 * p, 980 * p, v * 0.5, 0.04); };
    const pluck = (t, m, v = 0.06, d = 0.75, send = 0.34, dest = out) => { const f = mtof(m); tone(t, f, 0, v, d, 'sine', send, 0.003, dest); tone(t, f * 2.01, 0, v * 0.3, d * 0.45, 'sine', send, 0.002, dest); tone(t, f * 5.43, 0, v * 0.1, d * 0.1, 'sine', send, 0.001, dest); };
    const saron = (t, m, v = 0.035, dest = out) => { const f = mtof(m); [1, 2.76, 5.42].forEach((r, i) => { tone(t, f * r, 0, v / (1 + i * 1.3), 1.25 / (1 + i), 'sine', 0.4, 0.002, dest); tone(t, f * r * 1.006, 0, v * 0.6 / (1 + i * 1.3), 1.1 / (1 + i), 'sine', 0.3, 0.002, dest); }); };
    const keys = (t, m, v, d, dest = out) => {
      const f = mtof(m), car = c.createOscillator(), mod = c.createOscillator(), idx = c.createGain();
      mod.frequency.value = f * 2; idx.gain.setValueAtTime(f * 1.1, t); idx.gain.exponentialRampToValueAtTime(f * 0.05, t + 0.5);
      car.frequency.value = f; mod.connect(idx); idx.connect(car.frequency); car.connect(amp(t, v, 0.012, d, 0.25, dest));
      car.start(t); mod.start(t); car.stop(t + d + 0.05); mod.stop(t + d + 0.05);
    };
    const bass = (t, m, v, d, dest = out) => { const f = mtof(m); tone(t, f, 0, v, d, 'sine', 0, 0.012, dest); tone(t, f * 2, 0, v * 0.18, d * 0.6, 'triangle', 0, 0.012, dest); };
    const kick = (t, v, dest = out) => { tone(t, 118, 44, v, 0.17, 'sine', 0, 0.002, dest); hiss(t, 'pink', 'lowpass', 500, 0, 0.7, v * 0.2, 0.02, 0, 0.002, dest); };
    const snare = (t, v, dest = out) => { hiss(t, 'pink', 'bandpass', 1750, 900, 0.7, v, 0.14, 0.2, 0.003, dest); tone(t, 190, 130, v * 0.45, 0.05, 'triangle', 0, 0.002, dest); };
    const hat = (t, v, d, dest = out) => hiss(t, 'white', 'highpass', 6800, 0, 0.8, v, d, 0.04, 0.002, dest);

    const S = {
      chop: (t, p) => { wood(t, 0.17, p); tone(t, 165 * p, 70, 0.17, 0.08); modal(t, [3180, 5120], 0.018, 0.03, 0, p); },
      chopSoft: (t, p) => wood(t, 0.06, p * 1.2),
      slice: (t, p) => { hiss(t, 'white', 'bandpass', 2600 * p, 5600 * p, 2.2, 0.06, 0.085); modal(t + 0.05, [4700], 0.006, 0.05, 0, p); },
      pickFood: (t, p) => { hiss(t, 'pink', 'bandpass', 900 * p, 1500, 1, 0.045, 0.04); tone(t, 200 * p, 260, 0.025, 0.03); },
      pickWet: (t, p) => { water(t, 0.035, p); hiss(t, 'pink', 'bandpass', 1500, 2400, 1, 0.025, 0.05); },
      softPlace: (t, p) => soft(t, 0.075, p),
      foodBoard: (t, p) => { soft(t, 0.07, p); wood(t + 0.006, 0.05, p * 1.15); },
      foodPlate: (t, p) => { soft(t, 0.055, p); ceramic(t + 0.006, 0.025, p); },
      cobekDrop: (t, p) => { tone(t, 150 * p, 84, 0.09, 0.05); hiss(t, 'brown', 'bandpass', 620, 0, 1, 0.1, 0.035); modal(t, [860, 1730], 0.012, 0.05, 0, p); },
      wokDrop: (t, p) => { iron(t, 0.045, p); hiss(t + 0.012, 'white', 'highpass', 3800, 2800, 0.7, 0.05, 0.3, 0.05); for (let i = 0; i < 4; i++) tone(t + rnd(0.02, 0.2), rnd(2200, 4200), 0, 0.006, 0.012); },
      potDrop: (t, p) => { tone(t, 180 * p, 520 * p, 0.07, 0.09); hiss(t, 'pink', 'bandpass', 1500, 500, 0.9, 0.09, 0.16, 0.12); water(t + 0.07, 0.03, p); },
      eggCrack: (t, p) => { for (let i = 0; i < 3; i++) hiss(t + i * 0.022, 'white', 'bandpass', rnd(2600, 4200), 0, 3, 0.06, 0.012); hiss(t + 0.07, 'pink', 'lowpass', 1100, 420, 0.8, 0.045, 0.09); water(t + 0.09, 0.022, p * 0.9); },
      glassPick: (t, p) => glass(t, 0.022, p * 1.05),
      glassDown: (t, p) => { glass(t, 0.042, p); soft(t, 0.025, p * 1.4); },
      glassFull: (t, p) => { tone(t, 900 * p, 1450 * p, 0.018, 0.11, 'sine', 0.2); glass(t + 0.08, 0.016, p * 1.2); },
      platePick: (t, p) => { ceramic(t, 0.045, p); ceramic(t + 0.035, 0.025, p * 1.03); },
      plateDown: (t, p) => { ceramic(t, 0.078, p * 0.94); wood(t + 0.004, 0.04, p); },
      ceramicPick: (t, p) => ceramic(t, 0.036, p * 0.84),
      ceramicDown: (t, p) => { ceramic(t, 0.068, p * 0.8); wood(t + 0.004, 0.038, p); },
      plateSlide: (t, p) => { hiss(t, 'pink', 'bandpass', 1500, 760, 1.3, 0.1, 0.25); ceramic(t + 0.2, 0.04, p); },
      metalDown: (t, p) => steel(t, 0.085, p * 0.86),
      toolPick: (t, p, id) => {
        if (KNIVES[id]) { hiss(t, 'white', 'bandpass', 4200, 7300, 5, 0.04, 0.12, 0.12); modal(t + 0.09, [5100, 7400], 0.012, 0.16, 0.2, p); }
        else if (id === 'kecap' || id === 'minyak') glass(t, 0.03, p * 0.48);
        else if (id === 'garam') { glass(t, 0.018, p * 0.8); hiss(t + 0.01, 'white', 'highpass', 6000, 0, 1, 0.022, 0.05); }
        else if (id === 'wok') { iron(t, 0.04, p); }
        else if (id === 'pot') { steel(t, 0.05, p * 0.72); water(t + 0.05, 0.016, 0.8); }
        else if (id === 'lap' || id === 'lap2' || id === 'spons') hiss(t, 'pink', 'bandpass', 1000, 1700, 0.7, 0.05, 0.08);
        else if (id === 'pestle') { tone(t, 330 * p, 240, 0.03, 0.04); hiss(t, 'brown', 'bandpass', 900, 0, 1, 0.05, 0.02); }
        else if (id === 'pin') wood(t, 0.06, p * 1.1);
        else modal(t, [1460, 3240], 0.018, 0.08, 0.1, p);
      },
      toolDown: (t, p, id) => {
        if (KNIVES[id]) modal(t, [2700, 4800, 6900], 0.022, 0.16, 0.16, p);
        else if (id === 'kecap' || id === 'minyak') { glass(t, 0.04, p * 0.46); wood(t, 0.05, p); }
        else if (id === 'garam') { glass(t, 0.022, p * 0.8); wood(t, 0.035, p * 1.4); }
        else if (id === 'wok') iron(t, 0.1, p);
        else if (id === 'pot') { steel(t, 0.09, p * 0.72); tone(t, 92, 54, 0.08, 0.09); }
        else if (id === 'pestle') { tone(t, 190 * p, 110, 0.08, 0.05); hiss(t, 'brown', 'bandpass', 760, 0, 1, 0.1, 0.03); }
        else if (id === 'pin' || id === 'spatula') { wood(t, 0.06, p); modal(t, [2100], 0.012, 0.06, 0.1, p); }
        else if (id === 'lap' || id === 'lap2' || id === 'spons') soft(t, 0.03, p * 1.3);
        else if (id === 'blender') { glass(t, 0.03, p * 0.55); tone(t, 130 * p, 86, 0.06, 0.06); }
        else if (id === 'batterBowl') ceramic(t, 0.05, p * 0.76);
        else modal(t, [1700, 3500], 0.024, 0.11, 0.12, p);
      },
      jarPick: (t, p) => { glass(t, 0.022, p * 0.68); hiss(t, 'white', 'bandpass', 5200, 0, 1, 0.014, 0.05); },
      jarDown: (t, p) => { glass(t, 0.03, p * 0.62); wood(t, 0.03, p * 1.3); },
      whiskPick: (t, p) => { for (let i = 0; i < 3; i++) modal(t + i * 0.012, [3100 + i * 420], 0.01, 0.08, 0.1, p); },
      flourScoop: (t, p) => { hiss(t, 'pink', 'bandpass', 700 * p, 1300, 0.7, 0.07, 0.11); hiss(t + 0.04, 'white', 'highpass', 4000, 0, 0.7, 0.012, 0.08); },
      flourPour: (t, p) => hiss(t, 'pink', 'lowpass', 1800 * p, 500, 0.5, 0.09, 0.2, 0.08),
      flourCoat: (t, p) => hiss(t, 'pink', 'bandpass', 1300 * p, 2200, 0.8, 0.07, 0.15),
      crumbs: (t, p) => { for (let i = 0; i < 7; i++) hiss(t + i * 0.018, 'white', 'bandpass', rnd(2500, 6200), 0, 4, 0.05, 0.012); },
      dip: (t, p) => { tone(t, 150 * p, 340 * p, 0.045, 0.07); hiss(t, 'brown', 'lowpass', 900, 400, 1, 0.08, 0.1); },
      doughPlop: (t, p) => { tone(t, 120 * p, 66, 0.12, 0.08); hiss(t, 'brown', 'lowpass', 620, 220, 0.8, 0.11, 0.05); },
      doughLift: (t, p) => { tone(t, 90 * p, 170, 0.05, 0.06); hiss(t, 'brown', 'lowpass', 700, 0, 1, 0.05, 0.04); },
      doughDone: (t) => { pluck(t, 76, 0.04, 0.45); pluck(t + 0.09, 81, 0.04, 0.6); },
      mixDone: (t) => { pluck(t, 74, 0.04, 0.42); pluck(t + 0.08, 79, 0.042, 0.6); },
      blendDone: (t) => { pluck(t, 72, 0.04, 0.4); pluck(t + 0.08, 76, 0.04, 0.45); pluck(t + 0.16, 84, 0.04, 0.7); },
      dropBlender: (t, p) => { soft(t, 0.05, p); glass(t + 0.01, 0.018, p * 0.6); },
      pourDone: (t) => { saron(t, 72, 0.026); saron(t + 0.1, 76, 0.026); saron(t + 0.2, 81, 0.028); },
      riceLidOpen: (t, p) => { steel(t, 0.03, p * 1.5); hiss(t + 0.03, 'white', 'highpass', 3500, 1400, 0.7, 0.04, 0.42, 0.1, 0.05); },
      riceLidClose: (t, p) => { steel(t, 0.06, p * 1.25); soft(t, 0.05, p); },
      riceScoop: (t, p) => { hiss(t, 'pink', 'bandpass', 1100, 700, 1, 0.07, 0.07); soft(t + 0.03, 0.025, p * 1.2); },
      ladleScoop: (t, p) => { water(t, 0.07, p * 0.8); hiss(t, 'pink', 'bandpass', 1300, 2800, 1, 0.05, 0.1, 0.1); modal(t, [1740], 0.008, 0.08, 0.1, p); },
      flipUp: (t, p) => { hiss(t, 'pink', 'bandpass', 700, 2300, 1, 0.06, 0.1); tone(t, 280 * p, 520, 0.02, 0.08); },
      fritterLand: (t, p) => { soft(t, 0.07, p); hiss(t + 0.01, 'white', 'highpass', 4300, 3000, 0.7, 0.05, 0.16); },
      spatulaScoop: (t, p) => { modal(t, [1320, 2860], 0.02, 0.07, 0.08, p); hiss(t, 'pink', 'bandpass', 1900, 1000, 2, 0.05, 0.06); },
      wokToss: (t, p) => { iron(t, 0.05, p); hiss(t, 'pink', 'bandpass', 500, 2200, 0.8, 0.03, 0.13); hiss(t + 0.17, 'white', 'highpass', 3600, 2600, 0.7, 0.012, 0.28, 0.06); },
      gasOn: (t, p) => { for (let i = 0; i < 4; i++) hiss(t + i * 0.04, 'white', 'bandpass', 3400, 0, 5, 0.09, 0.006); hiss(t + 0.15, 'pink', 'bandpass', 620, 900, 0.6, 0.11, 0.28, 0.05, 0.03); modal(t, [1100], 0.012, 0.03, 0, p); },
      gasOff: (t, p) => { modal(t, [940, 1800], 0.025, 0.035, 0, p); hiss(t, 'pink', 'bandpass', 800, 260, 0.8, 0.06, 0.13); },
      switch: (t, p) => { tone(t, 1800 * p, 900, 0.03, 0.012, 'square'); hiss(t, 'white', 'bandpass', 3800, 0, 2, 0.05, 0.008); },
      tapOn: (t, p) => { modal(t, [840, 1910], 0.03, 0.07, 0.08, p); hiss(t + 0.03, 'white', 'bandpass', 900, 2600, 0.8, 0.05, 0.12, 0.1); },
      tapOff: (t, p) => { modal(t, [720, 1530], 0.034, 0.08, 0.08, p); for (let i = 0; i < 3; i++) water(t + 0.12 + i * 0.13, 0.016, p * (1.4 - i * 0.1)); },
      plugIn: (t, p) => { tone(t, 310 * p, 150, 0.08, 0.05); modal(t + 0.03, [1500, 3100], 0.01, 0.05, 0, p); },
      plugOut: (t, p) => { tone(t, 180 * p, 640 * p, 0.09, 0.06); water(t + 0.06, 0.04, p); },
      potFull: (t, p) => { tone(t, 620 * p, 1100 * p, 0.022, 0.13, 'sine', 0.2); modal(t + 0.11, [1040], 0.012, 0.15, 0.2, p); },
      potEmpty: (t, p) => { for (let i = 0; i < 3; i++) water(t + i * 0.09, 0.03 - i * 0.008, p * (0.9 + i * 0.2)); steel(t + 0.26, 0.02, p); },
      overflow: (t, p) => { hiss(t, 'pink', 'bandpass', 900, 2200, 0.8, 0.08, 0.3, 0.14, 0.03); water(t + 0.04, 0.03, p); },
      boil: (t, p) => { for (let i = 0; i < 7; i++) water(t + i * rnd(0.04, 0.08), rnd(0.018, 0.042), p * rnd(0.72, 1.3)); },
      binOpen: (t, p) => { modal(t, [940, 2160], 0.022, 0.09, 0.1, p); hiss(t, 'pink', 'bandpass', 1200, 2000, 0.8, 0.025, 0.08); },
      binClose: (t, p) => { steel(t, 0.07, p * 1.1); tone(t, 100, 58, 0.07, 0.07); },
      trash: (t, p) => { hiss(t, 'pink', 'bandpass', 620, 260, 0.8, 0.09, 0.15, 0.1); tone(t + 0.1, 110 * p, 60, 0.07, 0.09); },
      cleanSparkle: (t, p) => { [0, 0.07, 0.15].forEach((o, i) => modal(t + o, [2093 * 1.25 ** i, 4186 * 1.25 ** i], 0.012, 0.3, 0.45, p)); },
      wipeDone: (t, p) => { hiss(t, 'pink', 'bandpass', 1200, 3400, 1, 0.04, 0.08); modal(t + 0.05, [3136], 0.012, 0.22, 0.4, p); },
      utensil: (t, p, i = 0) => modal(t, [980 + i * 170, 2310 + i * 330, 3860], 0.022, 0.5, 0.2, p),
      fridgeOpen: (t, p) => { tone(t, 90, 150, 0.05, 0.07); hiss(t + 0.03, 'white', 'lowpass', 2100, 800, 0.6, 0.05, 0.42, 0.16, 0.08); modal(t + 0.02, [410], 0.012, 0.12, 0.1, p); },
      cabinetOpen: (t, p) => { wood(t, 0.075, p * 0.8); tone(t + 0.03, 520 * p, 780 * p, 0.007, 0.13, 'sawtooth'); },
      drawerOpen: (t, p) => { hiss(t, 'brown', 'bandpass', 420, 720, 1.2, 0.13, 0.18); wood(t + 0.16, 0.08, p * 0.86); [0, 0.03].forEach(o => coin(t + 0.16 + o, 0.009, p)); },
      drawerClose: (t, p) => { hiss(t, 'brown', 'bandpass', 720, 390, 1.2, 0.12, 0.13); wood(t + 0.12, 0.13, p * 0.7); coin(t + 0.14, 0.008, p); },
      coinsPick: (t, p) => { for (let i = 0; i < 3; i++) coin(t + i * 0.035, 0.014, p * rnd(0.94, 1.08)); hiss(t, 'white', 'bandpass', 4300, 0, 1.2, 0.018, 0.05); },
      coinsDown: (t, p) => { for (let i = 0; i < 5; i++) coin(t + i * rnd(0.035, 0.07), 0.016, p * rnd(0.9, 1.12)); },
      cashIn: (t, p) => { for (let i = 0; i < 5; i++) coin(t + i * 0.04, 0.018, p * rnd(0.9, 1.15)); wood(t + 0.2, 0.05, 0.8); [84, 91].forEach((m, i) => pluck(t + 0.21 + i * 0.09, m, 0.024, 0.5)); },
      ticket: (t, p) => { hiss(t, 'white', 'bandpass', 3400, 2100, 1.4, 0.05, 0.05); pluck(t + 0.02, 81, 0.016, 0.24); },
      page: (t, p) => hiss(t, 'pink', 'bandpass', 1500, 4200, 0.7, 0.06, 0.13, 0.05, 0.02),
      orderBell: (t, p) => { modal(t, [2093, 5290, 8120], 0.04, 0.72, 0.42, 1); modal(t + 0.13, [2093, 5290], 0.018, 0.5, 0.42, 1); },
      serveBell: (t) => { saron(t, 79, 0.03); saron(t + 0.12, 84, 0.034); },
      combo: (t) => { pluck(t, 72, 0.042, 0.5); pluck(t + 0.07, 76, 0.042, 0.5); pluck(t + 0.14, 79, 0.044, 0.55); pluck(t + 0.21, 84, 0.046, 0.8); },
      stars: (t, p, n = 3) => { [72, 76, 79].slice(0, n).forEach((m, i) => { pluck(t + i * 0.14, m + 12, 0.05, 0.9); saron(t + i * 0.14, m, 0.022); }); if (n === 3) saron(t + 0.46, 84, 0.03); },
      doorChime: (t) => { [91, 88, 84].forEach((m, i) => { const f = mtof(m); modal(t + i * 0.09, [f, f * 2.71, f * 5.2], 0.022, 0.9, 0.55, 1); }); },
    };
    const bank = makeSoundBank({ c, out, wet, tone, hiss, modal, ceramic, glass, iron, steel, wood, soft, coin, pluck, rnd });
    Object.assign(S, bank.S);
    return { c, wet, S, tone, hiss, water, bubble: bank.bubble, pluck, saron, keys, bass, kick, snare, hat, NOISE };
  }

  let c = null, kit = null, musicKit = null, nodes = null, nextBar = 0, barIndex = 0, passIndex = 0, timer = null, radioLevel = 1, radioBack = 0;
  let fryOn = false, fryOil = 0, fryFood = 0, fryHeat = 0, fireLevel = 0, fireVoices = null;
  const fireBuffers = [null, null];
  const fireBuffer = n => fireBuffers[n] || (fireBuffers[n] = renderCampfire(c, n === 1));
  // Kompor bersuara seperti api unggun: tenang saat menyala, lebih hidup saat wajan dipakai.
  function fireVoice(lively) {
    const src = c.createBufferSource(), gain = c.createGain();
    src.buffer = fireBuffer(lively ? 1 : 0); src.loop = true; gain.gain.value = 0;
    src.connect(gain); gain.connect(nodes.sfx); src.start(0, Math.random() * 7);
    return gain;
  }
  function updateFire(dt) {
    const burning = fireLevel > 0;
    fryHeat = Math.max(0, Math.min(1, fryHeat + (burning ? dt / 2.4 : -dt)));
    const warm = 0.45 + fryHeat * 0.55, active = fryOn && (fryOil > 0.2 || fryFood > 0);
    const calm = burning ? fireLevel * warm * (active ? 0.45 : 1) : 0, lively = burning && active ? fireLevel * warm * (fryFood ? 1 : 0.72) : 0;
    if (!fireVoices && calm + lively <= 0) return;
    if (!fireVoices) fireVoices = { calm: fireVoice(false), lively: fireVoice(true) };
    fireVoices.calm.gain.setTargetAtTime(calm, c.currentTime, 0.28);
    fireVoices.lively.gain.setTargetAtTime(lively, c.currentTime, 0.32);
  }
  let scene = 'street', view = 0, pourKind = 'water';
  const timers = { rain: 0.5, gutter: 3, vendor: 38, thunder: 70, rice: 20 };
  const loops = {}, rubs = {};

  function buildGraph(ctx) {
    const master = ctx.createGain(), limit = ctx.createDynamicsCompressor(), sfx = ctx.createGain(), music = ctx.createGain(), amb = ctx.createGain(), ambLp = ctx.createBiquadFilter(), room = ctx.createConvolver(), roomGain = ctx.createGain(), lp = ctx.createBiquadFilter();
    limit.threshold.value = -10; limit.knee.value = 14; limit.ratio.value = 5; limit.attack.value = 0.003; limit.release.value = 0.16;
    master.gain.value = 0.9; master.connect(limit); limit.connect(ctx.destination);
    const len = Math.floor(ctx.sampleRate * 1.1), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); let last = 0; for (let i = 0; i < len; i++) { const k = i / len, n = (Math.random() * 2 - 1) * (1 - k) ** 3.4; last += (n - last) * (0.42 - k * 0.3); d[i] = last; } }
    room.buffer = ir; roomGain.gain.value = 0.5; room.connect(roomGain); roomGain.connect(master);
    lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.4;
    ambLp.type = 'lowpass'; ambLp.frequency.value = 7800; ambLp.Q.value = 0.3;
    const warm = ctx.createBiquadFilter(), air = ctx.createBiquadFilter();
    warm.type = 'highshelf'; warm.frequency.value = 4200; warm.gain.value = -5;
    air.type = 'lowpass'; air.frequency.value = 9000; air.Q.value = 0.4;
    music.connect(master); amb.connect(ambLp); ambLp.connect(master); sfx.connect(warm); warm.connect(air); air.connect(master); lp.connect(music);
    const musicWet = ctx.createGain(), sfxWet = ctx.createGain();
    musicWet.connect(room); sfxWet.connect(room);
    return { master, sfx, music, amb, ambLp, room, lp, musicWet, sfxWet };
  }
  function applyVolumes() {
    if (!c) return;
    nodes.music.gain.setTargetAtTime(volumes.music * 2.6 * radioLevel, c.currentTime, 0.08);
    nodes.musicWet.gain.setTargetAtTime(volumes.music * 2.6 * radioLevel, c.currentTime, 0.08);
    nodes.sfx.gain.setTargetAtTime(volumes.sfx * 2.6, c.currentTime, 0.04);
    nodes.sfxWet.gain.setTargetAtTime(volumes.sfx * 2.6, c.currentTime, 0.04);
    nodes.amb.gain.setTargetAtTime(Math.max(volumes.sfx, volumes.music) * 0.9, c.currentTime, 0.08);
  }
  // Suara yang berjalan terus: api, air, kipas, hujan, dan gerakan tangan.
  const LOOP_DEF = {
    boil: { noise: 'brown', parts: [['bandpass', 260, 0.7]], peak: 0.07, lfo: [1.7, 0.3] },
    tap: { noise: 'pink', parts: [['bandpass', 1450, 0.45], ['highshelf', 3600, 0.7, -8]], peak: 0.075, lfo: [9, 0.1] },
    drain: { noise: 'brown', parts: [['bandpass', 460, 1.8]], peak: 0.1, lfo: [4.6, 0.55] },
    fan: { noise: 'pink', parts: [['lowpass', 520, 0.6]], peak: 0.05, hum: [98, 0.007], lfo: [19, 0.05] },
    blend: { noise: 'pink', parts: [['bandpass', 620, 0.9], ['highshelf', 2200, 0.7, -9]], peak: 0.1, hum: [142, 0.022, 'triangle'], lfo: [23, 0.1] },
    pour: { noise: 'pink', parts: [['bandpass', 1150, 0.7]], peak: 0.065, lfo: [8, 0.22] },
    stir: { noise: 'pink', parts: [['bandpass', 1500, 1.2]], peak: 0.085, fast: true },
    grind: { noise: 'brown', parts: [['bandpass', 500, 1]], peak: 0.28, fast: true, lfo: [13, 0.32] },
    whisk: { noise: 'pink', parts: [['bandpass', 2400, 1.6]], peak: 0.075, fast: true, lfo: [17, 0.42] },
    rub: { noise: 'pink', parts: [['bandpass', 1000, 0.8]], peak: 0.08, fast: true },
    scrub: { noise: 'pink', parts: [['bandpass', 1500, 1]], peak: 0.07, fast: true, lfo: [14, 0.4] },
    roll: { noise: 'brown', parts: [['lowpass', 300, 0.7]], peak: 0.32, fast: true, hum: [68, 0.012] },
    shake: { noise: 'pink', parts: [['bandpass', 3400, 1.4]], peak: 0.07, fast: true, lfo: [20, 0.6] },
    rain: { noise: 'pink', parts: [['highpass', 700, 0.5], ['lowpass', 5200, 0.5]], peak: 0.032, bed: true, lfo: [0.13, 0.12] },
    traffic: { noise: 'brown', parts: [['lowpass', 220, 0.6]], peak: 0.06, bed: true, lfo: [0.07, 0.34] },
    room: { noise: 'pink', parts: [['lowpass', 380, 0.5]], peak: 0.014, bed: true, hum: [60, 0.002] },
    wind: { noise: 'pink', parts: [['bandpass', 390, 0.9], ['lowshelf', 180, 0.7, -6]], peak: 0.022, bed: true, lfo: [0.09, 0.6] },
    fridge: { noise: 'brown', parts: [['lowpass', 180, 0.7]], peak: 0.028, hum: [100, 0.004] },
    murmur: { noise: 'pink', parts: [['bandpass', 520, 2.4], ['peaking', 1100, 2, 4]], peak: 0.026, bed: true, lfo: [2.7, 0.5] },
  };
  function makeLoop(id, ctx = c, bus = nodes, noise = kit.NOISE) {
    const d = LOOP_DEF[id], src = ctx.createBufferSource(), gain = ctx.createGain();
    src.buffer = noise[d.noise]; src.loop = true;
    let last = src;
    d.parts.forEach(([type, f, q, db]) => { const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; if (db !== undefined) fl.gain.value = db; last.connect(fl); last = fl; });
    const shape = ctx.createGain();
    last.connect(shape); shape.connect(gain); gain.gain.value = 0;
    const target = d.bed ? bus.amb : bus.sfx;
    if (d.pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = d.pan; gain.connect(p); p.connect(target); } else gain.connect(target);
    if (d.lfo) { const l = ctx.createOscillator(), a = ctx.createGain(); l.frequency.value = d.lfo[0]; a.gain.value = d.lfo[1]; shape.gain.value = 1 - d.lfo[1] * 0.5; l.connect(a); a.connect(shape.gain); l.start(); }
    if (d.hum) { const o = ctx.createOscillator(), a = ctx.createGain(), fl = ctx.createBiquadFilter(); o.type = d.hum[2] || 'sine'; o.frequency.value = d.hum[0]; a.gain.value = d.hum[1]; fl.type = 'lowpass'; fl.frequency.value = 900; o.connect(fl); fl.connect(a); a.connect(gain); o.start(); }
    src.start(0, Math.random() * 1.5);
    return { gain, level: 0, peak: d.peak, fast: d.fast };
  }
  function setLoop(id, level) {
    if (!c || !LOOP_DEF[id]) return;
    if (!loops[id]) { if (level <= 0) return; loops[id] = makeLoop(id); }
    const l = loops[id], v = Math.max(0, Math.min(1, level));
    if (Math.abs(l.level - v) < 0.01) return;
    l.level = v;
    l.gain.gain.setTargetAtTime(v * l.peak, c.currentTime, l.fast ? 0.025 : 0.09);
  }
  const radioSong = () => RADIO_SONGS[volumes.radio];
  function saveAudio() { try { localStorage.setItem(SAVE, JSON.stringify(volumes)); } catch (e) { /* penyimpanan opsional */ } }
  function pump() {
    if (!c || c.state !== 'running') return;
    if (radioBack && c.currentTime >= radioBack) { radioBack = 0; if (radioSong()) { radioLevel = 1; applyVolumes(); } }
    if (!radioSong()) return;
    while (nextBar < c.currentTime + 0.9) {
      if (nextBar < c.currentTime) nextBar = c.currentTime + 0.05;
      const song = radioSong();
      scheduleRadioBar(musicKit, song, barIndex, nextBar, nodes.lp, passIndex);
      nextBar += (60 / song.bpm / 4) * 16; barIndex++;
      if (barIndex % 16 === 0) passIndex++;
      // Setelah dua putaran radio pindah sendiri ke lagu berikutnya.
      if (passIndex >= 2) { volumes.radio = (volumes.radio + 1) % RADIO_SONGS.length; barIndex = 0; passIndex = 0; saveAudio(); }
    }
  }
  function applyScene() {
    if (!c) return;
    const shop = scene === 'shop';
    nodes.lp.frequency.setTargetAtTime(shop ? 6200 : 820, c.currentTime, 0.35);
    const mix = shop ? VIEW_MIX[view] : { rain: 1, traffic: 0.8, wind: 0.8, tone: 7800 };
    setLoop('rain', mix.rain);
    setLoop('traffic', mix.traffic);
    setLoop('wind', mix.wind);
    setLoop('room', shop ? 1 : 0);
    nodes.ambLp.frequency.setTargetAtTime(mix.tone, c.currentTime, 0.22);
  }
  // Tiap meja mendengar luar secara berbeda: depan terbuka, dapur lebih teredam.
  const VIEW_MIX = { '-1': { rain: 0.46, traffic: 0.1, wind: 0.34, tone: 3000 }, 0: { rain: 0.74, traffic: 0.24, wind: 0.62, tone: 7000 }, 1: { rain: 0.32, traffic: 0.07, wind: 0.22, tone: 2100 } };
  function unlock() {
    try {
      if (!c) {
        c = new (window.AudioContext || window.webkitAudioContext)();
        nodes = buildGraph(c);
        kit = makeKit(c, nodes.sfx, nodes.sfxWet);
        musicKit = makeKit(c, nodes.lp, nodes.musicWet);
        applyVolumes();
        if (!Number.isInteger(volumes.radio) || volumes.radio < -1 || volumes.radio >= RADIO_SONGS.length) volumes.radio = 0;
        radioLevel = radioSong() ? 1 : 0; applyVolumes();
        nextBar = c.currentTime + 0.2;
        timer = setInterval(pump, 180);
        // Suara api disiapkan lebih awal supaya kompor tidak tersendat saat pertama menyala.
        setTimeout(() => fireBuffer(0), 700); setTimeout(() => fireBuffer(1), 1400);
        document.addEventListener('visibilitychange', () => { if (!c) return; if (document.hidden) c.suspend(); else c.resume().then(() => { nextBar = Math.max(nextBar, c.currentTime + 0.1); }); });
      }
      if (c.state === 'suspended') c.resume();
      applyScene();
    } catch (e) { c = null; }
  }

  let bubble = 0, pourGrain = 0, tapGrain = 0, vendorNext = 0;
  // Peristiwa acak di sekitar warung supaya suasana tidak pernah terasa berulang.
  function worldTick(dt) {
    if (scene !== 'shop' || volumes.sfx <= 0) return;
    const at = c.currentTime + 0.01, open = view === 0 ? 1 : view === -1 ? 0.55 : 0.34;
    Object.keys(timers).forEach(id => { timers[id] -= dt; });
    if (timers.rain <= 0) { timers.rain = rnd(0.06, 0.42) / (0.45 + open); if (Math.random() < 0.3 + open * 0.7) kit.S.rainTick(at, 1, rnd(-0.85, 0.85)); }
    if (timers.gutter <= 0) { timers.gutter = rnd(1.8, 6.5); if (Math.random() < 0.3 + open * 0.7) kit.S.gutterDrop(at, 1, rnd(-0.7, 0.7)); }
    if (timers.rice <= 0) { timers.rice = rnd(34, 62); if (view === -1) kit.S.riceTick(at, 1, 1); }
    if (timers.vendor <= 0) {
      timers.vendor = rnd(75, 135);
      if (view === 0 || Math.random() < 0.5) { vendorNext = (vendorNext + 1) % 2; kit.S[vendorNext ? 'vendorTing' : 'vendorTek'](at, 1, rnd(0.35, 0.8) * (Math.random() < 0.5 ? -1 : 1)); }
    }
    if (timers.thunder <= 0) { timers.thunder = rnd(95, 190); kit.S.thunder(at, 1, rnd(-0.6, 0.6)); }
  }
  return {
    unlock,
    play(name, arg) {
      if (!c || !kit || c.state !== 'running' || volumes.sfx <= 0) return;
      const fn = kit.S[name];
      if (!fn) return;
      try { fn(c.currentTime + 0.002, rnd(0.97, 1.03), arg); } catch (e) { /* suara tidak boleh menghentikan game */ }
    },
    loop: setLoop,
    rub(id, amount = 1) { rubs[id] = Math.min(1, Math.max(rubs[id] || 0, 0.42 + Math.min(amount, 16) / 24)); },
    tick(dt) {
      if (!c || c.state !== 'running') return;
      Object.keys(rubs).forEach(id => { setLoop(id, rubs[id]); rubs[id] = Math.max(0, rubs[id] - dt * 7.5); if (rubs[id] <= 0) { setLoop(id, 0); delete rubs[id]; } });
      updateFire(dt);
      const boil = loops.boil ? loops.boil.level : 0;
      bubble -= dt;
      if (boil > 0.05 && bubble <= 0 && volumes.sfx > 0) { bubble = rnd(0.018, 0.1); kit.bubble(c.currentTime + 0.002, rnd(0.008, 0.03), rnd(210, 860)); }
      pourGrain -= dt; tapGrain -= dt;
      const pouring = loops.pour ? loops.pour.level : 0, tapRun = loops.tap ? loops.tap.level : 0;
      if (pouring > 0.1 && pourGrain <= 0 && volumes.sfx > 0) {
        const thick = pourKind === 'thick';
        pourGrain = thick ? rnd(0.09, 0.2) : rnd(0.016, 0.07);
        kit.bubble(c.currentTime + 0.002, thick ? rnd(0.03, 0.055) : rnd(0.008, 0.024), thick ? rnd(150, 300) : rnd(560, 1500));
      }
      if (tapRun > 0.1 && tapGrain <= 0 && volumes.sfx > 0) { tapGrain = rnd(0.012, 0.05); kit.bubble(c.currentTime + 0.002, rnd(0.004, 0.014), rnd(620, 1900)); }
      worldTick(dt);
    },
    setScene(next) { scene = next; applyScene(); },
    setView(next) { if (next !== view) { view = next; applyScene(); } },
    setPour(kind) { pourKind = kind; },
    fry(on, oil, food) { fryOn = !!on; fryOil = oil || 0; fryFood = food || 0; },
    fire(level) { fireLevel = Math.max(0, Math.min(1, level || 0)); },
    radioNext() {
      const index = volumes.radio, next = index >= RADIO_SONGS.length - 1 ? -1 : index + 1;
      volumes.radio = next; barIndex = 0; passIndex = 0; saveAudio();
      if (c) {
        radioLevel = 0; applyVolumes();
        radioBack = next >= 0 ? c.currentTime + 1 : 0;
        nextBar = c.currentTime + 1.05;
      }
      this.play(next >= 0 ? 'radioTune' : 'radioClick');
      return this.radioInfo();
    },
    radioInfo() { const song = radioSong(); return { on: !!song, index: volumes.radio, name: song ? song.name : 'MATI', total: RADIO_SONGS.length }; },
    radioPlaying() { return !!radioSong() && volumes.music > 0; },
    stopShop() { fryOn = false; fryHeat = 0; fireLevel = 0; if (fireVoices && c) { fireVoices.calm.gain.setTargetAtTime(0, c.currentTime, 0.05); fireVoices.lively.gain.setTargetAtTime(0, c.currentTime, 0.05); } ['boil', 'tap', 'drain', 'fan', 'blend', 'pour', 'murmur', 'fridge'].forEach(id => setLoop(id, 0)); },
    level: kind => volumes[kind],
    cycle(kind) {
      const steps = kind === 'music' ? [0.6, 0.3, 0] : [1, 0.5, 0], at = steps.findIndex(v => Math.abs(v - volumes[kind]) < 0.01);
      volumes[kind] = steps[(at + 1) % steps.length];
      saveAudio();
      applyVolumes();
      if (kind === 'sfx' && volumes.sfx > 0) this.play('switch');
    },
    // Render tanpa speaker untuk memeriksa suara tidak sunyi, rusak, atau pecah.
    async inspect() {
      const report = { sfx: {}, loops: {}, songs: {} };
      const measure = b => {
        let peak = 0, sum = 0, bad = 0, n = 0, cross = 0;
        for (let ch = 0; ch < b.numberOfChannels; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < d.length; i++) { const v = d[i]; if (!Number.isFinite(v)) { bad++; continue; } peak = Math.max(peak, Math.abs(v)); sum += v * v; n++; if (i && (v > 0) !== (d[i - 1] > 0)) cross++; } }
        return { peak: +peak.toFixed(3), rms: +Math.sqrt(sum / Math.max(1, n)).toFixed(4), bad, hz: Math.round(cross / Math.max(1, n) * b.sampleRate / 2) };
      };
      const names = Object.keys(makeKit(new OfflineAudioContext(1, 128, 44100), new OfflineAudioContext(1, 128, 44100).destination, null).S);
      for (const name of names) {
        const long = { carPass: 10, thunder: 5, vendorTek: 6, vendorTing: 5, guestArrive: 2.2, guestLeave: 2.2 }[name] || 1.6;
        const off = new OfflineAudioContext(2, Math.floor(44100 * long), 44100), g = buildGraph(off); g.sfx.gain.value = 2.6;
        const k = makeKit(off, g.sfx, g.room);
        k.S[name](0.01, 1, name === 'toolPick' || name === 'toolDown' ? 'wok' : name === 'stars' ? 3 : 0);
        report.sfx[name] = measure(await off.startRendering());
      }
      for (const id of Object.keys(LOOP_DEF)) {
        const off = new OfflineAudioContext(2, 44100 * 2, 44100), g = buildGraph(off); g.sfx.gain.value = 2.6; g.amb.gain.value = 0.9;
        const k = makeKit(off, g.sfx, g.room), loop = makeLoop(id, off, g, k.NOISE);
        loop.gain.gain.value = loop.peak;
        report.loops[id] = measure(await off.startRendering());
      }
      report.fire = {};
      for (const lively of [false, true]) {
        const off = new OfflineAudioContext(2, 44100 * 8, 44100), g = buildGraph(off), src = off.createBufferSource();
        g.sfx.gain.value = 2.6; src.buffer = renderCampfire(off, lively); src.connect(g.sfx); src.start();
        report.fire[lively ? 'hidup' : 'tenang'] = measure(await off.startRendering());
      }
      for (const song of RADIO_SONGS) {
        const bars = 16, seconds = (60 / song.bpm) * 4 * bars;
        const off = new OfflineAudioContext(2, Math.floor(44100 * (seconds + 1.5)), 44100), g = buildGraph(off);
        g.music.gain.value = 1.56; g.lp.frequency.value = 6200; g.musicWet.gain.value = 1.56;
        const k = makeKit(off, g.lp, g.musicWet);
        for (let b = 0; b < bars; b++) scheduleRadioBar(k, song, b, 0.05 + b * (60 / song.bpm), g.lp, 1);
        report.songs[song.name] = { seconds: Math.round(seconds), ...measure(await off.startRendering()) };
      }
      return report;
    },
  };
})();
function sfx(name, arg) { Sound.play(name, arg); }
