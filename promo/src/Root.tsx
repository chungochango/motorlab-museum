import { Composition, Still } from "remotion";
import { PromoVideo, PROMO } from "./PromoVideo";
import { CarSpotlight, calculateSpotlightMetadata } from "./CarSpotlight";
import { SPOTLIGHTS } from "./spotlights";
import { McLarenPromo, MCLAREN } from "./McLarenPromo";
import { GT3RSPromo, GT3RS } from "./GT3RSPromo";
import { McLarenHybrid, HYBRID } from "./McLarenHybrid";
import { R34Mfd, R34MFD } from "./R34Mfd";
import { M3Dtm, M3DTM } from "./M3Dtm";
import { F40Tiktok, F40TT } from "./F40Tiktok";
import { Mercedes190eTiktok, M190 } from "./Mercedes190eTiktok";
import { MacbookShowcase, MACBOOK } from "./MacbookShowcase";
import { StoryPoster, STORY } from "./StoryPoster";
import { StoryPosterP1, STORY_P1 } from "./StoryPosterP1";
import { StoryRoom, STORY_ROOM, STORY_ROOMS } from "./StoryRoom";

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
    <Composition
      id="F40Tiktok"
      component={F40Tiktok}
      durationInFrames={F40TT.durationInFrames}
      fps={F40TT.fps}
      width={F40TT.width}
      height={F40TT.height}
    />
    <Composition
      id="Mercedes190eTiktok"
      component={Mercedes190eTiktok}
      durationInFrames={M190.durationInFrames}
      fps={M190.fps}
      width={M190.width}
      height={M190.height}
    />
    <Composition
      id="MacbookShowcase"
      component={MacbookShowcase}
      durationInFrames={MACBOOK.durationInFrames}
      fps={MACBOOK.fps}
      width={MACBOOK.width}
      height={MACBOOK.height}
    />
    {/* Cartel de Stories (fotograma fijo): npm run story */}
    <Still id="StoryPoster" component={StoryPoster} width={STORY.width} height={STORY.height} />
    <Still id="StoryPosterP1" component={StoryPosterP1} width={STORY_P1.width} height={STORY_P1.height} />
    {/* Stories por sala (fotograma fijo, en español): Story-<slug> */}
    {Object.keys(STORY_ROOMS).map((slug) => (
      <Still key={slug} id={`Story-${slug}`} component={StoryRoom} defaultProps={{ slug }} width={STORY_ROOM.width} height={STORY_ROOM.height} />
    ))}
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
