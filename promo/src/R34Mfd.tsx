import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadShareTech } from "@remotion/google-fonts/ShareTech";
import { loadFont as loadShareTechMono } from "@remotion/google-fonts/ShareTechMono";
import { loadFont as loadDotGothic } from "@remotion/google-fonts/DotGothic16";
import { clamp, FADE, Scene, Words, XFADE } from "./retention/kit";

/* =========================================================
   NISSAN SKYLINE GT-R R34 · PANTALLA MFD (25 s, 1080 × 1920)
   ---------------------------------------------------------
   Telemetría retrofuturista inspirada en el monitor
   multifunción del R34: negro azulado mate, líneas de escaneo,
   fósforo blanco/cian y Bayside Blue. Las cifras cambian con
   glitches digitales muy cortos.
     0–5 s    arranque del sistema, faros traseros, "20 años"
     5–11 s   RB26DETT: 280 CV oficiales → ≈330 en banco, soplado
     11–18 s  ATTESA E-TS Pro y Super HICAS en un esquema vectorial
     18–22 s  datos de culto en consola
     22–25 s  insignia GT-R y Sala 02; último segundo fijo
   Cifras de data/cars.json (nissan-skyline-r34); los datos no
   oficiales van rotulados como tales, igual que en la sala.
   ========================================================= */
export const R34MFD = { fps: 30, width: 1080, height: 1920, durationInFrames: 750 };

const { fontFamily: TECH } = loadShareTech("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: MONO } = loadShareTechMono("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: DOT } = loadDotGothic("normal", { weights: ["400"], subsets: ["latin", "japanese"], ignoreTooManyRequestsWarning: true });

const BG = "#05080f";
const BAY = "0, 71, 171";                 // Bayside Blue #0047AB
const PH = "127, 232, 255";               // fósforo cian
const WH = "232, 248, 255";               // fósforo blanco
const RED = "224, 16, 42";
const c = (rgb: string, a = 1) => `rgba(${rgb}, ${a})`;
const CUTS = [150, 330, 540, 660];
const STILL_FROM = 720;
const dry = { damping: 20, stiffness: 220, mass: 0.6 };
const label: React.CSSProperties = { fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase" };

/* ---------- Glitch: capas desplazadas en rojo y cian y cortes horizontales ---------- */
const Glitch: React.FC<{ on: boolean; children: React.ReactNode; seed: string }> = ({ on, children, seed }) => {
  const f = useCurrentFrame();
  if (!on) return <>{children}</>;
  const dx = (random(`${seed}dx${f}`) - 0.5) * 30;
  const cut = Math.floor(random(`${seed}c${f}`) * 70) + 10;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx}px)`, color: c(RED), mixBlendMode: "screen", opacity: 0.8 }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx}px)`, color: c(PH), mixBlendMode: "screen", opacity: 0.8 }}>{children}</div>
      <div style={{ clipPath: `inset(${cut}% 0 ${Math.max(0, 85 - cut)}% 0)`, transform: `translateX(${dx * 1.6}px)` }}>{children}</div>
      <div style={{ clipPath: `inset(0 0 ${100 - cut}% 0)` }}>{children}</div>
    </div>
  );
};

/* ---------- Texto de terminal: se teclea carácter a carácter con cursor ---------- */
const Typed: React.FC<{ text: string; at: number; cps?: number; style?: React.CSSProperties; cursor?: boolean }> = ({ text, at, cps = 1, style, cursor = true }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps)));
  const typing = f >= at && n < text.length;
  return (
    <div style={{ fontFamily: MONO, whiteSpace: "pre", ...style, opacity: f >= at ? 1 : 0 }}>
      {text.slice(0, n)}
      {cursor && (typing || Math.floor(f / 8) % 2 === 0) ? <span style={{ background: c(PH), color: BG }}> </span> : null}
    </div>
  );
};
const typingTicks = (text: string, at: number, cps = 1) =>
  Array.from({ length: Math.ceil(text.length / 2) }, (_, i) => Math.round(at + (i * 2) / cps)).filter((t, i) => text[i * 2] !== " ");

