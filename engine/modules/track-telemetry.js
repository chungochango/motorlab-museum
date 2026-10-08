/* =========================================================
   MÓDULO · track-telemetry
   Telemetría de circuito virtual (Track Blueprint): el plano del
   circuito con un cursor que recorre la vuelta y un salpicadero
   que lee la telemetría del punto en que está:
     · deslizador de recorrido (0–100 %) y botón de reproducir;
     · hitos clicables sobre la pista (curvas críticas) que llevan
       el cursor hasta ellos;
     · velocidad, marcha, régimen (arco), medidor de fuerzas G 2D,
       acelerador y presión de freno;
     · ficha del vértice con la explicación de dinámica vehicular
       cuando el cursor pasa por una curva crítica.
   Entre dos muestras la telemetría se interpola (la marcha y el
   nombre del tramo, no: se toma la muestra más cercana).
   Su CSS va aparte (track-telemetry.css): sala.js lo carga porque
   el módulo se declara con { css: true }.

   Datos: { id, nav, shield, title, intro, note,
            track: "nordschleife",                      // clave de museum.tracks (o el objeto en línea)
            lap: { seconds },                           // duración de la reproducción
            samples: [{ id, distancePercentage, cornerName, speedKmh,
                        gear, rpm, lateralG, longitudinalG,
                        throttlePercentage, brakePressureBar, note? }] }
     · museum.tracks.<clave> = { name, lengthKm, viewBox, d, closed?, source }:
       el trazado real a escala (d empieza en la línea de salida y va
       en el sentido de la marcha). Lo comparten todas las salas que
       ruedan en ese circuito; "source" es su atribución. Con
       "closed": false es un recorrido de punto a punto (una subida):
       sin vuelta completa, con salida parada y línea de meta;
     · una muestra puede llevar "altitudeM": entonces el salpicadero
       añade la altitud y el perfil del recorrido; y "timeS", el tiempo
       desde la salida, que se usa tal cual (si falta, se estima
       integrando la velocidad: no vale para una salida parada);
     · como el dibujo está a escala, el % de vuelta es el % de la
       longitud del trazado: cada muestra cae en su punto real;
     · lateralG > 0 = curva a derechas; longitudinalG < 0 = frenada;
     · una muestra con "note" es una curva crítica: lleva hito en el
       plano y ficha propia; "label" (n · s · e · w) coloca su rótulo
       cuando varias curvas quedan apiñadas.
   ========================================================= */
