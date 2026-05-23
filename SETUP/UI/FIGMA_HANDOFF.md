# Zeemic Marketplace — Figma Handoff

**Date:** May 21, 2026
**Designer:** Zeemic Product Design
**Source canvas:** 25 artboards across 6 sections (Brand, Design System, Marketplace, Dashboards, Overlays, Mobile)

---

## How to import into Figma

The full design lives in **`Zeemic Marketplace.standalone.html`** — a single self-contained HTML file (1.6 MB). Three import paths, from cleanest to lossiest:

### Option 1 · html.to.design plugin (recommended — editable layers)

1. In Figma: **Plugins → Browse plugins → "html.to.design"** → Install.
2. Open the plugin → **Import** → **From file** → drop the standalone HTML.
3. The plugin renders each artboard as a Figma frame with editable text, colors, and auto-layout.
4. Tip: import section-by-section if the file is heavy — pan the canvas to one section, take a screenshot of the area, and use the plugin's *paste from clipboard* mode.

### Option 2 · Per-artboard PNG export

Each artboard has a built-in export menu. Open the canvas, hover over an artboard label, click the `⋯` icon, and choose **Download PNG**. The PNGs are 3× resolution — drag them into Figma as image fills. Best for:
- Sharing comp screenshots in stakeholder reviews
- Building a Figma deck of static reference frames

### Option 3 · Per-artboard HTML export

Same menu, choose **Download HTML**. Each frame becomes a tiny standalone HTML you can hand to engineers as a literal reference for spacing/color/type. Useful in spec docs.

---

## Design tokens — recreating in Figma

To make the imported designs editable with Figma styles, build these token sets in your Figma library first:

### Colors (Figma → Local styles)

**Ink (primary emerald)**
| Token | Hex |
|---|---|
| ink/950 | `#0B0F0D` |
| ink/900 | `#11211A` |
| ink/800 | `#163524` |
| ink/700 | `#1A4D3A` ← **primary** |
| ink/600 | `#2B6A52` |
| ink/500 | `#468B71` |
| ink/300 | `#B5D2C4` |
| ink/100 | `#ECF3EF` |
| ink/50  | `#F4F8F6` |

**Paper**
| Token | Hex |
|---|---|
| paper        | `#F5F1E8` ← primary surface |
| paper-2      | `#EDE7D8` |
| paper-3      | `#E3DBC6` |
| white        | `#FFFFFF` |

**Gold (accent)**
| Token | Hex |
|---|---|
| gold/100 | `#FDF6DF` |
| gold/200 | `#FCEFC4` |
| gold/300 | `#FBE7A5` |
| gold/400 | `#F7D979` |
| gold/500 | `#F2C94C` ← accent |
| gold/700 | `#C9A634` |

**Coral (signal — urgency/errors only)**
| Token | Hex |
|---|---|
| coral/100 | `#FBE0D5` |
| coral/400 | `#EF7B5A` |
| coral/500 | `#E84A1F` |
| coral/600 | `#C73E1D` |

**Border / divider**
| Token | Hex |
|---|---|
| border        | `#DDD7C7` |
| border/strong | `#C5BFB0` |
| border/on-dark | `rgba(245,241,232,0.14)` |

### Type (Figma → Text styles)

**Display — Instrument Serif** (load from Google Fonts)
| Style | Size / Line / Tracking |
|---|---|
| display/4xl | 96 / 91 / -3.5% |
| display/3xl | 72 / 72 / -3% |
| display/2xl | 56 / 58 / -2.5% |
| display/xl  | 44 / 47 / -2.2% |
| display/lg  | 36 / 40 / -2% |
| display/md  | 28 / 32 / -1.5% |
| display/sm  | 22 / 26 / 0 |

**Body — Geist** (load from Google Fonts)
| Style | Size / Line | Weight |
|---|---|---|
| text/2xl | 22 / 30 | 400–500 |
| text/xl  | 18 / 25 | 400–500 |
| text/lg  | 16 / 24 | 400–500 |
| text/md  | 14 / 21 | 400–600 |
| text/sm  | 13 / 19 | 400–600 |
| text/xs  | 12 / 17 | 500–700 |

**Eyebrow** — Geist 11 / 14, uppercase, 0.14em tracking, weight 500, color `fg/muted`.

### Spacing & radii

- **Spacing scale:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 (4 px modular grid).
- **Radii:** 4 / 6 / 10 / 14 / 20 / 28 / 9999. Cards use 14 (radius/lg), buttons use 10 (radius/md), badges use 6 (radius/sm), chips use full pill.
- **Shadows:** mostly subtle. Cards: `0 1 3 rgba(17,33,26,.06)`. Hover lift: `0 12 32 rgba(17,33,26,.10)`.

---

## Logo + favicon

The Z mark is a single connected path. SVG geometry:

```
<svg viewBox="0 0 64 64" fill="none">
  <path d="M10 12 H54 V22 L24 42 H54 V52 H10 V42 L40 22 H10 Z" fill="<ink/700>"/>
  <path d="M44 12 H54 V22 L50 22 Z" fill="<gold/500>"/>
  <path d="M10 42 H20 L10 52 Z" fill="<gold/500>"/>
</svg>
```

Wordmark: the mark + "eemic" set in **Geist Semibold** at ~62% of the mark's height, kerned in tight (-2.5%).
Editorial variant: full word "zeemic" set in **Instrument Serif italic** with a gold dot terminator.

`favicon.svg` is included in the project root.

---

## Component reference

Every artboard maps to a screen with the following components:

- **Header** — Logo + tabs + bell + avatar
- **Sidebar** — User / Business contexts
- **SkillCard** — visual thumbnail + seller + price + dual CTA
- **RecruiterCard** — avatar + quote + specialties + placements
- **JobCard** — company + role + salary + linked recruiter chip
- **BusinessCard** — colored banner + initial mark + verified badge
- **Chip / Badge / Avatar / Rating / Stat** — standard primitives
- **Buttons** — primary (emerald), accent (marigold), secondary (outline), ghost, dark, danger, onDark

All primitives use the tokens above — recreating them in Figma once gives you a full component library that maps 1:1 to the design.

---

## What to ask if you import the bundled HTML

When the plugin imports, it produces flat raster frames per section. To make them editable:

1. Run **Convert to Auto Layout** on every container.
2. Replace placeholder font detection with **Geist** and **Instrument Serif** (both Google Fonts — install once).
3. Swap the inline colors with your Figma color styles using **find & replace color** (e.g. via the "Replace color" plugin) — start with the most common: `#11211A`, `#1A4D3A`, `#F5F1E8`, `#F2C94C`.

Estimated cleanup time: 2–3 hours for full editability across all 25 artboards.

---

## Questions?

- Need PPTX or PDF instead → ask and I'll export.
- Want a specific surface re-cut (e.g. an Intelligence dashboard, or more vertical pages like Products / Projects / Portfolios) → call it out.
- Want Tailwind / CSS variables in code form → all tokens already live in `tokens.css` in the project — copy-paste it into your codebase.