/* ---------- Capa CRT: líneas de escaneo, barrido, curvatura y parpadeo ---------- */
const Crt: React.FC = () => {
  const f = useCurrentFrame();
  const still = f >= STILL_FROM;
  const roll = still ? 30 : (f * 7) % 2100 - 100;
  const flicker = still ? 1 : 0.97 + random(`fl${f}`) * 0.03;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: flicker }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.32) 2px 4px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: roll, height: 140, background: `linear-gradient(180deg, ${c(PH, 0)}, ${c(PH, 0.05)}, ${c(PH, 0)})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 110% 75% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 92%, #000 100%)" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "screen" }}>
        <filter id="r34g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={still ? 0 : f % 24} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#r34g)" />
      </svg>
    </AbsoluteFill>
  );
};

/* Marco de pantalla MFD con su rótulo de modo */
const Frame: React.FC<{ mode: string; kana: string }> = ({ mode, kana }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: 70, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", border: `2px solid ${c(BAY)}`, background: c(BAY, 0.18), ...label, fontSize: 26, color: c(WH) }}>
    <span>{mode}</span>
    <span style={{ fontFamily: DOT, letterSpacing: "0.1em", color: c(PH) }}>{kana}</span>
  </div>
);

/* =========================================================
   ESCENA 1 · Inicialización del sistema (0–5 s)
   ========================================================= */
const BOOT = "BOOTING ATTESA E-TS PRO...";
const Boot: React.FC = () => {
  const f = useCurrentFrame();
  const car = interpolate(f, [40, 80], [0, 1], clamp);
  // Faros traseros: comprobación (parpadeo) y luego encendidos
  const lamp = f < 52 ? 0 : f < 80 ? (Math.floor((f - 52) / 4) % 2 ? 0.15 : 1) : 0.9 + 0.1 * Math.sin(f / 6);
  const W = 1700, H = W * 941 / 1672;
  const left = 540 - 0.72 * W, top = 420;
  const lamps = [[69.5, 33], [74, 34], [89.5, 33]];

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, top: 150, fontSize: 40, color: c(PH) }}>
        <Typed text={BOOT} at={4} cps={1.2} />
        {f >= 34 ? <Typed text="SYSTEM OK." at={34} cps={1.2} style={{ color: c(WH), marginTop: 10 }} /> : null}
        {f >= 44 ? <div style={{ ...label, fontSize: 26, marginTop: 14, color: c(PH, 0.7) }}>BNR34 · RB26DETT · MFD</div> : null}
      </div>

      <div style={{ position: "absolute", left, top, width: W, height: H }}>
        <Img src={staticFile("img/r34-trasera.jpg")} style={{ ...FADE, width: "100%", height: "100%", filter: `brightness(${0.04 + car * 0.55}) saturate(${0.3 + car * 0.8})` }} />
        {lamps.map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: "50%", mixBlendMode: "screen", background: `radial-gradient(closest-side, rgba(255,60,60,${lamp}), rgba(224,16,42,${lamp * 0.55}) 45%, rgba(224,16,42,0) 100%)` }} />
        ))}
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1330, fontFamily: TECH }}>
        <Words text="EL COCHE QUE SE ADELANTÓ 20 AÑOS A SU ÉPOCA." at={84} every={3} size={98} weight={400} hot={["20", "AÑOS"]} accent={c(PH)} color={`rgb(${WH})`} style={{ letterSpacing: "0.01em", lineHeight: 0.98 }} />
      </div>

      {typingTicks(BOOT, 4, 1.2).map((t) => <Sequence key={t} from={t} durationInFrames={3}><Audio src={staticFile("sfx/tick.wav")} volume={0.35} /></Sequence>)}
      <Sequence from={42} durationInFrames={12}><Audio src={staticFile("sfx/beep.wav")} volume={0.5} /></Sequence>
      <Sequence from={52} durationInFrames={24}><Audio src={staticFile("sfx/pulse.wav")} volume={0.6} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 2 · La leyenda del RB26DETT (5–11 s)
   ========================================================= */
const Rb26: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const official = interpolate(f, [24, 60], [0, 280], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const OVER = 104;                                  // sobrecarga: salta al dato real en banco
  const glitching = f >= OVER && f < OVER + 10;
  const real = f >= OVER + 10;
  const power = glitching ? Math.floor(280 + random(`pw${f}`) * 90) : real ? 330 : Math.round(official);
  const boost = spring({ frame: f - 70, fps, config: { damping: 9, stiffness: 120, mass: 0.7 } });   // aguja analógica con su rebote
  const ang = -210 + Math.min(1.08, boost) * (1.0 / 1.2) * 240;
  const GX = 790, GY = 1500, GR = 170;
  const tags = [
    { x: 50, y: 52, text: "BLOQUE DE HIERRO FUNDIDO", at: 12 },
    { x: 86, y: 32, text: "TWIN-TURBO EN PARALELO", at: 22 },
  ];

  return (
    <AbsoluteFill>
      <Frame mode="ENGINE · RB26DETT" kana="エンジン" />
      <div style={{ position: "absolute", left: -90, top: 200, width: 1260, height: 840 }}>
        <Img src={staticFile("img/r34-motor-despiece.jpg")} style={{ ...FADE, width: "100%", height: "100%", filter: "grayscale(0.4) brightness(1.15) contrast(1.3) sepia(0.6) hue-rotate(170deg) saturate(2)" }} />
        {tags.map((t) => (
          <div key={t.text} style={{ position: "absolute", left: `${t.x}%`, top: `${t.y}%`, opacity: f >= t.at ? 1 : 0 }}>
            <div style={{ position: "absolute", left: -10, top: -10, width: 20, height: 20, border: `3px solid ${c(PH)}`, background: f % 8 < 4 ? c(PH) : "transparent" }} />
            <div style={{ position: "absolute", right: 24, top: 18, whiteSpace: "nowrap", padding: "6px 12px", background: c(BAY, 0.85), ...label, fontSize: 24, color: c(WH) }}>
              <Typed text={t.text} at={t.at} cps={2} cursor={false} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1060 }}>
        <div style={{ ...label, fontSize: 28, color: c(PH) }}>{real ? "≈ en banco · dato no oficial" : "Oficiales · pacto de caballeros"}</div>
        <Glitch on={glitching} seed="pw">
          <div style={{ fontFamily: TECH, fontSize: 230, lineHeight: 1, color: c(WH), fontVariantNumeric: "tabular-nums", textShadow: `0 0 18px ${c(PH, 0.35)}` }}>
            {real ? "≈" : ""}{power}<span style={{ fontSize: 80, color: c(PH) }}> CV</span>
          </div>
        </Glitch>
        <div style={{ ...label, fontSize: 24, color: c(WH, 0.6), marginTop: 6 }}>6 en línea · 2.568 cc · biturbo en paralelo</div>
      </div>

      {/* Manómetro de soplado */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 13 }, (_, i) => {
          const a = ((-210 + (i / 12) * 240) * Math.PI) / 180;
          return <line key={i} x1={GX + Math.cos(a) * (GR - 6)} y1={GY + Math.sin(a) * (GR - 6)} x2={GX + Math.cos(a) * (GR - (i % 2 ? 24 : 40))} y2={GY + Math.sin(a) * (GR - (i % 2 ? 24 : 40))} stroke={c(i >= 11 ? RED : WH)} strokeWidth={i % 2 ? 3 : 5} />;
        })}
        <circle cx={GX} cy={GY} r={GR} fill="none" stroke={c(BAY)} strokeWidth="3" />
        <line x1={GX} y1={GY} x2={GX + Math.cos((ang * Math.PI) / 180) * (GR - 30)} y2={GY + Math.sin((ang * Math.PI) / 180) * (GR - 30)} stroke={c(RED)} strokeWidth="6" strokeLinecap="round" />
        <circle cx={GX} cy={GY} r="12" fill={c(WH)} />
        <text x={GX} y={GY + 70} textAnchor="middle" fill={c(WH)} style={{ fontFamily: MONO, fontSize: 40 }}>{(Math.min(1.08, boost) * 1.0).toFixed(1).replace(".", ",")} bar</text>
      </svg>
      <div style={{ position: "absolute", left: 60, top: 1430, width: 480 }}>
        <div style={{ ...label, fontSize: 28, color: c(PH) }}>Soplado turbo</div>
        <div style={{ fontFamily: TECH, fontSize: 70, color: c(WH), marginTop: 8, lineHeight: 1 }}>≈ 1,0 bar</div>
        <div style={{ ...label, fontSize: 20, color: c(WH, 0.5), marginTop: 10, letterSpacing: "0.06em" }}>Aproximado · no oficial</div>
      </div>

      <Sequence from={OVER} durationInFrames={10}><Audio src={staticFile("sfx/glitch.wav")} volume={0.7} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 3 · La física imposible: ATTESA y Super HICAS (11–18 s)
   ========================================================= */
const Physics: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const CORNER = 66;
  const corner = f >= CORNER && f < 150;
  const frontPct = corner ? 50 * spring({ frame: f - CORNER, fps, config: { damping: 22, stiffness: 400, mass: 0.4 } }) : f >= 150 ? 50 * (1 - spring({ frame: f - 150, fps, config: dry })) : 0;
  // HICAS: un instante en contrafase al entrar en la curva y luego en fase (1° real, dibujado ×6)
  const hicas = !corner ? 0 : f < CORNER + 10 ? -1 : 1;
  const hicasEase = spring({ frame: f - (f < CORNER + 10 ? CORNER : CORNER + 10), fps, config: dry });
  const rearDeg = corner ? hicas * hicasEase : 0;
  const frontDeg = corner ? 14 : 0;
  const glitchSplit = f >= CORNER && f < CORNER + 4;

  const CX = 540, CY = 900;
  const wheel = (x: number, y: number, deg: number, hot: boolean) => (
    <rect x={x - 22} y={y - 50} width="44" height="100" rx="8" fill={hot ? c(PH) : c(WH, 0.15)} stroke={c(WH)} strokeWidth="3" transform={`rotate(${deg} ${x} ${y})`} />
  );
  // Donut de reparto: azul = delante, blanco = detrás
  const donut = (pct: number) => {
    const R = 120, L = 2 * Math.PI * R;
    return (
      <g transform={`translate(${CX} 1460) rotate(-90)`}>
        <circle r={R} fill="none" stroke={c(WH, 0.85)} strokeWidth="34" />
        <circle r={R} fill="none" stroke={c(PH)} strokeWidth="34" strokeDasharray={`${(pct / 100) * L} ${L}`} />
      </g>
    );
  };

  return (
    <AbsoluteFill>
      <Frame mode={corner ? "ATTESA · CURVA RÁPIDA" : "ATTESA · RECTA"} kana="トルク配分" />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {/* Trazada */}
        <path d={corner ? `M${CX} 1250 C ${CX} 900, ${CX + 120} 620, ${CX + 360} 470` : `M${CX} 1250 L${CX} 420`} fill="none" stroke={c(BAY)} strokeWidth="6" strokeDasharray="20 16" strokeDashoffset={-f * 6} />
        {/* Coche visto desde arriba */}
        <g transform={`rotate(${corner ? 8 : 0} ${CX} ${CY})`}>
          <rect x={CX - 120} y={CY - 260} width="240" height="520" rx="60" fill={c(BAY, 0.25)} stroke={c(WH)} strokeWidth="4" />
          <line x1={CX} y1={CY - 180} x2={CX} y2={CY + 180} stroke={c(WH, 0.4)} strokeWidth="4" strokeDasharray="10 10" />
          <line x1={CX - 110} y1={CY - 180} x2={CX + 110} y2={CY - 180} stroke={c(PH, frontPct > 1 ? 1 : 0.25)} strokeWidth="6" />
          <line x1={CX - 110} y1={CY + 180} x2={CX + 110} y2={CY + 180} stroke={c(WH)} strokeWidth="6" />
          {wheel(CX - 140, CY - 180, frontDeg, frontPct > 1)}
          {wheel(CX + 140, CY - 180, frontDeg, frontPct > 1)}
          {wheel(CX - 140, CY + 180, rearDeg * 6, true)}
          {wheel(CX + 140, CY + 180, rearDeg * 6, true)}
        </g>
        {donut(frontPct)}
      </svg>

      <div style={{ position: "absolute", left: 60, top: 1300, width: 280, textAlign: "left" }}>
        <div style={{ ...label, fontSize: 26, color: c(PH) }}>Delante</div>
        <Glitch on={glitchSplit} seed="fr"><div style={{ fontFamily: TECH, fontSize: 110, color: c(PH), lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(frontPct)}%</div></Glitch>
      </div>
      <div style={{ position: "absolute", right: 60, top: 1300, width: 280, textAlign: "right" }}>
        <div style={{ ...label, fontSize: 26, color: c(WH) }}>Detrás</div>
        <div style={{ fontFamily: TECH, fontSize: 110, color: c(WH), lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{100 - Math.round(frontPct)}%</div>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 220 }}>
        {corner ? (
          <div style={{ ...label, fontSize: 34, color: c(WH), padding: "12px 18px", background: c(BAY, 0.7), display: "inline-block" }}>Tracción delantera: hasta 50 % en milisegundos</div>
        ) : null}
        <div style={{ ...label, fontSize: 30, color: c(PH), marginTop: 18 }}>
          Super HICAS · ruedas traseras {corner ? `${rearDeg < 0 ? "−" : "+"}${Math.abs(rearDeg).toFixed(1).replace(".", ",")}° ${rearDeg < 0 ? "contrafase" : "en fase"}` : "0,0°"}
        </div>
        <div style={{ ...label, fontSize: 20, color: c(WH, 0.5), marginTop: 6, letterSpacing: "0.06em" }}>Ángulo trasero dibujado ×6 para que se vea</div>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1640, fontFamily: TECH }}>
        <Words text="Ingeniería analógica gobernada por microprocesadores." at={150} every={3} size={66} weight={400} hot={["microprocesadores."]} accent={c(PH)} color={`rgb(${WH})`} />
      </div>

      <Sequence from={CORNER} durationInFrames={10}><Audio src={staticFile("sfx/glitch.wav")} volume={0.5} /></Sequence>
      <Sequence from={CORNER} durationInFrames={24}><Audio src={staticFile("sfx/pulse.wav")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 4 · Datos de culto (18–22 s)
   ========================================================= */
const Cult: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { k: "0-100 km/h", v: "4,8 s", note: "Prueba de prensa, 1999 · no oficial", at: 6 },
    { k: "Tracción", v: "ATTESA E-TS PRO", note: "Reparte el par para no perder motricidad", at: 26 },
  ];
  return (
    <AbsoluteFill>
      <Frame mode="DATA · BNR34" kana="データ" />
      <div style={{ position: "absolute", left: 60, right: 60, top: 230, fontFamily: DOT, fontSize: 64, color: c(PH), letterSpacing: "0.08em" }}>
        スカイライン GT-R
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 380 }}>
        {rows.map((r) => (
          <div key={r.k} style={{ borderTop: `2px solid ${c(BAY)}`, padding: "26px 0", opacity: f >= r.at ? 1 : 0 }}>
            <Typed text={`> ${r.k.toUpperCase()}`} at={r.at} cps={2.5} cursor={false} style={{ fontSize: 34, color: c(PH) }} />
            <Glitch on={f >= r.at + 6 && f < r.at + 10} seed={r.k}>
              <div style={{ fontFamily: TECH, fontSize: 120, lineHeight: 1.05, color: c(WH), opacity: f >= r.at + 6 ? 1 : 0 }}>{r.v}</div>
            </Glitch>
            <div style={{ ...label, fontSize: 24, color: c(WH, 0.55), marginTop: 6, letterSpacing: "0.04em", opacity: f >= r.at + 10 ? 1 : 0 }}>{r.note}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1260, fontFamily: TECH }}>
        <Words text="¿El mejor seis cilindros en línea jamás construido?" at={52} every={3} size={92} weight={400} hot={["seis", "cilindros", "en", "línea"]} accent={c(PH)} color={`rgb(${WH})`} style={{ lineHeight: 1 }} />
      </div>
      {[6, 26].map((t) => <Sequence key={t} from={t + 6} durationInFrames={10}><Audio src={staticFile("sfx/glitch.wav")} volume={0.4} /></Sequence>)}
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 5 · Llamada a la acción (22–25 s)
   ========================================================= */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = interpolate(f, [4, 10, 22], [0, 1.4, 1], clamp);
  const btn = spring({ frame: f - 26, fps, config: dry });
  const W = 2600, H = W * 941 / 1672;

  return (
    <AbsoluteFill>
      {/* La insignia GT-R de la zaga se enciende en rojo */}
      <div style={{ position: "absolute", left: 540 - 0.8 * W, top: 560 - 0.36 * H, width: W, height: H }}>
        <Img src={staticFile("img/r34-trasera.jpg")} style={{ ...FADE, width: "100%", height: "100%", filter: "brightness(0.55)" }} />
        <div style={{ position: "absolute", left: "80%", top: "36%", width: 300, height: 220, marginLeft: -150, marginTop: -110, borderRadius: "50%", mixBlendMode: "screen", background: `radial-gradient(closest-side, rgba(255,40,60,${0.9 * glow}), rgba(224,16,42,${0.35 * glow}) 50%, rgba(224,16,42,0) 100%)` }} />
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG} 0%, rgba(5,8,15,0) 20%, rgba(5,8,15,0) 45%, ${BG} 62%)` }} />

      <div style={{ position: "absolute", left: 60, right: 60, top: 1180, fontFamily: TECH }}>
        <Words text="ANALIZA LA FICHA TÉCNICA COMPLETA" at={10} every={3} size={92} weight={400} hot={["FICHA", "TÉCNICA"]} accent={c(PH)} color={`rgb(${WH})`} style={{ lineHeight: 1 }} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1480, padding: "28px 34px", border: `3px solid ${c(PH)}`, background: c(BAY, 0.55), opacity: f >= 26 ? btn : 0, transform: `translateY(${(1 - btn) * 30}px)` }}>
        <div style={{ fontFamily: TECH, fontSize: 64, color: c(WH), letterSpacing: "0.04em" }}>SALA 02 · MOTORLAB MUSEUM</div>
        <div style={{ ...label, fontSize: 32, color: c(PH), marginTop: 8, textTransform: "none", letterSpacing: "0.06em" }}>motorlabmuseum.com/r34 &gt;</div>
      </div>
      <Sequence from={26} durationInFrames={12}><Audio src={staticFile("sfx/beep.wav")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   MONTAJE
   ========================================================= */
const SCENES: { from: number; to: number; name: string; El: React.FC }[] = [
  { from: 0, to: CUTS[0], name: "1 · Inicialización", El: Boot },
  { from: CUTS[0], to: CUTS[1], name: "2 · RB26DETT", El: Rb26 },
  { from: CUTS[1], to: CUTS[2], name: "3 · ATTESA y HICAS", El: Physics },
  { from: CUTS[2], to: CUTS[3], name: "4 · Datos de culto", El: Cult },
];

export const R34Mfd: React.FC = () => {
  const frame = useCurrentFrame();
  // Corte de escena: un glitch de 4 fotogramas en toda la pantalla
  const g = CUTS.some((cu) => frame >= cu && frame < cu + 4);
  const gx = g ? (random(`cut${frame}`) - 0.5) * 40 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, color: `rgb(${WH})` }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 50% at 50% 40%, ${c(BAY, 0.14)}, rgba(0,0,0,0) 70%)` }} />
      <AbsoluteFill style={{ transform: `translateX(${gx}px)`, filter: g ? "hue-rotate(40deg) saturate(1.6)" : undefined }}>
        {SCENES.map(({ from, to, name, El }) => (
          <Sequence key={name} from={from} durationInFrames={to - from + XFADE} name={name}>
            <Scene dur={to - from + XFADE}><El /></Scene>
          </Sequence>
        ))}
        <Sequence from={CUTS[3]} name="5 · Llamada a la acción"><Scene dur={R34MFD.durationInFrames - CUTS[3]} exit={false}><Cta /></Scene></Sequence>
      </AbsoluteFill>
      {CUTS.map((cu) => <Sequence key={cu} from={cu} durationInFrames={10}><Audio src={staticFile("sfx/glitch.wav")} volume={0.35} /></Sequence>)}
      <Crt />
    </AbsoluteFill>
  );
};
