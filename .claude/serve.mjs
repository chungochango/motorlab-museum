// Servidor estático mínimo para previsualizar el museo en local (sin dependencias).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
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
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp3": "audio/mpeg", ".svg": "image/svg+xml", ".avif": "image/avif", ".json": "application/json",
};

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
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
