/* =========================================================
   MUSEO · ARRANQUE DE UNA SALA
   ---------------------------------------------------------
   Lee <html data-car="…">, busca ese coche en data/cars.js,
   carga su tema y los módulos que usa, y compone la sala:
     cabecera → secciones (módulos) → salidas → pie
   Cada módulo (engine/modules/<tipo>.js) aporta:
     render(cfg, ctx) → HTML de la sección
     mount(el, cfg, ctx) → comportamiento (opcional)
   ========================================================= */
(async () => {
  "use strict";

  const M = window.Museo;
  const root = document.documentElement;
  const data = await M.loadData();
  const cars = data.cars.filter((c) => M.isRoomOpen(c));   // las salas en desarrollo o aún sin abrir no entran en el recorrido
  const index = cars.findIndex((c) => c.id === root.dataset.car);

  /* Sala con apertura programada (releaseDate) a la que se entra por URL antes de la fecha:
     no se monta nada (ni tema, ni módulos, ni telemetría); sólo la pantalla de acceso
     restringido con la fecha, la cuenta atrás y la vuelta al Hall. Al llegar la hora,
     la cuenta atrás recarga la página y la sala se abre. */
  const locked = index < 0 && data.cars.find((c) => c.id === root.dataset.car && M.isScheduled(c));
  if (locked) {
    const web = /^https?:$/.test(location.protocol);
    const room = M.roomNo(locked, data.cars.indexOf(locked));
    document.title = `Sala ${room} · En calibración · ${data.museum.name}`;
    document.body.insertAdjacentHTML("afterbegin", `
      <main id="sala" class="lock" style="--accent: ${locked.palette?.hallAccent || "226, 228, 232"}">
        <section class="lock__panel" aria-labelledby="lock-title">
          <p class="lock__tag"><span class="lock__dot" aria-hidden="true"></span>Acceso restringido</p>
          <h1 id="lock-title">Sala ${M.esc(room)} · ${M.esc(locked.name)}</h1>
          <p class="lock__text">Sala en calibración técnica hasta el <b>${M.esc(M.releaseLabel(locked))}</b> (hora de Madrid).</p>
          <p class="lock__count" data-release="${M.esc(locked.releaseDate)}" data-after="Abriendo la sala…" data-reload aria-live="off"></p>
          <a class="lock__back" href="${web ? "/" : M.url(data.museum.hall)}">${M.icons.ARROW_BACK}Volver al Hall</a>
        </section>
      </main>`);
    M.countdowns();
    root.classList.add("is-ready");
    return;
  }

  if (index < 0) {
    document.body.insertAdjacentHTML("afterbegin", `<p class="sala-error">Sala no encontrada: «${M.esc(root.dataset.car)}». Revisa data/cars.json.</p>`);
    root.classList.add("is-ready");
    return;
  }

  cars.forEach(M.resolveImages);                    // también las demás: las salidas muestran la siguiente sala
  const car = cars[index];
  const store = M.store(car.id, car.slug);
  const web = /^https?:$/.test(location.protocol);

  /* Precarga de la imagen de portada en cuanto se conoce, antes de cargar tema y
     módulos: así su descarga no espera al resto (es la imagen que marca el LCP).
     Se precarga el mismo archivo que elegirá el navegador (avif > webp > original). */
  const heroImg = car.sections[0]?.image;
  if (heroImg?.src) document.head.appendChild(M.preloadLink(heroImg, { picture: !heroImg.noPicture && !(car.sections[0].type === "hero-cinematic" && car.colors) }));
  const ctx = {
    car, cars, index, store,
    museum: data.museum,                            // datos comunes (alas, circuitos…)
    // Número de sala del catálogo completo (cuentan también las salas en desarrollo; un ala propia lo fija: "M-01")
    room: M.roomNo(car, data.cars.indexOf(car)),
    roomOf: (c) => M.roomNo(c, data.cars.indexOf(c)),
    prev: cars[(index - 1 + cars.length) % cars.length],
    next: cars[(index + 1) % cars.length],
    // URLs limpias en la web publicada (/ y /<slug>/); con file:// hacen falta los index.html
    hallUrl: web ? "/" : M.url(data.museum.hall),
    roomUrl: M.roomHref,                              // /f40/ en la web; rooms/cars/f40/index.html con file://
  };

  /* ---------- Metadatos de la página ---------- */
  document.title = car.meta?.title || `${car.name} · ${data.museum.name}`;
  const desc = document.querySelector('meta[name="description"]') || document.head.appendChild(Object.assign(document.createElement("meta"), { name: "description" }));
  desc.content = car.meta?.description || "";
  root.classList.add(`theme-${car.theme}`);

  /* ---------- Tema + módulos usados por la sala ---------- */
  const types = [...new Set(car.sections.map((s) => s.type))];
  try {
    await Promise.all([
      M.loadCSS(`themes/${car.theme}.css`),
      ...types.filter((t) => !M.module(t)).map((t) => M.loadScript(`engine/modules/${t}.js`)),
    ]);
    // Un módulo con su propia hoja de estilos se declara { css: true }: engine/modules/<tipo>.css
    await Promise.all(types.filter((t) => M.module(t)?.css).map((t) => M.loadCSS(`engine/modules/${t}.css`)));
  } catch (err) {
    console.error(err);
  }

  /* ---------- Composición ---------- */
  const sections = car.sections.map((cfg) => {
    const mod = M.module(cfg.type);
    if (!mod) return `<!-- módulo desconocido: ${M.esc(cfg.type)} -->`;
    return mod.render(cfg, ctx);
  }).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    ${M.filters(car)}
    ${M.topbar(car, ctx)}
    <main id="sala">${sections}${M.exits(car, ctx)}</main>
    ${M.footer(car.marks)}`);

  /* ---------- Comportamiento ---------- */
  M.modes(store);
  car.sections.forEach((cfg) => {
    const mod = M.module(cfg.type);
    const el = document.getElementById(cfg.id);
    if (mod && mod.mount && el) mod.mount(el, cfg, ctx);
  });
  M.colors(car, store);
  M.audio(car, store);
  M.progress();
  M.routeSpy();
  M.lamps();
  M.reveal();

  // Ancla en la URL (#piezas…): se respeta una vez que la sala existe
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }
  root.classList.add("is-ready");
})();
