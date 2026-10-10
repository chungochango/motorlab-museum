/* =========================================================
   MUSEO · HALL · TELEMETRÍA Y CAPA DE MOVIMIENTO
   ---------------------------------------------------------
   Se apoya en el índice de salas (engine/hall-index.js) y añade:
     · tablero de telemetría del museo, calculado desde data/cars.json
       (salas abiertas / previstas, potencia sumada, régimen más alto
       y sala más potente);
     · en las salas con apertura programada (releaseDate): insignia,
       cuenta atrás con días, horas, minutos y segundos, y barra de estado;
     · junto al showroom, a la izquierda, el radar del coche al frente
       (potencia, par, ligereza, velocidad máxima y potencia/peso) y, a la
       derecha, su curva esquemática de potencia y par;
     · sobre el escenario, las cruces de las esquinas, la lectura de la sala
       activa y las cotas del coche (batalla, altura, Cx) al pasar el cursor;
   y, sólo si el visitante no ha pedido «reducir movimiento», carga
   Motion (engine/vendor/motion.min.js, copia local) para:
     · la entrada del tablero con muelle y los contadores de 0 a su valor;
     · la deformación del radar y de las curvas al cambiar de coche;
     · la reordenación del índice al filtrar o buscar (FLIP): las tarjetas
       que salen se apagan en 200 ms y las que quedan se deslizan a su sitio;
     · la inclinación 3D de las tarjetas y el halo del color de cada sala
       que sigue al cursor (sólo con ratón).
   Estilos: engine/fx/hall-motion.css.
   ========================================================= */
