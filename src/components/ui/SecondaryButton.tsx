"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type SecondaryButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export function SecondaryButton({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: SecondaryButtonProps) {
  return (
    <button
      className={[
        "inline-flex min-h-12 items-center justify-center rounded-2xl",
        "border border-border bg-surface px-5 text-sm font-semibold text-text-primary",
        "transition duration-200 ease-out",
        "hover:border-primary-accent hover:bg-surface-warm hover:text-primary-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-text-muted",
        className,
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
