# Vision Board — Project State

Snapshot of where things stand. See `CLAUDE.md` for durable architecture/conventions, `PRODUCT.md` for the product spec.

## Current state: deployed and working

Live at **https://vision-board-ruby.vercel.app**. Latest deploy includes the goal + short-checklist redesign described below.

### Implemented and working

- Full loop: build a board (drag/drop or upload photos, freeform placement, drag to reposition) → tag each photo's life area via its category pill (5 fixed categories) → "Analyze Board" sends the actual images to GPT-4o vision, which returns a description + one clarifying question per life area present → user answers → "Get Next Steps" calls GPT-4o again with the image description + answer and returns a named goal + a short tactical checklist per category → checkboxes (session-only, not persisted) → a per-category "want this more specific?" input that regenerates just that category's checklist with added context → "Email me this list" (`mailto:`) and copy-to-clipboard export of the whole checklist.
- Year-progress card: radial ring (SVG, fraction of year elapsed) + months/weeks/days-left stat row, all calendar-accurate (not a flat /30 approximation).
- "Weeks in {year}" card: one dot per week of the year, filled for completed weeks, a distinct ringed dot for the current week, with the tagline "Every week checked off brings your vision to life."
- Onboarding: a single animated tap-hint icon (bottom-right of the pill) appears only on the very first photo ever added, and disappears permanently for the session the moment any category pill is clicked (`sessionStorage`-backed).

### Mocked (by design, not a gap to silently "fix")

Both AI calls (`generateSteps()` for the checklist, the vision-analyze route for descriptions/questions) fall back to fixed template copy in `src/lib/categories.ts` whenever `OPENAI_API_KEY` is unset — this is how the app ran before the real key was added, and it's a deliberate resilience path (also useful for cheap local iteration), not something to delete.

## Two visual worlds, in order

1. **"The Draft Room"** (first build): sports-broadcast/fantasy-draft-dashboard aesthetic — drenched saturated burnt-orange field, near-black panels, Anton condensed display face. User-pinned via a reference screenshot.
2. **"The Morning Check-In"** (current, live): light health/fitness-app aesthetic — white cards on a light neutral canvas, soft diffuse shadows, one coral-red accent, Plus Jakarta Sans throughout, tonal pastel category badges, the radial year-ring as the one signature device. User re-pinned via two health-app reference screenshots and explicitly wanted the old world replaced, not blended — `DESIGN.md` was rewritten from scratch (not incrementally) to record this as a genuine redesign, per the project's own redesign convention (old world = evidence of a direction tried and moved past, not standing authority).

## Recent decisions, most recent first

- **Ambitious-but-doable analysis**: PRODUCT.md principle 5 + `generateSteps()` prompt require steps to scale to remaining time in the year. `/api/analyze` and `/api/refine-step` both pass server-computed calendar context (`getCalendarContext()` in `yearProgress.ts` — today's date, days/weeks left) so the model does not guess "now." Push as far as the window allows; never invent finishing the whole goal when the calendar makes that impossible (one day left + marathon → "run 10 miles," not "run a marathon"). Mock templates in `categories.ts` stay date-unaware.
- **Checklist output redesigned**: the model previously returned one long paragraph per category, then a 3-5-item list of full-sentence steps. User feedback: too much text, not scannable, and — a real bug this surfaced — when input was thin, the model's fallback instruction ("say what information you'd need") produced a nonsensical item written in third person about "gathering information from the user" instead of giving the user something to do. Fixed by rewriting `generateSteps()`'s system prompt (`src/lib/generateSteps.ts`) to require: a short named `goal` (5-8 words, rendered as a bold header above the checklist in `StepCard.tsx`) plus exactly 3-4 items, each one short imperative sentence (~12 words), never a meta-instruction about the user. Mock fallback copy in `categories.ts` was shortened to match.
- **Real GPT-4o vision wired in.** User supplied their own OpenAI API key (a fresh one — their original was shared with the `crumbs` project and they'd forgotten it). Stored in `.env.local` and Vercel Production+Preview env vars. Verified end-to-end with real (synthetic but photographic-style) test images producing genuinely image-grounded questions and checklist items, not generic ones.
- **Standing auto-deploy preference established.** User said to always redeploy after changes without being asked; this is saved in Claude's cross-session memory (`~/.claude/projects/.../memory/feedback_vision_board_auto_deploy.md`), not just in this file.
- **Nav honesty fix.** The nav originally showed a fake colored avatar + "Account" label implying a signed-in user, when no auth exists at all. User called this out as reading "vibe-coded." Fixed: both "Sign In" and "Archive" now render identically muted/disabled (`opacity-60`, `cursor-not-allowed`) — present as a preview of a real future feature, never faked as active.
- **Tap-hint icon iterated several times**: started inline-sized inside the pill → enlarged to be clearly bigger than the pill (and in doing so, initially shipped a real bug where the enlarged icon overflowed its own button's clickable box, so part of the visible icon wasn't actually clickable — fixed via padding-based hit-box containment, see CLAUDE.md) → repositioned from top-left to bottom-right of the pill (required reworking which padding edges get added and a compensated anchor offset — the math is non-obvious, worked out and documented inline in `ImageCard.tsx`) → animation smoothed (removed a diagonal-jitter translate, switched to a cleaner scale+ease curve) → scope narrowed from "every image card" to "only the first image ever added," since showing it repeatedly on every card was excessive.
- **Full redesign to "The Morning Check-In."** Chosen deliberately to move away from the sports-dashboard world after living with it; new tokens (`globals.css`) required re-verifying contrast from scratch (the naive port of the reference's brighter coral/green both failed 4.5:1 and were darkened).

## Unresolved / worth watching

- **No accounts or persistence.** Boards, categorized images, checked-off steps, and refine history all reset on page reload. `PRODUCT.md` commits to real accounts eventually (this workspace's `crumbs` project has a working email+password + Redis pattern that could be mirrored) but it hasn't been started here.
- **No cost/rate limiting on the AI calls.** Every "Analyze Board" click is a real GPT-4o vision call, and every "Get Next Steps" / refine click is a real GPT-4o text call — unlike `crumbs`, which has an explicit free-tier + quota system, this app has no guard against runaway usage cost yet.
- Checked-off checklist state and refine-loop results don't survive a reload — same root cause as no-persistence above, called out separately because a user might reasonably expect checkbox state specifically to stick even before full accounts exist.

## Recommended next steps (proposed, not committed to)

- Wire real accounts + persistence (likely mirroring `crumbs`' email+password + Upstash Redis pattern already proven in this workspace).
- Add usage limits on the two AI call sites before real traffic arrives.
- Decide whether boards/checklists can ever be shared with or viewed by anyone besides their owner (explicitly open in `PRODUCT.md`).
- Decide whether generated checklists should be regenerated fresh each analysis or persist/version over time.
