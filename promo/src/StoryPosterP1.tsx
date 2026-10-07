import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/TitilliumWeb";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

/* =========================================================
   STORY POSTER · MotorLab Museum · Sala 03 McLaren P1 (en español)
   1080 × 1920 (9:16). Se exporta a 4K con --scale=2.
   ---------------------------------------------------------
   Paleta y tipos del tema woking: negro OLED, Volcano Orange
   #FF8C00, Titillium Web y JetBrains Mono. Vista en despiece
   hacia arriba: MonoCage, V8 y alerón flotan sobre su sitio en
   el coche, unidos por cotas de CAD numeradas que remiten a las
   fichas de abajo.
   Abajo queda un hueco enmarcado para pegar el sticker de enlace
   de Instagram. Zonas seguras: nada esencial en los 250 px de
   arriba ni en los 340 de abajo.
   ========================================================= */
export const STORY_P1 = { width: 1080, height: 1920 };

const { fontFamily: DISPLAY } = loadDisplay("normal", { weights: ["300", "600", "700"], subsets: ["latin", "latin-ext"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });

const ORANGE = "#FF8C00";
const PEARL = "#F5F5F4";
const GREY = "#8B9097";

// Perfil: 1600 × 800 a 1080 de ancho, arriba en y = 640
const CW = 1080, CH = 540, CY = 640;
const car = (px: number, py: number) => ({ x: (px / 1600) * CW, y: CY + (py / 800) * CH });

// Piezas flotantes: 1536 × 1024 a 320 × 213
const PW = 320, PH = 213, PY = 505;
const PARTS = [
  { n: "01", src: "img/p1-despiece-chasis.jpg", x: 22, anchor: car(760, 300) },
  { n: "02", src: "img/p1-despiece-motor.jpg", x: 380, anchor: car(1130, 330) },
  { n: "03", src: "img/p1-despiece-aleron.jpg", x: 738, anchor: car(1450, 268) },
];
const BATTERY = car(1000, 470);

const fade = "radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)";

const Cad: React.FC<{ n: string; c: { x: number; y: number }; r: number; from?: { x: number; y: number } }> = ({ n, c, r, from }) => (
  <g>
    {from && <path d={`M${from.x} ${from.y} V${from.y + 40} L${c.x} ${c.y - r - 40} V${c.y - r - 14}`} stroke={ORANGE} strokeOpacity="0.75" strokeWidth="1.5" strokeDasharray="3 7" />}
    <circle cx={c.x} cy={c.y} r={r} fill="none" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="6 6" />
    <circle cx={c.x} cy={c.y} r={r * 0.6} fill="none" stroke={PEARL} strokeOpacity="0.4" strokeWidth="1" />
    <path d={`M${c.x - r - 10} ${c.y} H${c.x - r + 8} M${c.x + r - 8} ${c.y} H${c.x + r + 10} M${c.x} ${c.y - r - 10} V${c.y - r + 8} M${c.x} ${c.y + r - 8} V${c.y + r + 10}`} stroke={ORANGE} strokeWidth="1.5" />
    <circle cx={c.x} cy={c.y} r="4" fill={ORANGE} />
    <rect x={c.x + r * 0.7} y={c.y + r * 0.7} width="44" height="30" fill="#000" stroke={ORANGE} strokeWidth="1.5" />
    <text x={c.x + r * 0.7 + 22} y={c.y + r * 0.7 + 21} textAnchor="middle" fill={ORANGE} style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700 }}>{n}</text>
  </g>
);

const Badge: React.FC<{ n: string; x: number; y: number; code: string; value: string }> = ({ n, x, y, code, value }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 465, display: "flex", gap: 16, alignItems: "center", padding: "12px 16px", background: "rgba(0,0,0,0.86)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 4 }}>
    <div style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: ORANGE, border: `1.5px solid ${ORANGE}`, width: 44, height: 30, display: "grid", placeItems: "center", flex: "none" }}>{n}</div>
    <div>
      <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.08em", color: ORANGE }}>{code}</div>
      <div style={{ marginTop: 2, fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, color: PEARL, lineHeight: 1.15 }}>{value}</div>
    </div>
  </div>
);

