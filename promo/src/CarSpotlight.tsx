import { AbsoluteFill, CalculateMetadataFunction, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT, label } from "./theme";
import { Grain } from "./scenes/Grain";

/* =========================================================
   CAR SPOTLIGHT · vídeo vertical de una sala (1080 × 1920)
   ---------------------------------------------------------
   Un coche, tres cifras y la invitación a su sala. Todo llega
   por props (ver src/spotlights.ts):
     · apertura: el coche sale de la penumbra con su nombre;
     · tres métricas: la cámara recorre la foto hasta la pieza
       de cada una (camera[i]) y la cifra cuenta hasta su valor
       (si es un número) o se escribe (si es texto);
     · cierre: plano general, logotipo y URL de la sala.
   Los tiempos se reparten según la duración (durationInSeconds).
   ========================================================= */
export type Metric = {
  value: number | string;     // número → cuenta hasta él; texto → aparece tal cual
  unit?: string;
  label: string;
};
export type CameraPoint = { x: number; y: number; zoom: number };   // foco en % de la foto y acercamiento

export type CarSpotlightProps = {
  name: string;
  badge?: string;               // segunda línea del nombre, más tenue
  room?: string;                // "Sala 06"
  years?: string;
  metrics: [Metric, Metric, Metric];
  accent: string;               // color de la sala en hex (#39FF14)
  image: string;                // ruta dentro de promo/public (img/temerario-hero.jpg)
  imageAspect: number;          // ancho / alto de la foto
  camera?: { open: CameraPoint; metrics: [CameraPoint, CameraPoint, CameraPoint] };
  url: string;                  // motorlabmuseum.com/temerario
  durationInSeconds: number;
};

export const calculateSpotlightMetadata: CalculateMetadataFunction<CarSpotlightProps> = ({ props }) => ({
  durationInFrames: Math.round(props.durationInSeconds * 30),
  fps: 30,
  width: 1080,
  height: 1920,
});

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const thousands = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const DEFAULT_CAMERA: NonNullable<CarSpotlightProps["camera"]> = {
  open: { x: 50, y: 52, zoom: 1.3 },
  metrics: [
    { x: 30, y: 50, zoom: 2.4 },
    { x: 50, y: 58, zoom: 2.2 },
    { x: 70, y: 52, zoom: 2.0 },
  ],
};

