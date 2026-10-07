import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadOverpassMono } from "@remotion/google-fonts/OverpassMono";
import { loadFont as loadBarlowCondensed } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadSaira } from "@remotion/google-fonts/Saira";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadPlexSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";

/* =========================================================
   STORY POR SALA · cartel fijo 1080 × 1920 en español
   ---------------------------------------------------------
   La misma composición que StoryPosterP1 pero alimentada por
   STORY_ROOMS: tres piezas reales del despiece flotan sobre su
   sitio en el perfil del coche, con cotas de CAD numeradas que
   remiten a cuatro fichas; abajo, la llamada a la acción con un
   hueco enmarcado para pegar el sticker de enlace de Instagram.
   Cada sala usa el acento y las fuentes de su tema.
   Imágenes: promo/public/img/story/<slug>-*.jpg.
   Render: npm run stories (todas) o
           npx remotion still src/index.ts Story-<slug> out/story-<slug>.png --scale=2
   ========================================================= */
export const STORY_ROOM = { width: 1080, height: 1920 };

const opt = { subsets: ["latin"] as ("latin")[] };
const F = {
  inter: loadInter("normal", { weights: ["400", "600", "700"], ...opt }).fontFamily,
  jetbrains: loadJetBrains("normal", { weights: ["400", "700"], ...opt }).fontFamily,
  overpass: loadOverpassMono("normal", { weights: ["400", "700"], ...opt }).fontFamily,
  barlow: loadBarlowCondensed("normal", { weights: ["500", "600", "700"], ...opt }).fontFamily,
  saira: loadSaira("normal", { weights: ["600", "700"], ...opt }).fontFamily,
  plexMono: loadPlexMono("normal", { weights: ["400", "600"], ...opt }).fontFamily,
  plexSans: loadPlexSans("normal", { weights: ["600", "700"], ...opt }).fontFamily,
  chakra: loadChakra("normal", { weights: ["600", "700"], ...opt }).fontFamily,
  archivo: loadArchivo("normal", { weights: ["500", "600", "700"], ...opt }).fontFamily,
};

type Pt = [number, number]; // % de la foto de perfil
type Part = { img: string; anchor: Pt; fit?: "contain" | "cover"; pos?: string };
type Fact = { code: string; value: string };
export type StoryRoomConfig = {
  room: string;
  accent: string; // filetes, cotas y rótulos
  rgb: string; // el mismo acento en R, G, B para el foco
  display: string;
  mono: string;
  codeSize?: number; // rótulos con fuentes estrechas (Barlow Condensed, Archivo)
  // Perfil: tamaño, extremos del coche en x (%), techo/alerón y contacto de las ruedas en y (%)
  profile: { w: number; h: number; x0: number; x1: number; top: number; ground: number };
  parts: [Part, Part, Part];
  extra: Pt; // cota 04, sin pieza flotante
  facts: [Fact, Fact, Fact, Fact];
  caption: string;
};