(() => {
  "use strict";

  const start = async () => {
    const M = window.Museo;
    const cars = M?.hallCars;
    const section = document.getElementById("indice");
    if (!cars?.length || !section) return;
    const { $, $$, esc } = M;
    const nf = M.numberFormat(0);
    const short = (c) => c.model || c.name;

    /* ---------- Tablero de telemetría ---------- */
    const open = cars.filter((c) => M.isRoomOpen(c));
    const scheduled = cars.filter((c) => M.isScheduled(c)).length;
    const planned = Math.max(M.hallPlanned || 0, cars.length);
    const num = (c, key) => (typeof c.specs?.[key]?.value === "number" ? c.specs[key].value : 0);
    const best = (key) => open.reduce((a, c) => (num(c, key) > num(a, key) ? c : a), open[0]);
    const power = open.reduce((sum, c) => sum + num(c, "power"), 0);
    const strong = best("power"), revs = best("redline");
    const cells = [
      { label: "Salas activas", value: open.length, unit: `/ ${nf.format(planned)}`, bar: open.length / planned,
        note: scheduled ? `${scheduled} con apertura programada` : `${cars.length - open.length} en desarrollo` },
      { label: "Potencia en exhibición", value: power, unit: "CV", note: `Suma de las ${open.length} salas abiertas` },
      num(revs, "redline") ? { label: "Régimen máximo", value: num(revs, "redline"), unit: "rpm", note: `${revs.brand} ${short(revs)}` } : null,
      { label: "Sala más potente", value: num(strong, "power"), unit: "CV", note: `${strong.brand} ${short(strong)}` },
    ].filter(Boolean);
    section.insertAdjacentHTML("afterbegin", `
      <dl class="hud" aria-label="Telemetría del museo">
        ${cells.map((c) => `
          <div class="hud__cell">
            <dt>${esc(c.label)}</dt>
            <dd><span class="hud__num" data-to="${c.value}">${nf.format(c.value)}</span> <small>${esc(c.unit)}</small></dd>
            ${c.bar != null ? `<span class="hud__bar" aria-hidden="true"><i style="--k:${c.bar.toFixed(4)}"></i></span>` : ""}
            <span class="hud__note">${esc(c.note)}</span>
          </div>`).join("")}
      </dl>`);
    const hud = $(".hud", section);

    /* ---------- Salas con apertura programada: insignia, cuenta atrás y barra de estado ---------- */
    const clocks = [];
    $$(".idx__item", section).forEach((item) => {
      const c = cars[+item.dataset.i];
      const body = $(".idx__body", item);
      if (!c || !body || !M.isScheduled(c)) return;
      item.classList.add("has-launch");
      body.insertAdjacentHTML("beforeend", `
        <span class="launch">
          <span class="launch__badge"><span class="launch__lamp" aria-hidden="true"></span>Telemetría anticipada // Apertura programada</span>
          <span class="launch__clock" aria-hidden="true">${[["d", "d"], ["h", "h"], ["m", "min"], ["s", "s"]].map(([k, u]) => `<span><b data-u="${k}">00</b>${u}</span>`).join("")}</span>
          <span class="launch__date">Abre el ${esc(M.releaseLabel(c))}</span>
          <span class="launch__scan"><i aria-hidden="true"></i>Sistemas calibrando // Telemetría bloqueada</span>
        </span>`);
      clocks.push({ at: Date.parse(c.releaseDate), el: Object.fromEntries($$("[data-u]", body).map((b) => [b.dataset.u, b])) });
    });
    if (clocks.length) {
      const tick = () => clocks.forEach(({ at, el }) => {
        const s = Math.max(0, Math.floor((at - Date.now()) / 1000));
        el.d.textContent = M.pad2(Math.floor(s / 86400));
        el.h.textContent = M.pad2(Math.floor((s % 86400) / 3600));
        el.m.textContent = M.pad2(Math.floor((s % 3600) / 60));
        el.s.textContent = M.pad2(s % 60);
      });
      tick();
      setInterval(tick, 1000);          // al llegar a cero, la cuenta atrás del índice (data-reload) recarga el Hall
    }

    /* ---------- Radar del coche al frente (showroom) ----------
       Cinco ejes sacados de las fichas, cada uno relativo al mejor valor del catálogo. Un eje sin
       dato oficial se queda en el mínimo (12 %) y se marca «s/d». Al cambiar de coche (evento
       "museo:hall-active" de engine/hall-orbit.js) el polígono se deforma hacia la nueva forma. */
    const orbit = document.querySelector(".orbit");
    let radarMorph = null;                       // lo pone la capa de movimiento cuando Motion está cargado
    if (orbit) {
      // Cifra de la ficha, venga como número o como texto («730 Nm», «1.690 kg», «3,5 s»); un texto sin cifra
      // («Sin dato oficial») es un dato que falta. Acepta también claves alternativas (powerHp, weightKg…).
      const number = (v) => {
        if (typeof v === "number") return Number.isFinite(v) && v > 0 ? v : null;
        const m = typeof v === "string" && v.match(/\d[\d.]*(?:,\d+)?/);
        if (!m) return null;
        const n = parseFloat(m[0].replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", "."));
        return Number.isFinite(n) && n > 0 ? n : null;
      };
      const spec = (c, ...keys) => { for (const k of keys) { const s = c.specs?.[k]; const n = number(s && typeof s === "object" ? s.value : s); if (n != null) return n; } return null; };
      const FLOOR = 0.12;                        // ningún vértice baja del 12 %: el polígono nunca se cierra en una aguja
      const AXES = [
        { label: "Potencia", unit: "CV", get: (c) => spec(c, "power", "powerHp") },
        { label: "Par motor", unit: "Nm", get: (c) => spec(c, "torque", "torqueNm") },
        { label: "Ligereza", unit: "kg", get: (c) => spec(c, "weight", "weightKg"), low: true },      // inversa del peso: el más ligero marca el 100 %
        { label: "Velocidad máx.", unit: "km/h", get: (c) => spec(c, "topSpeed", "topSpeedKm") },
        { label: "Potencia / peso", unit: "CV/t", get: (c) => { const p = spec(c, "power", "powerHp"), w = spec(c, "weight", "weightKg"); return p && w ? Math.round((p / w) * 1000) : null; } },
      ];
      const raw = cars.map((c) => AXES.map((a) => a.get(c)));
      const top = AXES.map((a, k) => { const vs = raw.map((r) => r[k]).filter((v) => v != null); return vs.length ? (a.low ? Math.min(...vs) : Math.max(...vs)) : null; });
      const norm = raw.map((r) => r.map((v, k) => (v == null || top[k] == null ? FLOOR : Math.max(FLOOR, Math.min(1, AXES[k].low ? top[k] / v : v / top[k])))));
      const CX = 150, CY = 118, R = 70, N = AXES.length;
      const at = (k, f) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / N; return [CX + Math.cos(a) * R * f, CY + Math.sin(a) * R * f]; };
      const path = (vals) => vals.map((f, k) => at(k, f).map((n) => n.toFixed(1)).join(" ")).map((p, k) => `${k ? "L" : "M"}${p}`).join(" ") + " Z";
      const ring = (f) => path(AXES.map(() => f));
      orbit.insertAdjacentHTML("beforeend", `
        <figure class="radar" aria-hidden="true">
          <figcaption>Telemetría comparada</figcaption>
          <svg viewBox="0 0 300 236">
            ${[1 / 3, 2 / 3, 1].map((f) => `<path class="radar__ring" d="${ring(f)}" />`).join("")}
            ${AXES.map((_, k) => `<line class="radar__axis" x1="${CX}" y1="${CY}" x2="${at(k, 1)[0].toFixed(1)}" y2="${at(k, 1)[1].toFixed(1)}" />`).join("")}
            <path class="radar__shape" d="${ring(FLOOR)}" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            ${AXES.map((a, k) => { const [x, y] = at(k, 1.2); const anchor = Math.abs(x - CX) < 8 ? "middle" : x > CX ? "start" : "end"; return `<text class="radar__label" x="${x.toFixed(1)}" y="${(y + (y < CY ? -6 : 4)).toFixed(1)}" text-anchor="${anchor}">${esc(a.label)}<tspan class="radar__value" x="${x.toFixed(1)}" dy="12" data-axis="${k}"></tspan></text>`; }).join("")}
          </svg>
          <p class="radar__note">Cada eje, respecto al mejor valor del museo</p>
        </figure>`);
      const radar = $(".radar", orbit), shape = $(".radar__shape", radar), values = $$(".radar__value", radar);
      let now = AXES.map(() => FLOOR);
      const draw = (vals) => { now = vals; shape.setAttribute("d", path(vals)); };
      const show = (i, animated) => {
        const c = cars[i];
        if (!c) return;
        radar.style.setProperty("--accent", c.palette?.hallAccent || "226, 228, 232");
        radar.classList.toggle("is-empty", raw[i].every((v) => v == null));
        values.forEach((el, k) => { const v = raw[i][k]; el.textContent = v == null ? "s/d" : `${nf.format(v)} ${AXES[k].unit}`; el.classList.toggle("is-void", v == null); });
        if (animated && radarMorph) radarMorph(now.slice(), norm[i], draw); else draw(norm[i]);
      };
      show(M.hallActive || 0, false);
      document.addEventListener("museo:hall-active", (ev) => show(ev.detail.i, true));
    }

    /* ---------- Curva de potencia y par del coche al frente (showroom) ----------
       ESQUEMÁTICA: las fichas sólo traen dos puntos oficiales (potencia máxima y par máximo, cada
       uno con su régimen: specs.power.rpm y specs.torque.rpm). La curva de par pasa por su máximo
       y por el par que corresponde a la potencia máxima (par = potencia × 7.022 / rpm), y la de
       potencia se deduce de ella. No es una medición de banco, y así se indica bajo el gráfico.
       Si falta algún régimen se estima por la arquitectura del motor (turbo, atmosférico, rotativo,
       moto: "tags" de la ficha) y la leyenda lo marca con un asterisco; nunca queda una línea plana. */
    let dynoMorph = null;                        // lo pone la capa de movimiento cuando Motion está cargado
    if (orbit) {
      const S = 44, X0 = 30, X1 = 288, Y0 = 26, Y1 = 150;
      const val = (c, k) => (typeof c.specs?.[k]?.value === "number" ? c.specs[k].value : null);
      const rpm = (c, k) => (typeof c.specs?.[k]?.rpm === "number" ? c.specs[k].rpm : null);
      const FLAT = [...Array(S * 2).fill(0.06), 0.5, 0.5];
      // Regímenes de referencia por arquitectura (campo "tags" de la ficha), para cuando la ficha no los trae:
      // [par máximo, potencia máxima, corte]. Se usan sólo para dar forma a la curva y se avisa al pie.
      const ARCH = [
        ["moto", [11500, 15250, 16500]],
        ["rotativo", [5000, 6500, 8000]],
        ["atmosferico", [6000, 8700, 9500]],
        ["turbo", [4200, 6500, 7200]],
      ];
      const arch = (c) => (ARCH.find(([tag]) => (c.tags || []).includes(tag)) || ARCH[3])[1];
      const models = cars.map((c) => {
        const P = val(c, "power"), T = val(c, "torque");
        const base = { P, T, rp: rpm(c, "power"), rt: rpm(c, "torque"), unit: c.specs?.power?.unit || "CV" };
        if (!P && !T) return base;                                         // sin cifras: no hay nada que dibujar
        const [art, arp, acut] = arch(c);
        let rp = base.rp, rt = base.rt;
        const guessed = { rp: !rp, rt: !rt };
        if (!rp) rp = rt ? Math.max(arp, Math.round((rt * 1.45) / 100) * 100) : arp;
        if (!rt) rt = Math.min(art, Math.round((rp * 0.65) / 100) * 100);
        if (rt >= rp) rt = Math.round((rp * 0.65) / 100) * 100;
        const cut = val(c, "redline") > rp ? val(c, "redline") : guessed.rp && !base.rt ? acut : Math.ceil((rp * 1.07) / 500) * 500;
        // Par a régimen de potencia máxima (par = potencia × 7.022 / rpm). Si falta una cifra o las dos no
        // casan (potencia combinada de un híbrido, régimen estimado), se toma una caída típica del 12 %
        const Tm = T || (P * 7022) / rp / 0.88, Pm = P || (Tm * 0.88 * rp) / 7022;
        let atPeak = (Pm * 7022) / rp, loose = guessed.rp || guessed.rt || !P || !T;
        if (!(atPeak < Tm * 0.985)) { atPeak = Tm * 0.88; loose = true; }
        const lo = 1000, top = Math.max(cut, rp + 300);
        // Sube hasta el par máximo, baja hasta el par de potencia máxima y, pasado ese régimen, cae deprisa (la potencia ya desciende)
        const torque = (r) => Math.max(0.05 * Tm, r <= rt ? Tm * (1 - 0.45 * ((rt - r) / rt) ** 2) : r <= rp ? Tm * (1 - (1 - atPeak / Tm) * ((r - rt) / (rp - rt)) ** 2) : atPeak * (rp / r) ** 1.8);
        const xs = Array.from({ length: S }, (_, k) => lo + ((top - lo) * k) / (S - 1));
        const tq = xs.map(torque), pw = xs.map((r, k) => (tq[k] * r) / 7022), pmax = Math.max(...pw);
        // Ninguna coordenada sale del gráfico ni deja de ser un número
        const safe = (v, max) => (Number.isFinite(v) ? Math.max(0.02, Math.min(max, v)) : 0.06);
        const state = [...tq.map((v) => safe((v / Tm) * 0.84, 0.84)), ...pw.map((v) => safe(v / pmax, 1)), safe((rt - lo) / (top - lo), 1), safe((rp - lo) / (top - lo), 1)];
        return { ...base, rp, rt, lo, top, state, guessed, loose };
      });
      const px = (f) => X0 + (X1 - X0) * f, py = (f) => Y1 - (Y1 - Y0) * f;
      const line = (arr) => arr.map((f, k) => `${k ? "L" : "M"}${px(k / (S - 1)).toFixed(1)} ${py(f).toFixed(1)}`).join(" ");
      const yAt = (arr, x) => { const p = Math.max(0, Math.min(S - 1, x * (S - 1))), k = Math.min(S - 2, Math.floor(p)); return arr[k] + (arr[k + 1] - arr[k]) * (p - k); };
      orbit.insertAdjacentHTML("beforeend", `
        <figure class="dyno" aria-hidden="true">
          <figcaption>Potencia y par</figcaption>
          <svg viewBox="0 0 300 176">
            ${[0, 1 / 3, 2 / 3, 1].map((f) => `<line class="dyno__grid" x1="${X0}" x2="${X1}" y1="${py(f).toFixed(1)}" y2="${py(f).toFixed(1)}" />`).join("")}
            ${[0, 0.25, 0.5, 0.75, 1].map((f) => `<line class="dyno__grid" x1="${px(f).toFixed(1)}" x2="${px(f).toFixed(1)}" y1="${Y0}" y2="${Y1}" />`).join("")}
            <path class="dyno__torque" d="${line(FLAT.slice(0, S))}" />
            <path class="dyno__power" d="${line(FLAT.slice(S, S * 2))}" />
            <circle class="dyno__dot dyno__dot--torque" r="3" /><circle class="dyno__dot dyno__dot--power" r="3" />
            <text class="dyno__tick" x="${X0}" y="${Y1 + 14}" data-rpm="lo"></text>
            <text class="dyno__tick" x="${X1}" y="${Y1 + 14}" text-anchor="end" data-rpm="top"></text>
            <text class="dyno__tick" x="${(X0 + X1) / 2}" y="${Y1 + 14}" text-anchor="middle">rpm</text>
          </svg>
          <p class="dyno__key dyno__key--power"><i></i><b></b><span></span></p>
          <p class="dyno__key dyno__key--torque"><i></i><b></b><span></span></p>
          <p class="dyno__note"></p>
        </figure>`);
      const dyno = $(".dyno", orbit);
      const el = { tq: $(".dyno__torque", dyno), pw: $(".dyno__power", dyno), dt: $(".dyno__dot--torque", dyno), dp: $(".dyno__dot--power", dyno) };
      let now = FLAT;
      const draw = (st) => {
        now = st;
        const tq = st.slice(0, S), pw = st.slice(S, S * 2), xt = st[S * 2], xp = st[S * 2 + 1];
        el.tq.setAttribute("d", line(tq)); el.pw.setAttribute("d", line(pw));
        el.dt.setAttribute("cx", px(xt).toFixed(1)); el.dt.setAttribute("cy", py(yAt(tq, xt)).toFixed(1));
        el.dp.setAttribute("cx", px(xp).toFixed(1)); el.dp.setAttribute("cy", py(yAt(pw, xp)).toFixed(1));
      };
      const key = (sel, v, unit, r, guess) => { const p = $(sel, dyno); $("b", p).textContent = v ? `${nf.format(v)} ${unit}` : "s/d"; $("span", p).textContent = v && r ? `${guess ? "≈" : "a"} ${nf.format(r)} rpm${guess ? " *" : ""}` : ""; };
      const show = (i, animated) => {
        const m = models[i];
        if (!m) return;
        dyno.style.setProperty("--accent", cars[i].palette?.hallAccent || "226, 228, 232");
        dyno.classList.toggle("is-empty", !m.state);
        key(".dyno__key--power", m.P, m.unit, m.state && m.rp, m.guessed?.rp); key(".dyno__key--torque", m.T, "Nm", m.state && m.rt, m.guessed?.rt);
        $('[data-rpm="lo"]', dyno).textContent = m.state ? nf.format(m.lo) : "";
        $('[data-rpm="top"]', dyno).textContent = m.state ? nf.format(m.top) : "";
        const guess = m.guessed?.rp || m.guessed?.rt;
        dyno.classList.toggle("is-guess", !!guess);
        $(".dyno__note", dyno).textContent = !m.state ? "Sin curva: la ficha aún no tiene potencia ni par"
          : guess ? "* Curva estimada según arquitectura de motor: la ficha no trae ese régimen"
          : "Curva esquemática trazada con los puntos de la ficha; no es una medición de banco";
        const to = m.state || FLAT;
        if (animated && dynoMorph) dynoMorph(now.slice(), to, draw); else draw(to);
      };
      show(M.hallActive || 0, false);
      document.addEventListener("museo:hall-active", (ev) => show(ev.detail.i, true));
    }

    /* ---------- Marco técnico, lectura de estado y cotas del coche al frente ----------
       Cuatro cruces en las esquinas del escenario y una lectura de la sala activa. Al pasar el
       cursor por el coche del centro se trazan sus cotas (batalla, altura y Cx) si la ficha las
       tiene: car.dimensions = { wheelbase, height } en mm, y specs.drag o dimensions.cd.
       Las líneas son de acotación: enmarcan el coche, no señalan los ejes exactos de la foto. */
    const stageEl = document.querySelector(".orbit__stage");
    if (orbit && stageEl) {
      stageEl.insertAdjacentHTML("beforeend", `
        <span class="frame" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="frame__read"><b></b><span></span></span></span>
        <svg class="blueprint" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <g data-dim="wheelbase"><path pathLength="1" d="M240 372 V412 M760 372 V412 M240 398 H760" /><text x="500" y="436" text-anchor="middle"></text></g>
          <g data-dim="height"><path pathLength="1" d="M96 150 H52 M96 372 H52 M66 150 V372" /><text x="46" y="266" text-anchor="end"></text></g>
          <g data-dim="cd"><path pathLength="1" d="M690 150 L760 96 H900" /><text x="900" y="84" text-anchor="end"></text></g>
        </svg>`);
      const read = $(".frame__read", stageEl), blue = $(".blueprint", stageEl);
      const mm = (v) => (typeof v === "number" ? `${nf.format(v)} mm` : null);
      let dims = 0;
      const show = (i) => {
        const c = cars[i];
        if (!c) return;
        $("b", read).textContent = M.isRoomOpen(c) ? "Telemetría activa" : "Telemetría anticipada";
        $("span", read).textContent = `Sala ${M.roomNo(c, i)} · ${i + 1} / ${cars.length}`;
        const cd = typeof c.dimensions?.cd === "number" ? c.dimensions.cd : typeof c.specs?.drag?.value === "number" ? c.specs.drag.value : null;
        const texts = { wheelbase: mm(c.dimensions?.wheelbase) && `Batalla ${mm(c.dimensions.wheelbase)}`, height: mm(c.dimensions?.height) && `Altura ${mm(c.dimensions.height)}`, cd: cd && `Cx ${M.numberFormat(2).format(cd)}` };
        dims = 0;
        $$("[data-dim]", blue).forEach((g) => { const t = texts[g.dataset.dim]; g.toggleAttribute("hidden", !t); $("text", g).textContent = t || ""; if (t) dims++; });
        blue.style.setProperty("--ar", c.hall?.image?.w && c.hall?.image?.h ? (c.hall.image.w / c.hall.image.h).toFixed(4) : "1.5");
        blue.style.setProperty("--accent", c.palette?.hallAccent || "226, 228, 232");
        orbit.classList.remove("is-blueprint");
      };
      show(M.hallActive || 0);
      document.addEventListener("museo:hall-active", (ev) => show(ev.detail.i));
      if (M.finePointer.matches) {
        stageEl.addEventListener("pointerover", (ev) => { if (dims && ev.target.closest(".orbit__slot.is-active .orbit__car")) orbit.classList.add("is-blueprint"); });
        stageEl.addEventListener("pointerout", (ev) => { if (!ev.relatedTarget?.closest?.(".orbit__slot.is-active .orbit__car")) orbit.classList.remove("is-blueprint"); });
        stageEl.addEventListener("pointerdown", () => orbit.classList.remove("is-blueprint"));
      }
    }

    /* ---------- Movimiento (sólo sin «reducir movimiento») ---------- */
    if (M.reduceMotion) return;
    try { await M.loadScript("engine/vendor/motion.min.js"); } catch (err) { console.error(err); return; }
    const { animate, inView, spring, stagger } = window.Motion;
    document.documentElement.classList.add("fx-hall");

    // Curva de potencia y par: las dos curvas y sus puntos se interpolan hacia los del coche nuevo
    let dynoRun = null;
    dynoMorph = (from, to, draw) => {
      if (dynoRun) dynoRun.cancel();
      dynoRun = animate((p) => draw(from.map((v, k) => v + (to[k] - v) * p)), { duration: 0.8, easing: [0.22, 1, 0.36, 1] });
    };

    // Radar: los vértices se interpolan entre la forma anterior y la nueva
    let morph = null;
    radarMorph = (from, to, draw) => {
      if (morph) morph.cancel();
      morph = animate((p) => draw(from.map((v, k) => v + (to[k] - v) * p)), { duration: 0.7, easing: [0.22, 1, 0.36, 1] });
    };

    // Tablero: celdas en cadena con muelle, contadores de 0 a su valor y barra de progreso
    const hudCells = $$(".hud__cell", hud);
    const nums = $$(".hud__num", hud);
    nums.forEach((n) => { n.textContent = nf.format(0); });
    animate(hudCells, { opacity: 0 }, { duration: 0 });
    inView(hud, () => {
      animate(hudCells, { opacity: [0, 1], y: [26, 0] }, { delay: stagger(0.09), easing: spring({ stiffness: 120, damping: 14 }) });
      nums.forEach((n, i) => {
        const to = +n.dataset.to;
        animate((p) => { n.textContent = nf.format(Math.round(to * p)); }, { duration: 1.6, delay: 0.15 + i * 0.09, easing: [0.16, 1, 0.3, 1] });
      });
      $$(".hud__bar i", hud).forEach((bar) => animate(bar, { scaleX: [0, +bar.style.getPropertyValue("--k")] }, { duration: 1.4, delay: 0.3, easing: [0.16, 1, 0.3, 1] }));
    }, { amount: 0.4 });

    /* Reordenación del índice (la llama engine/hall-index.js en cada filtrado o búsqueda):
       primero se apagan las que salen, luego se aplica el cambio y las que quedan se deslizan
       desde donde estaban (FLIP). Las medidas se leen todas juntas, antes de animar. */
    const slide = spring({ stiffness: 170, damping: 22 });
    let turn = 0;
    M.fx = M.fx || {};
    M.fx.hallFlip = ({ items, shown, commit }) => {
      const mine = ++turn;
      const visible = items.filter((el) => !el.hidden);
      const first = new Map(visible.map((el) => [el, el.getBoundingClientRect()]));
      const leaving = visible.filter((el) => !shown.has(+el.dataset.i));
      const settle = () => {
        if (mine !== turn) return;                 // otro filtrado llegó mientras tanto: manda el último
        commit();
        leaving.forEach((el) => animate(el, { opacity: 1, scale: 1 }, { duration: 0 }));
        const now = items.filter((el) => !el.hidden);
        const last = new Map(now.map((el) => [el, el.getBoundingClientRect()]));
        now.forEach((el) => {
          const a = first.get(el), b = last.get(el);
          if (!a) return animate(el, { opacity: [0, 1], scale: [0.94, 1] }, { duration: 0.35, easing: [0.22, 1, 0.36, 1] });
          animate(el, { opacity: 1, scale: 1 }, { duration: 0.2 });
          const dx = a.left - b.left, dy = a.top - b.top;
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) animate(el, { x: [dx, 0], y: [dy, 0] }, { easing: slide });
        });
      };
      if (!leaving.length) return settle();
      animate(leaving, { opacity: 0, scale: 0.96 }, { duration: 0.2, easing: "ease-out" }).finished.then(settle, settle);
    };

    // Inclinación 3D y halo del color de la sala (--accent de cada tarjeta), sólo con ratón
    if (M.finePointer.matches) {
      const ease = spring({ stiffness: 150, damping: 15 });
      const MAX = 3.5;
      $$(".idx__item", section).forEach((item) => {
        const card = $(".idx__card", item);
        let rect = null, frame = 0, px = 0, py = 0;
        item.addEventListener("pointerenter", () => { rect = item.getBoundingClientRect(); });
        item.addEventListener("pointermove", (e) => {
          if (!rect) rect = item.getBoundingClientRect();
          const x = e.clientX - rect.left, y = e.clientY - rect.top;
          px = (x / rect.width) * 2 - 1; py = (y / rect.height) * 2 - 1;
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            card.style.setProperty("--mouse-x", `${((px + 1) / 2 * rect.width).toFixed(1)}px`);
            card.style.setProperty("--mouse-y", `${((py + 1) / 2 * rect.height).toFixed(1)}px`);
            animate(card, { rotateX: -py * MAX, rotateY: px * MAX }, { easing: ease });
          });
        }, { passive: true });
        item.addEventListener("pointerleave", () => {
          if (frame) { cancelAnimationFrame(frame); frame = 0; }
          rect = null;
          animate(card, { rotateX: 0, rotateY: 0 }, { easing: ease });
        });
      });
    }
  };

  if (window.Museo?.hallReady && document.getElementById("indice")) start();
  else document.addEventListener("museo:hall", () => start(), { once: true });
})();
