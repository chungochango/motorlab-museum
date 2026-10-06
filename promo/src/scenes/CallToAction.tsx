import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, label } from "../theme";

/* Escena 4 (11–15 s) · Llamada a la acción
   El logotipo se asienta con un muelle suave y lo cruza el barrido de luz del Hall;
   debajo, la invitación y la URL en el botón del museo. El último segundo queda
   quieto para que dé tiempo a leer la dirección. */
export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const logo = spring({ frame, fps, config: { damping: 18, stiffness: 90, mass: 1 } });
  const sweep = interpolate(frame, [14, 50], [-40, 140], { ...clamp, easing: EASE });
  const line = (d: number) => interpolate(frame, [d, d + 14], [0, 1], { ...clamp, easing: EASE });
  const cta = spring({ frame: frame - 30, fps, config: { damping: 16, stiffness: 120 } });
  const arrow = interpolate(frame, [52, 66, 80], [0, 10, 0], clamp);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", opacity: interpolate(frame, [0, 8], [0, 1], clamp) }}>
      <div style={{ position: "relative", width: 620, height: 620, marginTop: -140, opacity: logo, transform: `scale(${0.92 + logo * 0.08})` }}>
        <Img src={staticFile("img/logo.png")} style={{ width: "100%", height: "100%", WebkitMaskImage: "radial-gradient(closest-side, #000 82%, transparent 100%)" }} />
        <div
          style={{
            // overlay: aclara el metal del logotipo y deja el negro intacto (sin descubrir el fondo del PNG)
            position: "absolute", inset: 0, mixBlendMode: "overlay",
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.55) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)`,
          }}
        />
      </div>

      <div style={{ marginTop: 40, fontSize: 84, fontWeight: 200, lineHeight: 1.08, letterSpacing: "-0.02em", opacity: line(18), transform: `translateY(${(1 - line(18)) * 20}px)` }}>
        Entra en el museo.
      </div>
      <div style={{ marginTop: 18, fontSize: 32, color: C.platinum, opacity: line(24), transform: `translateY(${(1 - line(24)) * 16}px)` }}>
        Historia, anatomía e ingeniería, sala a sala.
      </div>

      <div
        style={{
          marginTop: 64, display: "inline-flex", alignItems: "center", gap: 26 + arrow, height: 104, padding: "0 46px", borderRadius: 999,
          border: `1px solid rgba(${C.neutral},0.6)`, background: `rgba(${C.neutral},0.08)`,
          opacity: cta, transform: `scale(${0.94 + cta * 0.06})`,
        }}
      >
        <span style={{ ...label(34), letterSpacing: "0.12em", color: C.white }}>motorlabmuseum.com</span>
        <svg viewBox="0 0 16 12" width="34" height="26" fill="none" stroke={C.white} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6h14M10 1l5 5-5 5" />
        </svg>
      </div>

      <div style={{ position: "absolute", bottom: 150, ...label(22), color: C.greyDim, opacity: line(40) }}>
        Proyecto sin ánimo de lucro · Entrada libre
      </div>
    </AbsoluteFill>
  );
};
