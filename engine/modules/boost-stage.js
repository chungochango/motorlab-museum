/* =========================================================
   MÓDULO · boost-stage
   Simulador de turbos secuenciales (Sala 08 · Toyota Supra A80).
   Un esquema del motor con sus dos turbos: el visitante mueve el
   régimen (deslizador o atajos "bajas / altas") y el esquema
   cambia de etapa:
     · primario sólo: todo el escape va al turbo 1;
     · precarga: la válvula de escape empieza a abrir y el turbo 2
       gira sin soplar todavía;
     · paralelo: se abre la válvula de admisión y soplan los dos.
   Las turbinas giran más rápido con el régimen (sin animación con
   prefers-reduced-motion). Sólo cambian clases y una variable CSS.
   Datos: { id, nav, shield, title, intro, rpm:{ min, max, value },
            presets:[{ label, rpm }],
            stages:[{ key, from, label, title, text:{historia, tecnico},
                      readouts:[[etiqueta, valor]] }], note }
          → la etapa activa es la última cuyo "from" ≤ régimen
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, $$, esc } = M;
  const thousands = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Rueda de turbina: aspas radiales que giran sobre su centro
  const wheel = (cx, cy, cls) => `
    <g class="boost__wheel ${cls}" style="transform-origin:${cx}px ${cy}px">
      ${Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * 30).toFixed(1)}" y2="${(cy + Math.sin(a) * 30).toFixed(1)}" />`; }).join("")}
    </g>`;

  // Esquema (viewBox 960 × 440): motor de 6 cilindros, colector, válvula de escape (ECV),
  // turbo 1 y turbo 2, válvula de admisión (ICV) e intercooler
  const diagram = () => `
    <svg class="boost__diagram" viewBox="0 0 960 440" role="img" aria-label="Esquema del sistema de turbos secuenciales">
      <!-- admisión: intercooler → motor -->
      <path class="boost__pipe boost__intake" d="M840 120 V40 H200 V70" />
      <path class="boost__flow boost__flow--intake" d="M840 120 V40 H200 V70" />
      <!-- motor -->
      <g class="boost__engine">
        ${Array.from({ length: 6 }, (_, i) => `<rect x="${60 + i * 50}" y="70" width="40" height="64" rx="4" />`).join("")}
        <text x="210" y="160" text-anchor="middle">6 EN LÍNEA</text>
      </g>
      <!-- colector de escape → turbo 1 y, por la válvula de escape, turbo 2 -->
      <path class="boost__pipe" d="M80 134 V190 H360 M200 190 V262" />
      <path class="boost__pipe boost__pipe--t2" d="M360 190 H470 M530 190 H620 V262" />
      <path class="boost__flow boost__flow--t1" d="M80 134 V190 H200 V262" />
      <path class="boost__flow boost__flow--t2" d="M200 190 H470 M530 190 H620 V262" />
      <g class="boost__valve boost__valve--ecv"><rect x="470" y="172" width="60" height="36" rx="6" /><line class="boost__flap" x1="500" y1="176" x2="500" y2="204" /><text x="500" y="160" text-anchor="middle">VÁLV. ESCAPE</text></g>
      <!-- turbos -->
      <g class="boost__turbo boost__turbo--t1"><circle cx="200" cy="300" r="40" />${wheel(200, 300, "t1")}<text x="200" y="372" text-anchor="middle">TURBO 1</text></g>
      <g class="boost__turbo boost__turbo--t2"><circle cx="620" cy="300" r="40" />${wheel(620, 300, "t2")}<text x="620" y="372" text-anchor="middle">TURBO 2</text></g>
      <!-- compresores → intercooler (el turbo 2 pasa por la válvula de admisión) -->
      <path class="boost__pipe" d="M240 300 H300 V400 H840 V170" />
      <path class="boost__pipe boost__pipe--t2" d="M660 300 H700 M760 300 H800 V400" />
      <path class="boost__flow boost__flow--c1" d="M240 300 H300 V400 H840 V170" />
      <path class="boost__flow boost__flow--c2" d="M660 300 H700 M760 300 H800 V400 H840 V170" />
      <g class="boost__valve boost__valve--icv"><rect x="700" y="282" width="60" height="36" rx="6" /><line class="boost__flap" x1="730" y1="286" x2="730" y2="314" /><text x="730" y="270" text-anchor="middle">VÁLV. ADMISIÓN</text></g>
      <g class="boost__cooler"><rect x="800" y="120" width="80" height="50" rx="4" />${Array.from({ length: 6 }, (_, i) => `<line x1="${810 + i * 12}" y1="126" x2="${810 + i * 12}" y2="164" />`).join("")}<text x="840" y="108" text-anchor="middle">INTERCOOLER</text></g>
    </svg>`;

  M.define("boost-stage", {
    render: (c) => `
      <section class="section boost" id="${c.id}" aria-labelledby="${c.id}-title">
        ${M.plaqueHead(c)}
        <div class="boost__rig rv" style="--i:2" data-stage="${esc(c.stages[0].key)}">
          <div class="boost__stage">${diagram()}</div>
          <div class="boost__panel">
            <div class="boost__rpm">
              <label for="${c.id}-rpm">Régimen</label>
              <output for="${c.id}-rpm" class="boost__rpm-value"><span>${thousands(c.rpm.value)}</span> rpm</output>
            </div>
            <input id="${c.id}-rpm" class="boost__slider" type="range" min="${c.rpm.min}" max="${c.rpm.max}" step="100" value="${c.rpm.value}" aria-describedby="${c.id}-stage-title" />
            <div class="boost__presets" role="group" aria-label="Atajos de régimen">
              ${c.presets.map((p) => `<button type="button" data-rpm="${p.rpm}">${esc(p.label)}</button>`).join("")}
            </div>
            ${c.stages.map((s) => `
              <div class="boost__info" data-for="${esc(s.key)}"${s === c.stages[0] ? "" : " hidden"}>
                <span class="boost__tag">${esc(s.label)}</span>
                <h3${s === c.stages[0] ? ` id="${c.id}-stage-title"` : ""}>${esc(s.title)}</h3>
                ${M.byMode(s.text, (t, cls) => `<p class="${cls}">${t}</p>`)}
                ${M.dataList(s.readouts, "data")}
              </div>`).join("")}
            ${c.note ? `<p class="boost__note">${esc(c.note)}</p>` : ""}
          </div>
        </div>
      </section>`,

    mount(el, c) {
      const rig = $(".boost__rig", el);
      const slider = $(".boost__slider", el);
      const out = $(".boost__rpm-value span", el);
      const infos = $$(".boost__info", el);
      const stageOf = (rpm) => [...c.stages].reverse().find((s) => rpm >= s.from) || c.stages[0];
      const paint = (rpm) => {
        const s = stageOf(rpm);
        out.textContent = thousands(rpm);
        slider.setAttribute("aria-valuetext", `${thousands(rpm)} rpm · ${s.title}`);
        rig.dataset.stage = s.key;
        // Turbinas más rápidas cuanto más régimen (periodo de giro en segundos)
        rig.style.setProperty("--spin", `${(1.6 - ((rpm - c.rpm.min) / (c.rpm.max - c.rpm.min)) * 1.4).toFixed(2)}s`);
        infos.forEach((i) => {
          const on = i.dataset.for === s.key;
          i.hidden = !on;
          const h = $("h3", i);
          if (on) h.id = `${c.id}-stage-title`; else h.removeAttribute("id");
        });
      };
      slider.addEventListener("input", () => paint(+slider.value));
      $$(".boost__presets [data-rpm]", el).forEach((b) => b.addEventListener("click", () => {
        slider.value = b.dataset.rpm;
        paint(+slider.value);
      }));
      paint(+slider.value);
    },
  });
})();