export const CarSpotlight: React.FC<CarSpotlightProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: D, width: W } = useVideoConfig();
  const accent = hexToRgb(p.accent);
  const cam = p.camera ?? DEFAULT_CAMERA;

  /* ---------- Tiempos ---------- */
  const OPEN = 72;                               // apertura (2,4 s)
  const CTA = Math.min(110, Math.round(D * 0.3)); // cierre
  const SEG = (D - OPEN - CTA) / 3;              // cada métrica
  const segStart = (i: number) => OPEN + i * SEG;
  const ctaStart = D - CTA;

  /* ---------- Cámara: viaja de un punto de foco al siguiente ---------- */
  const T = [0, OPEN - 10, segStart(0) + 14, segStart(1), segStart(1) + 14, segStart(2), segStart(2) + 14, ctaStart, ctaStart + 24, D];
  const P = [
    { ...cam.open, zoom: cam.open.zoom * 1.08 }, cam.open,
    cam.metrics[0], { ...cam.metrics[0], zoom: cam.metrics[0].zoom * 1.05 },
    cam.metrics[1], { ...cam.metrics[1], zoom: cam.metrics[1].zoom * 1.05 },
    cam.metrics[2], { ...cam.metrics[2], zoom: cam.metrics[2].zoom * 1.05 },
    { ...cam.open, zoom: cam.open.zoom * 0.92 }, { ...cam.open, zoom: cam.open.zoom * 0.9 },
  ];
  const ease = Easing.bezier(0.65, 0, 0.35, 1);   // travelling: arranca y frena suave
  const along = (k: keyof CameraPoint) => interpolate(frame, T, P.map((q) => q[k]), { ...clamp, easing: ease });
  const zoom = along("zoom");
  const imgW = W * zoom;
  const imgH = imgW / p.imageAspect;
  const CY = 760;                                  // altura del foco en pantalla (tercio superior)
  const left = W / 2 - (along("x") / 100) * imgW;
  const top = CY - (along("y") / 100) * imgH;

  // Apertura: de la penumbra a la luz; cierre: el coche baja a segundo plano
  const light = interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: EASE });
  const dimCta = interpolate(frame, [ctaStart, ctaStart + 20], [1, 0.45], clamp);
  const fadeEnd = interpolate(frame, [D - 6, D], [1, 0], clamp);

  /* ---------- Apertura: nombre ---------- */
  const nameIn = spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 28 });
  const nameOut = interpolate(frame, [OPEN - 8, OPEN + 6], [0, 1], { ...clamp, easing: EASE });

  /* ---------- Barras de progreso de las tres métricas (como las historias) ---------- */
  const bars = [0, 1, 2].map((i) => interpolate(frame, [segStart(i), segStart(i) + SEG], [0, 1], clamp));
  const barsOn = interpolate(frame, [OPEN - 6, OPEN + 6, ctaStart - 4, ctaStart + 6], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT, color: C.white, opacity: fadeEnd }}>
      {/* Foto con cámara */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(p.image)}
          style={{ position: "absolute", left, top, width: imgW, height: imgH, filter: `brightness(${light * dimCta}) saturate(${0.6 + 0.4 * light})`,
            // los bordes de la foto se funden con el negro: en los planos generales no se ve su canto
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 16%, #000 86%, transparent 100%), linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)",
            WebkitMaskComposite: "source-in" }}
        />
        {/* Fundido a negro arriba y abajo: el texto vive sobre negro, nunca sobre la foto */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.85) 62%, #000 72%)" }} />
      </AbsoluteFill>

      {/* Cabecera: sala y progreso */}
      <div style={{ position: "absolute", top: 120, left: 80, right: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...label(22), color: C.grey, opacity: light }}>
          <span>MotorLab Museum</span>
          {p.room ? <span style={{ color: C.platinum }}>{p.room}</span> : null}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 28, opacity: barsOn }}>
          {bars.map((b, i) => (
            <div key={i} style={{ height: 3, background: "rgba(255,255,255,0.16)", overflow: "hidden" }}>
              <div style={{ height: "100%", background: `rgb(${accent})`, transform: `scaleX(${b})`, transformOrigin: "0 50%" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Apertura: nombre del coche */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 1270, opacity: 1 - nameOut, transform: `translateY(${-nameOut * 30}px)` }}>
        {p.years ? (
          <div style={{ display: "flex", alignItems: "center", gap: 20, ...label(24), color: C.platinum, opacity: nameIn }}>
            <span style={{ width: 54, height: 2, background: `rgb(${accent})` }} />
            {p.years}
          </div>
        ) : null}
        <div style={{ overflow: "hidden", marginTop: 22 }}>
          <div style={{ fontSize: 120, fontWeight: 200, lineHeight: 1.02, letterSpacing: "-0.025em", transform: `translateY(${(1 - nameIn) * 105}%)` }}>
            {p.name}
            {p.badge ? <span style={{ display: "block", fontSize: 52, fontWeight: 300, color: C.grey, letterSpacing: 0, marginTop: 8 }}>{p.badge}</span> : null}
          </div>
        </div>
      </div>

      {/* Métricas */}
      {p.metrics.map((m, i) => (
        <MetricCard key={i} m={m} i={i} start={segStart(i)} seg={SEG} accent={accent} />
      ))}

      {/* Cierre */}
      <Outro p={p} start={ctaStart} accent={accent} />

      <Grain />
    </AbsoluteFill>
  );
};

const MetricCard: React.FC<{ m: Metric; i: number; start: number; seg: number; accent: string }> = ({ m, i, start, seg, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - start;
  if (f < -2 || f > seg + 10) return null;

  const enter = spring({ frame: f - 4, fps, config: { damping: 200, stiffness: 140 }, durationInFrames: 22 });
  const leave = interpolate(f, [seg - 8, seg + 6], [0, 1], { ...clamp, easing: EASE });
  const count = interpolate(f, [6, Math.min(seg - 14, 40)], [0, 1], { ...clamp, easing: EASE });
  const shown = typeof m.value === "number" ? thousands(m.value * count) : m.value;
  const size = String(shown).length > 6 ? 200 : 240;   // "10.000" y "V8 4.0" caben en una línea

  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 1210, opacity: 1 - leave, transform: `translateY(${-leave * 40}px)` }}>
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex", alignItems: "baseline", gap: 20, whiteSpace: "nowrap",
            fontSize: size, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
            transform: `translateY(${(1 - enter) * 100}%)`,
          }}
        >
          {shown}
          {m.unit ? <span style={{ fontSize: 64, fontWeight: 300, letterSpacing: "0.02em", color: `rgb(${accent})` }}>{m.unit}</span> : null}
        </div>
      </div>
      <div style={{ marginTop: 26, height: 1, background: C.hairline, transform: `scaleX(${enter})`, transformOrigin: "0 50%" }} />
      <div style={{ marginTop: 26, fontSize: 44, fontWeight: 300, color: C.platinum, opacity: interpolate(f, [10, 22], [0, 1], clamp) }}>
        {m.label}
      </div>
    </div>
  );
};

const Outro: React.FC<{ p: CarSpotlightProps; start: number; accent: string }> = ({ p, start, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - start;
  if (f < 0) return null;

  const a = (d: number) => interpolate(f, [d, d + 14], [0, 1], { ...clamp, easing: EASE });
  const pill = spring({ frame: f - 22, fps, config: { damping: 16, stiffness: 120 } });
  const arrow = interpolate(f, [44, 58, 72], [0, 10, 0], clamp);

  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 1150, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <Img src={staticFile("img/logo-mark.png")} style={{ width: 96, height: 96, opacity: a(2), transform: `scale(${0.9 + a(2) * 0.1})` }} />
      <div style={{ marginTop: 34, ...label(24), color: C.platinum, opacity: a(6) }}>
        {p.room ? `Visita la ${p.room}` : "Visita la sala"}
      </div>
      <div style={{ marginTop: 18, fontSize: 92, fontWeight: 200, lineHeight: 1.04, letterSpacing: "-0.02em", opacity: a(10), transform: `translateY(${(1 - a(10)) * 20}px)` }}>
        {p.name}
      </div>
      <div
        style={{
          marginTop: 56, display: "inline-flex", alignItems: "center", gap: 24 + arrow, height: 100, padding: "0 44px", borderRadius: 999,
          border: `1px solid rgba(${accent},0.7)`, background: `rgba(${accent},0.12)`,
          opacity: pill, transform: `scale(${0.94 + pill * 0.06})`,
        }}
      >
        <span style={{ ...label(32), letterSpacing: "0.1em", textTransform: "none" }}>{p.url}</span>
        <svg viewBox="0 0 16 12" width="32" height="24" fill="none" stroke={C.white} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6h14M10 1l5 5-5 5" />
        </svg>
      </div>
      <div style={{ marginTop: 40, ...label(20), color: C.greyDim, opacity: a(34) }}>
        MotorLab Museum · Entrada libre
      </div>
    </div>
  );
};
