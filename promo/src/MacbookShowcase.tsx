import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, EASE } from "./theme";
import { MacbookFrame, SCREEN_RATIO } from "./showcase/MacbookFrame";
import { Browser, Page } from "./showcase/Browser";
import { Cursor, CursorStop } from "./showcase/Cursor";
import TOMAS from "../public/web/tomas.json";

/* =========================================================
   MACBOOK SHOWCASE · 30 s (1080 × 1920, 30 fps)
   ---------------------------------------------------------
   Un MacBook Pro en CSS navega por MotorLab Museum con capturas
   reales de la web (promo/scripts/capturas.mjs). El cursor pulsa
   donde están los botones de verdad: tomas.json guarda sus
   coordenadas en cada captura.
     0–6 s    entra el portátil · Hall · clic en "Entrar en la sala"
     6–15 s   Sala 01 · F40: scroll al despiece y clic en chasis, motor, aerodinámica
     15–23 s  se teclea /190e/ · siete sistemas (Aerodinámica) · duelo con el M3
     23–30 s  el portátil se aleja · logotipo y llamada a la acción (quieto desde ~26 s)
   ========================================================= */
export const MACBOOK = { fps: 30, width: 1080, height: 1920, durationInFrames: 900 };

const S = TOMAS.shots;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LAPTOP_W = 900;                      // con la base (12 % más ancha) cabe en los 1080 px

/* ---------- Guion de navegación ---------- */
const PAGES: Page[] = [
  { at: 0, src: S["hall"].file, url: "/" },
  { at: 160, src: S["f40-portada"].file, url: "/f40/", via: "nav" },
  { at: 228, src: S["f40-piezas"].file, url: "/f40/", via: "scroll" },
  { at: 296, src: S["f40-chasis"].file, url: "/f40/", via: "scroll" },
  { at: 350, src: S["f40-motor"].file, url: "/f40/", via: "scroll" },
  { at: 404, src: S["f40-aero"].file, url: "/f40/", via: "scroll" },
  { at: 528, src: S["190e-portada"].file, url: "/190e/", via: "nav" },
  { at: 580, src: S["190e-sistemas"].file, url: "/190e/", via: "scroll" },
  { at: 628, src: S["190e-aero"].file, url: "/190e/", via: "nav" },
  { at: 668, src: S["190e-duelo"].file, url: "/190e/", via: "scroll" },
];
const TYPING = { from: 478, to: 512, text: "motorlabmuseum.com/190e/" };

// Coordenadas de los botones (píxeles de la captura 1440 × 900)
const hallBtn = S["hall"].click!;
const idxA = S["f40-piezas"].index!;          // índice lateral antes de bajar
const idxB = S["f40-chasis"].index!;          // índice lateral ya fijado arriba
const lane = S["190e-sistemas"].click!;

const CURSOR: CursorStop[] = [
  { at: 50, x: 1180, y: 520 },
  { at: 112, x: hallBtn.x, y: hallBtn.y },
  { at: 146, x: hallBtn.x, y: hallBtn.y, click: true },            // Entrar en la sala → F40
  { at: 236, x: 700, y: 420 },
  { at: 262, x: idxA.chasis.x - 40, y: idxA.chasis.y },
  { at: 288, x: idxA.chasis.x - 40, y: idxA.chasis.y, click: true }, // Chasis tubular
  { at: 318, x: idxB.motor.x - 40, y: idxB.motor.y },
  { at: 342, x: idxB.motor.x - 40, y: idxB.motor.y, click: true },   // Motor V8 biturbo
  { at: 370, x: idxB.aero.x - 40, y: idxB.aero.y },
  { at: 396, x: idxB.aero.x - 40, y: idxB.aero.y, click: true },     // Aerodinámica
  { at: 440, x: 640, y: 120 },
  { at: 466, x: 720, y: -38 },                                        // barra de direcciones
  { at: 472, x: 720, y: -38, click: true },
  { at: 540, x: 900, y: 600 },
  { at: 600, x: lane.x, y: lane.y },
  { at: 620, x: lane.x, y: lane.y, click: true },                     // pestaña Aerodinámica
  { at: 664, x: 1000, y: 760 },
];
const CLICKS = CURSOR.filter((c) => c.click).map((c) => c.at);

/* ---------- Rótulos sobre el portátil ---------- */
const CAPTIONS: { from: number; to: number; kicker: string; title: string }[] = [
  { from: 20, to: 160, kicker: "Hall principal", title: "Elige una sala" },
  { from: 175, to: 440, kicker: "Sala 01 · Ferrari F40", title: "Desmóntalo capa a capa" },
  { from: 460, to: 690, kicker: "Sala 07 · Mercedes 190E Evo II", title: "Ficha técnica y duelo" },
];

