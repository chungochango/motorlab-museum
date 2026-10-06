/* =========================================================
   FERRARI F40 · Automotive Studio
   ---------------------------------------------------------
   El progreso del scroll dentro de .scrolly (0 → 1) controla:
     · el fundido cruzado coche → despiece (sólo opacidad)
     · la aparición de cada tarjeta y su línea guía
   Un suavizado ligero (interpolación exponencial) absorbe los
   saltos de la rueda del ratón sin que la imagen se retrase.
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const smooth = (t) => t * t * (3 - 2 * t);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Línea temporal ----------
     0.00 – 0.08  coche completo
     0.08 – 0.62  fundido cruzado lineal hacia el despiece
     0.22 – 1.00  cuatro tarjetas; las tres primeras surgen
                  mientras el coche se despieza                  */
  const FADE_START = 0.08;
  const FADE_END = 0.62;
  const NOTES_START = 0.22;
  const NOTE_LEN = 0.16;
  const noteStart = (i) => NOTES_START + i * NOTE_LEN;

  const SMOOTHING = 0.28; // fracción recorrida por frame a 60 fps (1 = sin suavizado)

  const STATES = ["Vehículo completo", "Desmontando", "Despiece técnico"];

  /* ---------- DOM ---------- */
  const scrolly = $(".scrolly");
  const progressBar = $(".progress__bar");
  const car = $(".plate--car");
  const exploded = $(".plate--exploded");
  const meterFill = $(".meter__fill");
  const stateLabel = $(".js-state");
  const notes = $$(".note");
  const leaders = $$(".leader");
  const leaderPaths = leaders.map((g) => $("path", g));

  /* ---------- Estado ---------- */
  let sectionRange = 1;
  let docRange = 1;
  let target = 0;
  let current = 0;
  let rafId = null;
  let lastTime = 0;
  let lastState = "";

  function measure() {
    sectionRange = Math.max(1, scrolly.offsetHeight - window.innerHeight);
    docRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    snapFigure();
  }

  // Al centrarse, la figura puede caer en medio píxel (p. ej. por la barra de
  // scroll) y la foto se vería ligeramente suave. La desplazamos al píxel físico.
  const figure = $(".figure");
  function snapFigure() {
    const dpr = window.devicePixelRatio || 1;
    figure.style.translate = "";
    const r = figure.getBoundingClientRect();
    const dx = Math.round(r.left * dpr) / dpr - r.left;
    const dy = Math.round(r.top * dpr) / dpr - r.top;
    if (dx || dy) figure.style.translate = `${dx}px ${dy}px`;
  }

  const readTarget = () => clamp(-scrolly.getBoundingClientRect().top / sectionRange);

  /* ---------- Render ---------- */
  function render(p) {
    // 1) Fundido cruzado. El coche queda debajo, opaco; el despiece encima con
    //    opacidad t. Como ambas fotos son opacas y están alineadas, el resultado
    //    es exactamente t·despiece + (1−t)·coche: lineal, sin oscurecerse a mitad.
    const t = range(p, FADE_START, FADE_END);
    exploded.style.opacity = t.toFixed(4);
    car.style.visibility = t >= 1 ? "hidden" : "visible"; // al terminar sólo se pinta una imagen
    meterFill.style.transform = `scaleX(${t.toFixed(4)})`;

    const state = t <= 0 ? STATES[0] : t >= 1 ? STATES[2] : STATES[1];
    if (state !== lastState) { stateLabel.textContent = state; lastState = state; }

    // 2) Tarjetas y líneas guía, sincronizadas con el progreso.
    for (let i = 0; i < notes.length; i++) {
      const u = (p - noteStart(i)) / NOTE_LEN;
      const last = i === notes.length - 1;
      const fadeIn = smooth(range(u, 0, 0.3));
      const fadeOut = last ? 0 : smooth(range(u, 0.82, 1));
      const o = fadeIn * (1 - fadeOut);

      const note = notes[i];
      note.style.opacity = o.toFixed(3);
      note.style.transform = `translate3d(0, ${((1 - fadeIn) * 12 - fadeOut * 8).toFixed(2)}px, 0)`;
      note.style.visibility = o > 0.001 ? "visible" : "hidden";

      // La línea se "dibuja" desde la tarjeta hasta la pieza; el punto queda
      // marcado de forma tenue cuando la tarjeta ya ha pasado.
      const past = u >= 1 && !last;
      leaders[i].style.opacity = Math.max(o, past ? 0.35 : 0).toFixed(3);
      leaderPaths[i].style.strokeDashoffset = (1 - o).toFixed(4);
    }
  }

  /* ---------- Bucle ---------- */
  function frame(now) {
    const dt = lastTime ? Math.min(64, now - lastTime) : 16.67;
    lastTime = now;

    const k = reduceMotion ? 1 : 1 - Math.pow(1 - SMOOTHING, dt / 16.67);
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.0001) current = target;

    render(current);

    if (current !== target) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = null;
      lastTime = 0;
    }
  }

  function onScroll() {
    progressBar.style.transform = `scaleX(${(window.scrollY / docRange).toFixed(4)})`;
    target = readTarget();
    if (!rafId) rafId = requestAnimationFrame(frame);
  }

  function onResize() {
    measure();
    onScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onResize);
  if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(document.body);

  /* ---------- Reveal + contadores ---------- */
  const animateCount = (el) => {
    const end = parseFloat(el.dataset.count);
    const dec = +el.dataset.decimals || 0;
    const fmt = new Intl.NumberFormat("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduceMotion) { el.textContent = fmt.format(end); return; }
    const t0 = performance.now();
    const step = (now) => {
      const k = 1 - Math.pow(1 - clamp((now - t0) / 1500), 3);
      el.textContent = fmt.format(end * k);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      const counter = $("[data-count]", entry.target);
      if (counter) animateCount(counter);
      io.unobserve(entry.target);
    }
  }, { threshold: 0.2 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Inicio ---------- */
  measure();
  target = current = readTarget();
  render(current);
  onScroll();
})();
