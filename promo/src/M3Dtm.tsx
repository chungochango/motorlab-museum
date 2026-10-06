import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadBarlow } from "@remotion/google-fonts/Barlow";
import { loadFont as loadBarlowCondensed } from "@remotion/google-fonts/BarlowCondensed";
import { clamp } from "./retention/kit";

/* =========================================================
   BMW M3 E30 SPORT EVOLUTION · CUADERNO DE HOMOLOGACIÓN DTM
   25 s · 1080 × 1920 · 30 fps · Sala 04 de MotorLab Museum
   ---------------------------------------------------------
   Expediente técnico de carreras: papel de plano y gris
   asfalto con retícula de blueprint, cotas que se dibujan
   solas y las fotos del museo como "figuras" del archivo.
   Acentos con los tres colores de BMW M. Transiciones de
   barrido mecánico (sin desenfoques ni halos).
     0–5 s    gancho de la homologación y pasos de rueda
     5–11 s   motor S14 atmosférico y cuentavueltas vertical
     11–18 s  báscula: 1.200 kg, aerodinámica y reparto de pesos
     18–22 s  caja Getrag dog-leg
     22–25 s  llamada a la acción; último segundo fijo
   Cifras de data/cars.json (bmw-m3-e30).
   ========================================================= */
export const M3DTM = { fps: 30, width: 1080, height: 1920, durationInFrames: 750 };

const { fontFamily: BODY } = loadBarlow("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
const { fontFamily: COND } = loadBarlowCondensed("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] });

const LB = "#0088cc", DB = "#001f5c", RD = "#e51d24";      // azul claro, azul oscuro y rojo de BMW M
const PAPER = "#f3f2ee", INK = "#14171c", ASPH = "#2b2e33";
const CUTS = [150, 330, 540, 660];
const STILL_FROM = 720;
const WIPE = 8;                                 // barrido mecánico entre escenas: 8 fotogramas
const dry = { damping: 22, stiffness: 260, mass: 0.6 };

const lab: React.CSSProperties = { fontFamily: COND, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" };
const big: React.CSSProperties = { fontFamily: COND, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.94, letterSpacing: "-0.005em" };

/* ---------- Fondos ---------- */
const Paper: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(rgba(20,23,28,0.05) 1px, transparent 1px) 0 0 / 30px 30px, linear-gradient(90deg, rgba(20,23,28,0.05) 1px, transparent 1px) 0 0 / 30px 30px, linear-gradient(rgba(20,23,28,0.1) 1px, transparent 1px) 0 0 / 150px 150px, linear-gradient(90deg, rgba(20,23,28,0.1) 1px, transparent 1px) 0 0 / 150px 150px, ${PAPER}` }} />
);
const Blueprint: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 30px 30px, linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 30px 30px, linear-gradient(rgba(0,136,204,0.16) 1px, transparent 1px) 0 0 / 150px 150px, linear-gradient(90deg, rgba(0,136,204,0.16) 1px, transparent 1px) 0 0 / 150px 150px, ${ASPH}` }} />
);

