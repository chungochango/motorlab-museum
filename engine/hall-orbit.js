/* =========================================================
   MUSEO · SHOWROOM DEL HALL
   ---------------------------------------------------------
   Vista única a pantalla completa: los coches de data/cars.json
   sobre pedestales en un anillo 3D, sin librerías.
     · frente (0°): escala 1, opacidad 1, nítido, con su ficha y
       su botón "Entrar en la sala";
     · espera (±120°): retrasado (−300 px en Z), escala 0,65,
       opacidad 0,4 y desenfoque de 2 px; estático;
     · detrás (±180°): oculto. Funciona con 2, 3 o 40 coches.
   Cambiar de coche desliza el anillo entero en horizontal (una
   fase interpolada con requestAnimationFrame) y la ficha técnica
   cambia con un fundido sincrónico (transiciones CSS).

   Controles: flechas, indicadores numéricos, deslizamiento
   horizontal (sigue al dedo; un gesto rápido basta), rueda
   horizontal y teclas ← →. Con prefers-reduced-motion: cambio
   instantáneo y fundidos mínimos.
   ========================================================= */
(() => {
  "use strict";

  const start = (e) => {
    const M = window.Museo;
    const cars = e?.detail?.cars || M?.hallCars;
    const main = document.querySelector(".showroom");
    if (!M || !cars?.length || !main) return;
    const { esc, url, pad2 } = M;
    const roomUrl = (c) => esc(M.roomHref(c));

    const N = cars.length;
    const STEP = 360 / Math.max(N, 3);         // con 2 coches, el de espera queda a 120° (a un lado, no tapado)
    const BACK = 120;                          // ángulo de la posición de espera
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const ARROW = (d) => `<svg viewBox="0 0 16 12" aria-hidden="true"><path d="${d}" /></svg>`;
    const accent = (c) => c.palette?.hallAccent || M.hexToRgb(c.palette?.accent || "#e2e4e8");
    const ratio = (im) => (im?.w && im?.h ? (im.w / im.h).toFixed(4) : "1.5");
    /* Salas cerradas: "próximamente" (status: "coming_soon") o con apertura programada aún por
       llegar (releaseDate). Se ven en el anillo, pero en vez de entrar abren un avance con la
       telemetría anticipada (hall.teaser + specsPreview) */
    const soon = (c) => !M.isRoomOpen(c);
    // Apertura programada (releaseDate): fecha y cuenta atrás; al llegar, la insignia de siempre
    // (o se recarga el Hall si la sala ya tiene página, para que se abra sola)
    const badge = (c) => c.hall?.teaser?.badge || "Próximamente";
    const opening = (c) => (M.isScheduled(c)
      ? `<span data-release="${esc(c.releaseDate)}" data-after="${esc(badge(c))}"${c.status === "coming_soon" ? "" : " data-reload"}>Abre el ${esc(M.releaseLabel(c))}</span>`
      : esc(badge(c)));
    // Alas temáticas: una sala con "wing" no sigue la numeración principal (M-01) y lleva su rótulo
    const wing = (c) => (c.wing && M.wings?.[c.wing]) || null;
    const wingTag = (c) => (wing(c) ? `<span class="hall__wing" style="--wing: ${wing(c).accent || "226, 228, 232"}"><b>${esc(wing(c).label)}</b>${wing(c).name ? ` · ${esc(wing(c).name)}` : ""}</span>` : "");
    // Separador antes de la primera sala de cada ala (los indicadores se agrupan por ala)
    const opensWing = (c, i) => wing(c) && !(i && cars[i - 1].wing === c.wing);
    const PREVIEW = { engine: "Motor", power: "Potencia", downforce: "Carga aerodinámica", transmission: "Transmisión", suspension: "Suspensión", chassis: "Chasis", drivetrain: "Tracción", weight: "Peso" };
    const teaser = (c, i) => {
      const t = c.hall.teaser || {};
      return `
        <button type="button" class="hall__cta hall__cta--soon" aria-expanded="false" aria-controls="orbit-teaser-${i}">
          <span class="hall__dot" aria-hidden="true"></span>${esc(t.title || "Telemetría anticipada")}
        </button>
        <div class="orbit__teaser" id="orbit-teaser-${i}" role="dialog" aria-label="${esc(t.title || "Telemetría anticipada")}: ${esc(c.name)}" hidden>
          <p class="orbit__teaser-head"><span class="hall__dot" aria-hidden="true"></span>${(t.lines || []).map((l) => `<span>${esc(l)}</span>`).join("")}</p>
          ${c.specsPreview ? `<dl>${Object.entries(c.specsPreview).map(([k, v]) => `<div><dt>${esc(PREVIEW[k] || k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
          <p class="orbit__teaser-foot">${M.isScheduled(c) ? `Apertura programada · ${esc(M.releaseLabel(c))}` : "Sala en desarrollo · aún no se puede visitar"}</p>
        </div>`;
    };
    const name = (c) => (c.badge && c.name.endsWith(c.badge) ? `${esc(c.name.slice(0, -c.badge.length).trim())} <small>${esc(c.badge)}</small>` : esc(c.name));

    /* ---------- Marcado ---------- */
    const section = document.createElement("section");
    section.className = "orbit";
    section.setAttribute("aria-roledescription", "carrusel");
    section.setAttribute("aria-label", "Salas del museo");
    section.innerHTML = `
      <div class="orbit__stage">
        <div class="orbit__ring">
          ${cars.map((c, i) => `
            <div class="orbit__slot hall--${c.theme}${soon(c) ? " is-soon" : ""}" data-i="${i}" style="--accent: ${accent(c)}; --ar: ${ratio(c.hall.image)}" role="group" aria-roledescription="sala" aria-label="${i + 1} de ${N}: ${esc(c.name)}${soon(c) ? " (próximamente)" : ""}">
              <span class="orbit__pedestal" aria-hidden="true"></span>
              ${soon(c) ? `<span class="orbit__car" aria-hidden="true">` : `<a class="orbit__car" href="${roomUrl(c)}" tabindex="-1" aria-hidden="true" draggable="false">`}
                <span class="orbit__media">
                  ${M.img(c.hall.image, { lazy: i > 1 && i < N - 1, priority: i === 0, extra: 'draggable="false"' })}
                  <span class="orbit__floor"></span>
                </span>
              ${soon(c) ? `</span><span class="orbit__soon" aria-hidden="true">${c.status === "coming_soon" ? "Sala en desarrollo" : "Sala en calibración"} <i>//</i> ${opening(c)}</span>` : "</a>"}
            </div>`).join("")}
        </div>
        <button type="button" class="orbit__arrow orbit__arrow--prev" aria-label="Sala anterior">${ARROW("M15 6H1M6 1L1 6l5 5")}</button>
        <button type="button" class="orbit__arrow orbit__arrow--next" aria-label="Sala siguiente">${ARROW("M1 6h14M10 1l5 5-5 5")}</button>
      </div>

      <div class="orbit__panel">
        ${cars.map((c, i) => `
          <article class="orbit__info hall--${c.theme}" data-i="${i}" style="--accent: ${accent(c)}"${i ? " inert" : ""}>
            ${wingTag(c)}
            <h2 class="hall__name">${name(c)}</h2>
            <span class="hall__years">${esc(c.years)}</span>
            <p class="hall__text">${esc(c.hall.text)}</p>
            <div class="hall__specs">${c.hall.specs.map(([v, l]) => `<div><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join("")}</div>
            ${soon(c) ? teaser(c, i) : `<a class="hall__cta" href="${roomUrl(c)}">Entrar en la sala ${ARROW("M1 6h14M10 1l5 5-5 5")}</a>`}
          </article>`).join("")}
      </div>

      <nav class="orbit__dots" aria-label="Elegir sala">
        ${cars.map((c, i) => `${opensWing(c, i) ? `<span class="orbit__dots-sep" aria-hidden="true"></span>` : ""}<button type="button" data-go="${i}"${wing(c) ? ` class="is-wing" style="--wing: ${wing(c).accent || "226, 228, 232"}"` : ""} aria-label="Sala ${M.roomNo(c, i)}${wing(c) ? ` · ${esc(wing(c).label)}` : ""}: ${esc(c.name)}"${i ? "" : ' aria-current="true"'}><span>${M.roomNo(c, i)}</span></button>`).join("")}
      </nav>
      <p class="sr orbit__live" aria-live="polite"></p>`;

    main.append(section);
    M.countdowns();
    document.documentElement.classList.add("has-orbit");

    const stage = section.querySelector(".orbit__stage");
    const slots = [...section.querySelectorAll(".orbit__slot")];
    const carsEl = slots.map((s) => s.querySelector(".orbit__car"));
    const infos = [...section.querySelectorAll(".orbit__info")];
    const dots = [...section.querySelectorAll(".orbit__dots button")];
    const live = section.querySelector(".orbit__live");
    if (N < 2) section.classList.add("is-single");

    /* ---------- Geometría del anillo ---------- */
    let phase = 0;                             // posición continua del anillo (0 = primer coche al frente)
    let active = 0;
    let rx = 0, rz = 0;
    const measure = () => {
      const w = stage.clientWidth;
      section.style.setProperty("--stage-h", `${stage.clientHeight}px`);
      rx = w < 720 ? w * 0.72 : Math.min(w * 0.46, 660);   // los de espera quedan a los lados (en móvil, asoman por el borde)
      rz = 300 / (1 - Math.cos((BACK * Math.PI) / 180));    // → a 120° quedan a −300 px
    };
    const wrap = (a) => { a %= 360; if (a > 180) a -= 360; if (a < -180) a += 360; return a; };

    const place = () => {
      slots.forEach((slot, i) => {
        // Los vecinos del coche frontal quedan siempre en la posición de espera (±120°) aunque
        // haya 4 o más coches; los demás pasan por detrás, ocultos
        const a = Math.max(-180, Math.min(180, wrap((i - phase) * STEP) * (BACK / STEP)));
        const t = Math.abs(a);
        const rad = (a * Math.PI) / 180;
        const k = Math.min(t / BACK, 1);
        const opacity = t <= BACK ? 1 - 0.6 * k : 0.4 * Math.max(0, 1 - (t - BACK) / 60);
        const x = Math.sin(rad) * rx, z = -(1 - Math.cos(rad)) * rz;
        slot.style.transform = `translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${(-a * 0.12).toFixed(2)}deg) scale(${(1 - 0.35 * k).toFixed(4)})`;
        slot.style.opacity = opacity.toFixed(3);
        slot.style.visibility = opacity > 0.001 ? "visible" : "hidden";
        slot.style.zIndex = Math.round(200 - t);
        const blur = 2 * k;                    // nítido al frente, 2 px en espera
        carsEl[i].style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "";
      });
    };

    /* ---------- Interpolación de la fase (sin librerías) ---------- */
    const easeInOut = (p) => (p < 0.5 ? 8 * p ** 4 : 1 - (-2 * p + 2) ** 4 / 2);   // cuártica: arranque y frenada suaves
    let raf = 0;
    const animate = (to, duration, done) => {
      cancelAnimationFrame(raf);
      const from = phase, t0 = performance.now();
      if (!duration) { phase = to; place(); done(); return; }
      const frame = (now) => {
        const p = Math.min(1, (now - t0) / (duration * 1000));
        phase = from + (to - from) * easeInOut(p);
        place();
        if (p < 1) raf = requestAnimationFrame(frame); else done();
      };
      raf = requestAnimationFrame(frame);
    };

    /* ---------- Ficha, indicadores y estado accesible ---------- */
    /* ---------- Avance de las salas "próximamente" ---------- */
    let teaserOpen = -1;
    const setTeaser = (i, open) => {
      const box = infos[i]?.querySelector(".orbit__teaser"), btn = infos[i]?.querySelector(".hall__cta--soon");
      if (!box) return;
      box.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      teaserOpen = open ? i : -1;
    };
    const closeTeaser = () => { if (teaserOpen >= 0) setTeaser(teaserOpen, false); };
    infos.forEach((el, i) => el.querySelector(".hall__cta--soon")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      setTeaser(i, teaserOpen !== i);
    }));
    document.addEventListener("click", (ev) => { if (teaserOpen >= 0 && !ev.target.closest(".orbit__teaser, .hall__cta--soon, .is-soon .orbit__car")) closeTeaser(); });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && teaserOpen >= 0) { const btn = infos[teaserOpen].querySelector(".hall__cta--soon"); closeTeaser(); btn.focus(); }
    });

    const showInfo = (i) => {
      closeTeaser();                             // al cambiar de coche, el avance abierto se cierra
      infos.forEach((el, k) => { el.classList.toggle("is-current", k === i); el.toggleAttribute("inert", k !== i); });
      dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
      slots.forEach((s, k) => s.classList.toggle("is-active", k === i));
      live.textContent = `Sala ${i + 1} de ${N}: ${cars[i].name}`;
    };

    /* ---------- Navegación ---------- */
    const goTo = (target, { fromDrag = false } = {}) => {
      // Fase destino por el camino más corto del anillo (permite dar la vuelta sin fin)
      const idx = ((target % N) + N) % N;
      let dest = Math.round(phase) + (((idx - Math.round(phase)) % N) + N) % N;
      if (dest - phase > N / 2) dest -= N;
      if (fromDrag) dest = target;              // tras arrastrar, la fase ya viene calculada
      const duration = reduce.matches ? 0 : Math.min(1.1, 0.55 + Math.abs(dest - phase) * 0.45);
      if (active !== idx) { active = idx; showInfo(idx); }
      animate(dest, duration, () => { phase = ((dest % N) + N) % N; place(); });
    };
    const step = (d) => goTo(active + d);
    // Para el índice de salas (engine/hall-index.js): trae una sala al frente y, si está en desarrollo, abre su avance
    M.hallGo = (i) => { goTo(i); if (soon(cars[i])) setTeaser(i, true); };

    section.querySelector(".orbit__arrow--prev").addEventListener("click", () => step(-1));
    section.querySelector(".orbit__arrow--next").addEventListener("click", () => step(1));
    section.querySelector(".orbit__dots").addEventListener("click", (ev) => { const b = ev.target.closest("[data-go]"); if (b) goTo(+b.dataset.go); });
    section.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowRight") { ev.preventDefault(); step(1); }
      if (ev.key === "ArrowLeft") { ev.preventDefault(); step(-1); }
    });

    // Clic en un coche de espera: pasa al frente. El del frente entra en su sala;
    // si su sala está en desarrollo, abre el avance en lugar de llevar a una página vacía
    carsEl.forEach((el, i) => el.addEventListener("click", (ev) => {
      if (dragged) { ev.preventDefault(); return; }
      if (i !== active) { ev.preventDefault(); goTo(i); return; }
      if (soon(cars[i])) setTeaser(i, teaserOpen !== i);
    }));

    /* Deslizamiento: el anillo sigue al dedo; al soltar, un gesto rápido
       (> 0,11 px/ms) avanza un coche aunque el recorrido sea corto */
    let drag = null, dragged = false;
    stage.addEventListener("pointerdown", (ev) => {
      if (drag || ev.button !== 0 || ev.target.closest(".orbit__arrow")) return;   // un solo dedo manda
      drag = { x: ev.clientX, y: ev.clientY, t: performance.now(), phase, id: ev.pointerId, axis: null };
      dragged = false;
    });
    stage.addEventListener("pointermove", (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
      if (!drag.axis && Math.hypot(dx, dy) > 6) {
        drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (drag.axis === "x") { cancelAnimationFrame(raf); drag.phase = phase; drag.x = ev.clientX; try { stage.setPointerCapture(ev.pointerId); } catch {} }
      }
      if (drag.axis !== "x") return;
      dragged = true;
      phase = drag.phase - (ev.clientX - drag.x) / (rx * 1.15);
      place();
    });
    const endDrag = (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const d = drag; drag = null;
      if (d.axis !== "x") return;
      const dx = ev.clientX - d.x;
      const v = dx / Math.max(1, performance.now() - d.t);
      let target = Math.round(phase);
      if (Math.abs(v) > 0.11 && target === Math.round(d.phase)) target -= Math.sign(dx);   // gesto rápido = un coche más
      goTo(target, { fromDrag: true });
      setTimeout(() => { dragged = false; }, 0);
    };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    // Rueda horizontal (trackpad): un coche por gesto
    let wheelLock = 0;
    stage.addEventListener("wheel", (ev) => {
      if (Math.abs(ev.deltaX) <= Math.abs(ev.deltaY) || Math.abs(ev.deltaX) < 12) return;
      ev.preventDefault();
      const now = performance.now();
      if (now < wheelLock) return;
      wheelLock = now + 700;
      step(Math.sign(ev.deltaX));
    }, { passive: false });

    /* ---------- Arranque ---------- */
    measure();
    place();
    showInfo(0);
    addEventListener("resize", () => { measure(); place(); });
  };

  if (window.Museo?.hallReady) start();
  else document.addEventListener("museo:hall", start, { once: true });
})();
