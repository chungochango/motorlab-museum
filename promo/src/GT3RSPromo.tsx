import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";
import { Alert, bouncy, Carbon, clamp, FADE, Flash, Grain, HEAVY, rgba, Scene, shake, slam, tag, thousands, Words, XFADE } from "./retention/kit";

/* =========================================================
   PORSCHE 911 GT3 RS (992) · vídeo de retención de 30 s
   1080 × 1920, 30 fps · Sala 05 de MotorLab Museum
   ---------------------------------------------------------
     0–5 s    gancho aerodinámico: "el coche de calle que humilla…"
     5–11 s   DRS y aerodinámica activa: alerón y aletas cambian de ángulo
     11–18 s  telemetría del bóxer atmosférico: 525 CV, 9.000 rpm, 1.450 kg
     18–25 s  cifras de circuito: 0-100, vel. máx., fuerza lateral, Nordschleife
     25–30 s  llamada a la acción; desde 28,5 s, imagen fija
   Cifras oficiales de Porsche (data/cars.json: porsche-gt3-rs).
   ========================================================= */
export const GT3RS = { fps: 30, width: 1080, height: 1920, durationInFrames: 900 };

const Y = "255, 212, 0";                  // amarillo racing (acento)
const R = "225, 30, 20";                  // rojo motorsport (zona roja, avisos)
const CUTS = [150, 330, 540, 750];
const STILL_FROM = 855;
const IMPACTS: [number, number][] = [
  [2, 30], [6, 16], [10, 18], [14, 22], [60, 26],
  ...CUTS.map((c): [number, number] => [c, 30]),
  [245, 16], [295, 14], [354, 14], [378, 14], [460, 26], [570, 14], [600, 14],
];

/* =========================================================
   ESCENA 1 · Gancho aerodinámico (0–5 s)
   ========================================================= */
