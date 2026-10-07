import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";
import { bouncy, Carbon, clamp, FADE, Flash, Grain, HEAVY, rgba, Scene, shake, slam, tag, XFADE } from "./retention/kit";
import VOZ from "../public/voz/190e.json";

/* =========================================================
   MERCEDES-BENZ 190E 2.5-16 EVOLUTION II · TIKTOK CON VOZ
   1080 × 1920 · 30 fps · Sala 07 de MotorLab Museum
   ---------------------------------------------------------
   El ritmo lo marca la locución (voz neuronal "Pablo" de Windows,
   promo/scripts/voz.ps1): cada escena dura lo que su frase y cada
   pieza se enciende cuando la voz la nombra. public/voz/190e.json
   guarda dónde empieza y acaba el habla en cada WAV.
     1  gancho: la frase de BMW sobre el alerón → "Funcionó."
     2  motor M102 con culata Cosworth (dos frases)
     3  aerodinámica de Eppler · Cx 0,29
     4  suspensión hidroneumática y su mando en el salpicadero
     5  502 unidades · DTM 1992 · Sala 07; último segundo y medio fijo
   Paleta de la sala (tema stuttgart): plata y turquesa DTM.
   ========================================================= */
const FPS = 30;
const GAP = 8;                    // pausa entre frases (fotogramas)
const LEAD = 6;                   // la primera frase arranca tras un golpe
const HOLD = 45;                  // último segundo y medio, fijo

const SILVER = "226, 232, 240";
const TEAL = "0, 161, 155";

/* Línea de tiempo calculada a partir de la voz */
type Line = { id: string; file: string; start: number; end: number; from: number; len: number };
const LINES: Line[] = [];
{
  let t = LEAD;
  for (const v of VOZ as { id: string; file: string; start: number; end: number }[]) {
    const len = Math.ceil((v.end - v.start) * FPS) + 4;
    LINES.push({ ...v, from: t, len });
    t += len + GAP;
  }
}
const L = (n: number) => LINES[n - 1];
const endOf = (n: number) => L(n).from + L(n).len;
export const M190 = { fps: FPS, width: 1080, height: 1920, durationInFrames: endOf(7) + 12 + HOLD };
const STILL_FROM = M190.durationInFrames - HOLD;

/* Texto en pantalla de cada frase (con cifras) y palabra clave → momento dentro de la frase.
   La posición es proporcional a los caracteres del texto que se lee (buena aproximación del habla). */
const SPOKEN: Record<string, string> = {
  "01": "En mil novecientos noventa, BMW se rió de este alerón.",
  "02": "Debajo del capó, el eme ciento dos: Mercedes encargó la culata de dieciséis válvulas a Cosworth, y acortó la carrera a ochenta y dos coma ocho milímetros.",
  "03": "Resultado: doscientos treinta y cinco caballos sin turbo, a siete mil doscientas vueltas... y corte a siete mil setecientas.",
  "04": "El kit lo firmó el profesor Richard Eppler, de la Universidad de Stuttgart. Con todo ese alerón, el coeficiente aerodinámico se quedó en cero coma veintinueve.",
  "05": "Y detrás, suspensión hidroneumática: el conductor cambiaba la altura de la carrocería desde un mando del salpicadero.",
  "06": "Solo se hicieron quinientos dos. Y en mil novecientos noventa y dos, Klaus Ludwig ganó el de te eme con él.",
  "07": "Desmóntalo sistema a sistema, en la sala siete de Motor Lab Museum.",
};
const at = (n: number, word: string) => {
  const txt = SPOKEN[L(n).id];
  const i = txt.indexOf(word);
  return L(n).from + Math.round((Math.max(0, i) / txt.length) * L(n).len);
};

