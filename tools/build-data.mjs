/* =========================================================
   MUSEO · data/cars.json → data/cars.js
   ---------------------------------------------------------
   data/cars.json es la fuente única que se edita. Este script
   genera data/cars.js (la misma información como script) para
   que el museo funcione también abriendo el HTML con doble
   clic (file://), donde el navegador no deja leer el JSON.
   Uso:  node tools/build-data.mjs
   Valida además que cada sala tenga sus imágenes en disco.
   ========================================================= */
import { readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(await readFile(join(root, "data/cars.json"), "utf8"));

/* ---------- Validación mínima del esquema ---------- */
const problems = [];
const pending = [];                                  // fotos declaradas que aún no se han subido (salas con "pendingImages": true)
const ids = new Set();
for (const car of data.cars) {
  const where = `cars › ${car.id || "(sin id)"}`;
  // Un coche "coming_soon" sólo aparece en el Hall como avance: no necesita ficha completa ni secciones
  const soon = car.status === "coming_soon";
  if (car.status !== undefined && !soon) problems.push(`${where}: "status" desconocido (${car.status}); sólo se admite "coming_soon"`);
  for (const k of soon ? ["id", "slug", "name", "brand", "year", "images", "hall"] : ["id", "slug", "name", "brand", "year", "theme", "specs", "images", "hall", "sections"]) {
    if (car[k] === undefined) problems.push(`${where}: falta "${k}"`);
  }
  if (ids.has(car.id)) problems.push(`${where}: id repetido`);
  // Carpeta de la sala (rooms/cars/<slug> o rooms/bikes/<slug>): debe existir; si la sala está abierta, con su index.html
  if (car.dir) {
    try { await access(join(root, car.status === "coming_soon" ? car.dir : `${car.dir}/index.html`)); }
    catch { problems.push(`${where}: no existe ${car.status === "coming_soon" ? car.dir : `${car.dir}/index.html`}`); }
  }
  ids.add(car.id);
  for (const [key, im] of Object.entries(car.images || {})) {
    if (im.hires) {                                    // variante de alta resolución para la cámara (opcional)
      try { await access(join(root, im.hires.src)); } catch { problems.push(`${where} › images.${key}.hires: no existe ${im.hires.src}`); }
    }
    try { await access(join(root, im.src)); } catch {
      // Una sala recién añadida puede publicarse antes que sus fotos: aviso, no error
      (car.pendingImages ? pending : problems).push(`${where} › images.${key}: no existe ${im.src}`);
    }
    for (const f of im.formats || []) {
      const alt = im.src.replace(/\.[a-z0-9]+$/i, `.${f}`);
      if (alt !== im.src) { try { await access(join(root, alt)); } catch { problems.push(`${where} › images.${key}: declara ${f} pero falta ${alt}`); } }
    }
  }
  // Toda referencia a imagen ("clave" o { ref }) debe existir en el catálogo
  const walk = (o, path) => {
    if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${path}[${i}]`));
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (k === "image") {
        const ref = typeof v === "string" ? v : v?.ref;
        if (ref && !car.images?.[ref]) problems.push(`${where} › ${path}.image: "${ref}" no está en images`);
      } else walk(v, `${path}.${k}`);
    }
  };
  walk(car.sections, "sections");
  walk(car.hall, "hall");
  for (const s of car.sections || []) {
    for (const k of s.specs || []) if (!car.specs?.[k]) problems.push(`${where} › ${s.type}: la ficha no tiene "${k}"`);
  }
}

if (pending.length) {
  console.warn(`⚠ ${pending.length} foto(s) pendiente(s) de subir (la sala funciona sin ellas; quita "pendingImages" cuando estén):\n  · ${pending.join("\n  · ")}`);
}
if (problems.length) {
  console.error(`✖ ${problems.length} problema(s) en data/cars.json:\n  · ${problems.join("\n  · ")}`);
  process.exit(1);
}

const banner = `/* =========================================================
   ARCHIVO GENERADO — no lo edites a mano.
   Fuente: data/cars.json · Regenerar: node tools/build-data.mjs
   Sólo se usa al abrir el museo sin servidor (file://).
   ========================================================= */
`;
await writeFile(join(root, "data/cars.js"), `${banner}window.MUSEO = ${JSON.stringify(data, null, 2)};\n`);
console.log(`✔ data/cars.js generado · ${data.cars.length} salas: ${data.cars.map((c) => c.id).join(", ")}`);

// Las cabeceras dependen de las salas (rutas de imágenes) y de los HTML (hash de scripts)
/* ---------- Precarga de la foto principal del Hall (LCP) ----------
   El Hall arranca con el primer coche al frente; su foto se pide desde el <head>, sin esperar
   a que el JavaScript lea los datos. Se precarga el formato más ligero declarado (avif › webp). */
{
  const first = data.cars[0];
  const ref = first.hall.image.ref || first.hall.image;
  const im = first.images[ref];
  const fmt = ["avif", "webp"].find((f) => (im.formats || []).includes(f));
  const href = fmt ? im.src.replace(/\.[a-z0-9]+$/i, "." + fmt) : im.src;
  const tag = `  <link rel="preload" as="image" href="${href}"${fmt ? ` type="image/${fmt}"` : ""} fetchpriority="high" />`;
  const indexPath = join(root, "index.html");
  const html = await readFile(indexPath, "utf8");
  const out = html.replace(/(<!-- preload:hall[^>]*-->)[\s\S]*?(\s*<!-- \/preload:hall -->)/, (_, open, close) => `${open}\n${tag}${close}`);
  if (out !== html) await writeFile(indexPath, out);
}

await import("./build-headers.mjs");
