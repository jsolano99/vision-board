import { NextRequest, NextResponse } from "next/server";
import { CATEGORY_ORDER, Category } from "@/lib/categories";
import { generateSteps } from "@/lib/generateSteps";
import { getOpenAI } from "@/lib/openai";

type AnalyzeRequestBody = {
  images: { category: Category }[];
  answers?: Partial<Record<Category, string>>;
  descriptions?: Partial<Record<Category, string>>;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AnalyzeRequestBody;

  if (!Array.isArray(body.images) || body.images.length === 0) {
    return NextResponse.json(
      { error: "Add at least one image to the board before analyzing." },
      { status: 400 }
    );
  }

  const counts = new Map<Category, number>();
  for (const image of body.images) {
    counts.set(image.category, (counts.get(image.category) ?? 0) + 1);
  }
  const categoriesPresent = CATEGORY_ORDER.filter((c) => counts.has(c));

  const results = await Promise.all(
    categoriesPresent.map(async (category) => {
      const generated = await generateSteps(
        category,
        counts.get(category)!,
        body.descriptions?.[category],
        body.answers?.[category]
      );
      return { category, count: counts.get(category)!, ...generated };
    })
  );

  if (!getOpenAI()) {
    await new Promise((resolve) => setTimeout(resolve, 900));
  }

  return NextResponse.json({ results });
}
