import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";
import { Carbon, clamp, FADE, Flash, Grain, HEAVY, rgba, Scene, tag, thousands, Words, XFADE } from "./retention/kit";

/* =========================================================
   McLAREN P1 · INGENIERÍA HÍBRIDA (30 s, 1080 × 1920, 30 fps)
   ---------------------------------------------------------
   Laboratorio de ingeniería y F1: carbono mate, naranja McLaren
   para lo térmico y azul eléctrico para la energía del sistema
   híbrido. Muelles secos (sin rebote exagerado) y grano fino.
     0–6 s    gancho: "No es un coche de calle…" + escáner de rayos X
     6–13 s   dualidad: V8 737 CV contra IPAS 179 CV → 916 CV
     13–20 s  MonoCage, alerón activo (600 kg) y DRS del volante
     20–25 s  HUD de telemetría: 0-200 en 6,8 s y relleno de par
     25–30 s  cierre: zaga al rojo vivo y Sala 03; último segundo fijo
   Cifras oficiales de McLaren (data/cars.json: mclaren-p1).
   Sonido: promo/public/sfx (node promo/scripts/sfx.mjs).
   ========================================================= */
export const HYBRID = { fps: 30, width: 1080, height: 1920, durationInFrames: 900 };

const OR = "255, 128, 0";                 // térmico
const EL = "0, 170, 255";                 // eléctrico
const CUTS = [180, 390, 600, 750];
const STILL_FROM = 870;
const dry = { damping: 20, stiffness: 220, mass: 0.6 };      // seco: llega y se para

const Fade: React.FC<{ f: number; at: number; children: React.ReactNode; y?: number; style?: React.CSSProperties }> = ({ f, at, children, y = 24, style }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: dry });
  return <div style={{ opacity: f >= at ? s : 0, transform: `translateY(${(1 - s) * y}px)`, ...style }}>{children}</div>;
};

