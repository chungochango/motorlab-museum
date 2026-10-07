import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";
import { bouncy, Carbon, clamp, FADE, Flash, Grain, HEAVY, rgba, Scene, shake, slam, tag, thousands, XFADE } from "./retention/kit";

/* =========================================================
   FERRARI F40 · TIKTOK DE 45 s (1080 × 1920, 30 fps)
   ---------------------------------------------------------
   Guion "1.100 kg. 478 CV. Cero ayudas.":
     0–3 s    gancho: las tres cifras a golpes; el capó sale volando
     3–10 s   chasis tubular de kevlar y carbono (1.100 kg en seco)
     10–20 s  V8 F120A biturbo IHI: 478 CV y el retardo del turbo
     20–35 s  pilotaje puro: sin dirección asistida, servofreno, ABS ni TC
     35–45 s  se recompone el coche · Sala 01 · último segundo y medio fijo
   La voz del guion va como subtítulos (zona segura de TikTok: ni arriba
   del todo ni en el tercio inferior, donde van los botones y el texto).
   Cifras de data/cars.json (ferrari-f40). Sonido: motor real de la sala.
   ========================================================= */
export const F40TT = { fps: 30, width: 1080, height: 1920, durationInFrames: 1350 };

const RED = "212, 0, 0";
const CUTS = [90, 300, 600, 1050];
const STILL_FROM = 1305;
const IMPACTS: [number, number][] = [[2, 24], [10, 16], [18, 30], [32, 18], ...CUTS.map((c): [number, number] => [c, 22]), [500, 36], [640, 20], [760, 20], [790, 20], [880, 20]];

/* Subtítulos de la voz en off: [desde, hasta, texto] en fotogramas absolutos */
const CAPTIONS: [number, number, string][] = [
  [40, 90, "Este coche no te ayuda. Te pone a prueba."],
  [100, 175, "Debajo no hay chapa: tubos de acero…"],
  [175, 240, "…y paneles de kevlar y fibra de carbono."],
  [240, 300, "Por eso pesa 1.100 kilos en seco."],
  [310, 385, "V8 de 2,9 litros con dos turbos IHI."],
  [385, 450, "478 CV a 7.000 rpm y 577 Nm a 4.000."],
  [450, 500, "Y un retardo de turbo legendario:"],
  [500, 600, "abajo no pasa nada… y de repente pasa TODO."],
  [610, 720, "Sin dirección asistida."],
  [730, 840, "Sin servofreno. Sin ABS."],
  [850, 960, "Sin control de tracción."],
  [965, 1050, "Todo lo decide tu pie derecho."],
  [1110, 1200, "Toca cada pieza y mira cómo está hecho."],
  [1200, 1300, "Sala 01, en MotorLab Museum. Entrada libre."],
];

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cap = CAPTIONS.find(([a, b]) => f >= a && f < b);
  if (!cap) return null;
  const s = spring({ frame: f - cap[0], fps, config: { damping: 18, stiffness: 260 } });
  return (
    <div style={{ position: "absolute", left: 70, right: 150, top: 1290, display: "flex", justifyContent: "flex-start" }}>
      <div style={{ padding: "16px 24px", borderRadius: 14, background: "rgba(0,0,0,0.78)", fontSize: 46, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em", transform: `translateY(${(1 - s) * 20}px)`, opacity: s }}>
        {cap[2].split(" ").map((w, i) => <span key={i} style={{ color: /^(TODO\.|1\.100|478|IHI\.|ABS\.|kevlar)/.test(w) ? rgba(RED) : C.white }}>{w} </span>)}
      </div>
    </div>
  );
};

/* Texto que entra a golpes, desde grande (para rótulos y cifras) */
const Slam: React.FC<{ at: number; children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ at, children, size, color = C.white, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: slam });
  const jit = f >= at && f - at < 6 ? (random(`sl${at}-${f}`) - 0.5) * 12 : 0;
  return (
    <div style={{ fontSize: size, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.035em", color, opacity: f >= at ? 1 : 0, transform: `translate(${jit}px, ${jit * 0.5}px) scale(${interpolate(s, [0, 1], [2.2, 1])})`, transformOrigin: "0 50%", ...style }}>
      {children}
    </div>
  );
};

const Photo: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ ...FADE, position: "absolute", objectFit: "contain", ...style }} />
);

