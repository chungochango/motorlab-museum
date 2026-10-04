/* =========================================================
   MÓDULO · story-road
   Historia en postes kilométricos junto a una marca de carril
   que se ilumina con el scroll, con una foto fija al lado.
   Datos: { id, nav, shield, kana, title, intro,
            posts:[{ post, title, historia (HTML), tecnico:[[dt, dd, small]] }],
            photo:{ image, caption } }
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, esc, clamp } = M;

  M.define("story-road", {
    render: (c) => `
      <section class="section" id="${c.id}" aria-labelledby="${c.id}-title">
        ${M.plaqueHead(c)}
        <div class="story">
          <div class="road">
            <span class="road__dash" aria-hidden="true"></span>
            ${c.posts.map((p) => `
              <article class="km rv">
                <span class="km__post" aria-hidden="true">KP<b>${esc(p.post)}</b></span>
                <h3>${esc(p.title)}</h3>
                ${p.historia ? `<p class="m-historia">${p.historia}</p>` : ""}
                ${p.tecnico ? M.dataList(p.tecnico, "data m-tecnico") : ""}
              </article>`).join("")}
          </div>
          <figure class="story__photo rv" style="--i:1">
            <div class="optic lit" style="aspect-ratio:${c.photo.image.w}/${c.photo.image.h}">
              ${M.img(c.photo.image, { cls: "optic__base" })}
              <span class="lamps" aria-hidden="true"></span>
            </div>
            ${c.photo.caption ? `<figcaption>${esc(c.photo.caption)}</figcaption>` : ""}
          </figure>
        </div>
      </section>`,

    // La marca de carril se ilumina según el tramo recorrido
    mount(el) {
      const road = $(".road__dash", el);
      M.onScroll(() => {
        const r = road.getBoundingClientRect();
        const q = clamp((innerHeight * 0.6 - r.top) / r.height, 0, 1);
        road.style.clipPath = `inset(0 0 ${(100 - q * 100).toFixed(2)}% 0)`;
      });
    },
  });
})();
