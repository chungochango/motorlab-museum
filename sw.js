/* =========================================================
   MUSEO · Service worker (mínimo)
   ---------------------------------------------------------
   Sólo toca peticiones GET del propio sitio; lo de fuera (fuentes
   de Google, analítica) pasa de largo sin tocar.
     · Páginas y datos (HTML, /data/…): SIEMPRE red primero. Una sala
       programada tiene que abrirse a su hora y un despliegue nuevo
       tiene que verse al momento; la copia guardada sólo sirve sin
       conexión.
     · Imágenes, audio y fuentes propias: caché primero (sus nombres
       no se reutilizan: si cambia el contenido, cambia el nombre).
     · CSS y JavaScript (motor, temas, Motion): se sirve la copia y se
       refresca por detrás para la visita siguiente.
   tools/build-dist.mjs sustituye __BUILD__ por el sello de cada
   despliegue: con un service worker nuevo, las copias viejas se borran.
   ========================================================= */
const VERSION = "__BUILD__";
const CACHE = `museo-${VERSION}`;
// Lo imprescindible para pintar el Hall y entrar en una sala (rutas desde la raíz del sitio)
const PRECACHE = [
  "engine/core.js", "engine/hall.js", "engine/hall-orbit.js", "engine/hall-index.js", "engine/hall.css",
  "engine/sala.js", "engine/sala.css", "engine/fx/hall-motion.js", "engine/fx/hall-motion.css",
  "engine/fx/room-motion.js", "engine/fx/room-motion.css", "engine/vendor/motion.min.js",
  "assets/museo-consent.js", "assets/museo-consent.css", "assets/museo-transiciones.css", "assets/logo-mark.png",
];

self.addEventListener("install", (event) => {
  // Si un archivo falla no se bloquea la instalación: se guardará al usarlo
  event.waitUntil(caches.open(CACHE).then((cache) => Promise.allSettled(PRECACHE.map((p) => cache.add(new Request(p, { cache: "reload" }))))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("museo-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const MEDIA = /\.(?:avif|webp|jpe?g|png|gif|svg|mp3|woff2?)$/i;
const CODE = /\.(?:css|js)$/i;
const store = (request, response) => { if (response && response.ok && response.type === "basic") caches.open(CACHE).then((cache) => cache.put(request, response.clone())); return response; };

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;                         // terceros: sin intervenir
  if (url.pathname.endsWith("/sw.js")) return;

  if (MEDIA.test(url.pathname)) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((r) => store(request, r))));
    return;
  }
  if (CODE.test(url.pathname)) {
    event.respondWith(caches.match(request).then((hit) => {
      const fresh = fetch(request).then((r) => store(request, r)).catch(() => hit);
      return hit || fresh;
    }));
    return;
  }
  // Páginas, data/cars.json y lo demás: red primero; sin conexión, la última copia
  event.respondWith(fetch(request).then((r) => store(request, r)).catch(() => caches.match(request, { ignoreSearch: request.mode === "navigate" }).then((hit) => hit || Response.error())));
});