/* =========================================================
   0–3 s · Gancho
   ========================================================= */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const fly = interpolate(f, [30, 52], [0, 1], { ...clamp, easing: (t) => t * t });
  const lit = interpolate(f, [0, 20], [0.25, 1], clamp);
  return (
    <AbsoluteFill>
      <Photo src="img/f40-perfil.webp" style={{ left: -30, top: 700, width: 1140, height: 760, filter: `brightness(${lit})` }} />
      {/* El capó trasero sale hacia arriba y deja ver el motor */}
      <Photo src="img/f40-pieza-capo.webp" style={{ left: 600, top: 760, width: 420, height: 280, opacity: f >= 26 ? 1 - fly : 0, transform: `translateY(${-fly * 900}px) rotate(${-fly * 25}deg)` }} />
      <div style={{ position: "absolute", left: 70, top: 260 }}>
        <Slam at={2} size={150}>1.100 KG.</Slam>
        <Slam at={10} size={150}>478 CV.</Slam>
        <Slam at={18} size={150} color={rgba(RED)}>CERO AYUDAS.</Slam>
        <div style={{ marginTop: 26, fontSize: 40, fontWeight: 500, color: C.platinum, opacity: interpolate(f, [36, 46], [0, 1], clamp) }}>El último Ferrari que aprobó Enzo.</div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   3–10 s · Chasis
   ========================================================= */
const Chassis: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = interpolate(f, [4, 40], [0, 100], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });   // la carrocería se retira y queda el chasis
  const pan = interpolate(f, [30, 210], [140, -140], clamp);
  const kg = interpolate(f, [60, 140], [0, 1100], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: -200, top: 680, width: 1480, height: 987, transform: `translateX(${pan}px)` }}>
        <Photo src="img/f40-pieza-chasis.webp" style={{ inset: 0, width: "100%", height: "100%" }} />
        <Photo src="img/f40-perfil.webp" style={{ inset: 0, width: "100%", height: "100%", clipPath: `inset(0 0 0 ${reveal}%)` }} />
        {reveal < 100 ? <div style={{ position: "absolute", top: "18%", bottom: "30%", left: `${reveal}%`, width: 4, background: rgba(RED), boxShadow: `0 0 18px ${rgba(RED, 0.8)}` }} /> : null}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 250 }}>
        <Slam at={8} size={96}>CHASIS TUBULAR</Slam>
        <Slam at={20} size={64} color={rgba(RED)} style={{ marginTop: 14 }}>+ PANELES DE KEVLAR Y CARBONO</Slam>
      </div>
      <div style={{ position: "absolute", right: 150, top: 560, textAlign: "right", opacity: interpolate(f, [56, 66], [0, 1], clamp) }}>
        <div style={{ ...tag, fontSize: 26, color: C.grey }}>En seco</div>
        <div style={{ fontSize: 110, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{thousands(kg)}<span style={{ fontSize: 44, color: rgba(RED) }}> kg</span></div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   10–20 s · Motor F120A
   ========================================================= */
const POINTS = [
  { x: 52, y: 50, label: "Bloque V8 F120A", at: 20 },
  { x: 17, y: 38, label: "Turbo IHI × 2", at: 60 },
  { x: 30, y: 62, label: "Colectores de escape", at: 100 },
];
const Engine: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const HIT = 200;                                       // "…y de repente pasa TODO" (fotograma 500 del vídeo)
  const zoom = interpolate(f, [0, HIT], [1, 1.3], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) }) + (f >= HIT ? interpolate(f, [HIT, HIT + 6, HIT + 30], [0, 0.12, 0.06], clamp) : 0);
  const power = spring({ frame: f - HIT, fps, config: bouncy });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: -110, top: 540, width: 1300, height: 867, transform: `scale(${zoom})`, transformOrigin: "45% 50%" }}>
        <Photo src="img/f40-pieza-motor.webp" style={{ inset: 0, width: "100%", height: "100%", filter: f >= HIT && f < HIT + 8 ? "brightness(1.6)" : undefined }} />
        {POINTS.map((p, i) => {
          const s = spring({ frame: f - p.at, fps, config: bouncy });
          const blink = Math.floor(f / 4) % 2 ? 1 : 0.4;
          return (
            <div key={p.label} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, opacity: f >= p.at ? 1 : 0, transform: `scale(${s / zoom})` }}>
              <div style={{ position: "absolute", left: -24, top: -24, width: 48, height: 48, borderRadius: "50%", border: `3px solid ${C.white}`, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", fontSize: 24, fontWeight: 800 }}>
                <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: rgba(RED, blink) }} />
                <span style={{ position: "relative" }}>{i + 1}</span>
              </div>
              <div style={{ position: "absolute", left: 36, top: -30, whiteSpace: "nowrap", padding: "10px 16px", background: "rgba(0,0,0,0.85)", border: `2px solid ${rgba(RED)}`, borderRadius: 4, fontSize: 32, fontWeight: 800 }}>{p.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 250 }}>
        <Slam at={6} size={92}>V8 F120A</Slam>
        <Slam at={18} size={60} color={rgba(RED)} style={{ marginTop: 10 }}>2.936 CC · BITURBO IHI</Slam>
      </div>
      {/* Golpe del turbo: 478 CV */}
      <div style={{ position: "absolute", right: 150, top: 520, opacity: f >= HIT ? 1 : 0, transform: `scale(${0.4 + 0.6 * power})`, transformOrigin: "100% 50%" }}>
        <div style={{ fontSize: 170, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, color: C.white, textShadow: `0 6px 24px rgba(0,0,0,0.8)` }}>478<span style={{ fontSize: 70, color: rgba(RED) }}> CV</span></div>
      </div>
      {POINTS.map((p) => <Sequence key={p.at} from={p.at} durationInFrames={3}><Audio src={staticFile("sfx/tick.wav")} volume={0.5} /></Sequence>)}
      <Sequence from={HIT - 4} durationInFrames={110}><Audio src={staticFile("sfx/f40-engine.mp3")} volume={1} startFrom={60} /></Sequence>
      <Sequence from={HIT} durationInFrames={40}><Audio src={staticFile("sfx/impact.wav")} volume={0.7} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   20–35 s · Pilotaje puro: cada ayuda se tacha
   ========================================================= */
const Strike: React.FC<{ at: number; text: string }> = ({ at, text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = spring({ frame: f - at, fps, config: { damping: 16, stiffness: 220 } });
  const line = interpolate(f, [at + 10, at + 18], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const stamp = spring({ frame: f - (at + 20), fps, config: slam });
  return (
    <div style={{ position: "relative", marginTop: 64, opacity: f >= at ? 1 : 0 }}>
      <div style={{ display: "inline-block", position: "relative", fontSize: text.length > 16 ? 64 : 78, whiteSpace: "nowrap", fontWeight: 900, letterSpacing: "-0.03em", color: rgba("245,245,244", 0.5 + 0.5 * (1 - line)), transform: `translateY(${(1 - word) * 30}px)` }}>
        {text}
        <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 10, background: rgba(RED), transform: `scaleX(${line}) rotate(-2deg)`, transformOrigin: "0 50%" }} />
      </div>
      <div style={{ position: "absolute", left: -6, top: -40, padding: "4px 14px", background: rgba(RED), fontSize: 44, fontWeight: 900, letterSpacing: "0.04em", opacity: f >= at + 20 ? 1 : 0, transform: `scale(${interpolate(stamp, [0, 1], [2, 1])}) rotate(-6deg)`, transformOrigin: "0 100%" }}>SIN</div>
    </div>
  );
};

const CUT_LEN = 120;
const DRIVE = [
  { img: "img/f40-pieza-cockpit.webp", items: ["DIRECCIÓN ASISTIDA"] },
  { img: "img/f40-pieza-frenos.webp", items: ["SERVOFRENO", "ABS"] },
  { img: "img/f40-pieza-suspension.webp", items: ["CONTROL DE TRACCIÓN"] },
];
const Drive: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.min(DRIVE.length, Math.floor(f / CUT_LEN));
  const local = f - k * CUT_LEN;
  const cut = interpolate(local, [0, 4], [1.15, 1], clamp);
  return (
    <AbsoluteFill>
      {k < DRIVE.length ? (
        <>
          <div style={{ position: "absolute", left: -120, top: 660, width: 1320, height: 880, transform: `scale(${cut * interpolate(local, [0, CUT_LEN], [1, 1.12])})` }}>
            <Photo src={DRIVE[k].img} style={{ inset: 0, width: "100%", height: "100%" }} />
          </div>
          <div style={{ position: "absolute", left: 90, right: 120, top: 270 }}>
            {DRIVE[k].items.map((t, i) => <Strike key={t} at={k * CUT_LEN + 6 + i * 30} text={t} />)}
          </div>
          {DRIVE[k].items.map((t, i) => <Sequence key={t} from={k * CUT_LEN + 26 + i * 30} durationInFrames={30}><Audio src={staticFile("sfx/impact.wav")} volume={0.45} /></Sequence>)}
        </>
      ) : (
        /* Remate del bloque: el coche entero y sus cifras */
        <>
          <Photo src="img/f40-perfil.webp" style={{ left: -30, top: 700, width: 1140, height: 760 }} />
          <div style={{ position: "absolute", left: 70, right: 70, top: 300 }}>
            <Slam at={0} size={110}>0–100: 4,1 s</Slam>
            <Slam at={14} size={110} color={rgba(RED)}>324 km/h</Slam>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/* =========================================================
   35–45 s · Se recompone · Sala 01
   ========================================================= */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wing = interpolate(f, [0, 36], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const whole = interpolate(f, [30, 54], [0, 1], clamp);
  const pull = interpolate(f, [30, 200], [1.25, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const card = spring({ frame: f - 70, fps, config: bouncy });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: -30, top: 720, width: 1140, height: 760, transform: `scale(${pull})` }}>
        <Photo src="img/f40-pieza-aero.webp" style={{ inset: 0, width: "100%", height: "100%", opacity: 1 - whole, transform: `translateY(${(1 - wing) * -500}px)` }} />
        <Photo src="img/f40-perfil.webp" style={{ inset: 0, width: "100%", height: "100%", opacity: whole }} />
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 260 }}>
        <Slam at={20} size={100}>DESMÓNTALO</Slam>
        <Slam at={30} size={100} color={rgba(RED)}>PIEZA A PIEZA</Slam>
      </div>
      <div style={{ position: "absolute", left: 70, right: 150, top: 560, padding: "26px 30px", borderRadius: 14, background: "rgba(10,10,12,0.9)", border: `2px solid ${rgba(RED)}`, opacity: f >= 70 ? 1 : 0, transform: `scale(${0.7 + 0.3 * card})`, transformOrigin: "0 50%", display: "flex", alignItems: "center", gap: 24 }}>
        <Img src={staticFile("img/logo-mark.png")} style={{ width: 84, height: 84 }} />
        <div>
          <div style={{ ...tag, fontSize: 30, color: C.platinum }}>Sala 01 · Entrada libre</div>
          <div style={{ marginTop: 6, fontSize: 44, fontWeight: 900 }}>motorlabmuseum.com/f40</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   MONTAJE
   ========================================================= */
const SCENES: { from: number; to: number; name: string; El: React.FC }[] = [
  { from: 0, to: CUTS[0], name: "1 · Gancho", El: Hook },
  { from: CUTS[0], to: CUTS[1], name: "2 · Chasis", El: Chassis },
  { from: CUTS[1], to: CUTS[2], name: "3 · Motor", El: Engine },
  { from: CUTS[2], to: CUTS[3], name: "4 · Pilotaje puro", El: Drive },
];

export const F40Tiktok: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: HEAVY, color: C.white }}>
      <AbsoluteFill style={{ transform: frame >= STILL_FROM ? "none" : shake(frame, IMPACTS) }}>
        <AbsoluteFill style={{ filter: "brightness(0.6)" }}><Carbon /></AbsoluteFill>
        {SCENES.map(({ from, to, name, El }) => (
          <Sequence key={name} from={from} durationInFrames={to - from + XFADE} name={name}>
            <Scene dur={to - from + XFADE}><El /></Scene>
          </Sequence>
        ))}
        <Sequence from={CUTS[3]} name="5 · Sala 01"><Scene dur={F40TT.durationInFrames - CUTS[3]} exit={false}><Outro /></Scene></Sequence>
        <Captions />
      </AbsoluteFill>
      {/* Arranque del V8, cortado en seco al tercer golpe ("CERO AYUDAS.") */}
      <Sequence from={0} durationInFrames={20}><Audio src={staticFile("sfx/f40-engine.mp3")} volume={0.9} /></Sequence>
      {[2, 10, 18].map((t) => <Sequence key={t} from={t} durationInFrames={30}><Audio src={staticFile("sfx/impact.wav")} volume={t === 18 ? 0.9 : 0.5} /></Sequence>)}
      {CUTS.map((c) => <Sequence key={c} from={c} durationInFrames={20}><Audio src={staticFile("sfx/pulse.wav")} volume={0.35} /></Sequence>)}
      <Flash cuts={CUTS} rgb={RED} />
      <Grain stillFrom={STILL_FROM} />
    </AbsoluteFill>
  );
};
