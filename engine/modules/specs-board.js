/* =========================================================
   MÓDULO · specs-board
   Panel de cifras como un cartel de destinos y distancias:
   rótulo a la izquierda, cifra tabular a la derecha.
   Datos: { id, nav, shield, title, kana, specs:["power", …], note }
          → filas desde car.specs: { label, value, unit, note }
   ========================================================= */
(() => {
  const M = window.Museo;
  const { esc } = M;

  M.define("specs-board", {
    render: (c, ctx) => `
      <section class="section" id="${c.id}" aria-labelledby="${c.id}-title">
        <div class="board plaque rv">
          <div class="board__top">${c.shield ? `<span class="shield">${esc(c.shield)}</span>` : ""}<h2 id="${c.id}-title">${esc(c.title)}</h2>${c.kana ? `<span class="ja" lang="ja">${esc(c.kana)}</span>` : ""}</div>
          <dl>
            ${c.specs.map((k) => ctx.car.specs[k]).filter(Boolean).map((r) => `<div><dt>${esc(r.label)}${r.note ? `<small>${esc(r.note)}</small>` : ""}</dt><dd>${esc(M.formatSpec(r))}${r.unit ? `<sub>${esc(r.unit)}</sub>` : ""}</dd></div>`).join("")}
          </dl>
        </div>
        ${c.note ? `<p class="board__note rv">${esc(c.note)}</p>` : ""}
      </section>`,
  });
})();
