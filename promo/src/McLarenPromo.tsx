import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { C } from "./theme";

/* =========================================================
   McLAREN P1 · vídeo de retención (1080 × 1920, 30 fps, 15 s)
   ---------------------------------------------------------
   Ritmo de TikTok / Reels: cada escena entra con un impacto
   (temblor de cámara + destello) y sale en 8 fotogramas con
   un empujón desenfocado. Etiquetas y cifras rebotan con
   muelles de amortiguación baja.
     0–3,5 s   gancho: "El modo que debería ser ilegal" → modo Race
     3,5–7,5 s tres golpes de telemetría (potencia, DRS, despiece)
     7,5–11,5 s las cifras: 0-100 / 0-300, velocímetro y carga aerodinámica
     11,5–15 s llamada a la acción; el último segundo y medio, quieto
   Cifras oficiales de McLaren (data/cars.json: mclaren-p1).
   ========================================================= */
export const MCLAREN = { fps: 30, width: 1080, height: 1920, durationInFrames: 450 };

const { fontFamily: INTER } = loadFont("normal", { weights: ["300", "500", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
const FONT = `${INTER}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;

const OR = "255, 128, 0";                 // naranja McLaren encendido
const orange = (a = 1) => `rgba(${OR}, ${a})`;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const XFADE = 8;                          // transición entre escenas: 8 fotogramas
const CUTS = [105, 225, 345];             // inicio de las escenas 2, 3 y 4
const STILL_FROM = 405;                   // desde aquí (13,5 s) nada se mueve

/* ---------- Muelles ---------- */
const bouncy = { damping: 7, stiffness: 190, mass: 0.6 };     // rebote marcado para datos y etiquetas
const slam = { damping: 11, stiffness: 420, mass: 0.5 };      // golpe seco para titulares

/* ---------- Temblor de cámara: suma de impactos que se apagan en ~10 fotogramas ---------- */
const IMPACTS: [number, number][] = [[2, 30], [6, 16], [10, 22], [58, 34], [72, 12], [80, 12], ...CUTS.map((c): [number, number] => [c, 30]), [131, 14], [157, 14], [287, 18]];
const shake = (frame: number) => {
  let x = 0, y = 0, r = 0;
  for (const [t, amp] of IMPACTS) {
    const d = frame - t;
    if (d < 0 || d > 14) continue;
    const k = amp * Math.exp(-d / 3.2);
    x += (random(`x${t}-${frame}`) - 0.5) * 2 * k;
    y += (random(`y${t}-${frame}`) - 0.5) * 2 * k;
    r += (random(`r${t}-${frame}`) - 0.5) * k * 0.06;
  }
  return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)`;
};

/* ---------- Envoltorio de escena: entra con golpe, sale empujando y desenfocando ---------- */
const Scene: React.FC<{ dur: number; children: React.ReactNode; exit?: boolean }> = ({ dur, children, exit = true }) => {
  const f = useCurrentFrame();
  const inS = interpolate(f, [0, 6], [1.14, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const inO = interpolate(f, [0, 3], [0, 1], clamp);
  const out = exit ? interpolate(f, [dur - XFADE, dur], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{ opacity: inO * (1 - out), transform: `scale(${inS + out * 0.22})`, filter: out > 0 ? `blur(${out * 18}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- Piezas comunes ---------- */
const Carbon: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `
        radial-gradient(ellipse 90% 60% at 50% 45%, rgba(0,0,0,0) 30%, #000 100%),
        repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0 7px, rgba(255,255,255,0) 7px 14px),
        repeating-linear-gradient(-45deg, rgba(0,0,0,0.55) 0 7px, rgba(0,0,0,0) 7px 14px),
        #0c0c0e`,
    }}
  />
);

const Alert: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path d="M12 2.8 22.6 21H1.4Z" fill={orange()} />
    <path d="M12 9v5.6" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="12" cy="17.6" r="1.4" fill="#000" />
  </svg>
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame >= STILL_FROM ? 0 : frame % 24;        // grano congelado al final: imagen totalmente quieta
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 80% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 88%, rgba(0,0,0,0.7) 100%)" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "screen" }}>
        <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  let o = 0;
  for (const c of CUTS) o = Math.max(o, interpolate(frame, [c, c + 1, c + 6], [0, 0.55, 0], clamp));
  return <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%, rgba(255,240,220,${o}), ${orange(o * 0.5)})`, mixBlendMode: "screen" }} />;
};

// Las fotos tienen fondo negro puro: sobre el carbono se vería su rectángulo, así que sus bordes se funden
const FADE: React.CSSProperties = {
  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
  WebkitMaskComposite: "source-in",
};
const thousands = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const tag: React.CSSProperties = { fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" };

/* =========================================================
   ESCENA 1 · Gancho (0–3,5 s)
   ========================================================= */
const HOOK = ["EL MODO QUE", "DEBERÍA SER", "ILEGAL 🤫"];
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const race = interpolate(f, [58, 66], [0, 1], clamp);                       // el coche "migra" a modo Race
  const whipBlur = interpolate(f, [56, 61, 70], [0, 16, 0], clamp);
  const sweep = interpolate(f, [56, 70], [-30, 130], clamp);
  const hud = interpolate(f, [54, 70], [0, 1], clamp);
  const blink = f < 84 ? (Math.floor(f / 3) % 2 ? 1 : 0.35) : 0.8;
  const typed = "MIGRANDO A MODO RACE...".slice(0, Math.max(0, Math.floor((f - 58) * 1.4)));

  return (
    <AbsoluteFill>
      {/* P1 en penumbra que se enciende y baja 50 mm (se asienta sobre el suelo) */}
      <div style={{ position: "absolute", left: -110, right: -110, top: 920, height: 650, transform: `translateY(${race * 22}px)`, filter: `blur(${whipBlur}px)` }}>
        <div style={{ position: "absolute", left: "8%", right: "8%", bottom: "6%", height: "30%", opacity: race, mixBlendMode: "screen", background: `radial-gradient(ellipse 50% 55% at 50% 50%, ${orange(0.45)}, ${orange(0)} 72%)` }} />
        <Img src={staticFile("img/p1-perfil.jpg")} style={{ ...FADE, width: "100%", height: "100%", objectFit: "contain", filter: `brightness(${0.22 + race * 0.85}) saturate(${0.5 + race * 0.6})` }} />
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `linear-gradient(100deg, rgba(255,200,140,0) ${sweep - 10}%, rgba(255,200,140,0.5) ${sweep}%, rgba(255,200,140,0) ${sweep + 10}%)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, #000 100%)" }} />
      </div>

      {/* HUD de circuito */}
      <svg viewBox="0 0 1080 700" style={{ position: "absolute", left: 0, top: 880, width: 1080, height: 700, opacity: hud * blink }}>
        <path
          d="M140 520 C 140 420, 230 380, 330 400 L 620 450 C 700 465, 760 420, 760 360 C 760 280, 860 250, 930 300 C 990 345, 960 450, 900 500 L 820 560 C 760 600, 640 610, 540 590 L 230 600 C 170 602, 140 570, 140 520 Z"
          fill="none" stroke={orange()} strokeWidth="3" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - hud}
        />
        {[[60, 60], [1020, 60], [60, 660], [1020, 660]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y + (y < 300 ? 50 : -50)} V${y} H${x + (x < 500 ? 50 : -50)}`} fill="none" stroke={orange()} strokeWidth="3" />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 80, top: 860, ...tag, fontSize: 30, color: orange(), opacity: f >= 58 ? 1 : 0 }}>
        {typed}
        <span style={{ opacity: Math.floor(f / 4) % 2 ? 1 : 0 }}>▍</span>
      </div>

      {/* Titular a golpes */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 250 }}>
        {HOOK.map((line, i) => {
          const at = 2 + i * 4;
          const s = spring({ frame: f - at, fps, config: slam });
          const jit = f - at < 8 && f >= at ? (random(`j${i}-${f}`) - 0.5) * 14 : 0;
          return (
            <div
              key={line}
              style={{
                fontSize: 132, fontWeight: 900, lineHeight: 0.94, letterSpacing: "-0.035em", whiteSpace: "nowrap",
                color: i === 2 ? orange() : C.white, opacity: f >= at ? 1 : 0,
                transform: `translate(${jit}px, ${jit * 0.6}px) scale(${interpolate(s, [0, 1], [2.3, 1])})`, transformOrigin: "0% 50%",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* Avisos inyectados */}
      {[
        { t: 72, text: "SUSPENSIÓN −50 mm" },
        { t: 80, text: "ALERÓN +300 mm" },
      ].map((a, i) => {
        const s = spring({ frame: f - a.t, fps, config: bouncy });
        return (
          <div
            key={a.text}
            style={{
              position: "absolute", left: 80, top: 1600 + i * 118, display: "flex", alignItems: "center", gap: 22,
              padding: "18px 30px 18px 22px", background: "rgba(12,12,14,0.9)", border: `2px solid ${orange()}`, borderRadius: 6,
              opacity: f >= a.t ? 1 : 0, transform: `translateX(${(1 - s) * -260}px) scale(${0.7 + 0.3 * s})`, transformOrigin: "0 50%",
            }}
          >
            <Alert />
            <span style={{ ...tag, textTransform: "none", fontSize: 40, letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums" }}>{a.text}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 2 · Tres golpes de telemetría (3,5–7,5 s)
   ========================================================= */
const Band: React.FC<{ top: number; at: number; children: React.ReactNode }> = ({ top, at, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f, [at, at + 4], [1.18, 1], clamp);
  const flash = interpolate(f, [at, at + 5], [0.7, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, height: 560, overflow: "hidden", borderTop: `2px solid ${orange(0.7)}`, transform: `scale(${s})` }}>
      {children}
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,236,210,${flash})`, pointerEvents: "none" }} />
    </div>
  );
};

