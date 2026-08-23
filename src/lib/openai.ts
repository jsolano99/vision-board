import OpenAI from "openai";

let client: OpenAI | null | undefined;

// undefined = not checked yet, null = no key configured (callers fall back to mock copy)
export function getOpenAI(): OpenAI | null {
  if (client !== undefined) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  client = apiKey ? new OpenAI({ apiKey }) : null;
  return client;
}