export const STORY_ROOMS: Record<string, StoryRoomConfig> = {
  f40: {
    room: "01", accent: "#E5141A", rgb: "229, 20, 26", display: F.inter, mono: F.jetbrains,
    profile: { w: 1536, h: 1024, x0: 3, x1: 93, top: 33, ground: 66 },
    parts: [{ img: "chasis", anchor: [42, 42] }, { img: "motor", anchor: [73, 37] }, { img: "aero", anchor: [88, 37] }],
    extra: [72, 57],
    facts: [
      { code: "CHASIS TUBULAR // COMPOSITE", value: "1.100 kg en seco" },
      { code: "F120A // V8 2.9 BITURBO", value: "478 CV a 7.000 rpm" },
      { code: "AERO // ALERÓN INTEGRADO", value: "324 km/h de punta" },
      { code: "TRASERA // AUTOBLOCANTE", value: "577 Nm · 0–100 en 4,1 s" },
    ],
    caption: "FERRARI F40 · 1987 — 1992 · 1.315 UNIDADES",
  },
  r34: {
    room: "02", accent: "#40E0FF", rgb: "40, 92, 255", display: F.inter, mono: F.overpass,
    profile: { w: 1672, h: 941, x0: 4, x1: 92, top: 27, ground: 68 },
    parts: [{ img: "motor", anchor: [18, 45] }, { img: "chasis", anchor: [50, 42] }, { img: "aleron", anchor: [89, 33] }],
    extra: [80, 58],
    facts: [
      { code: "RB26DETT // 6L 2.6 BITURBO", value: "280 PS homologados" },
      { code: "ATTESA E-TS // AWD", value: "Tracción total variable" },
      { code: "AERO // ALERÓN TRASERO", value: "180 km/h limitada (JDM)" },
      { code: "GT-R ESTÁNDAR // PESO", value: "1.540 kg · 392 N·m" },
    ],
    caption: "NISSAN SKYLINE GT-R R34 · 1999 — 2002",
  },
  m3: {
    room: "04", accent: "#E2231A", rgb: "226, 35, 26", display: F.barlow, mono: F.barlow, codeSize: 20,
    profile: { w: 1536, h: 1024, x0: 1, x1: 97, top: 20, ground: 66 },
    parts: [{ img: "motor", anchor: [16, 40] }, { img: "caja", anchor: [38, 52] }, { img: "aero", anchor: [89, 33] }],
    extra: [74, 57],
    facts: [
      { code: "S14B25 // 4 CIL. 2.5 16V", value: "238 CV a 7.000 rpm" },
      { code: "GETRAG 265 // DOG-LEG", value: "Manual de 5 velocidades" },
      { code: "AERO // ALERÓN TRASERO", value: "248 km/h de punta" },
      { code: "TRASERA // LSD 25 %", value: "1.200 kg · 0–100 en 6,5 s" },
    ],
    caption: "BMW M3 E30 · 1986 — 1991 · HOMOLOGACIÓN GRUPO A",
  },
  gt3rs: {
    room: "05", accent: "#C5A059", rgb: "197, 160, 89", display: F.saira, mono: F.plexMono,
    profile: { w: 2000, h: 1334, x0: 1, x1: 98, top: 23, ground: 67 },
    parts: [{ img: "suspension", anchor: [22, 52] }, { img: "motor", anchor: [84, 47] }, { img: "aleron", anchor: [88, 26] }],
    extra: [70, 52],
    facts: [
      { code: "SUSPENSIÓN // DOBLE TRIÁNGULO", value: "6:49,3 en Nordschleife" },
      { code: "MA275 // BÓXER 4.0", value: "525 CV a 8.500 rpm" },
      { code: "AERO // ALERÓN DRS", value: "860 kg a 285 km/h" },
      { code: "PDK // 7 VELOCIDADES", value: "0–100 en 3,2 s" },
    ],
    caption: "PORSCHE 911 GT3 RS · 992 · 2023",
  },
  temerario: {
    room: "06", accent: "#39FF14", rgb: "57, 255, 20", display: F.chakra, mono: F.jetbrains,
    profile: { w: 1774, h: 887, x0: 1, x1: 96, top: 25, ground: 70 },
    parts: [{ img: "chasis", anchor: [40, 40] }, { img: "electrico", anchor: [48, 58] }, { img: "motor", anchor: [70, 44] }],
    extra: [19, 62],
    facts: [
      { code: "CHASIS // ALUMINIO", value: "Spaceframe integral" },
      { code: "HÍBRIDO // 3 E-MOTORES", value: "120 CV eléctricos" },
      { code: "V8 4.0 BITURBO // HOT-V", value: "800 CV · 10.000 rpm" },
      { code: "e-AWD // DCT 8 VEL.", value: "920 CV · 0–100 en 2,7 s" },
    ],
    caption: "LAMBORGHINI TEMERARIO · 2025 · HPEV",
  },
  "190e": {
    room: "07", accent: "#00A19B", rgb: "0, 161, 155", display: F.archivo, mono: F.archivo, codeSize: 18,
    profile: { w: 1672, h: 941, x0: 2, x1: 98, top: 22, ground: 68 },
    parts: [
      { img: "motor", anchor: [13, 46], fit: "cover", pos: "50% 45%" },
      { img: "sls", anchor: [80, 60], fit: "cover", pos: "50% 55%" },
      { img: "aero", anchor: [93, 30], fit: "cover", pos: "50% 8%" },
    ],
    extra: [42, 56],
    facts: [
      { code: "M102 // CULATA COSWORTH 16V", value: "235 CV a 7.200 rpm" },
      { code: "SLS // HIDRONEUMÁTICA", value: "Altura regulable" },
      { code: "AERO // CX 0,29", value: "Alerón y faldones Evo II" },
      { code: "GETRAG // 5 VEL. DOG-LEG", value: "250 km/h · 502 unidades" },
    ],
    caption: "MERCEDES-BENZ 190E 2.5-16 EVOLUTION II · 1990",
  },
  supra: {
    room: "08", accent: "#FF8A00", rgb: "255, 138, 0", display: F.plexSans, mono: F.plexMono,
    profile: { w: 1672, h: 941, x0: 1, x1: 97, top: 30, ground: 67 },
    parts: [{ img: "motor", anchor: [16, 46] }, { img: "transmision", anchor: [44, 57] }, { img: "carroceria", anchor: [62, 40] }],
    extra: [88, 38],
    facts: [
      { code: "2JZ-GTE // CT20 × 2 SECUENCIALES", value: "280 PS a 5.600 rpm" },
      { code: "GETRAG V160 // 6 VEL.", value: "Diferencial Torsen" },
      { code: "CARROCERÍA // CX 0,31", value: "1.510 kg (RZ, orientativo)" },
      { code: "AERO // ALERÓN TRASERO", value: "431 Nm a 3.600 rpm" },
    ],
    caption: "TOYOTA SUPRA A80 · JZA80 · 1993 — 2002",
  },
};

