# Day 002 — Mobile

## Scope

- Visitor mode: Experience. A viewer encounters one full-screen kinetic artwork on an iPhone and explores it through direct touch.
- Job: make a sparse hand-drawn mobile illustration feel delicate and interconnected without adding visible interface controls or simulated realism.
- Approved direction: the two-level topology of composition A, reinterpreted as irregular ink-like curves and tiny abstract color marks.
- Memorable moment: catching one small mark visibly flexes its drawn wire, transfers momentum through the imperfect bars, and reveals its quiet chime.

## Interaction

- The mobile breathes continuously with restrained yaw and sway.
- Six abstract marks are draggable and flickable. The charcoal pebbles and warm-gray stone move as one left-hand thread; the tan paper, apricot drop, and red lozenge move as one continuous right-hand thread. Visible dimensions range from 18 to 56 points; touch targets remain at least 56 points.
- Touch-down gives the connected rods a small pendulum nudge before any drag begins.
- Each continuous tether and every object attached to it follow the finger together. Release velocity determines the settling impulse and the strength of a second chime.
- Each shape family owns a distinct locally synthesized bell tone and a soft haptic.
- Reduce Motion removes idle rotation and shortens settling. The device silent switch is respected.

## Composition inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Field | Edge-to-edge warm ivory with a restrained bright-left, pale-right tonal shift and no chrome | Layered native gradients |
| Primary rod | Short, asymmetric hand-bent arch with uneven curvature | SVG path |
| Secondary rod | Fine, shallow, irregular curve offset left | SVG path |
| Suspension | Slightly bowed hairlines that flex toward dragged weights | Animated SVG paths |
| Weights | Uneven wedge, connected pebbles, long stone, paper tile, drop, and lozenge | Single-color SVG silhouettes |
| Light | Warm ambient wall color without object, rod, or thread shadows | Native gradients |
| Motion | Slow shared yaw plus linked pendulum impulses | Reanimated |
| Sound | Six short, quiet, synthetic bell partials | Local WAV assets through Expo Audio |

## Boundaries

- Portrait iPhone prototype; responsive fitting preserves the whole drawing while inverse-scaling its marks and hit areas so the 18–56 point visuals remain easy to touch.
- No title, instructions, controls, cards, navigation, glass, texture, or shadows.
- Day 001 assets and routes remain untouched. Expo Router points to `day-02/app`, where the prototype owns its full-screen entry and gesture host.
