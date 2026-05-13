"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export function PrimaryButton({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button
      className={[
        "inline-flex min-h-12 items-center justify-center rounded-2xl",
        "bg-primary-accent px-5 text-sm font-semibold text-white",
        "shadow-[0_12px_26px_rgb(232_93_63/0.22)]",
        "transition duration-200 ease-out",
        "hover:bg-primary-accent-dark hover:shadow-[0_14px_30px_rgb(201_72_50/0.20)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent",
        "disabled:cursor-not-allowed disabled:bg-clay-accent/45 disabled:text-white/75 disabled:shadow-none",
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
