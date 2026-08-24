---
name: Vision Board
description: A calm, modern health-app dashboard grammar applied to personal goals.
colors:
  canvas: "#eef0f4"
  card: "#ffffff"
  card-sunken: "#f4f5f8"
  ink: "#14171f"
  ink-secondary: "#616875"
  brand: "#cd3213"
  brand-deep: "#95240e"
  brand-tint: "#fde8e2"
  cat-career: "#3d5bfd"
  cat-career-tint: "#e8ecff"
  cat-health: "#087737"
  cat-health-tint: "#e3f8ea"
  cat-relationships: "#8a35e0"
  cat-relationships-tint: "#f3e8fd"
  cat-travel: "#e0961a"
  cat-travel-tint: "#fff3db"
  cat-finance: "#c22548"
  cat-finance-tint: "#fde7ec"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "28px"
  pill: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.brand-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  chip-category:
    backgroundColor: "{colors.cat-career-tint}"
    textColor: "{colors.cat-career}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
---

# Design System: Vision Board

## Overview

**Creative North Star: "The Morning Check-In"**

Vision Board's second visual world trades the first world's draft-day broadcast intensity for a calm, modern health/fitness-dashboard register — the vocabulary of a heart-rate or step-tracking app checked first thing in the morning. White rounded cards float on a light neutral canvas; one coral-red accent carries every primary action and the year's radial progress ring; five pastel category badges do the work saturated jersey-tag chips did in the first world, just quieter. This is a genuine redesign, not a polish pass: the user re-pinned with new references (two health/fitness app screenshots) after living with the sports-broadcast world, and this system replaces it outright per the project's redesign rule — the old world is evidence of a direction tried and moved past, not an alternate authority still in force.

