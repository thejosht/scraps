"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type SelectableChipProps = {
  children: ReactNode;
  className?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  selected?: boolean;
};

export function SelectableChip({
  children,
  className = "",
  onClick,
  selected = false,
}: SelectableChipProps) {
  return (
    <button
      aria-pressed={selected}
      className={[
        "inline-flex min-h-10 items-center justify-center rounded-full border px-3.5 py-2",
        "text-sm font-medium transition duration-200 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
        selected
          ? "border-[rgb(217_164_65/0.42)] bg-[rgb(217_164_65/0.16)] text-text-primary shadow-[0_8px_18px_rgb(217_164_65/0.12)]"
          : "border-border bg-surface text-text-secondary hover:border-primary-accent hover:bg-surface-warm hover:text-text-primary",
        className,
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
