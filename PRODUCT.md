# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js (App Router, TypeScript), deployed on Vercel — matches this workspace's `crumbs` app. Needed because Vision Board requires account/session auth, saved board persistence, image storage, and a server-side AI vision call; a static site can't do any of that. Board/account/list persistence: Vercel Postgres (a relational fit for users → boards → images/lists, unlike a flat key-value store). Image storage: Vercel Blob (dragged/uploaded images need durable storage and stable URLs). AI: a vision-capable LLM (e.g. OpenAI GPT-4o) to analyze the assembled board's images and produce goal lists — a text-only model can't see the images.

## Users

Individual users building a personal vision board for their own goals — not a shared/collaborative tool, not built around being viewed by other people.

## Product Purpose

Vision Board lets someone assemble a board of images (dragged or uploaded) the way they'd arrange a physical vision board, then has AI analyze the finished board and turn it into concrete lists or next steps toward the goals those images represent, framed around the year ahead.

## Positioning

Not a generic collage or mood-board maker. The image arrangement is the input, not the output — the product's value is the AI turning a visual collection of aspirations into actionable, structured next steps, rather than just letting someone prettily arrange pictures.

## Operating Context

User creates an account, starts a board, adds images to it by dragging or uploading them, and asks the AI to analyze it. The AI returns lists/next steps tied to what it sees on the board. Boards and their generated lists are saved to the user's account and can be revisited or edited over time.

## Capabilities and Constraints

- Images are added to a board via drag-and-drop or file upload only; clipboard-paste and drag-from-web-page capture are not confirmed.
- AI analysis requires a server-side vision-capable model call (Next.js API route); not achievable as a pure static site.
- Accounts are required — boards, images, and generated lists persist per account across sessions (not a single-session, no-login experience).
- Not yet decided: whether boards/lists can ever be shared with or viewed by anyone besides their owner; whether generated lists can be checked off/tracked over time or are regenerated fresh on each analysis; any free-vs-paid limits on AI analysis calls.

## Brand Commitments

Name is "Vision Board" (working title). Visual world is pinned by the user via reference images (modern health/fitness-app dashboards — a heart-rate measurement app and a step-tracking app): a light neutral canvas with white rounded cards (24-28px radius) and soft diffuse shadows; a single coral-red brand accent for primary actions; a radial progress-ring signature component; five tonal (pastel background, saturated text) category badges; one geometric sans (Plus Jakarta Sans) at varying weight for both display numerals and body/label text, no separate condensed display face. This replaces the prior pin (sports-broadcast/fantasy-draft dashboard, drenched burnt-orange) — superseded 2026-08-23 when the user re-pinned with new references; the old world is evidence of a direction the user tried and moved on from, not an alternate authority. This pin is binding for future visual work on this product, not just the current surface.

## Evidence on Hand

None yet — no assets, copy, or example boards/lists on hand.

## Product Principles

1. The board is a real input, not decoration — the AI's output must visibly respond to what the user actually placed on the board, never generic goal-setting advice.
2. Output is a concrete list of next steps, not sentiment or affirmation.
3. Keep the vision-board metaphor intact — assembling images, not filling out a goals form; the AI layer augments the physical-vision-board ritual rather than replacing it.
4. Never fabricate what's "in" the board — next steps must trace to images actually present, not invented content.
5. Analysis is ambitious-but-doable. Given remaining time in the year and everything else known (pinned images, the user's answers, today's date), output the most ambitious next steps that are actually achievable in that window. Never a fantasy of finishing the whole goal when the calendar makes that impossible, and never a timid step that ignores how much year is left. Example: one day left and the goal is a marathon → "run 10 miles," not "run a marathon" and not "tie your shoes." The named goal can still name the real aspiration; the steps must be the hardest honest path given the calendar.

## Accessibility & Inclusion

No product-specific requirement established beyond baseline: semantic HTML, keyboard-operable input/output, sufficient contrast. Drag-and-drop board interaction will need a non-pointer (keyboard) way to add images — flagged as an open design constraint, not yet solved.
