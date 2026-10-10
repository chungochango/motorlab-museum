/* =========================================================
   MUSEO · Carpeta de publicación (dist/)
   ---------------------------------------------------------
   Copia a dist/ sólo lo que la web usa: páginas, motor, temas,
   datos, recursos comunes y, del catálogo PÚBLICO (tools/public-catalog.mjs:
   salas abiertas, con apertura próxima o anunciadas), cada imagen
   con sus formatos (avif/webp) y su variante de alta resolución.
   Los borradores y las salas a largo plazo no salen: ni su página,
   ni sus imágenes, ni su ficha en dist/data/cars.json, ni sus rutas
   en _headers, _redirects o sitemap.xml. Nada de originales PNG, notas de procedencia,
   herramientas ni documentación. Incluye _headers (Netlify y
   Cloudflare Pages lo leen desde la carpeta publicada).
   Después comprueba que toda ruta referenciada existe en dist/.

   Uso:  node tools/build-dist.mjs   (lo ejecutan Vercel y Netlify al desplegar)
   Antes, en local: node tools/build-data.mjs (datos, preload y cabeceras).
   ========================================================= */
import { readFile, writeFile, readdir, mkdir, copyFile, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, posix } from "node:path";
import { publicCatalog } from "./public-catalog.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const full = JSON.parse(await readFile(join(root, "data/cars.json"), "utf8"));
const { data, hidden } = publicCatalog(full);          // sólo lo que ya puede verse; el resto no sale de aquí
const rooms = data.cars.filter((c) => c.status !== "coming_soon");
const files = new Set();
const problems = [];
const add = (p) => { if (p) files.add(posix.normalize(p.replace(/\\/g, "/").replace(/^\/+/, ""))); };
const withExt = (src, ext) => src.replace(/\.[a-z0-9]+$/i, `.${ext}`);