const HOOK = ["EL COCHE", "DE CALLE QUE", "HUMILLA A LOS", "DE CARRERAS 🤫"];
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = interpolate(f, [58, 68], [0, 1], clamp);
  const blur = interpolate(f, [56, 61, 70], [0, 14, 0], clamp);
  const sweep = interpolate(f, [56, 72], [-30, 130], clamp);
  const hud = interpolate(f, [56, 72], [0, 1], clamp);
  const blink = f < 90 ? (Math.floor(f / 3) % 2 ? 1 : 0.3) : 0.8;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: -110, right: -110, top: 700, height: 867, filter: `blur(${blur}px)` }}>
        <div style={{ position: "absolute", left: "10%", right: "10%", top: "50%", height: "22%", opacity: on, mixBlendMode: "screen", background: `radial-gradient(ellipse 50% 55% at 50% 50%, ${rgba(Y, 0.3)}, ${rgba(Y, 0)} 72%)` }} />
        <Img src={staticFile("img/gt3rs-perfil-hd.jpg")} style={{ ...FADE, width: "100%", height: "100%", objectFit: "contain", filter: `brightness(${0.2 + on * 0.85}) saturate(${0.4 + on * 0.7})` }} />
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `linear-gradient(100deg, rgba(255,240,180,0) ${sweep - 10}%, rgba(255,240,180,0.45) ${sweep}%, rgba(255,240,180,0) ${sweep + 10}%)` }} />
      </div>

      {/* HUD de circuito (trazado tipo Nordschleife estilizado) */}
      <svg viewBox="0 0 1080 700" style={{ position: "absolute", left: 0, top: 760, width: 1080, height: 700, opacity: hud * blink }}>
        <path
          d="M120 470 C 110 380, 190 330, 280 360 L 430 410 C 500 432, 540 380, 600 330 C 680 262, 820 250, 900 320 C 960 372, 950 470, 870 500 L 700 540 C 620 560, 600 610, 520 600 L 250 570 C 170 560, 128 530, 120 470 Z"
          fill="none" stroke={rgba(Y)} strokeWidth="3" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - hud}
        />
        {[[60, 40], [1020, 40], [60, 660], [1020, 660]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y + (y < 300 ? 50 : -50)} V${y} H${x + (x < 500 ? 50 : -50)}`} fill="none" stroke={rgba(Y)} strokeWidth="3" />
        ))}
        <text x="80" y="30" fill={rgba(Y)} style={{ fontFamily: HEAVY, fontSize: 26, fontWeight: 700, letterSpacing: "0.2em" }}>HUD · TRACK MODE</text>
      </svg>

      <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
        {HOOK.map((line, i) => {
          const at = 2 + i * 4;
          const s = spring({ frame: f - at, fps, config: slam });
          const jit = f - at < 8 && f >= at ? (random(`j${i}-${f}`) - 0.5) * 14 : 0;
          return (
            <div key={line} style={{ fontSize: 112, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.035em", whiteSpace: "nowrap", color: i === 2 ? rgba(Y) : C.white, opacity: f >= at ? 1 : 0, transform: `translate(${jit}px, ${jit * 0.6}px) scale(${interpolate(s, [0, 1], [2.3, 1])})`, transformOrigin: "0% 50%" }}>
              {line}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 80, right: 80, top: 1500 }}>
        <Words text="860 kg de carga aerodinámica a 285 km/h." at={76} every={3} size={60} hot={["860", "kg", "285", "km/h."]} accent={rgba(Y)} />
        <Words text="Un coche de carreras matriculable." at={104} every={3} size={60} weight={300} accent={rgba(Y)} style={{ marginTop: 22 }} />
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 2 · DRS y aerodinámica activa (5–11 s)
   ========================================================= */
const Drs: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Ángulo del flap: cerrado (carga máxima) → abierto con el DRS → cerrado de nuevo
  const flap = interpolate(f, [0, 20, 92, 102, 140, 150], [8, 26, 26, 2, 2, 26], clamp);
  const open = interpolate(flap, [2, 26], [1, 0]);
  const load = interpolate(f, [20, 80], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const kg = spring({ frame: f - 80, fps, config: bouncy });
  const title = (i: number) => spring({ frame: f - (2 + i * 5), fps, config: slam });
  const drsTag = spring({ frame: f - 95, fps, config: bouncy });
  const closeTag = spring({ frame: f - 145, fps, config: bouncy });

  // Esquema lateral del alerón (lienzo 1080 × 760): plano principal fijo y flap DRS que pivota
  const px = 640, py = 300;               // pivote del flap
  const lines = Array.from({ length: 7 }, (_, i) => 150 + i * 70);

  return (
    <AbsoluteFill>
      <Img src={staticFile("img/gt3rs-despiece-aleron.jpg")} style={{ ...FADE, position: "absolute", left: -60, top: 480, width: 1200, opacity: 0.22 }} />

      <div style={{ position: "absolute", left: 70, top: 150 }}>
        {["SISTEMA DRS", "ACTIVADO 🏁"].map((t, i) => (
          <div key={t} style={{ fontSize: 120, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.035em", color: i ? rgba(Y) : C.white, opacity: f >= 2 + i * 5 ? 1 : 0, transform: `scale(${interpolate(title(i), [0, 1], [2.2, 1])})`, transformOrigin: "0 50%" }}>{t}</div>
        ))}
      </div>

      <svg viewBox="0 0 1080 760" style={{ position: "absolute", left: 0, top: 470, width: 1080, height: 760 }}>
        {/* Líneas de corriente: con el flap cerrado se desvían hacia arriba (empujan el coche hacia abajo) */}
        {lines.map((y, i) => {
          const bend = (1 - open) * (i < 4 ? -150 + i * 30 : -40);
          return (
            <path key={i} d={`M0 ${y} L520 ${y} Q 760 ${y} 1080 ${y + bend}`} fill="none" stroke={rgba("255,255,255", 0.28)} strokeWidth="2.5" strokeDasharray="26 22" strokeDashoffset={-f * 9} />
          );
        })}
        {/* Plano principal */}
        <path d="M330 330 C 420 300, 560 296, 640 312 C 560 322, 430 336, 330 344 Z" fill={C.white} />
        {/* Flap DRS */}
        <g transform={`rotate(${-flap} ${px} ${py})`}>
          <path d={`M${px} ${py} C ${px + 70} ${py - 14}, ${px + 160} ${py - 12}, ${px + 210} ${py - 2} C ${px + 150} ${py + 6}, ${px + 70} ${py + 10}, ${px} ${py + 10} Z`} fill={rgba(Y)} />
        </g>
        <circle cx={px} cy={py + 4} r="8" fill="#000" stroke={rgba(Y)} strokeWidth="3" />
        {/* Placa lateral y soportes cuello de cisne */}
        <path d="M300 240 L320 420 L880 420 L900 200" fill="none" stroke={rgba("255,255,255", 0.35)} strokeWidth="3" />
        <path d="M470 330 C 470 420, 520 470, 560 560 M690 300 C 690 400, 740 470, 780 560" fill="none" stroke={rgba("255,255,255", 0.6)} strokeWidth="6" strokeLinecap="round" />
        <text x="900" y="470" textAnchor="end" fill={rgba(Y)} style={{ fontFamily: HEAVY, fontSize: 30, fontWeight: 800, letterSpacing: "0.1em" }}>FLAP {Math.round(flap)}°</text>

        {/* Aletas delanteras activas */}
        <g transform="translate(80 600)">
          <text x="0" y="0" fill={C.platinum} style={{ fontFamily: HEAVY, fontSize: 24, fontWeight: 700, letterSpacing: "0.18em" }}>ALETAS DELANTERAS</text>
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${30 + k * 150} 70) rotate(${-flap * 0.8} 0 0)`}>
              <rect x="-50" y="-7" width="120" height="14" rx="7" fill={k ? rgba(Y) : C.white} />
            </g>
          ))}
        </g>
      </svg>

      {/* Avisos DRS */}
      {[
        { s: drsTag, show: f >= 95 && f < 145, text: "DRS ABIERTO · MENOS RESISTENCIA", c: Y },
        { s: closeTag, show: f >= 145, text: "DRS CERRADO · CARGA MÁXIMA", c: R },
      ].map((a) =>
        a.show ? (
          <div key={a.text} style={{ position: "absolute", left: 70, top: 1290, display: "flex", alignItems: "center", gap: 20, padding: "16px 26px 16px 20px", background: "rgba(10,10,12,0.92)", border: `2px solid ${rgba(a.c)}`, borderRadius: 6, transform: `translateX(${(1 - a.s) * -240}px) scale(${0.7 + 0.3 * a.s})`, transformOrigin: "0 50%" }}>
            <Alert color={rgba(a.c)} />
            <span style={{ ...tag, fontSize: 34, letterSpacing: "0.08em" }}>{a.text}</span>
          </div>
        ) : null,
      )}

      {/* Barra de carga aerodinámica */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1460 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ ...tag, fontSize: 32, color: C.platinum }}>Downforce</span>
          <span style={{ fontSize: 110, fontWeight: 900, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", transform: `scale(${0.85 + 0.15 * kg})`, transformOrigin: "100% 50%", display: "inline-block" }}>
            {thousands(load * 860)}<span style={{ fontSize: 44, color: rgba(Y) }}> kg</span>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 6, height: 54, marginTop: 10 }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} style={{ background: i / 24 < load ? rgba(i > 20 ? R : Y, open > 0.5 ? 0.35 : 1) : "rgba(255,255,255,0.08)", transform: "skewX(-14deg)", borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 28, color: C.grey }}>a 285 km/h · alerón con DRS de serie</div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 3 · Telemetría del bóxer atmosférico (11–18 s)
   ========================================================= */
