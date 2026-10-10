/* =========================================================
   MUSEO · HALL · TELEMETRÍA Y CAPA DE MOVIMIENTO
   ---------------------------------------------------------
   Se apoya en el índice de salas (engine/hall-index.js) y añade:
     · tablero de telemetría del museo, calculado desde data/cars.json
       (salas abiertas / previstas, potencia sumada, régimen más alto
       y sala más potente);
     · en las salas con apertura programada (releaseDate): insignia,
       cuenta atrás con días, horas, minutos y segundos, y barra de estado;
   y, sólo si el visitante no ha pedido «reducir movimiento», carga
   Motion (engine/vendor/motion.min.js, copia local) para:
     · la entrada del tablero con muelle y los contadores de 0 a su valor;
     · la reordenación del índice al filtrar o buscar (FLIP): las tarjetas
       que salen se apagan en 200 ms y las que quedan se deslizan a su sitio;
     · la inclinación 3D de las tarjetas y el halo del color de cada sala
       que sigue al cursor (sólo con ratón).
   Estilos: engine/fx/hall-motion.css.
   ========================================================= */
(() => {
  "use strict";

  const start = async () => {
    const M = window.Museo;
    const cars = M?.hallCars;
    const section = document.getElementById("indice");
    if (!cars?.length || !section) return;
    const { $, $$, esc } = M;
    const nf = M.numberFormat(0);
    const short = (c) => c.model || c.name;

    /* ---------- Tablero de telemetría ---------- */
    const open = cars.filter((c) => M.isRoomOpen(c));
    const scheduled = cars.filter((c) => M.isScheduled(c)).length;
    const planned = Math.max(M.hallPlanned || 0, cars.length);
    const num = (c, key) => (typeof c.specs?.[key]?.value === "number" ? c.specs[key].value : 0);
    const best = (key) => open.reduce((a, c) => (num(c, key) > num(a, key) ? c : a), open[0]);
    const power = open.reduce((sum, c) => sum + num(c, "power"), 0);
    const strong = best("power"), revs = best("redline");
    const cells = [
      { label: "Salas activas", value: open.length, unit: `/ ${nf.format(planned)}`, bar: open.length / planned,
        note: scheduled ? `${scheduled} con apertura programada` : `${cars.length - open.length} en desarrollo` },
      { label: "Potencia en exhibición", value: power, unit: "CV", note: `Suma de las ${open.length} salas abiertas` },
      num(revs, "redline") ? { label: "Régimen máximo", value: num(revs, "redline"), unit: "rpm", note: `${revs.brand} ${short(revs)}` } : null,
      { label: "Sala más potente", value: num(strong, "power"), unit: "CV", note: `${strong.brand} ${short(strong)}` },
    ].filter(Boolean);
    section.insertAdjacentHTML("afterbegin", `
      <dl class="hud" aria-label="Telemetría del museo">
        ${cells.map((c) => `
          <div class="hud__cell">
            <dt>${esc(c.label)}</dt>
            <dd><span class="hud__num" data-to="${c.value}">${nf.format(c.value)}</span> <small>${esc(c.unit)}</small></dd>
            ${c.bar != null ? `<span class="hud__bar" aria-hidden="true"><i style="--k:${c.bar.toFixed(4)}"></i></span>` : ""}
            <span class="hud__note">${esc(c.note)}</span>
          </div>`).join("")}
      </dl>`);
    const hud = $(".hud", section);

    /* ---------- Salas con apertura programada: insignia, cuenta atrás y barra de estado ---------- */
    const clocks = [];
    $$(".idx__item", section).forEach((item) => {
      const c = cars[+item.dataset.i];
      const body = $(".idx__body", item);
      if (!c || !body || !M.isScheduled(c)) return;
      item.classList.add("has-launch");
      body.insertAdjacentHTML("beforeend", `
        <span class="launch">
          <span class="launch__badge"><span class="launch__lamp" aria-hidden="true"></span>Telemetría anticipada // Apertura programada</span>
          <span class="launch__clock" aria-hidden="true">${[["d", "d"], ["h", "h"], ["m", "min"], ["s", "s"]].map(([k, u]) => `<span><b data-u="${k}">00</b>${u}</span>`).join("")}</span>
          <span class="launch__date">Abre el ${esc(M.releaseLabel(c))}</span>
          <span class="launch__scan"><i aria-hidden="true"></i>Sistemas calibrando // Telemetría bloqueada</span>
        </span>`);
      clocks.push({ at: Date.parse(c.releaseDate), el: Object.fromEntries($$("[data-u]", body).map((b) => [b.dataset.u, b])) });
    });
    if (clocks.length) {
      const tick = () => clocks.forEach(({ at, el }) => {
        const s = Math.max(0, Math.floor((at - Date.now()) / 1000));
        el.d.textContent = M.pad2(Math.floor(s / 86400));
        el.h.textContent = M.pad2(Math.floor((s % 86400) / 3600));
        el.m.textContent = M.pad2(Math.floor((s % 3600) / 60));
        el.s.textContent = M.pad2(s % 60);
      });
      tick();
      setInterval(tick, 1000);          // al llegar a cero, la cuenta atrás del índice (data-reload) recarga el Hall
    }

    /* ---------- Movimiento (sólo sin «reducir movimiento») ---------- */
    if (M.reduceMotion) return;
    try { await M.loadScript("engine/vendor/motion.min.js"); } catch (err) { console.error(err); return; }
    const { animate, inView, spring, stagger } = window.Motion;
    document.documentElement.classList.add("fx-hall");

    // Tablero: celdas en cadena con muelle, contadores de 0 a su valor y barra de progreso
    const hudCells = $$(".hud__cell", hud);
    const nums = $$(".hud__num", hud);
    nums.forEach((n) => { n.textContent = nf.format(0); });
    animate(hudCells, { opacity: 0 }, { duration: 0 });
    inView(hud, () => {
      animate(hudCells, { opacity: [0, 1], y: [26, 0] }, { delay: stagger(0.09), easing: spring({ stiffness: 120, damping: 14 }) });
      nums.forEach((n, i) => {
        const to = +n.dataset.to;
        animate((p) => { n.textContent = nf.format(Math.round(to * p)); }, { duration: 1.6, delay: 0.15 + i * 0.09, easing: [0.16, 1, 0.3, 1] });
      });
      $$(".hud__bar i", hud).forEach((bar) => animate(bar, { scaleX: [0, +bar.style.getPropertyValue("--k")] }, { duration: 1.4, delay: 0.3, easing: [0.16, 1, 0.3, 1] }));
    }, { amount: 0.4 });

    /* Reordenación del índice (la llama engine/hall-index.js en cada filtrado o búsqueda):
       primero se apagan las que salen, luego se aplica el cambio y las que quedan se deslizan
       desde donde estaban (FLIP). Las medidas se leen todas juntas, antes de animar. */
    const slide = spring({ stiffness: 170, damping: 22 });
    let turn = 0;
    M.fx = M.fx || {};
    M.fx.hallFlip = ({ items, shown, commit }) => {
      const mine = ++turn;
      const visible = items.filter((el) => !el.hidden);
      const first = new Map(visible.map((el) => [el, el.getBoundingClientRect()]));
      const leaving = visible.filter((el) => !shown.has(+el.dataset.i));
      const settle = () => {
        if (mine !== turn) return;                 // otro filtrado llegó mientras tanto: manda el último
        commit();
        leaving.forEach((el) => animate(el, { opacity: 1, scale: 1 }, { duration: 0 }));
        const now = items.filter((el) => !el.hidden);
        const last = new Map(now.map((el) => [el, el.getBoundingClientRect()]));
        now.forEach((el) => {
          const a = first.get(el), b = last.get(el);
          if (!a) return animate(el, { opacity: [0, 1], scale: [0.94, 1] }, { duration: 0.35, easing: [0.22, 1, 0.36, 1] });
          animate(el, { opacity: 1, scale: 1 }, { duration: 0.2 });
          const dx = a.left - b.left, dy = a.top - b.top;
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) animate(el, { x: [dx, 0], y: [dy, 0] }, { easing: slide });
        });
      };
      if (!leaving.length) return settle();
      animate(leaving, { opacity: 0, scale: 0.96 }, { duration: 0.2, easing: "ease-out" }).finished.then(settle, settle);
    };

    // Inclinación 3D y halo del color de la sala (--accent de cada tarjeta), sólo con ratón
    if (M.finePointer.matches) {
      const ease = spring({ stiffness: 150, damping: 15 });
      const MAX = 3.5;
      $$(".idx__item", section).forEach((item) => {
        const card = $(".idx__card", item);
        let rect = null, frame = 0, px = 0, py = 0;
        item.addEventListener("pointerenter", () => { rect = item.getBoundingClientRect(); });
        item.addEventListener("pointermove", (e) => {
          if (!rect) rect = item.getBoundingClientRect();
          const x = e.clientX - rect.left, y = e.clientY - rect.top;
          px = (x / rect.width) * 2 - 1; py = (y / rect.height) * 2 - 1;
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            card.style.setProperty("--mouse-x", `${((px + 1) / 2 * rect.width).toFixed(1)}px`);
            card.style.setProperty("--mouse-y", `${((py + 1) / 2 * rect.height).toFixed(1)}px`);
            animate(card, { rotateX: -py * MAX, rotateY: px * MAX }, { easing: ease });
          });
        }, { passive: true });
        item.addEventListener("pointerleave", () => {
          if (frame) { cancelAnimationFrame(frame); frame = 0; }
          rect = null;
          animate(card, { rotateX: 0, rotateY: 0 }, { easing: ease });
        });
      });
    }
  };

  if (window.Museo?.hallReady && document.getElementById("indice")) start();
  else document.addEventListener("museo:hall", () => start(), { once: true });
})();