/* =========================================================
   ESCENA 1 · Gancho de la Fórmula 1 (0–6 s)
   ========================================================= */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [60, 90], [0, 1], clamp);                  // la silueta se ilumina
  const rim = interpolate(f, [60, 92], [-20, 120], clamp);
  const scanX = interpolate(f, [96, 160], [0, 100], { ...clamp, easing: (t) => t * (2 - t) });
  const scanOn = f >= 96;
  const boxes = [
    { x: 60, y: 28, w: 20, h: 25, c: OR, label: "V8 3.8 biturbo", at: 60 },
    { x: 43, y: 50, w: 15, h: 13, c: EL, label: "Batería · 96 kg", at: 43 },
    { x: 70, y: 40, w: 9, h: 14, c: EL, label: "Motor eléctrico", at: 72 },
  ];

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 210 }}>
        <Words text="NO ES UN COCHE DE CALLE." at={6} every={3} size={100} weight={900} accent={rgba(OR)} />
        <Words text="ES FÓRMULA 1 CON MATRÍCULA." at={26} every={3} size={100} weight={900} hot={["FÓRMULA", "1"]} accent={rgba(OR)} style={{ marginTop: 26 }} />
      </div>

      {/* Silueta del P1 y escáner de rayos X */}
      <div style={{ position: "absolute", left: -50, top: 960, width: 1180, height: 590 }}>
        <Img src={staticFile("img/p1-perfil.jpg")} style={{ ...FADE, position: "absolute", inset: 0, width: "100%", height: "100%", filter: `brightness(${0.04 + lit * 0.6}) saturate(${lit * 0.8})` }} />
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `linear-gradient(100deg, ${rgba(EL, 0)} ${rim - 8}%, ${rgba(EL, 0.35)} ${rim}%, ${rgba(EL, 0)} ${rim + 8}%)` }} />
        {scanOn ? (
          <>
            {/* Lo ya escaneado se ve "en rayos X" */}
            <Img src={staticFile("img/p1-perfil.jpg")} style={{ ...FADE, position: "absolute", inset: 0, width: "100%", height: "100%", clipPath: `inset(0 ${100 - scanX}% 0 0)`, filter: "grayscale(1) brightness(1.5) contrast(1.8) sepia(1) hue-rotate(165deg) saturate(5)" }} />
            <div style={{ position: "absolute", top: "8%", bottom: "8%", left: `${scanX}%`, width: 4, marginLeft: -2, background: rgba(EL), boxShadow: `0 0 24px 6px ${rgba(EL, 0.6)}`, opacity: scanX < 100 ? 1 : 0 }} />
            {boxes.map((b) => {
              const on = scanX >= b.at;
              const blink = on && f % 6 < 3 ? 1 : 0.6;
              return (
                <div key={b.label} style={{ position: "absolute", left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, border: `3px dashed ${rgba(b.c)}`, background: rgba(b.c, 0.12), opacity: on ? blink : 0 }}>
                  <div style={{ position: "absolute", bottom: "100%", left: -3, marginBottom: 8, whiteSpace: "nowrap", padding: "6px 12px", background: rgba(b.c), color: "#000", ...tag, textTransform: "none", letterSpacing: "0.04em", fontSize: 26 }}>{b.label}</div>
                </div>
              );
            })}
          </>
        ) : null}
      </div>
      <Fade f={f} at={100} style={{ position: "absolute", left: 70, top: 1640, ...tag, fontSize: 26, color: rgba(EL) }}>
        Escáner · tren de potencia híbrido
      </Fade>

      <Sequence from={4} durationInFrames={30}><Audio src={staticFile("sfx/pulse.wav")} volume={0.9} /></Sequence>
      <Sequence from={60} durationInFrames={30}><Audio src={staticFile("sfx/pulse.wav")} volume={0.6} /></Sequence>
      <Sequence from={96} durationInFrames={64}><Audio src={staticFile("sfx/scan.wav")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 2 · Dualidad de poder (6–13 s)
   ========================================================= */
const Bolt: React.FC<{ seed: number; x: number; y: number; len: number }> = ({ seed, x, y, len }) => {
  const f = useCurrentFrame();
  const pts = Array.from({ length: 7 }, (_, i) => `${x + (random(`bx${seed}-${i}-${Math.floor(f / 2)}`) - 0.5) * 70},${y + (i / 6) * len}`).join(" ");
  return <polyline points={pts} fill="none" stroke={rgba(EL)} strokeWidth="4" strokeLinejoin="round" opacity={random(`bo${seed}-${Math.floor(f / 2)}`) > 0.35 ? 0.9 : 0.15} />;
};

const Duality: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inL = spring({ frame: f, fps, config: dry });
  const inR = spring({ frame: f - 6, fps, config: dry });
  const v8 = interpolate(f, [14, 54], [0, 737], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const ev = interpolate(f, [20, 60], [0, 179], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  // Fusión: las dos mitades chocan en el centro
  const FUSE = 110;
  const fuse = interpolate(f, [FUSE - 12, FUSE], [0, 1], { ...clamp, easing: (t) => t * t });
  const after = spring({ frame: f - FUSE, fps, config: dry });
  const flash = interpolate(f, [FUSE, FUSE + 2, FUSE + 12], [0, 1, 0], clamp);
  const flicker = 0.85 + 0.15 * Math.sin(f * 1.7) * Math.sin(f * 0.9);

  const halfStyle = (clip: string): React.CSSProperties => ({ position: "absolute", inset: 0, clipPath: clip });

  return (
    <AbsoluteFill>
      {/* Mitad térmica (arriba a la izquierda) */}
      <div style={{ ...halfStyle("polygon(0 0, 100% 0, 100% 38%, 0 62%)"), transform: `translate(${(1 - inL) * -1080 + fuse * 120}px, ${fuse * 120}px)`, opacity: 1 - after }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 50% at 30% 30%, ${rgba(OR, 0.32 * flicker)}, rgba(0,0,0,0) 70%)` }} />
        <Img src={staticFile("img/p1-despiece-motor.jpg")} style={{ ...FADE, position: "absolute", left: -160, top: 330, width: 1100, filter: `sepia(0.6) saturate(2.4) hue-rotate(-12deg) brightness(${0.7 * flicker})` }} />
        <div style={{ position: "absolute", left: 70, top: 170 }}>
          <div style={{ ...tag, fontSize: 32, color: rgba(OR) }}>Térmico</div>
          <div style={{ marginTop: 10, fontSize: 84, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>3.8L V8 BITURBO</div>
          <div style={{ marginTop: 8, fontSize: 190, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: rgba(OR) }}>
            {Math.round(v8)}<span style={{ fontSize: 70 }}> CV</span>
          </div>
        </div>
      </div>

      {/* Mitad eléctrica (abajo a la derecha) */}
      <div style={{ ...halfStyle("polygon(0 62%, 100% 38%, 100% 100%, 0 100%)"), transform: `translate(${(1 - inR) * 1080 - fuse * 120}px, ${-fuse * 120}px)`, opacity: 1 - after }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 50% at 70% 72%, ${rgba(EL, 0.3)}, rgba(0,0,0,0) 70%)` }} />
        <Img src={staticFile("img/p1-despiece-bateria.jpg")} style={{ ...FADE, position: "absolute", right: -200, top: 820, width: 1100, filter: "grayscale(0.6) brightness(0.6) sepia(1) hue-rotate(165deg) saturate(3)" }} />
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <Bolt seed={1} x={880} y={760} len={360} />
          <Bolt seed={2} x={180} y={1300} len={300} />
        </svg>
        <div style={{ position: "absolute", right: 70, bottom: 170, textAlign: "right" }}>
          <div style={{ ...tag, fontSize: 32, color: rgba(EL) }}>Eléctrico · IPAS</div>
          <div style={{ marginTop: 10, fontSize: 84, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>MOTOR ELÉCTRICO</div>
          <div style={{ marginTop: 8, fontSize: 190, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: rgba(EL) }}>
            {Math.round(ev)}<span style={{ fontSize: 70 }}> CV</span>
          </div>
        </div>
      </div>

      {/* Costura diagonal: energía en el punto de choque */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: (inR > 0.5 ? 1 : 0) * (1 - after) }}>
        <defs>
          <linearGradient id="seam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={rgba(OR)} /><stop offset="1" stopColor={rgba(EL)} />
          </linearGradient>
        </defs>
        <line x1="0" y1={1920 * 0.62} x2="1080" y2={1920 * 0.38} stroke="url(#seam)" strokeWidth={6 + fuse * 20} />
      </svg>

      {/* Resultado de la fusión */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", opacity: f >= FUSE ? 1 : 0 }}>
        <div style={{ ...tag, fontSize: 36, color: C.platinum, opacity: after }}>Total</div>
        <div style={{ fontSize: 280, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: `scale(${1.25 - 0.25 * after})`, background: `linear-gradient(90deg, rgb(${OR}), rgb(${EL}))`, WebkitBackgroundClip: "text", color: "transparent" }}>
          916<span style={{ fontSize: 100 }}> CV</span>
        </div>
        <Fade f={f} at={FUSE + 14} style={{ marginTop: 20, fontSize: 64, fontWeight: 800 }}>900 Nm combinados</Fade>
        <Fade f={f} at={FUSE + 24} style={{ marginTop: 14, fontSize: 32, color: C.grey, maxWidth: 820 }}>El motor eléctrico entrega su par desde 0 rpm</Fade>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${flash * 0.8})`, pointerEvents: "none" }} />

      <Sequence from={FUSE - 2} durationInFrames={42}><Audio src={staticFile("sfx/impact.wav")} volume={0.9} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 3 · Ingeniería aerodinámica (13–20 s)
   ========================================================= */
const Aero: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chassis = f < 84;
  const zoom = interpolate(f, [0, 84], [1, 1.35], clamp);
  const kg = interpolate(f, [16, 50], [0, 1395], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });

  const g = f - 84;                                  // alerón
  const rise = interpolate(g, [6, 30], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const load = interpolate(g, [20, 64], [0, 600], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const drsAt = 76;
  const drs = g >= drsAt;
  const flat = interpolate(g, [drsAt, drsAt + 8], [0, 1], clamp);
  const btnBlink = drs && Math.floor(g / 4) % 2 === 0;
  const wingAngle = 18 - flat * 16;

  if (chassis) {
    return (
      <AbsoluteFill>
        <Img src={staticFile("img/p1-despiece-chasis.jpg")} style={{ ...FADE, position: "absolute", left: -180, top: 560, width: 1440, transform: `scale(${zoom})`, transformOrigin: "55% 50%" }} />
        <div style={{ position: "absolute", left: 70, top: 180 }}>
          <Fade f={f} at={2}><div style={{ ...tag, fontSize: 32, color: rgba(OR) }}>MonoCage</div></Fade>
          <Words text="Fibra de carbono pura." at={6} every={4} size={100} weight={900} accent={rgba(OR)} style={{ marginTop: 16 }} />
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 1540, borderTop: `2px solid ${rgba(OR)}`, paddingTop: 22 }}>
          <div style={{ ...tag, fontSize: 30, color: C.platinum }}>Peso en seco</div>
          <div style={{ fontSize: 170, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {thousands(kg)}<span style={{ fontSize: 64, color: rgba(OR) }}> kg</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // Esquema del alerón activo: sube de su alojamiento y, con el DRS, se aplana
  const wy = 520 - rise * 150;
  return (
    <AbsoluteFill>
      <Img src={staticFile("img/p1-despiece-aleron.jpg")} style={{ ...FADE, position: "absolute", left: -80, top: 430, width: 1240, opacity: 0.1 }} />
      <div style={{ position: "absolute", left: 70, top: 180 }}>
        <Fade f={g} at={0}><div style={{ ...tag, fontSize: 32, color: rgba(OR) }}>Alerón activo</div></Fade>
        <Words text="Se despliega. Empuja hacia abajo." at={4} every={4} size={88} weight={900} accent={rgba(OR)} style={{ marginTop: 16 }} />
      </div>

      <svg viewBox="0 0 1080 900" style={{ position: "absolute", left: 0, top: 560, width: 1080, height: 900 }}>
        {/* Carrocería de referencia */}
        <path d="M120 620 C 300 560, 520 540, 700 560 L 960 600 L 960 660 L 120 660 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        {/* Soportes y perfil del alerón */}
        <line x1="520" y1="570" x2="520" y2={wy + 20} stroke={C.white} strokeWidth="8" strokeLinecap="round" />
        <line x1="780" y1="580" x2="780" y2={wy + 20} stroke={C.white} strokeWidth="8" strokeLinecap="round" />
        <g transform={`rotate(${-wingAngle} 650 ${wy})`}>
          <path d={`M440 ${wy} C 520 ${wy - 30}, 760 ${wy - 32}, 860 ${wy - 6} C 760 ${wy + 12}, 540 ${wy + 16}, 440 ${wy} Z`} fill={drs ? rgba(EL) : rgba(OR)} />
        </g>
        {/* Flechas de carga aerodinámica */}
        {[520, 650, 780].map((x, i) => (
          <path key={x} d={`M${x} ${wy - 160 + ((g * 6 + i * 30) % 60)} v70 m-16 -18 l16 18 l16 -18`} fill="none" stroke={rgba(OR, drs ? 0.15 : 0.8 * rise)} strokeWidth="5" strokeLinecap="round" />
        ))}
        <text x="880" y={wy - 40} fill={C.white} style={{ fontFamily: HEAVY, fontSize: 30, fontWeight: 800 }}>{Math.round(wingAngle)}°</text>
      </svg>

      <div style={{ position: "absolute", left: 70, right: 70, top: 1320 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ ...tag, fontSize: 30, color: C.platinum }}>Downforce</span>
          <span style={{ fontSize: 100, fontWeight: 900, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>{Math.round(load)}<span style={{ fontSize: 40, color: rgba(OR) }}> kg</span></span>
        </div>
        <div style={{ height: 22, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${(load / 600) * 100}%`, height: "100%", background: drs ? rgba(EL, 0.5) : `linear-gradient(90deg, ${rgba(OR, 0.6)}, ${rgba(OR)})` }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 26, color: C.grey }}>Máximo oficial a 257 km/h</div>
      </div>

      {/* Botón DRS del volante */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1580, display: "flex", alignItems: "center", gap: 34, opacity: g >= drsAt - 10 ? 1 : 0 }}>
        <svg viewBox="0 0 200 200" width="190" height="190">
          <path d="M20 90 C 20 40, 180 40, 180 90 L 165 150 C 140 175, 60 175, 35 150 Z" fill="#141416" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
          <rect x="70" y="80" width="60" height="40" rx="8" fill={btnBlink ? rgba(EL) : "#26262a"} stroke={rgba(EL)} strokeWidth="3" />
          <text x="100" y="107" textAnchor="middle" fill={btnBlink ? "#000" : C.white} style={{ fontFamily: HEAVY, fontSize: 20, fontWeight: 900 }}>DRS</text>
        </svg>
        <div>
          <div style={{ ...tag, fontSize: 30, color: rgba(EL) }}>Sistema DRS</div>
          <div style={{ marginTop: 8, fontSize: 64, fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.02em" }}>−23 % de<br />resistencia</div>
        </div>
      </div>

      <Sequence from={84 + drsAt} durationInFrames={30}><Audio src={staticFile("sfx/pulse.wav")} volume={0.7} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 4 · Disparo de telemetría (20–25 s)
   ========================================================= */
const Telemetry: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const run = interpolate(f, [8, 68], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 1.6) });
  const kmh = run * 200;
  const secs = run * 6.8;
  const land = spring({ frame: f - 68, fps, config: dry });
  const CX = 540, CY = 640, RR = 330;
  const arc = (a0: number, a1: number, r: number) => {
    const p = (a: number) => `${CX + Math.cos((a * Math.PI) / 180) * r} ${CY + Math.sin((a * Math.PI) / 180) * r}`;
    return `M ${p(a0)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
  };
  const end = 135 + run * 270;

  // Curvas de par (esquema): solo turbo, que llega tarde, y con relleno eléctrico, plana
  const draw = interpolate(f, [30, 100], [0, 1], clamp);
  const W = 900, H = 260, X0 = 90, Y0 = 1720;
  const turbo = Array.from({ length: 31 }, (_, i) => { const x = i / 30; return [X0 + x * W, Y0 - H * (x < 0.35 ? 0.25 + x * 1.2 : Math.min(0.95, 0.67 + (x - 0.35) * 0.9))]; });
  const fill = Array.from({ length: 31 }, (_, i) => { const x = i / 30; return [X0 + x * W, Y0 - H * Math.min(0.95, 0.82 + x * 0.4)]; });
  const path = (pts: number[][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${path(fill)} ${[...turbo].reverse().map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} Z`;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <path d={arc(135, 405, RR)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="26" strokeLinecap="round" />
        {run > 0.001 ? <path d={arc(135, end, RR)} fill="none" stroke={rgba(OR)} strokeWidth="26" strokeLinecap="round" /> : null}
        {Array.from({ length: 21 }, (_, i) => {
          const a = ((135 + i * 13.5) * Math.PI) / 180;
          return <line key={i} x1={CX + Math.cos(a) * (RR - 44)} y1={CY + Math.sin(a) * (RR - 44)} x2={CX + Math.cos(a) * (RR - (i % 5 ? 60 : 76))} y2={CY + Math.sin(a) * (RR - (i % 5 ? 60 : 76))} stroke="rgba(255,255,255,0.4)" strokeWidth={i % 5 ? 3 : 5} />;
        })}
        <text x={CX} y={CY - 70} textAnchor="middle" fill={C.platinum} style={{ fontFamily: HEAVY, fontSize: 28, fontWeight: 700, letterSpacing: "0.2em" }}>0 – 200 KM/H</text>
        <text x={CX} y={CY + 60} textAnchor="middle" fill={f >= 68 ? rgba(OR) : C.white} style={{ fontFamily: HEAVY, fontSize: 170, fontWeight: 900, letterSpacing: "-4px", fontVariantNumeric: "tabular-nums" }} transform={`translate(${CX} ${CY}) scale(${f >= 68 ? 1.12 - 0.12 * land : 1}) translate(${-CX} ${-CY})`}>
          {secs.toFixed(1).replace(".", ",")} s
        </text>
        <text x={CX} y={CY + 130} textAnchor="middle" fill={C.grey} style={{ fontFamily: HEAVY, fontSize: 34, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{Math.round(kmh)} km/h</text>

        {/* Gráfica de par */}
        <text x={X0} y={Y0 - H - 40} fill={rgba(EL)} style={{ fontFamily: HEAVY, fontSize: 28, fontWeight: 700, letterSpacing: "0.18em" }}>ENTREGA DE PAR · ESQUEMA</text>
        <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <g style={{ clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)` }}>
          <path d={area} fill={rgba(EL, 0.35)} />
          <path d={path(turbo)} fill="none" stroke={rgba(OR)} strokeWidth="5" strokeDasharray="14 10" />
          <path d={path(fill)} fill="none" stroke={C.white} strokeWidth="6" />
        </g>
        <text x={X0} y={Y0 + 44} fill={C.grey} style={{ fontFamily: HEAVY, fontSize: 24 }}>rpm →</text>
        <text x={X0 + W} y={Y0 + 44} textAnchor="end" fill={rgba(EL)} style={{ fontFamily: HEAVY, fontSize: 24, fontWeight: 700 }}>azul: relleno eléctrico</text>
      </svg>

      <div style={{ position: "absolute", left: 70, right: 70, top: 1020 }}>
        <Words text="Respuesta de acelerador instantánea." at={20} every={3} size={66} weight={900} hot={["instantánea."]} accent={rgba(EL)} />
        <Words text="Cero lag de turbo." at={40} every={3} size={66} weight={900} hot={["Cero"]} accent={rgba(OR)} style={{ marginTop: 10 }} />
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 5 · Cierre y llamada a la acción (25–30 s)
   ========================================================= */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const still = f >= STILL_FROM - CUTS[3];
  const heat = still ? 1 : 0.8 + 0.2 * Math.sin(f / 2.5);
  const card = spring({ frame: f - 40, fps, config: dry });

  return (
    <AbsoluteFill>
      {/* Zaga del P1 con los escapes al rojo vivo (calor ondulante) */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="haze"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves={2} seed={still ? 1 : Math.floor(f / 2)} /><feDisplacementMap in="SourceGraphic" scale={still ? 0 : 10} /></filter>
      </svg>
      <div style={{ position: "absolute", left: -1150, top: 300, width: 2400, height: 1200, filter: "url(#haze)" }}>
        <Img src={staticFile("img/p1-perfil.jpg")} style={{ ...FADE, width: "100%", height: "100%", filter: "brightness(0.75) contrast(1.1)" }} />
        <div style={{ position: "absolute", left: "86%", top: "33%", width: 260, height: 200, marginLeft: -130, marginTop: -100, borderRadius: "50%", mixBlendMode: "screen", background: `radial-gradient(closest-side, rgba(255,90,20,${0.95 * heat}), rgba(255,40,0,${0.5 * heat}) 45%, rgba(255,0,0,0) 100%)` }} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.5) 55%, #000 72%)" }} />

      <div style={{ position: "absolute", left: 70, right: 70, top: 1060 }}>
        <Words text="¿Comprendes la verdadera ingeniería híbrida?" at={10} every={3} size={86} weight={900} hot={["ingeniería", "híbrida?"]} accent={rgba(OR)} />
      </div>
      <div
        style={{
          position: "absolute", left: 70, right: 70, top: 1480, padding: "34px 40px", borderRadius: 14,
          background: "rgba(14,14,16,0.92)", border: `2px solid ${rgba(OR)}`, boxShadow: `0 20px 50px -18px rgba(0,0,0,0.9), inset 0 0 0 1px ${rgba(EL, 0.25)}`,
          opacity: f >= 40 ? card : 0, transform: `translateY(${(1 - card) * 40}px)`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 62, fontWeight: 900, letterSpacing: "-0.01em" }}>EXPLORA LA SALA 03</div>
          <div style={{ marginTop: 8, fontSize: 34, fontWeight: 700, color: rgba(OR) }}>motorlabmuseum.com/p1</div>
        </div>
        <svg viewBox="0 0 16 12" width="60" height="45" fill="none" stroke={rgba(OR)} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h14M10 1l5 5-5 5" /></svg>
      </div>
      <Fade f={f} at={52} style={{ position: "absolute", left: 70, right: 70, bottom: 120, fontSize: 26, color: C.grey, textAlign: "center" }}>
        MotorLab Museum · Proyecto interactivo de ingeniería sin ánimo de lucro
      </Fade>
    </AbsoluteFill>
  );
};

/* =========================================================
   MONTAJE
   ========================================================= */
const SCENES: { from: number; to: number; name: string; El: React.FC }[] = [
  { from: 0, to: CUTS[0], name: "1 · Gancho F1", El: Hook },
  { from: CUTS[0], to: CUTS[1], name: "2 · Dualidad de poder", El: Duality },
  { from: CUTS[1], to: CUTS[2], name: "3 · Aerodinámica", El: Aero },
  { from: CUTS[2], to: CUTS[3], name: "4 · Telemetría", El: Telemetry },
];

export const McLarenHybrid: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: HEAVY, color: C.white }}>
    {/* Carbono mate: el del kit, apagado */}
    <AbsoluteFill style={{ filter: "brightness(0.7) saturate(0)" }}><Carbon /></AbsoluteFill>
    {SCENES.map(({ from, to, name, El }) => (
      <Sequence key={name} from={from} durationInFrames={to - from + XFADE} name={name}>
        <Scene dur={to - from + XFADE}><El /></Scene>
      </Sequence>
    ))}
    <Sequence from={CUTS[3]} name="5 · Llamada a la acción"><Scene dur={HYBRID.durationInFrames - CUTS[3]} exit={false}><Outro /></Scene></Sequence>
    {CUTS.map((c) => (
      <Sequence key={c} from={c} durationInFrames={24}><Audio src={staticFile("sfx/pulse.wav")} volume={0.45} /></Sequence>
    ))}
    <Flash cuts={CUTS} rgb={EL} />
    <Grain stillFrom={STILL_FROM} />
  </AbsoluteFill>
);
