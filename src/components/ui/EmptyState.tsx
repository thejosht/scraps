import type { ReactNode } from "react";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  title: string;
};

export function EmptyState({
  action,
  className = "",
  description,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "rounded-[1.25rem] border border-dashed border-border bg-surface-warm p-5 text-center",
        className,
      ].join(" ")}
    >
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
