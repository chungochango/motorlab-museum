/* =========================================================
   MUSEO · Formatos modernos de imagen (AVIF + WebP)
   ---------------------------------------------------------
   Para cada imagen del catálogo de data/cars.json genera a su
   lado una versión .avif y otra .webp (si el original no lo es
   ya), y anota en el JSON los formatos que existen de verdad:
     "formats": ["avif", "webp"]
   El motor sólo emite <source> para formatos anotados, así una
   <picture> nunca apunta a un archivo inexistente. Si una
   versión pesa más que el original, se descarta.
   Después regenera data/cars.js.

   Requiere la librería sharp (no forma parte del proyecto):
     npm install --prefix <carpeta> sharp
     SHARP_DIR=<carpeta> node tools/images.mjs
   ========================================================= */
import { readFile, writeFile, stat, unlink } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
let sharp;
try {
  const req = createRequire(join(process.env.SHARP_DIR || here, "package.json"));
  sharp = req("sharp");
} catch {
  console.error("✖ No encuentro sharp. Instálalo fuera del proyecto y pásalo con SHARP_DIR:\n  npm install --prefix ../.herramientas sharp\n  SHARP_DIR=../.herramientas node tools/images.mjs");
  process.exit(1);
}

/* Calidad por uso: las fotos principales ("hero") las amplía la cámara de algunas salas (×2),
   así que llevan más calidad que los despieces; la variante "hires" (alta resolución, sólo se
   descarga al acercarse) va casi sin pérdida visible. */
const QUALITY = {
  base: { avif: { quality: 52, effort: 6 }, webp: { quality: 80, effort: 5 } },
  hero: { avif: { quality: 62, effort: 6 }, webp: { quality: 88, effort: 5 } },
  hires: { avif: { quality: 70, effort: 6 }, webp: { quality: 90, effort: 5 } },
};
const jsonPath = join(root, "data/cars.json");
const data = JSON.parse(await readFile(jsonPath, "utf8"));
const kb = (n) => `${Math.round(n / 1024)} KB`;
let saved = 0;

async function encode(label, im, q) {
  const src = join(root, im.src);
  const ext = im.src.split(".").pop().toLowerCase();
  const original = (await stat(src)).size;
  const formats = [];
  for (const f of ["avif", "webp"]) {
    if (f === ext) { formats.push(f); continue; }
    const out = src.replace(/\.[a-z0-9]+$/i, `.${f}`);
    await sharp(src)[f](q[f]).toFile(out);
    const size = (await stat(out)).size;
    if (size >= original) { await unlink(out); console.log(`  · ${label}.${f} descartado (${kb(size)} ≥ ${kb(original)})`); continue; }
    formats.push(f);
    if (f === "avif") saved += original - size;
    console.log(`  ✔ ${label}.${f}  ${kb(original)} → ${kb(size)}`);
  }
  if (formats.length) im.formats = formats; else delete im.formats;
}

for (const car of data.cars) {
  for (const [key, im] of Object.entries(car.images)) {
    await encode(`${car.id} › ${key}`, im, im.role === "hero" ? QUALITY.hero : QUALITY.base);
    if (im.hires) await encode(`${car.id} › ${key} (alta resolución)`, im.hires, QUALITY.hires);
  }
}

await writeFile(jsonPath, JSON.stringify(data, null, 2) + "\n");
console.log(`✔ Formatos anotados en data/cars.json · ahorro con AVIF: ${kb(saved)}`);
execFileSync(process.execPath, [join(here, "build-data.mjs")], { stdio: "inherit" });
