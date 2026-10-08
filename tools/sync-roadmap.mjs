/* =========================================================
   Sincroniza la hoja de ruta con el catálogo
   ---------------------------------------------------------
   Lee data/cars.json y pone (o actualiza) en cada línea «Sala NN: …»
   de «HOJA DE RUTA MOTORLABMUSEUM.txt», tras el nombre, su estado:
     [ESTADO: PUBLICADO]                         abierta (sin fecha o con la fecha ya pasada)
     [ESTADO: APERTURA PROGRAMADA - DD/MM HH:mm] con releaseDate futura (hora de Madrid)
     [ESTADO: PRÓXIMO LANZAMIENTO]               en el catálogo pero "coming_soon" (avance en el Hall)
     [ESTADO: PENDIENTE]                         aún no está en el catálogo
   No toca nada más: separadores, fases, descripciones y cualquier
   sección nueva se quedan tal cual. Sólo escribe si algo cambia.

   Cómo se emparejan salas y coches:
     · coches: «Sala 07» ↔ la sala 07 del catálogo (orden en cars.json);
     · motos: «[MOTO 01]» ↔ la sala con "room": "M-01" (el Ala dos ruedas
       numera aparte, así que «Sala 19» de la hoja es la M-01 de la web).
   Si la marca del catálogo no aparece en la línea, avisa: la numeración
   de la hoja y la de la web se han separado.

   Lo ejecuta tools/build-data.mjs; también se puede lanzar solo:
     node tools/sync-roadmap.mjs
   Si el archivo no existe (p. ej. en un clon sin la hoja), no hace nada.
   ========================================================= */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROADMAP = "HOJA DE RUTA MOTORLABMUSEUM.txt";
const pad2 = (n) => String(n).padStart(2, "0");
const roomNo = (car, i) => car.room || pad2(i + 1);          // igual que Museo.roomNo en engine/core.js
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Fecha en hora de Madrid: «08/10 21:00»
const madrid = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const when = (iso) => { const p = Object.fromEntries(madrid.formatToParts(Date.parse(iso)).map((x) => [x.type, x.value])); return `${pad2(p.day)}/${pad2(p.month)} ${pad2(p.hour)}:${p.minute}`; };

export function statusOf(car, now = Date.now()) {
  if (!car) return "PENDIENTE";
  const t = car.releaseDate ? Date.parse(car.releaseDate) : NaN;
  if (car.status === "coming_soon") return "PRÓXIMO LANZAMIENTO";
  if (t > now) return `APERTURA PROGRAMADA - ${when(car.releaseDate)}`;
  return "PUBLICADO";
}

/* Devuelve { text, changes, warnings } sin escribir nada.
   Una línea de sala es «Sala NN: <nombre> [ESTADO: …] [cite: …]»: la etiqueta de estado
   puede estar o no, y las referencias [cite: …] del final se conservan tal cual. */
export function syncText(text, data, now = Date.now()) {
  const byRoom = new Map(data.cars.map((c, i) => [roomNo(c, i), c]));
  const changes = [], warnings = [];
  const out = text.split(/(\r?\n)/).map((line) => {
    const m = line.match(/^(Sala\s+(\d{1,3}):\s*)(.*)$/);
    if (!m) return line;
    const [, head, num, body] = m;
    const clean = body.replace(/\s*\[ESTADO:[^\]]*\]/g, "");
    const [, name, cites] = clean.match(/^(.*?)((?:\s*\[cite:[^\]]*\])*)\s*$/);
    const moto = name.match(/\[MOTO\s+(\d+)\]/);
    const car = byRoom.get(moto ? `M-${pad2(moto[1])}` : pad2(num));
    if (car && !norm(name).includes(norm(car.brand))) {
      warnings.push(`Sala ${num}: en la hoja es «${name.trim()}», en el catálogo «${car.name}»`);
    }
    const status = statusOf(car, now);
    const next = `${head}${name.trimEnd()} [ESTADO: ${status}]${cites}`;
    if (next !== line) changes.push(`Sala ${num} → ${status}`);
    return next;
  }).join("");
  return { text: out, changes, warnings };
}

export async function syncRoadmap({ root, data, now = Date.now(), quiet = false } = {}) {
  const path = join(root, ROADMAP);
  let text;
  try { text = await readFile(path, "utf8"); } catch { if (!quiet) console.log(`· ${ROADMAP} no existe: no hay hoja de ruta que sincronizar`); return null; }
  const res = syncText(text, data, now);
  if (res.text !== text) await writeFile(path, res.text);
  if (!quiet) {
    const counts = {};
    for (const m of res.text.matchAll(/\[ESTADO: ([^\]-]+?)(?: - [^\]]*)?\]/g)) counts[m[1].trim()] = (counts[m[1].trim()] || 0) + 1;
    console.log(`✔ hoja de ruta ${res.text !== text ? "actualizada" : "al día"} · ${Object.entries(counts).map(([k, v]) => `${v} ${k.toLowerCase()}`).join(" · ")}`);
    for (const w of res.warnings) console.warn(`  ⚠ ${w}`);
  }
  return res;
}

// Uso directo: node tools/sync-roadmap.mjs
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const data = JSON.parse(await readFile(join(root, "data", "cars.json"), "utf8"));
  await syncRoadmap({ root, data });
}