const Power: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame() - at;
  const { fps } = useVideoConfig();
  const v8 = interpolate(f, [2, 12], [0, 737], clamp);
  const ev = interpolate(f, [4, 14], [0, 179], clamp);
  const merge = interpolate(f, [16, 22], [0, 1], clamp);
  const scrambling = f >= 22 && f < 34;
  const total = scrambling ? Math.floor(random(`p${f}`) * 900 + 100) : 916;
  const land = spring({ frame: f - 34, fps, config: bouncy });
  return (
    <AbsoluteFill style={{ padding: "54px 80px" }}>
      <Img src={staticFile("img/p1-despiece-motor.jpg")} style={{ ...FADE, position: "absolute", right: -220, top: 20, width: 900, opacity: 0.3 }} />
      <div style={{ ...tag, fontSize: 34, color: orange() }}>V8 biturbo + eléctrico</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginTop: 34, fontSize: 92, fontWeight: 800, fontVariantNumeric: "tabular-nums", opacity: 1 - merge, transform: `translateY(${merge * -40}px)` }}>
        <span>{Math.round(v8)}<small style={{ fontSize: 40, color: C.grey }}> CV</small></span>
        <span style={{ color: orange() }}>+</span>
        <span>{Math.round(ev)}<small style={{ fontSize: 40, color: C.grey }}> CV</small></span>
      </div>
      <div
        style={{
          position: "absolute", left: 80, top: 230, fontSize: 250, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums",
          opacity: merge, transform: `scale(${scrambling ? 1 + (random(`s${f}`) - 0.5) * 0.06 : 0.85 + 0.15 * land})`, transformOrigin: "0 50%",
          color: scrambling ? orange() : C.white,
        }}
      >
        {total}<span style={{ fontSize: 90, color: orange(), marginLeft: 18 }}>CV</span>
      </div>
    </AbsoluteFill>
  );
};

