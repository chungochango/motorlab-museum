/* =========================================================
   Efectos de sonido sintetizados (sin muestras de terceros)
   ---------------------------------------------------------
   Genera WAV mono de 16 bits a 44,1 kHz en promo/public/sfx/:
     pulse.wav   pulso eléctrico: golpe grave + zumbido que baja
     impact.wav  choque de la fusión: bombo profundo + ruido
     scan.wav    barrido del escáner: tono que sube con trémolo
     tick.wav    tecla de terminal · beep.wav pitido de sistema · glitch.wav fallo digital
   Uso:  node promo/scripts/sfx.mjs
   ========================================================= */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RATE = 44100;
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");

// Ruido determinista (mismo archivo en cada ejecución)
let seed = 7;
const noise = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x3fffffff) - 1;

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

function render(seconds, fn) {
  const n = Math.round(seconds * RATE);
  const s = new Array(n);
  let phase = {};
  for (let i = 0; i < n; i++) s[i] = fn(i / RATE, phase);
  // Fundido de 5 ms al principio y al final: sin chasquidos
  const f = Math.round(0.005 * RATE);
  for (let i = 0; i < f; i++) { s[i] *= i / f; s[n - 1 - i] *= i / f; }
  return s;
}

// Oscilador con frecuencia variable (fase acumulada)
const osc = (p, key, freq, shape = Math.sin) => {
  p[key] = (p[key] ?? 0) + (2 * Math.PI * freq) / RATE;
  return shape(p[key]);
};
const saw = (x) => ((x / Math.PI) % 2) - 1;

const pulse = render(0.7, (t, p) => {
  const thump = osc(p, "a", 90 * Math.exp(-t * 18) + 42) * Math.exp(-t * 9) * 0.9;
  const zap = saw(osc(p, "b", 1800 * Math.exp(-t * 7) + 110, (x) => x)) * Math.exp(-t * 6) * 0.22;
  const buzz = osc(p, "c", 120, (x) => Math.sign(Math.sin(x))) * Math.exp(-t * 10) * 0.12;
  const crackle = noise() * Math.exp(-t * 30) * 0.35;
  return (thump + zap + buzz + crackle) * 0.8;
});

const impact = render(1.4, (t, p) => {
  const boom = osc(p, "a", 70 * Math.exp(-t * 6) + 30) * Math.exp(-t * 3.2);
  const body = osc(p, "b", 140 * Math.exp(-t * 9) + 60) * Math.exp(-t * 7) * 0.4;
  const hiss = noise() * Math.exp(-t * 12) * 0.4;
  return (boom + body + hiss) * 0.85;
});

const scan = render(2.0, (t, p) => {
  const f = 300 + 900 * (t / 2);
  const tone = osc(p, "a", f) * 0.25 + osc(p, "b", f * 2.01) * 0.08;
  const trem = 0.6 + 0.4 * Math.sin(2 * Math.PI * 14 * t);
  const env = Math.min(1, t * 6) * Math.min(1, (2 - t) * 3);
  return tone * trem * env * 0.7;
});

// Terminal del R34: tecla, pitido de sistema y glitch digital
const tick = render(0.04, (t, p) => (osc(p, "a", 2400) * 0.4 + noise() * 0.5) * Math.exp(-t * 160) * 0.5);
const beep = render(0.35, (t, p) => {
  const f = t < 0.12 ? 1320 : 1760;
  return osc(p, "a", f, (x) => Math.sign(Math.sin(x))) * 0.18 * (t < 0.11 || t > 0.14 ? 1 : 0) * Math.min(1, (0.35 - t) * 20);
});
const glitch = render(0.3, (t, p) => {
  const step = Math.floor(t * 60);
  const f = 200 + ((step * 7919) % 13) * 140;
  const gate = (step * 31) % 3 ? 1 : 0.2;
  return (osc(p, "a", f, (x) => Math.sign(Math.sin(x))) * 0.25 + noise() * 0.3) * gate * Math.exp(-t * 4) * 0.7;
});

await mkdir(out, { recursive: true });
for (const [name, s] of Object.entries({ pulse, impact, scan, tick, beep, glitch })) {
  await writeFile(join(out, `${name}.wav`), wav(s));
  console.log(`✔ sfx/${name}.wav · ${(s.length / RATE).toFixed(2)} s`);
}
