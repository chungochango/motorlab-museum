// Servidor estático mínimo para previsualizar el museo en local (sin dependencias).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

// Uso: node .claude/serve.mjs [carpeta] [puerto]  (p. ej. "dist 5174" para probar la carpeta de publicación)
const project = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const root = process.argv[2] ? join(project, process.argv[2]) : project;
const port = Number(process.argv[3] || process.env.PORT) || 5173;

// Paridad con el despliegue: aplica las cabeceras de la regla "/*" de _headers (CSP incluida)
const prodHeaders = await readFile(join(root, "_headers"), "utf8").then((txt) => {
  const block = txt.split(/\r?\n(?=\S)/).find((b) => b.startsWith("/*")) || "";
  return Object.fromEntries(block.split(/\r?\n/).slice(1).map((l) => l.trim()).filter((l) => l.includes(": "))
    .map((l) => [l.slice(0, l.indexOf(": ")), l.slice(l.indexOf(": ") + 2)]));
}).catch(() => ({}));
// Paridad con el despliegue: reescrituras (200) y redirecciones (301) de _redirects. Las salas viven en
// rooms/cars|bikes/<slug>/ pero se visitan en /<slug>/ (las genera tools/build-headers.mjs)
const rules = await readFile(join(root, "_redirects"), "utf8").then((txt) => txt.split(/\r?\n/)
  .filter((l) => l.trim() && !l.startsWith("#")).map((l) => l.trim().split(/\s+/))
  .map(([from, to, code]) => ({ from, to, code: Number(code) }))).catch(() => []);
const route = (path) => {
  for (const { from, to, code } of rules) {
    if (from.endsWith("/*") && path.startsWith(from.slice(0, -1))) return { path: to.replace(":splat", path.slice(from.length - 1)), code };
    if (path === from) return { path: to, code };
  }
  return { path, code: 200 };
};
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp3": "audio/mpeg", ".svg": "image/svg+xml", ".avif": "image/avif", ".json": "application/json",
};

createServer(async (req, res) => {
  // Como en producción: un archivo que existe se sirve tal cual; la reescritura sólo cubre lo que falta
  const asked = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const exists = await stat(join(root, asked.endsWith("/") ? `${asked}index.html` : asked)).then((s) => s.isFile(), () => false);
  const r = exists ? { path: asked, code: 200 } : route(asked);
  if (r.code === 301) { res.writeHead(301, { Location: r.path }).end(); return; }
  let path = r.path;
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { ...prodHeaders, "Content-Type": types[extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("No encontrado");
  }
}).listen(port, () => console.log(`Museo en http://localhost:${port}/`));
