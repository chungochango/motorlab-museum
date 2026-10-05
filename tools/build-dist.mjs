/* =========================================================
   MUSEO · Carpeta de publicación (dist/)
   ---------------------------------------------------------
   Copia a dist/ sólo lo que la web usa: páginas, motor, temas,
   datos, recursos comunes y, del catálogo de data/cars.json, cada
   imagen con sus formatos (avif/webp) y su variante de alta
   resolución. Nada de originales PNG, notas de procedencia,
   herramientas ni documentación. Incluye _headers (Netlify y
   Cloudflare Pages lo leen desde la carpeta publicada).
   Después comprueba que toda ruta referenciada existe en dist/.

   Uso:  node tools/build-dist.mjs   (lo ejecutan Vercel y Netlify al desplegar)
   Antes, en local: node tools/build-data.mjs (datos, preload y cabeceras).
   ========================================================= */
import { readFile, readdir, mkdir, copyFile, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, posix } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const data = JSON.parse(await readFile(join(root, "data/cars.json"), "utf8"));
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
["index.html", "_headers", "data/cars.json", "data/cars.js", "robots.txt", "sitemap.xml"].forEach(add);
// Imágenes para redes sociales (og:image) que no están en el catálogo: X/Facebook no leen AVIF y no todos leen WebP
["f40/img/f40-perfil.jpg"].forEach(add);
await walk("engine");
await walk("themes");
await walk("assets", (p) => p.endsWith(".md"));
for (const c of rooms) add(`${c.slug}/index.html`);
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

/* ---------- Comprobación de rutas dentro de dist/ ---------- */
const inDist = (p) => files.has(posix.normalize(p));
// 1) Enlaces locales de cada página (src/href relativos)
for (const page of ["index.html", ...rooms.map((c) => `${c.slug}/index.html`)]) {
  const html = await readFile(join(root, page), "utf8");
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"#?:]+)"/g)) {
    // URLs limpias: una carpeta ("/", "f40/", "/temerario/") sirve su index.html; "/…" va desde la raíz
    const file = ref.endsWith("/") ? `${ref}index.html` : ref;
    const target = file.startsWith("/") ? file.slice(1) : posix.normalize(posix.join(posix.dirname(page), file));
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
console.log(`✔ dist/ listo · ${files.size} archivos · ${(bytes / 1048576).toFixed(1)} MB · ${rooms.length} salas · 0 rutas rotas`);
