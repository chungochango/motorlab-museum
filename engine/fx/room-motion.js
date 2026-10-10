/* =========================================================
   MUSEO · CAPA DE MOVIMIENTO (Motion)
   ---------------------------------------------------------
   Opcional por sala: "motion": true en su ficha de data/cars.json.
   engine/sala.js carga entonces engine/vendor/motion.min.js (Motion
   10.18, copia local: la CSP no admite CDN) y este archivo, y llama
   a Museo.fx.motion(ctx) con la sala ya montada y antes de M.reveal().
   No se carga con «reducir movimiento» activado.

   Qué añade sobre el comportamiento normal de los módulos:
     · portada: entrada en cadena con muelle (stiffness 120, damping 14);
     · cifras: las tarjetas suben en cascada al entrar en pantalla;
     · despieces: la foto se acerca y se desplaza un poco con el scroll;
     · carriles: al cambiar de sistema, foto y ficha entran cruzadas (250 ms);
     · duelo: las barras se llenan con muelle, una tras otra;
     · foco: las tarjetas siguen al cursor con --mouse-x / --mouse-y
       (el halo y el pulso de los puntos están en room-motion.css);
     · inclinación 3D de tarjetas, duelo y foto de portada hacia el cursor;
     · puntos del despiece que se acercan al cursor (imán a 40 px);
     · manómetro en el carril que declare "gauge": { label, unit, max, peak, value, note };
     · regleta lateral de recorrido con un sector por sección con "nav";
     · salida: la sala se comprime y se apaga antes de ir a otra sala o al Hall.
   ========================================================= */
