"use client";

import { useRef, useState } from "react";
import { ImageCard } from "@/components/ImageCard";
import { PlusIcon } from "@/components/icons";
import { BoardImage, CARD_SIZE } from "@/lib/board";
import { Category } from "@/lib/categories";
import { fileToResizedDataUrl } from "@/lib/image";

let placementSeed = 0;
function nextSlot(index: number, containerWidth: number) {
  const cols = Math.max(1, Math.floor((containerWidth - 32) / (CARD_SIZE + 20)));
  const col = index % cols;
  const row = Math.floor(index / cols);
  placementSeed = (placementSeed + 1) % 1000;
  const jitter = ((placementSeed % 7) - 3) * 2;
  return {
    x: 16 + col * (CARD_SIZE + 20) + jitter,
    y: 16 + row * (CARD_SIZE + 20) + jitter,
    rotation: ((placementSeed % 9) - 4) * 1.4,
  };
}

export function BoardCanvas({
  images,
  filter,
  showTapHint,
  onImagesAdded,
  onMove,
  onCycleCategory,
  onRemove,
}: {
  images: BoardImage[];
  filter: Category | "all";
  showTapHint: boolean;
  onImagesAdded: (images: BoardImage[]) => void;
  onMove: (id: string, x: number, y: number) => void;
  onCycleCategory: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);

  const visible = filter === "all" ? images : images.filter((i) => i.category === filter);
  const firstImageId = images[0]?.id;

  async function addFiles(files: FileList | File[]) {
    const width = slotRef.current?.getBoundingClientRect().width ?? 480;
    const startIndex = images.length;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const created = await Promise.all(
      imageFiles.map(async (file, i) => {
        const slot = nextSlot(startIndex + i, width);
        const url = await fileToResizedDataUrl(file);
        const created: BoardImage = {
          id: `${Date.now()}-${startIndex + i}-${Math.random().toString(36).slice(2, 7)}`,
          url,
          category: "career",
          ...slot,
        };
        return created;
      })
    );
    if (created.length) onImagesAdded(created);
  }

  return (
    <div
      className="relative min-h-[520px] flex-1 overflow-hidden rounded-[28px] bg-card shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)]"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex items-center justify-between px-6 pt-5">
        <h2 className="text-xl font-bold tracking-tight text-ink">Your Board</h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          + Add Image
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="px-6 pt-1 text-xs text-ink-secondary">
        {images.length === 0 ? (
          <>
            <span className="font-semibold text-ink">Step 1 —</span> add a few images that show
            what you&apos;re working toward.
          </>
        ) : (
          <>
            <span className="font-semibold text-ink">Step 2 —</span> tap each photo&apos;s tag to
            set its category, then analyze.
          </>
        )}
      </p>

      <div ref={slotRef} className="relative m-4 min-h-[420px] rounded-2xl border-2 border-dashed border-canvas-line bg-card-sunken">
        {isDragOver && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-brand bg-brand-tint">
            <span className="text-lg font-bold tracking-tight text-brand-deep">Drop to add</span>
          </div>
        )}

        {images.length === 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full min-h-[420px] w-full flex-col items-center justify-center gap-2 rounded-2xl text-ink-secondary transition-colors hover:text-ink"
          >
            <PlusIcon className="h-7 w-7" />
            <span className="text-sm">Drag photos here, or click to upload</span>
          </button>
        ) : (
          <div className="relative h-full min-h-[420px] w-full">
            {visible.map((img) => (
              <ImageCard
                key={img.id}
                image={img}
                showTapHint={showTapHint && img.id === firstImageId}
                onMove={onMove}
                onCycleCategory={onCycleCategory}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