const Drs: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame() - at;
  const { fps } = useVideoConfig();
  const on = f < 24 ? (Math.floor(f / 3) % 2 ? 1 : 0.25) : 1;
  const fill = interpolate(f, [6, 34], [0, 1], { ...clamp, easing: (t) => t * t });
  const pct = spring({ frame: f - 34, fps, config: bouncy });
  const SEGS = 20;
  return (
    <AbsoluteFill style={{ padding: "54px 80px" }}>
      <Img src={staticFile("img/p1-despiece-aleron.jpg")} style={{ ...FADE, position: "absolute", right: -160, top: -40, width: 860, opacity: 0.34 }} />
      <div style={{ fontSize: 112, fontWeight: 900, letterSpacing: "-0.03em", color: orange(), opacity: on, lineHeight: 1 }}>F1 DRS SYSTEM</div>
      <div style={{ ...tag, fontSize: 28, color: C.platinum, marginTop: 30 }}>Empuje aerodinámico</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${SEGS}, 1fr)`, gap: 8, marginTop: 24, height: 70 }}>
        {Array.from({ length: SEGS }, (_, i) => (
          <div key={i} style={{ background: i / SEGS < fill ? orange(i > SEGS * 0.85 ? 1 : 0.85) : "rgba(255,255,255,0.08)", borderRadius: 2, transform: `skewX(-12deg)` }} />
        ))}
      </div>
      <div style={{ marginTop: 26, fontSize: 96, fontWeight: 800, fontVariantNumeric: "tabular-nums", transform: `scale(${0.8 + 0.2 * pct})`, transformOrigin: "0 50%" }}>
        {Math.round(fill * 100)}%
      </div>
    </AbsoluteFill>
  );
};

const Exploded: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame() - at;
  const { fps } = useVideoConfig();
  const battery = f >= 34;                                 // corte seco del motor a la batería
  const g = battery ? f - 34 : f;
  const zoom = interpolate(g, [0, 30], [1, 1.55], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const pts = battery
    ? [{ x: 48, y: 48, text: "BATERÍA · 96 kg", at: 4 }]
    : [{ x: 52, y: 26, text: "900 Nm", at: 6 }, { x: 84, y: 56, text: "ELÉCTRICO · 179 CV", at: 14 }];
  const origin = battery ? "45% 50%" : "62% 40%";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: -60, width: 1080, height: 720, transform: `scale(${zoom})`, transformOrigin: origin }}>
        <Img src={staticFile(battery ? "img/p1-despiece-bateria.jpg" : "img/p1-despiece-motor.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {pts.map((p) => {
          const s = spring({ frame: g - p.at, fps, config: bouncy });
          const blink = Math.floor(g / 3) % 2 ? 1 : 0.4;
          return (
            <div key={p.text} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: `scale(${s / zoom})`, opacity: g >= p.at ? 1 : 0 }}>
              <div style={{ position: "absolute", left: -20, top: -20, width: 40, height: 40, borderRadius: "50%", border: `3px solid ${orange()}`, background: "rgba(0,0,0,0.6)" }}>
                <div style={{ position: "absolute", inset: 9, borderRadius: "50%", background: orange(blink) }} />
              </div>
              <div style={{ position: "absolute", left: 34, top: -34, whiteSpace: "nowrap", padding: "10px 18px", background: "rgba(0,0,0,0.85)", border: `2px solid ${orange()}`, borderRadius: 4, ...tag, textTransform: "none", fontSize: 34, letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums" }}>
                {p.text}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 80, top: 40, padding: "8px 14px", background: "rgba(0,0,0,0.8)", ...tag, fontSize: 26, color: orange() }}>{battery ? "Despiece · batería" : "Despiece · V8 + motor eléctrico"}</div>
    </AbsoluteFill>
  );
};

const Telemetry: React.FC = () => (
  <AbsoluteFill>
    <Band top={70} at={0}><Power at={0} /></Band>
    <Band top={660} at={26}><Drs at={26} /></Band>
    <Band top={1250} at={52}><Exploded at={52} /></Band>
  </AbsoluteFill>
);

/* =========================================================
   ESCENA 3 · El escándalo de las cifras (7,5–11,5 s)
   ========================================================= */
const Sparks: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const f = useCurrentFrame();
  const parts = [];
  for (let b = Math.max(from, f - 16); b <= f; b++) {
    for (let k = 0; k < 4; k++) {
      const age = f - b;
      const a = random(`a${b}-${k}`) * Math.PI * 1.2 - Math.PI * 1.1;
      const v = 14 + random(`v${b}-${k}`) * 22;
      const px = x + Math.cos(a) * v * age;
      const py = y + Math.sin(a) * v * age + 0.9 * age * age;
      parts.push(<circle key={`${b}-${k}`} cx={px} cy={py} r={4 - age * 0.2} fill={random(`c${b}-${k}`) > 0.5 ? "#ffd27a" : orange()} opacity={1 - age / 16} />);
    }
  }
  return <>{parts}</>;
};

const Numbers: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jit = (s: string, k = 3) => `translate(${(random(`${s}x${f}`) - 0.5) * k}px, ${(random(`${s}y${f}`) - 0.5) * k}px)`;
  const t100 = interpolate(f, [10, 26], [0, 2.8], clamp);
  const t300 = interpolate(f, [10, 58], [0, 16.5], { ...clamp, easing: (t) => t * t * 0.4 + t * 0.6 });
  const done100 = spring({ frame: f - 26, fps, config: bouncy });
  const done300 = spring({ frame: f - 58, fps, config: bouncy });

  // Velocímetro 0–350 km/h: la aguja barre y se "sobrecarga" en el tope
  const v = interpolate(f, [18, 66], [0, 350], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const over = f > 66 ? (random(`o${f}`) - 0.5) * 6 : 0;
  const ang = -210 + ((v + over) / 350) * 240;               // de −210° a 30°
  const R = 250, CX = 540, CY = 1390;
  const tip = { x: CX + Math.cos((ang * Math.PI) / 180) * (R - 26), y: CY + Math.sin((ang * Math.PI) / 180) * (R - 26) };

  // Carga aerodinámica: sube y baja (máximo oficial 600 kg a 257 km/h)
  const load = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin((f - 30) / 6));
  const loadOn = interpolate(f, [30, 40], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, top: 150, textAlign: "center", fontSize: 76, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", color: orange(), transform: jit("t", 5) }}>
        MÁS RÁPIDO QUE TU<br />SUPERDEPORTIVO FAVORITO
      </div>

      {/* 0-100 | 0-300 */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 430, display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${orange(0.5)}`, borderBottom: `1px solid ${orange(0.5)}` }}>
        {[
          { k: "0 – 100", t: t100, d: done100 },
          { k: "0 – 300", t: t300, d: done300 },
        ].map((c, i) => (
          <div key={c.k} style={{ padding: "36px 0 30px", paddingLeft: i ? 40 : 0, borderLeft: i ? `2px solid ${orange()}` : "none" }}>
            <div style={{ ...tag, fontSize: 32, color: C.platinum }}>{c.k} <small style={{ fontSize: 22, color: C.grey }}>km/h</small></div>
            <div style={{ marginTop: 14, fontSize: 168, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.12 * (1 - Math.abs(c.d - 1)) * (c.d > 0 ? 1 : 0)})`, transformOrigin: "0 50%" }}>
              {c.t.toFixed(1).replace(".", ",")}<span style={{ fontSize: 64, color: orange() }}>s</span>
            </div>
          </div>
        ))}
      </div>

      {/* Velocímetro */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 36 }, (_, i) => {
          const a = ((-210 + (i / 35) * 240) * Math.PI) / 180;
          const lit = (i / 35) * 350 <= v;
          const red = i >= 30;
          return (
            <line
              key={i}
              x1={CX + Math.cos(a) * (R - 8)} y1={CY + Math.sin(a) * (R - 8)}
              x2={CX + Math.cos(a) * (R + 30)} y2={CY + Math.sin(a) * (R + 30)}
              stroke={lit ? (red ? "#ff3b1f" : orange()) : "rgba(255,255,255,0.12)"} strokeWidth={i % 5 === 0 ? 8 : 5} strokeLinecap="round"
            />
          );
        })}
        <line x1={CX} y1={CY} x2={tip.x} y2={tip.y} stroke={C.white} strokeWidth="7" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="16" fill={orange()} />
        {f > 62 ? <Sparks x={tip.x} y={tip.y} from={62} /> : null}
        <text x={CX} y={CY + 120} textAnchor="middle" fill={C.white} style={{ fontFamily: FONT, fontSize: 110, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{Math.round(v)}</text>
        <text x={CX} y={CY + 170} textAnchor="middle" fill={C.grey} style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, letterSpacing: "0.2em" }}>KM/H · LIMITADA</text>
      </svg>

      {/* Carga aerodinámica */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 1660, opacity: loadOn }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ ...tag, fontSize: 28, color: C.platinum }}>Carga aerodinámica</span>
          <span style={{ fontSize: 56, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{Math.round(load * 600)}<small style={{ fontSize: 26, color: C.grey }}> / 600 kg</small></span>
        </div>
        <div style={{ marginTop: 14, height: 18, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${load * 100}%`, height: "100%", background: `linear-gradient(90deg, ${orange(0.6)}, ${orange()})` }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 24, color: C.greyDim }}>Máximo oficial: 600 kg a 257 km/h</div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 4 · Llamada a la acción (11,5–15 s)
   ========================================================= */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ignite = interpolate(f, [0, 3, 12], [0, 2.4, 1], clamp);             // destello al encenderse
  const sweep = interpolate(f, [2, 16], [-30, 130], clamp);
  const q = spring({ frame: f - 8, fps, config: bouncy });
  const btn = spring({ frame: f - 18, fps, config: bouncy });
  const a = (d: number) => interpolate(f, [d, d + 8], [0, 1], clamp);
  const pulse = f < 60 ? 0.75 + 0.25 * Math.sin(f / 3) : 1;                    // late hasta 13,5 s; después, quieto

  return (
    <AbsoluteFill style={{ alignItems: "center", textAlign: "center" }}>
      <div style={{ position: "relative", marginTop: 170, width: 380, height: 380, filter: `brightness(${ignite})`, WebkitMaskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)" }}>
        <Img src={staticFile("img/logo.png")} style={{ width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.8) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)` }} />
      </div>

      <div style={{ marginTop: 50, fontSize: 92, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", transform: `scale(${0.6 + 0.4 * q})`, opacity: f >= 8 ? 1 : 0 }}>
        ¿Eres capaz de<br />dominar <span style={{ color: orange() }}>916 CV</span>?
      </div>

      <div
        style={{
          marginTop: 80, width: 920, padding: "40px 0 34px", borderRadius: 24, background: orange(),
          boxShadow: `0 0 ${40 * pulse}px ${orange(0.75)}, 0 0 ${110 * pulse}px ${orange(0.4)}, 0 18px 40px -12px rgba(0,0,0,0.8)`,
          transform: `scale(${0.5 + 0.5 * btn})`, opacity: f >= 18 ? 1 : 0, color: "#120800",
        }}
      >
        <div style={{ fontSize: 62, fontWeight: 900, letterSpacing: "0.02em" }}>PRUEBA LA TELEMETRÍA</div>
        <div style={{ marginTop: 10, fontSize: 38, fontWeight: 700, letterSpacing: "0.04em" }}>motorlabmuseum.com/p1 →</div>
      </div>

      <div style={{ marginTop: 64, ...tag, fontSize: 38, color: C.white, opacity: a(26) }}>Sala 03 · Acceso libre</div>
      <div style={{ position: "absolute", bottom: 130, left: 80, right: 80, fontSize: 28, fontWeight: 300, color: C.grey, opacity: a(32) }}>
        Proyecto interactivo de ingeniería sin ánimo de lucro
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   MONTAJE
   ========================================================= */
export const McLarenPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = frame >= STILL_FROM ? "none" : shake(frame);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: FONT, color: C.white }}>
      <AbsoluteFill style={{ transform: cam }}>
        <Carbon />
        <Sequence from={0} durationInFrames={CUTS[0] + XFADE} name="1 · Gancho"><Scene dur={CUTS[0] + XFADE}><Hook /></Scene></Sequence>
        <Sequence from={CUTS[0]} durationInFrames={CUTS[1] - CUTS[0] + XFADE} name="2 · Telemetría"><Scene dur={CUTS[1] - CUTS[0] + XFADE}><Telemetry /></Scene></Sequence>
        <Sequence from={CUTS[1]} durationInFrames={CUTS[2] - CUTS[1] + XFADE} name="3 · Cifras"><Scene dur={CUTS[2] - CUTS[1] + XFADE}><Numbers /></Scene></Sequence>
        <Sequence from={CUTS[2]} name="4 · Llamada a la acción"><Scene dur={450 - CUTS[2]} exit={false}><Cta /></Scene></Sequence>
      </AbsoluteFill>
      <Flash />
      <Grain />
    </AbsoluteFill>
  );
};