const PEARL = "#F5F5F4";
const GREY = "#8B9097";
const GROUND = 1050, CAR_X = 40, CAR_W = 1000;
const PY = 500, PW = 300, PH = 200, PX = [30, 390, 750];

export const StoryRoom: React.FC<{ slug: string }> = ({ slug }) => {
  const c = STORY_ROOMS[slug];
  const { w, h, x0, x1, top, ground } = c.profile;
  const s = CAR_W / (((x1 - x0) / 100) * w);
  const left = CAR_X - (x0 / 100) * w * s;
  const imgTop = GROUND - (ground / 100) * h * s;
  const roof = imgTop + (top / 100) * h * s;
  const at = ([ax, ay]: Pt) => ({ x: left + (ax / 100) * w * s, y: imgTop + (ay / 100) * h * s });
  const A = c.accent;

  const Cad: React.FC<{ n: string; p: Pt; r: number; from?: number }> = ({ n, p, r, from }) => {
    const k = at(p);
    const flip = k.x > 900 ? -1 : 1;
    const bx = flip > 0 ? k.x + r * 0.7 : k.x - r * 0.7 - 44;
    return (
      <g>
        {from !== undefined && <path d={`M${from} ${PY + PH - 14} V${PY + PH + 30} L${k.x} ${k.y - r - 40} V${k.y - r - 14}`} fill="none" stroke={A} strokeOpacity="0.75" strokeWidth="1.5" strokeDasharray="3 7" />}
        <circle cx={k.x} cy={k.y} r={r} fill="none" stroke={A} strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx={k.x} cy={k.y} r={r * 0.6} fill="none" stroke={PEARL} strokeOpacity="0.4" strokeWidth="1" />
        <path d={`M${k.x - r - 10} ${k.y} H${k.x - r + 8} M${k.x + r - 8} ${k.y} H${k.x + r + 10} M${k.x} ${k.y - r - 10} V${k.y - r + 8} M${k.x} ${k.y + r - 8} V${k.y + r + 10}`} stroke={A} strokeWidth="1.5" />
        <circle cx={k.x} cy={k.y} r="4" fill={A} />
        <rect x={bx} y={k.y + r * 0.7} width="44" height="30" fill="#000" stroke={A} strokeWidth="1.5" />
        <text x={bx + 22} y={k.y + r * 0.7 + 21} textAnchor="middle" fill={A} style={{ fontFamily: c.mono, fontSize: 17, fontWeight: 700 }}>{n}</text>
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: c.display, color: PEARL }}>
      {/* Laboratorio: retícula, foco del color de la sala y viñeta */}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(245,245,244,0.035) 1px, transparent 1px) 0 0 / 54px 54px, linear-gradient(90deg, rgba(245,245,244,0.035) 1px, transparent 1px) 0 0 / 54px 54px" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 26% at 50% 45%, rgba(${c.rgb},0.16), rgba(${c.rgb},0) 70%), radial-gradient(ellipse 120% 70% at 50% 45%, rgba(0,0,0,0) 40%, #000 100%)` }} />

      {/* Cabecera */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
        <Img src={staticFile("img/logo-mark.png")} style={{ width: 72, height: 72, margin: "0 auto" }} />
        <div style={{ marginTop: 14, fontSize: 84, fontWeight: 700, letterSpacing: "0.05em", lineHeight: 1 }}>MOTORLAB MUSEUM</div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontFamily: c.mono, fontSize: 25, letterSpacing: "0.16em", color: A }}>
          <span style={{ width: 44, height: 1.5, background: A }} />ARCHIVO DIGITAL // SALA {c.room}<span style={{ width: 44, height: 1.5, background: A }} />
        </div>
      </div>

      {/* Coche sobre el suelo brillante */}
      <div style={{ position: "absolute", left: 0, right: 0, top: roof - 60, height: 1190 - (roof - 60), overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 58%, transparent 86%), linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%)", WebkitMaskComposite: "source-in" }}>
        <Img src={staticFile(`img/story/${slug}-perfil.jpg`)} style={{ position: "absolute", left, top: imgTop - (roof - 60), width: w * s, height: h * s }} />
      </div>

      {/* Piezas en despiece flotando sobre su sitio */}
      {c.parts.map((p, i) => (
        <Img key={p.img} src={staticFile(`img/story/${slug}-${p.img}.jpg`)} style={{ position: "absolute", left: PX[i], top: PY, width: PW, height: PH, objectFit: p.fit ?? "contain", objectPosition: p.pos ?? "50% 50%", WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)" }} />
      ))}

      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {c.parts.map((p, i) => <Cad key={p.img} n={`0${i + 1}`} p={p.anchor} r={40} from={PX[i] + PW / 2} />)}
        <Cad n="04" p={c.extra} r={34} />
        {/* regla de escala sobre el suelo */}
        {Array.from({ length: 31 }, (_, i) => <line key={i} x1={240 + i * 20} y1={1112} x2={240 + i * 20} y2={i % 5 ? 1122 : 1130} stroke={GREY} strokeWidth="1.5" />)}
        <text x={540} y={1156} textAnchor="middle" fill={GREY} style={{ fontFamily: c.mono, fontSize: 16, letterSpacing: "0.18em" }}>{c.caption}</text>
      </svg>

      {/* Fichas: cifras de la ficha técnica de cada sala */}
      {c.facts.map((f, i) => (
        <div key={i} style={{ position: "absolute", left: i % 2 ? 555 : 60, top: i < 2 ? 1180 : 1270, width: 465, display: "flex", gap: 16, alignItems: "center", padding: "12px 16px", background: "rgba(0,0,0,0.86)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 4 }}>
          <div style={{ fontFamily: c.mono, fontSize: 17, fontWeight: 700, color: A, border: `1.5px solid ${A}`, width: 44, height: 30, display: "grid", placeItems: "center", flex: "none" }}>0{i + 1}</div>
          <div>
            <div style={{ fontFamily: c.mono, fontSize: c.codeSize ?? 16, letterSpacing: "0.08em", color: A, whiteSpace: "nowrap" }}>{f.code}</div>
            <div style={{ marginTop: 2, fontSize: 27, fontWeight: 600, color: PEARL, lineHeight: 1.15, whiteSpace: "nowrap" }}>{f.value}</div>
          </div>
        </div>
      ))}

      {/* Llamada a la acción con hueco para el sticker de enlace */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1372, height: 208, borderRadius: 4, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.14)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: A, borderRadius: "4px 4px 0 0" }} />
        <div style={{ marginTop: 22, fontSize: 36, fontWeight: 700, letterSpacing: "0.06em", textAlign: "center" }}>EXPLORA LA ANATOMÍA · <span style={{ color: A }}>TOCA PARA ENTRAR</span></div>
        <svg width="640" height="104" style={{ display: "block", margin: "16px auto 0" }}>
          <path d="M1 34 V1 H34 M606 1 H639 V34 M639 70 V103 H606 M34 103 H1 V70" fill="none" stroke={A} strokeWidth="3" />
          <rect x="10" y="10" width="620" height="84" rx="8" fill="none" stroke={PEARL} strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="8 8" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
