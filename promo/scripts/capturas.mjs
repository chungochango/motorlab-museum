/* =========================================================
   Capturas reales del museo para el vídeo MacbookShowcase
   ---------------------------------------------------------
   Abre el museo local (node .claude/serve.mjs → localhost:5173)
   en el Chrome sin interfaz que trae Remotion y lo maneja por el
   protocolo de DevTools (sin dependencias: WebSocket de Node 22+).
   Por cada toma navega, hace scroll o pulsa lo mismo que haría una
   persona, guarda la pantalla a 1440 × 900 con densidad 2 y anota
   dónde están los botones que el cursor del vídeo debe pulsar.
     Salida: promo/public/web/<toma>.jpg + promo/public/web/tomas.json
   Uso:  node promo/scripts/capturas.mjs   (con el servidor local en marcha)
   ========================================================= */
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const promo = join(here, "..");
const out = join(promo, "public", "web");
const SITE = process.env.SITE || "http://localhost:5173";
const W = 1440, H = 900, DPR = 2, PORT = 9333;
const CHROME = join(promo, "node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe");
const sharp = createRequire(join(promo, "..", "..", ".herramientas", "package.json"))("sharp");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Chrome + CDP ---------- */
const profile = join(tmpdir(), `museo-capturas-${Date.now()}`);
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--hide-scrollbars", "--no-first-run", "--mute-audio", "about:blank"], { stdio: "ignore" });
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page"); } catch { /* aún arrancando */ }
}
if (!target) throw new Error("Chrome no arrancó");
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = ++seq;
  pending.set(id, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
  ws.send(JSON.stringify({ id, method, params }));
});
const run = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: DPR, mobile: false });
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });

const go = async (path) => { await send("Page.navigate", { url: SITE + path }); await sleep(2600); };
// Sin el aviso de privacidad en las capturas: se registra la opción "sólo esenciales"
await go("/");
await run(`localStorage.setItem("museo.consent", JSON.stringify({ status: "essential", date: new Date().toISOString(), version: 1 }))`);

// Rectángulo de un elemento en píxeles de la captura (1440 × 900)
const rect = (sel) => run(`const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), w: Math.round(r.width), h: Math.round(r.height) };`);
const scrollTo = (sel, offset = 0) => run(`document.documentElement.style.scrollBehavior = "auto"; const e = document.querySelector(${JSON.stringify(sel)}); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - ${offset}); await new Promise((r) => setTimeout(r, 1800));`);
const click = (sel) => run(`document.querySelector(${JSON.stringify(sel)}).click(); await new Promise((r) => setTimeout(r, 1200));`);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const shots = {};
const shot = async (name, extra = {}) => {
  await sleep(500);
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  await sharp(Buffer.from(data, "base64")).jpeg({ quality: 86, mozjpeg: true }).toFile(join(out, `${name}.jpg`));
  shots[name] = { file: `web/${name}.jpg`, url: (await run("return location.pathname")), ...extra };
  console.log(`✔ ${name}`);
};

/* ---------- Tomas ---------- */
// Hall: el anillo con el F40 al frente y su botón "Entrar en la sala"
await go("/");
await sleep(1500);
await shot("hall", { click: await rect('.orbit__info.is-current .hall__cta') });

// Sala 01 · F40: portada, despiece por capas (índice lateral: chasis, motor, aerodinámica)
await go("/f40/");
await sleep(1500);
await shot("f40-portada");
await scrollTo("#piezas", 0);
await shot("f40-piezas", { index: { chasis: await rect('.dive__index a[href="#p-chasis"]'), motor: await rect('.dive__index a[href="#p-motor"]'), aero: await rect('.dive__index a[href="#p-aero"]') } });
for (const [id, key] of [["p-chasis", "chasis"], ["p-motor", "motor"], ["p-aero", "aero"]]) {
  await scrollTo(`#${id}`, 80);
  await shot(`f40-${key}`, { index: { chasis: await rect('.dive__index a[href="#p-chasis"]'), motor: await rect('.dive__index a[href="#p-motor"]'), aero: await rect('.dive__index a[href="#p-aero"]') } });
}

// Sala 07 · 190E: portada, siete sistemas (pestaña Aerodinámica) y duelo contra el M3
await go("/190e/");
await sleep(1500);
await shot("190e-portada");
await scrollTo("#despieces", 20);
await shot("190e-sistemas", { click: await rect('[data-lane="aero"]') });
await click('[data-lane="aero"]');
await shot("190e-aero");
await scrollTo("#duelo", 20);
await sleep(1200);
await shot("190e-duelo");

await writeFile(join(out, "tomas.json"), JSON.stringify({ width: W, height: H, shots }, null, 2) + "\n");
ws.close();
chrome.kill();
await sleep(500);
await rm(profile, { recursive: true, force: true }).catch(() => {});
console.log(`✔ ${Object.keys(shots).length} tomas en public/web (tomas.json con las coordenadas de clic)`);
