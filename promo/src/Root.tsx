import { Composition } from "remotion";
import { PromoVideo, PROMO } from "./PromoVideo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PromoVideo"
    component={PromoVideo}
    durationInFrames={PROMO.durationInFrames}
    fps={PROMO.fps}
    width={PROMO.width}
    height={PROMO.height}
  />
);
