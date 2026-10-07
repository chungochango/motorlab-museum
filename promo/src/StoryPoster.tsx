import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

/* =========================================================
   STORY POSTER · MotorLab Museum · Exhibit 08 (fotograma fijo)
   1080 × 1920 (9:16). Se exporta a 4K con --scale=2.
   ---------------------------------------------------------
   Laboratorio oscuro con la paleta de la Sala 08 (tema midnight):
   carbón, grafito, blanco perla y ámbar #FF8A00. En el centro, el
   despiece real de la carrocería del Supra A80 flotando sobre el
   suelo brillante; a los lados, rótulos de telemetría unidos a
   círculos de CAD sobre las piezas; abajo, la llamada a la acción.
   Zonas seguras de Stories: nada esencial en los 250 px de arriba
   ni en los 340 de abajo (barra de progreso y campo de respuesta).
   ========================================================= */
export const STORY = { width: 1080, height: 1920 };

const { fontFamily: SANS } = loadSans("normal", { weights: ["300", "400", "600", "700"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const AMBER = "#FF8A00";
const PEARL = "#F5F5F7";
const GREY = "#8E8E95";

// Foto: 1672 × 941, a 1200 px de ancho, centrada en x y con su parte superior en y = 500
const IW = 1200, IH = Math.round(IW * 941 / 1672), IX = (1080 - IW) / 2, IY = 500;
const at = (px: number, py: number) => ({ x: IX + (px / 100) * IW, y: IY + (py / 100) * IH });

/* Círculo de CAD sobre una pieza, con su número de cota (el mismo que su rótulo de abajo) */
const Cad: React.FC<{ n: string; px: number; py: number; r: number; side?: 1 | -1 }> = ({ n, px, py, r, side = 1 }) => {
  const c = at(px, py);
  const lx = c.x + side * (r + 46);
  return (
    <g>
      <circle cx={c.x} cy={c.y} r={r} fill="none" stroke={AMBER} strokeWidth="1.5" strokeDasharray="6 6" />
      <circle cx={c.x} cy={c.y} r={r * 0.62} fill="none" stroke={AMBER} strokeOpacity="0.45" strokeWidth="1" />
      <path d={`M${c.x - r - 10} ${c.y} H${c.x - r + 8} M${c.x + r - 8} ${c.y} H${c.x + r + 10} M${c.x} ${c.y - r - 10} V${c.y - r + 8} M${c.x} ${c.y + r - 8} V${c.y + r + 10}`} stroke={AMBER} strokeWidth="1.5" />
      <circle cx={c.x} cy={c.y} r="4" fill={AMBER} />
      <path d={`M${c.x + side * r * 0.71} ${c.y - r * 0.71} L${lx - side * 6} ${c.y - r - 30} H${lx}`} fill="none" stroke={PEARL} strokeOpacity="0.6" strokeWidth="1" />
      <rect x={side > 0 ? lx : lx - 44} y={c.y - r - 46} width="44" height="32" fill="#0a0a0a" stroke={AMBER} strokeWidth="1.5" />
      <text x={side > 0 ? lx + 22 : lx - 22} y={c.y - r - 23} textAnchor="middle" fill={AMBER} style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600 }}>{n}</text>
    </g>
  );
};

/* Rótulo de telemetría: ficha numerada bajo el coche */
const Badge: React.FC<{ n: string; x: number; y: number; code: string; value: string }> = ({ n, x, y, code, value }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 465, display: "flex", gap: 16, alignItems: "center", padding: "12px 16px", background: "rgba(10,10,10,0.86)", border: "1px solid #2c2c30", borderRadius: 3 }}>
    <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, color: AMBER, border: `1.5px solid ${AMBER}`, width: 44, height: 32, display: "grid", placeItems: "center", flex: "none" }}>{n}</div>
    <div>
      <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.12em", color: AMBER }}>{code}</div>
      <div style={{ marginTop: 4, fontSize: 26, fontWeight: 600, color: PEARL }}>{value}</div>
    </div>
  </div>
);