/* Esquinas de mira del hueco del enlace */
const Corners: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const l = 34;
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <path d={`M1 ${l} V1 H${l} M${w - l} 1 H${w - 1} V${l} M${w - 1} ${h - l} V${h - 1} H${w - l} M${l} ${h - 1} H1 V${h - l}`} fill="none" stroke={ORANGE} strokeWidth="3" />
      <rect x="10" y="10" width={w - 20} height={h - 20} rx="8" fill="none" stroke={PEARL} strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="8 8" />
    </svg>
  );
};

export const StoryPosterP1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: DISPLAY, color: PEARL }}>
    {/* Laboratorio: retícula, foco naranja y viñeta */}
    <AbsoluteFill style={{ background: "linear-gradient(rgba(245,245,244,0.035) 1px, transparent 1px) 0 0 / 54px 54px, linear-gradient(90deg, rgba(245,245,244,0.035) 1px, transparent 1px) 0 0 / 54px 54px" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 26% at 50% 45%, rgba(255,140,0,0.15), rgba(255,140,0,0) 70%), radial-gradient(ellipse 120% 70% at 50% 45%, rgba(0,0,0,0) 40%, #000 100%)" }} />

    {/* Cabecera */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <Img src={staticFile("img/logo-mark.png")} style={{ width: 72, height: 72, margin: "0 auto" }} />
      <div style={{ marginTop: 14, fontSize: 88, fontWeight: 700, letterSpacing: "0.05em", lineHeight: 1 }}>MOTORLAB MUSEUM</div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontFamily: MONO, fontSize: 25, letterSpacing: "0.16em", color: ORANGE }}>
        <span style={{ width: 44, height: 1.5, background: ORANGE }} />ARCHIVO DIGITAL // SALA 03<span style={{ width: 44, height: 1.5, background: ORANGE }} />
      </div>
    </div>

    {/* Coche sobre el suelo brillante */}
    <Img src={staticFile("img/p1-perfil.jpg")} style={{ position: "absolute", left: 0, top: CY, width: CW, height: CH, WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 22%, #000 72%, transparent 100%)" }} />

    {/* Piezas en despiece flotando sobre su sitio */}
    {PARTS.map((p) => (
      <Img key={p.n} src={staticFile(p.src)} style={{ position: "absolute", left: p.x, top: PY, width: PW, height: PH, WebkitMaskImage: fade }} />
    ))}

    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {PARTS.map((p) => <Cad key={p.n} n={p.n} c={p.anchor} r={40} from={{ x: p.x + PW / 2, y: PY + PH - 18 }} />)}
      <Cad n="04" c={BATTERY} r={34} />
      {/* regla de escala sobre el suelo */}
      {Array.from({ length: 31 }, (_, i) => <line key={i} x1={240 + i * 20} y1={1112} x2={240 + i * 20} y2={i % 5 ? 1122 : 1130} stroke={GREY} strokeWidth="1.5" />)}
      <text x={540} y={1156} textAnchor="middle" fill={GREY} style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.2em" }}>McLAREN P1 · 2013 — 2015 · 375 UNIDADES</text>
    </svg>

    {/* Fichas: cifras oficiales de la ficha de la Sala 03 */}
    <Badge n="01" x={60} y={1180} code="MONOCAGE // CARBONO" value="Monocasco de unos 90 kg" />
    <Badge n="02" x={555} y={1180} code="M838TQ // V8 3.8 BITURBO" value="916 CV combinados" />
    <Badge n="03" x={60} y={1270} code="ALERÓN ACTIVO // DRS" value="600 kg de carga aerodinámica" />
    <Badge n="04" x={555} y={1270} code="HÍBRIDO // BATERÍA 4,7 kWh" value="900 Nm · 0–100 en 2,8 s" />

    {/* Llamada a la acción con hueco para el sticker de enlace */}
    <div style={{ position: "absolute", left: 60, right: 60, top: 1372, height: 208, borderRadius: 4, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.14)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: ORANGE, borderRadius: "4px 4px 0 0" }} />
      <div style={{ marginTop: 22, fontSize: 36, fontWeight: 700, letterSpacing: "0.06em", textAlign: "center" }}>EXPLORA LA ANATOMÍA · <span style={{ color: ORANGE }}>TOCA PARA ENTRAR</span></div>
      <div style={{ position: "relative", width: 640, height: 104, margin: "16px auto 0" }}>
        <Corners w={640} h={104} />
      </div>
    </div>
  </AbsoluteFill>
);
