/* =========================================================
   MUSEO · Cabeceras de seguridad y caché para el despliegue
   ---------------------------------------------------------
   Una única definición genera:
     · vercel.json  → Vercel
     · _headers     → Netlify y Cloudflare Pages (mismo formato)
     · _redirects   → Netlify y Cloudflare Pages: URLs públicas de las salas
   Uso:  node tools/build-headers.mjs   (también lo llama build-data.mjs)

   · Los hash de los <script> en línea se calculan leyendo los HTML:
     si cambias ese código, vuelve a ejecutar el script.
   · Las rutas de caché de imágenes salen de data/cars.json (las carpetas
     de su catálogo de imágenes), así una sala nueva queda cubierta sola.
   ========================================================= */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(await readFile(join(root, "data/cars.json"), "utf8"));

/* ---------- Hash de los scripts en línea de todas las páginas ---------- */
const dirOf = (c) => c.dir || c.slug;
const pages = ["index.html", ...data.cars.filter((c) => c.status !== "coming_soon").map((c) => `${dirOf(c)}/index.html`)];   // las salas "próximamente" no tienen página
const hashes = new Set();
for (const p of pages) {
  // Saltos de línea LF: los que publica el despliegue (el repositorio guarda LF aunque Windows
  // muestre CRLF con core.autocrlf); con CRLF el hash no coincidiría y el navegador bloquearía el script
  const html = (await readFile(join(root, p), "utf8")).replace(/\r\n/g, "\n");
  for (const [, code] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    hashes.add(`'sha256-${createHash("sha256").update(code, "utf8").digest("base64")}'`);
  }
}

/* ---------- Política ---------- */
const FONTS_CSS = "https://fonts.googleapis.com";
const FONTS_FILES = "https://fonts.gstatic.com";
// Google Analytics 4 (gtag.js en el <head> de todas las páginas)
const GA_SCRIPT = "https://www.googletagmanager.com";
const GA_BEACON = "https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com";
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(" ")} ${GA_SCRIPT}`,   // sin 'unsafe-inline' ni eval
  `style-src 'self' ${FONTS_CSS}`,
  `style-src-elem 'self' ${FONTS_CSS}`,                       // hojas y <style>: sólo propias + Google Fonts
  "style-src-attr 'unsafe-inline'",                           // atributos style="" que el motor genera desde los datos (coordenadas, proporciones)
  `font-src 'self' ${FONTS_FILES}`,
  `img-src 'self' data: ${GA_BEACON} ${GA_SCRIPT}`,      // data: para los SVG en línea de los temas
  "media-src 'self'",                                         // sonido del motor
  `connect-src 'self' ${GA_BEACON}`,                      // fetch de data/cars.json + envíos de GA4
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const security = {
  "Content-Security-Policy": csp,
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), browsing-topics=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};

/* Caché:
   · Imágenes, audio y fuentes: 1 año e inmutables. Requisito: si cambias el contenido
     de un archivo, cámbiale el nombre (como hicimos con r34-motor-despiece.jpg);
     con el mismo nombre, los visitantes seguirían viendo la versión anterior.
   · HTML, JS, CSS y JSON no llevan hash en el nombre: deben revalidarse siempre. Es lo que
     hacen por defecto Vercel, Netlify y Cloudflare Pages (max-age=0, must-revalidate), así que
     NO se declara: Netlify y Cloudflare unen con coma los valores de una cabecera que aparece
     en dos reglas, y una regla general chocaría con la de los medios. */
const IMMUTABLE = "public, max-age=31536000, immutable";
const MEDIA_EXT = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg", "mp3", "woff2", "woff"];
// Cada carpeta de imágenes en su ruta real (/rooms/cars/f40/img/*) y en la pública (/f40/img/*, la de los
// enlaces compartidos y Open Graph), que llega por la reescritura de su sala
const imageDirs = [...new Set(data.cars.flatMap((c) => Object.values(c.images || {}).flatMap((im) => {
  const dir = im.src.slice(0, im.src.lastIndexOf("/"));
  return [`/${dir}/*`, `/${c.slug}${dir.slice(dirOf(c).length)}/*`];
})))];
const audioFiles = data.cars.filter((c) => c.audio?.src).flatMap((c) => [`/${c.audio.src}`, `/${c.slug}${c.audio.src.slice(dirOf(c).length)}`]);

/* URLs públicas de las salas: /f40/… se sirve desde rooms/cars/f40/… (el código vive ordenado por alas;
   las direcciones compartidas, el sitemap y Open Graph no cambian). Incluye las salas en desarrollo:
   sus imágenes ya se enlazan desde el Hall. */
const rewrites = data.cars.filter((c) => dirOf(c) !== c.slug).map((c) => ({ from: `/${c.slug}`, to: `/${dirOf(c)}` }));

/* ---------- vercel.json ---------- */
const vercel = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  // Se publica sólo dist/ (tools/build-dist.mjs): sin originales PNG, notas ni herramientas
  framework: null,
  buildCommand: "node tools/build-dist.mjs",
  outputDirectory: "dist",
  // URLs limpias: /temerario/ en vez de /temerario/index.html
  cleanUrls: true,
  trailingSlash: true,
  rewrites: rewrites.map(({ from, to }) => ({ source: `${from}/:path*`, destination: `${to}/:path*` })),
  headers: [
    { source: "/(.*)", headers: Object.entries(security).map(([key, value]) => ({ key, value })) },
    { source: `/(.*)\\.(${MEDIA_EXT.join("|")})`, headers: [{ key: "Cache-Control", value: IMMUTABLE }] },
  ],
};
await writeFile(join(root, "vercel.json"), JSON.stringify(vercel, null, 2) + "\n");

/* ---------- _headers (Netlify / Cloudflare Pages) ----------
   Ambos aplican todas las reglas que coinciden: cada cabecera se declara en una sola. */
const block = (path, headers) => `${path}\n${Object.entries(headers).map(([k, v]) => `  ${k}: ${v}`).join("\n")}\n`;
const netlify = [
  "# ARCHIVO GENERADO por tools/build-headers.mjs — no lo edites a mano.",
  "# Netlify y Cloudflare Pages. Fuente de la política: tools/build-headers.mjs",
  "",
  block("/*", security),
  ...[...imageDirs, ...audioFiles].map((p) => block(p, { "Cache-Control": IMMUTABLE })),
].join("\n");
await writeFile(join(root, "_headers"), netlify);

/* ---------- _redirects (Netlify / Cloudflare Pages): reescrituras 200, no redirecciones ---------- */
await writeFile(join(root, "_redirects"), [
  "# ARCHIVO GENERADO por tools/build-headers.mjs — no lo edites a mano.",
  "# URLs públicas de las salas → su carpeta en rooms/ (200 = reescritura: la dirección no cambia).",
  ...rewrites.flatMap(({ from, to }) => [`${from}  ${from}/  301`, `${from}/*  ${to}/:splat  200`]),   // sin barra → con barra (como trailingSlash en Vercel)
  "",
].join("\n"));

console.log(`✔ vercel.json, _headers y _redirects generados · ${rewrites.length} salas reescritas · ${hashes.size} hash de script en línea · caché inmutable en: ${[...imageDirs, ...audioFiles].join(", ")}`);
