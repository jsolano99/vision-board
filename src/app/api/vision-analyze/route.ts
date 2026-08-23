import { NextRequest, NextResponse } from "next/server";
import { CATEGORY_META, CATEGORY_ORDER, Category, QUESTION_COPY } from "@/lib/categories";
import { getOpenAI } from "@/lib/openai";

type VisionRequestBody = {
  images: { category: Category; dataUrl: string }[];
};

type CategoryInsight = { description: string; question: string };

function mockInsights(categories: Category[]): Record<string, CategoryInsight> {
  const out: Record<string, CategoryInsight> = {};
  for (const category of categories) {
    out[category] = { description: "", question: QUESTION_COPY[category] };
  }
  return out;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as VisionRequestBody;

  if (!Array.isArray(body.images) || body.images.length === 0) {
    return NextResponse.json(
      { error: "Add at least one image to the board before analyzing." },
      { status: 400 }
    );
  }

  const byCategory = new Map<Category, string[]>();
  for (const image of body.images) {
    const list = byCategory.get(image.category) ?? [];
    list.push(image.dataUrl);
    byCategory.set(image.category, list);
  }
  const categoriesPresent = CATEGORY_ORDER.filter((c) => byCategory.has(c));

  const openai = getOpenAI();
  if (!openai) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return NextResponse.json({ categories: mockInsights(categoriesPresent), mocked: true });
  }

  try {
    const content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [];
    for (const category of categoriesPresent) {
      const label = CATEGORY_META[category].label;
      const images = byCategory.get(category)!;
      content.push({ type: "text", text: `Life area: ${label} (${images.length} photo(s))` });
      for (const dataUrl of images) {
        content.push({ type: "image_url", image_url: { url: dataUrl } });
      }
    }
    content.push({
      type: "text",
      text: `Respond ONLY as a JSON object with one key per life area listed above, using exactly these keys where they apply: ${categoriesPresent.join(", ")}.`,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are analyzing photos a user pinned to a personal vision board, grouped by the life area they tagged each photo with. For each life area, return: (1) description — one concrete sentence naming specific things you actually see (setting, people, objects, activity) across that area's photos, never generic language; (2) question — one short, specific clarifying question whose answer would let you give a genuinely personalized next step for that life area. Never invent facts not visible in the photos. Respond ONLY with a JSON object shaped like {\"career\": {\"description\": \"...\", \"question\": \"...\"}, ...} with one key per life area provided.",
        },
        { role: "user", content },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from model");
    const parsed = JSON.parse(raw) as Record<string, Partial<CategoryInsight>>;

    const categories: Record<string, CategoryInsight> = {};
    for (const category of categoriesPresent) {
      const entry = parsed[category];
      categories[category] = {
        description: entry?.description?.trim() || "",
        question: entry?.question?.trim() || QUESTION_COPY[category],
      };
    }

    return NextResponse.json({ categories, mocked: false });
  } catch (err) {
    console.error("vision-analyze failed, falling back to mock questions:", err);
    return NextResponse.json({ categories: mockInsights(categoriesPresent), mocked: true });
  }
}