export const StoryPoster: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", fontFamily: SANS, color: PEARL }}>
      {/* Laboratorio: retícula de plano, foco ámbar detrás del coche y suelo */}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(245,245,247,0.035) 1px, transparent 1px) 0 0 / 54px 54px, linear-gradient(90deg, rgba(245,245,247,0.035) 1px, transparent 1px) 0 0 / 54px 54px" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 30% at 50% 50%, rgba(255,138,0,0.16), rgba(255,138,0,0) 70%), radial-gradient(ellipse 120% 70% at 50% 45%, rgba(0,0,0,0) 40%, #000 100%)" }} />

      {/* Cabecera */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
        <Img src={staticFile("img/logo-mark.png")} style={{ width: 76, height: 76, margin: "0 auto" }} />
        <div style={{ marginTop: 22, fontSize: 82, fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1 }}>MOTORLAB MUSEUM</div>
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontFamily: MONO, fontSize: 26, letterSpacing: "0.2em", color: AMBER }}>
          <span style={{ width: 48, height: 1, background: AMBER }} />DIGITAL ARCHIVE // EXHIBIT 08<span style={{ width: 48, height: 1, background: AMBER }} />
        </div>
      </div>

      {/* Despiece flotando sobre el suelo brillante */}
      <Img
        src={staticFile("img/supra-despiece-carroceria.jpg")}
        style={{
          position: "absolute", left: IX, top: IY, width: IW, height: IH,
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 10%, #000 84%, transparent 100%)",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* CAD y telemetría */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <Cad n="01" px={84} py={13} r={56} side={-1} />
        <Cad n="02" px={37} py={52} r={46} side={-1} />
        <Cad n="03" px={42} py={63} r={40} />
        <Cad n="04" px={54} py={67} r={46} />
        {/* regla de escala sobre el suelo */}
        {Array.from({ length: 31 }, (_, i) => <line key={i} x1={240 + i * 20} y1={1150} x2={240 + i * 20} y2={i % 5 ? 1160 : 1168} stroke={GREY} strokeWidth="1.5" />)}
        <text x={540} y={1194} textAnchor="middle" fill={GREY} style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.2em" }}>TOYOTA SUPRA A80 · JZA80 · 1993</text>
      </svg>
      <Badge n="01" x={60} y={1218} code="AERO // CX 0.31" value="Rear wing · aluminium hood" />
      <Badge n="02" x={555} y={1218} code="2JZ-GTE // CLOSED-DECK" value="3.0 L inline-six" />
      <Badge n="03" x={60} y={1308} code="CT20 × 2 // SEQUENTIAL" value="280 PS · 5,600 rpm" />
      <Badge n="04" x={555} y={1308} code="GETRAG V160 // 6-SPD" value="Torsen LSD" />

      {/* Llamada a la acción: banda de alto contraste y botón de enlace */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1410, padding: "26px 30px 28px", borderRadius: 4, background: "#0a0a0a", border: "1px solid #2c2c30", boxShadow: "0 24px 60px -24px rgba(0,0,0,0.9)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: AMBER, borderRadius: "4px 4px 0 0" }} />
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "0.08em", textAlign: "center" }}>EXPLORE THE ANATOMY · <span style={{ color: AMBER }}>TAP TO ENTER</span></div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14, height: 72, padding: "0 10px 0 22px", borderRadius: 999, background: "#161618", border: "1px solid #2c2c30" }}>
          <svg width="22" height="26" viewBox="0 0 10 12" fill="none" stroke={GREY} strokeWidth="1.2"><rect x="1.5" y="5" width="7" height="6" rx="1" /><path d="M3 5V3.5a2 2 0 0 1 4 0V5" /></svg>
          <span style={{ flex: 1, fontFamily: MONO, fontSize: 28, color: PEARL, letterSpacing: "0.02em" }}>motorlabmuseum.com/supra</span>
          <span style={{ display: "grid", placeItems: "center", width: 54, height: 54, borderRadius: "50%", background: AMBER }}>
            <svg viewBox="0 0 16 12" width="24" height="18" fill="none" stroke="#120a00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h14M10 1l5 5-5 5" /></svg>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