(() => {
  const M = window.Museo;
  const { $, $$, esc, clamp, reduceMotion } = M;
  const fmt = (n, d = 0) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // El trazado: en línea o por su clave en museum.tracks
  const trackOf = (c, ctx) => (typeof c.track === "string" ? ctx.museum?.tracks?.[c.track] : c.track);

  // Arco del cuentavueltas: 240° abiertos por abajo, en un cuadro de 200 × 200
  const ARC = (() => {
    const r = 80, a0 = (150 * Math.PI) / 180, a1 = (390 * Math.PI) / 180;
    const p = (a) => `${(100 + r * Math.cos(a)).toFixed(1)} ${(100 + r * Math.sin(a)).toFixed(1)}`;
    return `M${p(a0)} A${r} ${r} 0 1 1 ${p(a1)}`;
  })();

  M.define("track-telemetry", {
    css: true,

    render: (c, ctx) => {
      const crit = c.samples.filter((s) => s.note);
      const track = trackOf(c, ctx);
      if (!track) return `<!-- track-telemetry: falta el trazado «${esc(String(c.track))}» -->`;
      const open = track.closed === false, alt = c.samples.some((s) => s.altitudeM != null);
      return `
      <section class="section ttel" id="${c.id}" aria-labelledby="${c.id}-title">
        ${M.plaqueHead(c)}
        <div class="ttel__rig rv" style="--i:2">
          <figure class="ttel__map">
            <figcaption class="ttel__cap"><span>${esc(track.name)}</span><span class="ttel__km"><b>0,00</b> / ${fmt(track.lengthKm, 3)} km</span></figcaption>
            <svg class="ttel__svg" viewBox="${esc(track.viewBox)}" role="group" aria-label="Plano de ${esc(track.name)} con las curvas críticas">
              <path class="ttel__track-edge" d="${esc(track.d)}" />
              <path class="ttel__track" d="${esc(track.d)}" />
              <path class="ttel__done" d="${esc(track.d)}" />
              <g class="ttel__marks">
                ${crit.map((s) => `
                  <g class="ttel__mark" data-id="${esc(s.id)}" tabindex="0" role="button" aria-label="Ir a ${esc(s.cornerName)}">
                    <circle class="ttel__mark-hit" r="22" /><circle class="ttel__mark-dot" r="6.5" /><text>${esc(s.cornerName)}</text>
                  </g>`).join("")}
              </g>
              <g class="ttel__start" aria-hidden="true"><line /><text>${open ? "" : "SALIDA"}</text></g>
              ${open ? `<g class="ttel__start ttel__finish" aria-hidden="true"><line /><text></text></g>` : ""}
              <g class="ttel__cursor" aria-hidden="true"><circle class="ttel__cursor-glow" r="20" /><circle class="ttel__cursor-dot" r="8" /></g>
            </svg>
            ${track.source ? `<small class="ttel__src">${esc(track.source)}</small>` : ""}
          </figure>

          <div class="ttel__dash" aria-live="off">
            <div class="ttel__cell ttel__speed">
              <span class="ttel__label">Velocidad</span>
              <p class="ttel__big"><b data-k="speed">0</b><small>km/h</small></p>
              <span class="ttel__bar"><i data-k="speedBar"></i></span>
            </div>
            <div class="ttel__cell ttel__gear">
              <span class="ttel__label">Marcha</span>
              <p class="ttel__gear-n" data-k="gear">–</p>
            </div>
            <div class="ttel__cell ttel__rpm">
              <span class="ttel__label">Régimen</span>
              <svg viewBox="0 0 200 170" aria-hidden="true">
                <path class="ttel__arc-bg" d="${ARC}" pathLength="100" />
                <path class="ttel__arc-red" d="${ARC}" pathLength="100" />
                <path class="ttel__arc" d="${ARC}" pathLength="100" />
              </svg>
              <p class="ttel__rpm-n"><b data-k="rpm">0</b><small>rpm</small></p>
            </div>
            <div class="ttel__cell ttel__g">
              <span class="ttel__label">Fuerzas G</span>
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <circle class="ttel__g-ring" cx="100" cy="100" r="40" /><circle class="ttel__g-ring" cx="100" cy="100" r="80" />
                <path class="ttel__g-axis" d="M100 10 V190 M10 100 H190" />
                <text x="100" y="8" class="ttel__g-tag">FRENO</text><text x="100" y="199" class="ttel__g-tag">GAS</text>
                <text x="146" y="96" class="ttel__g-tag">1G</text><text x="186" y="96" class="ttel__g-tag">2G</text>
                <line class="ttel__g-vec" x1="100" y1="100" x2="100" y2="100" />
                <circle class="ttel__g-dot" cx="100" cy="100" r="7" />
              </svg>
              <p class="ttel__g-n"><span>Lat. <b data-k="lat">0,0</b></span><span>Long. <b data-k="lon">0,0</b></span></p>
            </div>
            <div class="ttel__cell ttel__pedals">
              <span class="ttel__label">Pedales</span>
              <div class="ttel__pedal ttel__pedal--thr"><span class="ttel__vbar"><i data-k="thrBar"></i></span><b data-k="thr">0</b><small>% gas</small></div>
              <div class="ttel__pedal ttel__pedal--brk"><span class="ttel__vbar"><i data-k="brkBar"></i></span><b data-k="brk">0</b><small>bar</small></div>
            </div>
            ${alt ? `
            <div class="ttel__cell ttel__alt">
              <span class="ttel__label">Altitud</span>
              <p class="ttel__alt-n"><b data-k="alt">0</b><small>m</small></p>
              <svg class="ttel__profile" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true">
                <path class="ttel__profile-area" /><path class="ttel__profile-line" /><line class="ttel__profile-now" y1="0" y2="60" />
              </svg>
            </div>` : ""}
          </div>

          <div class="ttel__scrub">
            <button type="button" class="ttel__play" aria-pressed="false"><span class="ttel__play-ico" aria-hidden="true"></span><span class="ttel__play-txt">Reproducir ${open ? "subida" : "vuelta"}</span></button>
            <label class="sr" for="${c.id}-pos">Posición en ${open ? "el recorrido" : "la vuelta"}</label>
            <input id="${c.id}-pos" class="ttel__range" type="range" min="0" max="100" step="0.05" value="0" />
            <p class="ttel__time"><span class="ttel__label">Tiempo</span><b data-k="time">0:00</b></p>
          </div>

          <article class="ttel__vertex" aria-live="polite">
            <span class="ttel__vtag" data-k="vtag">Vértice</span>
            <h3 data-k="vname"></h3>
            <p data-k="vnote"></p>
          </article>
        </div>
        ${c.note ? `<p class="ttel__note">${c.note}</p>` : ""}
      </section>`;
    },

    mount(el, c, ctx) {
      const track = trackOf(c, ctx);
      if (!track) return;
      const L = track.lengthKm, open = track.closed === false;
      const samples = [...c.samples].sort((a, b) => a.distancePercentage - b.distancePercentage);
      const crit = samples.filter((s) => s.note);
      const k = (key) => $(`[data-k="${key}"]`, el);
      const out = Object.fromEntries(["speed", "speedBar", "gear", "rpm", "lat", "lon", "thr", "thrBar", "brk", "brkBar", "time", "vtag", "vname", "vnote", "alt"].map((n) => [n, k(n)]));
      const svg = $(".ttel__svg", el), range = $(".ttel__range", el), play = $(".ttel__play", el);
      const cursor = $(".ttel__cursor", el), done = $(".ttel__done", el);
      const arc = $(".ttel__arc", el), gDot = $(".ttel__g-dot", el), gVec = $(".ttel__g-vec", el), kmOut = $(".ttel__km b", el);
      const maxSpeed = Math.max(...samples.map((s) => s.speedKmh));
      const maxRpm = Math.ceil(Math.max(...samples.map((s) => s.rpm)) / 1000) * 1000 + 500;
      const maxBrake = Math.max(120, ...samples.map((s) => s.brakePressureBar));

      /* ---- Trazado a escala: el % de vuelta es el % de su longitud ---- */
      const path = $(".ttel__track", el);
      const total = path.getTotalLength();
      done.style.strokeDasharray = `0 ${total + 1}`;
      const lenAt = (pct) => (clamp(pct, 0, 100) / 100) * total;
      const pointAt = (pct) => path.getPointAtLength(open ? lenAt(pct) : lenAt(pct) % total);

      /* ---- Hitos y salida ---- */
      const box = svg.viewBox.baseVal, cx = box.x + box.width / 2, cy = box.y + box.height / 2;
      const ls = Math.max(1, box.width / 1200);          // un plano más ancho necesita rótulos y marcas mayores
      svg.style.setProperty("--ls", ls.toFixed(2));
      $$(".ttel__mark", el).forEach((g) => {
        const s = crit.find((x) => x.id === g.dataset.id);
        const p = pointAt(s.distancePercentage);
        g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${ls.toFixed(2)})`);
        // la etiqueta, hacia fuera del circuito (o hacia donde diga "label": n · s · e · w)
        const fixed = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] }[s.label];
        const dx = fixed ? fixed[0] : p.x - cx, dy = fixed ? fixed[1] : p.y - cy, n = Math.hypot(dx, dy) || 1;
        const t = $("text", g);
        t.setAttribute("x", ((dx / n) * 28).toFixed(1));
        t.setAttribute("y", ((dy / n) * 28 + 7).toFixed(1));
        t.setAttribute("text-anchor", Math.abs(dx / n) < 0.35 ? "middle" : dx > 0 ? "start" : "end");
      });
      {
        const p0 = pointAt(0), p1 = pointAt(0.4), a = Math.atan2(p1.y - p0.y, p1.x - p0.x) + Math.PI / 2;
        const ln = $(".ttel__start line", el), tx = $(".ttel__start text", el);
        ln.setAttribute("x1", (p0.x + Math.cos(a) * 18 * ls).toFixed(1)); ln.setAttribute("y1", (p0.y + Math.sin(a) * 18 * ls).toFixed(1));
        ln.setAttribute("x2", (p0.x - Math.cos(a) * 18 * ls).toFixed(1)); ln.setAttribute("y2", (p0.y - Math.sin(a) * 18 * ls).toFixed(1));
        tx.setAttribute("x", (p0.x + Math.cos(a) * 34).toFixed(1)); tx.setAttribute("y", (p0.y + Math.sin(a) * 34 + 6).toFixed(1));
      }
      if (open) {                                     // línea de meta, perpendicular al final del trazado
        const p0 = pointAt(100), p1 = pointAt(99.6), a = Math.atan2(p0.y - p1.y, p0.x - p1.x) + Math.PI / 2;
        const ln = $(".ttel__finish line", el), tx = $(".ttel__finish text", el);
        ln.setAttribute("x1", (p0.x + Math.cos(a) * 18 * ls).toFixed(1)); ln.setAttribute("y1", (p0.y + Math.sin(a) * 18 * ls).toFixed(1));
        ln.setAttribute("x2", (p0.x - Math.cos(a) * 18 * ls).toFixed(1)); ln.setAttribute("y2", (p0.y - Math.sin(a) * 18 * ls).toFixed(1));
        tx.setAttribute("x", (p0.x + Math.cos(a) * 34).toFixed(1)); tx.setAttribute("y", (p0.y + Math.sin(a) * 34 + 6).toFixed(1));
      }

      /* ---- Telemetría interpolada ---- */
      // En un circuito, la última muestra enlaza con la primera; en una subida, no
      const ring = open ? samples : [...samples, { ...samples[0], distancePercentage: samples[0].distancePercentage + 100 }];
      const at = (pct) => {
        let i = 0;
        while (i < ring.length - 2 && ring[i + 1].distancePercentage <= pct) i++;
        const a = ring[i], b = ring[i + 1];
        const t = clamp((pct - a.distancePercentage) / (b.distancePercentage - a.distancePercentage || 1), 0, 1);
        const mix = (key) => a[key] + (b[key] - a[key]) * t;
        const near = t < 0.5 ? a : b;
        return {
          speed: mix("speedKmh"), rpm: mix("rpm"), lat: mix("lateralG"), lon: mix("longitudinalG"),
          thr: mix("throttlePercentage"), brk: mix("brakePressureBar"), gear: near.gear,
          alt: a.altitudeM != null ? mix("altitudeM") : null,
        };
      };

      // Tiempo de vuelta estimado: se integra distancia / velocidad (cada 0,05 %)
      const STEP = 0.05, times = [0];
      for (let p = STEP; p <= 100 + 1e-9; p += STEP) {
        const v = Math.max(1, ((at(p - STEP).speed + at(p).speed) / 2) / 3.6);   // salida parada: sin dividir por cero
        times.push(times[times.length - 1] + ((STEP / 100) * L * 1000) / v);
      }
      const timed = samples.every((x) => x.timeS != null);
      const timeAt = (pct) => {
        if (!timed) return times[Math.round(clamp(pct, 0, 100) / STEP)];
        let i = 0;
        while (i < samples.length - 2 && samples[i + 1].distancePercentage <= pct) i++;
        const a = samples[i], b = samples[i + 1] || a;
        const t = clamp((pct - a.distancePercentage) / (b.distancePercentage - a.distancePercentage || 1), 0, 1);
        return a.timeS + (b.timeS - a.timeS) * t;
      };

      // Curva crítica en la que está el cursor (± 1,8 % de vuelta) o la próxima
      const vertexAt = (pct) => {
        const here = crit.find((s) => Math.abs(s.distancePercentage - pct) <= 1.8);
        if (here) return { s: here, here: true };
        return { s: crit.find((s) => s.distancePercentage > pct) || (open ? crit[crit.length - 1] : crit[0]), here: false };
      };

      // Perfil de altitud (sólo si las muestras la traen): área, línea y marca de posición
      const prof = $(".ttel__profile", el);
      let profNow = null;
      if (prof) {
        const alts = samples.map((s) => s.altitudeM), lo = Math.min(...alts), hi = Math.max(...alts);
        const pts = samples.map((s) => `${(s.distancePercentage * 3).toFixed(1)} ${(56 - ((s.altitudeM - lo) / (hi - lo || 1)) * 52).toFixed(1)}`);
        $(".ttel__profile-line", prof).setAttribute("d", `M${pts.join("L")}`);
        $(".ttel__profile-area", prof).setAttribute("d", `M0 60L${pts.join("L")}L300 60Z`);
        profNow = $(".ttel__profile-now", prof);
      }

      let pos = 0, shown = null;
      const paint = (pct) => {
        pos = pct;
        const p = pointAt(pct), len = lenAt(pct), t = at(pct);
        cursor.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${ls.toFixed(2)})`);
        done.style.strokeDasharray = `${len.toFixed(1)} ${(total + 1).toFixed(1)}`;
        kmOut.textContent = fmt((pct / 100) * L, 2);

        out.speed.textContent = fmt(Math.round(t.speed));
        out.speedBar.style.transform = `scaleX(${(t.speed / maxSpeed).toFixed(3)})`;
        out.gear.textContent = t.gear;
        out.rpm.textContent = fmt(Math.round(t.rpm / 50) * 50);
        arc.style.strokeDashoffset = (100 - (t.rpm / maxRpm) * 100).toFixed(2);
        const gx = 100 + clamp(t.lat, -2.4, 2.4) * 40, gy = 100 + clamp(t.lon, -2.4, 2.4) * 40;
        gDot.setAttribute("cx", gx.toFixed(1)); gDot.setAttribute("cy", gy.toFixed(1));
        gVec.setAttribute("x2", gx.toFixed(1)); gVec.setAttribute("y2", gy.toFixed(1));
        out.lat.textContent = fmt(Math.abs(t.lat), 1) + (Math.abs(t.lat) < 0.05 ? "" : t.lat > 0 ? " der." : " izq.");
        out.lon.textContent = fmt(t.lon, 1);
        out.thr.textContent = fmt(Math.round(t.thr));
        out.thrBar.style.transform = `scaleY(${(t.thr / 100).toFixed(3)})`;
        out.brk.textContent = fmt(Math.round(t.brk));
        out.brkBar.style.transform = `scaleY(${(t.brk / maxBrake).toFixed(3)})`;
        out.time.textContent = mmss(timeAt(pct));
        if (out.alt && t.alt != null) { out.alt.textContent = fmt(Math.round(t.alt)); profNow.setAttribute("x1", (pct * 3).toFixed(1)); profNow.setAttribute("x2", (pct * 3).toFixed(1)); }
        range.setAttribute("aria-valuetext", `${fmt((pct / 100) * L, 1)} km · ${Math.round(t.speed)} km/h en ${t.gear}.ª${t.alt != null ? ` · ${fmt(Math.round(t.alt))} m` : ""}`);

        const v = vertexAt(pct), key = `${v.s.id}:${v.here}`;
        if (key !== shown) {
          shown = key;
          out.vtag.textContent = v.here ? `Vértice · km ${fmt((v.s.distancePercentage / 100) * L, 1)}` : `Próximo vértice · km ${fmt((v.s.distancePercentage / 100) * L, 1)}`;
          out.vname.textContent = v.s.cornerName;
          out.vnote.innerHTML = v.s.note;
          el.querySelector(".ttel__vertex").classList.toggle("is-here", v.here);
          $$(".ttel__mark", el).forEach((g) => g.classList.toggle("is-on", v.here && g.dataset.id === v.s.id));
        }
      };

      /* ---- Animación: reproducir la vuelta y saltar a un hito ---- */
      let raf = 0;
      const stop = () => {
        cancelAnimationFrame(raf); raf = 0;
        play.setAttribute("aria-pressed", "false");
        $(".ttel__play-txt", play).textContent = `Reproducir ${open ? "subida" : "vuelta"}`;
      };
      const tween = (to, ms) => {
        stop();
        if (reduceMotion) { range.value = to; paint(to); return; }
        const from = pos, t0 = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - t, 3);
          const v = from + (to - from) * e;
          range.value = v; paint(v);
          if (t < 1) raf = requestAnimationFrame(step); else raf = 0;
        };
        raf = requestAnimationFrame(step);
      };
      const lapMs = (c.lap?.seconds || 40) * 1000;
      play.addEventListener("click", () => {
        if (raf && play.getAttribute("aria-pressed") === "true") return stop();
        stop();
        if (pos >= 99.9) { pos = 0; }
        play.setAttribute("aria-pressed", "true");
        $(".ttel__play-txt", play).textContent = "Pausa";
        let last = performance.now();
        const step = (now) => {
          const v = Math.min(100, pos + ((now - last) / lapMs) * 100);
          last = now;
          range.value = v; paint(v);
          if (v < 100) raf = requestAnimationFrame(step); else stop();
        };
        raf = requestAnimationFrame(step);
      });
      range.addEventListener("input", () => { stop(); paint(+range.value); });
      $$(".ttel__mark", el).forEach((g) => {
        const go = () => tween(crit.find((s) => s.id === g.dataset.id).distancePercentage, 700);
        g.addEventListener("click", go);
        g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } });
      });
      // Si la sección sale de la pantalla, la vuelta se pausa
      new IntersectionObserver(([e]) => { if (!e.isIntersecting && raf) stop(); }).observe(el);

      paint(0);
    },
  });
})();
