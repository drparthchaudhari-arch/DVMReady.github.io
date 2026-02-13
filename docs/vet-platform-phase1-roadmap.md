# Vet Platform Phase 1 Roadmap

Last updated: February 13, 2026

## Implemented now

- Isolated route architecture for menu flows:
  - `tools/*` for tools
  - `reference/*` for references
  - `study/navle/*` for NAVLE study paths
- Homepage updated with:
  - Full tools list (available + planned)
  - Full references list (clickable, available + planned)
  - NAVLE links routed through NAVLE paths
- NAVLE hierarchy implemented:
  - Main: `study/navle/`
  - Submenu: `study/navle/topics/`, `study/navle/practice/`, `study/navle/comprehensive/`
  - Sub-submenu: `study/navle/practice/case-studies/`
  - Topic-specific nested routes:
    - `study/navle/topics/emergency-critical-care/`
    - `study/navle/topics/canine-feline-chf/`
- Citation mapping centralized in `reference/index.html` with status tags and links.

## Planned next

- Full emergency drug engine and tiered calculator logic (clinic/pro/student variants).
- Drug data model expansion with citation metadata and validation tests.
- CRI, anesthesia, fluid, and nutrition formula engines with unit tests.
- Shared disclaimer and citation component injection on every calculator page.
- Progressive enhancement for mobile desktop-view request behavior with QA matrix.

## Guardrails

- Keep category boundaries strict: avoid mixing tools routes into NAVLE menu paths.
- Keep reference list centralized and linked from all clinical pages.
- Any new advanced calculator should ship with: formula tests, clear citation source, and safety disclaimer.
