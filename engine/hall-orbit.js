/* =========================================================
   MUSEO · SHOWROOM DEL HALL
   ---------------------------------------------------------
   Vista única a pantalla completa: los coches de data/cars.json
   en un escenario 3D en profundidad (coverflow), sin librerías.
   Cada coche se coloca según su distancia al coche activo
   (offset = índice − posición), interpolando entre tres puntos:
     · activo (0): centrado, escala 1, opacidad 1, nítido, con su
       ficha y su botón "Entrar en la sala";
     · lateral (±1): desplazado un 65 % de su ancho, 350 px hacia el
       fondo, girado 32° hacia el centro, escala 0,78, opacidad 0,35
       y desenfoque de 3 px; un clic lo trae al centro;
     · lejano (±2 o más): 600 px al fondo, invisible y sin clics.
   Detrás del coche activo, un halo del color de su sala. El número
   de cada sala, gigante y muy tenue, se desplaza más que el coche al
   cambiar (paralaje); se pinta en modo «aclarar», así que sólo se ve
   sobre el negro y nunca sobre el coche.
   Cambiar de coche mueve la posición con un muelle con rebote suave (requestAnimationFrame) que hereda
   la velocidad del gesto, y mientras hay velocidad la silueta de los
   coches se inclina un poco (skewX) y se endereza al parar. La ficha
   técnica cambia con un fundido sincrónico (transiciones CSS).
   Bajo el anillo, una plataforma en perspectiva con rejilla y el
   reflejo del color del coche al frente (--focus).
   Cada cambio de coche se anuncia con el evento "museo:hall-active"
   (lo usa el radar de engine/fx/hall-motion.js).

   Controles: flechas, indicadores numéricos, clic en un coche
   lateral, deslizamiento horizontal (sigue al dedo y encaja en el
   coche más cercano; un gesto rápido basta), rueda del ratón sobre
   el escenario (un coche por gesto; ahí no desplaza la página) y
   teclas ← → (en toda la página mientras el showroom
   está a la vista). Con prefers-reduced-motion: cambio
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
        <span class="orbit__deck" aria-hidden="true"><i></i></span>
        <span class="orbit__halo" aria-hidden="true"></span>
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
        <div class="orbit__nums" aria-hidden="true">${cars.map((c, i) => `<span class="orbit__num">${esc(M.roomNo(c, i))}</span>`).join("")}</div>
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
    const deckGlow = section.querySelector(".orbit__deck i");
    const halo = section.querySelector(".orbit__halo");
    const nums = [...section.querySelectorAll(".orbit__num")];
    if (N < 2) section.classList.add("is-single");

    /* ---------- Geometría del escenario ---------- */
    let phase = 0;                             // posición continua (0 = primer coche al centro; puede dar la vuelta)
    let active = 0;
    let span = 300;                            // recorrido en px entre un coche y el siguiente (65 % de su ancho)
    let vel = 0;                               // velocidad de la posición (coches por segundo): inclina las siluetas
    const measure = () => {
      section.style.setProperty("--stage-h", `${stage.clientHeight}px`);
      span = (slots[0].offsetWidth || 460) * 0.65;
    };
    // Puntos de paso por distancia al activo: 0 (centro), 1 (lateral), 2 (lejano)
    const KEYS = [
      { x: 0, z: 0, r: 0, s: 1, o: 1, b: 0 },
      { x: 65, z: -350, r: 32, s: 0.78, o: 0.35, b: 3 },
      { x: 112, z: -600, r: 40, s: 0.7, o: 0, b: 5 },
    ];
    const mix = (a, b, f) => a + (b - a) * f;

    const place = () => {
      const skew = Math.max(-7, Math.min(7, -vel * 2.4));     // la parte alta del coche se queda atrás
      slots.forEach((slot, i) => {
        // offset con signo por el camino más corto (la fila se cierra sobre sí misma)
        let o = (((i - phase) % N) + N) % N;
        if (o > N / 2) o -= N;
        const d = Math.min(Math.abs(o), 2), k = Math.min(1, Math.floor(d)), f = d - k, A = KEYS[k], B = KEYS[k + 1];
        const side = Math.sign(o);
        const opacity = mix(A.o, B.o, f);
        slot.style.transform = `translate3d(${(side * mix(A.x, B.x, f)).toFixed(2)}%, 0, ${mix(A.z, B.z, f).toFixed(1)}px) rotateY(${(-side * mix(A.r, B.r, f)).toFixed(2)}deg) scale(${mix(A.s, B.s, f).toFixed(4)})`;
        slot.style.opacity = opacity.toFixed(3);
        slot.style.visibility = opacity > 0.001 ? "visible" : "hidden";
        slot.style.pointerEvents = d < 1.5 ? "auto" : "none";
        slot.style.zIndex = Math.round(20 - d * 10);
        const blur = mix(A.b, B.b, f);
        carsEl[i].style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "";
        carsEl[i].style.transform = Math.abs(skew) > 0.05 && opacity > 0.001 ? `skewX(${skew.toFixed(2)}deg)` : "";
        // Número de sala al fondo: recorre casi el doble que el coche y sólo se ve el del coche activo
        const fade = Math.max(0, 1 - Math.abs(o));
        nums[i].style.transform = `translate3d(${(o * span * 1.9).toFixed(1)}px, 0, -400px)`;
        nums[i].style.opacity = fade.toFixed(3);
        nums[i].style.visibility = fade > 0.001 ? "visible" : "hidden";
      });
    };

    /* ---------- Muelle de la fase (sin librerías) ----------
       Muelle (rigidez 90, amortiguación 12: llega con un rebote suave) que parte de
       la velocidad que traiga el anillo: la del gesto al soltar, o la del cambio anterior. */
    const STIFF = 90, DAMP = 12;
    let raf = 0;
    const animate = (to, instant, done) => {
      cancelAnimationFrame(raf);
      if (instant) { phase = to; vel = 0; place(); done(); return; }
      let last = performance.now();
      const frame = (now) => {
        let dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        while (dt > 0) {                         // pasos de 1/120 s: estable aunque el navegador salte fotogramas
          const h = Math.min(dt, 1 / 120);
          vel += (-STIFF * (phase - to) - DAMP * vel) * h;
          phase += vel * h;
          dt -= h;
        }
        if (Math.abs(phase - to) < 0.0008 && Math.abs(vel) < 0.01) { phase = to; vel = 0; place(); done(); return; }
        place();
        raf = requestAnimationFrame(frame);
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
      // Reflejo de la plataforma: toma el color del coche al frente con un fundido
      section.style.setProperty("--focus", accent(cars[i]));
      if (!reduce.matches && deckGlow.animate) [deckGlow, halo].forEach((el) => el.animate([{ opacity: 0.15 }, { opacity: 1 }], { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }));
      M.hallActive = i;
      document.dispatchEvent(new CustomEvent("museo:hall-active", { detail: { i } }));
    };

    /* ---------- Navegación ---------- */
    const goTo = (target, { fromDrag = false, velocity = null } = {}) => {
      // Fase destino por el camino más corto del anillo (permite dar la vuelta sin fin)
      const idx = ((target % N) + N) % N;
      let dest = Math.round(phase) + (((idx - Math.round(phase)) % N) + N) % N;
      if (dest - phase > N / 2) dest -= N;
      if (fromDrag) dest = target;              // tras arrastrar, la fase ya viene calculada
      if (velocity != null) vel = velocity;
      if (active !== idx) { active = idx; showInfo(idx); }
      animate(dest, reduce.matches, () => { phase = ((dest % N) + N) % N; place(); });
    };
    const step = (d) => goTo(active + d);
    // Para el índice de salas (engine/hall-index.js): trae una sala al frente y, si está en desarrollo, abre su avance
    M.hallGo = (i) => { goTo(i); if (soon(cars[i])) setTeaser(i, true); };

    section.querySelector(".orbit__arrow--prev").addEventListener("click", () => step(-1));
    section.querySelector(".orbit__arrow--next").addEventListener("click", () => step(1));
    section.querySelector(".orbit__dots").addEventListener("click", (ev) => { const b = ev.target.closest("[data-go]"); if (b) goTo(+b.dataset.go); });
    // Teclas ← →: en toda la página mientras el showroom está a la vista (no al escribir en el buscador)
    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
      if (ev.defaultPrevented || ev.ctrlKey || ev.metaKey || ev.altKey || ev.target.closest?.("input, textarea, select, [contenteditable]")) return;
      if (!section.contains(ev.target) && section.getBoundingClientRect().bottom < innerHeight * 0.5) return;
      ev.preventDefault();
      step(ev.key === "ArrowRight" ? 1 : -1);
    });

    // Clic en un coche de espera: pasa al frente. El del frente entra en su sala;
    // si su sala está en desarrollo, abre el avance en lugar de llevar a una página vacía
    carsEl.forEach((el, i) => el.addEventListener("click", (ev) => {
      if (dragged) { ev.preventDefault(); return; }
      if (i !== active) { ev.preventDefault(); goTo(i); return; }
      if (soon(cars[i])) setTeaser(i, teaserOpen !== i);
    }));

    /* Deslizamiento: el anillo sigue al dedo; al soltar, un gesto rápido
       (> 0,35 px/ms) avanza un coche aunque el recorrido sea corto; si no, encaja en el más cercano */
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
        if (drag.axis === "x") { cancelAnimationFrame(raf); vel = 0; drag.phase = phase; drag.x = ev.clientX; try { stage.setPointerCapture(ev.pointerId); } catch {} }
      }
      if (drag.axis !== "x") return;
      dragged = true;
      const before = phase, now = performance.now();
      phase = drag.phase - (ev.clientX - drag.x) / span;
      vel = 0.6 * vel + 0.4 * ((phase - before) / Math.max(0.008, (now - (drag.last || now - 16)) / 1000));   // suavizada
      drag.last = now;
      place();
    });
    const endDrag = (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const d = drag; drag = null;
      if (d.axis !== "x") return;
      const dx = ev.clientX - d.x;
      const v = dx / Math.max(1, performance.now() - d.t);
      let target = Math.round(phase);
      if (Math.abs(v) > 0.35 && target === Math.round(d.phase)) target -= Math.sign(dx);   // gesto rápido = un coche más
      goTo(target, { fromDrag: true, velocity: Math.max(-6, Math.min(6, vel)) });
      setTimeout(() => { dragged = false; }, 0);
    };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    // Rueda del ratón o trackpad sobre el escenario: cambia de coche (uno por gesto) en vez de desplazar la página.
    // Fuera del escenario (ficha, índice) la página se desplaza como siempre.
    let wheelLock = 0, wheelSum = 0, wheelAt = 0;
    stage.addEventListener("wheel", (ev) => {
      if (ev.ctrlKey || N < 2) return;                     // Ctrl + rueda es el zoom del navegador
      ev.preventDefault();
      const now = performance.now();
      if (now - wheelAt > 250) wheelSum = 0;               // gesto nuevo
      wheelAt = now;
      const d = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
      wheelSum += ev.deltaMode === 1 ? d * 32 : d;
      if (now < wheelLock || Math.abs(wheelSum) < 36) return;
      wheelLock = now + 420;
      step(Math.sign(wheelSum));
      wheelSum = 0;
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
