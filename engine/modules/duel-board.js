/* =========================================================
   MÓDULO · duel-board
   Cuadro de duelo entre esta sala y una rival del catálogo:
   cada fila enfrenta la misma cifra de las dos fichas con una
   barra que crece desde el centro hacia cada lado. Gana la
   cifra mejor (más alta, o más baja si la fila es "low") y el
   marcador se suma al pie. Las barras se llenan al entrar en
   pantalla y la fila apuntada se resalta en los dos lados.
   Datos: { id, nav, kicker, title, intro, rival:"<id de coche>",
            rows:[{ spec:"power", better:"high"|"low", label?,
                    a?, b?, unit?,          ← valores propios si la clave no existe en las fichas
                    verdict:{ historia, tecnico } }],
            note:{ historia, tecnico } }
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $$, esc } = M;

  const value = (car, row, side) => {
    const own = side === "a" ? row.a : row.b;
    if (own != null) return { value: own, unit: row.unit, label: row.label, decimals: row.decimals || 0 };
    const s = car.specs?.[row.spec];
    return s ? { value: s.value, unit: s.unit, label: row.label || s.label, decimals: s.decimals || 0 } : null;
  };

  M.define("duel-board", {
    render: (c, ctx) => {
      const rival = ctx.cars.find((x) => x.id === c.rival);
      if (!rival) return `<!-- duel-board: no encuentro la sala rival ${esc(c.rival)} -->`;
      const rows = c.rows.map((r) => {
        const a = value(ctx.car, r, "a"), b = value(rival, r, "b");
        if (!a || !b) return null;
        const max = Math.max(a.value, b.value) || 1;
        const win = a.value === b.value ? "" : (a.value > b.value) === (r.better !== "low") ? "a" : "b";
        return { r, a, b, max, win };
      }).filter(Boolean);
      const score = { a: rows.filter((x) => x.win === "a").length, b: rows.filter((x) => x.win === "b").length };
      const fmt = (v) => M.numberFormat(v.decimals).format(v.value);
      const side = (v, x, s) => `
        <span class="duel__val duel__val--${s}${x.win === s ? " is-win" : ""}">${fmt(v)}${v.unit ? ` <small>${esc(v.unit)}</small>` : ""}</span>
        <span class="duel__bar duel__bar--${s}${x.win === s ? " is-win" : ""}" style="--k:${(v.value / x.max).toFixed(3)}" aria-hidden="true"></span>`;

      return `
      <section class="section duel" id="${c.id}" aria-labelledby="${c.id}-title">
        ${M.plaqueHead(c)}
        <div class="duel__board rv" data-rv="repeat" style="--i:2">
          <div class="duel__head">
            <span class="duel__car duel__car--a"><b>${esc(ctx.car.name)}</b><small>Sala ${ctx.room} · esta sala</small></span>
            <span class="duel__score" aria-label="Marcador: ${score.a} a ${score.b}">${score.a}<i>–</i>${score.b}</span>
            <a class="duel__car duel__car--b" href="${esc(ctx.roomUrl(rival))}"><b>${esc(rival.name)}</b><small>Sala ${ctx.roomOf(rival)} · ir a la sala →</small></a>
          </div>
          <ol class="duel__rows">
            ${rows.map((x) => `
              <li class="duel__row" data-win="${x.win}">
                ${side(x.a, x, "a")}
                <span class="duel__label">${esc(x.a.label)}</span>
                ${side(x.b, x, "b")}
                ${x.r.verdict ? `<p class="duel__verdict">${M.byMode(x.r.verdict, (t, cls) => `<span class="${cls}">${t}</span>`)}</p>` : ""}
              </li>`).join("")}
          </ol>
          ${c.note ? `<p class="duel__note">${M.byMode(c.note, (t, cls) => `<span class="${cls}">${t}</span>`)}</p>` : ""}
        </div>
      </section>`;
    },

    mount(el) {
      const board = el.querySelector(".duel__board");
      if (!board) return;
      // Barras: de 0 a su longitud al entrar; vuelven a 0 al salir del todo (como los contadores)
      board.addEventListener("rv:in", () => board.classList.add("is-on"));
      board.addEventListener("rv:out", () => board.classList.remove("is-on"));
      if (M.reduceMotion) board.classList.add("is-on");
      $$(".duel__row", el).forEach((row) => {
        row.addEventListener("pointerenter", () => row.classList.add("is-hot"));
        row.addEventListener("pointerleave", () => row.classList.remove("is-hot"));
      });
    },
  });
})();
