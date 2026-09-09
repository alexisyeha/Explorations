---
name: Day 001 — Lunch
description: A centered three-paragraph novel excerpt whose own glyphs become a spare lunch still life.
colors:
  warm-paper: "#f7f4ec"
  charcoal-ink: "#1c1a17"
typography:
  body:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "14.4px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  picture-texture:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "13.2px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
spacing:
  page-x: "9vw"
  page-y: "8.5vh"
components:
  novel-page:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.body}"
    padding: "{spacing.page-y} {spacing.page-x}"
  glyph-still-life:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.picture-texture}"
    width: "90vw"
    height: "70vh"
---

# Design System: Day 001 — Lunch

## Overview

**Creative North Star: "The Living Novel Page"**

Day 001 — Lunch is a quiet literary object before it is an interface. A warm paper field and a single serif voice make the opening state feel like a page from a well-kept paperback: intimate, patient, and unadorned. The selected first three paragraphs form a calm block centered vertically in the viewport while retaining conventional left-aligned reading. The app contributes no visible chrome, instruction label, panel, or decorative frame. The passage itself is the whole surface.

The signature move is literal and material: 520 visible glyphs leave their readable lines and assemble the lunch named in the prose. The final field is deliberately spare, with an edge-led rectangular sandwich, paper-filled interiors, and generous negative space. A narrow diagonal gap clearly separates the sandwich into two halves, while two round tomato curves peek into that seam so the filling reads without becoming a dense interior mass. The sandwich sits on a plate tightened toward the left, while a broad, detached coffee cup at the upper right uses an outline-led construction to clarify its rim, body, handle, and coffee without any steam.

**Key Characteristics:**

- Warm paper and near-black ink only
- Newsreader as both readable prose and image-making material
- A vertically centered, conventionally left-aligned three-paragraph reading block
- Full-screen, chrome-free composition
- Direct, reversible vertical scrubbing
- Slow lower-right-to-upper-left glyph propagation
- Deterministic glyph placement at both endpoints
- Spare, edge-led glyph density with paper-filled sandwich and cup interiors
- A broad, detached, steam-free upper-right coffee cup
- Continuous responsive fitting rather than device-specific layouts

## Colors

The palette is intentionally binary: softly warm paper lowers contrast just enough to feel tactile, while charcoal ink keeps both prose and the stippled still life legible.

### Neutral

- **Warm Paper:** The uninterrupted canvas behind the reading and still-life states.
- **Charcoal Ink:** Every visible passage glyph and every mark in the assembled lunch.

### Named Rules

**The Ink-on-Paper Rule.** Keep the artwork to one paper field and one ink color; form comes from density, overlap, scale, and motion rather than added color.

## Typography

**Body Font:** Newsreader (with Georgia and a generic serif fallback)

**Character:** Newsreader gives the passage a contemporary literary cadence without turning it into display typography. The same familiar letterforms become a rough, stippled drawing when clustered, so the reading and image states remain visibly continuous.

### Hierarchy

- **Body** (regular, responsive from a 30px atlas at a 0.48 display scale, 1.55 line-height): The exact selected three-paragraph excerpt, word-wrapped into a vertically centered, left-aligned portrait reading block with first-line paragraph indents.
- **Picture Texture** (regular, the same 30px atlas at a 0.44 display scale, 1 line-height): The 520 visible source glyphs form a spare sandwich, plate, cup, handle, and coffee field.

### Named Rules

**The Every Mark Is Language Rule.** Do not replace, mask over, or supplement the glyphs with a visible illustration; every visible mark at the final endpoint must still be a passage character.

**The Selected Excerpt Rule.** Preserve the first three supplied paragraphs, including punctuation and paragraph breaks, with the requested correction from `knite` to `knife`; omit the later dialogue to protect the final field's clarity.

## Layout

The screen is one edge-to-edge interaction field sized from the live viewport. In the reading state, the 645-character excerpt uses proportional horizontal and vertical safety margins and automatically reduces its glyph scale only when necessary to keep all 520 non-whitespace characters on screen. Words wrap by measured font advances, paragraphs receive a modest first-line indent, and the completed block is shifted as a unit to center vertically. Line setting remains conventionally left-aligned; centering applies to the block's vertical position, not to individual lines.

The transformation's propagation origin is the actual lower-right corner of the laid-out passage bounds, not the viewport corner. From that anchor, the disturbance travels diagonally upward and left through the block. This keeps the motion attached to the typography across responsive sizes and makes the page appear to loosen from its final line rather than react to an invisible screen-edge control.

The still life fits its sampled content into a centered box occupying at most 90% of the viewport width and 70% of its height. Preserve the relationship visible in the approved release: the plate is tightened toward the left around the rectangular, diagonally split sandwich, leaving an unmistakable warm-paper gap before the broad coffee cup at the upper right. The cup must read through its rim, wide body, side handle, and coffee surface rather than collapsing into an ambiguous vertical cluster; it has no steam.

**The Continuous Fit Rule.** Recompute page layout and image targets from the current width and height; never hard-code a single phone's coordinates or crop the passage to protect a preferred font size.

## Elevation & Depth

Both endpoints are flat ink on paper and use no shadows, borders, gradients, or layered cards. Depth appears only during the transition and is deliberately restrained: traveling glyphs lift through a 48-unit base plus at most 155 movement-scaled units, rotate by no more than 0.055 radians, and soften by at most 24% before settling flat again. The effect should read as slow, gentle ink loosening from paper—not a surge, scatter, or 3D spectacle.

