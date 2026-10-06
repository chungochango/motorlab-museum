import { Composition } from "remotion";
import { PromoVideo, PROMO } from "./PromoVideo";
import { CarSpotlight, calculateSpotlightMetadata } from "./CarSpotlight";
import { SPOTLIGHTS } from "./spotlights";
import { McLarenPromo, MCLAREN } from "./McLarenPromo";
import { GT3RSPromo, GT3RS } from "./GT3RSPromo";
import { McLarenHybrid, HYBRID } from "./McLarenHybrid";
import { R34Mfd, R34MFD } from "./R34Mfd";
import { M3Dtm, M3DTM } from "./M3Dtm";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="PromoVideo"
      component={PromoVideo}
      durationInFrames={PROMO.durationInFrames}
      fps={PROMO.fps}
      width={PROMO.width}
      height={PROMO.height}
    />
    <Composition
      id="McLarenPromo"
      component={McLarenPromo}
      durationInFrames={MCLAREN.durationInFrames}
      fps={MCLAREN.fps}
      width={MCLAREN.width}
      height={MCLAREN.height}
    />
    <Composition
      id="GT3RSPromo"
      component={GT3RSPromo}
      durationInFrames={GT3RS.durationInFrames}
      fps={GT3RS.fps}
      width={GT3RS.width}
      height={GT3RS.height}
    />
    <Composition
      id="McLarenHybrid"
      component={McLarenHybrid}
      durationInFrames={HYBRID.durationInFrames}
      fps={HYBRID.fps}
      width={HYBRID.width}
      height={HYBRID.height}
    />
    <Composition
      id="R34Mfd"
      component={R34Mfd}
      durationInFrames={R34MFD.durationInFrames}
      fps={R34MFD.fps}
      width={R34MFD.width}
      height={R34MFD.height}
    />
    <Composition
      id="M3Dtm"
      component={M3Dtm}
      durationInFrames={M3DTM.durationInFrames}
      fps={M3DTM.fps}
      width={M3DTM.width}
      height={M3DTM.height}
    />
    {/* Serie por sala: Spotlight-<slug> (props en src/spotlights.ts; también admite --props) */}
    {Object.entries(SPOTLIGHTS).map(([slug, props]) => (
      <Composition
        key={slug}
        id={`Spotlight-${slug}`}
        component={CarSpotlight}
        defaultProps={props}
        calculateMetadata={calculateSpotlightMetadata}
      />
    ))}
  </>
);
