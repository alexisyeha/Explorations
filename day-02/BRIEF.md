# Day 002 — Mobile

## Scope

- Visitor mode: Experience. A viewer encounters one full-screen kinetic artwork on an iPhone and explores it through direct touch.
- Job: make only the wall-shadow of an off-camera mobile feel delicate, dimensional, and interconnected without visible interface controls.
- Approved direction: the two-level topology of composition A, reinterpreted as a softly blurred warm-charcoal projection on an ivory wall.
- Memorable moment: catching one small mark visibly flexes its drawn wire, transfers momentum through the imperfect bars, and reveals its quiet chime.

## Interaction

- Three overlapping wind rhythms give the unseen mobile slow, irregular axial rotation and sway without an obvious repeating loop.
- Six projected shadow marks are draggable and flickable. The two stacked left marks move as one thread; the three stacked right marks move as one continuous thread. Visible dimensions range from 18 to 56 points; touch targets remain at least 56 points.
- Touch-down gives the connected rods a small pendulum nudge before any drag begins.
- Each continuous tether and every object attached to it follow the finger together. Release velocity determines the settling impulse and the strength of a second chime.
- Each shape family owns a distinct locally synthesized bell tone and a soft haptic.
- Reduce Motion removes idle rotation and shortens settling. The device silent switch is respected.

## Composition inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Field | Edge-to-edge warm ivory with a restrained bright-left, pale-right tonal shift and no chrome | Layered native gradients |
| Primary rod | Soft projected shadow of a short, asymmetric hand-bent arch | Blurred SVG path |
| Secondary rod | Soft projected shadow of a fine, shallow irregular curve | Blurred SVG path |
| Suspension | Faint projected hairlines that flex toward dragged weights | Animated blurred SVG paths |
| Weights | Shadow masks for wedge, connected pebbles, long stone, paper tile, drop, and lozenge | Warm-charcoal SVG silhouettes |
| Light | Bright warm wall receiving one offset mobile projection | Native gradients and bounded blur |
| Motion | Layered irregular wind rotation plus linked pendulum impulses | Reanimated |
| Sound | Six short, quiet, synthetic bell partials | Local WAV assets through Expo Audio |

## Boundaries

- Portrait iPhone prototype; responsive fitting preserves the whole drawing while inverse-scaling its marks and hit areas so the 18–56 point visuals remain easy to touch.
- No visible source mobile, title, instructions, controls, cards, navigation, glass, or texture; only its shadow projection enters the viewport.
- Day 001 assets and routes remain untouched. Expo Router points to `day-02/app`, where the prototype owns its full-screen entry and gesture host.
