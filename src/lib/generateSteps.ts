import { CATEGORY_META, Category, personalizedSteps } from "@/lib/categories";
import { getOpenAI } from "@/lib/openai";

export type GeneratedSteps = { goal: string; steps: string[] };

const SYSTEM_PROMPT = `You turn one specific goal shown on someone's personal vision board into a short, scannable action checklist.

Think hard about what the person is actually trying to achieve, using everything you're given: the life area, what their pinned photos actually show, and what they told you they want.

Then produce:
- "goal": a short phrase (5-8 words) naming the specific outcome they're working toward — not the life area's name, the actual goal (e.g. "Run a half marathon by April", not "Health goals").
- "steps": exactly 3 to 4 checklist items.

Rules for steps:
- Each step is ONE short, direct action — a single sentence, ideally under 12 words, starting with a verb ("Book...", "Message...", "Price..."). No sub-clauses, no "and" chaining two actions together, no reasoning or caveats attached.
- Simple and doable, not overwhelming — something the person could realistically check off today or this week.
- Reference a specific concrete detail (a name, number, place, date) when you have one, but keep the sentence itself short even then.
- Order steps so earlier ones unblock later ones.
- Write directly as an instruction to the person. Never refer to "the user" or describe what information is missing — if what you're given is thin, still give your best short, concrete starter actions; never make a step about asking the person a question.
- Never invent facts (companies, people, places, prices) that weren't given to you.

Respond ONLY as JSON: {"goal": "...", "steps": ["...", "...", "..."]}`;

export async function generateSteps(
  category: Category,
  count: number,
  description: string | undefined,
  answer: string | undefined
): Promise<GeneratedSteps> {
  const openai = getOpenAI();
  if (!openai) return personalizedSteps(category);

  try {
    const label = CATEGORY_META[category].label;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Life area: ${label} (${count} photo(s) pinned).\nWhat the photos show: ${description || "not analyzed"}.\nWhat the user said they want: ${answer || "no additional context given"}.`,
        },
      ],
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from model");
    const parsed = JSON.parse(raw) as { goal?: unknown; steps?: unknown };
    const steps = Array.isArray(parsed.steps)
      ? parsed.steps.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
      : [];
    const goal = typeof parsed.goal === "string" && parsed.goal.trim() ? parsed.goal.trim() : "";
    if (steps.length === 0 || !goal) return personalizedSteps(category);
    return { goal, steps };
  } catch (err) {
    console.error("step generation failed, falling back to template:", err);
    return personalizedSteps(category);
  }
}
