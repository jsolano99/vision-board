import { NextRequest, NextResponse } from "next/server";
import { Category, CATEGORY_ORDER } from "@/lib/categories";
import { generateSteps } from "@/lib/generateSteps";
import { getCalendarContext } from "@/lib/yearProgress";

type RefineRequestBody = {
  category: Category;
  count: number;
  description?: string;
  answer?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RefineRequestBody;

  if (!body.category || !CATEGORY_ORDER.includes(body.category)) {
    return NextResponse.json({ error: "Unknown life area." }, { status: 400 });
  }

  const generated = await generateSteps(
    body.category,
    body.count ?? 1,
    body.description,
    body.answer,
    getCalendarContext()
  );

  return NextResponse.json(generated);
}
