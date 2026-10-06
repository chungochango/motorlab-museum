import { AbsoluteFill, useCurrentFrame } from "remotion";

/* Acabado de película sobre todo el vídeo: viñeta como la del museo (body::after)
   y un grano muy fino que cambia cada fotograma, para que el negro no se vea plano
   ni produzca bandas al comprimir en TikTok / Reels. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 85%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "screen" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
