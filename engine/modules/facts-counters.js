/* =========================================================
   MÓDULO · facts-counters
   Ficha técnica en rejilla con contadores que se animan al
   entrar en pantalla y vuelven a 0 al salir del todo.
   Datos: { id, kicker, title, specs:["power", "torque", …] } → claves de car.specs
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $$, esc, clamp } = M;

  const fmt = (dec) => M.numberFormat(dec);       // millares también con 4 cifras (1.100, 1.315)

  M.define("facts-counters", {
    render: (c, ctx) => `
      <section class="facts" id="${c.id}" aria-labelledby="${c.id}-title">
        ${c.kicker ? `<p class="eyebrow rv" data-rv="repeat">${M.kicker(c.kicker)}</p>` : ""}
        <h2 class="facts__title rv" data-rv="repeat" id="${c.id}-title">${esc(c.title)}</h2>
        <dl class="facts__grid">
          ${c.specs.map((k) => ctx.car.specs[k]).filter((f) => f && f.value != null).map((f) => `<div class="fact rv" data-rv="repeat"><dt>${esc(f.label)}</dt><dd>${typeof f.value === "number"
            ? `<span data-count="${f.value}" data-decimals="${f.decimals || 0}">${fmt(f.decimals || 0).format(f.value)}</span>`
            : `<span>${esc(f.value)}</span>`}${f.unit ? ` <small>${esc(f.unit)}</small>` : ""}</dd></div>`).join("")}
        </dl>
      </section>`,

    mount(el) {
      $$(".fact", el).forEach((fact) => {
        const num = fact.querySelector("[data-count]");
        if (!num) return;                                   // cifra de texto (p. ej. un tiempo de vuelta): sin contador
        const end = parseFloat(num.dataset.count);
        const f = fmt(+num.dataset.decimals);
        let raf = null;
        const reset = () => { if (raf) cancelAnimationFrame(raf); raf = null; num.textContent = f.format(0); };
        fact.addEventListener("rv:in", () => {
          reset();
          if (M.reduceMotion) { num.textContent = f.format(end); return; }
          const t0 = performance.now();
          const step = (now) => {
            const k = 1 - Math.pow(1 - clamp((now - t0) / 1500, 0, 1), 3);
            num.textContent = f.format(end * k);
            raf = k < 1 ? requestAnimationFrame(step) : null;
          };
          raf = requestAnimationFrame(step);
        });
        fact.addEventListener("rv:out", reset);
      });
    },
  });
})();
