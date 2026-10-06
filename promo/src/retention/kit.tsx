import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

/* =========================================================
   KIT DE RETENCIÓN · piezas comunes de los vídeos frenéticos
   (temblor de cámara, escenas con golpe de entrada y salida
   en 8 fotogramas, carbono, grano, destellos, avisos y texto
   que entra palabra a palabra con rebote).
   ========================================================= */
const { fontFamily: INTER } = loadFont("normal", { weights: ["300", "500", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
export const HEAVY = `${INTER}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const XFADE = 8;

export const bouncy = { damping: 7, stiffness: 190, mass: 0.6 };   // rebote seco para datos y etiquetas
export const slam = { damping: 11, stiffness: 420, mass: 0.5 };    // golpe para titulares

export const rgba = (rgb: string, a = 1) => `rgba(${rgb}, ${a})`;
export const thousands = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const tag: React.CSSProperties = { fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" };

// Las fotos del museo tienen fondo negro puro: sobre el carbono se vería su rectángulo
export const FADE: React.CSSProperties = {
  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
  WebkitMaskComposite: "source-in",
};

/* Temblor de cámara: suma de impactos [fotograma, amplitud] que se apagan en ~10 fotogramas */
export const shake = (frame: number, impacts: [number, number][]) => {
  let x = 0, y = 0, r = 0;
  for (const [t, amp] of impacts) {
    const d = frame - t;
    if (d < 0 || d > 14) continue;
    const k = amp * Math.exp(-d / 3.2);
    x += (random(`x${t}-${frame}`) - 0.5) * 2 * k;
    y += (random(`y${t}-${frame}`) - 0.5) * 2 * k;
    r += (random(`r${t}-${frame}`) - 0.5) * k * 0.06;
  }
  return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)`;
};

/* Escena: entra con un golpe de escala y sale en XFADE fotogramas empujando y desenfocando */
export const Scene: React.FC<{ dur: number; children: React.ReactNode; exit?: boolean }> = ({ dur, children, exit = true }) => {
  const f = useCurrentFrame();
  const inS = interpolate(f, [0, 6], [1.14, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const inO = interpolate(f, [0, 3], [0, 1], clamp);
  const out = exit ? interpolate(f, [dur - XFADE, dur], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{ opacity: inO * (1 - out), transform: `scale(${inS + out * 0.22})`, filter: out > 0 ? `blur(${out * 18}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

export const Carbon: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `
        radial-gradient(ellipse 90% 60% at 50% 45%, rgba(0,0,0,0) 30%, #000 100%),
        repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0 7px, rgba(255,255,255,0) 7px 14px),
        repeating-linear-gradient(-45deg, rgba(0,0,0,0.55) 0 7px, rgba(0,0,0,0) 7px 14px),
        #0c0c0e`,
    }}
  />
);

export const Alert: React.FC<{ size?: number; color: string }> = ({ size = 44, color }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path d="M12 2.8 22.6 21H1.4Z" fill={color} />
    <path d="M12 9v5.6" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="12" cy="17.6" r="1.4" fill="#000" />
  </svg>
);

/* Grano y viñeta; desde stillFrom el grano se congela para que el final quede totalmente quieto */
export const Grain: React.FC<{ stillFrom: number }> = ({ stillFrom }) => {
  const frame = useCurrentFrame();
  const seed = frame >= stillFrom ? 0 : frame % 24;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 80% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 88%, rgba(0,0,0,0.7) 100%)" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "screen" }}>
        <filter id="kit-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#kit-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/* Destello en cada corte de escena */
export const Flash: React.FC<{ cuts: number[]; rgb: string }> = ({ cuts, rgb }) => {
  const frame = useCurrentFrame();
  let o = 0;
  for (const c of cuts) o = Math.max(o, interpolate(frame, [c, c + 1, c + 6], [0, 0.55, 0], clamp));
  return <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%, rgba(255,245,225,${o}), ${rgba(rgb, o * 0.5)})`, mixBlendMode: "screen" }} />;
};

/* Texto narrativo palabra a palabra: cada palabra salta con un muelle seco.
   Las palabras de `hot` se pintan con el acento. */
export const Words: React.FC<{ text: string; at: number; every?: number; size: number; weight?: number; color?: string; hot?: string[]; accent: string; style?: React.CSSProperties }> = ({
  text, at, every = 3, size, weight = 800, color = "#f5f5f4", hot = [], accent, style,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.26, rowGap: size * 0.06, fontSize: size, fontWeight: weight, lineHeight: 1.02, letterSpacing: "-0.02em", ...style }}>
      {text.split(" ").map((w, i) => {
        const t = at + i * every;
        const s = spring({ frame: f - t, fps, config: bouncy });
        return (
          <span key={i} style={{ display: "inline-block", color: hot.includes(w) ? accent : color, opacity: f >= t ? 1 : 0, transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s})`, transformOrigin: "50% 100%" }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
