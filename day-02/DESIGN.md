---
name: Day 002 — Mobile
description: A quiet, touch-responsive hanging sculpture on the same warm paper field as Day 001.
colors:
  warm-paper: "#F7F4EC"
  suspension-thread: "#8D8578"
  browned-brass-rod: "#5A4B33"
  charcoal: "#423D35"
  matte-bone: "#E2D8C8"
  muted-clay: "#B88368"
  deep-cobalt: "#303990"
  sunlit-paper: "#FFFDF4"
  shaded-wall: "#E6D9CF"
  cast-shadow: "#604936"
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

**Creative North Star: "The Breathing Gallery Mobile"**

Day 002 is a full-screen kinetic artwork, not an interface wrapped around one. A delicate two-rod mobile of six storybook horse characters hangs high in an uninterrupted paper field and is already moving when encountered. Catching any character briefly reveals the sculpture's connected physics through motion, a private chime, and a soft haptic.

The approved form is concept-roll seed `8038761e`: composition A with a noticeably shortened, asymmetric top arch. It extends Day 001's quiet, tactile world by preserving the exact same Warm Paper canvas while replacing literary ink with a restrained material palette of thread, browned brass, charcoal, bone, clay, and cobalt.

**Key Characteristics:**

- Warm Paper continuity with Day 001, transformed by late-afternoon light
- Short bowed top arch plus one fine straight lower rod
- Six tiny hand-drawn paper horse characters across a 28–100 point visual range
- Generous negative space and balanced asymmetry
- Direct drag, flick, linked impulse, quiet chime, and soft haptic
- Slow idle yaw and sway, with Reduce Motion respected
- Edge-to-edge presentation with no visible chrome
- A bright-left, shaded-right sun field and soft down-left cast shadows

## Colors

Warm Paper is the uninterrupted field and the continuity anchor between Days 001 and 002. Suspension Thread stays recessive; Browned Brass Rod gives the structure slightly more presence without becoming ornamental. Muted sage, charcoal, cream, warm gray, apricot, and red live inside visible colored-pencil strokes rather than flat material fills.

**The Sunlit Paper Rule.** Keep Day 001's Warm Paper as the material reference, then illuminate it with one directional system: Sunlit Paper (`#FFFDF7`) at the left, Warm Paper through the middle, and a pale Shaded Wall (`#E6D9CF`) at the right. The wall should read as warm ivory in shade, never brown or gray. Do not introduce unrelated texture or dark-mode inversion.

**The Handmade Color Rule.** Let color remain uneven, quiet, and visibly built from pencil strokes over cream paper. No character should read as a smooth digital fill.

## Layout

Compose on a portrait reference stage of 390 × 844 points, centered and uniformly fitted to the live viewport. The whole sculpture remains visible: one near-invisible thread descends from the top center to the upper-third arch; a second thread supports the left-offset straight rod; the longer right chain descends through moon-glancing, bread, and jumping horses. Empty paper is an active part of the balance.

The sculpture stage scales responsively, but every interactive weight counter-scales by the inverse stage scale. This preserves the implemented 28–100 point visual range and at least a 56 × 56 point interaction area on shorter screens. Hit areas are invisible and equal to the larger of 56 points or the corresponding visual dimension plus 20 points.

**The Continuous Fit Rule.** Fit the complete 390 × 844 stage from current width and height; do not crop, rearrange, or shrink the weights into hard-to-touch miniatures for a particular phone.

## Elevation & Depth

One broad, warm light field creates the depth system: high-key paper at the left transitions through the original warm field into a muted shaded wall at the right. Every weight carries a down-left shadow with a real offset and soft penumbra; its shadow remains attached while the weight is touched, dragged, or settling. Fine rods and suspension threads receive a lighter version of the same shadow. There are no independent halos, card shadows, or decorative glows.

During idle, the complete mobile yaws gently in perspective between −5.5° and 5.5° and sways between −0.8° and 0.8° on a 6800ms sinusoidal round trip; the lower assembly adds its own restrained −0.7° to 0.7° sway.

