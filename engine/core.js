/* =========================================================
   MUSEO · NÚCLEO DEL MOTOR DE SALAS
   ---------------------------------------------------------
   Utilidades y componentes que comparten todas las salas:
     · rutas, plantillas y texto por modo de lectura
     · memoria por sala (museo.<id>), sólo con consentimiento
     · registro de módulos (engine/modules/*.js)
     · cabecera, progreso, modo Historia/Técnico, colores,
       audio, lightbox, enfoque óptico, aparición al scroll,
       salidas y pie con el aviso legal
   No contiene contenido: todo llega de data/cars.js.
   ========================================================= */
(() => {
  "use strict";

  const Museo = (window.Museo = window.Museo || {});

  /* ---------- Utilidades ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");
  // Número de sala: el orden en cars.json, salvo que el coche fije el suyo (un ala propia: "room": "M-01")
  const roomNo = (car, i) => car.room || pad2(i + 1);

  // Raíz del museo: la carpeta que contiene engine/ (funciona con http:// y con file://)
  const ROOT = new URL("../", document.currentScript.src);
  const url = (p) => (p ? new URL(p, ROOT).href : "");

  // Carpeta de una sala (rooms/cars/f40) y su enlace: en la web, la URL pública limpia (/f40/, que
  // vercel.json y _redirects reescriben a su carpeta); con file://, el index.html de la carpeta
  const web = /^https?:$/.test(location.protocol);

  /* Vista previa local: en tu ordenador (localhost o file://), «?vista-previa» en la dirección
     ignora las fechas de apertura para revisar una sala programada antes de su estreno. En la
     web publicada no hace nada. Los enlaces entre salas la conservan mientras esté activa. */
  const local = !web || /^(localhost|127\.0\.0\.1|\[::1\])$|\.localhost$/.test(location.hostname);
  const preview = local && new URLSearchParams(location.search).has("vista-previa");
  const keep = (href) => (preview ? `${href}?vista-previa` : href);

  const roomDir = (car) => car.dir || car.slug;
  const roomHref = (car) => keep(web ? `/${car.slug}/` : url(`${roomDir(car)}/index.html`));

  Object.assign(Museo, { $, $$, clamp, esc, pad2, roomNo, roomDir, roomHref, url, reduceMotion, finePointer, preview });

  // Aviso fijo mientras la vista previa está activa, para no confundirla con lo que ve el público
  if (preview) {
    addEventListener("DOMContentLoaded", () => document.body.insertAdjacentHTML("beforeend",
      `<p role="status" style="position:fixed;left:12px;bottom:12px;z-index:9999;margin:0;padding:8px 12px;border-radius:6px;background:#ffd400;color:#111;font:600 12px/1.3 system-ui,sans-serif;letter-spacing:.04em;box-shadow:0 6px 20px rgba(0,0,0,.5)">VISTA PREVIA LOCAL · fechas de apertura ignoradas</p>`));
  }

  /* ---------- Publicación programada ----------
     "releaseDate" (ISO 8601 con zona: "2026-10-10T18:00:00+02:00") cierra una sala hasta esa
     fecha; sin fecha, o con una ya pasada, está abierta. Abierta del todo = desbloqueada y con
     página (status distinto de "coming_soon"). Es un cierre de presentación en el navegador:
     los datos y la página ya están publicados, así que no sirve para ocultar nada sensible. */
  const releaseTime = (car) => (car?.releaseDate ? Date.parse(car.releaseDate) : NaN);
  const isRoomUnlocked = (car, now = Date.now()) => preview || !(releaseTime(car) > now);
  const isRoomOpen = (car, now) => car.status !== "coming_soon" && isRoomUnlocked(car, now);
  const isScheduled = (car, now) => !isRoomUnlocked(car, now);
  // Fecha de apertura en hora de Madrid (la del museo): "sáb 10 oct · 18:00 h"
  const releaseFmt = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const releaseLabel = (car) => {
    const t = releaseTime(car);
    if (Number.isNaN(t)) return "";
    const p = Object.fromEntries(releaseFmt.formatToParts(t).map((x) => [x.type, x.value.replace(".", "")]));
    return `${p.weekday} ${p.day} ${p.month} · ${p.hour}:${p.minute} h`;
  };
  // Cuenta atrás: "2 d 04 h 12 min" y, en el último día, "04:12:09"
  const countdownText = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    return d ? `${d} d ${pad2(h)} h ${pad2(m)} min` : `${pad2(h)}:${pad2(m)}:${pad2(s % 60)}`;
  };
  /* Pone en marcha las cuentas atrás de la página: cada [data-release="<ISO>"] muestra
     "Abre en …". Al llegar a cero, si alguna lleva data-reload (la sala ya tiene página),
     se recarga para abrirla; si no, el texto pasa a data-after ("Próximamente"). */
  let countdownTimer = 0;
  const countdowns = () => {
    const tick = () => {
      const els = $$("[data-release]");
      if (!els.length) { clearInterval(countdownTimer); countdownTimer = 0; return; }
      let reload = false;
      els.forEach((el) => {
        const left = Date.parse(el.dataset.release) - Date.now();
        if (left > 0) { el.textContent = `Abre en ${countdownText(left)}`; return; }
        if (el.hasAttribute("data-reload")) reload = true;
        el.textContent = el.dataset.after || "Próximamente";
        el.removeAttribute("data-release");
      });
      if (reload) location.reload();
    };
    tick();
    if (!countdownTimer) countdownTimer = setInterval(tick, 1000);
  };
  Object.assign(Museo, { releaseTime, isRoomUnlocked, isRoomOpen, isScheduled, releaseLabel, countdownText, countdowns });

  /* Imagen que todavía no se ha subido (sala recién añadida a cars.json): se oculta en vez de
     mostrar el icono de imagen rota; la sala funciona igual y la foto aparece en cuanto exista.
     Una <picture> sin avif/webp cae al archivo original antes de marcarse como ausente. */
  document.addEventListener("error", (ev) => {
    const el = ev.target;
    if (el instanceof HTMLImageElement && !el.classList.contains("is-missing")) {
      el.classList.add("is-missing");
      console.warn(`Imagen no encontrada: ${el.currentSrc || el.src}`);
    }
  }, true);

  /* Texto según el modo de lectura.
     v = "texto"                      → igual en los dos modos
     v = { historia: …, tecnico: … }  → una variante por modo (clases m-historia / m-tecnico)
     render(contenido, clase) devuelve el HTML de cada variante. */
  Museo.isByMode = (v) => v && typeof v === "object" && !Array.isArray(v) && ("historia" in v || "tecnico" in v);
  Museo.byMode = (v, render) => {
    if (v == null) return "";
    if (!Museo.isByMode(v)) return render(v, "");
    return (v.historia != null ? render(v.historia, "m-historia") : "") + (v.tecnico != null ? render(v.tecnico, "m-tecnico") : "");
  };

  /* Bloque de ficha por modo: { text:[…], specs:[[dt, dd]…], note } → m-historia / m-tecnico */
  const modeBlock = (b, cls) => b ? `
    <div class="${cls}">
      ${(b.text || []).map((t) => `<p class="card__text">${t}</p>`).join("")}
      ${b.specs?.length ? `<dl class="specs-list">${b.specs.map(([dt, dd]) => `<div><dt>${esc(dt)}</dt><dd>${esc(dd)}</dd></div>`).join("")}</dl>` : ""}
      ${b.note ? `<p class="card__note">${esc(b.note)}</p>` : ""}
    </div>` : "";
  Museo.modeBlocks = (item) => modeBlock(item.historia, "m-historia") + modeBlock(item.tecnico, "m-tecnico");

  // Encabezado de sección como panel (.plaque): escudo + rótulo + título, e intro al lado
  Museo.plaqueHead = (c) => `
    <div class="head">
      <div class="plaque plaque--head rv">${c.shield ? `<span class="shield">${esc(c.shield)}</span>` : ""}${c.kana ? `<span class="ja" lang="ja">${esc(c.kana)}</span>` : ""}<h2 id="${c.id}-title">${esc(c.title)}</h2></div>
      ${c.intro ? `<p class="rv" style="--i:1">${c.intro}</p>` : ""}
    </div>`;

  // Lista de datos: [[dt, dd, nota]] en cifras tabulares
  Museo.dataList = (rows, cls = "data") => `<dl class="${cls}">${rows.map(([dt, dd, small]) => `<div><dt>${esc(dt)}</dt><dd>${esc(dd)}${small ? `<small>${esc(small)}</small>` : ""}</dd></div>`).join("")}</dl>`;

  /* Desplaza SÓLO una fila con scroll horizontal (pestañas, carriles) hasta un elemento.
     No usa scrollIntoView: ese método mueve también todos los ancestros desplazables
     y llegaba a correr la página de lado, cortando el coche. */
  Museo.scrollRowTo = (row, el, align = "center") => {
    if (!row || !el || row.scrollWidth <= row.clientWidth) return;
    const r = row.getBoundingClientRect(), e = el.getBoundingClientRect();
    const offset = e.left - r.left + row.scrollLeft;
    const left = align === "start" ? offset : offset - (row.clientWidth - e.width) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Pulso de luz único sobre un punto recién activado (sin bucles)
  Museo.pulse = (el) => {
    if (!el || reduceMotion) return;
    el.classList.remove("is-pulsing");
    void el.offsetWidth;
    el.classList.add("is-pulsing");
    el.addEventListener("animationend", () => el.classList.remove("is-pulsing"), { once: true });
  };

  // Antetítulo de sección: "Texto" o ["Texto", "destacado"]
  Museo.kicker = (k) => (Array.isArray(k) ? `${esc(k[0])}${k[1] ? ` · <b>${esc(k[1])}</b>` : ""}` : esc(k));

  /* <img> (o <picture> si la imagen declara formatos modernos) a partir de los datos.
     · lazy: true  → loading="lazy" (despieces, vistas secundarias, modales)
     · lazy: false → loading="eager"; priority: true añade fetchpriority="high" (sólo la portada)
     · picture: false fuerza un <img> simple (fotos cuyo src cambia por JS, p. ej. el color)
     Los formatos (["avif", "webp"]) los escribe tools/images.mjs en data/cars.json
     sólo cuando los archivos existen, así una <source> nunca apunta a un 404. */
  const MIME = { avif: "image/avif", webp: "image/webp" };
  const withExt = (src, ext) => src.replace(/\.[a-z0-9]+$/i, `.${ext}`);
  Museo.img = (im, { cls = "", alt, lazy = true, priority = false, picture = true, extra = "" } = {}) => {
    const tag = `<img${cls ? ` class="${cls}"` : ""} src="${esc(url(im.src))}" width="${im.w}" height="${im.h}" alt="${esc(alt ?? im.alt ?? "")}"${alt === "" ? ' aria-hidden="true"' : ""} loading="${lazy ? "lazy" : "eager"}"${priority ? ' fetchpriority="high"' : ""} decoding="async"${extra ? " " + extra : ""} />`;
    const ext = (im.src.match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
    const sources = picture ? (im.formats || []).filter((f) => MIME[f] && f !== ext) : [];
    if (!sources.length) return tag;
    return `<picture>${sources.map((f) => `<source type="${MIME[f]}" srcset="${esc(url(withExt(im.src, f)))}" />`).join("")}${tag}</picture>`;
  };

  /* <link rel="preload"> para una imagen: si tiene formatos modernos, precarga el primero
     con su type (el navegador que no lo admite lo ignora y usa la etiqueta <img>) */
  Museo.preloadLink = (im, { picture = true } = {}) => {
    const ext = (im.src.match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
    const best = picture ? (im.formats || []).find((f) => MIME[f] && f !== ext) : null;
    const l = document.createElement("link");
    l.rel = "preload"; l.as = "image"; l.fetchPriority = "high";
    l.href = url(best ? withExt(im.src, best) : im.src);
    if (best) l.type = MIME[best];
    return l;
  };

  /* ---------- Datos del museo ----------
     Con servidor (http/https) se lee data/cars.json, la fuente única. Sin servidor
     (doble clic, file://) el navegador bloquea fetch: se carga data/cars.js, generado
     a partir del JSON con `node tools/build-data.mjs`. */
  Museo.loadData = async () => {
    if (/^https?:$/.test(location.protocol)) {
      try {
        const r = await fetch(url("data/cars.json"), { cache: "no-cache" });
        if (r.ok) { window.MUSEO = await r.json(); return window.MUSEO; }
      } catch { /* sin red: se usa la copia .js */ }
    }
    if (!window.MUSEO) await Museo.loadScript("data/cars.js");
    return window.MUSEO;
  };

  /* Resuelve las referencias al catálogo de imágenes del coche:
     "clave" o { ref: "clave", alt, fit } → { src, w, h, alt, formats, … } */
  Museo.resolveImages = (car) => {
    const lookup = (v) => {
      const ref = typeof v === "string" ? v : v.ref;
      const base = car.images?.[ref];
      if (!base) { console.warn(`Imagen no encontrada en el catálogo de ${car.id}: ${ref}`); return { src: "", w: 1, h: 1, alt: "" }; }
      return typeof v === "string" ? { ...base } : { ...base, ...v };
    };
    const walk = (o) => {
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (!o || typeof o !== "object") return;
      for (const [k, v] of Object.entries(o)) {
        if (k === "image" && (typeof v === "string" || (v && v.ref))) o[k] = lookup(v);
        else walk(v);
      }
    };
    walk(car.sections);
    walk(car.hall);
    return car;
  };

  // Ficha técnica: número con millares a la española (1.100, 2.568) o texto tal cual
  const nf = (dec = 0) => new Intl.NumberFormat("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: "always" });
  Museo.formatSpec = (s) => (typeof s.value === "number" ? nf(s.decimals || 0).format(s.value) : String(s.value));
  Museo.numberFormat = nf;
  Museo.hexToRgb = (hex) => { const n = parseInt(hex.replace("#", ""), 16); return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`; };

  /* ---------- Registro de módulos ---------- */
  const registry = {};
  Museo.define = (type, mod) => { registry[type] = mod; };
  Museo.module = (type) => registry[type];

  /* ---------- Carga de recursos ---------- */
  Museo.loadScript = (p) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = url(p);
    s.onload = res;
    s.onerror = () => rej(new Error(`No se pudo cargar ${p}`));
    document.head.appendChild(s);
  });
  Museo.loadCSS = (p, timeout = 2500) => new Promise((res) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = url(p);
    const done = () => res();
    l.onload = done;
    l.onerror = done;
    setTimeout(done, timeout);
    document.head.appendChild(l);
  });

  /* ---------- Memoria por sala ----------
     Una sola clave por sala (museo.<id>). Se guarda en memoria siempre y en
     localStorage sólo con consentimiento; al aceptarlo, se escribe el estado actual. */
  Museo.store = (id, legacyId) => {
    const KEY = `museo.${id}`;
    const can = () => Boolean(window.MuseoConsent && window.MuseoConsent.has());
    let prefs = {};
    try { prefs = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { prefs = {}; }
    // Migración: preferencias guardadas con el identificador antiguo de la sala (p. ej. museo.f40)
    if (legacyId && legacyId !== id && !Object.keys(prefs).length) {
      try {
        const old = JSON.parse(localStorage.getItem(`museo.${legacyId}`));
        if (old) { prefs = old; localStorage.setItem(KEY, JSON.stringify(prefs)); localStorage.removeItem(`museo.${legacyId}`); }
      } catch { /* sin almacenamiento */ }
    }
    const persist = () => {
      if (!can()) return;
      try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* sin almacenamiento */ }
    };
    addEventListener("museo:consent", (e) => { if (e.detail && e.detail.status === "accepted") persist(); });
    return {
      get: (k, fallback = null) => (prefs[k] === undefined ? fallback : prefs[k]),
      set(k, v) { prefs[k] = v; persist(); },
      patch(k, key, v) { prefs[k] = { ...(prefs[k] || {}), [key]: v }; persist(); },
      persist,
    };
  };

  /* ---------- Bucle de scroll compartido (un único rAF) ---------- */
  const scrollFns = [];
  let ticking = false;
  const runScroll = () => { ticking = false; scrollFns.forEach((fn) => fn()); };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  Museo.onScroll = (fn) => { scrollFns.push(fn); queue(); };

  /* ---------- Aparición al hacer scroll ----------
     .rv entra una vez; con data-rv="repeat" vuelve a su estado inicial al salir
     del todo de la pantalla (así puede animarse de nuevo). */
  Museo.reveal = (scope = document) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const el = e.target;
        const repeat = el.dataset.rv === "repeat";
        if (e.isIntersecting && e.intersectionRatio >= 0.12) {
          if (el.classList.contains("is-in")) return;
          el.classList.add("is-in");
          el.dispatchEvent(new CustomEvent("rv:in"));
          if (!repeat) io.unobserve(el);
        } else if (!e.isIntersecting && repeat && el.classList.contains("is-in")) {
          el.classList.remove("is-in");
          el.dispatchEvent(new CustomEvent("rv:out"));
        }
      });
    }, { threshold: [0, 0.12] });
    $$(".rv", scope).forEach((el) => io.observe(el));
  };

  /* ---------- Enfoque óptico (clase .optic) ---------- */
  Museo.optic = {
    focus(optic, x, y) {
      optic.style.setProperty("--fx", typeof x === "number" ? `${x}%` : x);
      optic.style.setProperty("--fy", typeof y === "number" ? `${y}%` : y);
      optic.classList.add("is-focus");
    },
    clear(optic) { optic.classList.remove("is-focus"); },
    // Marcado: foto base + copia nítida que sólo se ve dentro del círculo de enfoque
    // priority: sólo la capa base de la portada se pide con alta prioridad; la nítida es diferida
    markup: (im, { cls = "", lazy = true, priority = false, inner = "", style = "" } = {}) =>
      `<div class="optic ${cls}" data-optic style="aspect-ratio:${im.w}/${im.h};${style}">
        ${Museo.img(im, { cls: "optic__base", lazy, priority })}
        ${Museo.img(im, { cls: "optic__sharp", alt: "", lazy: true })}
        ${inner}
      </div>`,
  };

  /* ---------- Filtros SVG por píxel (nivel de negro + tintes de color) ---------- */
  Museo.filters = (car) => {
    const tints = (car.colors?.list || []).filter((c) => c.tint)
      .map((c) => `<filter id="tint-${c.key}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${c.tint}" /></filter>`).join("");
    return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
      <filter id="blackpoint" color-interpolation-filters="sRGB"><feComponentTransfer>
        <feFuncR type="linear" slope="1.1628" intercept="-0.1628" /><feFuncG type="linear" slope="1.1628" intercept="-0.1628" /><feFuncB type="linear" slope="1.1628" intercept="-0.1628" />
      </feComponentTransfer></filter>
      <!-- Negro OLED suave: lleva a #000 sólo los niveles 0–10 (fondos casi negros, ruido de compresión) sin tocar los colores -->
      <filter id="oled" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="1.04" intercept="-0.04" /><feFuncG type="linear" slope="1.04" intercept="-0.04" /><feFuncB type="linear" slope="1.04" intercept="-0.04" /></feComponentTransfer></filter>${tints}</svg>`;
  };

  /* =========================================================
     COMPONENTES COMPARTIDOS
     ========================================================= */
  const ARROW_BACK = '<svg class="icon-back" viewBox="0 0 16 12" aria-hidden="true"><path d="M15 6H1M6 1L1 6l5 5" /></svg>';
  const ARROW_NEXT = '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M1 6h14M10 1l5 5-5 5" /></svg>';
  Museo.icons = { ARROW_BACK, ARROW_NEXT };

  /* ---------- Cabecera ---------- */
  Museo.topbar = (car, ctx) => {
    const navs = car.sections.filter((s) => s.nav);
    const swatches = car.colors
      ? `<div class="swatches" role="radiogroup" aria-label="Color de carrocería">${car.colors.list.map((c) =>
          `<button type="button" class="swatch" role="radio" data-color-set="${c.key}" aria-checked="${c.key === car.colors.default}" aria-label="${esc(c.name)}" title="${esc(c.name)}" style="--c: ${c.swatch}"></button>`).join("")}</div>`
      : "";
    return `
      <div class="progress" aria-hidden="true"><span class="progress__bar"></span></div>
      <header class="topbar">
        <div class="topbar__left">
          <a href="${esc(ctx.hallUrl)}" class="back" aria-label="Volver al Hall de MotorLab Museum">${ARROW_BACK}<img class="brand-logo" src="${url("assets/logo-mark.png")}" width="28" height="28" alt="" /><span class="back__brand">MotorLab Museum</span></a>
          <a href="#${car.sections[0].id}" class="wordmark" aria-label="${esc(car.name)} · inicio de la sala"><span class="wordmark__make">${esc(car.make)} </span><span class="wordmark__model">${esc(car.model)}</span></a>
        </div>
        <div class="topbar__right">
          ${navs.length > 1 ? `<nav class="route" aria-label="Secciones de la sala">${navs.map((s) => `<a href="#${s.id}">${esc(s.nav)}</a>`).join("")}</nav>` : ""}
          <div class="modes" role="group" aria-label="Modo de lectura">
            <button type="button" data-mode-set="historia" aria-pressed="true">Historia</button>
            <button type="button" data-mode-set="tecnico" aria-pressed="false">Técnico</button>
          </div>
          ${swatches}
        </div>
      </header>`;
  };

  /* ---------- Salidas: Hall y siguiente sala ---------- */
  Museo.exits = (car, ctx) => {
    const next = ctx.next;
    const tag = '<span class="exit__tag" aria-hidden="true"><b>EXIT</b><span class="ja" lang="ja">出口</span></span>';
    const hall = `
      <a class="exit exit--hall rv" href="${esc(ctx.hallUrl)}">
        ${tag}
        <span class="exit__arrow exit__arrow--back">${ARROW_BACK}</span>
        <span class="exit__txt"><span class="exit__label">Volver</span><strong>Hall del museo</strong><span class="exit__sub">Todas las salas</span></span>
      </a>`;
    const room = (c, dir, i) => `
      <a class="exit exit--${dir} rv" style="--i:${i}" href="${esc(ctx.roomUrl(c))}" aria-label="${dir === "prev" ? "Sala anterior" : "Sala siguiente"}: ${esc(c.name)}">
        ${tag}
        ${dir === "prev" ? `<span class="exit__arrow exit__arrow--back">${ARROW_BACK}</span>` : ""}
        ${c.hall?.image ? `<span class="exit__thumb" aria-hidden="true">${Museo.img(c.hall.image, { alt: "" })}</span>` : ""}
        <span class="exit__txt"><span class="exit__label">${dir === "prev" ? "Anterior" : "Siguiente"} · Sala ${ctx.roomOf(c)}</span><strong>${esc(c.name)}</strong><span class="exit__sub">${esc(c.exitLine || c.years || "")}</span></span>
        ${dir === "next" ? `<span class="exit__arrow">${ARROW_NEXT}</span>` : ""}
      </a>`;
    // Anterior y siguiente en el anillo de salas (con dos salas, ambas son la misma: sólo "siguiente")
    const prev = ctx.prev && ctx.prev !== car && ctx.prev !== next ? room(ctx.prev, "prev", 1) : "";
    const nextLink = next && next !== car ? room(next, "next", prev ? 2 : 1) : "";
    return `<nav class="exits${prev ? " has-prev" : ""}" aria-label="Salidas de la sala">${hall}${prev}${nextLink}</nav>`;
  };

  /* ---------- Pie con aviso legal ---------- */
  const listMarks = (marks = []) => {
    if (!marks.length) return "";
    const list = marks.length === 1 ? marks[0] : `${marks.slice(0, -1).join(", ")} y ${marks[marks.length - 1]}`;
    return ` ${list} ${marks.length === 1 ? "es una marca registrada" : "son marcas registradas"} de sus respectivos propietarios.`;
  };
  /* Pie mínimo: nombre del museo y dos enlaces discretos en la esquina, «Info legal» (aviso de
     marcas y privacidad técnica, desde museum.legal y museum.privacy) y «Privacidad y preferencias»
     (política completa y consentimiento, en assets/museo-consent.js). */
  let pageMarks = "";
  Museo.footer = (marks) => {
    pageMarks = listMarks(marks).trim();
    return `
    <footer class="footer footer--min">
      <p class="footer__meta"><span>${esc(window.MUSEO.museum.name)}</span><span aria-hidden="true"> · </span><span>Proyecto sin ánimo de lucro</span></p>
      <p class="footer__links">
        <button type="button" class="mc-footer-link" data-open-legal aria-haspopup="dialog">Info legal</button><span aria-hidden="true"> · </span><button type="button" class="mc-footer-link" data-open-privacy>Privacidad y preferencias</button>
      </p>
    </footer>`;
  };

  let legalDialog = null;
  const legal = () => {
    if (legalDialog) return legalDialog;
    const m = window.MUSEO.museum;
    legalDialog = document.createElement("dialog");
    legalDialog.className = "mc-modal legal";
    legalDialog.setAttribute("aria-labelledby", "legal-title");
    legalDialog.innerHTML = `
      <article class="mc-card">
        <button type="button" class="mc-close" data-close-legal aria-label="Cerrar la información legal"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg></button>
        <span class="mc-kicker">Info legal</span>
        <h2 id="legal-title">Aviso legal</h2>
        <p>${esc(m.legal)}</p>
        ${m.trademarks ? `<p>${esc(m.trademarks)}</p>` : ""}
        ${pageMarks ? `<p>${esc(pageMarks)}</p>` : ""}
        <h3>Privacidad técnica</h3>
        <ul class="legal__list">${(m.privacy || []).map((t) => `<li><span>${esc(t)}</span></li>`).join("")}</ul>
        <p class="legal__more"><button type="button" class="mc-link" data-open-privacy data-close-legal>Política de privacidad completa y preferencias</button></p>
      </article>`;
    document.body.append(legalDialog);
    legalDialog.addEventListener("click", (e) => {
      if (e.target === legalDialog || e.target.closest("[data-close-legal]")) legalDialog.close();   // clic fuera, × o paso a la política
    });
    return legalDialog;
  };
  document.addEventListener("click", (e) => { if (e.target.closest("[data-open-legal]")) legal().showModal(); });

  /* ---------- Progreso de lectura (--progress de 0 a 1) ---------- */
  Museo.progress = () => {
    const bar = $(".progress__bar");
    if (!bar) return;
    Museo.onScroll(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(4) : 0);
    });
  };

  /* ---------- Sección activa en la navegación de la cabecera ---------- */
  Museo.routeSpy = () => {
    const links = $$(".route a");
    if (!links.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((a) => { const s = document.getElementById(a.getAttribute("href").slice(1)); if (s) io.observe(s); });
  };

  /* ---------- Modo Historia / Técnico ---------- */
  const modeListeners = [];
  Museo.onMode = (fn) => modeListeners.push(fn);
  Museo.setMode = (mode, store) => {
    if (mode !== "historia" && mode !== "tecnico") return;
    document.documentElement.dataset.mode = mode;
    $$("[data-mode-set]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.modeSet === mode)));
    if (store) store.set("mode", mode);
    modeListeners.forEach((fn) => fn(mode));
  };
  /* El modo de lectura es del museo, no de cada sala: elegir «Técnico» en una sala lo mantiene
     al pasar a la siguiente (museo.preferencias; como todo, sólo se guarda con consentimiento).
     Si no hay modo común todavía, se respeta el que la sala tuviera guardado de antes. */
  Museo.modes = (store) => {
    const shared = Museo.store("preferencias");
    $$("[data-mode-set]").forEach((b) => b.addEventListener("click", () => Museo.setMode(b.dataset.modeSet, shared)));
    Museo.setMode(shared.get("mode") || store?.get("mode") || "historia");
  };

  /* ---------- Farolas ligadas al scroll (.lit) ---------- */
  Museo.lamps = () => {
    const lits = $$(".lit");
    if (!lits.length || reduceMotion) return;
    Museo.onScroll(() => lits.forEach((el) => {
      const b = el.getBoundingClientRect();
      const t = clamp((innerHeight - b.top) / (innerHeight + b.height), 0, 1);
      el.style.setProperty("--lamp-x", `${(-110 + t * 440).toFixed(1)}%`);
    }));
  };

  /* =========================================================
     IMÁGENES: búfer decodificado, fundido cruzado y color
     ========================================================= */
  // decode() con tiempo límite: si el navegador lo aplaza nunca bloquea la interfaz
  const decodeSafe = (img, ms = 1200) => Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, ms))]);
  Museo.decodeSafe = decodeSafe;
  const imageBuffer = new Map();
  const bufferImage = (src) => {
    if (!imageBuffer.has(src)) {
      imageBuffer.set(src, new Promise((res) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = async () => { await decodeSafe(img); res(img.naturalWidth > 0 ? img : null); };
        img.onerror = () => res(null);
        img.src = src;
      }));
    }
    return imageBuffer.get(src);
  };
  Museo.bufferImage = bufferImage;

  // Momento ocioso, con respaldo por temporizador (requestIdleCallback se congela en segundo plano)
  const idle = (fn) => {
    let done = false;
    const run = () => { if (!done) { done = true; fn(); } };
    if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 1500 });
    setTimeout(run, 400);
  };
  Museo.idle = idle;

  /* Carga por intención (despieces, ventanas emergentes, vistas ocultas): una imagen diferida
     (loading="lazy") se pide en cuanto el usuario apunta, enfoca o toca su disparador, un instante
     antes de mostrarse. Al pasar a "eager" es el propio navegador quien elige el formato de su
     <picture> (avif › webp › original): nunca se descarga dos veces la misma foto. */
  Museo.warm = (root) => {
    if (!root) return;
    (root.matches?.("img") ? [root] : $$('img[loading="lazy"]', root)).forEach((img) => { img.loading = "eager"; });
  };
  Museo.warmOn = (trigger, target) => {
    const events = ["pointerenter", "focusin", "touchstart"];
    const go = () => { events.forEach((e) => trigger.removeEventListener(e, go)); Museo.warm(typeof target === "function" ? target() : target); };
    events.forEach((e) => trigger.addEventListener(e, go, { passive: true }));
  };

  // Precarga de fondo, de una en una, cuando la página termina de cargar (sólo variantes de color)
  Museo.preload = (sources) => {
    const queue = [...new Set(sources.filter(Boolean))];
    const next = () => { const src = queue.shift(); if (src) bufferImage(src).finally(() => idle(next)); };
    const start = () => idle(next);
    if (document.readyState === "complete") start(); else addEventListener("load", start, { once: true });
  };

  /* Fundido cruzado sin parpadeo: una "gemela" superpuesta recibe la nueva
     imagen ya decodificada, aparece y, al terminar, se copia a la original. */
  function twinOf(img) {
    if (!img._twin) {
      const twin = img.cloneNode(false);
      twin.classList.remove("js-car", "zoomable");
      twin.classList.add("js-car-twin");
      twin.removeAttribute("fetchpriority");
      twin.alt = "";
      twin.setAttribute("aria-hidden", "true");
      twin.style.opacity = "0";
      img.after(twin);
      img._twin = twin;
    }
    return img._twin;
  }
  async function crossfadeImage(img, src, filter, animate) {
    const sameSrc = img.src === src;
    if (sameSrc && img.style.filter === filter) return;
    if (!animate || reduceMotion) {
      img.style.filter = filter;
      if (!sameSrc) { img.src = src; await decodeSafe(img); }
      return;
    }
    const twin = twinOf(img);
    twin.src = src;
    twin.style.filter = filter;
    await decodeSafe(twin);
    const target = getComputedStyle(img).opacity;
    await twin.animate([{ opacity: 0 }, { opacity: target }], { duration: 480, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }).finished.catch(() => {});
    img.style.filter = filter;
    if (!sameSrc) { img.src = src; await decodeSafe(img); }
    twin.getAnimations().forEach((a) => a.cancel());
    twin.style.opacity = "0";
  }

  /* ---------- Selector de color de carrocería ---------- */
  Museo.colors = (car, store) => {
    if (!car.colors) return;
    const C = car.colors;
    const root = document.documentElement;
    const base = url(C.base);
    const swatches = $$("[data-color-set]");
    const carImages = () => $$(".js-car");
    let chain = Promise.resolve();

    function apply(key, animate = true) {
      const c = C.list.find((x) => x.key === key);
      if (!c) return;
      swatches.forEach((s) => s.setAttribute("aria-checked", String(s.dataset.colorSet === key)));
      root.dataset.color = key;
      // Halo ambiental: R, G, B e intensidad son propiedades registradas → se interpolan en CSS
      root.style.setProperty("--gr", c.glow[0]); root.style.setProperty("--gg", c.glow[1]);
      root.style.setProperty("--gb", c.glow[2]); root.style.setProperty("--gk", c.gk ?? 1);
      store.set("color", key);
      chain = chain.then(async () => {
        const file = c.file ? url(c.file) : null;
        const hasFile = file ? Boolean(await bufferImage(file)) : false;
        const src = hasFile ? file : base;
        const filter = hasFile ? "" : (c.tint ? `url(#tint-${c.key}) url(#blackpoint)` : "");
        await bufferImage(src);
        await Promise.all(carImages().map((img) => crossfadeImage(img, src, filter, animate)));
      });
    }
    swatches.forEach((s) => s.addEventListener("click", () => apply(s.dataset.colorSet)));
    Museo.preload([base, ...C.list.map((c) => c.file && url(c.file))]);
    const saved = store.get("color");
    apply(saved && C.list.some((c) => c.key === saved) ? saved : C.default, false);
  };

  /* =========================================================
     AUDIO — un único <audio> por sala para todos sus controles
     ========================================================= */
  Museo.audioControls = (car) => {
    const a = car.audio;
    if (!a) return "";
    return `
      <div class="audio-ctrl" data-audio-ctrl>
        <button type="button" class="audio-btn audio-btn--play" data-audio-toggle aria-pressed="false" aria-label="Reproducir ${esc(a.subject)}">
          <span class="audio-btn__icon" aria-hidden="true">
            <svg class="i-play" viewBox="0 0 12 12"><path d="M3.2 1.8v8.4L10.2 6z" /></svg>
            <svg class="i-pause" viewBox="0 0 12 12"><path d="M3 2h2.2v8H3zM6.8 2H9v8H6.8z" /></svg>
          </span>
          <span class="audio-btn__label">${esc(a.label)}</span>
          <svg class="audio-wave" viewBox="0 0 22 14" aria-hidden="true"><path d="M2 5v4" /><path d="M6.5 2v10" /><path d="M11 4v6" /><path d="M15.5 1v12" /><path d="M20 5v4" /></svg>
        </button>
        <button type="button" class="audio-btn audio-btn--reset" data-audio-reset aria-label="Reiniciar el audio desde el principio" title="Reiniciar" disabled>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 2.8v3.6h3.6" /><path d="M3.6 6.3a5 5 0 1 1-.4 3.6" /></svg>
        </button>
        <span class="audio-time" aria-hidden="true"><span class="audio-time__bar"><i></i></span><span class="audio-time__txt">0:00</span></span>
      </div>`;
  };

  Museo.audio = (car, store) => {
    const controls = $$("[data-audio-ctrl]");
    if (!car.audio || !controls.length) return;
    const A = car.audio;
    const audio = new Audio();
    audio.preload = "none";
    audio.src = url(A.src);
    const fmt = (s) => { if (!isFinite(s) || s < 0) s = 0; return `${Math.floor(s / 60)}:${pad2(Math.floor(s % 60))}`; };

    function paint() {
      const playing = !audio.paused && !audio.ended;
      const started = audio.currentTime > 0.05;
      const label = playing ? "Pausar" : started ? "Reanudar" : A.label;
      const aria = `${playing ? "Pausar" : started ? "Reanudar" : "Reproducir"} ${A.subject}`;
      const progress = audio.duration ? audio.currentTime / audio.duration : 0;
      const time = audio.duration ? `${fmt(audio.currentTime)} / ${fmt(audio.duration)}` : fmt(audio.currentTime);
      controls.forEach((c) => {
        if (c.classList.contains("is-unavailable")) return;
        const toggle = $("[data-audio-toggle]", c);
        toggle.setAttribute("aria-pressed", String(playing));
        toggle.setAttribute("aria-label", aria);
        $(".audio-btn__label", toggle).textContent = label;
        $("[data-audio-reset]", c).disabled = !started && !playing;
        $(".audio-time__bar i", c).style.transform = `scaleX(${progress.toFixed(4)})`;
        $(".audio-time__txt", c).textContent = time;
      });
    }
    let raf = null;
    const tick = () => { paint(); raf = !audio.paused ? requestAnimationFrame(tick) : null; };

    function unavailable() {
      controls.forEach((c) => {
        c.classList.add("is-unavailable");
        $$("button", c).forEach((b) => (b.disabled = true));
        $("[data-audio-toggle]", c).setAttribute("aria-pressed", "false");
        $(".audio-btn__label", c).textContent = "Audio no disponible";
      });
    }
    // play() es asíncrono: se guarda su promesa para que Pausa/Reiniciar no choquen con él
    let pending = null;
    async function toggle() {
      if (pending) return;
      if (!audio.paused) { audio.pause(); return; }
      try {
        if (audio.ended) audio.currentTime = 0;
        pending = audio.play();
        await pending;
      } catch (err) {
        if (err && err.name !== "AbortError" && err.name !== "NotAllowedError") unavailable();
      } finally { pending = null; paint(); }
    }
    function reset() {
      const stop = () => { audio.pause(); try { audio.currentTime = 0; } catch { /* sin metadatos */ } paint(); };
      if (pending) pending.then(stop, stop); else stop();
    }
    controls.forEach((c) => {
      $("[data-audio-toggle]", c).addEventListener("click", toggle);
      $("[data-audio-reset]", c).addEventListener("click", reset);
    });
    audio.addEventListener("play", () => { if (!raf) raf = requestAnimationFrame(tick); });
    ["pause", "seeked", "loadedmetadata", "timeupdate"].forEach((ev) => audio.addEventListener(ev, paint));
    audio.addEventListener("ended", reset);
    audio.addEventListener("error", unavailable);
    paint();

    // Memoria: posición y si estaba sonando (reanuda con el primer gesto si el navegador lo exige)
    const save = () => store.set("audio", { t: +audio.currentTime.toFixed(2), playing: !audio.paused && !audio.ended });
    let last = 0;
    ["play", "pause", "seeked"].forEach((ev) => audio.addEventListener(ev, save));
    audio.addEventListener("timeupdate", () => { const now = performance.now(); if (now - last > 1000) { last = now; save(); } });
    addEventListener("pagehide", save);
    const saved = store.get("audio");
    if (saved && (saved.t > 0.05 || saved.playing)) {
      audio.preload = "auto";
      audio.addEventListener("loadedmetadata", () => {
        if (saved.t > 0 && saved.t < audio.duration - 0.3) audio.currentTime = saved.t;
        paint();
        if (saved.playing) audio.play().catch((err) => {
          if (!err || err.name !== "NotAllowedError") return;
          const onGesture = (e) => {
            removeEventListener("pointerdown", onGesture, true);
            removeEventListener("keydown", onGesture, true);
            if (e.target.closest && e.target.closest("[data-audio-ctrl]")) return;
            if (audio.paused) toggle();
          };
          addEventListener("pointerdown", onGesture, true);
          addEventListener("keydown", onGesture, true);
        });
      }, { once: true });
      audio.load();
    }
  };

  /* =========================================================
     LIGHTBOX — foto a pantalla completa con técnica FLIP
     ========================================================= */
  let lb = null;
  function lightbox() {
    if (lb) return lb;
    const d = document.createElement("dialog");
    d.className = "lightbox";
    d.setAttribute("aria-label", "Imagen a pantalla completa");
    d.innerHTML = `<p class="lightbox__caption"><span class="js-lb-caption"></span> · <kbd>Esc</kbd> para cerrar</p>
      <button type="button" class="lightbox__close" aria-label="Cerrar la imagen"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" /></svg></button>`;
    const img = document.createElement("img");          // recibe la foto al abrirse
    img.className = "lightbox__img photo";
    img.alt = "";
    d.prepend(img);
    document.body.appendChild(d);
    const caption = $(".js-lb-caption", d), close = $(".lightbox__close", d);
    const root = document.documentElement;
    let source = null, trigger = null, busy = false;
    const flipFrom = (a, b) => {
      const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
      return r1.width && r2.width ? `translate(${r1.left - r2.left}px, ${r1.top - r2.top}px) scale(${r1.width / r2.width})` : null;
    };
    const onScreen = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight && !el.closest("[hidden]"); };

    async function open(src, trig) {
      if (busy || d.open || typeof d.showModal !== "function") return;
      busy = true; source = src; trigger = trig || src;
      img.src = src.currentSrc || src.src; img.alt = src.alt; img.style.filter = src.style.filter;
      caption.textContent = src.alt;
      await decodeSafe(img);
      root.classList.add("is-lightbox-open");
      d.showModal();
      if (!reduceMotion) {
        const from = flipFrom(src, img);
        const anims = [
          d.animate([{ backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: "#000" }], { duration: 380, easing: "ease-out" }),
          ...[close, caption.parentElement].map((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 260, fill: "backwards" })),
        ];
        if (from) anims.push(img.animate([{ transform: from }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }));
        await Promise.allSettled(anims.map((a) => a.finished));
      }
      busy = false;
      close.focus({ preventScroll: true });
    }
    async function shut() {
      if (busy || !d.open) return;
      busy = true;
      if (!reduceMotion) {
        const anims = [
          d.animate([{ backgroundColor: "#000" }, { backgroundColor: "rgba(0,0,0,0)" }], { duration: 340, easing: "ease-in", fill: "forwards" }),
          ...[close, caption.parentElement].map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" })),
        ];
        const to = source && onScreen(source) ? flipFrom(source, img) : null;
        anims.push(to
          ? img.animate([{ transform: "none" }, { transform: to }], { duration: 420, easing: "cubic-bezier(0.5, 0, 0.2, 1)", fill: "forwards" })
          : img.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: "forwards" }));
        await Promise.allSettled(anims.map((a) => a.finished));
      }
      d.close();
      d.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      root.classList.remove("is-lightbox-open");
      busy = false;
      if (trigger) trigger.focus({ preventScroll: true });
    }
    close.addEventListener("click", shut);
    d.addEventListener("cancel", (e) => { e.preventDefault(); shut(); });
    d.addEventListener("click", (e) => { if (e.target === d) shut(); });
    lb = { open, close: shut };
    return lb;
  }
  // Hace ampliable un contenedor: clic en su foto o en el botón de ampliar
  const ZOOM_ICON = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M8.5 1.5h4v4M5.5 12.5h-4v-4M12.5 1.5L8 6M1.5 12.5L6 8" /></svg>';
  Museo.zoomable = (media, currentImg) => {
    $$("img:not(.optic__sharp)", media).forEach((img) => img.classList.add("zoomable"));
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "zoom-btn";
    btn.setAttribute("aria-label", "Ver la imagen a pantalla completa");
    btn.innerHTML = ZOOM_ICON;
    media.appendChild(btn);
    btn.addEventListener("click", () => { const img = currentImg(); if (img) lightbox().open(img, btn); });
    media.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG" && e.target.classList.contains("zoomable")) lightbox().open(e.target, btn);
    });
  };
})();