/* ---------- Escena con barrido mecánico de entrada (la anterior queda debajo) ---------- */
const Wipe: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame();
  const p = first ? 1 : interpolate(f, [0, WIPE], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
      {children}
      {p < 1 ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${p * 100}%`, width: 54, marginLeft: -54, display: "flex" }}>
          <div style={{ flex: 1, background: LB }} /><div style={{ flex: 1, background: DB }} /><div style={{ flex: 1, background: RD }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- Figura de archivo: foto del museo montada como lámina numerada ---------- */
const Figure: React.FC<{ src: string; n: number; caption: string; x: number; y: number; w: number; ar: number; at: number; dark?: boolean; children?: React.ReactNode }> = ({ src, n, caption, x, y, w, ar, at, dark, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: dry });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: f >= at ? 1 : 0, transform: `translateY(${(1 - s) * 40}px)` }}>
      <div style={{ position: "relative", width: w, height: w / ar, background: "#000", boxShadow: dark ? "0 2px 3px rgba(0,0,0,0.5), 0 22px 40px -18px rgba(0,0,0,0.8)" : "0 2px 3px rgba(20,23,28,0.25), 0 22px 40px -20px rgba(20,23,28,0.45)", clipPath: `inset(0 ${(1 - s) * 100}% 0 0)` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {children}
      </div>
      <div style={{ ...lab, fontSize: 22, marginTop: 12, color: dark ? "rgba(255,255,255,0.65)" : "rgba(20,23,28,0.6)" }}>Fig. {n} — {caption}</div>
    </div>
  );
};

/* ---------- Línea de cota que se dibuja sola ---------- */
const Dim: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; text: string; color?: string }> = ({ x1, y1, x2, y2, at, text, color = INK }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 16], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const horiz = y1 === y2;
  const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
  const tick = (x: number, y: number) => (horiz ? <line x1={x} y1={y - 16} x2={x} y2={y + 16} stroke={color} strokeWidth="2" /> : <line x1={x - 16} y1={y} x2={x + 16} y2={y} stroke={color} strokeWidth="2" />);
  return (
    <g opacity={f >= at ? 1 : 0}>
      {tick(x1, y1)}
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth="2" />
      {p >= 1 ? tick(x2, y2) : null}
      <text x={(x1 + x2) / 2 + (horiz ? 0 : 22)} y={(y1 + y2) / 2 + (horiz ? -14 : 8)} textAnchor={horiz ? "middle" : "start"} fill={color} opacity={p >= 1 ? 1 : 0} style={{ fontFamily: COND, fontSize: 24, fontWeight: 600, letterSpacing: "0.14em" }}>{text}</text>
    </g>
  );
};

/* ---------- Texto que entra palabra a palabra, seco ---------- */
const Line: React.FC<{ text: string; at: number; size: number; color: string; hot?: Record<string, string>; style?: React.CSSProperties; every?: number }> = ({ text, at, size, color, hot = {}, style, every = 3 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.24, ...big, fontSize: size, ...style }}>
      {text.split(" ").map((w, i) => {
        const s = spring({ frame: f - (at + i * every), fps, config: dry });
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.04 }}>
            <span style={{ display: "inline-block", color: hot[w] ?? color, transform: `translateY(${(1 - s) * 105}%)` }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/* =========================================================
   ESCENA 1 · Gancho de la homologación (0–5 s)
   ========================================================= */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const FX = 60, FY = 760, FW = 960, AR = 1536 / 1024, FH = FW / AR;
  // Pasos de rueda ensanchados: arcos rojos que se dibujan sobre la foto
  const arch = interpolate(f, [70, 92], [0, 1], clamp);
  const wheels = [[17.2, 54.5], [76.2, 54.5]];
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", left: 60, top: 70, right: 60, display: "flex", justifyContent: "space-between", ...lab, fontSize: 24, color: "rgba(20,23,28,0.6)" }}>
        <span>Expediente de homologación · Grupo A</span><span style={{ color: RD }}>DTM</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 170 }}>
        <Line text="NO NACIÓ PARA LA CALLE." at={4} size={120} color={INK} />
        <Line text="NACIÓ PARA DESTRUIR EL DTM." at={20} size={120} color={DB} hot={{ "DTM.": RD }} style={{ marginTop: 10 }} />
      </div>

      <Figure src="img/m3-perfil.jpg" n={1} caption="M3 Sport Evolution, vista lateral" x={FX} y={FY} w={FW} ar={AR} at={38}>
        {/* En píxeles de la lámina: arcos sobre los pasos de rueda (centro y radio en % del ancho) */}
        <svg viewBox={`0 0 ${FW} ${FH}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {wheels.map(([x, y], i) => {
            const cx = (x / 100) * FW, cy = (y / 100) * FH, r = 0.105 * FW;
            const d = `M ${cx - r} ${cy + 6} A ${r} ${r} 0 0 1 ${cx + r} ${cy + 6}`;
            // Filo blanco debajo: el rojo se lee incluso sobre la carrocería roja
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arch} />
                <path d={d} fill="none" stroke={RD} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arch} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", left: "8%", top: "12%", padding: "6px 12px", background: RD, color: "#fff", ...lab, fontSize: 22, opacity: arch >= 1 ? 1 : 0 }}>Box flares · pasos ensanchados</div>
      </Figure>

      {/* Cotas y regla milimétrica */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Dim x1={FX + 0.172 * FW} y1={FY + FH + 120} x2={FX + 0.762 * FW} y2={FY + FH + 120} at={56} text="BATALLA" />
        <Dim x1={FX - 30} y1={FY + 0.18 * FH} x2={FX - 30} y2={FY + 0.62 * FH} at={64} text="" />
        {Array.from({ length: 61 }, (_, i) => {
          const p = interpolate(f, [44, 80], [0, 61], clamp);
          return i < p ? <line key={i} x1={FX + i * 16} y1={FY - 20} x2={FX + i * 16} y2={FY - 20 - (i % 10 === 0 ? 22 : i % 5 === 0 ? 14 : 8)} stroke={INK} strokeWidth="2" /> : null;
        })}
        <text x={FX + FW} y={FY - 52} textAnchor="end" fill={INK} opacity={f >= 80 ? 0.7 : 0} style={{ fontFamily: COND, fontSize: 22, fontWeight: 600, letterSpacing: "0.14em" }}>ESCALA · MM</text>
      </svg>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1600 }}>
        <Line text="5.000 unidades de calle por reglamento." at={96} size={64} color={INK} hot={{ "5.000": LB }} every={2} style={{ textTransform: "none", fontWeight: 600 }} />
        <Line text="El resto es historia." at={112} size={64} color={DB} every={2} style={{ textTransform: "none", fontWeight: 600, marginTop: 8 }} />
      </div>
      {[56, 64].map((t) => <Sequence key={t} from={t} durationInFrames={3}><Audio src={staticFile("sfx/tick.wav")} volume={0.4} /></Sequence>)}
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 2 · El corazón S14 atmosférico (5–11 s)
   ========================================================= */
const S14: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rpm = interpolate(f, [40, 120], [1000, 7000], { ...clamp, easing: (t) => t * t * 0.4 + t * 0.6 });
  const settle = spring({ frame: f - 120, fps, config: { damping: 12, stiffness: 300, mass: 0.4 } });
  const needleJit = f >= 40 && f < 120 ? (random(`n${f}`) - 0.5) * 3 : (1 - settle) * 8;
  const GX = 880, GTOP = 820, GH = 820;                       // cuentavueltas vertical
  const gy = (r: number) => GTOP + GH - ((r - 1000) / 7000) * GH;
  const tags = [
    { x: 70, y: 12, text: "4 mariposas individuales", at: 20 },
    { x: 30, y: 62, text: "S14B25 · 4 cil. · 2,5 L", at: 32 },
  ];
  return (
    <AbsoluteFill>
      <Blueprint />
      <div style={{ position: "absolute", left: 60, top: 70, ...lab, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>Plano 02 · Motor</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 140 }}>
        <Line text="Motor S14" at={4} size={130} color="#fff" />
        <Line text="4 cilindros atmosférico" at={10} size={70} color={LB} style={{ marginTop: 4 }} />
      </div>

      <Figure src="img/m3-despiece-motor.jpg" n={2} caption="S14B25, despiece del museo" x={60} y={500} w={720} ar={1.5} at={6} dark>
        {tags.map((t) => (
          <div key={t.text} style={{ position: "absolute", left: `${t.x}%`, top: `${t.y}%`, opacity: f >= t.at ? 1 : 0 }}>
            <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: "50%", background: RD, border: "3px solid #fff" }} />
            <div style={{ position: "absolute", left: t.x > 50 ? undefined : 20, right: t.x > 50 ? 20 : undefined, top: 16, whiteSpace: "nowrap", padding: "6px 12px", background: "#fff", color: INK, ...lab, fontSize: 24 }}>{t.text}</div>
          </div>
        ))}
      </Figure>

      {/* Cuentavueltas vertical */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <rect x={GX - 36} y={GTOP - 10} width="72" height={GH + 20} fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        {Array.from({ length: 15 }, (_, i) => {
          const r = 1000 + i * 500, y = gy(r);
          return (
            <g key={i}>
              <line x1={GX - 36} y1={y} x2={GX - 36 + (i % 2 ? 18 : 30)} y2={y} stroke={r >= 7000 ? RD : "#fff"} strokeWidth={i % 2 ? 2 : 3} />
              {i % 2 === 0 ? <text x={GX - 50} y={y + 8} textAnchor="end" fill="rgba(255,255,255,0.7)" style={{ fontFamily: COND, fontSize: 24, fontWeight: 600 }}>{r / 1000}</text> : null}
            </g>
          );
        })}
        <rect x={GX - 30} y={gy(rpm)} width="60" height={GTOP + GH - gy(rpm)} fill={LB} opacity="0.35" />
        <g transform={`translate(0 ${gy(rpm) + needleJit})`}>
          <path d={`M${GX - 52} 0 L${GX + 46} 0`} stroke={RD} strokeWidth="6" strokeLinecap="round" />
          <path d={`M${GX + 46} -12 L${GX + 66} 0 L${GX + 46} 12 Z`} fill={RD} />
        </g>
        <text x={GX} y={GTOP - 30} textAnchor="middle" fill="#fff" style={{ fontFamily: COND, fontSize: 24, fontWeight: 600, letterSpacing: "0.14em" }}>×1000 RPM</text>
      </svg>
      <div style={{ position: "absolute", left: 60, top: 1080 }}>
        <div style={{ ...lab, fontSize: 26, color: "rgba(255,255,255,0.6)" }}>Régimen</div>
        <div style={{ ...big, fontSize: 150, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{String(Math.round(rpm / 50) * 50).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}<span style={{ fontSize: 56, color: LB }}> rpm</span></div>
        <div style={{ ...lab, fontSize: 26, color: "#fff", marginTop: 10, opacity: f >= 120 ? 1 : 0 }}>238 CV a 7.000 rpm</div>
      </div>

      <div style={{ position: "absolute", left: 60, right: 260, top: 1430 }}>
        <Line text="Sin turbos." at={70} size={110} color="#fff" />
        <Line text="Pura respuesta de gas." at={82} size={110} color={RD} />
      </div>
      {Array.from({ length: 14 }, (_, i) => 40 + i * 6).map((t) => <Sequence key={t} from={t} durationInFrames={3}><Audio src={staticFile("sfx/tick.wav")} volume={0.3} /></Sequence>)}
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 3 · La obsesión por el peso (11–18 s)
   ========================================================= */
const Weight: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const DROP = 18;
  const fall = spring({ frame: f - DROP, fps, config: { damping: 14, stiffness: 320, mass: 0.9 } });
  const hit = f - (DROP + 7);
  const quake = hit >= 0 && hit < 12 ? (random(`q${f}`) - 0.5) * 26 * Math.exp(-hit / 3) : 0;
  const balance = interpolate(f, [140, 170], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });

  return (
    <AbsoluteFill style={{ transform: `translate(${quake}px, ${quake * 0.6}px)` }}>
      <Blueprint />
      <div style={{ position: "absolute", left: 60, top: 70, ...lab, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>Plano 03 · Báscula de verificación</div>

      {/* Báscula de pesaje: cuatro plataformas y lectura central */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {[[200, 260], [880, 260], [200, 640], [880, 640]].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 90} y={y - 70} width="180" height="140" fill="rgba(0,0,0,0.3)" stroke="#fff" strokeWidth="3" />
            <line x1={x - 60} y1={y} x2={x + 60} y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="8 8" />
          </g>
        ))}
        <rect x="290" y="210" width="500" height="480" rx="40" fill="none" stroke={LB} strokeWidth="3" strokeDasharray="14 10" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center" }}>
        <div style={{ ...lab, fontSize: 28, color: "rgba(255,255,255,0.7)" }}>Peso total · calle</div>
        <div style={{ ...big, fontSize: 210, color: "#fff", fontVariantNumeric: "tabular-nums", transform: `translateY(${(1 - fall) * -700}px)`, opacity: f >= DROP ? 1 : 0 }}>
          1.200<span style={{ fontSize: 80, color: LB }}> kg</span>
        </div>
        <div style={{ ...lab, fontSize: 28, color: RD, marginTop: 6, opacity: f >= DROP + 20 ? 1 : 0 }}>980 kg en especificación DTM</div>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 820 }}>
        <Line text="Un M3 actual pesa unos 500 kg más." at={40} size={66} color="#fff" hot={{ "500": RD, "kg": RD }} every={2} style={{ textTransform: "none", fontWeight: 600 }} />
      </div>

      <Figure src="img/m3-despiece-aero.jpg" n={3} caption="Alerón regulable del Evolution" x={60} y={1000} w={600} ar={1.5} at={64} dark />
      <div style={{ position: "absolute", left: 700, right: 60, top: 1010 }}>
        <Line text="Luneta más inclinada y alerón regulable" at={72} size={50} color="#fff" every={2} style={{ textTransform: "none", fontWeight: 600, lineHeight: 1.05 }} />
        <div style={{ ...big, fontSize: 64, marginTop: 20, color: LB, opacity: f >= 96 ? 1 : 0 }}>+Downforce</div>
        <div style={{ ...big, fontSize: 64, color: RD, opacity: f >= 102 ? 1 : 0 }}>−Resistencia</div>
      </div>

      {/* Pizarra: reparto de pesos */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1500, padding: "30px 34px", background: "rgba(0,0,0,0.35)", border: "2px solid rgba(255,255,255,0.35)", opacity: f >= 130 ? 1 : 0 }}>
        <Line text="Distribución de pesos casi 50:50." at={132} size={62} color="#fff" every={2} hot={{ "50:50.": LB }} style={{ textTransform: "none", fontWeight: 600 }} />
        <div style={{ display: "flex", height: 26, marginTop: 24, background: "rgba(255,255,255,0.1)" }}>
          <div style={{ width: `${50 * balance}%`, background: LB }} />
          <div style={{ width: 4, background: "#fff" }} />
          <div style={{ width: `${50 * balance}%`, background: DB }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", ...lab, fontSize: 22, color: "rgba(255,255,255,0.7)", marginTop: 10 }}><span>Delante</span><span>Detrás</span></div>
      </div>
      <Sequence from={DROP + 6} durationInFrames={40}><Audio src={staticFile("sfx/impact.wav")} volume={0.9} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 4 · Sensación purista: Getrag dog-leg (18–22 s)
   ========================================================= */
const Gearbox: React.FC = () => {
  const f = useCurrentFrame();
  // Rejilla dog-leg: 1ª atrás a la izquierda; 2-3 en el centro; 4-5 a la derecha (R arriba a la izquierda)
  const X = [300, 540, 780], Y0 = 520, Y1 = 820;
  const gates: Record<string, [number, number]> = { R: [X[0], Y0], "1": [X[0], Y1], "2": [X[1], Y0], "3": [X[1], Y1], "4": [X[2], Y0], "5": [X[2], Y1] };
  const N: [number, number] = [X[1], (Y0 + Y1) / 2];
  const seq: [number, number][] = [N, gates["1"], N, gates["2"], gates["3"], N, gates["4"], gates["5"]];
  const t = interpolate(f, [10, 70], [0, seq.length - 1], clamp);
  const i = Math.min(seq.length - 2, Math.floor(t)), k = t - i;
  const ease = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const kx = seq[i][0] + (seq[i + 1][0] - seq[i][0]) * ease, ky = seq[i][1] + (seq[i + 1][1] - seq[i][1]) * ease;
  const gate = interpolate(f, [0, 10], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", left: 60, top: 70, ...lab, fontSize: 24, color: "rgba(20,23,28,0.6)" }}>Plano 04 · Getrag 265 · dog-leg</div>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g opacity={gate} stroke={INK} strokeWidth="10" strokeLinecap="round" fill="none">
          <path d={`M${X[0]} ${Y0} V${Y1} M${X[0]} ${N[1]} H${X[2]} M${X[1]} ${Y0} V${Y1} M${X[2]} ${Y0} V${Y1}`} />
        </g>
        {Object.entries(gates).map(([g, [x, y]]) => (
          <g key={g} opacity={gate}>
            <circle cx={x} cy={y} r="48" fill={g === "1" ? RD : PAPER} stroke={INK} strokeWidth="4" />
            <text x={x} y={y + 16} textAnchor="middle" fill={g === "1" ? "#fff" : INK} style={{ fontFamily: COND, fontSize: 48, fontWeight: 700 }}>{g}</text>
          </g>
        ))}
        <circle cx={kx} cy={ky} r="30" fill={DB} stroke="#fff" strokeWidth="5" />
        <text x={X[0] - 70} y={Y1 + 100} fill={RD} style={{ fontFamily: COND, fontSize: 30, fontWeight: 700, letterSpacing: "0.12em" }}>1ª ATRÁS A LA IZQUIERDA</text>
      </svg>
      <div style={{ position: "absolute", left: 60, right: 60, top: 180 }}>
        <Line text="Caja de carreras en un coche de calle." at={2} size={80} color={INK} every={2} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1100 }}>
        <Line text="¿Prefieres 1.000 CV modernos o 238 CV analógicos sin ayudas?" at={44} size={100} color={INK} every={2} hot={{ "238": RD, "analógicos": DB }} />
      </div>
      {[16, 25, 33, 42, 50, 59, 67].map((t) => <Sequence key={t} from={t} durationInFrames={3}><Audio src={staticFile("sfx/tick.wav")} volume={0.5} /></Sequence>)}
    </AbsoluteFill>
  );
};

