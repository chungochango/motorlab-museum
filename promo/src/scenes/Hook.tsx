import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, EASE_IN, label } from "../theme";

/* Escena 1 (0–3 s) · Gancho
   Negro absoluto. Se enciende un filo de luz y el titular sube línea a línea desde
   detrás de una máscara; detrás, el F40 aparece en penumbra y lo cruza un barrido de
   luz, como en el Hall. Sale empujando hacia la cámara. */
const LINES: { text: string; weight: number; color: string }[] = [
  { text: "El museo", weight: 200, color: C.platinum },
  { text: "interactivo", weight: 200, color: C.platinum },
  { text: "de ingeniería", weight: 400, color: C.white },
  { text: "del motor.", weight: 400, color: C.white },
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rule = spring({ frame: frame - 4, fps, config: { damping: 200 }, durationInFrames: 26 });
  const kicker = interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // El coche: aparece en penumbra y se acerca muy despacio
  const carIn = interpolate(frame, [18, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const carScale = interpolate(frame, [0, durationInFrames], [1.12, 1.02]);
  const sweep = interpolate(frame, [44, 84], [-60, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Salida: empuje hacia la cámara y fundido
  const out = interpolate(frame, [durationInFrames - 16, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN });

  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.08})` }}>
      {/* F40 en penumbra en la mitad inferior */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 250 }}>
        <div style={{ position: "relative", width: 1240, opacity: carIn * 0.5, transform: `scale(${carScale})` }}>
          <Img src={staticFile("img/f40-perfil.webp")} style={{ width: "100%", display: "block", filter: "saturate(0.7) brightness(0.65)" }} />
          <div
            style={{
              position: "absolute", inset: 0, mixBlendMode: "screen",
              background: `linear-gradient(105deg, rgba(255,170,120,0) ${sweep - 14}%, rgba(255,170,120,0.22) ${sweep}%, rgba(255,170,120,0) ${sweep + 14}%)`,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, #000 100%), linear-gradient(90deg, #000 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,0) 86%, #000 100%)" }} />
        </div>
      </AbsoluteFill>

      {/* Titular */}
      <AbsoluteFill style={{ padding: "0 96px", justifyContent: "center", top: -230 }}>
        <div style={{ ...label(24), color: C.grey, opacity: kicker, transform: `translateY(${(1 - kicker) * 14}px)`, marginBottom: 44 }}>
          MotorLab Museum
        </div>
        {LINES.map((l, i) => {
          const p = spring({ frame: frame - (12 + i * 6), fps, config: { damping: 200, stiffness: 120 }, durationInFrames: 30 });
          return (
            <div key={l.text} style={{ overflow: "hidden", paddingBottom: 8 }}>
              <div
                style={{
                  fontSize: 128, lineHeight: 1.04, letterSpacing: "-0.02em", fontWeight: l.weight, color: l.color,
                  transform: `translateY(${(1 - p) * 110}%)`, opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
                }}
              >
                {l.text}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 52, height: 2, width: 260, background: `rgb(${C.f40})`, transform: `scaleX(${rule})`, transformOrigin: "0 50%" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
