# DESIGN.md — KINETIC ORIGIN

Derived from Stage 1 Anti-Slop Design Brief & Google Stitch exploration (`stitch-export/index.html`, exported from `stitched.dev`).

## Surface & Color Tokens (Single Cohesive Light Theme)
- `--bg-canvas`: `#F4F0E8` (Warm Bone primary surface)
- `--bg-elevated`: `#EAE3D7` (Tactile paper card/panel surface)
- `--bg-subtle`: `#E1D8C8` (Hairline dividers & muted pills)
- `--ink-primary`: `#1A1614` (Espresso Ink)
- `--ink-secondary`: `#5C524B` (Roasted Umber body text, WCAG AA+ contrast)
- `--accent-copper`: `#B85028` (Burnt Copper — primary interactive accent)
- `--accent-copper-hover`: `#9B411E` (Deep Copper hover state)
- `--accent-pine`: `#2F4F3E` (Highland Pine — optimal extraction / verified status)

## Typography
- **Display Serif:** `Fraunces` (optical size, expressive editorial display headlines)
- **UI & Body Sans:** `Plus Jakarta Sans` (clean, legible editorial grotesk)
- **Telemetry Mono:** `JetBrains Mono` (`font-variant-numeric: tabular-nums` for timers, EY%, TDS%, prices, coordinates)

## Motion & Accessibility Contract
- Engine: GSAP 3 (`ScrollTrigger`) + Lenis smooth scroll
- GPU-only transitions (`transform`, `opacity`) under 300ms for micro-interactions
- Full runtime toggle (`Full Motion` / `Reduced`) synced with `prefers-reduced-motion`
- Visible `:focus-visible` copper outline on all interactive elements
- Zero `window.alert` — all validation, receipts, and confirmations are inline
