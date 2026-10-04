/* =========================================================
   MÓDULO · anatomy-tabs
   Vista lateral del coche con puntos numerados; cada punto
   abre su ficha (pestañas + tarjeta) y una línea guía une el
   punto con la tarjeta. Contenido por modo de lectura.
   Datos: { id, nav, kicker, title, intro, image,
            points:[{ x, y, side, label, aria, num, title,
                      historia:{text[],specs[],note}, tecnico:{…}, audio,
                      image }] }   ← image opcional: despiece de la pieza dentro de su tarjeta (ampliable)
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, $$, clamp, esc, pad2 } = M;

  const kicker = M.kicker;

  M.define("anatomy-tabs", {
    render: (c, ctx) => `
      <section class="anatomy" id="${c.id}" aria-labelledby="${c.id}-title">
        <header class="anatomy__head">
          ${c.kicker ? `<p class="eyebrow rv" data-rv="repeat">${kicker(c.kicker)}</p>` : ""}
          <h2 class="section-title rv" data-rv="repeat" id="${c.id}-title">${esc(c.title)}</h2>
          ${c.intro ? `<p class="section-intro rv" data-rv="repeat">${c.intro}</p>` : ""}
        </header>

        <div class="anatomy__stage">
          <figure class="car-figure" style="aspect-ratio:${c.image.w}/${c.image.h}">
            ${M.img(c.image, { cls: "photo js-car", picture: false })}
            <span class="car-figure__glow" aria-hidden="true"></span>
            ${c.points.map((p, i) => `<button type="button" class="hs" data-point="${i}" data-side="${p.side || "t"}" style="top:${p.y}%;left:${p.x}%" aria-label="${i + 1} · ${esc(p.aria || p.label)}">${i + 1}<span class="hs__label">${esc(p.label)}</span></button>`).join("")}
          </figure>

          <svg class="link" aria-hidden="true"><path pathLength="1" /></svg>

          <div class="anatomy__panel">
            <div class="tabs" role="tablist" aria-label="Puntos de interés">
              ${c.points.map((p, i) => `<button type="button" role="tab" id="${c.id}-tab-${i}" aria-controls="${c.id}-card-${i}" data-point="${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><small>${pad2(i + 1)}</small>${esc(p.label)}</button>`).join("")}
            </div>
            <div class="cards">
              ${c.points.map((p, i) => `
                <article class="card" role="tabpanel" id="${c.id}-card-${i}" aria-labelledby="${c.id}-tab-${i}" data-card="${i}"${i ? " hidden" : ""}>
                  <span class="card__num">${esc(p.num)}</span>
                  <h3 class="card__title">${esc(p.title)}</h3>
                  ${p.image ? `<figure class="card__media" style="aspect-ratio:${p.image.w}/${p.image.h}">${M.img(p.image, { cls: "photo" })}</figure>` : ""}
                  ${M.modeBlocks(p)}
                  ${p.audio ? M.audioControls(ctx.car) : ""}
                </article>`).join("")}
            </div>
          </div>
        </div>
      </section>`,

    mount(el, c, ctx) {
      const stage = $(".anatomy__stage", el);
      const link = $(".link", el);
      const path = $("path", link);
      const pins = $$(".car-figure .hs", el);
      const tabs = $$("[role=tab]", el);
      const cards = $$(".card", el);
      const count = pins.length;
      let active = 0;

      // Línea desde el punto activo hasta el borde superior de su tarjeta
      function draw() {
        const card = cards[active], pin = pins[active];
        if (!card || !pin || getComputedStyle(link).display === "none") return;
        const s = stage.getBoundingClientRect(), p = pin.getBoundingClientRect(), r = card.getBoundingClientRect();
        link.setAttribute("viewBox", `0 0 ${s.width} ${s.height}`);
        const x1 = p.left + p.width / 2 - s.left, y1 = p.top + p.height / 2 - s.top;
        const cx = clamp(x1, r.left - s.left + 24, r.right - s.left - 24), cy = r.top - s.top;
        const midY = y1 + (cy - y1) * 0.55;
        path.setAttribute("d", Math.abs(cx - x1) < 1 ? `M${x1} ${y1 + 14} V${cy}` : `M${x1} ${y1 + 14} V${midY} H${cx} V${cy}`);
      }

      function select(i, focusTab = false) {
        if (!cards[i]) return;
        const changed = i !== active || cards[i].hidden;
        active = i;
        ctx.store.set("point", i);
        pins.forEach((b, k) => { b.classList.toggle("is-active", k === i); b.setAttribute("aria-pressed", String(k === i)); });
        tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; if (k === i && focusTab) t.focus(); });
        cards.forEach((card, k) => {
          const show = k === i;
          if (show && changed && !M.reduceMotion) { card.classList.remove("is-entering"); void card.offsetWidth; card.classList.add("is-entering"); }
          card.hidden = !show;
        });
        link.classList.remove("is-drawn");
        requestAnimationFrame(() => { draw(); requestAnimationFrame(() => link.classList.add("is-drawn")); });
        M.scrollRowTo($(".tabs", el), tabs[i]);            // sólo la fila de pestañas; la foto no se mueve
        if (changed) M.pulse(pins[i]);
      }

      pins.forEach((b, k) => b.addEventListener("click", () => select(k)));
      tabs.forEach((t, k) => {
        t.addEventListener("click", () => select(k));
        t.addEventListener("keydown", (e) => {
          const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          select((active + dir + count) % count, true);
        });
      });
      cards.forEach((card) => card.addEventListener("animationend", () => card.classList.remove("is-entering")));
      addEventListener("resize", draw);
      addEventListener("load", draw);
      if ("ResizeObserver" in window) new ResizeObserver(draw).observe(stage);
      M.onMode(() => requestAnimationFrame(draw));               // la tarjeta cambia de alto
      M.zoomable($(".car-figure", el), () => $(".car-figure > img.js-car", el));
      $$(".card__media", el).forEach((fig) => M.zoomable(fig, () => $("img", fig)));
      // El despiece de cada tarjeta se pide al apuntar, enfocar o tocar su punto o su pestaña
      [...pins, ...tabs].forEach((b) => M.warmOn(b, () => cards[+b.dataset.point]));

      const saved = Number(ctx.store.get("point"));
      select(cards[saved] ? saved : 0);
    },
  });
})();
