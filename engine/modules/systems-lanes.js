/* =========================================================
   MÓDULO · systems-lanes
   Pórtico de carriles: cada pestaña es un sistema del coche.
   El escenario es fijo (sólo cambia el contenido); cada foto
   de despiece tiene números enlazados a la lista de piezas
   con enfoque óptico. Los carriles visitados quedan marcados.
   Datos: { id, nav, shield, kana, title, intro, hint,
            lanes:[{ key, kana, name, code, image, caption, title, line,
                     historia, tecnico:[[dt,dd,small]],
                     parts:[{ x, y, name, short, desc, value }] }] }
   Un despiece vertical (más alto que ancho) se maqueta en columna estrecha
   con altura limitada a la pantalla, para que la ficha quede al lado.
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, $$, esc } = M;
  const ARROW_DOWN = '<svg class="lane__arrow" viewBox="0 0 18 20" aria-hidden="true"><path d="M9 1v17M2 11l7 7 7-7" /></svg>';
  const CHECK = '<span class="lane__seen" aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M1.5 5.2l2.2 2.2L8.5 2.6" /></svg></span>';

  M.define("systems-lanes", {
    render: (c) => `
      <section class="section" id="${c.id}" aria-labelledby="${c.id}-title">
        ${M.plaqueHead(c)}
        <div class="gantry rv" style="--i:2">
          <div class="lanes" role="tablist" aria-label="${esc(c.title)}">
            ${c.lanes.map((l, i) => `
              <button type="button" class="lane plaque" role="tab" id="${c.id}-tab-${l.key}" aria-controls="${c.id}-lane-${l.key}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""} data-lane="${l.key}">
                ${l.kana ? `<span class="ja" lang="ja">${esc(l.kana)}</span>` : ""}<span class="lane__name">${esc(l.name)}</span><span class="lane__code">${esc(l.code)}</span>
                ${ARROW_DOWN}${CHECK}
              </button>`).join("")}
          </div>
        </div>

        <div class="stage">
          ${c.lanes.map((l, i) => `
            <article class="lane-panel${i === 0 ? " is-active" : ""}${l.image.h > l.image.w ? " is-portrait" : ""}" id="${c.id}-lane-${l.key}" role="tabpanel" aria-labelledby="${c.id}-tab-${l.key}">
              <figure class="lane-panel__fig">
                ${M.optic.markup(l.image, { inner: l.parts.map((p, k) => `<button type="button" class="pt" style="--x:${p.x}%;--y:${p.y}%" data-part="${k + 1}" aria-label="${k + 1} · ${esc(p.short || p.name)}"><span>${k + 1}</span></button>`).join("") })}
                ${l.caption ? `<figcaption>${esc(l.caption)}</figcaption>` : ""}
              </figure>
              <div class="lane-panel__info">
                <h3>${esc(l.title)}</h3>
                ${l.line ? `<span class="lane-panel__code">${esc(l.line)}</span>` : ""}
                ${l.historia ? `<p class="m-historia">${l.historia}</p>` : ""}
                ${l.tecnico ? M.dataList(l.tecnico, "data m-tecnico") : ""}
                <ol class="lane-parts">
                  ${l.parts.map((p, k) => `<li><button type="button" class="lane-part" data-part="${k + 1}" aria-pressed="false"><span class="lane-part__n">${k + 1}</span><span class="lane-part__name">${esc(p.name)}</span><span class="lane-part__d m-historia">${esc(p.desc)}</span><span class="lane-part__v m-tecnico">${esc(p.value)}</span></button></li>`).join("")}
                </ol>
              </div>
            </article>`).join("")}
        </div>
        ${c.hint ? `<p class="lanes__hint">${esc(c.hint)}</p>` : ""}
      </section>`,

    mount(el, c, ctx) {
      const store = ctx.store;
      const tabs = $$('[role="tab"]', el);
      const panels = $$(".lane-panel", el);
      const seen = new Set(Array.isArray(store.get("seen")) ? store.get("seen") : []);
      const paintSeen = () => tabs.forEach((t) => t.classList.toggle("is-seen", seen.has(t.dataset.lane)));

      const select = (tab, { focus = false, persist = true } = {}) => {
        tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
        panels.forEach((p) => { const on = p.id === tab.getAttribute("aria-controls"); p.classList.toggle("is-active", on); p.toggleAttribute("inert", !on); });
        if (focus) tab.focus();
        if (persist) M.scrollRowTo($(".lanes", el), tab, "start");
        seen.add(tab.dataset.lane);
        paintSeen();
        if (persist) { store.set("lane", tab.dataset.lane); store.set("seen", [...seen]); }
      };
      tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => select(tab));
        tab.addEventListener("keydown", (e) => {
          const n = tabs.length;
          const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
          if (to === undefined) return;
          e.preventDefault();
          select(tabs[to], { focus: true });
        });
      });
      // Carrusel (pantallas estrechas): degradado en cada borde que aún tiene carriles detrás;
      // el derecho desaparece al llegar al final y el izquierdo aparece al empezar a deslizar
      const lanesEl = $(".lanes", el);
      const paintFades = () => {
        const max = lanesEl.scrollWidth - lanesEl.clientWidth;
        const x = lanesEl.scrollLeft;
        lanesEl.style.setProperty("--fade-l", max > 1 && x > 4 ? "32px" : "0px");
        lanesEl.style.setProperty("--fade-r", max > 1 && x < max - 4 ? "56px" : "0px");
      };
      lanesEl.addEventListener("scroll", paintFades, { passive: true });
      lanesEl.addEventListener("scrollend", paintFades);         // posición final tras el ajuste del snap
      if ("ResizeObserver" in window) new ResizeObserver(paintFades).observe(lanesEl);
      paintFades();

      // Estado inicial: último carril abierto (sin escribir nada todavía)
      select(tabs.find((t) => t.dataset.lane === store.get("lane")) || tabs[0], { persist: false });

      // Piezas: número en la foto ⇄ fila de la lista, con enfoque óptico
      panels.forEach((panel) => {
        const optic = $("[data-optic]", panel);
        const pts = $$(".pt", panel);
        const rows = $$(".lane-part", panel);
        let locked = null;
        const light = (n) => {
          pts.forEach((p) => p.classList.toggle("is-on", p.dataset.part === n));
          rows.forEach((r) => r.classList.toggle("is-on", r.dataset.part === n));
          const pt = pts.find((p) => p.dataset.part === n);
          if (pt) M.optic.focus(optic, pt.style.getPropertyValue("--x"), pt.style.getPropertyValue("--y")); else M.optic.clear(optic);
        };
        const release = () => light(locked);
        const toggle = (n) => {
          locked = locked === n ? null : n;
          rows.forEach((r) => r.setAttribute("aria-pressed", String(r.dataset.part === locked)));
          light(locked);
        };
        [...pts, ...rows].forEach((x) => {
          x.addEventListener("pointerenter", () => { if (M.finePointer.matches) light(x.dataset.part); });
          x.addEventListener("pointerleave", () => { if (M.finePointer.matches) release(); });
          x.addEventListener("focus", () => light(x.dataset.part));
          x.addEventListener("blur", release);
          x.addEventListener("click", () => toggle(x.dataset.part));
        });
      });
      // El despiece de cada carril se pide al apuntar, enfocar o tocar su pestaña (no todos al cargar)
      $$("[role=tab]", el).forEach((tab) => M.warmOn(tab, () => document.getElementById(tab.getAttribute("aria-controls"))));
    },
  });
})();