const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const c = CAPTIONS.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const a = interpolate(f, [c.from, c.from + 14, c.to - 10, c.to], [0, 1, 1, 0], { ...clamp, easing: EASE });
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 300, textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: C.grey }}>{c.kicker}</div>
      <div style={{ marginTop: 18, fontSize: 82, fontWeight: 200, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{c.title}</div>
    </div>
  );
};

export const MacbookShowcase: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada: sube desde abajo inclinado y se endereza; pequeños giros en las transiciones clave
  const enter = spring({ frame: f, fps, config: { damping: 18, stiffness: 70, mass: 1 } });
  const tilt = (at: number) => interpolate(f, [at - 10, at + 6, at + 30], [0, 1, 0], clamp);
  const rotY = -6 * tilt(160) + 7 * tilt(528) - 5 * tilt(690);
  const rotX = 24 * (1 - enter) + 4;
  // Cierre: se aleja y sube para dejar sitio al logotipo
  const out = interpolate(f, [690, 760], [0, 1], { ...clamp, easing: EASE });
  const zoomIn = interpolate(f, [60, 680], [1, 1.06], clamp);
  const scale = (0.86 + 0.14 * enter) * zoomIn * (1 - 0.3 * out);
  const y = (1 - enter) * 520 - out * 470;    // al cerrar sube para dejar sitio al logotipo

  const screenW = LAPTOP_W - Math.round(LAPTOP_W * 0.018) * 2;
  const screenH = Math.round(screenW * SCREEN_RATIO);
  const pageScale = screenW / TOMAS.width;

  const logo = spring({ frame: f - 720, fps, config: { damping: 18, stiffness: 90 } });
  const cta = spring({ frame: f - 748, fps, config: { damping: 18, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", fontFamily: FONT, color: C.white }}>
      {/* Fondo industrial: foco cenital, suelo y viñeta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 45% at 50% 38%, rgba(226,228,232,0.09), rgba(226,228,232,0) 70%), linear-gradient(180deg, #0d0d0e 0%, #0a0a0a 55%, #060606 100%)" }} />
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0 1px, rgba(255,255,255,0) 1px 120px)", opacity: 0.8 }} />

      <Caption />

      {/* Portátil con perspectiva */}
      <AbsoluteFill style={{ perspective: 2400, alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", marginTop: 420, transform: `translateY(${y}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`, transformOrigin: "50% 80%", opacity: interpolate(f, [0, 10], [0, 1], clamp) }}>
          {/* Sombra de contacto */}
          <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -40, height: 60, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.85), rgba(0,0,0,0))", filter: "blur(6px)" }} />
          <MacbookFrame width={LAPTOP_W} glare={0.7}>
            <Browser width={screenW} height={screenH} pages={PAGES} typing={TYPING}>
              <Cursor path={CURSOR} scale={pageScale} visibleFrom={50} visibleTo={680} />
            </Browser>
          </MacbookFrame>
        </div>
      </AbsoluteFill>

      {/* Cierre: logotipo, nombre y llamada a la acción */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 1180, textAlign: "center", opacity: logo, transform: `translateY(${(1 - logo) * 40}px)` }}>
        <Img src={staticFile("img/logo-mark.png")} style={{ width: 120, height: 120, margin: "0 auto" }} />
        <div style={{ marginTop: 22, fontSize: 40, fontWeight: 500, letterSpacing: "0.38em", textTransform: "uppercase" }}>MotorLab <span style={{ color: C.grey, fontWeight: 300 }}>Museum</span></div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1430, textAlign: "center", opacity: cta, transform: `translateY(${(1 - cta) * 30}px)` }}>
        <div style={{ fontSize: 64, fontWeight: 200, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Visita el museo gratis</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 18, marginTop: 34, height: 92, padding: "0 42px", borderRadius: 999, border: "1px solid rgba(226,228,232,0.6)", background: "rgba(226,228,232,0.08)", fontSize: 36, fontWeight: 500, letterSpacing: "0.06em" }}>
          motorlabmuseum.com
          <svg viewBox="0 0 16 12" width="30" height="22" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h14M10 1l5 5-5 5" /></svg>
        </div>
      </div>

      {/* Sonido: clics del ratón y tecleo de la URL */}
      {CLICKS.map((t) => <Sequence key={t} from={t} durationInFrames={4}><Audio src={staticFile("sfx/tick.wav")} volume={0.55} /></Sequence>)}
      {Array.from({ length: 12 }, (_, k) => TYPING.from + k * 3).map((t) => <Sequence key={t} from={t} durationInFrames={3}><Audio src={staticFile("sfx/tick.wav")} volume={0.25} /></Sequence>)}
    </AbsoluteFill>
  );
};

