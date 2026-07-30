@import "tailwindcss";

:root {
  --ink: #eff7ff;
  --muted: #8fa4b7;
  --faint: #53677a;
  --cyan: #62e6ef;
  --amber: #ffc56b;
  --red: #ff607e;
  --green: #67e5b1;
  --panel: rgba(7, 14, 23, 0.82);
  --line: rgba(142, 185, 214, 0.18);
  --display: "Arial Narrow", "Roboto Condensed", Impact, sans-serif;
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

* { box-sizing: border-box; }
html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #02060b; color: var(--ink); }
body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
button, input { font: inherit; }
button { color: inherit; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

.game-shell {
  position: relative;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
  overflow: clip;
  overflow-anchor: none;
  overscroll-behavior: none;
  background:
    radial-gradient(circle at 72% 32%, rgba(22, 78, 108, 0.22), transparent 32%),
    radial-gradient(circle at 36% 85%, rgba(54, 37, 110, 0.18), transparent 34%),
    #02060b;
}

.space-stage { position: absolute; inset: 0; z-index: 2; }
.space-canvas { display: block; width: 100%; height: 100%; cursor: crosshair; touch-action: none; }
.nebula { position: absolute; z-index: 1; width: 42vw; height: 42vw; border-radius: 50%; filter: blur(70px); opacity: .16; pointer-events: none; }
.nebula-one { right: 4vw; top: 4vh; background: #1c9bc1; }
.nebula-two { left: 30vw; bottom: -26vw; background: #6652c4; }
.hud {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  grid-template-rows: 70px minmax(0, 1fr) 80px;
  gap: 12px;
  padding: 18px;
  pointer-events: none;
  transition: opacity .6s ease;
}
.hud-hidden { opacity: 0; }
.topbar, .panel, .launch-callout, .arena-shell, .space-stage, .space-canvas, .arena-panel-button, .panel-scrim { pointer-events: auto; }

.topbar {
  position: relative;
  min-width: 0;
  height: 100%;
  display: grid;
  grid-template-columns: 250px minmax(460px, 1fr) 280px;
  align-items: center;
  gap: 18px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  background: rgba(5, 11, 18, .74);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, .2);
}

.topbar::before, .panel::before {
  content: "";
  position: absolute;
  top: -1px; left: -1px;
  width: 34px; height: 3px;
  background: var(--cyan);
}

.brand { display: flex; align-items: center; gap: 12px; }
.brand-mark {
  display: grid; place-items: center;
  width: 44px; height: 44px;
  border: 1px solid rgba(98, 230, 239, .48);
  transform: rotate(45deg);
  background: rgba(98, 230, 239, .09);
}
.brand-mark span { transform: rotate(-45deg); font-family: var(--display); font-size: 14px; color: var(--cyan); }
.brand p, .brand strong { margin: 0; }
.brand p { color: var(--cyan); font-family: var(--display); font-size: 16px; font-weight: 900; letter-spacing: .13em; }
.brand strong { display: block; margin-top: 1px; color: var(--muted); font-family: var(--mono); font-size: 9px; letter-spacing: .24em; }

.mission-tabs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
.mission-tabs button {
  position: relative;
  display: flex;
  min-width: 0; height: 42px;
  align-items: center; gap: 7px;
  padding: 0 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--faint);
  cursor: pointer;
  text-align: left;
}
.mission-tabs button::after { content: ""; position: absolute; left: 8px; right: 8px; bottom: 1px; height: 1px; background: rgba(113, 139, 160, .18); }
.mission-tabs button.active { border-color: rgba(98, 230, 239, .22); background: rgba(98, 230, 239, .07); color: var(--ink); }
.mission-tabs button.active::after { background: var(--cyan); }
.mission-tabs span { font-family: var(--display); font-size: 18px; font-weight: 900; }
.mission-tabs small { overflow: hidden; font-family: var(--mono); font-size: 7px; line-height: 1.25; letter-spacing: .05em; text-overflow: ellipsis; }
.compact-mission-control { display: none; min-width: 0; align-items: center; justify-content: center; }
.compact-mission-control button {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid var(--line);
  background: rgba(19, 35, 48, .68);
  color: var(--cyan);
  cursor: pointer;
}
.compact-mission-control label { min-width: 0; }
.compact-mission-control select {
  width: min(250px, 27vw);
  height: 34px;
  border: 1px solid var(--line);
  border-right: 0;
  border-left: 0;
  border-radius: 0;
  outline: none;
  background: rgba(5, 13, 21, .9);
  color: var(--ink);
  font-family: var(--mono);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .06em;
  text-align: center;
}

.header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.score-chip { padding-right: 12px; text-align: right; }
.score-chip span, .score-chip strong { display: block; }
.score-chip span { color: var(--faint); font-family: var(--mono); font-size: 8px; letter-spacing: .12em; }
.score-chip strong { color: var(--amber); font-family: var(--display); font-size: 20px; letter-spacing: .04em; }

.icon-button, .compact-button, .reset-button {
  border: 1px solid var(--line);
  background: rgba(18, 30, 42, .72);
  cursor: pointer;
  transition: border-color .2s ease, background .2s ease, transform .2s ease;
}
.icon-button:hover, .compact-button:hover, .reset-button:hover { border-color: rgba(98, 230, 239, .6); background: rgba(35, 68, 82, .62); }
.icon-button:active, .compact-button:active, .reset-button:active, .primary-button:active, .secondary-button:active { transform: translateY(1px); }
.icon-button { display: grid; width: 36px; height: 36px; place-items: center; color: var(--cyan); font-family: var(--display); font-weight: 900; }
.compact-button { height: 36px; padding: 0 12px; color: #c6d7e5; font-family: var(--mono); font-size: 9px; font-weight: 800; letter-spacing: .1em; }
.log-glyph { display: none; }

.play-layout {
  position: relative;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: 292px minmax(0, 1fr) 320px;
  gap: 12px;
}

.arena-shell {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(118, 164, 191, .1);
  background:
    radial-gradient(circle at 70% 35%, rgba(30, 113, 139, .11), transparent 42%),
    rgba(1, 6, 11, .12);
}
.arena-shell::before {
  content: "";
  position: absolute;
  z-index: 4;
  inset: 0;
  border: 1px solid rgba(98, 230, 239, .035);
  pointer-events: none;
}
.arena-panel-controls, .panel-close, .panel-scrim { display: none; }
.field-legend {
  position: absolute;
  z-index: 5;
  right: 12px;
  bottom: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
  border: 1px solid rgba(98, 230, 239, .12);
  background: rgba(3, 11, 18, .62);
  color: var(--faint);
  font-family: var(--mono);
  font-size: 6px;
  letter-spacing: .07em;
  pointer-events: none;
  transition: opacity .2s ease;
}
.field-legend[aria-hidden="true"] { opacity: 0; }
.field-legend span { color: var(--cyan); font-weight: 800; }
.field-legend i, .field-legend b { width: 11px; height: 2px; background: #3c92a1; }
.field-legend b { background: #ffb85d; }

.panel {
  position: relative;
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--line);
  background: var(--panel);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 58px rgba(0, 0, 0, .28);
  scrollbar-width: none;
}
.panel::-webkit-scrollbar { display: none; }
.briefing-panel, .target-panel { width: auto; height: 100%; padding: 17px; overflow-y: auto; }
.panel-kicker { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-family: var(--mono); font-size: 8px; font-weight: 800; letter-spacing: .12em; }
.panel-kicker span { color: var(--cyan); }
.panel-kicker em { color: var(--faint); font-style: normal; }
.system-name { margin: 16px 0 5px; color: var(--amber); font-family: var(--mono); font-size: 9px; font-weight: 700; letter-spacing: .14em; }
.briefing-panel h2 { margin: 0; font-family: var(--display); font-size: clamp(22px, 2vw, 29px); line-height: .98; letter-spacing: .01em; text-transform: uppercase; }
.mission-brief { margin: 12px 0 14px; color: #b1c2d0; font-size: 11px; line-height: 1.58; }
.formula-chip { padding: 9px 10px; border-left: 2px solid var(--cyan); background: rgba(98, 230, 239, .06); color: #d9f5f7; font-family: var(--mono); font-size: 9px; line-height: 1.45; }
.formula-chip span { display: block; margin-bottom: 2px; color: var(--faint); font-size: 7px; letter-spacing: .12em; }
.section-label { margin: 0 0 8px; color: var(--faint); font-family: var(--mono); font-size: 8px; font-weight: 800; letter-spacing: .14em; }
.source-list { margin-top: 16px; }
.source-row { display: grid; grid-template-columns: 12px 1fr auto; align-items: center; gap: 7px; padding: 7px 0; border-bottom: 1px solid rgba(132, 162, 184, .1); }
.source-orb { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 12px currentColor; }
.source-row strong { font-size: 10px; }
.source-row small { color: var(--faint); font-family: var(--mono); font-size: 7px; }
.hint-toggle { display: flex; width: 100%; align-items: center; justify-content: space-between; margin-top: 14px; padding: 9px 0; border: 0; border-top: 1px solid var(--line); background: transparent; color: var(--amber); font-family: var(--mono); font-size: 8px; font-weight: 800; letter-spacing: .12em; cursor: pointer; }
.hint-toggle b { font-size: 16px; }
.hint-copy { margin: 0; padding: 10px; border-left: 2px solid var(--amber); background: rgba(255, 197, 107, .07); color: #d5c7ab; font-size: 10px; line-height: 1.5; }

.target-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.target-heading h3 { margin: 0; font-family: var(--display); font-size: 22px; letter-spacing: .02em; text-transform: uppercase; }
.live-pill { display: inline-flex; align-items: center; gap: 5px; color: var(--green); font-family: var(--mono); font-size: 8px; letter-spacing: .1em; }
.live-pill i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; box-shadow: 0 0 8px currentColor; }
.target-list { display: grid; gap: 7px; margin-top: 14px; }
.target-card {
  position: relative;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) auto;
  align-items: center; gap: 8px;
  min-height: 58px;
  padding: 8px 9px 16px;
  border: 1px solid rgba(127, 153, 173, .15);
  background: rgba(12, 24, 35, .64);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition: border-color .2s ease, background .2s ease, transform .2s ease;
}
.target-card:hover:not(:disabled) { transform: translateX(-2px); border-color: rgba(98, 230, 239, .34); }
.target-card.selected { border-color: rgba(98, 230, 239, .58); background: rgba(42, 97, 110, .2); box-shadow: inset 3px 0 0 var(--cyan); }
.target-card:disabled { cursor: default; opacity: .65; }
.target-id { font-family: var(--display); font-size: 22px; font-weight: 900; }
.target-copy, .target-stats { display: flex; min-width: 0; flex-direction: column; }
.target-copy strong { overflow: hidden; font-size: 10px; white-space: nowrap; text-overflow: ellipsis; }
.target-copy small, .target-stats small { margin-top: 2px; color: var(--faint); font-family: var(--mono); font-size: 7px; letter-spacing: .05em; }
.target-stats { align-items: flex-end; }
.target-stats strong { color: var(--amber); font-family: var(--mono); font-size: 12px; }
.difficulty-tag { position: absolute; left: 47px; bottom: 5px; color: #73889a; font-family: var(--mono); font-size: 6px; letter-spacing: .09em; }
.score-explainer { margin-top: 13px; padding: 11px; border: 1px solid rgba(255, 197, 107, .18); background: rgba(255, 197, 107, .045); }
.score-explainer > div { display: flex; align-items: center; justify-content: space-between; padding: 3px 0; color: #9eb0bf; font-size: 9px; }
.score-explainer strong { color: var(--amber); font-family: var(--mono); font-size: 9px; }

.launch-callout { position: absolute; z-index: 6; left: 50%; bottom: 14px; display: flex; align-items: center; gap: 9px; transform: translateX(-50%); padding: 8px 12px 8px 8px; border: 1px solid rgba(255, 197, 107, .26); background: rgba(8, 14, 20, .76); backdrop-filter: blur(12px); white-space: nowrap; }
.ship-pulse { display: grid; width: 28px; height: 28px; place-items: center; color: var(--amber); animation: pulse 1.6s ease-in-out infinite; }
.launch-callout strong, .launch-callout small { display: block; }
.launch-callout strong { color: var(--amber); font-family: var(--mono); font-size: 8px; letter-spacing: .12em; }
.launch-callout small { margin-top: 2px; color: var(--faint); font-size: 8px; }

.telemetry-bar {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 135px repeat(4, minmax(75px, 1fr)) minmax(260px, 1.35fr) 95px;
  align-items: center; gap: 6px;
  padding: 10px 12px;
}
.status-block { display: grid; grid-template-columns: 12px 1fr; grid-template-rows: auto auto; align-items: center; column-gap: 7px; padding: 7px 10px; border-right: 1px solid var(--line); }
.status-block i { grid-row: 1 / 3; width: 7px; height: 7px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 10px var(--cyan); }
.status-block span, .telemetry-item span { color: var(--faint); font-family: var(--mono); font-size: 7px; letter-spacing: .1em; }
.status-block strong { margin-top: 2px; color: var(--cyan); font-family: var(--display); font-size: 13px; letter-spacing: .06em; }
.status-docked i { background: var(--green); }
.status-docked strong { color: var(--green); }
.status-lost i { background: var(--red); }
.status-lost strong { color: var(--red); }
.telemetry-item { padding: 0 8px; text-align: center; }
.telemetry-item strong { display: inline-block; min-width: 40px; margin: 3px 3px 0; font-family: var(--mono); font-size: 16px; }
.telemetry-item small { color: var(--faint); font-family: var(--mono); font-size: 7px; }
.toggle-cluster { display: flex; align-items: center; justify-content: center; gap: 7px; }
.toggle-cluster label { cursor: pointer; }
.toggle-cluster input { position: absolute; opacity: 0; pointer-events: none; }
.toggle-cluster span { display: inline-block; padding: 6px 7px; border: 1px solid var(--line); color: var(--faint); font-family: var(--mono); font-size: 7px; font-weight: 800; letter-spacing: .07em; transition: .2s ease; }
.toggle-cluster input:checked + span { border-color: rgba(98, 230, 239, .48); background: rgba(98, 230, 239, .09); color: var(--cyan); }
.reset-button { height: 38px; color: #c2d1dd; font-family: var(--mono); font-size: 8px; font-weight: 800; letter-spacing: .08em; }
.reset-button kbd { margin-left: 5px; color: var(--amber); }

.prologue {
  position: absolute; inset: 0; z-index: 100;
  display: grid; place-items: center;
  overflow: hidden;
  background: #01050a;
}
.prologue-art { position: absolute; inset: 0; background: var(--og-image) center / cover no-repeat; transform: scale(1.015); animation: coverDrift 16s ease-in-out infinite alternate; }
.prologue-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(1, 5, 10, .92) 0%, rgba(1, 5, 10, .68) 30%, rgba(1, 5, 10, .08) 67%), linear-gradient(0deg, rgba(1, 5, 10, .36), transparent 45%); }
.skip-intro { position: absolute; z-index: 4; top: 24px; right: 28px; padding: 8px 10px; border: 0; border-bottom: 1px solid var(--faint); background: transparent; color: var(--muted); font-family: var(--mono); font-size: 8px; letter-spacing: .12em; cursor: pointer; }
.story-window { position: relative; z-index: 3; justify-self: start; width: min(430px, calc(100vw - 40px)); margin-left: clamp(20px, 5vw, 84px); padding: 28px 30px; border: 1px solid rgba(116, 174, 204, .24); background: rgba(3, 10, 17, .76); backdrop-filter: blur(16px); text-align: left; animation: storyEnter 1.1s cubic-bezier(.2, .75, .2, 1) both; }
.story-window::before, .story-window::after { content: ""; position: absolute; width: 40px; height: 40px; border-color: var(--cyan); }
.story-window::before { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
.story-window::after { right: -1px; bottom: -1px; border-right: 2px solid; border-bottom: 2px solid; }
.eyebrow { margin: 0; color: var(--cyan); font-family: var(--mono); font-size: 9px; font-weight: 800; letter-spacing: .2em; }
.story-window h1 { margin: 12px 0; font-family: var(--display); font-size: clamp(36px, 4vw, 52px); line-height: .86; letter-spacing: -.015em; }
.story-copy { display: grid; gap: 7px; max-width: 390px; margin: 17px 0; color: #b7c6d2; font-size: 11px; line-height: 1.5; }
.story-copy p { margin: 0; animation: copyRise .8s ease both; }
.story-copy p:nth-child(1) { animation-delay: .4s; }
.story-copy p:nth-child(2) { animation-delay: .7s; }
.story-copy p:nth-child(3) { animation-delay: 1s; }
.role-stamp { display: flex; align-items: center; justify-content: flex-start; gap: 12px; margin: 16px 0; }
.role-stamp span { color: var(--faint); font-family: var(--mono); font-size: 8px; letter-spacing: .12em; }
.role-stamp strong { color: var(--amber); font-family: var(--display); font-size: 20px; letter-spacing: .08em; }

.primary-button, .secondary-button { min-height: 44px; padding: 0 18px; font-family: var(--mono); font-size: 9px; font-weight: 900; letter-spacing: .08em; cursor: pointer; transition: transform .2s ease, filter .2s ease; }
.primary-button { border: 1px solid #ffd18a; background: var(--amber); color: #11161c; box-shadow: 0 8px 28px rgba(255, 197, 107, .12); }
.primary-button:hover { filter: brightness(1.08); }
.primary-button span { margin-left: 10px; }
.secondary-button { border: 1px solid var(--line); background: rgba(24, 39, 52, .7); color: #c7d5df; }
.begin-button { width: 100%; }

.prologue-craft { position: absolute; z-index: 2; left: -140px; top: 23%; width: 110px; height: 30px; animation: craftCross 10s ease-in-out infinite; }
.craft-body { position: absolute; right: 0; top: 7px; width: 75px; height: 16px; border-radius: 80% 20% 20% 80%; background: #d8e4e8; transform: skewX(-18deg); box-shadow: inset -16px 0 0 #596a77; }
.craft-body::after { content: ""; position: absolute; right: 24px; bottom: -10px; width: 28px; height: 13px; background: #8799a4; clip-path: polygon(0 0, 100% 80%, 20% 100%); }
.craft-window { position: absolute; z-index: 2; right: 11px; top: 10px; width: 13px; height: 8px; border-radius: 50% 70% 40% 50%; background: #61e9f1; box-shadow: 0 0 12px #61e9f1; }
.craft-flame { position: absolute; left: 14px; top: 10px; width: 32px; height: 11px; background: linear-gradient(90deg, transparent, #ff8a5c, #ffe297); clip-path: polygon(0 50%, 100% 0, 100% 100%); filter: blur(1px); animation: flame .18s ease-in-out infinite alternate; }
.prologue-caption { position: absolute; z-index: 3; bottom: 18px; left: clamp(20px, 5vw, 84px); margin: 0; color: #7990a2; font-family: var(--mono); font-size: 7px; letter-spacing: .28em; white-space: nowrap; }

.modal-backdrop { position: absolute; inset: 0; z-index: 70; display: grid; place-items: center; padding: 24px; background: rgba(1, 5, 9, .82); backdrop-filter: blur(14px); }
.result-card, .manifest-card, .guide-card { position: relative; width: min(560px, 100%); max-height: min(760px, calc(100vh - 48px)); overflow: auto; padding: 30px; border: 1px solid rgba(139, 187, 215, .22); background: #08131e; box-shadow: 0 28px 100px rgba(0, 0, 0, .56); animation: modalEnter .35s cubic-bezier(.15, .75, .25, 1) both; }
.result-card { text-align: center; }
.result-card::before, .manifest-card::before, .guide-card::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: var(--cyan); }
.result-card.failure::before { background: var(--red); }
.result-emblem { display: grid; width: 66px; height: 66px; place-items: center; margin: 18px auto 14px; border: 1px solid currentColor; border-radius: 50%; color: var(--green); font-family: var(--display); font-size: 32px; box-shadow: inset 0 0 28px rgba(103, 229, 177, .08); }
.failure .result-emblem { color: var(--red); }
.result-card h2, .manifest-card h2, .guide-card h2 { margin: 7px 0 9px; font-family: var(--display); font-size: 30px; line-height: 1; text-transform: uppercase; }
.result-card > p:not(.eyebrow) { max-width: 400px; margin: 0 auto; color: var(--muted); font-size: 12px; line-height: 1.55; }
.result-score { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 22px; border: 1px solid var(--line); }
.result-score div { padding: 14px 8px; border-right: 1px solid var(--line); }
.result-score div:last-child { border-right: 0; }
.result-score span, .result-score strong { display: block; }
.result-score span { color: var(--faint); font-family: var(--mono); font-size: 7px; letter-spacing: .08em; }
.result-score strong { margin-top: 5px; color: var(--amber); font-family: var(--display); font-size: 23px; }
.result-actions { display: grid; grid-template-columns: 1fr 1.25fr; gap: 9px; margin-top: 20px; }
.manifest-card { width: min(920px, 100%); }
.guide-card { width: min(620px, 100%); }
.modal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.manifest-score { display: flex; align-items: center; justify-content: space-between; margin: 22px 0 12px; padding: 12px 14px; border-left: 2px solid var(--amber); background: rgba(255, 197, 107, .06); }
.manifest-score span { color: var(--muted); font-family: var(--mono); font-size: 8px; letter-spacing: .12em; }
.manifest-score strong { color: var(--amber); font-family: var(--display); font-size: 26px; }
.empty-log { display: grid; min-height: 230px; place-items: center; align-content: center; color: var(--muted); text-align: center; }
.empty-log span { color: var(--cyan); font-size: 34px; }
.empty-log p { margin: 10px 0 3px; font-weight: 700; }
.empty-log small { color: var(--faint); }
.log-table { overflow-x: auto; border: 1px solid var(--line); }
.log-row { display: grid; min-width: 760px; grid-template-columns: 1.4fr 1.25fr 1.3fr .7fr .6fr; gap: 12px; align-items: center; padding: 11px 12px; border-bottom: 1px solid rgba(129, 161, 183, .1); color: var(--muted); font-size: 9px; }
.log-head { background: rgba(86, 131, 156, .08); color: var(--faint); font-family: var(--mono); font-size: 7px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; }
.log-row b { color: var(--amber); font-family: var(--mono); }
.guide-steps { display: grid; gap: 10px; margin: 22px 0; }
.guide-steps > div { display: grid; grid-template-columns: 44px 1fr; gap: 13px; align-items: center; padding: 12px; border: 1px solid var(--line); background: rgba(21, 40, 54, .34); }
.guide-steps span { color: var(--cyan); font-family: var(--display); font-size: 22px; font-weight: 900; }
.guide-steps p { margin: 0; color: var(--muted); font-size: 11px; line-height: 1.5; }
.guide-steps strong { color: var(--ink); }
.guide-card > .primary-button { width: 100%; }

@keyframes pulse { 0%, 100% { opacity: .55; transform: scale(.85); } 50% { opacity: 1; transform: scale(1.08); } }
@keyframes starDrift { from { transform: translate(0, 0); } to { transform: translate(70px, 40px); } }
@keyframes coverDrift { from { transform: scale(1.015) translate3d(0, 0, 0); } to { transform: scale(1.055) translate3d(-.6%, -.5%, 0); } }
@keyframes storyEnter { from { opacity: 0; transform: translateY(24px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes copyRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes craftCross { 0% { transform: translate(-10vw, 18vh) scale(.65); opacity: 0; } 14% { opacity: .8; } 76% { opacity: .7; } 100% { transform: translate(125vw, -16vh) scale(1.25); opacity: 0; } }
@keyframes flame { from { transform: scaleX(.78); opacity: .7; } to { transform: scaleX(1.12); opacity: 1; } }
@keyframes modalEnter { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

/* Compact fine-pointer laptops: the arena is unobstructed until a drawer is requested. */
.viewport-compact .hud {
  grid-template-rows: 56px minmax(0, 1fr) 64px;
  gap: 8px;
  padding: 10px;
}
.viewport-compact .topbar {
  grid-template-columns: 210px minmax(260px, 1fr) 230px;
  gap: 10px;
  padding: 6px 9px;
}
.viewport-compact .brand-mark { width: 36px; height: 36px; }
.viewport-compact .brand p { font-size: 14px; }
.viewport-compact .brand strong { font-size: 7px; }
.viewport-compact .mission-tabs { display: none; }
.viewport-compact .compact-mission-control { display: flex; }
.viewport-compact .score-chip span { font-size: 6px; }
.viewport-compact .score-chip strong { font-size: 16px; }
.viewport-compact .play-layout { grid-template-columns: minmax(0, 1fr); gap: 0; }
.viewport-compact .arena-shell { grid-column: 1; grid-row: 1; }
.viewport-compact .briefing-panel,
.viewport-compact .target-panel {
  position: absolute;
  z-index: 32;
  top: 0;
  bottom: 0;
  width: min(360px, 42vw);
  height: 100%;
  max-height: none;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition: transform .28s ease, opacity .2s ease, visibility .28s;
}
.viewport-compact .briefing-panel { left: 0; transform: translateX(calc(-100% - 12px)); }
.viewport-compact .target-panel { right: 0; transform: translateX(calc(100% + 12px)); }
.viewport-compact .panel-open { visibility: visible; opacity: 1; pointer-events: auto; transform: translateX(0); }
.viewport-compact .panel-close,
.viewport-touch .panel-close {
  position: absolute;
  z-index: 2;
  top: 8px;
  right: 8px;
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid var(--line);
  background: #0b1721;
  color: var(--cyan);
  cursor: pointer;
}
.viewport-compact .panel-scrim,
.viewport-touch .panel-scrim {
  position: absolute;
  z-index: 29;
  inset: 0;
  display: block;
  border: 0;
  background: rgba(1, 5, 9, .56);
  backdrop-filter: blur(4px);
}
.viewport-compact .arena-panel-controls,
.viewport-touch .arena-panel-controls { display: block; }
.arena-panel-button {
  position: absolute;
  z-index: 20;
  top: 50%;
  display: grid;
  width: 44px;
  min-height: 92px;
  place-items: center;
  padding: 7px 4px;
  border: 1px solid rgba(98, 230, 239, .28);
  background: rgba(4, 14, 22, .82);
  color: var(--muted);
  backdrop-filter: blur(12px);
  cursor: pointer;
  transform: translateY(-50%);
}
.arena-panel-button span { font-family: var(--mono); font-size: 6px; letter-spacing: .1em; writing-mode: vertical-rl; }
.arena-panel-button strong { color: var(--cyan); font-family: var(--display); font-size: 16px; }
.mission-button { left: 8px; }
.bases-button { right: 8px; }
.viewport-compact .launch-callout { bottom: 10px; }
.viewport-compact .telemetry-bar {
  grid-template-columns: 118px repeat(4, minmax(68px, 1fr)) minmax(205px, 1.25fr) 72px;
  gap: 2px;
  padding: 6px 8px;
}
.viewport-compact .telemetry-item { padding: 0 3px; }
.viewport-compact .telemetry-item strong { font-size: 13px; }
.viewport-compact .toggle-cluster { gap: 3px; }
.viewport-compact .toggle-cluster span { padding: 5px 4px; font-size: 6px; }
.viewport-compact .reset-button { height: 34px; }

/* Coarse pointers and narrow screens use bottom sheets and safe-area padding. */
.viewport-touch .hud {
  grid-template-rows: 52px minmax(0, 1fr) 64px;
  gap: 7px;
  padding:
    max(8px, env(safe-area-inset-top))
    max(8px, env(safe-area-inset-right))
    max(8px, env(safe-area-inset-bottom))
    max(8px, env(safe-area-inset-left));
}
.viewport-touch .topbar {
  grid-template-columns: auto minmax(150px, 1fr) auto;
  gap: 7px;
  padding: 5px 7px;
}
.viewport-touch .brand { gap: 0; }
.viewport-touch .brand-mark { width: 34px; height: 34px; }
.viewport-touch .brand > div:last-child { display: none; }
.viewport-touch .mission-tabs { display: none; }
.viewport-touch .compact-mission-control { display: flex; }
.viewport-touch .compact-mission-control select { width: min(310px, 42vw); }
.viewport-touch .score-chip { display: none; }
.viewport-touch .header-actions { gap: 4px; }
.viewport-touch .icon-button,
.viewport-touch .compact-button { width: 34px; height: 34px; padding: 0; }
.viewport-touch .log-label { display: none; }
.viewport-touch .log-glyph { display: inline; font-size: 7px; }
.viewport-touch .play-layout { grid-template-columns: minmax(0, 1fr); gap: 0; }
.viewport-touch .arena-shell { grid-column: 1; grid-row: 1; }
.viewport-touch .briefing-panel,
.viewport-touch .target-panel {
  position: absolute;
  z-index: 32;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  max-height: min(58%, 430px);
  padding: 16px;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translateY(calc(100% + 12px));
  transition: transform .28s ease, opacity .2s ease, visibility .28s;
}
.viewport-touch .panel-open { visibility: visible; opacity: 1; pointer-events: auto; transform: translateY(0); }
.viewport-touch .arena-panel-button {
  top: auto;
  bottom: 8px;
  width: auto;
  min-width: 108px;
  min-height: 38px;
  grid-auto-flow: column;
  gap: 7px;
  padding: 6px 9px;
  transform: none;
}
.viewport-touch .arena-panel-button span { writing-mode: horizontal-tb; }
.viewport-touch .mission-button { left: 8px; }
.viewport-touch .bases-button { right: 8px; }
.viewport-touch .launch-callout { top: 9px; bottom: auto; }
.viewport-touch .field-legend { top: 54px; right: 8px; bottom: auto; }
.viewport-touch .telemetry-bar {
  grid-template-columns: 104px repeat(4, minmax(62px, 1fr)) minmax(174px, 1.1fr) 60px;
  gap: 1px;
  padding: 5px;
}
.viewport-touch .status-block { padding: 5px; }
.viewport-touch .telemetry-item { padding: 0 2px; }
.viewport-touch .telemetry-item strong { min-width: 30px; font-size: 12px; }
.viewport-touch .toggle-cluster { gap: 2px; }
.viewport-touch .toggle-cluster span { padding: 5px 3px; font-size: 5px; }
.viewport-touch .reset-button { height: 34px; }

@media (max-width: 620px) {
  .viewport-touch .hud { grid-template-rows: 50px minmax(0, 1fr) 60px; gap: 6px; }
  .viewport-touch .topbar { grid-template-columns: 34px minmax(120px, 1fr) 72px; }
  .viewport-touch .compact-mission-control button { width: 28px; }
  .viewport-touch .compact-mission-control select { width: min(170px, 43vw); font-size: 7px; }
  .viewport-touch .briefing-panel,
  .viewport-touch .target-panel { max-height: 68%; padding: 13px; }
  .viewport-touch .target-heading h3 { font-size: 18px; }
  .viewport-touch .target-list { grid-template-columns: repeat(3, 1fr); }
  .viewport-touch .target-card { grid-template-columns: 22px 1fr; gap: 4px; min-height: 68px; padding: 7px; }
  .viewport-touch .target-stats,
  .viewport-touch .difficulty-tag,
  .viewport-touch .target-copy small { display: none; }
  .viewport-touch .target-copy strong { white-space: normal; font-size: 8px; }
  .viewport-touch .score-explainer { display: none; }
  .viewport-touch .arena-panel-button { min-width: 92px; }
  .viewport-touch .launch-callout { max-width: calc(100% - 20px); }
  .viewport-touch .launch-callout small { display: none; }
  .viewport-touch .telemetry-bar { grid-template-columns: 86px 1fr 1fr 112px 48px; }
  .viewport-touch .telemetry-item:nth-of-type(2),
  .viewport-touch .telemetry-item:nth-of-type(3) { display: none; }
  .viewport-touch .toggle-cluster span { min-width: 31px; font-size: 0; text-align: center; }
  .viewport-touch .toggle-cluster span::after { content: attr(data-short); font-size: 5px; }
  .viewport-touch .reset-button kbd { display: none; }
  .story-window { align-self: end; justify-self: center; width: calc(100vw - 24px); max-height: calc(100svh - 70px); margin: 0 0 36px; padding: 20px; text-align: left; }
  .story-window h1 { font-size: 34px; }
  .story-copy { font-size: 9px; }
  .role-stamp { margin: 10px 0; }
  .prologue-shade { background: linear-gradient(0deg, rgba(1, 5, 10, .96) 0%, rgba(1, 5, 10, .5) 60%, rgba(1, 5, 10, .08)); }
  .prologue-caption { display: none; }
  .result-card, .manifest-card, .guide-card { padding: 22px 17px; }
  .result-score { grid-template-columns: 1fr; }
  .result-score div { border-right: 0; border-bottom: 1px solid var(--line); }
  .result-actions { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
