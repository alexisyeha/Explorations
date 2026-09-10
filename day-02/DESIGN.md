---
name: Day 002 — Living Mobile Illustration
description: A sparse hand-drawn mobile illustration that responds with real connected motion.
colors:
  warm-paper: "#F7F4EC"
  mobile-silhouette: "#171511"
  sunlit-paper: "#FFFDF4"
  shaded-wall: "#E6D9CF"
components:
  mobile-stage:
    backgroundColor: "{colors.warm-paper}"
    width: "390pt"
    height: "844pt"
  interactive-weight:
    size: "56pt minimum hit area"
---

# Design System: Day 002 — Mobile

## Overview

**Creative North Star: "The Living Mobile Drawing"**

Day 002 is a full-screen kinetic artwork, not an interface wrapped around one. It first reads as the black silhouette of a sparse hand-drawn mobile: two crooked ink-like bars, bowed suspension lines, tiny looped joins, and six abstract marks floating high in uninterrupted paper. Catching any mark reveals that the silhouette also behaves as a connected physical mobile through motion, a private chime, and a soft haptic.

The approved form retains concept-roll seed `8038761e`'s two-level topology, refined through the user's living-illustration direction. It extends Day 001's quiet world by preserving the Warm Paper canvas while replacing realistic material cues with thin drawn curves and a restrained set of flat abstract marks.

**Key Characteristics:**

- Warm Paper continuity with Day 001, transformed by late-afternoon light
- Short, irregular top arch plus one shallow, wavering lower bar
- Six flat black abstract marks across an 18–56 point visual range
- Generous negative space and balanced asymmetry
- Direct drag, flick, linked impulse, quiet chime, and soft haptic
- Slow idle yaw and sway, with Reduce Motion respected
- Edge-to-edge presentation with no visible chrome
- A bright-left, pale-right warm field with no cast shadows

## Colors

Warm Paper is the uninterrupted field and the continuity anchor between Days 001 and 002. Every physical part of the mobile—thread, rod, loop, and hanging mark—uses one warm near-black ink. Identity comes from outline, size, placement, motion, and chime rather than color.

**The Sunlit Paper Rule.** Keep Day 001's Warm Paper as the material reference, then illuminate it with one directional system: Sunlit Paper (`#FFFDF7`) at the left, Warm Paper through the middle, and a pale Shaded Wall (`#E6D9CF`) at the right. The wall should read as warm ivory in shade, never brown or gray. Do not introduce unrelated texture or dark-mode inversion.

**The Single-Ink Rule.** The complete mobile uses one flat near-black (`#171511`). Do not distinguish objects through color, grain, interior marks, outlines, or material effects.

## Layout

Compose on a portrait reference stage of 390 × 844 points, centered and uniformly fitted to the live viewport. The whole drawing remains visible: a short curved thread descends from the top center to the raised arch; a compact bowed middle thread supports the left-offset wavering bar; the longer right chain descends through three tiny marks. Empty paper is active, while the full object section remains high in the viewport.

The sculpture stage scales responsively, but every interactive weight counter-scales by the inverse stage scale. This preserves the implemented 18–56 point visual range and at least a 56 × 56 point interaction area on shorter screens. Hit areas are invisible and equal to the larger of 56 points or the corresponding visual dimension plus 20 points.

**The Continuous Fit Rule.** Fit the complete 390 × 844 stage from current width and height; do not crop, rearrange, or shrink the weights into hard-to-touch miniatures for a particular phone.

## Elevation & Depth

One broad, warm color field shifts gently from high-key ivory at the left to pale parchment at the right. Objects, bars, and threads remain completely shadowless. Depth comes only from linked motion and overlap, never from blur, glow, texture, or simulated material thickness.

During idle, the complete mobile yaws gently in perspective between −5.5° and 5.5° and sways between −0.8° and 0.8° on a 6800ms sinusoidal round trip; the lower assembly adds its own restrained −0.7° to 0.7° sway.

**The Flat Silhouette Rule.** Preserve the warm wall gradient, but keep every hanging element visually flat. Do not add cast shadows, ambient occlusion, glow, texture, gloss, or carved edges.

