/* =========================================================
   MÓDULO · homologation-bay
   Box de homologación (Sala 04 · BMW M3 E30): perfil del coche
   con cotas, sello FIA y seis piezas señaladas.
     · Pulsar una pieza acerca la "cámara" a su zona (transform
       del encuadre, con los marcadores compensando la escala) y
       abre el panel de detalle con el despiece en alta resolución
       y su ficha. Cambiar de pieza desplaza la cámara; cerrar
       (botón, Esc o clic en el coche) vuelve al plano general.
     · Reglaje STRASSENVERSION / DTM SPEC en la barra lateral:
       cambia la ficha (potencia, régimen, peso) con contador, el
       alerón (más incidencia y flap Gurney) y el esquema de cámber.
   Datos: { id, nav, kicker, title, intro, stamp:[a,b], image,
            rig:{ wing:[x1,y1,x2,y2], tilt, gurney:[x,y,w,h], strut:[x,w] },
            dims:[{ from:[x,y], to:[x,y], label, value, vertical }],
            setups:{ default, note, modes:[{ key, label, sub, camber, readouts:[[l,v,u]] }] },
            points:[{ id, x, y, side, label, num, title, image,
                      story (Historia), technical:[[etiqueta, valor]] (Técnico) }] }
            · "1ª: 3.72 | 2ª: 2.40 | …" en un valor técnico se muestra como relaciones en columna
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, $$, esc, pad2 } = M;
  const nf = (n) => n.toLocaleString("es-ES");
  const num = (v) => { const n = Number(String(v).replace("−", "-").replace(/\./g, "").replace(",", ".")); return Number.isFinite(n) ? n : null; };
  const CLOSE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>';
  const ARROW = (d) => `<svg viewBox="0 0 16 12" aria-hidden="true"><path d="${d}" /></svg>`;

  /* Valor de la ficha técnica: "1ª: 3.72 | 2ª: 2.40 | …" se muestra como relaciones en columna;
     cualquier otro valor, como texto */
  const techValue = (v) => {
    const items = String(v).split(" | ");
    if (items.length < 2) return esc(v);
    return `<span class="hb-tech__set">${items.map((it) => {
      const [k, ...rest] = it.split(": ");
      if (!rest.length) return `<span>${esc(it)}</span>`;
      const [, val, note] = rest.join(": ").match(/^(.*?)(?:\s+\((.+)\))?$/);   // "1.00 (Direct Drive)" → cifra + nota
      return `<span><small>${esc(k)}</small>${esc(val)}${note ? `<em>${esc(note)}</em>` : ""}</span>`;
    }).join("")}</span>`;
  };

  /* Perfil del alerón en sección (el flujo de aire va de izquierda a derecha): plano principal fijo
     y flap superior que gira sobre su eje según el reglaje (--flap). En una vista lateral de la foto
     el DRS no se aprecia (se ve la placa lateral), así que se explica con este esquema. */
  const wingSVG = () => `
    <svg class="hb-camber__svg hb-wing-svg" viewBox="0 0 160 70" aria-hidden="true" focusable="false">
      <g class="hb-wing-svg__flow"><path d="M4 22 H156" /><path d="M4 50 H156" /></g>
      <path class="hb-wing-svg__main" d="M22 44 C34 34 74 32 104 38 C112 40 116 42 118 44 C96 46 54 48 22 44 Z" />
      <g class="hb-wing-svg__flap"><path d="M110 36 C120 30 136 27 146 28 C140 32 126 36 112 38 Z" /><circle cx="111" cy="37" r="1.6" /></g>
    </svg>`;

  // Esquema frontal del cámber: dos ruedas vistas de frente unidas por el eje
  const camberSVG = () => `
    <svg class="hb-camber__svg" viewBox="0 0 160 70" aria-hidden="true" focusable="false">
      <line class="hb-camber__ground" x1="6" y1="62" x2="154" y2="62" />
      <line class="hb-camber__axle" x1="34" y1="36" x2="126" y2="36" />
      <g class="hb-camber__wheel hb-camber__wheel--l"><rect x="24" y="12" width="16" height="50" rx="3" /><line x1="32" y1="4" x2="32" y2="66" /></g>
      <g class="hb-camber__wheel hb-camber__wheel--r"><rect x="120" y="12" width="16" height="50" rx="3" /><line x1="128" y1="4" x2="128" y2="66" /></g>
      <line class="hb-camber__ref" x1="32" y1="4" x2="32" y2="66" /><line class="hb-camber__ref" x1="128" y1="4" x2="128" y2="66" />
    </svg>`;

  M.define("homologation-bay", {
    render: (c) => {
      const im = c.image, g = c.rig || {};
      const modes = c.setups.modes;
      const diagram = c.setups.diagram || "camber";      // esquema de la barra lateral: "camber" (M3), "wing" (GT3 RS) o "none"
      const [x1, y1, x2, y2] = g.wing || [0, 0, 0, 0], ww = x2 - x1, wh = y2 - y1;
      const dim = (d) => {
        const [ax, ay] = d.from, [bx, by] = d.to;
        return `<g class="hb-dim${d.vertical ? " hb-dim--v" : ""}">
          <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" />
          ${d.vertical
            ? `<line x1="${ax - 0.6}" y1="${ay}" x2="${ax + 0.6}" y2="${ay}" /><line x1="${bx - 0.6}" y1="${by}" x2="${bx + 0.6}" y2="${by}" />`
            : `<line x1="${ax}" y1="${ay - 1}" x2="${ax}" y2="${ay + 1}" /><line x1="${bx}" y1="${by - 1}" x2="${bx}" y2="${by + 1}" />`}
        </g>`;
      };
      const dimLabel = (d) => {
        const [ax, ay] = d.from, [bx, by] = d.to;
        return `<span class="hb-dimlabel${d.vertical ? " hb-dimlabel--v" : ""}" style="left:${(ax + bx) / 2}%;top:${(ay + by) / 2}%">${esc(d.label)} <b>${esc(d.value)}</b></span>`;
      };
      return `
      <section class="bay" id="${c.id}" aria-labelledby="${c.id}-title" data-setup="${modes[0].key}">
        <header class="bay__head">
          ${c.kicker ? `<p class="eyebrow rv" data-rv="repeat">${M.kicker(c.kicker)}</p>` : ""}
          <h2 class="section-title rv" data-rv="repeat" id="${c.id}-title">${esc(c.title)}</h2>
          ${c.intro ? `<p class="section-intro rv" data-rv="repeat">${c.intro}</p>` : ""}
        </header>

        <div class="bay__grid">
          <div class="bay__stage">
            <span class="bay__stripe" aria-hidden="true"><i></i><i></i><i></i></span>
            ${c.stamp ? `<p class="bay__stamp" aria-label="${esc(c.stamp.join(" "))}"><span>${esc(c.stamp[0])}</span><b>${esc(c.stamp[1])}</b></p>` : ""}
            <div class="bay__view" style="aspect-ratio:${im.w}/${im.h}">
              <div class="bay__cam">
                ${M.img(im, { cls: "hb-photo", lazy: true })}
                ${g.wing ? `
                  <span class="hb-wingbed" style="left:${x1}%;top:${y1}%;width:${ww}%;height:${wh}%"></span>
                  ${g.strut ? `<span class="hb-strut" style="left:${g.strut[0]}%;top:${y2 - 1.6}%;width:${g.strut[1]}%;height:1.6%"></span>` : ""}
                  <div class="hb-wing" style="left:${x1}%;top:${y1}%;width:${ww}%;height:${wh}%">
                    ${M.img(im, { cls: "hb-photo", alt: "", lazy: true, extra: `style="width:${(100 / ww) * 100}%;height:${(100 / wh) * 100}%;left:${(-x1 / ww) * 100}%;top:${(-y1 / wh) * 100}%"` })}
                    ${g.gurney ? `<span class="hb-gurney" style="left:${((g.gurney[0] - x1) / ww) * 100}%;top:${((g.gurney[1] - y1) / wh) * 100}%;width:${(g.gurney[2] / ww) * 100}%;height:${(g.gurney[3] / wh) * 100}%"></span>` : ""}
                  </div>` : ""}
                <svg class="hb-dims" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${(c.dims || []).map(dim).join("")}</svg>
                <div class="hb-dimlabels" aria-hidden="true">${(c.dims || []).map(dimLabel).join("")}</div>
                ${c.points.map((p, i) => `
                  <button type="button" class="hb-pin" data-point="${i}" data-side="${p.side || "t"}" style="left:${p.x}%;top:${p.y}%" aria-label="${pad2(i + 1)} · ${esc(p.title)}" aria-controls="${c.id}-detail" aria-expanded="false">
                    <span class="hb-pin__tag" aria-hidden="true">${pad2(i + 1)}</span><span class="hb-pin__label" aria-hidden="true">${esc(p.label)}</span>
                  </button>`).join("")}
              </div>
            </div>
            <p class="bay__hint" aria-hidden="true">Pulsa una pieza para acercarte</p>
          </div>

          <aside class="bay__side" aria-label="Reglaje y piezas">
            <div class="hb-setup" role="group" aria-label="Reglaje">
              ${modes.map((m, i) => `<button type="button" data-setup-set="${m.key}" aria-pressed="${i === 0}"><b>${esc(m.label)}</b><small>${esc(m.sub || "")}</small></button>`).join("")}
            </div>
            <dl class="hb-sheet" aria-live="polite">
              ${modes[0].readouts.map(([l, v, u]) => `<div><dt>${esc(l)}</dt><dd><span>${esc(v)}</span><small>${esc(u || "")}</small></dd></div>`).join("")}
            </dl>
            ${diagram === "none" ? "" : `
            <figure class="hb-camber hb-diagram--${diagram}">
              ${diagram === "wing" ? wingSVG() : camberSVG()}
              <figcaption>${esc(c.setups.diagramLabel || (diagram === "wing" ? "Perfil del alerón" : "Cámber delantero"))} <span>${esc(c.setups.note || "")}</span></figcaption>
            </figure>`}
            <ol class="hb-index" aria-label="Piezas">
              ${c.points.map((p, i) => `<li><button type="button" data-point="${i}" aria-controls="${c.id}-detail"><small>${pad2(i + 1)}</small>${esc(p.title)}</button></li>`).join("")}
            </ol>
          </aside>

          <div class="bay__detail" id="${c.id}-detail" role="dialog" aria-modal="false" aria-label="Detalle de la pieza" hidden>
            <span class="hb-grip" aria-hidden="true"></span>
            <div class="hb-detail__bar">
              <span class="hb-detail__count"><b>01</b> / ${pad2(c.points.length)}</span>
              <span class="hb-detail__modes" role="group" aria-label="Modo de lectura del detalle">
                <button type="button" data-mode-set="historia" aria-pressed="true">Historia</button><button type="button" data-mode-set="tecnico" aria-pressed="false">Técnico</button>
              </span>
              <button type="button" class="hb-detail__nav" data-step="-1" aria-label="Pieza anterior">${ARROW("M15 6H1M6 1L1 6l5 5")}</button>
              <button type="button" class="hb-detail__nav" data-step="1" aria-label="Pieza siguiente">${ARROW("M1 6h14M10 1l5 5-5 5")}</button>
              <button type="button" class="hb-detail__close" aria-label="Cerrar el detalle">${CLOSE}</button>
            </div>
            ${c.points.map((p, i) => `
              <article class="hb-part" data-part="${i}" hidden>
                <p class="hb-part__num">${esc(p.num)}</p>
                <h3 class="hb-part__title">${esc(p.title)}</h3>
                ${p.image ? `<figure class="hb-part__shot" style="aspect-ratio:${p.image.w}/${p.image.h}">${M.img(p.image, { cls: "photo" })}</figure>` : ""}
                ${p.story || p.technical ? `
                  <div class="m-historia">
                    <p class="hb-part__kicker">${esc(c.labels?.story || "Historia · competición y homologación")}</p>
                    ${[].concat(p.story || []).map((t) => `<p class="card__text">${esc(t)}</p>`).join("")}
                  </div>
                  <div class="m-tecnico">
                    <p class="hb-part__kicker">${esc(c.labels?.technical || "Ficha de ingeniería")}</p>
                    <dl class="hb-tech">${(p.technical || []).map(([dt, dd]) => `<div><dt>${esc(dt)}</dt><dd>${techValue(dd)}</dd></div>`).join("")}</dl>
                  </div>` : `
                  ${p.desc ? `<p class="card__text">${esc(p.desc)}</p>` : ""}
                  ${p.specs?.length ? `<dl class="specs-list">${p.specs.map(([dt, dd]) => `<div><dt>${esc(dt)}</dt><dd>${esc(dd)}</dd></div>`).join("")}</dl>` : ""}`}
              </article>`).join("")}
          </div>
        </div>
      </section>`;
    },

    mount(el, c, ctx) {
      const view = $(".bay__view", el), cam = $(".bay__cam", el);
      const detail = $(".bay__detail", el);
      const pins = $$(".hb-pin", el), parts = $$(".hb-part", el);
      const count = $(".hb-detail__count b", detail);
      const modes = c.setups.modes;
      const mq = matchMedia("(max-width: 1023px)");
      let open = -1, opener = null, closeTimer = 0;

      /* ---------- Cámara: acerca el punto al centro del encuadre ---------- */
      function aim(i) {
        if (i < 0) { cam.style.setProperty("--hb-s", 1); cam.style.setProperty("--hb-tx", "0%"); cam.style.setProperty("--hb-ty", "0%"); return; }
        const p = c.points[i], s = mq.matches ? 1.7 : 2.1;
        const clamp = (v) => Math.min(0, Math.max(100 - 100 * s, v));   // sin dejar bordes vacíos
        cam.style.setProperty("--hb-s", s);
        cam.style.setProperty("--hb-tx", `${clamp(50 - p.x * s)}%`);
        cam.style.setProperty("--hb-ty", `${clamp((mq.matches ? 45 : 50) - p.y * s)}%`);
      }

      /* ---------- Alta resolución bajo demanda ----------
         La cámara amplía la foto ×2: si el catálogo trae una variante "hires", se pide al apuntar o
         abrir una pieza, en el mismo formato que eligió el navegador (avif › webp › jpg), y se cambia
         ya decodificada (sin parpadeo). Al ver la sala sin acercarse no se descarga. */
      const hi = c.image.hires;
      let hiDone = !hi;
      const swapExt = (src, f) => src.replace(/\.[a-z0-9]+$/i, `.${f}`);
      function upgrade() {
        if (hiDone) return;
        hiDone = true;
        const img = cam.querySelector(":scope > picture > img, :scope > img");
        if (!img) return;
        const pic = img.parentElement.tagName === "PICTURE" ? img.parentElement : null;
        const ext = (img.currentSrc || img.src).split("?")[0].split(".").pop().toLowerCase();
        const fmt = (hi.formats || []).includes(ext) ? ext : null;
        M.bufferImage(M.url(fmt ? swapExt(hi.src, fmt) : hi.src)).then((ok) => {
          if (!ok) return;
          pic?.querySelectorAll("source").forEach((s) => {
            const f = s.type.split("/")[1];
            if ((hi.formats || []).includes(f)) s.srcset = M.url(swapExt(hi.src, f)); else s.remove();   // sin esa variante, cae al jpg nítido
          });
          img.src = M.url(hi.src);
        });
      }

      /* ---------- Panel de detalle ---------- */
      function show(i, from) {
        i = (i + parts.length) % parts.length;
        clearTimeout(closeTimer);
        if (open < 0) {
          opener = from || pins[i];
          detail.hidden = false;
          void detail.offsetWidth;                       // primera entrada con transición
          // Móvil: el detalle es una hoja inferior; el encuadre sube bajo la cabecera para verse el zoom
          if (mq.matches) scrollTo({ top: view.getBoundingClientRect().top + scrollY - 72, behavior: M.reduceMotion ? "auto" : "smooth" });
        }
        open = i;
        upgrade();                                     // al acercarse, la foto pasa a alta resolución
        el.classList.add("is-zoomed");
        detail.classList.add("is-open");
        parts.forEach((a, k) => { a.hidden = k !== i; });
        pins.forEach((b, k) => { b.classList.toggle("is-active", k === i); b.setAttribute("aria-expanded", String(k === i)); });
        $$(".hb-index button", el).forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
        count.textContent = pad2(i + 1);
        aim(i);
        ctx.store.set("bayPart", i);
      }
      function close() {
        if (open < 0) return;
        open = -1;
        el.classList.remove("is-zoomed");
        detail.classList.remove("is-open", "is-expanded");
        pins.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-expanded", "false"); });
        $$(".hb-index button", el).forEach((b) => b.removeAttribute("aria-current"));
        aim(-1);
        closeTimer = setTimeout(() => { detail.hidden = true; }, M.reduceMotion ? 0 : 450);
        opener?.focus({ preventScroll: true });
        ctx.store.set("bayPart", -1);
      }
      pins.forEach((b, k) => b.addEventListener("click", (e) => { e.stopPropagation(); open === k ? close() : show(k, b); }));
      $$(".hb-index button", el).forEach((b) => b.addEventListener("click", () => show(+b.dataset.point, b)));
      $$(".hb-detail__nav", detail).forEach((b) => b.addEventListener("click", () => show(open + Number(b.dataset.step))));
      $(".hb-detail__close", detail).addEventListener("click", close);
      view.addEventListener("click", () => { if (open >= 0) close(); });
      el.addEventListener("keydown", (e) => {
        if (open < 0) return;
        if (e.key === "Escape") { e.preventDefault(); close(); }
        if (e.key === "ArrowRight" && detail.contains(document.activeElement)) show(open + 1);
        if (e.key === "ArrowLeft" && detail.contains(document.activeElement)) show(open - 1);
      });
      $$(".hb-part__shot", el).forEach((fig) => M.zoomable(fig, () => $("img", fig)));
      // El despiece en alta resolución se pide al apuntar, enfocar o tocar la pieza (no al cargar la sala)
      [...pins, ...$$(".hb-index button", el)].forEach((b) => M.warmOn(b, () => { upgrade(); return parts[+b.dataset.point]; }));
      mq.addEventListener?.("change", () => aim(open));

      /* Hoja inferior (móvil): se arrastra desde el asa o la barra. Hacia arriba se expande;
         hacia abajo (o con un gesto rápido) se cierra; si no, vuelve a su sitio */
      let sheetDrag = null;
      const handle = (e) => mq.matches && open >= 0 && (e.target.closest(".hb-grip") || (e.target.closest(".hb-detail__bar") && !e.target.closest("button")));
      detail.addEventListener("pointerdown", (e) => {
        if (!handle(e) || sheetDrag) return;
        sheetDrag = { id: e.pointerId, y: e.clientY, t: performance.now(), dy: 0 };
        detail.classList.add("is-dragging");
        try { detail.setPointerCapture(e.pointerId); } catch {}
      });
      detail.addEventListener("pointermove", (e) => {
        if (!sheetDrag || e.pointerId !== sheetDrag.id) return;
        sheetDrag.dy = e.clientY - sheetDrag.y;
        const dy = sheetDrag.dy < 0 ? sheetDrag.dy * 0.35 : sheetDrag.dy;      // hacia arriba, con resistencia
        detail.style.transform = `translateY(${dy}px)`;
      });
      const endSheet = (e) => {
        if (!sheetDrag || e.pointerId !== sheetDrag.id) return;
        const { dy, t } = sheetDrag;
        const v = dy / Math.max(1, performance.now() - t);
        sheetDrag = null;
        detail.classList.remove("is-dragging");
        detail.style.transform = "";
        if (dy > 90 || v > 0.6) close();
        else if (dy < -40) detail.classList.add("is-expanded");
      };
      detail.addEventListener("pointerup", endSheet);
      detail.addEventListener("pointercancel", endSheet);

      /* ---------- Reglaje: Strassenversion / DTM Spec ---------- */
      const timers = new Map();
      function countTo(dd, to) {
        const span = $("span", dd), from = num(span.textContent), target = num(to);
        cancelAnimationFrame(timers.get(dd));
        if (from === null || target === null || M.reduceMotion) { span.textContent = to; return; }
        const t0 = performance.now();
        const tick = (now) => {
          const k = Math.min(1, (now - t0) / 700), e = 1 - (1 - k) ** 3;
          span.textContent = k < 1 ? nf(Math.round(from + (target - from) * e)) : to;
          if (k < 1) timers.set(dd, requestAnimationFrame(tick));
        };
        timers.set(dd, requestAnimationFrame(tick));
      }
      function setSetup(key, save = true) {
        const m = modes.find((x) => x.key === key) || modes[0];
        el.dataset.setup = m.key;
        el.style.setProperty("--camber", `${m.camber || 0}deg`);
        el.style.setProperty("--flap", `${m.flap || 0}deg`);
        $$("[data-setup-set]", el).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setupSet === m.key)));
        $$(".hb-sheet dd", el).forEach((dd, k) => {
          const [, v, u] = m.readouts[k] || [];
          $("small", dd).textContent = u || "";
          countTo(dd, v ?? "");
        });
        if (save) ctx.store.set("setup", m.key);
      }
      $$("[data-setup-set]", el).forEach((b) => b.addEventListener("click", () => setSetup(b.dataset.setupSet)));
      setSetup(ctx.store.get("setup", c.setups.default || modes[0].key), false);
    },
  });
})();
