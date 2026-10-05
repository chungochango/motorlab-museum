/* =========================================================
   MUSEO · ÍNDICE DE SALAS (debajo del showroom del Hall)
   ---------------------------------------------------------
   El anillo 3D enseña un coche cada vez; el índice deja
   encontrar cualquiera de las salas (pensado para llegar a 40):
     · buscador en tiempo real (modelo, marca, motor, años,
       número de sala), sin distinguir acentos ni mayúsculas;
     · filtros por categoría técnica (campo "tags" de cada coche
       en data/cars.json); cada píldora lleva su recuento y se
       desactiva si no hay ninguna sala que mostrar;
     · límite inicial de PAGE salas y botón "Cargar más salas".
   Las salas abiertas enlazan a su página; las que están en
   desarrollo suben al showroom, las ponen al frente y abren
   su avance (Museo.hallGo, en engine/hall-orbit.js).
   ========================================================= */
(() => {
  "use strict";

  const PAGE = 9;
  const FILTERS = [
    ["all", "Todos"],
    ["supercar", "Supercars"],
    ["competicion", "Competición / DTM"],
    ["moto", "Motos"],
    ["turbo", "Turbo"],
    ["atmosferico", "Atmosférico"],
  ];
  const ARROW = '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M1 6h14M10 1l5 5-5 5" /></svg>';
  const SEARCH = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5.25" /><path d="M11 11l3.5 3.5" /></svg>';
  // Sin acentos ni mayúsculas: "cosworth", "Atmosférico" y "atmosferico" coinciden
  const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const start = (e) => {
    const M = window.Museo;
    const cars = e?.detail?.cars || M?.hallCars;
    const main = document.querySelector(".showroom");
    if (!M || !cars?.length || !main) return;
    const { esc, url, pad2 } = M;
    const soon = (c) => c.status === "coming_soon";
    const engine = (c) => c.specs?.engine?.value || c.specsPreview?.engine || "";
    const accent = (c) => c.palette?.hallAccent || M.hexToRgb(c.palette?.accent || "#e2e4e8");
    const name = (c) => (c.badge && c.name.endsWith(c.badge) ? `${esc(c.name.slice(0, -c.badge.length).trim())} <small>${esc(c.badge)}</small>` : esc(c.name));

    const rooms = cars.map((c, i) => ({
      c, i, tags: c.tags || [],
      text: norm([`sala ${pad2(i + 1)}`, c.name, c.brand, c.make, c.model, c.badge, engine(c), c.years, c.category,
        ...(c.hall?.specs || []).flat(), ...Object.values(c.specsPreview || {}),
        ...(c.tags || []).map((t) => FILTERS.find(([k]) => k === t)?.[1])].join(" ")),
    }));

    /* ---------- Marcado ---------- */
    const section = document.createElement("section");
    section.className = "idx";
    section.id = "indice";
    section.setAttribute("aria-labelledby", "idx-title");
    section.innerHTML = `
      <div class="idx__head">
        <h2 class="idx__title" id="idx-title">Índice de salas</h2>
        <div class="idx__search">
          <label class="sr" for="idx-q">Buscar sala por modelo, marca o motor</label>
          ${SEARCH}
          <input id="idx-q" type="search" placeholder="Modelo, marca o motor" autocomplete="off" spellcheck="false" enterkeyhint="search" />
          <kbd aria-hidden="true">/</kbd>
        </div>
      </div>
      <div class="idx__filters" role="group" aria-label="Filtrar por categoría">
        ${FILTERS.map(([k, label]) => `<button type="button" class="idx__pill" data-cat="${k}" aria-pressed="${k === "all"}">${esc(label)}<span class="idx__count"></span></button>`).join("")}
      </div>
      <ul class="idx__grid" role="list">
        ${rooms.map(({ c, i }) => {
          const meta = `<span class="idx__meta"><span>Sala ${pad2(i + 1)}</span>${soon(c)
            ? `<span class="idx__status"><span class="hall__dot" aria-hidden="true"></span>${esc(c.hall?.teaser?.badge || "Próximamente")}</span>`
            : `<span>${esc(c.years)}</span>`}</span>`;
          const inner = `
            <span class="idx__media">${M.img(c.hall.image, { alt: "", lazy: true, extra: 'draggable="false"' })}<span class="idx__floor"></span></span>
            <span class="idx__body">
              <span class="idx__name">${name(c)}</span>
              <span class="idx__engine">${esc(engine(c))}</span>
              ${meta}
            </span>
            <span class="idx__go" aria-hidden="true">${ARROW}</span>`;
          return `
          <li class="idx__item${soon(c) ? " is-soon" : ""}" data-i="${i}" style="--accent: ${accent(c)}" hidden>
            ${soon(c)
              ? `<button type="button" class="idx__card" aria-label="${esc(c.name)}, sala ${pad2(i + 1)}: ${esc(c.hall?.teaser?.badge || "en desarrollo")}. Ver avance">${inner}</button>`
              : `<a class="idx__card" href="${esc(url(`${c.slug}/index.html`))}">${inner}</a>`}
          </li>`;
        }).join("")}
      </ul>
      <div class="idx__empty" hidden>
        <p></p>
        <button type="button" class="idx__reset">Borrar búsqueda y filtros</button>
      </div>
      <div class="idx__foot">
        <p class="idx__status-line" aria-live="polite"></p>
        <button type="button" class="idx__more" hidden>Cargar más salas<span class="idx__more-n"></span></button>
      </div>`;
    main.append(section);

    const input = section.querySelector("#idx-q");
    const pills = [...section.querySelectorAll(".idx__pill")];
    const items = [...section.querySelectorAll(".idx__item")];
    const empty = section.querySelector(".idx__empty");
    const more = section.querySelector(".idx__more");
    const statusLine = section.querySelector(".idx__status-line");
    const state = { q: "", cat: "all", limit: PAGE };

    const matchesQuery = (r) => state.q.split(/\s+/).every((w) => r.text.includes(w));
    const inCat = (r, cat) => cat === "all" || r.tags.includes(cat);

    const render = ({ focusFrom = -1 } = {}) => {
      const hits = rooms.filter((r) => matchesQuery(r) && inCat(r, state.cat));
      const shown = new Set(hits.slice(0, state.limit).map((r) => r.i));
      items.forEach((el, i) => {
        const on = shown.has(i);
        if (on && el.hidden) { el.hidden = false; el.classList.remove("is-in"); void el.offsetWidth; el.classList.add("is-in"); }
        else if (!on) el.hidden = true;
      });

      // Recuento por categoría con la búsqueda actual; la píldora activa nunca se desactiva
      pills.forEach((p) => {
        const n = rooms.filter((r) => matchesQuery(r) && inCat(r, p.dataset.cat)).length;
        p.querySelector(".idx__count").textContent = n;
        p.disabled = n === 0 && p.dataset.cat !== state.cat;
        p.setAttribute("aria-pressed", String(p.dataset.cat === state.cat));
      });

      const rest = hits.length - shown.size;
      more.hidden = rest <= 0;
      more.querySelector(".idx__more-n").textContent = rest > 0 ? Math.min(rest, PAGE) : "";
      empty.hidden = hits.length > 0;
      if (!hits.length) {
        const cat = FILTERS.find(([k]) => k === state.cat)[1];
        empty.querySelector("p").textContent = input.value.trim()
          ? `Ninguna sala coincide con «${input.value.trim()}»${state.cat === "all" ? "" : ` en ${cat}`}.`
          : `Todavía no hay salas en ${cat}.`;
      }
      statusLine.textContent = hits.length
        ? `${shown.size === hits.length ? hits.length : `${shown.size} de ${hits.length}`} ${hits.length === 1 ? "sala" : "salas"}`
        : "Sin resultados";

      if (focusFrom >= 0) section.querySelector(`.idx__item[data-i="${hits[focusFrom]?.i}"] .idx__card`)?.focus();
    };

    let t = 0;
    input.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = norm(input.value.trim()); state.limit = PAGE; render(); }, 60);
    });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && input.value) { ev.stopPropagation(); input.value = ""; state.q = ""; state.limit = PAGE; render(); }
    });
    section.querySelector(".idx__filters").addEventListener("click", (ev) => {
      const p = ev.target.closest(".idx__pill");
      if (!p || p.disabled || p.dataset.cat === state.cat) return;
      state.cat = p.dataset.cat; state.limit = PAGE; render();
    });
    more.addEventListener("click", () => { const from = state.limit; state.limit += PAGE; render({ focusFrom: from }); });
    section.querySelector(".idx__reset").addEventListener("click", () => {
      input.value = ""; Object.assign(state, { q: "", cat: "all", limit: PAGE }); render(); input.focus();
    });

    // Sala en desarrollo: vuelve al showroom, la pone al frente y abre su avance
    section.querySelector(".idx__grid").addEventListener("click", (ev) => {
      const b = ev.target.closest("button.idx__card");
      if (!b || !M.hallGo) return;
      const i = +b.closest(".idx__item").dataset.i;
      // Se abre al terminar de subir (y fuera de este clic, que el showroom interpreta como "cerrar avance")
      let done = false;
      const open = () => {
        if (done) return;
        done = true;
        M.hallGo(i);
        document.querySelector(`.orbit__info[data-i="${i}"] .hall__cta--soon`)?.focus({ preventScroll: true });
      };
      if (window.scrollY < 2) return setTimeout(open);
      window.addEventListener("scrollend", open, { once: true });
      setTimeout(open, 900);                 // navegadores sin "scrollend"
      window.scrollTo({ top: 0, behavior: M.reduceMotion ? "auto" : "smooth" });
    });

    // "/" lleva al buscador (salvo si ya se está escribiendo en un campo)
    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "/" || ev.ctrlKey || ev.metaKey || ev.altKey || ev.target.closest?.("input, textarea, select, [contenteditable]")) return;
      ev.preventDefault();
      input.focus({ preventScroll: true });
      section.scrollIntoView({ behavior: M.reduceMotion ? "auto" : "smooth", block: "start" });
    });

    render();
  };

  if (window.Museo?.hallReady) start();
  else document.addEventListener("museo:hall", start, { once: true });
})();
