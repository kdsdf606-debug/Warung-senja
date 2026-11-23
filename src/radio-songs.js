// Lima lagu instrumental orisinal untuk radio warung. Semua nada dibuat dari sintesis.

const RADIO_SONGS = (() => {
  const _ = -1;
  const PITCH = { C: 0, D: 2, Eb: 3, E: 4, F: 5, G: 7, A: 9, Bb: 10, B: 11 };
  const SHAPES = { maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], 7: [0, 4, 7, 10], five: [0, 7, 12, 14] };
  const chord = text => {
    const [note, shape] = text.split(':'), pc = PITCH[note];
    const notes = SHAPES[shape].map(step => { let m = 60 + pc + step; while (m > 72) m -= 12; while (m < 55) m += 12; return m; }).sort((a, b) => a - b);
    return { root: 36 + pc, notes };
  };
  const list = texts => texts.map(chord);
  const hitsOf = (bar, each) => bar.forEach((m, n) => { if (m === _) return; let gap = 1; while (n + gap < bar.length && bar[n + gap] === _) gap++; each(m, n, gap); });

  return [
    {
      name: 'HUJAN SENJA', bpm: 72, swing: 0.16,
      chords: list(['F:maj7', 'E:m7', 'D:m7', 'G:7', 'C:maj7', 'A:m7', 'D:m7', 'G:7']),
      a: [[76, _, 74, 72, _, 69, 72, _], [71, _, _, 74, _, 72, 71, _], [69, _, 72, 74, _, 77, _, 76], [74, _, 71, _, 67, _, _, _], [72, _, 76, 79, _, 76, _, 74], [72, _, 69, _, 72, _, 76, _], [77, _, 76, 74, _, 72, _, 69], [71, _, 74, _, _, _, _, _]],
      b: [[81, _, 79, 76, _, 77, _, 76], [79, _, 76, 74, _, 71, _, _], [77, _, 74, 72, _, 74, 77, _], [79, _, 77, 74, 71, _, _, _], [84, _, 79, _, 76, _, 72, _], [76, _, 72, _, 69, _, 72, _], [74, _, 77, 81, _, 79, 77, _], [74, _, 71, _, 67, _, _, _]],
      play(k, x) {
        x.notes.forEach((m, n) => k.keys(x.at(0) + n * 0.016, m, 0.019, x.step * 10, x.dest));
        x.notes.slice(1).forEach((m, n) => k.keys(x.at(10) + n * 0.014, m, 0.009, x.step * 4, x.dest));
        [[0, 0, 5], [6, 0, 2], [8, 7, 3], [14, 7, 2]].forEach(([s, o, d]) => k.bass(x.at(s), x.root + o, 0.056, x.step * d, x.dest));
        if (x.bar >= 2 || x.pass > 0) { k.kick(x.at(0), 0.066, x.dest); k.kick(x.at(10), 0.05, x.dest); [4, 12].forEach(s => x.brush(x.at(s), 0.024, 0.11)); }
        for (let s = 0; s < 16; s += 2) x.shaker(x.at(s), s % 4 === 2 ? 0.012 : 0.006);
        hitsOf(x.line, (m, n) => k.pluck(x.at(n * 2), m, 0.027, 0.95, 0.42, x.dest));
      },
    },
    {
      name: 'KOPI PAGI', bpm: 92, swing: 0,
      chords: list(['G:maj7', 'B:m7', 'E:m7', 'A:7', 'A:m7', 'D:7', 'G:maj7', 'D:7']),
      a: [[74, _, _, 71, _, 74, _, 78], [78, _, 74, _, 71, _, _, _], [71, _, 74, _, 79, _, 78, 76], [76, _, 73, _, _, _, 69, _], [72, _, 76, _, 79, _, 76, _], [78, _, 74, _, 72, _, _, _], [74, _, 78, _, 83, _, 81, 79], [78, _, _, _, 74, _, _, _]],
      b: [[83, _, 81, _, 79, _, 78, _], [81, _, 78, _, 74, _, _, _], [79, _, 76, _, 71, _, 74, _], [76, _, 79, _, 81, _, 76, _], [76, _, 72, _, 69, _, 72, _], [74, _, 78, _, 81, _, 78, _], [79, _, 74, _, 71, _, 67, _], [69, _, 72, _, 74, _, _, _]],
      play(k, x) {
        [0, 3, 6, 10, 13].forEach((s, n) => x.notes.slice(1).forEach((m, i) => x.nylon(x.at(s) + i * 0.012, m, n === 0 ? 0.02 : 0.015, x.step * 3)));
        [[0, 0], [6, 7], [8, 0], [14, 7]].forEach(([s, o]) => k.bass(x.at(s), x.root + o, 0.052, x.step * 2.6, x.dest));
        for (let s = 0; s < 16; s++) x.shaker(x.at(s), s % 4 === 0 ? 0.012 : s % 2 ? 0.004 : 0.007);
        [0, 3, 6, 10, 12].forEach(s => x.rim(x.at(s), 0.009));
        hitsOf(x.line, (m, n, gap) => x.flute(x.at(n * 2), m, 0.024, x.step * 2 * gap * 0.94));
      },
    },
    {
      name: 'LAMPU JALAN', bpm: 64, swing: 0.24,
      chords: list(['Bb:maj7', 'G:m7', 'C:m7', 'F:7', 'D:m7', 'G:7', 'C:m7', 'F:7']),
      a: [[74, _, 77, _, 74, _, 70, _], [70, _, 74, _, 70, _, 67, _], [70, _, 72, 75, _, 74, 72, _], [69, _, 72, _, _, _, _, _], [69, _, 72, _, 74, _, 77, _], [79, _, 77, _, 74, _, 71, _], [72, _, 75, _, 79, _, 77, 75], [72, _, 69, _, 65, _, _, _]],
      b: [[77, _, 81, _, 82, _, 81, 77], [79, _, 74, _, 70, _, _, _], [75, _, 79, _, 84, _, 82, 79], [81, _, 77, _, 72, _, _, _], [81, _, 77, _, 74, _, 72, _], [71, _, 74, _, 77, _, 79, _], [75, _, 72, _, 70, _, 67, _], [69, _, 72, _, 65, _, _, _]],
      play(k, x) {
        [[0, 0.018, 7], [6, 0.01, 3], [10, 0.013, 5]].forEach(([s, v, d]) => x.notes.forEach((m, n) => k.keys(x.at(s) + n * 0.018, m, v, x.step * d, x.dest)));
        const next = x.nextRoot, walk = [x.root, x.root + 7, x.root + 9, next + (next > x.root ? -1 : 1)];
        walk.forEach((m, n) => k.bass(x.at(n * 4), m, 0.056, x.step * 3.5, x.dest));
        for (let s = 0; s < 16; s += 4) x.brush(x.at(s), s % 8 === 4 ? 0.024 : 0.012, 0.2);
        [2, 6, 10, 14].forEach(s => x.shaker(x.at(s), 0.007));
        hitsOf(x.line, (m, n, gap) => x.vibes(x.at(n * 2), m, 0.026, 0.8 + gap * 0.2));
      },
    },
    {
      name: 'PASAR MALAM', bpm: 84, swing: 0,
      chords: list(['D:five', 'B:five', 'G:five', 'A:five', 'D:five', 'B:five', 'G:five', 'A:five']),
      a: [[74, 76, 78, _, 81, _, 78, 76], [74, _, 71, _, 69, _, 71, _], [74, 76, 78, 81, 83, _, 81, _], [78, _, 76, _, 74, _, _, _], [69, 71, 74, _, 76, _, 74, 71], [69, _, 66, _, 69, _, 71, _], [74, _, 76, 78, _, 76, 74, _], [71, _, 69, _, 74, _, _, _]],
      b: [[81, 83, 86, _, 83, _, 81, 78], [81, _, 78, 76, _, 74, _, 76], [78, _, 81, _, 83, 81, 78, _], [76, _, 74, _, 71, _, _, _], [86, _, 83, 81, _, 78, _, 76], [78, _, 76, 74, _, 71, _, 74], [76, 78, 81, _, 78, _, 76, _], [74, _, 71, _, 74, _, _, _]],
      play(k, x) {
        x.notes.slice(0, 2).forEach(m => k.keys(x.at(0), m - 12, 0.013, x.step * 14, x.dest));
        k.bass(x.at(0), x.root, 0.05, x.step * 7, x.dest); k.bass(x.at(8), x.root + 7, 0.036, x.step * 6, x.dest);
        if (x.bar % 4 === 0) { k.tone(x.at(0), 73.4, 71, 0.055, 2.4, 'sine', 0.5, 0.012, x.dest); k.tone(x.at(0), 146.8, 143, 0.014, 1.5, 'sine', 0.5, 0.012, x.dest); }
        const scale = [62, 64, 66, 69, 71, 74, 76, 78];
        for (let s = 1; s < 16; s += 2) x.bonang(x.at(s), scale[(x.bar * 2 + s * 3) % scale.length] + 12, 0.009);
        [[0, 150], [3, 210], [6, 150], [10, 210], [12, 150], [14, 240]].forEach(([s, f]) => k.tone(x.at(s), f, f * 0.68, 0.028, 0.07, 'sine', 0.12, 0.002, x.dest));
        hitsOf(x.line, (m, n) => k.saron(x.at(n * 2), m, 0.021, x.dest));
      },
    },
    {
      name: 'PULANG', bpm: 56, swing: 0.08,
      chords: list(['F:maj7', 'A:m7', 'Bb:maj7', 'C:7', 'D:m7', 'Bb:maj7', 'G:m7', 'C:7']),
      a: [[_, _, 72, _, _, _, 69, _], [76, _, _, _, 72, _, _, _], [74, _, _, 77, _, _, 74, _], [72, _, _, _, _, _, _, _], [69, _, 72, _, 77, _, _, _], [74, _, _, _, 70, _, _, _], [74, _, 70, _, 67, _, _, _], [72, _, _, _, _, _, _, _]],
      b: [[81, _, _, 79, _, 76, _, _], [76, _, _, 72, _, _, 74, _], [77, _, _, 74, _, 70, _, _], [72, _, 76, _, 79, _, _, _], [77, _, _, 74, _, 69, _, _], [70, _, 74, _, 77, _, _, _], [74, _, _, 70, _, _, 67, _], [72, _, _, _, _, _, _, _]],
      play(k, x) {
        k.bass(x.at(0), x.root + 12, 0.046, x.step * 13, x.dest);
        x.notes.forEach(m => k.keys(x.at(0), m, 0.006, x.step * 15, x.dest));
        const roll = [0, 2, 1, 3, 2, 1, 3, 2];
        roll.forEach((pick, n) => x.felt(x.at(n * 2), x.notes[pick], n === 0 ? 0.021 : 0.014, 1.5));
        hitsOf(x.line, (m, n, gap) => x.felt(x.at(n * 2) + 0.012, m + 12, 0.034, 1.4 + gap * 0.3));
      },
    },
  ];
})();

