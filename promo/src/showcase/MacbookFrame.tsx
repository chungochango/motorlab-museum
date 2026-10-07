/* =========================================================
   MacBook Pro en CSS (vista frontal, tapa abierta)
   ---------------------------------------------------------
   Tapa de aluminio con canto pulido, marco negro con notch, la
   pantalla (children) y la base con su hendidura de apertura.
   El tamaño lo marca `width`; la pantalla mantiene 16:10.
   ========================================================= */
export const SCREEN_RATIO = 10 / 16;

export const MacbookFrame: React.FC<{ width: number; children: React.ReactNode; glare?: number }> = ({ width, children, glare = 0.5 }) => {
  const bezel = Math.round(width * 0.018);
  const screenW = width - bezel * 2;
  const screenH = Math.round(screenW * SCREEN_RATIO);
  const lidH = screenH + bezel * 2 + Math.round(width * 0.004);
  return (
    <div style={{ position: "relative", width, height: lidH + Math.round(width * 0.045) }}>
      {/* Tapa: aluminio con canto pulido y marco negro */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, width, height: lidH, borderRadius: width * 0.03,
          background: "linear-gradient(180deg, #3a3c40 0%, #26282b 6%, #1a1b1d 100%)",
          boxShadow: "inset 0 0 0 1.5px #55585e, inset 0 2px 0 rgba(255,255,255,0.18), 0 2px 4px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ position: "absolute", inset: Math.round(width * 0.006), borderRadius: width * 0.026, background: "#050505" }} />
        {/* Pantalla */}
        <div style={{ position: "absolute", left: bezel, top: bezel, width: screenW, height: screenH, borderRadius: width * 0.012, overflow: "hidden", background: "#000" }}>
          {children}
          {/* Reflejo diagonal muy suave sobre el cristal */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(118deg, rgba(255,255,255,${0.09 * glare}) 0%, rgba(255,255,255,${0.03 * glare}) 28%, rgba(255,255,255,0) 42%)` }} />
        </div>
        {/* Notch con la cámara */}
        <div style={{ position: "absolute", left: "50%", top: bezel - 1, width: width * 0.11, height: bezel * 1.35, marginLeft: -width * 0.055, borderRadius: `0 0 ${bezel * 0.7}px ${bezel * 0.7}px`, background: "#050505" }}>
          <div style={{ position: "absolute", left: "50%", top: "32%", width: bezel * 0.5, height: bezel * 0.5, marginLeft: -bezel * 0.25, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #2b3a55, #0a0d14 60%)" }} />
        </div>
      </div>
      {/* Base: canto frontal de aluminio con la hendidura para abrir la tapa */}
      <div
        style={{
          position: "absolute", left: -width * 0.06, right: -width * 0.06, top: lidH - 2, height: Math.round(width * 0.03),
          borderRadius: `2px 2px ${width * 0.04}px ${width * 0.04}px`,
          background: "linear-gradient(180deg, #d9dce1 0%, #a9adb4 30%, #74787f 70%, #4b4e53 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.4) inset, 0 18px 40px -10px rgba(0,0,0,0.9)",
        }}
      >
        <div style={{ position: "absolute", left: "50%", top: 0, width: width * 0.16, height: "45%", marginLeft: -width * 0.08, borderRadius: `0 0 ${width * 0.02}px ${width * 0.02}px`, background: "linear-gradient(180deg, #6f7379, #9a9ea5)" }} />
      </div>
    </div>
  );
};
