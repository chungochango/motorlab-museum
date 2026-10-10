/* =========================================================
   MUSEO · Generador de salas
   ---------------------------------------------------------
   Crea el esqueleto de una sala nueva a partir de la plantilla de
   la Sala 11 (capa de movimiento, despiece y duelo):
     · rooms/cars/<slug>/index.html  (y la carpeta img/);
     · su ficha en data/cars.json, con todos los campos normalizados;
     · su entrada en sitemap.xml.
   La sala nace como BORRADOR ("status": "coming_soon", sin "announce"):
   se ve en local pero no sale a producción (tools/public-catalog.mjs)
   hasta que le quites el "status" o le pongas "releaseDate".

   Uso con parámetros:
     node tools/create-room.mjs --slug nsx --name "Honda NSX-R (NA2)" --brand Honda --model "NSX-R" \
       --year 2002 --hp 280 --torque 304 --rpm 7300 --torqueRpm 5300 --weight 1270 --topSpeed 270 \
       --accent "#E11D2B" [--unit PS] [--theme ralliart] [--tags atmosferico,iconos-90s] [--rival nissan-skyline-r34]
   Sin parámetros (o si falta alguno obligatorio) pregunta por consola.
   Añade --dry-run para ver lo que haría sin escribir nada.
   Después: sube las fotos a rooms/cars/<slug>/img/, completa los textos
   en data/cars.json y ejecuta node tools/build-data.mjs.
   ========================================================= */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.motorlabmuseum.com";
const TEMPLATE = "rooms/cars/evo/index.html";

/* ---------- Parámetros ---------- */
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith("--")) continue;
  const [k, inline] = a.slice(2).split(/=(.*)/s);
  args[k] = inline ?? (process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[++i] : true);
}
const FIELDS = [
  ["slug", "Slug (URL corta, p. ej. nsx)", true],
  ["name", "Nombre completo (p. ej. Honda NSX-R (NA2))", true],
  ["brand", "Marca", true],
  ["model", "Modelo corto para la cabecera (p. ej. NSX-R)", false],
  ["year", "Año", true],
  ["hp", "Potencia (CV)", true],
  ["torque", "Par motor (Nm)", true],
  ["rpm", "Régimen de potencia máxima (rpm)", false],
  ["torqueRpm", "Régimen de par máximo (rpm)", false],
  ["weight", "Peso (kg)", true],
  ["topSpeed", "Velocidad máxima (km/h)", true],
  ["accent", "Color de la sala en hexadecimal (p. ej. #E11D2B)", true],
];
if (FIELDS.some(([k, , need]) => need && args[k] === undefined) && process.stdin.isTTY) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  for (const [k, label, need] of FIELDS) {
    if (args[k] !== undefined) continue;
    const v = (await rl.question(`${label}${need ? "" : " (opcional)"}: `)).trim();
    if (v) args[k] = v;
  }
  rl.close();
}

/* ---------- Normalización y validación ---------- */
const errors = [];
// «1.690 kg», «3,5», «920 CV» → número; vacío o sin cifra → null
const number = (v, label, { need = false, min = 0, max = Infinity, int = true } = {}) => {
  if (v === undefined || v === true || v === "") { if (need) errors.push(`falta ${label}`); return null; }
  const m = String(v).match(/\d[\d.]*(?:,\d+)?/);
  const n = m ? parseFloat(m[0].replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".")) : NaN;
  if (!Number.isFinite(n) || n <= min || n > max) { errors.push(`${label} no válido: «${v}»`); return null; }
  return int ? Math.round(n) : n;
};
const text = (v, label, need = false) => { const s = v === undefined || v === true ? "" : String(v).trim(); if (need && !s) errors.push(`falta ${label}`); return s; };

