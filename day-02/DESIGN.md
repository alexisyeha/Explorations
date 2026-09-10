---
name: Day 002 — Living Mobile Illustration
description: The interactive wall-shadow of an off-camera mobile moving in a quiet breeze.
colors:
  warm-paper: "#F7F4EC"
  projected-shadow: "#453E39"
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

Day 002 is a full-screen kinetic artwork, not an interface wrapped around one. The physical mobile exists beyond the camera; only its warm-charcoal shadow reaches the ivory wall. Its crooked bars, bowed suspension lines, tiny looped joins, and six abstract marks remain legible through a soft penumbra. Catching a shadow reveals the connected physical mobile through motion, a private chime, and a soft haptic.

The approved form retains concept-roll seed `8038761e`'s two-level topology, refined through the user's living-illustration direction. It extends Day 001's quiet world by preserving the Warm Paper canvas while replacing realistic material cues with thin drawn curves and a restrained set of flat abstract marks.

**Key Characteristics:**

- Warm Paper continuity with Day 001, transformed by late-afternoon light
- Short, irregular top arch plus one shallow, wavering lower bar
- Six softly projected abstract shadow marks across an 18–56 point visual range
- Generous negative space and balanced asymmetry
- Direct drag, flick, linked impulse, quiet chime, and soft haptic
- Roughly 90° wind-driven back-and-forth swing with irregular drift and sway, with Reduce Motion respected
- Edge-to-edge presentation with no visible chrome
- A bright-left, pale-right warm wall receiving only the mobile's cast shadow

## Colors

Warm Paper is the uninterrupted field and the continuity anchor between Days 001 and 002. Every projected part of the off-camera mobile—thread, rod, loop, and hanging mark—uses one translucent warm charcoal. Identity comes from outline, size, placement, movement, and chime rather than color.

**The Sunlit Paper Rule.** Keep Day 001's Warm Paper as the material reference, then illuminate it with one directional system: Sunlit Paper (`#FFFDF7`) at the left, Warm Paper through the middle, and a pale Shaded Wall (`#E6D9CF`) at the right. The wall should read as warm ivory in shade, never brown or gray. Do not introduce unrelated texture or dark-mode inversion.

**The Projection Rule.** Never render the source mobile. The visible geometry is only its warm-charcoal projection (`#453E39`), softened by bounded blur and opacity. Do not distinguish objects through color, grain, interior marks, outlines, or material effects.

## Layout

Compose on a portrait reference stage of 390 × 844 points, centered and uniformly fitted to the live viewport. The whole drawing remains visible: a short curved thread descends from the top center to the raised arch; a compact bowed middle thread supports the left-offset wavering bar; the longer right chain descends through three tiny marks. Empty paper is active, while the full object section remains high in the viewport.

The sculpture stage scales responsively, but every interactive weight counter-scales by the inverse stage scale. This preserves the implemented 18–56 point visual range and at least a 56 × 56 point interaction area on shorter screens. Hit areas are invisible and equal to the larger of 56 points or the corresponding visual dimension plus 20 points.

**The Continuous Fit Rule.** Fit the complete 390 × 844 stage from current width and height; do not crop, rearrange, or shrink the weights into hard-to-touch miniatures for a particular phone.

## Elevation & Depth

One broad, warm color field shifts gently from high-key ivory at the left to pale parchment at the right. The source object remains outside the viewport; only its shadow appears, centered around an offset of 9 points right and 16 points down. As the unseen mobile swings across its 90° arc, the projection breathes gently between approximately 2.2 and 2.8 points of blur and 0.48–0.54 opacity.

The mobile eases from −45° to +45° in 8.6 seconds, then reverses through the same arc for a 17.2-second round trip. A 22-second slow current and 15.6-second cross-current softly disturb the endpoints, while an asymmetric 12.9-second gust sequence adds ±1.8° sway and eight points of horizontal drift. The broadside shadow gently narrows toward either end of the swing; the lower assembly follows with a smaller, counter-phased drift. Touch impulses add to the wind rather than replacing it, then decay back into the ambient motion. Blur and 3D transform remain on separate compositing layers for stable rendering.

**The Off-Camera Source Rule.** Preserve the warm wall gradient and show no crisp object, material surface, or duplicate outline. Blur is physical evidence of projection distance, not decorative glow.

## Shapes

The top bar is a fine multi-curve stroke whose rise, plateau, and falling shoulder are deliberately unequal. The lower bar is a shallow 146-point wavering curve rather than a straight line. Tiny imperfect loops appear only at meaningful balance and hanging points. Suspension lines are subtle S-curves at rest and flex toward the finger during drag.

The six projected shadow roles are fixed:

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

Reduce Motion stops the ambient swing and holds the projection at a quiet 14° angle with a fixed 2.8-point blur. Interaction remains available, but touch nudges are reduced and drag, rotation, and rod offsets return to rest with a short 120ms timing rather than lingering springs. Accessible taps still provide the small nudge, mapped chime, and soft haptic without requiring a pan gesture.

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
- **Do** show only one soft, offset projection of the off-camera mobile.

### Don't:

- **Don't** add titles, instructions, buttons, cards, navigation, status chrome, or persistent controls.
- **Don't** reveal the source mobile, add photographic texture, extra rods, extra weights, or decorative glows.
- **Don't** flatten the six marks into equal sizing or restore characters, perfect geometry, or thick material treatment.
- **Don't** make idle movement conspicuous, release behavior bouncy, or audio louder than the quiet 0.30 cap.
