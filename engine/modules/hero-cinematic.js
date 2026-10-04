/* =========================================================
   MÓDULO · hero-cinematic
   Portada a pantalla completa: título gigante sobre la foto
   del coche en penumbra, años, texto y cifras por modo, y una
   señal de "Descubrir" hacia la siguiente sección.
   Datos: { id, nav, kicker:[a,b], title, image, lead, facts, cue }
   ========================================================= */
(() => {
  const M = window.Museo;
  const kicker = M.kicker;

  M.define("hero-cinematic", {
    render: (c, ctx) => `
      <section class="hero-cine" id="${c.id}" aria-labelledby="${c.id}-title">
        ${M.img(c.image, { cls: "hero-cine__bg photo js-car", alt: "", lazy: false, priority: true, picture: !ctx.car.colors })}
        <span class="hero-cine__shade" aria-hidden="true"></span>
        <span class="hero-cine__floor" aria-hidden="true"></span>
        <div class="hero-cine__lines" aria-hidden="true"><span></span><span></span></div>

        <div class="hero-cine__content">
          ${c.kicker ? `<p class="eyebrow rv" data-rv="repeat">${kicker(c.kicker)}</p>` : ""}
          <h1 class="hero-cine__title rv" data-rv="repeat" id="${c.id}-title">${M.esc(c.title)}</h1>
          <p class="hero-cine__years rv" data-rv="repeat"><span class="rule"></span>${M.esc(ctx.car.years)}<span class="rule"></span></p>
          <div class="rv" data-rv="repeat">${M.byMode(c.lead, (t, cls) => `<p class="hero-cine__lead ${cls}">${t}</p>`)}</div>
          <div class="rv" data-rv="repeat">${M.byMode(c.facts, (list, cls) =>
            `<div class="hero-cine__facts ${cls}">${list.map(([v, l]) => `<div><strong>${M.esc(v)}</strong><span>${M.esc(l)}</span></div>`).join("")}</div>`)}</div>
        </div>

        ${c.cue ? `<a href="#${c.cue.target}" class="scroll-cue" aria-label="${M.esc(c.cue.aria || c.cue.label)}"><span>${M.esc(c.cue.label)}</span><i></i></a>` : ""}
      </section>`,
  });
})();
