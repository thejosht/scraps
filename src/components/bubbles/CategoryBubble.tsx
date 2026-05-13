"use client";

import type { ButtonHTMLAttributes } from "react";

type CategoryBubbleProps = {
  className?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  selected?: boolean;
  subtitle?: string;
  title: string;
};

export function CategoryBubble({
  className = "",
  onClick,
  selected = false,
  subtitle,
  title,
}: CategoryBubbleProps) {
  return (
    <button
      aria-pressed={selected}
      className={[
        "flex min-h-28 w-full flex-col justify-between rounded-card border p-4 text-left",
        "transition duration-200 ease-out",
        "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
        selected
          ? "border-primary-accent bg-surface-warm shadow-[0_16px_36px_rgb(232_93_63/0.14)]"
          : "border-border bg-surface shadow-[0_12px_30px_rgb(31_31_31/0.05)] hover:border-clay-accent hover:bg-surface-warm",
        className,
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span className="text-base font-semibold text-text-primary">{title}</span>
      {subtitle ? (
        <span className="mt-3 text-sm leading-5 text-text-secondary">
          {subtitle}
        </span>
      ) : null}
    </button>
  );
}