**The Window-Light Rule.** All depth must agree with one light source above and to the left: bright field on the left, shaded field on the right, and warm cast shadows displaced down and left. Preserve thin paper texture; do not add simulated gloss, carved edges, or object-by-object lighting effects.

## Shapes

The top rod is a fine, rounded bowed stroke: shorter than the original approved comp, asymmetric, and visually balanced rather than geometrically centered. The lower rod is a 146-point straight hairline offset left. Warm-gray suspension lines stay at one point with reduced opacity and stretch or rotate continuously to follow a dragged weight.

The six weight roles are fixed:

- **Kettle Horse:** a small sage horse whose round body forms a kettle beneath a loop handle.
- **Hugging Horses:** one charcoal and one cream horse leaning together as a single connected cutout.
- **Long Horse:** an elongated warm-gray running horse scattered with cream stars.
- **Moon-glancing Horse:** a seated tan horse looking toward its tiny golden moon.
- **Bread Horse:** a plump apricot horse with a loaf-like body and short legs.
- **Jumping Horse:** a red flying horse with golden wings, mane, and three stars.

**The Six-Character Rule.** Preserve these six identities, visible pencil grain, thin cream paper edges, and intentionally uneven scale; do not replace them with the earlier geometric weights, add ornaments, or introduce a third rod.

## Components

### Interactive Weight

Each weight is independently draggable and accessible as a labeled button. Touch-down immediately plays that weight's quiet chime, gives a soft haptic, enlarges it by 3.5%, and nudges the connected rod before the drag begins. Horizontal drag transfers bounded rotation and sway into the main rod and, for the three left weights, the lower rod. The tether remains attached and follows the finger.

Release velocity drives both the weight's return spring and the rods' settling impulse. A sufficiently energetic release plays a second instance of the same chime, with loudness derived from velocity. The weight return is lighter and quicker than the deliberately loose shared-rod sway; neither interaction should feel like a UI spring or a celebratory bounce.

**The Connected Touch Rule.** Touching one shape must disturb its supporting structure so the sculpture reads as one linked system, not six independent draggable stickers.

### Motion Accessibility

Reduce Motion removes the continuous idle yaw and sway. Interaction remains available, but touch nudges are reduced and drag, rotation, and rod offsets return to rest with a short 120ms timing rather than lingering springs. Accessible taps still provide the small nudge, mapped chime, and soft haptic without requiring a pan gesture.

### Synthesized Chimes

Each character maps to one locally generated, 1.35-second mono bell tone: Kettle Horse → C5 (523.25Hz), Hugging Horses → E5 (659.25Hz), Long Horse → G4 (392Hz), Moon-glancing Horse → G5 (783.99Hz), Bread Horse → A5 (880Hz), and Jumping Horse → D6 (1174.66Hz). The tones share a brief attack, decaying envelope, and four slightly inharmonic partials, so they feel related without becoming indistinguishable.

Playback volume rises with gesture intensity but is capped at 0.30. Audio mixes with other playback, does not continue in the background, and respects the device silent switch. Sound and haptics are feedback for touch; they never become ambient audio.

**The Private Chime Rule.** Keep tones short, local, sparse, and quiet. One sounds on contact; a second sounds on release only when the gesture carries enough velocity.

## Do's and Don'ts

### Do:

- **Do** preserve the exact Day 001 Warm Paper field and let it remain visually uninterrupted.
- **Do** retain approved composition A's shortened top arch, left-offset second rod, and long right chain.
- **Do** preserve the 28–100 point weight range and 56-point minimum touch areas through inverse scaling.
- **Do** keep touch, tether movement, linked impulses, chime, and haptic synchronized as one material response.
- **Do** honor Reduce Motion and the device silent switch.
- **Do** keep every cast shadow soft, directionally consistent, and attached to its moving weight.

### Don't:

- **Don't** add titles, instructions, buttons, cards, navigation, status chrome, or persistent controls.
- **Don't** add glass, photographic texture, extra rods, extra weights, or any gradient/shadow outside the single natural-light system.
- **Don't** flatten the six characters into equal sizing, smooth vector silhouettes, or thick wood-like objects.
- **Don't** make idle movement conspicuous, release behavior bouncy, or audio louder than the quiet 0.30 cap.