async function walk(dir, skip = () => false) {
  for (const e of await readdir(join(root, dir), { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (skip(p)) continue;
    if (e.isDirectory()) await walk(p, skip); else add(p);
  }
}

/* ---------- Qué se publica ---------- */
["index.html", "_headers", "_redirects", "robots.txt", "sitemap.xml", "manifest.json", "sw.js"].forEach(add);
// Imágenes para redes sociales (og:image) que no están en el catálogo: X/Facebook no leen AVIF y no todos leen WebP
["rooms/cars/f40/img/f40-perfil.jpg"].forEach(add);
await walk("engine");
await walk("themes");
await walk("assets", (p) => p.endsWith(".md"));
const dirOf = (c) => c.dir || c.slug;          // carpeta de la sala: rooms/cars/f40 (su URL pública sigue siendo /f40/)
for (const c of rooms) add(`${dirOf(c)}/index.html`);
for (const c of data.cars) {
  for (const im of Object.values(c.images || {})) {
    for (const v of [im, im.hires].filter(Boolean)) {
      add(v.src);
      (v.formats || []).forEach((f) => add(withExt(v.src, f)));
    }
  }
  if (c.audio?.src) add(c.audio.src);
  if (c.colors?.base) add(c.colors.base);
  (c.colors?.list || []).forEach((k) => k.file && add(k.file));
}

/* ---------- Copia ---------- */
await rm(out, { recursive: true, force: true });
let bytes = 0;
for (const f of [...files].sort()) {
  try {
    const s = await stat(join(root, f));
    await mkdir(dirname(join(out, f)), { recursive: true });
    await copyFile(join(root, f), join(out, f));
    bytes += s.size;
  } catch { problems.push(`falta en el proyecto: ${f}`); }
}
/* Página de cada sala también en su URL pública (dist/f40/index.html): Vercel no sirve el index.html
   de una carpeta a través de una reescritura (/f40/ → /rooms/cars/f40/ daba 404 en producción), así que
   la página va como archivo real. Sus rutas relativas (../../../engine/…) desde /f40/ llegan igual a la
   raíz, y sus imágenes salen del catálogo (rooms/…). El resto de /f40/… (imágenes compartidas, Open
   Graph) sigue llegando por la reescritura de archivos. */
for (const c of rooms) {
  if (dirOf(c) === c.slug) continue;
  await mkdir(join(out, c.slug), { recursive: true });
  await copyFile(join(root, dirOf(c), "index.html"), join(out, c.slug, "index.html"));
  files.add(`${c.slug}/index.html`);
}

/* ---------- Datos y rutas: sólo el catálogo público ---------- */
const GENERATED = `/* ARCHIVO GENERADO por tools/build-dist.mjs — catálogo público. Fuente: data/cars.json */\n`;
await mkdir(join(out, "data"), { recursive: true });
await writeFile(join(out, "data/cars.json"), JSON.stringify(data));
await writeFile(join(out, "data/cars.js"), `${GENERATED}window.MUSEO = ${JSON.stringify(data)};\n`);
files.add("data/cars.json"); files.add("data/cars.js");
if (hidden.length) {
  // Rutas de una sala oculta: su URL pública (/slug) y su carpeta (/rooms/…)
  const isHidden = (path) => hidden.some((c) => [`/${c.slug}`, `/${dirOf(c)}`].some((p) => path === p || path.startsWith(`${p}/`)));
  const rewrite = async (file, fn) => writeFile(join(out, file), fn((await readFile(join(out, file), "utf8")).replace(/\r\n/g, "\n")));
  // _headers: bloques «ruta + cabeceras» separados por una línea en blanco
  await rewrite("_headers", (t) => t.split(/\n{2,}/).filter((b) => !isHidden(b.trim().split("\n")[0].trim())).join("\n\n"));
  await rewrite("_redirects", (t) => t.split("\n").filter((l) => !isHidden(l.trim().split(/\s+/)[0] || "")).join("\n"));
  await rewrite("sitemap.xml", (t) => t.replace(/[ \t]*<url>[\s\S]*?<\/url>\n?/g, (u) => (hidden.some((c) => u.includes(`.com/${c.slug}/`)) ? "" : u)));
}
// Service worker: sello del despliegue (un sello nuevo jubila las copias guardadas por el anterior)
await writeFile(join(out, "sw.js"), (await readFile(join(out, "sw.js"), "utf8")).replace("const VERSION = \"__BUILD__\"", `const VERSION = "${Date.now().toString(36)}"`));
// Red de seguridad: nada de una sala oculta puede haber llegado a los archivos de texto publicados
for (const f of ["data/cars.json", "data/cars.js", "_headers", "_redirects", "sitemap.xml"]) {
  const text = await readFile(join(out, f), "utf8");
  for (const c of hidden) if (text.includes(c.id) || text.includes(`/${c.slug}/`)) problems.push(`${f} contiene la sala oculta ${c.id}`);
}

/* ---------- Comprobación de rutas dentro de dist/ ---------- */
const inDist = (p) => files.has(posix.normalize(p));
// URL pública de una sala → su carpeta real (las mismas reescrituras que vercel.json y _redirects): "f40/…" → "rooms/cars/f40/…"
const publicToReal = (p) => {
  const c = data.cars.find((x) => p === x.slug || p.startsWith(`${x.slug}/`));
  return c && dirOf(c) !== c.slug ? dirOf(c) + p.slice(c.slug.length) : p;
};
// 1) Enlaces locales de cada página (src/href relativos)
for (const page of ["index.html", ...rooms.map((c) => `${dirOf(c)}/index.html`)]) {
  const html = await readFile(join(root, page), "utf8");
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"#?:]+)"/g)) {
    // URLs limpias: una carpeta ("/", "f40/", "/temerario/") sirve su index.html; "/…" va desde la raíz
    const file = ref.endsWith("/") ? `${ref}index.html` : ref;
    const target = publicToReal(file.startsWith("/") ? file.slice(1) : posix.normalize(posix.join(posix.dirname(page), file)));
    if (!inDist(target)) problems.push(`${page} → ${ref} (no está en dist)`);
  }
}
// 2) Tema y módulos que cada sala carga por JavaScript
for (const c of rooms) {
  if (!inDist(`themes/${c.theme}.css`)) problems.push(`${c.id}: falta themes/${c.theme}.css`);
  for (const s of c.sections) if (!inDist(`engine/modules/${s.type}.js`)) problems.push(`${c.id}: falta engine/modules/${s.type}.js`);
}

if (problems.length) {
  console.error(`✖ dist/ incompleto (${problems.length}):\n  · ${problems.join("\n  · ")}`);
  process.exit(1);
}
console.log(`✔ dist/ listo · ${files.size} archivos · ${(bytes / 1048576).toFixed(1)} MB · ${rooms.length} salas · 0 rutas rotas${hidden.length ? ` · ${hidden.length} sala(s) fuera del catálogo público: ${hidden.map((c) => c.id).join(", ")}` : " · catálogo público completo"}`);
