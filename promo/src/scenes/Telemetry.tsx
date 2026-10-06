import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, label } from "../theme";

/* Escena 3 (7–11 s) · Telemetría y despiece
   La cámara entra en el despiece del V8 biturbo del Temerario: los puntos del
   museo se encienden sobre las piezas mientras la gráfica de régimen se dibuja
   hasta 10.000 rpm. Rótulo: "MotorLab // Análisis puro". */
const IMG_W = 1300;                      // la foto (1672 × 941) casi a lo ancho: se ven las tres piezas
const IMG_H = Math.round(IMG_W * 941 / 1672);

// Puntos en % de la foto, como los hotspots de data/cars.json
const POINTS = [
  { x: 21, y: 48, label: "Turbo", sub: "1 de 2", at: 18, side: "right" as const },
  { x: 58, y: 31, label: "V8 4.0 biturbo", sub: "10.000 rpm", at: 32, side: "left" as const },
  { x: 62, y: 74, label: "Escape", sub: "Colectores", at: 46, side: "left" as const },
];

// Curva de régimen (0–10.000 rpm) en un lienzo de 880 × 220
const RPM_PATH = "M0 210 C 90 205, 150 170, 220 150 S 360 120, 430 96 S 560 70, 640 44 S 790 22, 880 14";

export const Telemetry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], clamp);

  // Empuje de cámara lento hacia el centro del motor: las tres piezas siguen en cuadro
  const zoom = interpolate(frame, [0, durationInFrames], [1.02, 1.2], { ...clamp, easing: EASE });
  const panX = 0;

  const title = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 24 });
  const draw = interpolate(frame, [20, 96], [0, 1], { ...clamp, easing: EASE });
  const rpm = Math.round(draw * 10000 / 100) * 100;

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      {/* Despiece con sus puntos (se mueven con la cámara) */}
      <div
        style={{
          position: "absolute", left: "50%", top: 600, width: IMG_W, height: IMG_H, marginLeft: -IMG_W / 2,
          transform: `translateX(${panX}px) scale(${zoom})`, transformOrigin: "50% 45%",
        }}
      >
        <Img src={staticFile("img/despiece-motor.jpg")} style={{ width: "100%", height: "100%", filter: "brightness(0.9) contrast(1.05)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,0) 80%, #000 100%)" }} />
        {POINTS.map((p) => {
          const on = spring({ frame: frame - p.at, fps, config: { damping: 14, stiffness: 160 } });
          const tag = interpolate(frame, [p.at + 4, p.at + 14], [0, 1], { ...clamp, easing: EASE });
          const s = 1 / zoom;                       // los puntos no crecen con el zoom
          return (
            <div key={p.label} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: `scale(${s})` }}>
              <div
                style={{
                  position: "absolute", width: 44, height: 44, left: -22, top: -22, borderRadius: "50%",
                  border: `2px solid ${C.white}`, background: "rgba(0,0,0,0.55)",
                  transform: `scale(${on})`, boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
                }}
              >
                <div style={{ position: "absolute", inset: 12, borderRadius: "50%", background: `rgb(${C.temerario})` }} />
              </div>
              <div
                style={{
                  position: "absolute", top: -34, [p.side === "right" ? "left" : "right"]: 42, whiteSpace: "nowrap",
                  padding: "14px 22px", background: "rgba(0,0,0,0.82)", border: `1px solid ${C.hairline}`, borderRadius: 2,
                  opacity: tag, transform: `translateX(${(1 - tag) * (p.side === "right" ? -16 : 16)}px)`,
                }}
              >
                <div style={{ ...label(22), letterSpacing: "0.2em", color: C.white }}>{p.label}</div>
                <div style={{ marginTop: 4, fontSize: 24, color: C.grey }}>{p.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rótulo */}
      <div style={{ position: "absolute", top: 170, left: 96, right: 96, opacity: title, transform: `translateY(${(1 - title) * 20}px)` }}>
        <div style={{ ...label(26), color: C.grey }}>
          MotorLab <span style={{ color: `rgb(${C.temerario})` }}>//</span> Análisis puro
        </div>
        <div style={{ marginTop: 26, fontSize: 92, fontWeight: 200, lineHeight: 1.04, letterSpacing: "-0.02em" }}>
          Pieza a pieza,
          <br />
          <span style={{ fontWeight: 400 }}>cifra a cifra.</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 620, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 34%)" }} />
      {/* Telemetría: curva de régimen */}
      <div
        style={{
          position: "absolute", left: 96, right: 96, bottom: 190, padding: "30px 0 0", borderTop: `1px solid ${C.hairline}`,
          opacity: interpolate(frame, [14, 26], [0, 1], clamp),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ ...label(22), color: C.grey }}>Telemetría · régimen</span>
          <span style={{ fontSize: 64, fontWeight: 300, fontVariantNumeric: "tabular-nums" }}>
            {String(rpm).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            <span style={{ fontSize: 28, color: C.grey, marginLeft: 10 }}>rpm</span>
          </span>
        </div>
        <svg viewBox="0 0 880 220" style={{ width: "100%", height: 220, marginTop: 18, overflow: "visible" }}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="0" x2="880" y1={14 + i * 65} y2={14 + i * 65} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          ))}
          <path d={RPM_PATH} fill="none" stroke={C.white} strokeWidth="3" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} strokeLinecap="round" />
          <circle cx={880 * draw} cy={interpolate(draw, [0, 0.25, 0.5, 0.75, 1], [210, 150, 100, 46, 14])} r="8" fill={`rgb(${C.temerario})`} opacity={draw > 0.01 ? 1 : 0} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