const CAPTIONS: [number, number, string][] = [
  [L(1).from, endOf(1), "En 1990, BMW se rió de este alerón."],
  [L(2).from, at(2, "Mercedes"), "Debajo del capó, el M102:"],
  [at(2, "Mercedes"), at(2, "y acortó"), "Mercedes encargó la culata de 16 válvulas a Cosworth…"],
  [at(2, "y acortó"), endOf(2), "…y acortó la carrera a 82,8 mm."],
  [L(3).from, at(3, "a siete mil"), "Resultado: 235 CV sin turbo…"],
  [at(3, "a siete mil"), endOf(3), "…a 7.200 vueltas, y corte a 7.700."],
  [L(4).from, at(4, "Con todo"), "El kit lo firmó el profesor Richard Eppler, de la Universidad de Stuttgart."],
  [at(4, "Con todo"), endOf(4), "Con todo ese alerón, el Cx se quedó en 0,29."],
  [L(5).from, at(5, "el conductor"), "Y detrás, suspensión hidroneumática:"],
  [at(5, "el conductor"), endOf(5), "el conductor cambiaba la altura desde un mando del salpicadero."],
  [L(6).from, at(6, "Y en mil"), "Solo se hicieron 502."],
  [at(6, "Y en mil"), endOf(6), "Y en 1992, Klaus Ludwig ganó el DTM con él."],
  [L(7).from, endOf(7) + 12, "Desmóntalo sistema a sistema en la Sala 07 de MotorLab Museum."],
];

/* Cortes de escena: al empezar cada bloque de voz */
const CUTS = [L(2).from - 4, L(4).from - 4, L(5).from - 4, L(6).from - 4];
const FUNCIONO = endOf(1) - 2;
const IMPACTS: [number, number][] = [[2, 20], [FUNCIONO, 30], ...CUTS.map((c): [number, number] => [c, 18]), [at(3, "doscientos"), 22], [at(4, "cero coma"), 24], [at(6, "quinientos"), 18]];

/* ---------- Piezas comunes ---------- */
const Photo: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ ...FADE, position: "absolute", objectFit: "cover", ...style }} />
);

const Slam: React.FC<{ at: number; children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ at: t, children, size, color = C.white, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - t, fps, config: slam });
  const jit = f >= t && f - t < 6 ? (random(`s${t}-${f}`) - 0.5) * 10 : 0;
  return (
    <div style={{ fontSize: size, fontWeight: 900, lineHeight: 0.96, letterSpacing: "-0.03em", color, opacity: f >= t ? 1 : 0, transform: `translate(${jit}px, ${jit * 0.5}px) scale(${interpolate(s, [0, 1], [2.1, 1])})`, transformOrigin: "0 50%", ...style }}>
      {children}
    </div>
  );
};

/* Punto numerado sobre un despiece: se enciende con la palabra de la voz */
const Pin: React.FC<{ x: number; y: number; n: number; label: string; t: number; scale?: number }> = ({ x, y, n, label, t, scale = 1 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - t, fps, config: bouncy });
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, opacity: f >= t ? 1 : 0, transform: `scale(${s / scale})` }}>
      <div style={{ position: "absolute", left: -26, top: -26, width: 52, height: 52, borderRadius: "50%", border: `3px solid rgb(${SILVER})`, background: "rgba(0,0,0,0.7)", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800 }}>
        <div style={{ position: "absolute", inset: 11, borderRadius: "50%", background: rgba(TEAL, Math.floor(f / 5) % 2 ? 0.95 : 0.45) }} />
        <span style={{ position: "relative" }}>{n}</span>
      </div>
      <div style={{ position: "absolute", left: 38, top: -30, whiteSpace: "nowrap", padding: "10px 16px", background: "rgba(0,0,0,0.85)", border: `2px solid rgba(${SILVER}, 0.8)`, borderRadius: 4, fontSize: 32, fontWeight: 800 }}>{label}</div>
    </div>
  );
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cap = CAPTIONS.find(([a, b]) => f >= a && f < b);
  if (!cap) return null;
  const s = spring({ frame: f - cap[0], fps, config: { damping: 18, stiffness: 260 } });
  return (
    <div style={{ position: "absolute", left: 70, right: 150, top: 1290 }}>
      <div style={{ display: "inline-block", padding: "16px 24px", borderRadius: 14, background: "rgba(0,0,0,0.8)", fontSize: 44, fontWeight: 800, lineHeight: 1.22, transform: `translateY(${(1 - s) * 18}px)`, opacity: s }}>
        {cap[2].split(" ").map((w, i) => <span key={i} style={{ color: /\d/.test(w) || /^(Cosworth|Eppler|DTM|Funcionó)/.test(w) ? `rgb(${TEAL})` : C.white }}>{w} </span>)}
      </div>
    </div>
  );
};

/* =========================================================
   1 · Gancho
   ========================================================= */