## Shapes

The top bar is a fine multi-curve stroke whose rise, plateau, and falling shoulder are deliberately unequal. The lower bar is a shallow 146-point wavering curve rather than a straight line. Tiny imperfect loops appear only at meaningful balance and hanging points. Suspension lines are subtle S-curves at rest and flex toward the finger during drag.

The six black silhouette roles are fixed:

- **Wedge:** a soft, uneven 30 × 28 point triangular scrap.
- **Connected Pebbles:** a narrow 22 × 54 point chain of three joined lobes.
- **Long Stone:** a long, low 56 × 18 point organic pebble.
- **Paper Form:** a compact 30-point irregular rounded tile.
- **Drop:** a 28 × 36 point asymmetrical suspended droplet.
- **Lozenge:** a long, low 50 × 18 point organic dash.

**The Illustrated Mobile Rule.** The screen must read first as a sparse drawing and second as a working mobile. Preserve the six abstract identities, uneven scale, curved bars, and drawn joins; do not restore characters, perfect geometry, thick rods, or simulated realism.

## Components

### Interactive Weight

Each weight is draggable and accessible as a labeled button. The two vertically stacked left weights share one motion state and one continuous tether; the three vertically stacked right weights share a second motion state and continuous tether. Touching any member moves every object on its thread together while the touched shape retains its own quiet chime, soft haptic, and 3.5% contact enlargement. Horizontal drag also transfers bounded rotation and sway into the main rod and, for the three left weights, the lower rod.

Release velocity drives both the weight's return spring and the rods' settling impulse. A sufficiently energetic release plays a second instance of the same chime, with loudness derived from velocity. The weight return is lighter and quicker than the deliberately loose shared-rod sway; neither interaction should feel like a UI spring or a celebratory bounce.

**The Connected Touch Rule.** Touching one shape must disturb its supporting structure. Objects drawn on the same vertical thread must share displacement and settling motion, so the sculpture never breaks into independent draggable stickers.

### Motion Accessibility

Reduce Motion removes the continuous idle yaw and sway. Interaction remains available, but touch nudges are reduced and drag, rotation, and rod offsets return to rest with a short 120ms timing rather than lingering springs. Accessible taps still provide the small nudge, mapped chime, and soft haptic without requiring a pan gesture.

### Synthesized Chimes

Each mark maps to one locally generated, 1.35-second mono bell tone: Wedge → C5 (523.25Hz), Connected Pebbles → E5 (659.25Hz), Long Stone → G4 (392Hz), Paper Form → G5 (783.99Hz), Drop → A5 (880Hz), and Lozenge → D6 (1174.66Hz). The tones share a brief attack, decaying envelope, and four slightly inharmonic partials, so they feel related without becoming indistinguishable.

Playback volume rises with gesture intensity but is capped at 0.30. Audio mixes with other playback, does not continue in the background, and respects the device silent switch. Sound and haptics are feedback for touch; they never become ambient audio.

**The Private Chime Rule.** Keep tones short, local, sparse, and quiet. One sounds on contact; a second sounds on release only when the gesture carries enough velocity.

## Do's and Don'ts

### Do:

- **Do** preserve the exact Day 001 Warm Paper field and let it remain visually uninterrupted.
- **Do** retain the shortened top arch, left-offset second bar, long right chain, and raised composition.
- **Do** preserve the 18–56 point visual range and 56-point minimum touch areas through inverse scaling.
- **Do** keep touch, tether movement, linked impulses, chime, and haptic synchronized as one material response.
- **Do** honor Reduce Motion and the device silent switch.
- **Do** keep objects, bars, and threads completely free of shadows and texture.

### Don't:

- **Don't** add titles, instructions, buttons, cards, navigation, status chrome, or persistent controls.
- **Don't** add glass, photographic texture, extra rods, extra weights, cast shadows, or decorative glows.
- **Don't** flatten the six marks into equal sizing or restore characters, perfect geometry, or thick material treatment.
- **Don't** make idle movement conspicuous, release behavior bouncy, or audio louder than the quiet 0.30 cap.
