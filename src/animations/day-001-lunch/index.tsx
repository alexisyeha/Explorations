import { useWindowDimensions } from 'react-native';

import { TextImageMorph } from '../text-image-morph';
import { LUNCH_TEXT } from './text';

const LUNCH_IMAGE = require('./assets/lunch-target.png');

/*
THESIS: A novel page physically becomes the lunch it describes; no image layer replaces the type.
OWN-WORLD: Warm paper, charcoal Newsreader glyphs, stippled food contours, and no visible chrome.
STORY: Read the passage, then let a slow, gentle disturbance travel diagonally from the lower-right glyphs until language becomes lunch; reverse it by dragging down.
FIRST VIEWPORT: The shortened passage is vertically centred as a quiet text block; the entire surface is the vertical scrub target.
FORM: Full-screen tactile literary study with a sparse rectangular sandwich visibly split into two diagonal halves, round tomato curves peeking into the cut seam, and a broad steam-free upper-right cup; seed key: pinned-brief/100-day-creative-project/day-001-lunch.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
*/
export const Day001LunchScreen = () => {
  const { width, height } = useWindowDimensions();

  return (
    <TextImageMorph
      width={width}
      height={height}
      image={LUNCH_IMAGE}
      interaction="vertical-scrub"
      pageMarginYFraction={0.085}
      pageVerticalAlignment="center"
      paragraph={LUNCH_TEXT}
      scrubSettleDurationMs={1900}
      scrubTapDurationMs={4200}
      scrubTravelFraction={1.08}
    />
  );
};
