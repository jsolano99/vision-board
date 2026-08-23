import { CATEGORY_META, CATEGORY_ORDER, Category } from "@/lib/categories";

export function CategoryFilterTabs({
  active,
  onChange,
}: {
  active: Category | "all";
  onChange: (value: Category | "all") => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-1 rounded-full bg-card p-1.5 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.4)]"
      role="tablist"
      aria-label="Filter board by category"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active === "all"}
        onClick={() => onChange("all")}
        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
          active === "all"
            ? "bg-brand text-white"
            : "text-ink-secondary hover:bg-card-sunken"
        }`}
      >
        All
      </button>
      {CATEGORY_ORDER.map((c) => {
        const meta = CATEGORY_META[c];
        const selected = active === c;
        return (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(c)}
            style={selected ? { backgroundColor: meta.color, color: meta.ink } : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              selected ? "" : "text-ink-secondary hover:bg-card-sunken"
            }`}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
