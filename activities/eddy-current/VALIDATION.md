# Validation record

Validated: 10 July 2026

## Physics preservation

The following blocks were extracted from V12 and V13, whitespace-normalized, hashed, and compared. All were unchanged:

| Physics block | SHA-256 prefix | Result |
|---|---:|---|
| `constants` | `76261976da07` | Unchanged |
| `getTurnScale()` | `9f8b1624ea09` | Unchanged |
| `getCoilParams()` | `9eec7a6227f2` | Unchanged |
| `getSupplyVoltage()` | `80e02a669ad1` | Unchanged |
| `physicsStep()` | `f877fb61222b` | Unchanged |
| `updateSimulation()` | `62e793ec9eb0` | Unchanged |

The V13 changes are in presentation, guided setup, reset semantics, accessibility, responsive layout, and documentation.

## Static and interaction checks

- Inline JavaScript parsed successfully.
- All four investigation tabs were present and selectable.
- **Set up this step** applied the intended mode, ring, and turn configuration with power OFF.
- Changing supply, ring type, or turn count returned power to OFF.
- All six evidence-layer controls were real buttons with `aria-pressed` states.
- The simulator had no external font, script, or stylesheet dependency.
- Canvas setup completed with non-zero dimensions in the DOM harness.
- Tablet and mobile media rules include two-column and one-column investigation layouts, one-column evidence controls on narrow phones, and no forced desktop grid.
- A headless Chromium run completed with no page or console errors.
- Full-page renders were inspected at 1440 x 1000 and 768 x 1024. The desktop apparatus was capped at 550 px high; controls appeared before the apparatus at 1024 x 768, 768 x 1024, and 390 x 844.
- No horizontal overflow was detected at desktop, tablet landscape, tablet portrait, or mobile widths.

## Deterministic model checks

The V13 physics functions were stepped directly with the packaged constants.

| Test | Result | Expected interpretation |
|---|---:|---|
| DC switch-on maximum centre height | 22.50 mm | Brief upward response from a 12.00 mm baseline |
| Steady DC induced e.m.f. | Approximately 0.000 mV | Induced effect decays when flux becomes nearly constant |
| DC switch-off minimum force | -2.02 N | Reversed downward/attractive transient |
| AC complete ring, 1100 turns | 23.13 mm after 2.0 s | Sustained response |
| AC slit ring | 12.00 mm; ring current 0 A | Dominant loop and lift suppressed |
| AC turn comparison | 600: 19.51 mm; 1100: 23.14 mm; 1600: 25.16 mm | Monotonic qualitative comparison |

These numbers verify internal behavior at the packaged settings. They are not calibration targets for a physical apparatus.

## Visual verification

The HTML was rendered and exercised in Chromium at desktop, tablet, and mobile sizes. The teacher guide was rendered to PNG page by page and visually inspected for clipping, overlap, and legibility. A final quick launch in the classroom's target browser remains good practice, especially when using school-managed iPads.
