# Experiment 7c - Eddy Current Ring

Teacher-ready V13 package for exploring electromagnetic induction, eddy currents, magnetic force, heating, and ring motion.

## Start here

Open `experiment_7c_eddy_current_teacher_ready_v13.html` in a modern browser. It is a self-contained file and does not require a web server, an internet connection, or external fonts.

Use the four investigation tabs in order:

1. Predict
2. DC transient
3. Closed path
4. AC and turns

The **Set up this step** button selects a consistent starting configuration and returns power to OFF. Changing the supply, ring type, or turn count also resets the run and returns power to OFF. This avoids accidental comparisons from different initial states.

## Package contents

- `experiment_7c_eddy_current_teacher_ready_v13.html` - the simulator
- `Experiment_7c_Eddy_Current_Teacher_Guide.pdf` - a three-page lesson guide, observation matrix, assessment prompts, misconceptions, and model limits
- `VALIDATION.md` - physics-preservation and functional QA record

## Suggested classroom use

- Ask students to commit to a prediction before power is switched on.
- Use slow motion for DC switch-on and switch-off.
- Compare signed e.m.f., ring current, force, and height rather than judging from the animation alone.
- Reveal the reasoning chain after students have attempted their own causal explanation.
- Treat the 600, 1100, and 1600 turn settings as a qualitative model comparison, not a calibration for every physical coil.

## Interface changes from V12

- Added a four-step predict-observe-compare-explain investigation path.
- Kept controls before the apparatus on tablet and narrower laptop layouts.
- Made overlay controls keyboard-accessible buttons with visible focus and pressed states.
- Made setup changes reset to a clear power-off baseline.
- Replaced external font loading with an offline-safe system font stack.
- Added signed flux and e.m.f. readouts, clearer labels, reduced-motion support, and accessible canvas descriptions.
- Preserved the V12 constants and core physics functions exactly.

## Physics model at a glance

The simulator uses coupled lumped circuits with position-dependent mutual inductance. It models signed induced e.m.f., ring current, vertical magnetic force, gravity, mechanical damping, and qualitative I-squared-R heating. The slit ring is treated as open for the dominant loop. AC force is smoothed for the ring's slower mechanical response.

See the teacher guide for the equations, intended observations, misconceptions, and limitations.
