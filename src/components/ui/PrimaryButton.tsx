"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type PrimaryButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const primaryButtonClassName = [
  "inline-flex min-h-12 items-center justify-center rounded-2xl",
  "bg-primary-accent px-5 text-sm font-semibold text-white",
  "shadow-[0_12px_26px_rgb(232_93_63/0.22)]",
  "transition duration-200 ease-out",
  "hover:bg-primary-accent-dark hover:shadow-[0_14px_30px_rgb(201_72_50/0.20)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
  "disabled:cursor-not-allowed disabled:bg-clay-accent/45 disabled:text-white/75 disabled:shadow-none",
].join(" ");

export function PrimaryButton({
  children,
  className = "",
  disabled = false,
  href,
  onClick,
  type = "button",
}: PrimaryButtonProps) {
  const composedClassName = [primaryButtonClassName, className].join(" ");

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
