// Suara api unggun untuk kompor: bara hangat, nyala yang bernapas, dan kayu yang berderak pelan.

function renderCampfire(ctx, lively) {
  const sr = ctx.sampleRate, seconds = 8, len = Math.floor(sr * seconds), buffer = ctx.createBuffer(2, len, sr);
  const L = buffer.getChannelData(0), R = buffer.getChannelData(1), TAU = Math.PI * 2, rnd = (a, b) => a + Math.random() * (b - a);
  const coef = hz => 1 - Math.exp(-TAU * hz / sr);
  const phases = [rnd(0, TAU), rnd(0, TAU), rnd(0, TAU), rnd(0, TAU)];
  // Semua gelombang punya putaran bulat supaya sambungan loop tidak terdengar.
  const breath = k => 0.68 + 0.2 * Math.sin(TAU * 2 * k + phases[0]) + 0.09 * Math.sin(TAU * 5 * k + phases[1]) + 0.03 * Math.sin(TAU * 13 * k + phases[2]);
  const flick = k => 0.55 + 0.3 * Math.sin(TAU * 7 * k + phases[3]) + 0.15 * Math.sin(TAU * 19 * k + phases[1]);

  [L, R].forEach(d => {
    // Bara dibuat dari filter bertingkat agar tidak berdesis, lalu ujungnya disilang supaya loop mulus.
    const fade = Math.floor(sr * 0.12), warm = coef(240), glow = coef(620), base = coef(210), body = new Float32Array(len + fade);
    let a1 = 0, a2 = 0, a3 = 0, b1 = 0, b2 = 0, b3 = 0, sum = 0;
    for (let i = -sr; i < len + fade; i++) {
      const n = Math.random() * 2 - 1, k = ((i % len) + len) % len / len;
      a1 += (n - a1) * warm; a2 += (a1 - a2) * warm; a3 += (a2 - a3) * warm;
      b1 += (n - b1) * glow; b2 += (b1 - b2) * glow; b3 += (b2 - b3) * base;
      if (i >= 0) body[i] = a3 * 9 * breath(k) + (b2 - b3) * 1.1 * flick(k);
    }
    for (let i = 0; i < len; i++) {
      d[i] = i < fade ? body[i] * (i / fade) + body[len + i] * (1 - i / fade) : body[i];
      sum += d[i] * d[i];
    }
    const gain = (lively ? 0.023 : 0.017) / (Math.sqrt(sum / len) || 1);
    for (let i = 0; i < len; i++) d[i] *= gain;
  });

  const snap = (start, size, freq, amp, pan) => {
    const step = TAU * freq / sr, left = Math.sqrt(0.5 - pan * 0.5), right = Math.sqrt(0.5 + pan * 0.5), attack = Math.max(2, size * 0.04);
    let phase = Math.random() * TAU, dust = 0;
    for (let n = 0; n < size; n++) {
      const i = (start + n) % len, env = Math.exp(-6 * n / size) * Math.min(1, n / attack);
      dust += ((Math.random() * 2 - 1) - dust) * 0.34; phase += step;
      const v = amp * env * (Math.sin(phase) * 0.62 + dust * 0.38);
      L[i] += v * left; R[i] += v * right;
    }
  };
  const clusters = Math.round(seconds * (lively ? 2.2 : 0.8));
  for (let n = 0; n < clusters; n++) {
    let at = Math.floor(Math.random() * len);
    const count = Math.floor(rnd(1, lively ? 6 : 4)), pan = rnd(-0.55, 0.55), base = rnd(760, 1900), loud = rnd(0.012, lively ? 0.04 : 0.028);
    for (let j = 0; j < count; j++) {
      snap(at, Math.floor(rnd(0.003, 0.012) * sr), base * rnd(0.82, 1.28), loud * rnd(0.35, 1), pan + rnd(-0.08, 0.08));
      at += Math.floor(rnd(0.018, 0.13) * sr);
    }
  }
  const knocks = Math.round(seconds * (lively ? 0.42 : 0.2));
  for (let n = 0; n < knocks; n++) snap(Math.floor(Math.random() * len), Math.floor(rnd(0.022, 0.05) * sr), rnd(240, 520), rnd(0.03, 0.055), rnd(-0.4, 0.4));

  let peak = 0;
  [L, R].forEach(d => { for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i])); });
  if (peak > 0.13) { const down = 0.13 / peak; [L, R].forEach(d => { for (let i = 0; i < len; i++) d[i] *= down; }); }
  return buffer;
}
