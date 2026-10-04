/* =========================================================
   MÓDULO · parts-gallery
   Ingeniería pieza a pieza: índice lateral fijo + una pieza
   por bloque (foto con puntos numerados y tarjeta con leyenda).
   Una pieza puede tener varias vistas (p. ej. Suspensión /
   Frenos) con su propio conmutador; todo queda en memoria.
   Datos: { id, nav, kicker, title, intro,
            items:[{ id, index, num, title, audio,
                     views:[{ key, label, image, points:[{x,y,side,label,title,desc}],
                              historia, tecnico }] }] }
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, $$, esc, pad2 } = M;

  const viewMarkup = (v, key, hidden) => `
    <div class="view"${v.key ? ` data-view="${key}"` : ""} style="--ar: ${v.image.w} / ${v.image.h}"${hidden ? " hidden" : ""}>
      ${M.img(v.image, { cls: "photo" })}
      ${v.points.map((p, i) => `<button type="button" class="hs" data-hs="${i + 1}" data-side="${p.side || "t"}" style="top:${p.y}%;left:${p.x}%" aria-label="${i + 1} · ${esc(p.label)}">${i + 1}<span class="hs__label">${esc(p.label)}</span></button>`).join("")}
    </div>`;

  const paneMarkup = (v, key, hidden) => `
    <div data-pane="${key}"${hidden ? " hidden" : ""}>
      ${M.modeBlocks(v)}
      <p class="legend__hint">Pulsa un punto de la imagen</p>
      <ul class="legend" aria-label="Puntos señalados">
        ${v.points.map((p, i) => `<li data-hs="${i + 1}"><button type="button" class="legend__item" data-hs="${i + 1}" aria-expanded="false"><b>${i + 1}</b>${esc(p.title || p.label)}</button>
          <p class="legend__desc">${p.desc}</p></li>`).join("")}
      </ul>
    </div>`;

  M.define("parts-gallery", {
    render: (c, ctx) => `
      <section class="dive" id="${c.id}" aria-labelledby="${c.id}-title">
        <header class="dive__head">
          ${c.kicker ? `<p class="eyebrow rv" data-rv="repeat">${M.kicker(c.kicker)}</p>` : ""}
          <h2 class="section-title rv" data-rv="repeat" id="${c.id}-title">${esc(c.title)}</h2>
          ${c.intro ? `<p class="section-intro rv" data-rv="repeat">${c.intro}</p>` : ""}
        </header>
        <div class="dive__body">
          <nav class="dive__nav" aria-label="Componentes">
            <ol class="dive__index">${c.items.map((it, i) => `<li><a href="#${it.id}"><small>${pad2(i + 1)}</small>${esc(it.index || it.title)}</a></li>`).join("")}</ol>
          </nav>
          <div class="dive__parts">
            ${c.items.map((it) => {
              const multi = it.views.length > 1;
              const keyOf = (v, i) => v.key || (i ? `v${i}` : "main");
              return `
              <article class="piece" id="${it.id}"${multi ? " data-views" : ""}>
                <div class="piece__media">${it.views.map((v, i) => viewMarkup(v, keyOf(v, i), i > 0)).join("")}</div>
                <div class="piece__card card${multi ? " has-switch" : ""}">
                  <span class="card__num">${esc(it.num)}</span>
                  <h3 class="card__title">${esc(it.title)}</h3>
                  ${multi ? `<div class="switch" role="group" aria-label="Vista">${it.views.map((v, i) => `<button type="button" data-show="${keyOf(v, i)}" aria-pressed="${i === 0}">${esc(v.label)}</button>`).join("")}</div>` : ""}
                  ${it.views.map((v, i) => paneMarkup(v, keyOf(v, i), i > 0)).join("")}
                  ${it.audio ? M.audioControls(ctx.car) : ""}
                </div>
              </article>`;
            }).join("")}
          </div>
        </div>
      </section>`,

    mount(el, c, ctx) {
      const store = ctx.store;
      const pieces = $$(".piece", el);
      const indexLinks = $$(".dive__index a", el);
      const indexList = $(".dive__index", el);

      // Entrada repetible: entra al asomar un 15 % y se reinicia al salir del todo
      const enterIO = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.15) e.target.classList.add("is-in");
        else if (!e.isIntersecting) e.target.classList.remove("is-in");
      }), { threshold: [0, 0.15] });

      // Pieza activa en el índice (y última vista, en memoria)
      const activeIO = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        store.set("part", e.target.id);
        indexLinks.forEach((a) => {
          const on = a.hash === `#${e.target.id}`;
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
          if (on && indexList.scrollWidth > indexList.clientWidth) indexList.scrollTo({ left: a.offsetLeft - 24, behavior: M.reduceMotion ? "auto" : "smooth" });
        });
      }), { rootMargin: "-45% 0px -50% 0px" });
      pieces.forEach((p) => { enterIO.observe(p); activeIO.observe(p); });
      const savedPart = store.get("part");
      if (savedPart) indexLinks.forEach((a) => a.classList.toggle("is-active", a.hash === `#${savedPart}`));

      // Conmutador de vistas (foto + puntos + texto + leyenda), con memoria
      const setView = (piece, view) => {
        const buttons = $$("[data-show]", piece);
        if (!buttons.some((b) => b.dataset.show === view)) return;
        buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.show === view)));
        $$(".view[data-view]", piece).forEach((v) => (v.hidden = v.dataset.view !== view));
        $$("[data-pane]", piece).forEach((p) => (p.hidden = p.dataset.pane !== view));
        store.patch("views", piece.id, view);
      };
      const savedViews = store.get("views", {});
      $$("[data-views]", el).forEach((piece) => {
        $$("[data-show]", piece).forEach((b) => b.addEventListener("click", () => setView(piece, b.dataset.show)));
        if (savedViews[piece.id]) setView(piece, savedViews[piece.id]);
      });

      // Puntos de cada vista ↔ su leyenda (delegación: un listener por grupo)
      pieces.forEach((piece) => {
        $$(".view", piece).forEach((view, vi) => {
          const key = view.dataset.view || "main";
          const legend = $(`[data-pane="${key}"] .legend`, piece);
          if (!legend) return;
          const pins = $$(".hs[data-hs]", view);
          const items = $$("li[data-hs]", legend);
          const memory = `${piece.id}:${key}`;
          const activate = (n, fromPin) => {
            if (!pins.some((p) => p.dataset.hs === n)) n = "1";
            store.patch("hs", memory, n);
            pins.forEach((p) => { const on = p.dataset.hs === n; p.classList.toggle("is-active", on); p.setAttribute("aria-pressed", String(on)); });
            items.forEach((li) => { const on = li.dataset.hs === n; li.classList.toggle("is-active", on); $(".legend__item", li).setAttribute("aria-expanded", String(on)); });
            if (fromPin && innerWidth <= 900) {
              const li = items.find((x) => x.dataset.hs === n);
              if (li) li.scrollIntoView({ block: "nearest", behavior: M.reduceMotion ? "auto" : "smooth" });
            }
          };
          view.addEventListener("click", (e) => { const pin = e.target.closest(".hs[data-hs]"); if (pin) activate(pin.dataset.hs, true); });
          legend.addEventListener("click", (e) => { const b = e.target.closest(".legend__item"); if (b) activate(b.dataset.hs, false); });
          activate(store.get("hs", {})[memory] || "1", false);
        });
        const media = $(".piece__media", piece);
        M.zoomable(media, () => $(".view:not([hidden]) img", media));
      });

      // Las fotos visibles se cargan solas al acercarse (loading="lazy"); las vistas ocultas,
      // al apuntar o enfocar el botón que las muestra
      $$(".switch [data-show]", el).forEach((b) => M.warmOn(b, () => $(`[data-view="${b.dataset.show}"]`, b.closest(".piece"))));
    },
  });
})();