The system is deliberately soft where the first was loud, but keeps the same discipline: one committed accent color (not scattered rainbow chrome), one type family carrying every weight and role (no separate display face), and a genuine signature component (the radial year-progress ring, standing in for the reference's BPM gauge) rather than a generic stat-card grid.

**Key Characteristics:**
- Light neutral canvas (`#eef0f4`) with white cards (`#ffffff`), 24-28px radius, soft diffuse shadows — no dark panels anywhere in this world
- One coral-red brand accent (`#cd3213`) for every primary action and the progress ring; never a rainbow of equally-loud CTAs
- Five tonal category badges (pastel background + saturated text of the same hue) — the badge language throughout the product, solid fills reserved for the segmented filter control only
- A single geometric sans (Plus Jakarta Sans) carries every role from big numerals to small labels via weight alone
- A radial progress ring is the one signature device, reserved for the year-countdown; it is not reused as generic decoration elsewhere

## Colors

One committed coral accent, a white/light-gray neutral system, and five fixed tonal category colors.

### Primary
- **Coral** (`#cd3213`): every primary button, the active state of the "Board" nav item (as a tint), and the year-progress ring's filled arc. Chosen dark enough that white button text clears 4.5:1 — the reference's brighter coral reads fine on white cards but fails as button-fill text contrast, so this system's coral sits a step darker.
- **Coral Deep** (`#95240e`): hover/pressed state for primary buttons, and the text color used on coral-tint surfaces (the nav's active "Board" pill).
- **Coral Tint** (`#fde8e2`): the pale wash behind the year ring's empty track and the nav's active-item background.

### Neutral
- **Canvas** (`#eef0f4`): the page background every card floats on.
- **Card** (`#ffffff`): every panel, card, and the nav/filter pill surfaces.
- **Card Sunken** (`#f4f5f8`): nested surfaces inside a card — the dashed drop zone, skeleton loading rows, textareas, disabled buttons.
- **Ink** (`#14171f`) / **Ink Secondary** (`#616875`): primary and secondary text. Secondary is a cool dark gray tuned to clear 4.5:1 on both the canvas and white cards — the reference's lighter placeholder gray was too light for body-sized text and was darkened for this reason, not by category habit.

### Category colors (fixed taxonomy, tonal badges)
- **Career** — solid `#3d5bfd` / tint `#e8ecff` on text `#3346c9`
- **Health** — solid `#087737` / tint `#e3f8ea` on text `#087737` (darkened from a brighter green that failed contrast at badge size)
- **Relationships** — solid `#8a35e0` / tint `#f3e8fd` on text `#7c2fc7`
- **Travel** — solid `#e0961a` with dark ink (`#1c1410`, the one category too light for white text) / tint `#fff3db` on text `#966212`
- **Finance** — solid `#c22548` / tint `#fde7ec` on text `#ad1f40`

### Named Rules
**The One Accent Rule.** Coral is the only color that appears as a *solid, attention-seeking* fill outside the fixed category taxonomy. A new feature reaching for a second "brand" color is a sign the design has drifted.

## Typography

**Display & Body Font:** Plus Jakarta Sans (self-hosted variable font, weight range 200–800; fallback ui-sans-serif, system-ui)

**Character:** One rounded-geometric grotesk carrying the whole system — big extrabold numerals for the H1 and the ring's day-count read as the same family as the smallest uppercase label, differing only in weight and size, matching the reference's homogeneous type system.

### Hierarchy
- **Display** (800, `clamp(2.25rem, 4vw, 3rem)`+, tracking -0.02em): the page H1 and the ring's centered day-count only.
- **Title** (700, 1.125rem–1.25rem): panel headers ("Your Board", "Next Steps").
- **Body** (400–600, 0.875rem–1rem): intro copy, generated next-step text, helper copy, textarea input.
- **Label** (500–600, 0.75rem, tracked slightly wide on uppercase use): category badges, nav items, the ring's "days left" caption. 0.75rem (12px) is this system's floor — nothing renders smaller.

### Named Rules
**The No Second Face Rule.** Every piece of type in this system is Plus Jakarta Sans at some weight. A component reaching for a second family (a mono for "data," a serif for "editorial") has broken the system without a product reason to.

## Layout

Unchanged from the prior world at the structural level: a centered `max-w-6xl` column, header row (H1 + intro left, year ring right), a wrapping segmented filter row, then a two-zone dashboard — board canvas majority-width, next-steps rail fixed at 380px, side-by-side from `lg` up and stacked full-width below it. What changed is materials, not structure: every zone is now a distinct white card on the light canvas rather than a dark panel on a saturated field. On viewports below `md` (768px), mobile is a desktop invitation — the year ring and a short message — not a cramped board.

## Elevation & Depth

Soft and diffuse, the opposite of the first world's tight offset shadows. Every floating surface — the nav pill, the year-ring card, the board canvas, the next-steps rail — carries one large, low-opacity, blurred shadow (`0 20px 40px -28px rgba(15,23,42,0.35)`) that reads as "this card is lifted off the canvas," not as a hard drop shadow. Small in-card elements (image cards, the remove button) get a tighter version of the same treatment. Nothing in this system uses a sharp, high-contrast shadow.

### Named Rules
**The Diffuse-Only Rule.** Every shadow in this system is large-blur/low-opacity. A tight, dark, or hard-edged shadow is off-system regardless of where it's used.

## Shapes

Generously rounded throughout: `28px` for the major cards (board canvas, next-steps rail, the year-ring card), `24px` for the segmented filter and nested containers, `16px`–`12px` for small elements (image cards, badges use full pill radius). Nothing in this system uses a sharp corner.

## Components

### Logo
The nav mark is the mountain-and-ascent lockup (black, transparent PNG), not a letterform monogram. It sits at 32px height beside the "Vision Board" wordmark; on small screens the wordmark hides and the mark carries the name.

### Buttons
- **Shape:** pill (`9999px`)
- **Primary:** coral background, white text, `10px 20px` padding — "+ Add Image", "Analyze Board", "Get Next Steps"
- **Hover / Focus:** background steps to coral-deep; scales up ~2% on hover, ~2% down on active press
- **Disabled:** card-sunken background, ink-secondary text, cursor not-allowed
- **Secondary (wired, not primary):** card-sunken background, ink text, full opacity — "Sign In" (opens the name prompt). After a name is saved, the same pill shows the name and reopens the prompt to change or remove it. No avatar.
- **Muted/inert (not yet wired):** card-sunken background at reduced opacity, ink-secondary text, cursor not-allowed — "Archive." Used only for features that are visually present but not actually functional yet; never styled to look active.

### Chips (category badges)
- **Style:** pill, tonal — pastel category-tint background, saturated category-hued text. This is the only badge style in the system; solid heavy-color chips were retired in this redesign.
- **State:** on a board image, the badge doubles as the category-cycle control (click/tap advances to the next category) and carries the animated tap-cursor icon; elsewhere it's read-only.

### Checklist checkboxes
Square, 20px, 4px radius, 2px border — tighter than the rest of the system so they read as checkboxes, not radio buttons. Unchecked: white fill, card-line border. Checked: coral fill, white CheckIcon. Completing a step uses native `line-through` so the strike follows each wrapped line to the glyph edge, never a full-width overlay. The first time a list appears in a session, the first step of every category plays a one-shot check-then-uncheck demo, staggered ~50ms between sections (skipped when `prefers-reduced-motion`).

### Segmented Filter / Nav
- **Style:** a white pill container holding smaller pill buttons; the active button is a solid fill (coral for "All", the category's own solid color for a specific filter) — the one place in the system solid category color still appears, because it's acting as a segmented control, not a taxonomy label.

### Cards / Containers
- **Corner Style:** `28px` for major panels, `24px` for nested containers, `16px` for board image cards
- **Background:** white for panels, card-sunken for nested rows (drop zone, skeleton rows, textareas)
- **Shadow Strategy:** see Elevation & Depth — one soft, diffuse shadow per floating surface
- **Border:** none by default; a 2px dashed card-line border marks the board's drop zone specifically

### Name prompt
A small popover from the nav's Sign In control — not a full-page account flow. White 24px-radius card, diffuse shadow, first-name field only. Copy is explicit: the name is stored on this device and is not an account. The page H1 becomes `{Name}'s {year} Vision Board` (`{Name}'` when the name already ends in *s*); with no name it stays "Your {year} Vision Board."

### Radial Progress Ring (signature component)
An SVG ring (128px, 11px stroke, round linecap) whose filled arc tracks the fraction of the year elapsed, with the days-remaining count centered in extrabold numerals and a "days left" label beneath. Direct translation of the reference's BPM-measurement gauge: the ring shows *progress*, the number shows the *metric* — never merged into one value.

## Do's and Don'ts

### Do:
- **Do** keep coral as the only solid "loud" accent outside the category taxonomy — category colors stay tonal except in the segmented filter.
- **Do** render every category badge as pastel-background/saturated-text; a solid heavy-fill badge is the retired first-world style.
- **Do** use Plus Jakarta Sans at whatever weight the moment needs; never introduce a second type family.
- **Do** give every floating card the same one-shadow diffuse treatment; never a tight or hard shadow.

### Don't:
- **Don't** reintroduce the first world's dark panels, saturated field background, or condensed display face — that world is retired, not a fallback.
- **Don't** style an unwired feature to look active; mute it like "Archive." Don't invent an avatar or signed-in account chrome for the name prompt.
- **Don't** drop text below 0.75rem (12px) anywhere in the system.
