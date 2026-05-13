import type { ReactNode } from "react";

type PageHeaderProps = {
  action?: ReactNode;
  className?: string;
  description?: string;
  eyebrow?: string;
  title: string;
};

export function PageHeader({
  action,
  className = "",
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header
      className={[
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      ].join(" ")}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-clay-accent">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-normal text-text-primary sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
