export type Category =
  | "career"
  | "health"
  | "relationships"
  | "travel"
  | "finance";

export const CATEGORY_ORDER: Category[] = [
  "career",
  "health",
  "relationships",
  "travel",
  "finance",
];

export const CATEGORY_META: Record<
  Category,
  { label: string; color: string; ink: string; tint: string; tintText: string }
> = {
  career: {
    label: "Career",
    color: "var(--cat-career)",
    ink: "#ffffff",
    tint: "var(--cat-career-tint)",
    tintText: "var(--cat-career-text)",
  },
  health: {
    label: "Health",
    color: "var(--cat-health)",
    ink: "#ffffff",
    tint: "var(--cat-health-tint)",
    tintText: "var(--cat-health-text)",
  },
  relationships: {
    label: "Relationships",
    color: "var(--cat-relationships)",
    ink: "#ffffff",
    tint: "var(--cat-relationships-tint)",
    tintText: "var(--cat-relationships-text)",
  },
  travel: {
    label: "Travel",
    color: "var(--cat-travel)",
    ink: "#1c1410",
    tint: "var(--cat-travel-tint)",
    tintText: "var(--cat-travel-text)",
  },
  finance: {
    label: "Finance",
    color: "var(--cat-finance)",
    ink: "#ffffff",
    tint: "var(--cat-finance-tint)",
    tintText: "var(--cat-finance-text)",
  },
};

export function nextCategory(current: Category): Category {
  const i = CATEGORY_ORDER.indexOf(current);
  return CATEGORY_ORDER[(i + 1) % CATEGORY_ORDER.length];
}

const GOAL_COPY: Record<Category, string> = {
  career: "Move toward the role these photos show",
  health: "Build the habit these photos show",
  relationships: "Reconnect with who these photos show",
  travel: "Take the trip these photos show",
  finance: "Hit the number these photos imply",
};

const STEP_COPY: Record<Category, string[]> = {
  career: [
    "List 3 companies or roles these photos point to.",
    "Message one person already working there.",
    "Update your resume for that direction.",
  ],
  health: [
    "Book the specific class or checkup today.",
    "Do the smallest version of it once this week.",
    "Tell one person your goal.",
  ],
  relationships: [
    "Message that person today, not this week.",
    "Propose a real date for the gathering.",
    "Set a reminder to follow up.",
  ],
  travel: [
    "Price the actual trip and write down the number.",
    "Set up a monthly transfer toward it.",
    "Check passport or visa requirements now.",
  ],
  finance: [
    "Turn this into one exact number.",
    "Automate a transfer toward it this week.",
    "Cut one expense that doesn't serve this goal.",
  ],
};

export function stepsFor(category: Category): { goal: string; steps: string[] } {
  return { goal: GOAL_COPY[category], steps: STEP_COPY[category] };
}

export const QUESTION_COPY: Record<Category, string> = {
  career: "What's the actual role, company, or shift these photos represent?",
  health: "What's the specific goal behind these — an event, a number, a habit?",
  relationships: "Who, or what moment, do these photos represent, specifically?",
  travel: "Where do you want to go, and roughly when?",
  finance: "What's the number or milestone these photos represent?",
};

export function personalizedSteps(category: Category): { goal: string; steps: string[] } {
  return stepsFor(category);
}