**The Flat Endpoints Rule.** Reading and illustration endpoints must be optically flat; perspective, rotation, and fading exist only in flight.

## Shapes

There are no interface containers or rounded UI surfaces. Shape is produced by a spare distribution of glyphs: a tightened elliptical plate with one outer contour and no inner rim, a rectangular sandwich separated into two triangular halves by a clear diagonal seam, and a broad detached cup silhouette. The sandwich favors edge-led sampling with light, paper-filled interiors; its rectangular outer perimeter and open diagonal gap do the recognition work without dense fill. Two large round tomato curves peek into the seam, making the filling unmistakable. Isolated sampling strays are pruned so the food and crockery do not dissolve into noise. The cup is outline-led rather than mass-filled: warm paper remains visible through its body and handle so the rim, coffee surface, and vessel wall read as separate features. Steam is intentionally absent.

**The Detached Cup Rule.** Keep clear warm-paper space between the plate and the upper-right coffee cup; the cup never sits on, touches, or visually merges with the plate.

**The Paper-Filled Cup Rule.** Build the cup from a sparse glyph outline around intentional paper-filled negative space; do not pack its interior into a solid text column.

**The Cut-Sandwich Rule.** Preserve a rectangular outer silhouette, open a narrow diagonal seam between the two halves, keep the bread interiors light, and use only two generous tomato curves in the seam.

## Components

### Novel Passage Surface

The initial state is the exact first three paragraphs of the supplied passage—645 characters and 520 visible glyphs—with no app controls over it. The block is vertically centered but its lines remain left-aligned. It appears immediately while image sampling completes in the background. The entire surface accepts the vertical scrub gesture and exposes an adjustable accessibility role whose label contains the excerpt.

### Glyph Morph Field

Dragging upward advances the glyphs directly toward the lunch composition; dragging downward restores the page. Progress follows the finger, remains reversible, and snaps to the nearer endpoint on release, with velocity able to complete the direction of travel. A tap may toggle endpoints as a secondary gesture. Glyph-to-target assignment uses a stable seeded sequence so repeated launches and captures produce the same still life.

For Day 001, the full scrub spans 1.08 viewport heights, encouraging an unhurried gesture. Tap-triggered morphs take 4200ms; release settling takes 1900ms with a cubic ease and no spring bounce. Each glyph uses smoothstep motion, with a very low amount of seeded jitter so the diagonal lower-right-to-upper-left wave feels organic but remains essentially ordered and repeatable.

**The Ink-Loosening Rule.** Motion begins at the passage's lower-right bound and travels diagonally up-left with restrained depth and almost no jitter; it must feel slow, gentle, and free of bounce.

Reduced-motion preference removes the animated snap and moves directly to the selected endpoint. Accessibility increment and decrement actions assemble the lunch or restore the passage without requiring a drag, and the announced value distinguishes “Novel passage” from “Lunch illustration.”

### Lunch Still Life

The final state uses the shortened excerpt's 520-glyph count to form one lightly filled rectangular sandwich visibly separated into two diagonal halves on a tightened-left elliptical plate plus a separate broad upper-right coffee cup. The cup is defined by its rim and outer contour, with paper-filled negative space separating a recognizable handle, coffee surface, and body. No steam glyphs appear. The target artwork guides sampling only and is never rendered into the visible composition.

## Do's and Don'ts

### Do:

- **Do** preserve the selected first three paragraphs with the requested `knife` correction as the source of all 520 visible glyphs.
- **Do** center the reading block vertically while keeping every line conventionally left-aligned.
- **Do** keep the page readable at one endpoint and the lunch immediately recognizable at the other.
- **Do** use edge-led sampling and paper-filled interiors to keep both sandwich halves light.
- **Do** keep the cup broad, outline-led, paper-filled, detached, and completely steam-free.
- **Do** tighten the plate to the left so warm paper clearly separates it from the cup.
- **Do** map vertical movement directly and reversibly to morph progress.
- **Do** anchor propagation to the passage bounds' lower-right corner and carry it diagonally upward and left.
- **Do** keep automatic motion slow, cubic, smoothstep-based, and bounce-free, with only very low deterministic jitter.
- **Do** derive placement deterministically and recompute fitting for the current viewport.
- **Do** provide reduced-motion behavior and adjustable accessibility actions with meaningful state labels.

### Don't:

- **Don't** add visible app chrome, gesture instructions, floating buttons, cards, or ornamental frames to Day 001.
- **Don't** render the target mask or introduce non-glyph illustration marks.
- **Don't** restore the later dialogue; its extra density weakens the distilled final image.
- **Don't** horizontally center the passage or center its individual lines.
- **Don't** merge the cup with the plate, fill either sandwich or cup into a dense mass, or omit the cup's rim, body, handle, or coffee.
- **Don't** add steam or any glyph flourish above the cup.
- **Don't** add accent colors, shadows, gradients, or decorative typefaces that weaken the quiet ink-on-paper world.
- **Don't** launch the wave from the viewport corner, add spring bounce, or exaggerate depth, rotation, fading, or randomness.
- **Don't** randomize final glyph placement between runs or crop passage content on smaller screens.
