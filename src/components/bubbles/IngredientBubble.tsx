"use client";

import type { ButtonHTMLAttributes } from "react";

type IngredientBubbleProps = {
  categoryLabel?: string;
  className?: string;
  helperText?: string;
  label: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  selected?: boolean;
};

export function IngredientBubble({
  categoryLabel,
  className = "",
  helperText,
  label,
  onClick,
  selected = false,
}: IngredientBubbleProps) {
  return (
    <button
      aria-pressed={selected}
      className={[
        "group inline-flex min-h-14 min-w-0 flex-col items-start justify-center rounded-full border px-4 py-2.5 text-left",
        "transition duration-200 ease-out",
        "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
        selected
          ? "border-primary-accent bg-primary-accent text-white shadow-[0_14px_28px_rgb(232_93_63/0.20)]"
          : "border-border bg-surface text-text-primary shadow-[0_10px_24px_rgb(31_31_31/0.06)] hover:border-clay-accent hover:bg-surface-warm",
        className,
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {categoryLabel ? (
        <span
          className={[
            "text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
            selected ? "text-white/72" : "text-text-muted",
          ].join(" ")}
        >
          {categoryLabel}
        </span>
      ) : null}
      <span className="truncate text-sm font-semibold">{label}</span>
      {helperText ? (
        <span
          className={[
            "max-w-full truncate text-xs",
            selected ? "text-white/76" : "text-text-secondary",
          ].join(" ")}
        >
          {helperText}
        </span>
      ) : null}
    </button>
  );
}
