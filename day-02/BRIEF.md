# Day 002 — Mobile

## Scope

- Visitor mode: Experience. A viewer encounters one full-screen kinetic artwork on an iPhone and explores it through direct touch.
- Job: make a digital mobile feel delicate, interconnected, and materially believable without adding visible interface controls.
- Approved direction: composition A from `.impeccable/mocks/day-02-a.png`, modified with a shorter top arch.
- Memorable moment: catching one small shape transfers momentum into both rods, wakes neighboring weights, and reveals that shape's quiet chime.

## Interaction

- The mobile breathes continuously with restrained yaw and sway.
- Six shapes are independently draggable and flickable. Visible dimensions range from 28 to 100 points; touch targets are at least 56 points.
- Touch-down gives the connected rods a small pendulum nudge before any drag begins.
- Tethers follow the finger. Release velocity determines the settling impulse and the strength of a second chime.
- Each shape family owns a distinct locally synthesized bell tone and a soft haptic.
- Reduce Motion removes idle rotation and shortens settling. The device silent switch is respected.

## Composition inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Field | Edge-to-edge warm paper with no chrome | Native view |
| Primary rod | Short, asymmetric bowed line in the upper third | SVG path |
| Secondary rod | Fine straight rod offset left | Native view |
| Suspension | Hairline warm-gray threads that follow dragged weights | Animated native views |
| Weights | Clay circle, linked charcoal dots, cobalt semicircle, bone crescent, clay pebble, cobalt star | Native views and SVG |
| Motion | Slow shared yaw plus linked pendulum impulses | Reanimated |
| Sound | Six short, quiet, synthetic bell partials | Local WAV assets through Expo Audio |

## Boundaries

- Portrait iPhone prototype; responsive fitting preserves the whole sculpture while inverse-scaling its weights and hit areas so their 28–100 point visual range and 56-point targets survive on shorter screens.
- No title, instructions, controls, cards, navigation, shadows, gradients, glass, or photographic imagery.
- Day 001 assets and routes remain untouched. Expo Router points to `day-02/app`, where the prototype owns its full-screen entry and gesture host.
