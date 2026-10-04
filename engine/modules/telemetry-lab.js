/* =========================================================
   MÓDULO · telemetry-lab
   Laboratorio de túnel de viento (Sala 03 · McLaren P1).
     · Banco del coche: la foto de perfil se separa en capas
       (carrocería, alerón, ruedas, reflejo) para simular el
       chasis activo: en modo Race la carrocería baja (las ruedas
       siguen apoyadas) y el alerón se despliega. Sólo se animan
       transform y clip-path.
     · Flujo aerodinámico: líneas de corriente SVG generadas a
       partir del perfil del coche; activables y en pausa fuera
       de pantalla.
     · Sensores de telemetría sobre el coche y un panel lateral
       tipo cockpit con el despiece, el texto por modo y, para el
       motor y la batería, una gráfica de entrega de par/potencia.
   Datos: { id, nav, kicker, title, intro, image,
            rig:{ ground, drop, wheels:[[cx,cy,rx,ry]], wing:[x1,y1,x2,y2],
                  lift, tilt, struts:[x…], sill:[x,y], profile:[[x,y]…] (px de la foto) },
            chassis:{ default, modes:[{ key, label, readouts:[[etiqueta, valor, unidad]] }] },
            flow:{ label, default }, charts:{ <clave>:{ xMax, xLabel, series, notes, note } },
            points:[{ x, y, side, anchor:"body"|"wing"|"wheel", label, short, num, title,
                      image, chart, historia, tecnico }] }
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, $$, esc, pad2 } = M;
  const nf = (n) => n.toLocaleString("es-ES");

  /* Catmull-Rom → curvas Bézier cúbicas (trazos suaves que pasan por todos los puntos) */
  const spline = (pts) => {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  };

  /* Líneas de corriente: el perfil superior del coche desplazado hacia arriba;
     cuanto más lejos del coche, más recta (el flujo libre no "nota" la carrocería) */
  const streams = (profile, w) => {
    const at = (x) => {
      if (x <= profile[0][0]) return profile[0][1];
      for (let i = 1; i < profile.length; i++) {
        const [x0, y0] = profile[i - 1], [x1, y1] = profile[i];
        if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
      }
      return profile[profile.length - 1][1];
    };
    const top = Math.min(...profile.map((p) => p[1]));
    return Array.from({ length: 7 }, (_, k) => {
      const off = 14 + k * 24, t = k / 9;
      const pts = [];
      for (let x = -40; x <= w + 40; x += 40) pts.push([x, (1 - t) * (at(x) - off) + t * (top - off)]);
      return spline(pts);
    });
  };

  /* Gráfica de entrega: X en rpm, Y en % del máximo de cada curva */
  const chart = (ch) => {
    const W = 340, H = 176, L = 30, R = 330, T = 16, B = 142;
    const X = (rpm) => L + ((R - L) * rpm) / ch.xMax, Y = (f) => B - (B - T) * f;
    const grid = [0.25, 0.5, 0.75, 1].map((f) => `<line x1="${L}" x2="${R}" y1="${Y(f)}" y2="${Y(f)}" />`).join("")
      + Array.from({ length: ch.xMax / 1000 + 1 }, (_, i) => `<line class="minor" x1="${X(i * 1000)}" x2="${X(i * 1000)}" y1="${T}" y2="${B}" />`).join("");
    const ticks = Array.from({ length: ch.xMax / 2000 + 1 }, (_, i) => `<text x="${X(i * 2000)}" y="${B + 14}" text-anchor="middle">${i * 2}</text>`).join("");
    const series = ch.series.map((s) => {
      const pts = s.points.map(([r, f]) => [X(r), Y(f)]);
      const d = spline(pts);
      const area = s.fill ? `<path class="tl-area tl-area--${s.key}" d="${d} L${pts[pts.length - 1][0]} ${B} L${pts[0][0]} ${B} Z" />` : "";
      return `${area}<path class="tl-line tl-line--${s.key}" pathLength="1" d="${d}" />`;
    }).join("");
    const notes = (ch.notes || []).map((n) => `<g class="tl-note" style="--d:${n.delay || 0}s"><circle cx="${X(n.at[0])}" cy="${Y(n.at[1])}" r="3.2" /><text x="${X(n.at[0]) + (n.dx || 8)}" y="${Y(n.at[1]) + (n.dy || -8)}" text-anchor="${n.anchor || "start"}">${esc(n.text)}</text></g>`).join("");
    return `
      <figure class="tl-chart">
        <figcaption class="tl-chart__cap">${esc(ch.title)}</figcaption>
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(ch.aria || ch.title)}">
          <g class="tl-grid">${grid}</g>
          <g class="tl-axis">${ticks}<text x="${R}" y="${H - 2}" text-anchor="end">${esc(ch.xLabel)}</text></g>
          ${series}${notes}
        </svg>
        <ul class="tl-legend">${ch.series.map((s) => `<li class="tl-legend--${s.key}"><i></i>${esc(s.label)}<b>${esc(s.peak)}</b></li>`).join("")}</ul>
        ${ch.note ? `<p class="tl-chart__note">${esc(ch.note)}</p>` : ""}
      </figure>`;
  };

  // Valor numérico de una lectura ("−50", "+300", "600") o null si es texto
  const num = (v) => { const n = Number(String(v).replace("−", "-").replace(/\./g, "").replace(",", ".")); return Number.isFinite(n) ? n : null; };

  M.define("telemetry-lab", {
    render: (c, ctx) => {
      const g = c.rig, im = c.image;
      const [x1, y1, x2, y2] = g.wing, ww = x2 - x1, wh = y2 - y1;
      const layer = (cls, style = "", alt = false) => `<div class="tl-layer ${cls}"${style ? ` style="${style}"` : ""}>${M.img(im, { cls: "tl-photo", alt: alt ? im.alt : "", lazy: true })}</div>`;
      const modes = c.chassis.modes;
      const charts = c.charts || {};
      return `
      <section class="lab" id="${c.id}" aria-labelledby="${c.id}-title" data-chassis="${modes[0].key}"
        style="--ground:${g.ground}%; --drop:${g.drop}%; --lift:${(g.lift / wh) * 100}%; --liftf:${g.lift}%; --tilt:${g.tilt}deg">
        <header class="lab__head">
          ${c.kicker ? `<p class="eyebrow rv" data-rv="repeat">${M.kicker(c.kicker)}</p>` : ""}
          <h2 class="section-title rv" data-rv="repeat" id="${c.id}-title">${esc(c.title)}</h2>
          ${c.intro ? `<p class="section-intro rv" data-rv="repeat">${c.intro}</p>` : ""}
        </header>

        <div class="lab__stage">
          <div class="lab__rig">
            <div class="lab__bar">
              <div class="lab__chassis" role="group" aria-label="Modo de chasis">
                <span class="lab__tag" aria-hidden="true">Chasis</span>
                ${modes.map((m, i) => `<button type="button" data-chassis-set="${m.key}" aria-pressed="${i === 0}">${esc(m.label)}</button>`).join("")}
              </div>
              <button type="button" class="lab__flowbtn" aria-pressed="true"><i aria-hidden="true"></i>${esc(c.flow?.label || "Flujo aerodinámico")}</button>
            </div>

            <figure class="lab__car" style="aspect-ratio:${im.w}/${im.h}">
              <div class="tl-stack">
              ${layer("tl-reflect", "", false)}
              <div class="tl-layer tl-body">
                ${M.img(im, { cls: "tl-photo", lazy: true })}
                <span class="tl-wingbed" style="left:${x1}%;top:${y1}%;width:${ww}%;height:${wh}%"></span>
                ${(g.struts || []).map((x) => `<span class="tl-strut" style="left:${x}%;top:${y2 - g.lift}%;height:${g.lift}%"></span>`).join("")}
                <div class="tl-wing" style="left:${x1}%;top:${y1}%;width:${ww}%;height:${wh}%">
                  ${M.img(im, { cls: "tl-photo", alt: "", lazy: true, extra: `style="width:${(100 / ww) * 100}%;height:${(100 / wh) * 100}%;left:${(-x1 / ww) * 100}%;top:${(-y1 / wh) * 100}%"` })}
                </div>
              </div>
              ${g.wheels.map(([cx, cy, rx, ry]) => layer("tl-wheel", `clip-path:ellipse(${rx}% ${ry}% at ${cx}% ${cy}%)`)).join("")}
              </div>
              <svg class="tl-flow" viewBox="0 0 ${im.w} ${im.h}" aria-hidden="true" focusable="false">
                ${streams(g.profile, im.w).map((d, k) => `<path class="tl-stream" pathLength="1" d="${d}" style="--k:${k}" /><path class="tl-stream tl-stream--b" pathLength="1" d="${d}" style="--k:${k}" />`).join("")}
              </svg>
              <span class="tl-ride" aria-hidden="true" style="left:${g.sill[0]}%;--sill:${g.sill[1]}%;--rk:${((g.ground - g.sill[1] - g.drop) / (g.ground - g.sill[1])).toFixed(4)};--rt:${((g.drop / (g.ground - g.sill[1])) * 100).toFixed(2)}%">
                <span class="tl-ride__line"></span><span class="tl-ride__top"></span><span class="tl-ride__txt"><b>${esc(modes[0].ride || "")}</b><b>${esc(modes[1]?.ride || "")}</b></span>
              </span>
              ${["body", "wing", "wheel"].map((a) => `<div class="tl-sensors tl-sensors--${a}">${c.points.map((p, i) => (p.anchor || "body") !== a ? "" : `
                <button type="button" class="sensor" data-point="${i}" data-anchor="${p.anchor || "body"}" data-side="${p.side || "t"}" style="--x:${p.x}%;--y:${p.y}%;--i:${i}" aria-label="Sensor ${pad2(i + 1)} · ${esc(p.title)}" aria-controls="${c.id}-ch-${i}">
                  <span class="sensor__ring" aria-hidden="true"></span><span class="sensor__label"><b>${pad2(i + 1)}</b>${esc(p.label)}</span>
                </button>`).join("")}</div>`).join("")}
              <span class="tl-mark tl-mark--tl" aria-hidden="true"></span><span class="tl-mark tl-mark--tr" aria-hidden="true"></span>
              <span class="tl-mark tl-mark--bl" aria-hidden="true"></span><span class="tl-mark tl-mark--br" aria-hidden="true"></span>
            </figure>

            <dl class="lab__readouts" aria-live="polite">
              ${modes[0].readouts.map(([l, v, u], k) => `<div><dt>${esc(l)}</dt><dd data-r="${k}"><span>${esc(v)}</span><small>${esc(u || "")}</small></dd></div>`).join("")}
            </dl>
          </div>

          <aside class="lab__panel" aria-label="Telemetría del sistema">
            <div class="lab__chips" role="tablist" aria-label="Sistemas">
              ${c.points.map((p, i) => `<button type="button" role="tab" id="${c.id}-tab-${i}" aria-controls="${c.id}-ch-${i}" data-point="${i}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}"><b>${pad2(i + 1)}</b>${esc(p.short || p.label)}</button>`).join("")}
            </div>
            ${c.points.map((p, i) => `
              <article class="lab__ch" role="tabpanel" id="${c.id}-ch-${i}" aria-labelledby="${c.id}-tab-${i}"${i ? " hidden" : ""}>
                <p class="lab__num">${esc(p.num)}</p>
                <h3 class="lab__title">${esc(p.title)}</h3>
                ${p.image ? `<figure class="lab__shot" style="aspect-ratio:${p.image.w}/${p.image.h}">${M.img(p.image, { cls: "photo" })}</figure>` : ""}
                ${p.chart && charts[p.chart] ? chart(charts[p.chart]) : ""}
                ${M.modeBlocks(p)}
              </article>`).join("")}
          </aside>
          <svg class="lab__lead" aria-hidden="true" focusable="false"><path pathLength="1" /><circle r="2.5" /></svg>
        </div>
      </section>`;
    },

    mount(el, c, ctx) {
      const stage = $(".lab__stage", el);
      const car = $(".lab__car", el);
      const panel = $(".lab__panel", el);
      const sensors = $$(".sensor", el).sort((a, b) => a.dataset.point - b.dataset.point);
      const tabs = $$("[role=tab]", el);
      const chs = $$(".lab__ch", el);
      const lead = $(".lab__lead", el), leadPath = $("path", lead), leadDot = $("circle", lead);
      const flowBtn = $(".lab__flowbtn", el);
      const modes = c.chassis.modes;
      let active = 0;

      /* ---------- Línea directriz: del sensor activo al borde del panel ---------- */
      function draw() {
        if (getComputedStyle(lead).display === "none") return;
        const s = stage.getBoundingClientRect(), p = sensors[active].getBoundingClientRect(), r = panel.getBoundingClientRect();
        lead.setAttribute("viewBox", `0 0 ${s.width} ${s.height}`);
        const x1 = p.left + p.width / 2 - s.left, y1 = p.top + p.height / 2 - s.top;
        const x2 = r.left - s.left, y2 = Math.min(Math.max(y1, r.top - s.top + 28), r.bottom - s.top - 28);
        const sx = x1 + 9;                                   // nace en el borde del anillo del sensor
        const dy = Math.abs(y2 - y1), run = x2 - sx;
        const ex = dy < run - 24 ? sx + dy : x2;             // tramo a 45° y después horizontal
        leadPath.setAttribute("d", `M${sx} ${y1} L${ex} ${y2} L${x2} ${y2}`);
        leadDot.setAttribute("cx", x2); leadDot.setAttribute("cy", y2);
      }
      const redraw = () => requestAnimationFrame(draw);

      /* ---------- Sistema activo ---------- */
      function select(i, focusTab = false) {
        if (!chs[i]) return;
        const changed = i !== active;
        active = i;
        ctx.store.set("labPoint", i);
        sensors.forEach((b, k) => { b.classList.toggle("is-active", k === i); b.setAttribute("aria-pressed", String(k === i)); });
        tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; if (k === i && focusTab) t.focus(); });
        chs.forEach((ch, k) => {
          ch.hidden = k !== i;
          if (k === i) { ch.classList.remove("is-drawn"); void ch.offsetWidth; ch.classList.add("is-drawn"); }   // la gráfica se vuelve a trazar
        });
        M.scrollRowTo($(".lab__chips", el), tabs[i]);
        if (changed) M.pulse(sensors[i]);
        lead.classList.remove("is-drawn");
        requestAnimationFrame(() => { draw(); requestAnimationFrame(() => lead.classList.add("is-drawn")); });
      }
      sensors.forEach((b, k) => b.addEventListener("click", () => select(k)));
      tabs.forEach((t, k) => {
        t.addEventListener("click", () => select(k));
        t.addEventListener("keydown", (e) => {
          const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          select((active + dir + tabs.length) % tabs.length, true);
        });
      });
      $$(".lab__shot", el).forEach((fig) => M.zoomable(fig, () => $("img", fig)));
      // El despiece de cada sistema se pide al apuntar, enfocar o tocar su sensor o su pestaña
      [...sensors, ...tabs].forEach((b) => M.warmOn(b, () => chs[+b.dataset.point]));

      /* ---------- Chasis Road / Race ---------- */
      const counters = new Map();
      function countTo(dd, to) {
        const span = $("span", dd);
        const from = num(span.textContent), target = num(to);
        cancelAnimationFrame(counters.get(dd));
        if (from === null || target === null || M.reduceMotion) { span.textContent = to; return; }
        const sign = /^[−+]/.test(to) ? to[0] : "", t0 = performance.now(), dur = 650;
        const tick = (now) => {
          const k = Math.min(1, (now - t0) / dur), e = 1 - (1 - k) ** 3;
          const v = Math.round(from + (target - from) * e);
          span.textContent = k < 1 ? `${v < 0 ? "−" : v > 0 && sign === "+" ? "+" : ""}${nf(Math.abs(v))}` : to;
          if (k < 1) counters.set(dd, requestAnimationFrame(tick));
        };
        counters.set(dd, requestAnimationFrame(tick));
      }
      function setChassis(key, save = true) {
        const m = modes.find((x) => x.key === key) || modes[0];
        el.dataset.chassis = m.key;
        $$("[data-chassis-set]", el).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.chassisSet === m.key)));
        $$(".lab__readouts dd", el).forEach((dd, k) => {
          const [, v, u] = m.readouts[k] || [];
          $("small", dd).textContent = u || "";
          countTo(dd, v ?? "");
        });
        if (save) ctx.store.set("chassis", m.key);
        setTimeout(redraw, 760);                               // los sensores terminan de moverse
      }
      $$("[data-chassis-set]", el).forEach((b) => b.addEventListener("click", () => setChassis(b.dataset.chassisSet)));

      /* ---------- Flujo aerodinámico (en pausa fuera de pantalla) ---------- */
      function setFlow(on, save = true) {
        el.classList.toggle("has-flow", on);
        flowBtn.setAttribute("aria-pressed", String(on));
        if (save) ctx.store.set("flow", on);
      }
      flowBtn.addEventListener("click", () => setFlow(flowBtn.getAttribute("aria-pressed") !== "true"));
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([e]) => el.classList.toggle("is-live", e.isIntersecting), { rootMargin: "80px" }).observe(car);
      } else el.classList.add("is-live");

      /* ---------- Arranque ---------- */
      addEventListener("resize", redraw);
      addEventListener("load", redraw);
      M.onScroll(draw);                                        // el banco es fijo y el panel se desplaza
      if ("ResizeObserver" in window) new ResizeObserver(redraw).observe(stage);
      M.onMode(redraw);
      setChassis(ctx.store.get("chassis", c.chassis.default || modes[0].key), false);
      setFlow(ctx.store.get("flow", M.reduceMotion ? false : c.flow?.default !== false), false);
      const saved = Number(ctx.store.get("labPoint"));
      select(chs[saved] ? saved : 0);
    },
  });
})();
