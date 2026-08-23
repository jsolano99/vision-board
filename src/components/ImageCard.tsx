"use client";

import Image from "next/image";
import { useRef } from "react";
import { CATEGORY_META } from "@/lib/categories";
import { BoardImage, CARD_SIZE } from "@/lib/board";
import { TapIcon, XIcon } from "@/components/icons";

export function ImageCard({
  image,
  showTapHint,
  onMove,
  onCycleCategory,
  onRemove,
}: {
  image: BoardImage;
  showTapHint: boolean;
  onMove: (id: string, x: number, y: number) => void;
  onCycleCategory: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const chipHintClass = showTapHint
    ? "absolute -bottom-7 left-2 pr-4 pb-5"
    : "absolute -bottom-2 left-2";
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  );

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: image.x,
      originY: image.y,
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    onMove(image.id, dragState.current.originX + dx, dragState.current.originY + dy);
  }

  function handlePointerUp() {
    if (!dragState.current) return;
    const snapped = {
      x: Math.round(image.x / 8) * 8,
      y: Math.round(image.y / 8) * 8,
    };
    onMove(image.id, snapped.x, snapped.y);
    dragState.current = null;
  }

  const meta = CATEGORY_META[image.category];

  return (
    <div
      className="group absolute cursor-grab touch-none select-none active:cursor-grabbing"
      style={{
        left: image.x,
        top: image.y,
        width: CARD_SIZE,
        height: CARD_SIZE,
        transform: `rotate(${image.rotation}deg)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-card-line bg-card shadow-[0_14px_28px_-16px_rgba(15,23,42,0.4)]">
        <Image
          src={image.url}
          alt=""
          fill
          sizes={`${CARD_SIZE}px`}
          className="pointer-events-none object-cover"
          draggable={false}
          unoptimized
        />
      </div>

      {/*
        Padding-based hit box: the icon sits in this button's own bottom-right
        padding, so growing the button with pr/pb (rather than letting the
        icon overflow a tightly-sized button) keeps the whole icon inside the
        actual clickable area instead of just its paint area. The pill's
        on-page position is pinned by `left` (unaffected by padding-right)
        and by the compensated `bottom` offset (bottom-2 + pb-5 = bottom-7,
        which cancels padding-bottom's effect on where the pill itself sits).
      */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onCycleCategory(image.id)}
        aria-label={`Category: ${meta.label}. Tap to change.`}
        className={chipHintClass}
      >
        <span
          style={{ backgroundColor: meta.tint, color: meta.tintText }}
          className="block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide shadow-sm"
        >
          {meta.label}
        </span>
        {showTapHint && (
          <TapIcon className="pointer-events-none absolute right-0 bottom-0 h-8 w-8 text-brand drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)] animate-tap-hint" />
        )}
      </button>

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(image.id)}
        aria-label="Remove image"
        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-card text-ink opacity-0 shadow-[0_6px_16px_-6px_rgba(15,23,42,0.4)] transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        <XIcon className="h-3 w-3" />
      </button>
    </div>
  );
}
