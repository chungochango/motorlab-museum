/* =========================================================
   MÓDULO · hero-plate
   Portada con la foto del coche a sangre, un panel-título
   sobre ella y puntos de detalle que abren una vista emergente
   (nace del punto) con enfoque óptico sobre la foto.
   Debajo, una tira de datos por modo de lectura.
   Datos: { id, nav, image, sign:{shield,route,title,kana,foot},
            spots:[{ key,label,x,y, pop:{opens,at,image,title,text} }],
            strip:{historia,tecnico}, note }
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, $$, esc } = M;
  const ARROW_NE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19L19 5M9 5h10v10" /></svg>';

  M.define("hero-plate", {
    render: (c, ctx) => {
      const s = c.sign;
      const pos = (at) => Object.entries(at).map(([k, v]) => `${k}:${v}`).join(";");
      return `
      <section class="hero-plate" id="${c.id}" aria-labelledby="${c.id}-title">
        <div class="hero-plate__stage">
          <header class="plaque plaque--hero">
            <p class="plaque__route">${s.shield ? `<span class="shield">${esc(s.shield)}</span>` : ""}${s.route ? `<span class="ja" lang="ja">${esc(s.route)}</span>` : ""}<small>Sala ${ctx.room}</small></p>
            <h1 class="hero-plate__title" id="${c.id}-title">${esc(s.title)}</h1>
            <p class="plaque__foot">${s.kana ? `<span class="hero-plate__kana ja" lang="ja">${esc(s.kana)}</span>` : ""}<span>${esc(s.foot)}</span>${ARROW_NE}</p>
          </header>
          ${M.optic.markup(c.image, { cls: "hero-plate__photo", lazy: false, priority: true, inner: `
            <span class="lamps lamps--loop" aria-hidden="true"></span>
            ${c.spots.map((sp) => `<button type="button" class="spot" style="--x:${sp.x}%;--y:${sp.y}%" data-spot="${sp.key}" aria-expanded="false" aria-controls="${c.id}-pop-${sp.key}"><span class="spot__ring"></span><span class="spot__label">${esc(sp.label)}</span><span class="sr">Ver detalle: ${esc(sp.label)}</span></button>`).join("")}` })}
          <div class="pops">
            ${c.spots.map((sp) => `
              <figure class="pop pop--${sp.pop.opens || "se"}" id="${c.id}-pop-${sp.key}" style="${pos(sp.pop.at)}">
                ${M.img(sp.pop.image)}
                <figcaption><strong>${esc(sp.pop.title)}</strong><p>${sp.pop.text}</p></figcaption>
              </figure>`).join("")}
          </div>
        </div>

        <div class="strip">
          ${M.byMode(c.strip, (list, cls) => `<div class="strip__row ${cls}">${list.map(([v, l]) => `<div><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join("")}</div>`)}
          ${c.note ? `<p class="strip__note">${esc(c.note)}</p>` : ""}
        </div>
      </section>`;
    },

    mount(el) {
      const photo = $(".hero-plate__photo", el);
      const spots = $$(".spot", el);
      let pinned = null;

      const open = (spot) => {
        if (spot && spot.getAttribute("aria-expanded") !== "true") M.pulse(spot);   // sólo al abrirse
        spots.forEach((s) => {
          const on = s === spot;
          s.setAttribute("aria-expanded", String(on));
          document.getElementById(s.getAttribute("aria-controls")).classList.toggle("is-open", on);
        });
        if (spot) { M.optic.focus(photo, spot.style.getPropertyValue("--x"), spot.style.getPropertyValue("--y")); el.classList.add("is-focus"); }
        else { M.optic.clear(photo); el.classList.remove("is-focus"); }
      };
      // Hover / foco = vista previa; clic = fija; Esc o clic fuera = cierra
      spots.forEach((spot) => {
        spot.addEventListener("click", () => {
          pinned = pinned === spot ? null : spot;
          open(pinned);
          // Al fijar una vista, si su ficha no cabe en pantalla (portátiles de 768 px de alto), la página baja lo justo
          if (pinned) requestAnimationFrame(() => {
            const r = document.getElementById(spot.getAttribute("aria-controls")).getBoundingClientRect();
            const over = r.bottom - (innerHeight - 16);
            if (over > 0 && r.height < innerHeight - 96) scrollBy({ top: over, behavior: M.reduceMotion ? "auto" : "smooth" });
          });
        });
        spot.addEventListener("pointerenter", () => { if (M.finePointer.matches && !pinned) open(spot); });
        spot.addEventListener("pointerleave", () => { if (M.finePointer.matches && !pinned) open(null); });
        spot.addEventListener("focus", () => { if (!pinned) open(spot); });
        spot.addEventListener("blur", () => { if (!pinned) open(null); });
      });
      document.addEventListener("click", (e) => { if (pinned && !e.target.closest(".spot, .pop")) { pinned = null; open(null); } });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && pinned) { const s = pinned; pinned = null; open(null); s.focus(); } });
      // Cada vista de detalle se pide al apuntar, enfocar o tocar su punto (no todas al cargar)
      $$(".spot", el).forEach((spot) => M.warmOn(spot, () => document.getElementById(spot.getAttribute("aria-controls"))));
    },
  });
})();