(() => {
  "use strict";
  const M = window.Museo;
  const { $, $$ } = M;

  M.fx = M.fx || {};
  M.fx.motion = (ctx) => {
    const lib = window.Motion;
    if (!lib || M.reduceMotion) return;
    const { animate, inView, scroll, spring, stagger } = lib;
    const root = document.documentElement;
    root.classList.add("fx-motion");
    const soft = spring({ stiffness: 120, damping: 14 });

    /* ---------- Portada: entrada en cadena ---------- */
    const hero = $(".hero-cine");
    if (hero) {
      // Estos elementos dejan de depender de la aparición por scroll (.rv): entran una vez, al cargar
      const parts = $$(".hero-cine__content > .rv", hero);
      parts.forEach((el) => { el.classList.remove("rv"); delete el.dataset.rv; });
      const [badge, ...rest] = parts;
      if (badge) animate(badge, { opacity: [0, 1], scale: [0.8, 1] }, { delay: 0.25, easing: soft });
      if (rest.length) animate(rest, { opacity: [0, 1], y: [46, 0] }, { delay: stagger(0.11, { start: 0.4 }), easing: soft });
      const cue = $(".scroll-cue", hero);
      if (cue) animate(cue, { opacity: [0, 1] }, { delay: 0.4 + rest.length * 0.11 + 0.3, duration: 0.6 });
    }

    /* ---------- Cifras: tarjetas en cascada (los contadores son los del módulo) ---------- */
    $$(".facts__grid").forEach((grid) => {
      const cards = $$(".fact", grid);
      inView(grid, () => {
        animate(cards, { y: [28, 0] }, { delay: stagger(0.07), easing: soft });
      }, { amount: 0.15 });
    });

    /* ---------- Despieces: profundidad ligada al scroll ---------- */
    $$(".lane-panel__fig").forEach((fig) => {
      const optic = $("[data-optic]", fig);
      if (optic) scroll(animate(optic, { scale: [1, 1.05], y: [10, -10] }, { easing: "linear" }), { target: fig, offset: ["start end", "end start"] });
    });

    /* ---------- Carriles: transición cruzada al cambiar de sistema ---------- */
    $$(".stage").forEach((stage) => {
      let current = $(".lane-panel.is-active", stage);
      new MutationObserver(() => {
        const next = $(".lane-panel.is-active", stage);
        if (!next || next === current) return;
        current = next;
        const opts = { duration: 0.25, easing: [0.22, 1, 0.36, 1] };
        const fig = $(".lane-panel__fig", next), info = $(".lane-panel__info", next);
        if (fig) animate(fig, { opacity: [0, 1], x: [-16, 0] }, opts);
        if (info) animate(info, { opacity: [0, 1], x: [16, 0] }, { ...opts, delay: 0.04 });
      }).observe(stage, { subtree: true, attributes: true, attributeFilter: ["class"] });
    });

    /* ---------- Duelo: barras con muelle ---------- */
    $$(".duel__board").forEach((board) => {
      const bars = $$(".duel__bar", board);
      const fill = spring({ stiffness: 70, damping: 16 });
      board.addEventListener("rv:in", () => {
        bars.forEach((bar, i) => animate(bar, { scaleX: [0, parseFloat(bar.style.getPropertyValue("--k")) || 0] }, { delay: 0.15 + Math.floor(i / 2) * 0.12, easing: fill }));
      });
      board.addEventListener("rv:out", () => bars.forEach((bar) => animate(bar, { scaleX: 0 }, { duration: 0 })));
    });

    /* ---------- Foco que sigue al cursor ---------- */
    if (M.finePointer.matches) {
      $$(".duel__board, .fact, .exit, .lane, .lane-panel__info").forEach((card) => {
        card.classList.add("fx-spot");
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
          card.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
        }, { passive: true });
      });
    }
    /* ---------- Inclinación 3D hacia el cursor (sólo ratón) ----------
       La perspectiva la pone el contenedor (room-motion.css). El rectángulo se mide una vez
       al entrar y el muelle se relanza como mucho una vez por fotograma. */
    const tilt = (zone, target, max) => {
      const ease = spring({ stiffness: 150, damping: 15 });
      let rect = null, frame = 0, px = 0, py = 0;
      zone.addEventListener("pointerenter", () => { rect = zone.getBoundingClientRect(); });
      zone.addEventListener("pointermove", (e) => {
        if (!rect) rect = zone.getBoundingClientRect();
        px = ((e.clientX - rect.left) / rect.width) * 2 - 1;      // −1 … 1 desde el centro
        py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        if (frame) return;
        frame = requestAnimationFrame(() => { frame = 0; animate(target, { rotateX: -py * max, rotateY: px * max }, { easing: ease }); });
      }, { passive: true });
      zone.addEventListener("pointerleave", () => {
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
        rect = null;
        animate(target, { rotateX: 0, rotateY: 0 }, { easing: ease });
      });
    };
    if (M.finePointer.matches) {
      $$(".fact").forEach((card) => tilt(card, card, 7));
      $$(".duel__board").forEach((board) => tilt(board, board, 2.5));     // pieza grande: ángulo menor para no deformar el texto
      const photo = hero && $(".hero-cine__bg", hero);
      if (photo) tilt(hero, photo, 4);
    }

    /* ---------- Puntos del despiece: imán a menos de 40 px ---------- */
    if (M.finePointer.matches) {
      $$(".lane-panel__fig [data-optic]").forEach((optic) => {
        const snap = spring({ stiffness: 320, damping: 20 });
        const pts = $$(".pt", optic).map((el) => ({ el, dot: $("span", el), cx: 0, cy: 0, on: false }));
        let frame = 0, mx = 0, my = 0, measured = false;
        const measure = () => { pts.forEach((p) => { const r = p.el.getBoundingClientRect(); p.cx = r.left + r.width / 2; p.cy = r.top + r.height / 2; }); measured = true; };
        const release = (p) => { if (p.on) { p.on = false; animate(p.dot, { x: 0, y: 0, scale: 1 }, { easing: snap }); } };
        optic.addEventListener("pointerenter", measure);
        optic.addEventListener("pointermove", (e) => {
          mx = e.clientX; my = e.clientY;
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            if (!measured) measure();
            pts.forEach((p) => {
              const dx = mx - p.cx, dy = my - p.cy;
              if (Math.hypot(dx, dy) > 40) return release(p);
              p.on = true;
              animate(p.dot, { x: dx * 0.35, y: dy * 0.35, scale: 1.25 }, { easing: snap });
            });
          });
        }, { passive: true });
        optic.addEventListener("pointerleave", () => { measured = false; pts.forEach(release); });
        addEventListener("scroll", () => { measured = false; }, { passive: true });
      });
    }

    /* ---------- Manómetro de un carril ("gauge" en los datos del carril) ----------
       Sube deprisa hasta el pico y cae a la presión de trabajo con un rebote amortiguado. */
    (ctx?.car.sections || []).filter((s) => s.type === "systems-lanes").forEach((s) => s.lanes.forEach((lane) => {
      const g = lane.gauge;
      const panel = document.getElementById(`${s.id}-lane-${lane.key}`);
      const anchor = panel && ($(".lane-panel__code", panel) || $("h3", panel));
      if (!g || !anchor) return;
      const fmt = M.numberFormat(g.decimals ?? 2);
      anchor.insertAdjacentHTML("afterend", `
        <div class="fx-gauge" role="img" aria-label="${M.esc(g.label)}: ${fmt.format(g.value)} ${M.esc(g.unit)}${g.note ? `. ${M.esc(g.note)}` : ""}">
          <svg viewBox="0 0 120 70" aria-hidden="true">
            <path class="fx-gauge__track" d="M10 62 A50 50 0 0 1 110 62" pathLength="100" />
            <path class="fx-gauge__arc" d="M10 62 A50 50 0 0 1 110 62" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
            <line class="fx-gauge__needle" x1="60" y1="62" x2="60" y2="20" />
          </svg>
          <p class="fx-gauge__read"><strong>${fmt.format(0)}</strong> <small>${M.esc(g.unit)}</small><span>${M.esc(g.label)}</span></p>
          ${g.note ? `<p class="fx-gauge__note">${M.esc(g.note)}</p>` : ""}
        </div>`);
      const box = $(".fx-gauge", panel), arc = $(".fx-gauge__arc", box), needle = $(".fx-gauge__needle", box), num = $("strong", box);
      const set = (v) => {
        const k = M.clamp(v / g.max, 0, 1);
        arc.style.strokeDashoffset = String(100 - k * 100);
        needle.style.transform = `rotate(${-90 + k * 180}deg)`;
        num.textContent = fmt.format(Math.max(0, v));
      };
      const SPOOL = 0.4, SETTLE = 1.3;
      let run = null, visible = false;
      const play = () => {
        if (run) run.cancel();
        set(0);
        run = animate((p) => {
          const t = p * (SPOOL + SETTLE);
          if (t <= SPOOL) return set(g.peak * (1 - Math.pow(1 - t / SPOOL, 3)));              // subida rápida
          const u = (t - SPOOL) / SETTLE;
          set(g.value + (g.peak - g.value) * Math.exp(-5 * u) * Math.cos(u * Math.PI * 4));     // rebote amortiguado
        }, { duration: SPOOL + SETTLE, easing: "linear" });
      };
      inView(box, () => { visible = true; if (panel.classList.contains("is-active")) play(); return () => { visible = false; }; }, { amount: 0.6 });
      new MutationObserver(() => { if (visible && panel.classList.contains("is-active")) play(); }).observe(panel, { attributes: true, attributeFilter: ["class"] });
    }));

    /* ---------- Regleta lateral de recorrido (pantallas anchas) ---------- */
    const sectors = (ctx?.car.sections || []).filter((s) => s.nav && document.getElementById(s.id));
    if (sectors.length > 1) {
      document.body.insertAdjacentHTML("beforeend", `
        <div class="fx-hud" aria-hidden="true">
          <span class="fx-hud__rail"><span class="fx-hud__fill"></span></span>
          ${sectors.map((s, i) => `<span class="fx-hud__tag" data-sector="${M.esc(s.id)}"><b>S${i + 1}</b>${M.esc(s.nav)}</span>`).join("")}
        </div>`);
      const hud = $(".fx-hud");
      const tags = $$(".fx-hud__tag", hud);
      scroll(animate($(".fx-hud__fill", hud), { scaleY: [0, 1] }, { easing: "linear" }));
      // Cada etiqueta, a la altura de la regleta en la que empieza su sección (se recalcula si cambia el alto de la página)
      const place = () => {
        const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        const tops = sectors.map((s) => document.getElementById(s.id).getBoundingClientRect().top + scrollY);
        tags.forEach((tag, i) => tag.style.setProperty("--at", `${(M.clamp(tops[i] / total, 0, 1) * 100).toFixed(2)}%`));
      };
      place();
      if ("ResizeObserver" in window) new ResizeObserver(place).observe(document.body);
      sectors.forEach((s, i) => inView(document.getElementById(s.id), () => {
        tags.forEach((tag, k) => tag.classList.toggle("is-on", k === i));
      }, { margin: "-45% 0px -45% 0px" }));
    }

    /* ---------- Salida: la sala se comprime y se apaga antes de navegar ---------- */
    const sala = document.getElementById("sala");
    let leaving = false;
    document.addEventListener("click", (e) => {
      const a = e.target.closest?.("a[href]");
      if (!a || leaving || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const to = new URL(a.href, location.href);
      if (to.origin !== location.origin || (to.pathname === location.pathname && to.search === location.search)) return;   // fuera del museo o ancla de esta página
      if (!a.closest(".exits, .topbar, .duel__head")) return;                                                           // sólo las salidas hacia otra sala o el Hall
      e.preventDefault();
      leaving = true;
      let gone = false;
      const go = () => { if (gone) return; gone = true; location.href = a.href; };
      animate(sala, { opacity: 0, scale: 0.96, filter: "blur(4px)" }, { duration: 0.3, easing: [0.4, 0, 0.2, 1] }).finished.then(go, go);
      setTimeout(go, 600);                                                                                              // por si la pestaña está en segundo plano y la animación no avanza
    });
    // Al volver con «atrás» desde la caché del navegador, la sala reaparece entera
    addEventListener("pageshow", (e) => { if (e.persisted) { leaving = false; animate(sala, { opacity: 1, scale: 1, filter: "blur(0px)" }, { duration: 0 }); } });
  };
})();
