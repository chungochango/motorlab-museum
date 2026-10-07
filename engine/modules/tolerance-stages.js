/* =========================================================
   MÓDULO · tolerance-stages
   Comparador de etapas de preparación (Sala 08 · el mito del
   2JZ): pestañas con cada etapa, su potencia, si la cifra es de
   fábrica o no oficial, y el estado de cada pieza (de serie /
   reforzar / sustituir). Debajo, la explicación física de por
   qué aguanta, que no cambia con la etapa.
   Datos: { id, nav, shield, title, intro,
            stages:[{ key, label, power, official:true|false, title,
                      text:{historia, tecnico},
                      parts:[[pieza, "serie"|"reforzar"|"sustituir", nota]] }],
            why:{ title, text }, note }
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $$, esc } = M;
  const STATE = { serie: "De serie", reforzar: "Reforzar", sustituir: "Sustituir" };

  M.define("tolerance-stages", {
    render: (c) => `
      <section class="section tolerance" id="${c.id}" aria-labelledby="${c.id}-title">
        ${M.plaqueHead(c)}
        <div class="tolerance__tabs rv" style="--i:2" role="tablist" aria-label="Etapas de preparación">
          ${c.stages.map((s, i) => `
            <button type="button" role="tab" id="${c.id}-tab-${s.key}" aria-controls="${c.id}-panel-${s.key}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""}>
              <span class="tolerance__label">${esc(s.label)}</span>
              <span class="tolerance__power">${esc(s.power)}</span>
            </button>`).join("")}
        </div>
        <div class="tolerance__stage rv" style="--i:3">
          ${c.stages.map((s, i) => `
            <article class="tolerance__panel" id="${c.id}-panel-${s.key}" role="tabpanel" aria-labelledby="${c.id}-tab-${s.key}"${i ? " hidden" : ""}>
              <div class="tolerance__head">
                <span class="tolerance__badge${s.official ? "" : " is-unofficial"}">${s.official ? "Dato de fábrica" : "No oficial · cifras de preparadores"}</span>
                <h3>${esc(s.title)}</h3>
                ${M.byMode(s.text, (t, cls) => `<p class="${cls}">${t}</p>`)}
              </div>
              <ul class="tolerance__parts">
                ${s.parts.map(([name, state, note]) => `
                  <li class="is-${esc(state)}">
                    <span class="tolerance__part">${esc(name)}</span>
                    <span class="tolerance__state">${esc(STATE[state] || state)}</span>
                    ${note ? `<span class="tolerance__note">${esc(note)}</span>` : ""}
                  </li>`).join("")}
              </ul>
            </article>`).join("")}
        </div>
        ${c.why ? `<aside class="tolerance__why rv" style="--i:4"><h3>${esc(c.why.title)}</h3>${M.byMode(c.why.text, (t, cls) => `<p class="${cls}">${t}</p>`)}</aside>` : ""}
        ${c.note ? `<p class="tolerance__footnote">${esc(c.note)}</p>` : ""}
      </section>`,

    mount(el) {
      const tabs = $$('[role="tab"]', el);
      const panels = $$('[role="tabpanel"]', el);
      const select = (tab, focus) => {
        tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
        panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
        if (focus) tab.focus();
      };
      tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => select(tab));
        tab.addEventListener("keydown", (e) => {
          const to = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
          if (to === undefined) return;
          e.preventDefault();
          select(tabs[to], true);
        });
      });
    },
  });
})();
