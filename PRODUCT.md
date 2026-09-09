# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

Expo and React Native, using the repository's existing Reanimated, Gesture Handler, and Skia stack.

## Users

- Confirmed: the creator is making a daily visual and interaction exploration.
- Inferred for this prototype: viewers encounter it as a short, self-contained mobile artwork and explore it through touch.

## Product Purpose

Day 001 turns a favorite novel passage into an interactive typographic still life. Success means the transformation is both legible as text at one endpoint and immediately recognizable as a diagonally cut sandwich-and-coffee image at the other.

## Positioning

The passage does not disappear behind an illustration: its own individual glyphs physically construct the objects it describes.

## Operating Context

The piece is experienced full-screen on a phone-sized viewport and is intended to be captured as a short artifact for a 100-day creative practice.

## Capabilities and Constraints

- The selected three-paragraph excerpt preserves the supplied wording with the requested correction from `knite` to `knife`; later dialogue is intentionally omitted to keep the glyph field light.
- Vertical drag directly scrubs a deterministic, reversible transformation whose disturbance begins at the passage's lower-right corner and travels diagonally upward and left.
- The final composition contains one rectangular sandwich visibly separated into two diagonal halves, with two clean tomato curves peeking into the cut seam, on a plate defined by one outer contour with no inner rim; a broad, steam-free, low-density cup of coffee sits at the upper right.
- Every final visible mark comes from the passage glyphs; the target image is only a sampling mask.
- The shorter reading block is vertically centered while retaining conventional left-aligned novel typography.

## Brand Commitments

The work is titled “Day 001 — Lunch.” Its tone is quiet, literary, tactile, and observational.

## Evidence on Hand

- The repository contains a working generic text-to-image morph and a Little Prince example.
- The user supplied the complete source passage and a precise interaction/composition brief.
- The previously named generated reference image was not available in this workspace, so a purpose-built mask is used instead.

## Product Principles

- Let the artifact lead; interface chrome should recede.
- Preserve the identity of every glyph throughout the motion.
- Make direct manipulation feel reversible and exact.
- Prefer one finished interaction over additional screens or controls.
- Keep the morph slow and gentle: long travel, restrained depth, and soft settling rather than abrupt scatter or bounce.