const slug = text(args.slug, "--slug", true).toLowerCase();
if (slug && !/^[a-z0-9][a-z0-9-]{0,30}$/.test(slug)) errors.push(`--slug sólo admite minúsculas, cifras y guiones: «${slug}»`);
const name = text(args.name, "--name", true);
const brand = text(args.brand, "--brand", true);
const model = text(args.model, "--model") || (brand && name.startsWith(brand) ? name.slice(brand.length).trim() : name);
const year = number(args.year, "--year", { need: true, min: 1885, max: 2100 });
const hp = number(args.hp, "--hp", { need: true, max: 5000 });
const torque = number(args.torque, "--torque", { need: true, max: 5000 });
const rpm = number(args.rpm, "--rpm", { max: 25000 });
const torqueRpm = number(args.torqueRpm, "--torqueRpm", { max: 25000 });
const weight = number(args.weight, "--weight", { need: true, max: 10000 });
const topSpeed = number(args.topSpeed, "--topSpeed", { need: true, max: 600 });
const unit = text(args.unit, "--unit") || "CV";
if (!["CV", "PS"].includes(unit)) errors.push(`--unit debe ser CV o PS: «${unit}»`);
let accent = text(args.accent ?? args.hallAccent, "--accent", true);
if (accent && !/^#?[0-9a-f]{6}$/i.test(accent)) errors.push(`--accent debe ser un color hexadecimal de 6 cifras: «${accent}»`);
accent = `#${accent.replace("#", "").toUpperCase()}`;
if (rpm && torqueRpm && torqueRpm >= rpm) errors.push("--torqueRpm debe ser menor que --rpm");
const theme = text(args.theme, "--theme") || "ralliart";
const tags = text(args.tags, "--tags").split(",").map((s) => s.trim()).filter(Boolean);
const rivalId = text(args.rival, "--rival") || "nissan-skyline-r34";

const dataPath = join(root, "data/cars.json");
const raw = await readFile(dataPath, "utf8");
const data = JSON.parse(raw);
const id = `${brand} ${model}`.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
if (slug && data.cars.some((c) => c.slug === slug)) errors.push(`ya existe una sala con el slug «${slug}»`);
if (id && data.cars.some((c) => c.id === id)) errors.push(`ya existe una sala con el id «${id}»`);
if (!data.cars.some((c) => c.id === rivalId && c.status !== "coming_soon")) errors.push(`--rival: no hay ninguna sala abierta con id «${rivalId}»`);
await access(join(root, `themes/${theme}.css`)).catch(() => errors.push(`--theme: no existe themes/${theme}.css`));
if (errors.length) {
  console.error(`✖ No se ha creado nada:\n  · ${errors.join("\n  · ")}\n\nEjemplo: node tools/create-room.mjs --slug nsx --name "Honda NSX-R (NA2)" --brand Honda --year 2002 --hp 280 --torque 304 --weight 1270 --topSpeed 270 --accent "#E11D2B"`);
  process.exit(1);
}

/* ---------- Ficha ---------- */
const nf = new Intl.NumberFormat("es-ES", { useGrouping: "always" });
const hex = parseInt(accent.slice(1), 16);
const hallAccent = `${(hex >> 16) & 255}, ${(hex >> 8) & 255}, ${hex & 255}`;
const dir = `rooms/cars/${slug}`;
// Las salas de un ala (motos) van al final con su propia numeración: la nueva entra justo antes
const at = data.cars.findIndex((c) => c.wing);
const index = at < 0 ? data.cars.length : at;
const room = String(index + 1).padStart(2, "0");
const rival = data.cars.find((c) => c.id === rivalId);
const todo = "PENDIENTE";
const car = {
  id, slug, dir, name, brand, make: brand, model,
  year, years: String(year),
  theme, motion: true,
  status: "coming_soon",                           // borrador: no se publica hasta quitar esta línea o poner "releaseDate"
  pendingImages: true,                             // las fotos aún no están en disco (aviso en vez de error)
  country: todo, category: todo,
  tags,
  palette: { accent, hallAccent },
  marks: [brand],
  exitLine: todo,
  meta: {
    title: `${name} · Sala ${room} · Museo digital del automóvil`,
    description: `Sala ${room} del museo digital del automóvil: ${name}. ${nf.format(hp)} ${unit}, ${nf.format(torque)} Nm y ${nf.format(weight)} kg.`,
  },
  specs: {
    engine: { label: "Motor", value: todo },
    power: { label: "Potencia", value: hp, unit, ...(rpm ? { note: `a ${nf.format(rpm)} rpm`, rpm } : {}) },
    torque: { label: "Par motor", value: torque, unit: "Nm", ...(torqueRpm ? { note: `a ${nf.format(torqueRpm)} rpm`, rpm: torqueRpm } : {}) },
    weight: { label: "Peso", value: weight, unit: "kg" },
    topSpeed: { label: "Velocidad máxima", value: topSpeed, unit: "km/h" },
  },
  images: {
    [`${slug}-hall`]: { role: "hero", src: `${dir}/img/${slug}-perfil.jpg`, w: 1672, h: 941, alt: `${name} de perfil`, formats: ["avif", "webp"] },
    "despiece-motor": { role: "exploded", src: `${dir}/img/despiece-motor.jpg`, w: 941, h: 1672, alt: `Despiece ilustrativo del motor del ${name}`, formats: ["avif", "webp"] },
  },
  hall: {
    text: todo,
    specs: [[`${nf.format(hp)} ${unit}`, "Potencia"], [`${nf.format(topSpeed)} km/h`, "Vel. máxima"], [`${nf.format(weight)} kg`, "Peso"]],
    image: { ref: `${slug}-hall`, fit: "contain" },
    teaser: { badge: "Próximamente", lines: [`Sala ${room} · Próximamente`, name] },
  },
  specsPreview: { power: `${nf.format(hp)} ${unit}`, weight: `${nf.format(weight)} kg` },
  sections: [
    {
      type: "hero-cinematic", id: "inicio", nav: "Historia",
      kicker: [brand, `Sala ${room}`], title: model, image: `${slug}-hall`,
      lead: { historia: todo, tecnico: todo },
      facts: {
        historia: [[`${nf.format(hp)} ${unit}`, "Potencia"], [`${nf.format(topSpeed)} km/h`, "Vel. máxima"], [`${nf.format(weight)} kg`, "Peso"]],
        tecnico: [[`${nf.format(hp)} ${unit}`, rpm ? `a ${nf.format(rpm)} rpm` : "Potencia"], [`${nf.format(torque)} Nm`, torqueRpm ? `a ${nf.format(torqueRpm)} rpm` : "Par motor"], [`${nf.format(weight)} kg`, "Peso"]],
      },
      cue: { label: "Despiece", target: "despieces", aria: "Ir al despiece" },
    },
    {
      type: "systems-lanes", id: "despieces", nav: "Despiece", shield: room,
      title: "Sistemas",
      intro: "Elige un sistema. Cada uno aparece desmontado: pasa el ratón o pulsa un número para enfocar la pieza, y cambia a <b>Técnico</b> para ver las cifras.",
      hint: "Pulsa un número o una fila para fijar el enfoque; vuelve a pulsar para soltarlo. Las imágenes son despieces ilustrativos, no planos de fábrica.",
      lanes: [{
        key: "motor", name: "Motor", code: todo, image: "despiece-motor",
        caption: "Despiece ilustrativo del motor.", title: todo, line: todo, historia: todo,
        tecnico: [["Potencia", `${nf.format(hp)} ${unit}`, ...(rpm ? [`a ${nf.format(rpm)} rpm`] : [])], ["Par", `${nf.format(torque)} Nm`, ...(torqueRpm ? [`a ${nf.format(torqueRpm)} rpm`] : [])]],
        parts: [{ x: 50, y: 50, name: todo, short: todo, desc: todo, value: todo }],
      }],
    },
    {
      type: "duel-board", id: "duelo", nav: "Duelo", shield: "VS",
      title: `Duelo: ${model} contra ${rival.model || rival.name}`,
      intro: `El ${name} contra el ${rival.name}. Gana cada fila la cifra mejor.`,
      rival: rivalId,
      rows: ["power", "torque", "weight", "topSpeed"].filter((k) => typeof rival.specs?.[k]?.value === "number")
        .map((k) => ({ spec: k, better: k === "weight" ? "low" : "high", verdict: { historia: todo, tecnico: todo } })),
      note: { historia: todo, tecnico: todo },
    },
    { type: "facts-counters", id: "cifras", kicker: "Ficha técnica", title: `Cifras del ${model}`, specs: ["power", "torque", "weight", "topSpeed"] },
  ],
};

/* ---------- Página (plantilla: Sala 11) ---------- */
const tpl = data.cars.find((c) => c.slug === "evo");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
let page = (await readFile(join(root, TEMPLATE), "utf8")).replace(/\r\n/g, "\n");
const social = `${name} · Sala ${room}`;
page = page
  .replace(/\n[ \t]*<!-- seo:jsonld -->[\s\S]*?<!-- \/seo:jsonld -->/, "")              // lo regenera tools/build-seo.mjs con la ficha nueva
  .replaceAll(tpl.id, id)
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(name.toUpperCase())} · SALA ${room} · MOTORLAB MUSEUM</title>`)
  .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(car.meta.description)}"`)
  .replace(/(<meta (?:property="og|name="twitter):title" content=")[^"]*"/g, `$1${esc(social)}"`)
  .replace(/(<meta (?:property="og|name="twitter):description" content=")[^"]*"/g, `$1${esc(car.meta.description)}"`)
  .replace(/(<meta (?:property="og|name="twitter):image:alt" content=")[^"]*"/g, `$1${esc(car.images[`${slug}-hall`].alt)}"`)
  .replaceAll(`${SITE}/${tpl.slug}/img/${tpl.slug}-perfil`, `${SITE}/${slug}/img/${slug}-perfil`)
  .replaceAll(`${SITE}/${tpl.slug}/`, `${SITE}/${slug}/`);
if (page.includes(tpl.id) || page.includes(`/${tpl.slug}/`)) { console.error("✖ La plantilla ha cambiado: quedan referencias a la Sala 11 en la página generada."); process.exit(1); }

/* ---------- sitemap.xml ---------- */
const mapPath = join(root, "sitemap.xml");
const map = await readFile(mapPath, "utf8");
const entry = `  <url>\n    <loc>${SITE}/${slug}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
const nextMap = map.includes(`${SITE}/${slug}/`) ? map : map.replace(/\n?<\/urlset>/, (m) => `\n${entry.replace(/\n$/, "")}${m.startsWith("\n") ? "" : "\n"}${m}`);

const summary = `Sala ${room} · ${name}\n  id: ${id}\n  página: ${dir}/index.html\n  ficha: data/cars.json (posición ${index + 1} de ${data.cars.length + 1})\n  sitemap: ${SITE}/${slug}/\n  tema: ${theme} · color ${accent} (${hallAccent}) · rival del duelo: ${rival.name}`;
if (args["dry-run"]) { console.log(`Simulación (no se ha escrito nada):\n${summary}`); process.exit(0); }

/* ---------- Escritura ---------- */
const eol = raw.includes("\r\n") ? "\r\n" : "\n";
data.cars.splice(index, 0, car);
await mkdir(join(root, dir, "img"), { recursive: true });
await writeFile(join(root, dir, "index.html"), page);
await writeFile(dataPath, JSON.stringify(data, null, 2).replace(/\n/g, eol) + (raw.endsWith("\n") ? eol : ""));
if (nextMap !== map) await writeFile(mapPath, nextMap);

console.log(`✔ Creada como borrador (no se publica todavía):\n${summary}

Siguientes pasos:
  1. Sube las fotos a ${dir}/img/: ${slug}-perfil.jpg y despiece-motor.jpg, con sus copias .avif y .webp.
  2. En data/cars.json, sustituye cada «${todo}» de la sala «${id}» y añade los sistemas del despiece.
  3. node tools/build-data.mjs   (valida la ficha y regenera datos, cabeceras y datos estructurados)
  4. Para publicarla: quita "status": "coming_soon" (y "pendingImages") o pon "releaseDate"; después node tools/build-dist.mjs.`);
