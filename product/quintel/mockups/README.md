# Quintel — Screen Wireframes

Low-fidelity, static-HTML wireframes of the Quintel v1 screens. Grayscale and schematic by design — the goal is **layout, flow, and the "why-everywhere" signature**, not visual polish. Synthetic but internally-consistent data throughout (fictional lender **Cornerstone Capital**, 220-deal book).

Companion to the UX framework: [`../quintel-ux-framework-2026-07-01.md`](../quintel-ux-framework-2026-07-01.md). Absorbs the wins from Alek's live sales mockups (`yourelosingmoney.xyz/quintel-hyland/{rank,timing,underwriting}`) while keeping our spine (Profile/mirror, tuning, the negative/Checks reason).

## Screens

| File | Screen | What it shows |
|---|---|---|
| `index.html` | Launcher | Links + demo arc + tier legend |
| `prospects.html` | **Prospects** (home) | Ranked worklist table · stat block · BLIND↔QUINTEL before/after · woven-in "what changed" digest · net-new fits · down-ranked *Skip* with reason |
| `item-detail.html` | **Item Detail** (the wow) | "Scored against your 220-deal book" · Strengths + Checks tied to their deals · resembles-your-deals · market activity + "reach out, not a prediction" disclaimer · ranking context |
| `profile.html` | **Profile** (the mirror) | Book at a glance · the tunable fit model (weights) · tuning prompt as a question |
| `pipeline.html` | **Pipeline** (track) | Working leads by status (manual v1) · Won/Lost with reason |

## Viewing

Open `index.html` directly, or serve over localhost to click through cleanly (Chrome MCP mangles `file://`):

```bash
cd product/quintel/mockups && python3 -m http.server 8080
# then open http://127.0.0.1:8080/
```

## Design notes

- **Tiers are action instructions** (`Call first` / `Work` / `Skip`), not close-probability — adopted from Alek's mockup.
- **Every row/reason carries its "why"**, tied to Cornerstone's own book (the anti-commodity proof).
- **Wireframe fidelity is intentional.** Next step (if wanted) is pushing Item Detail to higher fidelity — it's the comprehension wow and the screen most worth putting in front of a prospect.
