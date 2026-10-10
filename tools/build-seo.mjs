/* =========================================================
   MUSEO · Cabecera de las páginas: datos estructurados y PWA
   ---------------------------------------------------------
   Las salas se componen con JavaScript, así que lo que un buscador
   lee sin ejecutar nada tiene que estar escrito en el HTML. Este
   script mantiene en el <head> de cada página, a partir de
   data/cars.json:
     · el enlace al manifiesto de la aplicación (manifest.json);
     · en cada sala, un bloque JSON-LD (schema.org): ItemPage cuyo
       tema principal es un Car con marca, modelo, año, motor,
       potencia, par, velocidad máxima, peso y tipo de carrocería.
   El bloque va entre <!-- seo:jsonld --> y <!-- /seo:jsonld --> y se
   reescribe entero en cada ejecución: no lo edites a mano.
   (Un <script type="application/ld+json"> son datos, no código: la CSP
   no lo bloquea y no necesita hash.)

   Uso:  node tools/build-seo.mjs   (también lo llama build-data.mjs)
   ========================================================= */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, posix } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.motorlabmuseum.com";
const dirOf = (c) => c.dir || c.slug;
const num = (s) => (s && typeof s.value === "number" ? s.value : null);
const quantity = (value, unitText, unitCode) => (value == null ? undefined : { "@type": "QuantitativeValue", value, unitText, ...(unitCode ? { unitCode } : {}) });
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ""));

export function jsonLd(car, museum) {
  const s = car.specs || {};
  const hero = Object.values(car.images || {}).find((im) => im.role === "hero") || Object.values(car.images || {})[0];
  const image = hero ? `${SITE}/${car.slug}${hero.src.slice(dirOf(car).length)}` : undefined;
  const power = num(s.power);
  const engine = clean({
    "@type": "EngineSpecification",
    name: typeof s.engine?.value === "string" ? s.engine.value : undefined,
    enginePower: quantity(power, s.power?.unit === "PS" ? "PS" : "CV"),                 // caballos métricos
    torque: quantity(num(s.torque), "N·m", "NU"),
    engineDisplacement: quantity(num(s.displacement), "cm³", "CMQ"),
  });
  const vehicle = clean({
    "@type": "Car",
    name: car.name,
    brand: { "@type": "Brand", name: car.brand },
    manufacturer: { "@type": "Organization", name: car.brand },
    model: car.model || car.name,
    vehicleModelDate: String(car.year),
    productionDate: car.years,
    bodyType: car.bodyType,
    category: car.category,
    image,
    vehicleEngine: Object.keys(engine).length > 1 ? engine : undefined,
    speed: quantity(num(s.topSpeed), "km/h", "KMH"),
    weight: quantity(num(s.weight), "kg", "KGM"),
    accelerationTime: s.acceleration?.label?.includes("100") ? quantity(num(s.acceleration), "s", "SEC") : undefined,
    driveWheelConfiguration: typeof s.drivetrain?.value === "string" ? s.drivetrain.value : undefined,
    vehicleTransmission: typeof s.transmission?.value === "string" ? s.transmission.value : undefined,
  });
  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${SITE}/${car.slug}/`,
    url: `${SITE}/${car.slug}/`,
    name: car.meta?.title || car.name,
    description: car.meta?.description,
    inLanguage: "es",
    isPartOf: { "@type": "WebSite", name: "MotorLab Museum", alternateName: museum?.name, url: `${SITE}/` },
    primaryImageOfPage: image ? { "@type": "ImageObject", url: image } : undefined,
    mainEntity: vehicle,
  };
}

const START = "<!-- seo:jsonld -->", END = "<!-- /seo:jsonld -->";
// "<" escapado: el JSON nunca puede cerrar la etiqueta <script> desde un texto de la ficha
const block = (obj) => `${START}\n  <script type="application/ld+json">${JSON.stringify(clean(obj)).replace(/</g, "\\u003c")}</script>\n  ${END}`;

export async function buildSeo({ quiet = false } = {}) {
  const data = JSON.parse(await readFile(join(root, "data/cars.json"), "utf8"));
  const rooms = data.cars.filter((c) => c.status !== "coming_soon");
  let changed = 0;
  const update = async (page, { ld }) => {
    const path = join(root, page);
    const before = await readFile(path, "utf8");
    const nl = before.includes("\r\n") ? "\r\n" : "\n";
    let html = before.replace(/\r\n/g, "\n");
    // Manifiesto de la aplicación: junto a los iconos, con la misma ruta relativa que ellos
    if (!/rel="manifest"/.test(html)) {
      const up = posix.relative(posix.dirname(page), ".") || ".";
      html = html.replace(/(\n[ \t]*<link rel="apple-touch-icon"[^>]*>)/, `$1\n  <link rel="manifest" href="${up === "." ? "" : `${up}/`}manifest.json" />`);
    }
    if (ld) {
      const next = block(ld);
      html = html.includes(START) ? html.replace(new RegExp(`${START}[\\s\\S]*?${END}`), () => next) : html.replace(/\n<\/head>/, () => `\n  ${next}\n</head>`);
    }
    if (html !== before.replace(/\r\n/g, "\n")) { await writeFile(path, html.replace(/\n/g, nl)); changed++; }
  };
  await update("index.html", {});
  for (const c of rooms) await update(`${dirOf(c)}/index.html`, { ld: jsonLd(c, data.museum) });
  if (!quiet) console.log(`✔ datos estructurados y manifiesto · ${rooms.length} salas${changed ? ` · ${changed} página(s) actualizada(s)` : " · sin cambios"}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await buildSeo();