/* =========================================================
   ESCENA 5 · Llamada a la acción (22–25 s)
   ========================================================= */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bands = [LB, DB, RD].map((_, i) => interpolate(f, [2 + i * 4, 14 + i * 4], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) }));
  const btn = spring({ frame: f - 26, fps, config: dry });
  return (
    <AbsoluteFill>
      <Paper />
      {/* Tres bandas de los colores M que se trazan en diagonal */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 420, display: "flex", gap: 24, transform: "skewX(-18deg)" }}>
        {[LB, DB, RD].map((col, i) => (
          <div key={col} style={{ flex: 1, background: col, clipPath: `inset(${(1 - bands[i]) * 100}% 0 0 0)` }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 800 }}>
        <Line text="VIVE LA LEYENDA DEL TOURING CAR" at={14} size={120} color={INK} hot={{ "TOURING": DB, "CAR": DB }} every={2} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1300, padding: "34px 40px", background: INK, color: "#fff", opacity: f >= 26 ? 1 : 0, transform: `translateX(${(1 - btn) * -60}px)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 8, display: "flex" }}><div style={{ flex: 1, background: LB }} /><div style={{ flex: 1, background: DB }} /><div style={{ flex: 1, background: RD }} /></div>
        <div>
          <div style={{ ...big, fontSize: 70 }}>Sala 04 · Acceso gratuito</div>
          <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 34, marginTop: 10, color: "#9fd6f2" }}>motorlabmuseum.com/m3</div>
        </div>
        <svg viewBox="0 0 16 12" width="56" height="42" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h14M10 1l5 5-5 5" /></svg>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 110, fontFamily: BODY, fontSize: 26, color: "rgba(20,23,28,0.55)", opacity: f >= 40 ? 1 : 0 }}>
        MotorLab Museum · Proyecto interactivo de ingeniería sin ánimo de lucro
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   MONTAJE
   ========================================================= */
const SCENES: { from: number; to: number; name: string; El: React.FC }[] = [
  { from: 0, to: CUTS[0], name: "1 · Homologación", El: Hook },
  { from: CUTS[0], to: CUTS[1], name: "2 · Motor S14", El: S14 },
  { from: CUTS[1], to: CUTS[2], name: "3 · Peso", El: Weight },
  { from: CUTS[2], to: CUTS[3], name: "4 · Dog-leg", El: Gearbox },
  { from: CUTS[3], to: M3DTM.durationInFrames, name: "5 · Llamada a la acción", El: Cta },
];

export const M3Dtm: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: BODY, color: INK }}>
      {SCENES.map(({ from, to, name, El }, i) => (
        // Cada escena dura hasta el final del barrido de la siguiente, que la tapa desde la izquierda
        <Sequence key={name} from={from} durationInFrames={to - from + (i < SCENES.length - 1 ? WIPE : 0)} name={name}>
          <Wipe first={i === 0}><El /></Wipe>
        </Sequence>
      ))}
      {CUTS.map((c) => <Sequence key={c} from={c} durationInFrames={10}><Audio src={staticFile("sfx/scan.wav")} volume={0.25} endAt={10} /></Sequence>)}
      {/* Grano de papel muy fino; quieto en el último segundo */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none", mixBlendMode: "multiply" }}>
        <filter id="m3g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame >= STILL_FROM ? 0 : frame % 24} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#m3g)" />
      </svg>
    </AbsoluteFill>
  );
};