function scheduleRadioBar(k, song, bar, t0, dest, pass) {
  const step = 60 / song.bpm / 4, i = bar % 16, half = i % 8, source = i < 8 ? song.a : song.b;
  const here = song.chords[half], later = song.chords[(half + 1) % 8], mtof = m => 440 * 2 ** ((m - 69) / 12);
  const at = s => t0 + s * step + (s % 2 ? step * song.swing : 0) + Math.random() * 0.004;
  const c = k.c;
  const felt = (t, m, v, d) => {
    const f = mtof(m);
    k.tone(t, f, 0, v, d, 'sine', 0.34, 0.008, dest);
    k.tone(t, f * 2, 0, v * 0.2, d * 0.45, 'sine', 0.3, 0.006, dest);
    k.tone(t, f * 3.01, 0, v * 0.05, d * 0.2, 'sine', 0.2, 0.004, dest);
    k.hiss(t, 'pink', 'lowpass', 900, 0, 0.6, v * 0.14, 0.018, 0.1, 0.002, dest);
  };
  const nylon = (t, m, v, d) => {
    const f = mtof(m);
    k.tone(t, f, 0, v, d, 'triangle', 0.22, 0.003, dest);
    k.tone(t, f * 2, 0, v * 0.22, d * 0.4, 'sine', 0.2, 0.002, dest);
  };
  const vibes = (t, m, v, d) => {
    const f = mtof(m);
    k.tone(t, f, 0, v, d, 'sine', 0.5, 0.003, dest);
    k.tone(t, f * 1.004, 0, v * 0.5, d * 0.9, 'sine', 0.5, 0.003, dest);
    k.tone(t, f * 3.98, 0, v * 0.08, d * 0.16, 'sine', 0.3, 0.002, dest);
  };
  const flute = (t, m, v, d) => {
    const f = mtof(m), o = c.createOscillator(), wobble = c.createOscillator(), depth = c.createGain(), g = c.createGain(), end = t + Math.max(0.12, d);
    o.type = 'sine'; o.frequency.value = f; wobble.frequency.value = 5.1;
    depth.gain.setValueAtTime(0, t); depth.gain.linearRampToValueAtTime(f * 0.006, t + Math.min(0.28, d * 0.6));
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.07); g.gain.linearRampToValueAtTime(v * 0.78, Math.max(t + 0.08, end - 0.08)); g.gain.linearRampToValueAtTime(0, end);
    wobble.connect(depth); depth.connect(o.frequency); o.connect(g); g.connect(dest);
    if (k.wet) { const send = c.createGain(); send.gain.value = 0.38; g.connect(send); send.connect(k.wet); }
    o.start(t); wobble.start(t); o.stop(end + 0.02); wobble.stop(end + 0.02);
    k.tone(t, f * 2, 0, v * 0.12, Math.max(0.1, d * 0.8), 'sine', 0.2, 0.05, dest);
    k.hiss(t, 'pink', 'bandpass', Math.min(f * 2, 3200), 0, 2.4, v * 0.16, Math.max(0.08, d * 0.5), 0.2, 0.04, dest);
  };
  const bonang = (t, m, v) => { const f = mtof(m); k.tone(t, f, 0, v, 0.36, 'sine', 0.4, 0.003, dest); k.tone(t, f * 1.006, 0, v * 0.6, 0.3, 'sine', 0.4, 0.003, dest); };
  const brush = (t, v, d) => k.hiss(t, 'pink', 'bandpass', 1500, 900, 0.7, v, d, 0.16, 0.012, dest);
  const shaker = (t, v) => k.hiss(t, 'pink', 'bandpass', 3200, 0, 1.2, v, 0.035, 0.03, 0.006, dest);
  const rim = (t, v) => { k.tone(t, 820, 620, v, 0.018, 'triangle', 0.2, 0.001, dest); };
  song.play(k, { at, step, dest, bar: i, pass, root: here.root, notes: here.notes, nextRoot: later.root, line: source[half], felt, nylon, vibes, flute, bonang, brush, shaker, rim });
}