const QUOTE = "«SI ESE ALERÓN FUNCIONA, HABRÁ QUE REESCRIBIR LA FÍSICA.»".split(" ");
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = interpolate(f, [24, 44], [0, 1], clamp);
  const funcionoAt = FUNCIONO;
  return (
    <AbsoluteFill>
      {/* Perfil en penumbra que da paso al despiece del kit aerodinámico */}
      <Photo src="img/190e-perfil.jpg" style={{ left: -60, top: 880, width: 1200, height: 675, objectFit: "contain", filter: `brightness(${0.35 + 0.3 * (1 - glow)})`, opacity: 1 - glow }} />
      <Photo src="img/190e-despiece-aero.jpg" style={{ left: 90, top: 560, width: 900, height: 1599, opacity: glow, filter: `brightness(${0.4 + 0.6 * glow}) drop-shadow(0 0 ${12 * glow}px rgba(${SILVER}, 0.35))` }} />
      <div style={{ position: "absolute", left: 70, right: 120, top: 230, display: "flex", flexWrap: "wrap", columnGap: 22 }}>
        {QUOTE.map((w, i) => {
          const t = 2 + i * 3;
          const s = spring({ frame: f - t, fps, config: slam });
          return <span key={i} style={{ fontSize: 86, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", color: /FUNCIONA|FÍSICA/.test(w) ? `rgb(${SILVER})` : C.white, opacity: f >= t ? 1 : 0, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`, display: "inline-block" }}>{w}</span>;
        })}
      </div>
      <div style={{ position: "absolute", left: 70, top: 590, fontSize: 34, fontWeight: 500, color: C.platinum, opacity: interpolate(f, [30, 40], [0, 1], clamp) }}>— Lo que se cuenta que dijo BMW.</div>
      <div style={{ position: "absolute", left: 70, top: 650 }}>
        <Slam at={funcionoAt} size={130} color={`rgb(${TEAL})`}>Funcionó.</Slam>
      </div>
      <Sequence from={funcionoAt} durationInFrames={40}><Audio src={staticFile("sfx/impact.wav")} volume={0.6} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   2 · Motor M102 con culata Cosworth
   ========================================================= */
const Engine: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const g = f + from;                                  // fotograma absoluto (para sincronizar con la voz)
  const z = interpolate(g, [L(2).from, endOf(3)], [1, 1.12], clamp);
  // Cuentavueltas: sube a 7.200 con la voz y entra en el corte a 7.700
  const rpm = interpolate(g, [at(3, "a siete mil"), at(3, "y corte"), at(3, "setecientas")], [1000, 7200, 7700], clamp);
  const red = rpm >= 7400;
  const A = (v: number) => -210 + (v / 8000) * 240;
  const ang = A(rpm), CX = 870, CY = 470, R = 110;     // arriba a la derecha: no tapa las piezas
  const pt = (a: number, r: number) => [CX + Math.cos((a * Math.PI) / 180) * r, CY + Math.sin((a * Math.PI) / 180) * r];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${z})`, transformOrigin: "50% 40%" }}>
        <Photo src="img/190e-despiece-motor.jpg" style={{ inset: 0, width: "100%", height: "100%", filter: "brightness(0.78)" }} />
        <Pin x={50} y={33} n={1} label="Culata Cosworth 16V" t={at(2, "la culata") - from} scale={z} />
        <Pin x={52} y={49} n={2} label="Pistones · Ø 97,3 mm" t={at(2, "y acortó") - from} scale={z} />
        <Pin x={40} y={57} n={3} label="Carrera corta · 82,8 mm" t={at(2, "la carrera") - from} scale={z} />
      </div>
      <div style={{ position: "absolute", left: 70, right: 120, top: 210 }}>
        <Slam at={4} size={96}>M102</Slam>
        <Slam at={14} size={50} color={`rgb(${SILVER})`} style={{ marginTop: 10 }}>2.463 CC · CULATA COSWORTH 16V</Slam>
      </div>
      {/* 235 CV y cuentavueltas, en la segunda frase */}
      <div style={{ position: "absolute", left: 70, top: 390 }}>
        <Slam at={at(3, "doscientos") - from} size={130} color={C.white}>235<span style={{ fontSize: 60, color: `rgb(${TEAL})` }}> CV</span></Slam>
        <div style={{ ...tag, fontSize: 28, color: C.platinum, marginTop: 8, opacity: g >= at(3, "sin turbo") ? 1 : 0 }}>Atmosférico · sin turbo</div>
      </div>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: g >= at(3, "a siete mil") - 6 ? 1 : 0 }}>
        <circle cx={CX} cy={CY} r={R + 18} fill="rgba(0,0,0,0.75)" stroke={`rgba(${SILVER},0.5)`} strokeWidth="2" />
        {Array.from({ length: 9 }, (_, i) => { const [x1, y1] = pt(A(i * 1000), R - 6), [x2, y2] = pt(A(i * 1000), R - 24); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i >= 7.7 ? "#e5484d" : `rgb(${SILVER})`} strokeWidth="4" />; })}
        {(() => { const [x1, y1] = pt(A(7700), R - 4), [x2, y2] = pt(A(8000), R - 4); return <path d={`M${x1} ${y1} A ${R - 4} ${R - 4} 0 0 1 ${x2} ${y2}`} stroke="#e5484d" strokeWidth="10" fill="none" />; })()}
        {(() => { const [x, y] = pt(ang, R - 30); return <line x1={CX} y1={CY} x2={x} y2={y} stroke={red ? "#e5484d" : `rgb(${TEAL})`} strokeWidth="6" strokeLinecap="round" />; })()}
        <circle cx={CX} cy={CY} r="10" fill={`rgb(${SILVER})`} />
        <text x={CX} y={CY + 64} textAnchor="middle" fill={C.white} style={{ fontFamily: HEAVY, fontSize: 30, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{Math.round(rpm / 100) * 100} rpm</text>
      </svg>
      {[at(2, "la culata"), at(2, "y acortó"), at(2, "la carrera")].map((t) => <Sequence key={t} from={t - from} durationInFrames={3}><Audio src={staticFile("sfx/tick.wav")} volume={0.35} /></Sequence>)}
    </AbsoluteFill>
  );
};

/* =========================================================
   3 · Aerodinámica (Eppler · Cx 0,29)
   ========================================================= */
const Aero: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const g = f + from;
  return (
    <AbsoluteFill>
      <Photo src="img/190e-despiece-aero.jpg" style={{ inset: 0, width: 1080, height: 1920, filter: "brightness(0.8)" }} />
      {/* Líneas de aire que pasan sobre el kit */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M-40 ${180 + i * 70} C 300 ${150 + i * 70}, 700 ${210 + i * 64}, 1120 ${170 + i * 72}`} fill="none" stroke={`rgba(${SILVER},0.35)`} strokeWidth="3" strokeDasharray="34 26" strokeDashoffset={-f * 10} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 70, right: 120, top: 600, opacity: g >= at(4, "Richard") ? 1 : 0 }}>
        <div style={{ display: "inline-block", padding: "12px 18px", background: "rgba(0,0,0,0.85)", border: `2px solid rgba(${SILVER},0.8)`, borderRadius: 4 }}>
          <div style={{ ...tag, fontSize: 24, color: C.platinum }}>Kit aerodinámico</div>
          <div style={{ fontSize: 40, fontWeight: 800, marginTop: 4 }}>Prof. Richard Eppler · Univ. de Stuttgart</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, top: 880 }}>
        <Slam at={at(4, "cero coma") - from} size={170}>Cx <span style={{ color: `rgb(${TEAL})` }}>0,29</span></Slam>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   4 · Suspensión hidroneumática y el mando
   ========================================================= */