const Band: React.FC<{ top: number; at: number; children: React.ReactNode }> = ({ top, at, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f, [at, at + 4], [1.18, 1], clamp);
  const flash = interpolate(f, [at, at + 5], [0.7, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, height: 560, overflow: "hidden", borderTop: `2px solid ${rgba(Y, 0.7)}`, transform: `scale(${s})` }}>
      <div style={{ position: "absolute", inset: 0, padding: "50px 70px" }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,248,220,${flash})`, pointerEvents: "none" }} />
    </div>
  );
};

const Engine: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const despiece = f >= 130;

  // Banda 1 · potencia
  const cvScr = f >= 4 && f < 16;
  const cv = cvScr ? Math.floor(random(`cv${f}`) * 900) : Math.round(interpolate(f, [16, 26], [480, 525], clamp));
  const cvLand = spring({ frame: f - 26, fps, config: bouncy });
  // Banda 2 · régimen hasta el corte
  const g = f - 24;
  const rpm = interpolate(g, [4, 40], [800, 9000], { ...clamp, easing: (t) => t * t * t * 0.55 + t * 0.45 });
  const limiter = g >= 40;
  const flashLim = limiter && Math.floor(g / 2) % 2 === 0;
  const LEDS = 12;
  // Banda 3 · peso
  const h = f - 48;
  const kg = interpolate(h, [4, 22], [0, 1450], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const ratio = spring({ frame: h - 26, fps, config: bouncy });

  if (despiece) {
    const d = f - 130;
    const zoom = interpolate(d, [0, 80], [1, 1.5], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
    const pts = [
      { x: 50, y: 58, text: "525 CV · 8.500 rpm", at: 8 },
      { x: 26, y: 24, text: "465 Nm · 6.300 rpm", at: 20 },
      { x: 60, y: 26, text: "3.996 cc", at: 32 },
    ];
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left: -140, top: 520, width: 1360, height: 907, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
          <Img src={staticFile("img/gt3rs-despiece-motor.jpg")} style={{ ...FADE, width: "100%", height: "100%" }} />
          {pts.map((p) => {
            const s = spring({ frame: d - p.at, fps, config: bouncy });
            const blink = Math.floor(d / 3) % 2 ? 1 : 0.35;
            return (
              <div key={p.text} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: `scale(${s / zoom})`, opacity: d >= p.at ? 1 : 0 }}>
                <div style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: "50%", border: `3px solid ${rgba(Y)}`, background: "rgba(0,0,0,0.6)" }}>
                  <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: rgba(Y, blink) }} />
                </div>
                <div style={{ position: "absolute", left: 36, top: -34, whiteSpace: "nowrap", padding: "10px 18px", background: "rgba(0,0,0,0.88)", border: `2px solid ${rgba(Y)}`, borderRadius: 4, fontSize: 38, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{p.text}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 70, top: 170 }}>
          <div style={{ ...tag, fontSize: 30, color: rgba(Y) }}>Despiece técnico</div>
          <Words text="4.0 bóxer. Sin turbo. Sin híbrido." at={4} every={4} size={96} weight={900} hot={["turbo.", "híbrido."]} accent={rgba(Y)} style={{ marginTop: 18 }} />
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <Band top={70} at={0}>
        <div style={{ ...tag, fontSize: 32, color: rgba(Y) }}>4.0 bóxer atmosférico</div>
        <div style={{ marginTop: 20, fontSize: 250, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: cvScr ? rgba(Y) : C.white, transform: `scale(${cvScr ? 1 + (random(`s${f}`) - 0.5) * 0.05 : 0.85 + 0.15 * cvLand})`, transformOrigin: "0 50%" }}>
          {cv}<span style={{ fontSize: 90, color: rgba(Y) }}> CV</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 32, color: C.grey }}>a 8.500 rpm, sin turbo</div>
      </Band>

      <Band top={660} at={24}>
        <div style={{ ...tag, fontSize: 32, color: C.platinum }}>Corte de inyección</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${LEDS}, 1fr)`, gap: 10, marginTop: 26 }}>
          {Array.from({ length: LEDS }, (_, i) => {
            const lit = rpm >= 3000 + (i / LEDS) * 6000;
            const col = i < 4 ? "0, 230, 118" : i < 8 ? Y : R;
            return <div key={i} style={{ height: 34, borderRadius: 17, background: limiter ? (flashLim ? "rgba(90,170,255,1)" : "rgba(90,170,255,0.25)") : lit ? rgba(col) : "rgba(255,255,255,0.08)" }} />;
          })}
        </div>
        <div style={{ marginTop: 22, fontSize: 210, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: limiter ? `translate(${(random(`l${f}`) - 0.5) * 10}px, 0)` : undefined, color: limiter ? rgba(R) : C.white }}>
          {thousands(Math.round(rpm / 50) * 50)}<span style={{ fontSize: 70, color: rgba(Y) }}> rpm</span>
        </div>
      </Band>

      <Band top={1250} at={48}>
        <Img src={staticFile("img/gt3rs-despiece-suspension.jpg")} style={{ ...FADE, position: "absolute", right: -200, top: -20, width: 760, opacity: 0.3 }} />
        <div style={{ ...tag, fontSize: 32, color: C.platinum }}>Peso</div>
        <div style={{ marginTop: 20, fontSize: 200, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {thousands(kg)}<span style={{ fontSize: 70, color: rgba(Y) }}> kg</span>
        </div>
        <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 18, padding: "12px 22px", border: `2px solid ${rgba(Y)}`, borderRadius: 6, opacity: h >= 26 ? 1 : 0, transform: `scale(${0.6 + 0.4 * ratio})`, transformOrigin: "0 50%" }}>
          <span style={{ fontSize: 52, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>2,76 kg/CV</span>
          <span style={{ ...tag, fontSize: 22, color: C.grey }}>DIN · Weissach</span>
        </div>
      </Band>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 4 · Cifras de circuito (18–25 s)
   ========================================================= */
const Track: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jit = (k: number) => `translate(${(random(`tx${f}`) - 0.5) * k}px, ${(random(`ty${f}`) - 0.5) * k}px)`;
  const t100 = interpolate(f, [12, 30], [0, 3.2], clamp);
  const vmax = interpolate(f, [12, 52], [0, 296], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const l1 = spring({ frame: f - 30, fps, config: bouncy });
  const l2 = spring({ frame: f - 52, fps, config: bouncy });

  // Diagrama G-G: el punto recorre una vuelta (frenada, apoyo en curva, tracción) y deja estela
  const gg = (k: number) => ({ x: Math.sin(k / 9) * 0.9 * Math.cos(k / 23), y: Math.cos(k / 7) * 0.55 });
  const CX = 300, CY = 1230, RR = 200;
  const trail = Array.from({ length: 14 }, (_, i) => gg(f - i * 1.2));

  // Vuelta oficial al Nordschleife: 6:49.328
  const lap = interpolate(f, [60, 150], [0, 409.328], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2.4) });
  const lapLand = spring({ frame: f - 150, fps, config: bouncy });
  // En milésimas enteras (la coma flotante dejaría 6:49.327); al llegar, el tiempo oficial exacto
  const ms = f >= 150 ? 409328 : Math.round(lap * 1000);
  const lapTxt = `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, top: 140, textAlign: "center", fontSize: 76, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", color: rgba(Y), transform: jit(5) }}>
        CREADO PARA<br />DESTROZAR TIEMPOS<br />EN NÜRBURGRING
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 450, display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${rgba(Y, 0.5)}`, borderBottom: `1px solid ${rgba(Y, 0.5)}` }}>
        <div style={{ padding: "34px 0 28px" }}>
          <div style={{ ...tag, fontSize: 30, color: C.platinum }}>0 – 100 km/h</div>
          <div style={{ marginTop: 12, fontSize: 160, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: `scale(${f >= 30 ? 0.9 + 0.1 * l1 : 1})`, transformOrigin: "0 50%" }}>
            {t100.toFixed(1).replace(".", ",")}<span style={{ fontSize: 60, color: rgba(Y) }}>s</span>
          </div>
        </div>
        <div style={{ padding: "34px 0 28px 36px", borderLeft: `2px solid ${rgba(Y)}` }}>
          <div style={{ ...tag, fontSize: 30, color: C.platinum }}>Vel. máx.</div>
          <div style={{ marginTop: 12, fontSize: 160, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: `scale(${f >= 52 ? 0.9 + 0.1 * l2 : 1})`, transformOrigin: "0 50%" }}>
            {Math.round(vmax)}<span style={{ fontSize: 46, color: rgba(Y) }}> km/h</span>
          </div>
        </div>
      </div>

      {/* Fuerza lateral: diagrama G-G */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {[1, 0.66, 0.33].map((k) => <circle key={k} cx={CX} cy={CY} r={RR * k} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />)}
        <line x1={CX - RR} y1={CY} x2={CX + RR} y2={CY} stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
        <line x1={CX} y1={CY - RR} x2={CX} y2={CY + RR} stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
        {trail.map((p, i) => <circle key={i} cx={CX + p.x * RR} cy={CY + p.y * RR} r={14 - i * 0.8} fill={rgba(i ? Y : R, 1 - i / 14)} />)}
        {[["FRENADA", CX, CY - RR - 18], ["TRACCIÓN", CX, CY + RR + 40]].map(([t, x, y]) => (
          <text key={t as string} x={x as number} y={y as number} textAnchor="middle" fill={C.grey} style={{ fontFamily: HEAVY, fontSize: 22, fontWeight: 700, letterSpacing: "0.18em" }}>{t}</text>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 560, right: 60, top: 1080 }}>
        <div style={{ ...tag, fontSize: 30, color: rgba(Y) }}>Fuerza lateral</div>
        <div style={{ marginTop: 14, fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }}>en curva,<br />a fondo</div>
        <div style={{ marginTop: 18, fontSize: 28, color: C.grey, lineHeight: 1.35 }}>860 kg de carga apoyan el coche en el asfalto</div>
      </div>

      {/* Vuelta al Nordschleife */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1560, borderTop: `2px solid ${rgba(Y)}`, paddingTop: 22 }}>
        <div style={{ ...tag, fontSize: 30, color: C.platinum }}>Nordschleife · 20,8 km</div>
        <div style={{ marginTop: 8, fontSize: 140, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: f >= 150 ? rgba(Y) : C.white, transform: `scale(${f >= 150 ? 0.9 + 0.1 * lapLand : 1})`, transformOrigin: "0 50%" }}>
          {lapTxt}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 5 · Llamada a la acción (25–30 s)
   ========================================================= */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ignite = interpolate(f, [0, 3, 12], [0, 2.4, 1], clamp);
  const sweep = interpolate(f, [2, 16], [-30, 130], clamp);
  const btn = spring({ frame: f - 30, fps, config: bouncy });
  const a = (d: number) => interpolate(f, [d, d + 8], [0, 1], clamp);
  const pulse = f < 105 ? 0.75 + 0.25 * Math.sin(f / 3) : 1;          // late hasta 28,5 s; después, fijo

  return (
    <AbsoluteFill style={{ alignItems: "center", textAlign: "center" }}>
      <div style={{ position: "relative", marginTop: 150, width: 360, height: 360, filter: `brightness(${ignite})`, WebkitMaskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)" }}>
        <Img src={staticFile("img/logo.png")} style={{ width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.8) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)` }} />
      </div>

      <div style={{ marginTop: 50, width: 940 }}>
        <Words text="¿Te atreves a rodar al límite a 9.000 rpm?" at={8} every={3} size={88} weight={900} hot={["9.000", "rpm?"]} accent={rgba(Y)} style={{ justifyContent: "center" }} />
      </div>

      <div
        style={{
          marginTop: 70, width: 920, padding: "38px 0 32px", borderRadius: 24, background: rgba(Y), color: "#140f00",
          boxShadow: `0 0 ${40 * pulse}px ${rgba(Y, 0.7)}, 0 0 ${110 * pulse}px ${rgba(Y, 0.35)}, 0 18px 40px -12px rgba(0,0,0,0.8)`,
          transform: `scale(${0.5 + 0.5 * btn})`, opacity: f >= 30 ? 1 : 0,
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: "0.02em" }}>ENTRA EN EL BOX</div>
        <div style={{ marginTop: 10, fontSize: 38, fontWeight: 700, letterSpacing: "0.04em" }}>motorlabmuseum.com/gt3rs →</div>
      </div>

      <div style={{ marginTop: 60, ...tag, fontSize: 38, color: C.white, opacity: a(40) }}>Sala 05 · Acceso libre</div>
      <div style={{ position: "absolute", bottom: 130, left: 80, right: 80, fontSize: 28, fontWeight: 300, color: C.grey, opacity: a(48) }}>
        Proyecto interactivo de ingeniería sin ánimo de lucro
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   MONTAJE
   ========================================================= */
const SCENES: { from: number; to: number; name: string; El: React.FC }[] = [
  { from: 0, to: CUTS[0], name: "1 · Gancho aerodinámico", El: Hook },
  { from: CUTS[0], to: CUTS[1], name: "2 · DRS y aero activa", El: Drs },
  { from: CUTS[1], to: CUTS[2], name: "3 · Telemetría del motor", El: Engine },
  { from: CUTS[2], to: CUTS[3], name: "4 · Cifras de circuito", El: Track },
];

export const GT3RSPromo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: HEAVY, color: C.white }}>
      <AbsoluteFill style={{ transform: frame >= STILL_FROM ? "none" : shake(frame, IMPACTS) }}>
        <Carbon />
        {SCENES.map(({ from, to, name, El }) => (
          <Sequence key={name} from={from} durationInFrames={to - from + XFADE} name={name}>
            <Scene dur={to - from + XFADE}><El /></Scene>
          </Sequence>
        ))}
        <Sequence from={CUTS[3]} name="5 · Llamada a la acción"><Scene dur={GT3RS.durationInFrames - CUTS[3]} exit={false}><Cta /></Scene></Sequence>
      </AbsoluteFill>
      <Flash cuts={CUTS} rgb={Y} />
      <Grain stillFrom={STILL_FROM} />
    </AbsoluteFill>
  );
};
