"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type SecondaryButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const secondaryButtonClassName = [
  "inline-flex min-h-12 items-center justify-center rounded-2xl",
  "border border-border bg-surface px-5 text-sm font-semibold text-text-primary",
  "transition duration-200 ease-out",
  "hover:border-primary-accent hover:bg-surface-warm hover:text-primary-accent",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
  "disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-text-muted",
].join(" ");

export function SecondaryButton({
  children,
  className = "",
  disabled = false,
  href,
  onClick,
  type = "button",
}: SecondaryButtonProps) {
  const composedClassName = [secondaryButtonClassName, className].join(" ");

  if (href && !disabled) {
    return (
      <Link className={composedClassName} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={composedClassName}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