const Sls: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const g = f + from;
  const mando = at(5, "un mando");
  const toCockpit = g >= at(5, "el conductor");
  const zoom = interpolate(g, [at(5, "el conductor"), mando + 6], [1, 2.1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <AbsoluteFill>
      {!toCockpit ? (
        <div style={{ position: "absolute", inset: 0 }}>
          <Photo src="img/190e-despiece-sls.jpg" style={{ inset: 0, width: 1080, height: 1920, filter: "brightness(0.8)" }} />
          <div style={{ position: "absolute", inset: 0 }}><Pin x={14} y={11} n={1} label="Esfera hidroneumática" t={at(5, "suspensión") - from + 6} /></div>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "82% 63%" }}>
          <Photo src="img/190e-despiece-cockpit.jpg" style={{ inset: 0, width: 1080, height: 1920, filter: "brightness(0.85)" }} />
          <Pin x={82} y={63} n={2} label="Mando de altura" t={mando - from} scale={zoom} />
        </div>
      )}
      <div style={{ position: "absolute", left: 70, right: 120, top: 210 }}>
        <Slam at={4} size={74}>SUSPENSIÓN HIDRONEUMÁTICA</Slam>
        <Slam at={at(5, "el conductor") - from} size={46} color={`rgb(${SILVER})`} style={{ marginTop: 14 }}>ALTURA REGULABLE DESDE DENTRO</Slam>
      </div>
      <Sequence from={mando - from} durationInFrames={3}><Audio src={staticFile("sfx/tick.wav")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================
   5 · 502 unidades · DTM 1992 · Sala 07
   ========================================================= */
const Outro: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = f + from;
  const pull = interpolate(f, [0, 60], [1.2, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const card = spring({ frame: g - L(7).from, fps, config: bouncy });
  return (
    <AbsoluteFill>
      <Photo src="img/190e-perfil.jpg" style={{ left: -60, top: 980, width: 1200, height: 675, objectFit: "contain", transform: `scale(${pull})` }} />
      <div style={{ position: "absolute", left: 70, right: 120, top: 220 }}>
        <Slam at={at(6, "quinientos") - from} size={150}>502</Slam>
        <div style={{ ...tag, fontSize: 30, color: C.platinum, marginTop: 6, opacity: g >= at(6, "quinientos") + 6 ? 1 : 0 }}>Unidades de homologación</div>
        <Slam at={at(6, "Klaus") - from} size={64} color={`rgb(${TEAL})`} style={{ marginTop: 30 }}>DTM 1992 · KLAUS LUDWIG</Slam>
      </div>
      <div style={{ position: "absolute", left: 70, right: 150, top: 700, padding: "26px 30px", borderRadius: 14, background: "rgba(10,10,12,0.92)", border: `2px solid rgba(${SILVER},0.85)`, opacity: g >= L(7).from ? 1 : 0, transform: `scale(${0.7 + 0.3 * card})`, transformOrigin: "0 50%", display: "flex", alignItems: "center", gap: 24 }}>
        <Img src={staticFile("img/logo-mark.png")} style={{ width: 84, height: 84 }} />
        <div>
          <div style={{ ...tag, fontSize: 26, color: C.platinum }}>7 sistemas en despiece · Sala 07</div>
          <div style={{ marginTop: 6, fontSize: 42, fontWeight: 900 }}>motorlabmuseum.com/190e</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   MONTAJE
   ========================================================= */
export const Mercedes190eTiktok: React.FC = () => {
  const frame = useCurrentFrame();
  const scenes: { from: number; to: number; name: string; El: React.FC<{ from: number }> }[] = [
    { from: 0, to: CUTS[0], name: "1 · Gancho", El: Hook as React.FC<{ from: number }> },
    { from: CUTS[0], to: CUTS[1], name: "2 · Motor M102", El: Engine },
    { from: CUTS[1], to: CUTS[2], name: "3 · Aerodinámica", El: Aero },
    { from: CUTS[2], to: CUTS[3], name: "4 · Suspensión", El: Sls },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: HEAVY, color: C.white }}>
      <AbsoluteFill style={{ transform: frame >= STILL_FROM ? "none" : shake(frame, IMPACTS) }}>
        <AbsoluteFill style={{ filter: "brightness(0.55) saturate(0)" }}><Carbon /></AbsoluteFill>
        {scenes.map(({ from, to, name, El }) => (
          <Sequence key={name} from={from} durationInFrames={to - from + XFADE} name={name}>
            <Scene dur={to - from + XFADE}><El from={from} /></Scene>
          </Sequence>
        ))}
        <Sequence from={CUTS[3]} name="5 · Sala 07"><Scene dur={M190.durationInFrames - CUTS[3]} exit={false}><Outro from={CUTS[3]} /></Scene></Sequence>
        <Captions />
      </AbsoluteFill>
      {/* Locución: cada frase recortada a su habla real */}
      {LINES.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.len} name={`Voz ${l.id}`}>
          <Audio src={staticFile(l.file)} startFrom={Math.max(0, Math.floor(l.start * FPS) - 2)} volume={1} />
        </Sequence>
      ))}
      <Sequence from={2} durationInFrames={30}><Audio src={staticFile("sfx/impact.wav")} volume={0.35} /></Sequence>
      {CUTS.map((c) => <Sequence key={c} from={c} durationInFrames={20}><Audio src={staticFile("sfx/pulse.wav")} volume={0.2} /></Sequence>)}
      <Flash cuts={CUTS} rgb={SILVER} />
      <Grain stillFrom={STILL_FROM} />
    </AbsoluteFill>
  );
};
